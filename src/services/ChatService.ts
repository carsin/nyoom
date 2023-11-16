import { firebaseAuth, db } from "../firebase-service";
import { writeBatch, collection, query, updateDoc, onSnapshot, orderBy, limit, doc, where, getDocs, serverTimestamp, increment } from 'firebase/firestore';
import { userInfoService } from '../services/UserInfoService';

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

        // Use cached data if available
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

      conversations.value = fetchedConversations.sort((a, b) => getTimestampMillis(b) - getTimestampMillis(a));
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
    } else {
      recipientUid = conversationOrUser.uid;
    }

    try {
      recipientData = await userInfoService.fetchUserData(recipientUid);
    } catch (error) {
      return { success: false, message: "Error fetching recipient data: " + error.message };
    }

    const recipientInfo = {
      avatarUrl: recipientData?.avatarUrl || 'default-avatar-url',
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
          unsubscribe = this.listenToMessages(conversationDoc.id, messages);
          break;
        }
      }

      if (!conversationExists) {
        activeConversation.value = {
          participants: [currentUserUid, recipientUid],
          recipient: recipientInfo,
          messages: []
        };
      }
    }

    return { success: true, unsubscribe };
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

  async sendMessage(activeConversation, message) {
    if (message.trim() === '') return { success: false, message: 'Message is empty.' };

    const batch = writeBatch(db);
    let conversationRef;
    let timestamp = serverTimestamp();

    if (!activeConversation.id) {
      conversationRef = doc(collection(db, 'conversations'));
      batch.set(conversationRef, {
        participants: activeConversation.participants,
        createdAt: timestamp,
        unreadCounts: activeConversation.unreadCounts,
        lastMessageSender: this.user.uid,
        lastMessageContent: message,
        lastMessageTimestamp: timestamp,
      });
      activeConversation.id = conversationRef.id;
    } else {
      conversationRef = doc(db, 'conversations', activeConversation.id);
      const recipientId = activeConversation.participants.find(uid => uid !== this.user.uid);
      batch.update(conversationRef, {
        lastMessageSender: this.user.uid,
        lastMessageContent: message,
        lastMessageTimestamp: timestamp,
        [`unreadCounts.${recipientId}`]: increment(1)
      });
    }

    const messagesRef = collection(db, 'conversations', activeConversation.id, 'messages');
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
