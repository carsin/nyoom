import { firebaseAuth, db } from "../firebase-service";
import { writeBatch, collection, query, updateDoc, onSnapshot, orderBy, limit, doc, where, getDocs, serverTimestamp, increment } from 'firebase/firestore';
import { userInfoService } from '../services/UserInfoService';

const defaultAvatar = 'https://ionicframework.com/docs/img/demos/avatar.svg';

class ChatService {
  user: any;

  constructor(user: any) {
    this.user = user;
  }

  setUser(user: any) {
    this.user = user;
  }

  async fetchConversations(conversations, userCache) {
    if (!this.user?.uid) {
      throw new Error("User is not authenticated");
    }

    const conversationsRef = collection(db, 'conversations');
    const q = query(conversationsRef, where('participants', 'array-contains', this.user?.uid));

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const fetchedConversations = await Promise.all(querySnapshot.docs.map(async (doc) => {
        const conversation = { id: doc.id, ...doc.data() };
        const otherUserId = conversation.participants.find(uid => uid !== this.user?.uid);

        // use cached data if available
        let userData = userCache.get(otherUserId) || await fetchAndCacheUserData(otherUserId, userCache);

        return {
          ...conversation,
          recipientUsername: userData?.username,
          recipientAvatarUrl: userData?.avatarUrl,
          lastMessageContent: conversation.lastMessageContent || 'No messages',
          lastMessageTimestamp: conversation.lastMessageTimestamp || '',
          lastMessageSender: conversation.lastMessageSender || ''
        };
      }));


      const sortConversationsByTimestamp = (conversations) => {
        return conversations.sort((a, b) => getTimestampMillis(b) - getTimestampMillis(a));
      };
        conversations.value = sortConversationsByTimestamp(fetchedConversations);
    });

    return unsubscribe;
  }

  async prepareConversation(conversationOrUser, activeConversation, messages) {
    if (!this.user) {
      return { success: false, message: "You are not logged in!" };
    }

    const currentUserUid = this.user.uid;
    let recipientUid;
    let recipientData;
    const isExistingConversation = conversationOrUser.id !== undefined;

    if (isExistingConversation) {
      recipientUid = conversationOrUser.participants.find(uid => uid !== currentUserUid);
      console.log(conversationOrUser.participants);
    } else {
      recipientUid = conversationOrUser.uid;
    }

    try {
      recipientData = await userInfoService.fetchUserData(recipientUid);
    } catch (error) {
      return { success: false, message: "Error fetching recipient data: " + error.message };
    }

    const recipientInfo = {
      avatarUrl: recipientData?.avatarUrl || defaultAvatar,
      username: recipientData?.username || 'Unknown'
    };

    let conversationExists = false;
    let unsubscribe = null;
    if (isExistingConversation) {
      activeConversation.value = {
        ...conversationOrUser,
        recipient: recipientInfo
      };
      // reset unread count
      this.resetUnreadCount(conversationOrUser.id);
      // start listening to messages
      unsubscribe = this.listenToMessages(conversationOrUser.id, messages);
    } else {
      const conversationsRef = collection(db, 'conversations');
      const conversationQuery = query(conversationsRef, where('participants', 'array-contains', currentUserUid));
      const querySnapshot = await getDocs(conversationQuery);

      for (const conversationDoc of querySnapshot.docs) {
        const data = conversationDoc.data();
        if (data.participants.includes(recipientUid)) {
          activeConversation.value = {
            id: conversationDoc.id,
            recipient: recipientInfo,
            ...data
          };
          conversationExists = true;
          break;
        }
      }

      if (!conversationExists) {
        activeConversation.value = {
          participants: [currentUserUid, recipientUid],
          recipient: recipientInfo,
          messages: [],
          unreadCounts: {
            [currentUserUid]: 0,
            [recipientUid]: 0
          }
        };
      }
    }

    return { success: true, unsubscribe };
  }

  async sendMessage(activeConversation, message) {
    if (message.trim() === '') return { success: false, message: 'Message is empty.' };

    const batch = writeBatch(db);
    const timestamp = serverTimestamp();
    const recipientId = activeConversation.value.participants.find(uid => uid !== this.user.uid);
    let conversationRef;

    if (!activeConversation.value.id) {
      // ensure that participants array is defined and contains expected user IDs
      let participants = activeConversation.value.participants;
      if (!participants || participants.length === 0) {
        return { success: false, message: 'Invalid participants data.' };
      }

      let unreadCounts = activeConversation.value.unreadCounts || {};
      participants.forEach(uid => {
        if (uid === recipientId) {
          unreadCounts[uid] = 1;
        } else {
          unreadCounts[uid] = unreadCounts[uid] || 0;
        }
      });

      conversationRef = doc(collection(db, 'conversations'));
      batch.set(conversationRef, {
        participants: participants,
        createdAt: timestamp,
        unreadCounts: unreadCounts,
        lastMessageSender: this.user.uid,
        lastMessageContent: message,
        lastMessageTimestamp: timestamp,
      });
      activeConversation.value.id = conversationRef.id;
    } else {
      conversationRef = doc(db, 'conversations', activeConversation.value.id);
      batch.update(conversationRef, {
        lastMessageSender: this.user.uid,
        lastMessageContent: message,
        lastMessageTimestamp: timestamp,
        [`unreadCounts.${recipientId}`]: increment(1)
      });
    }

    const messagesRef = collection(db, 'conversations', activeConversation.value.id, 'messages');
    const messageDocRef = doc(messagesRef);
    batch.set(messageDocRef, {
      senderId: this.user.uid,
      content: message,
      timestamp: timestamp,
      readStatus: false,
    });

    try {
      await batch.commit();
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  listenToMessages(conversationId: string, messages) {
    const messagesRef = collection(db, 'conversations', conversationId, 'messages');
    const messagesQuery = query(messagesRef, orderBy('timestamp', 'desc'));

    return onSnapshot(messagesQuery, (snapshot) => {
      messages.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      snapshot.docs.forEach(doc => {
        if (doc.data().senderId !== this.user?.uid && !doc.data().readStatus) {
          const messageRef = doc.ref;
          updateDoc(messageRef, { readStatus: true });
        }
      });
    }, (error) => {
      console.error("Error fetching messages: ", error);
    });
  }


  async searchUsers(username: string) {
    if (username.trim() === '') return [];

    const usersRef = collection(db, 'users');
    const userQuery = query(
      usersRef,
      where('username', '>=', username.toLocaleLowerCase()),
      where('username', '<=', username.toLocaleLowerCase() + '\uf8ff'),
      limit(5)
    );

    const querySnapshot = await getDocs(userQuery);
    return querySnapshot.docs
      .map(doc => ({ uid: doc.id, ...doc.data() }))
      .filter(user => user.uid !== this.user.uid); // filter out the current user
  }

  async resetUnreadCount(conversationId: string) {
    const conversationRef = doc(db, 'conversations', conversationId);
    await updateDoc(conversationRef, {
      [`unreadCounts.${this.user.uid}`]: 0 // Reset unread count for the current user
    });
  }

  computeTotalUnreadCount(conversations: []) {
    return conversations.reduce((total, conversation) => {
      return total + (conversation.unreadCounts[this.user.uid] || 0);
    }, 0);
  }
}

// helper functions to reduce complexity of conversation fetching
function getTimestampMillis(conversation) {
  if (!conversation.lastMessageTimestamp) {
    return 0;
  }
  return conversation.lastMessageTimestamp.toMillis ? conversation.lastMessageTimestamp.toMillis() : conversation.lastMessageTimestamp;
}

async function fetchAndCacheUserData(userId, userCache) {
  let userData = await userInfoService.fetchUserData(userId);
  if (userData) {
    userCache.set(userId, userData);
  }
  return userData;
}


export const chatService = new ChatService(firebaseAuth.currentUser);
