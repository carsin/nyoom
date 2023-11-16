import { firebaseAuth, db } from "../firebase-service";
import { writeBatch, collection, query, updateDoc, onSnapshot, orderBy, limit, doc, where, getDocs, serverTimestamp, increment, Timestamp } from 'firebase/firestore';
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
    if (!this.user || !this.user.uid) {
      throw new Error("User is not authenticated");
    }
    
    const conversationsRef = collection(db, 'conversations');
    const q = query(conversationsRef, where('participants', 'array-contains', this.user?.uid));

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const conversationsWithDetailsPromises = querySnapshot.docs.map(async (doc) => {
        const conversation = {
          id: doc.id,
          ...doc.data(),
        };

        const otherUserId = conversation.participants.find(uid => uid !== this.user?.uid);
        let userData = userCache.get(otherUserId);

        if (!userData) {
          userData = await userInfoService.fetchUserData(otherUserId);
          if (userData) {
            userCache.set(otherUserId, userData);
          }
        }

        return {
          ...conversation,
          recipientUsername: userData?.username,
          recipientAvatarUrl: userData?.avatarUrl,
          lastMessageContent: conversation.lastMessageContent || 'No messages',
          lastMessageTimestamp: conversation.lastMessageTimestamp || '',
          lastMessageSender: conversation.lastMessageSender || ''
        };
      });

      let fetchedConversations = await Promise.all(conversationsWithDetailsPromises);
      fetchedConversations.sort((a, b) => b.lastMessageTimestamp.toMillis() - a.lastMessageTimestamp.toMillis());
      conversations.value = fetchedConversations;
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
}

export const chatService = new ChatService(firebaseAuth.currentUser);