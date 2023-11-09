<template>
  <ion-fab vertical="bottom" horizontal="end" slot="fixed" v-if="isChatVisible">
    <ion-fab-button @click="toggleChat">
      <ion-icon :icon="isChatOpen ? close : chatbubbles"></ion-icon>
    </ion-fab-button>
    <ion-fab-list side="top" v-show="isChatOpen">
      <div class="chat-container">
        <!-- Search View -->
        <div v-if="currentView === 'search'">
          <ion-progress-bar v-if="isLoading" type="indeterminate"></ion-progress-bar>
          <ion-searchbar v-model="searchQuery" @keyup.enter="searchUsers"
            placeholder="Search users to message..."></ion-searchbar>
          <ion-list v-if="searchResults.length > 0">
            <ion-list-header lines="full">
              <ion-label>User Search Results:</ion-label>
            </ion-list-header>
            <ion-item v-for="user in searchResults" :key="user.uid" @click="prepareConversation(user)">
              <ion-avatar slot="start">
                <img :src="user.avatarUrl || defaultAvatar">
              </ion-avatar>
              <ion-label>{{ user.username }}</ion-label>
            </ion-item>
          </ion-list>
          <ion-list v-if="conversations.length > 0">
            <ion-list-header lines="full">
              <ion-label>Active Conversations:</ion-label>
            </ion-list-header>
            <ion-item v-for="conversation in conversations" :key="conversation.id"
              @click="prepareConversation(conversation)">
              <ion-avatar  class="recipient-avatar">
                <img :src="conversation.recipientAvatarUrl || defaultAvatar" alt="Recipient avatar">
              </ion-avatar>
              <ion-label>{{ conversation.recipientUsername }}</ion-label>
              <!-- display the last message or message time here -->
            </ion-item>
          </ion-list>
        </div>
        <!-- Conversation View -->
        <div v-if="currentView === 'conversation'">
          <ion-list class="message-list ion-no-padding">
            <ion-list-header lines="full" v-if="activeConversationDisplay">
              <!-- Message header -->
              <ion-avatar class="recipient-avatar">
                <img :src="activeConversationDisplay.avatarUrl || defaultAvatar" alt="Recipient avatar">
              </ion-avatar>
              <ion-label>{{ activeConversationDisplay.username }}</ion-label>
              <ion-button size="large" fill="clear" @click="backToConversations">
                <ion-icon :icon="arrowBack"></ion-icon>
              </ion-button>
          </ion-list-header>
            <!-- Messages  -->
            <ion-item v-for="message in messages" :key="message.id">
              <ion-label>
                <p> <b>{{ message.senderId === currentUser.uid ? 'You' : message.senderName }}</b>: {{ message.content }}</p>
                <p v-if="message.timestamp" class="message-timestamp ion-text-end">{{ formatTimestamp(message.timestamp) }}</p>
              </ion-label>
            </ion-item>
          </ion-list>
          <div class="message-input-box">
            <ion-item lines="none">
              <ion-input placeholder="Type a message..." v-model="message" @keyup.enter="sendMessage"></ion-input>
              <ion-button fill="clear" @click="sendMessage">
                <ion-icon slot="icon-only" :icon="send"></ion-icon>
              </ion-button>
            </ion-item>
          </div>
        </div>
      </div>
    </ion-fab-list>
    <ion-toast :is-open="toast.isOpen" :message="toast.message" :duration="3000" :color="toast.color"></ion-toast>
  </ion-fab>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { IonFab, IonFabButton, IonFabList, IonIcon, IonItem, IonAvatar, IonLabel, IonSearchbar, IonInput, IonButton, IonToast, IonList, IonListHeader, IonProgressBar } from '@ionic/vue';
import { chatbubbles, close, send, arrowBack } from 'ionicons/icons';
import { db, firebaseAuth } from '../firebase-service'; // Import your Firebase configuration
import { collection, query, onSnapshot, limit, orderBy, where, getDocs, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import { userInfoService } from '../services/UserInfoService'; // Import your Firebase configuration

const isChatVisible = ref(true);
const isChatOpen = ref(false);
const isLoading = ref(false);
const currentView = ref('search'); // 'search' or 'conversation'
const searchQuery = ref('');
const searchResults = ref([]);
const message = ref('');
const messages = ref([]);
const conversations = ref([]);
const activeConversation = ref(); // Store active conversation details here
const defaultAvatar = 'https://ionicframework.com/docs/img/demos/avatar.svg';
const userCache = new Map(); // cache to store fetched user data
const toast = ref({ isOpen: false, message: '', color: '' });
const currentUser = firebaseAuth.currentUser;
let unsubscribe: Function; // Initialize unsubscribe as null

onMounted(async () => {
  unsubscribe = await fetchConversations();
});

onUnmounted(() => { // unsubscribe when the component unmounts
  if (unsubscribe) {
    unsubscribe();
  }
});

const fetchConversations = async () => {
  isLoading.value = true;

  const conversationsRef = collection(db, 'conversations');
  const q = query(conversationsRef, where('participants', 'array-contains', currentUser?.uid));

  // Real-time listener for the conversations
  const unsubscribe = onSnapshot(q, async (querySnapshot) => {
    const conversationsWithLastMessagePromises = querySnapshot.docs.map(async (doc) => {
      const conversation = {
        id: doc.id,
        ...doc.data(),
      };

      const otherUserId = conversation.participants.find(uid => uid !== currentUser?.uid);
      let userData = userCache.get(otherUserId);

      // Fetch user data if not in cache
      if (!userData) {
        userData = await userInfoService.fetchUserData(otherUserId);
        if (userData) {
          userCache.set(otherUserId, userData);
        }
      }

      // Fetch the last message for the conversation
      const messagesRef = collection(db, 'conversations', conversation.id, 'messages');
      const lastMessageQuery = query(messagesRef, orderBy('timestamp', 'desc'), limit(1));
      const messageSnapshot = await getDocs(lastMessageQuery);
      let lastMessage = messageSnapshot.docs.map(doc => doc.data())[0] || null;

      // If there is a last message, format the timestamp
      if (lastMessage && lastMessage.timestamp) {
        lastMessage.formattedTimestamp = lastMessage.timestamp.toDate().toLocaleString();
      }

      return {
        ...conversation,
        recipientUsername: userData?.username,
        recipientAvatarUrl: userData?.avatarUrl,
        lastMessage: lastMessage ? {
          content: lastMessage.content,
          timestamp: lastMessage.formattedTimestamp,
          senderId: lastMessage.senderId
        } : null
      };
    });

    // Wait for all conversations and last messages to be fetched
    conversations.value = await Promise.all(conversationsWithLastMessagePromises);
    isLoading.value = false;
  });

  return unsubscribe; // Return the unsubscribe function to call when the component unmounts
};

const prepareConversation = async (conversationOrUser) => {
  isLoading.value = true;

  if (!currentUser) {
    console.error('No current user logged in.');
    isLoading.value = false;
    return;
  }

  const currentUserUid = currentUser.uid;
  let recipientUid;
  let recipientData;

  // Distinguish between an existing conversation and a new one based on the presence of an 'id' property
  const isExistingConversation = conversationOrUser.id !== undefined;

  if (isExistingConversation) {
    // Existing conversation - get the other participant's UID
    recipientUid = conversationOrUser.participants.find(uid => uid !== currentUserUid);
  } else {
    // New conversation - the parameter is a user object, so get the UID directly
    recipientUid = conversationOrUser.uid;
  }

  // Fetch recipient data
  try {
    recipientData = await userInfoService.fetchUserData(recipientUid);
  } catch (error) {
    console.error('Failed to fetch recipient data:', error);
    isLoading.value = false;
    return;
  }

  // Prepare the recipient data for the activeConversation
  const recipientInfo = {
    avatarUrl: recipientData?.avatarUrl || 'default-avatar-url', // Replace with your default avatar URL
    username: recipientData?.username || 'Unknown'
  };

  if (isExistingConversation) {
    // Set the active conversation with recipient data
    activeConversation.value = {
      ...conversationOrUser,
      recipient: recipientInfo
    };
    // Start listening to messages
    listenToMessages(conversationOrUser.id);
  } else {
    // New conversation: Check if a conversation already exists with the recipient
    let conversationExists = false;
    const conversationsRef = collection(db, 'conversations');
    const conversationQuery = query(
      conversationsRef,
      where('participants', 'array-contains', currentUserUid)
    );

    const querySnapshot = await getDocs(conversationQuery);
    for (const conversationDoc of querySnapshot.docs) {
      const data = conversationDoc.data();
      if (data.participants.includes(recipientUid)) {
        // Conversation found
        activeConversation.value = {
          id: conversationDoc.id,
          recipient: recipientInfo,
          ...data
        };
        conversationExists = true;
        // Start listening to messages
        listenToMessages(conversationDoc.id);
        break;
      }
    }

    // If no conversation exists, prepare a new one without an ID
    if (!conversationExists) {
      activeConversation.value = {
        participants: [currentUserUid, recipientUid],
        recipient: recipientInfo,
        messages: []
      };
    }
  }

  isLoading.value = false;
  currentView.value = 'conversation'; // Switch to conversation view
};

const listenToMessages = (conversationId) => {
  isLoading.value = true;
  const messagesRef = collection(db, 'conversations', conversationId, 'messages');
  onSnapshot(messagesRef, (snapshot) => {
    messages.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })).sort((a, b) => a.timestamp - b.timestamp); // Assuming each message has a 'timestamp'
  });
  isLoading.value = false;
};

const sendMessage = async () => {
  if (message.value.trim() === '') return;

  // If it's a new conversation (no id yet), create it in Firestore
  if (!activeConversation.value.id) {
    const conversationRef = await addDoc(collection(db, 'conversations'), {
      participants: activeConversation.value.participants,
      createdAt: serverTimestamp()
    });
    activeConversation.value.id = conversationRef.id; // Set the newly created conversation ID
    listenToMessages(activeConversation.value.id);
  }

  // Prepare the message object
  const messageToSend = {
    senderId: currentUser?.uid, // Replace with actual current user ID
    content: message.value,
    timestamp: serverTimestamp()
  };

  // Send the message to Firestore
  await sendMessageToFirestore(activeConversation.value.id, messageToSend);

  // Clear the message input after sending
  message.value = '';
};

// Function to send a message to Firestore within a conversation's 'messages' subcollection
const sendMessageToFirestore = async (conversationId, message) => {
  try {
    // Reference to the 'messages' subcollection under the specific conversation document
    const messagesRef = collection(db, 'conversations', conversationId, 'messages');

    // Add a new message document to the 'messages' subcollection
    await addDoc(messagesRef, message);

    console.log('Message sent to Firestore', { conversationId, message });
  } catch (error) {
    console.error('Error sending message to Firestore', error);
  }
};

const toggleChat = () => {
  isChatOpen.value = !isChatOpen.value;
  if (!isChatOpen.value) {
    // Reset views when closing the chat
    searchQuery.value = '';
    searchResults.value = [];
  }
};

const searchUsers = async () => {
  if (searchQuery.value.trim() === '') {
    searchResults.value = [];
    return;
  }
  isLoading.value = true;

  const usersRef = collection(db, 'users');
  const userQuery = query(usersRef, where('username', '>=', searchQuery.value.toLocaleLowerCase()), where('username', '<=', searchQuery.value.toLocaleLowerCase() + '\uf8ff'), limit(5));
  const querySnapshot = await getDocs(userQuery);
  searchResults.value = querySnapshot.docs
    .map(doc => ({
      uid: doc.id,
      ...doc.data()
    }))
    .filter(user => user.uid !== currentUser?.uid); // filter out the current user
  isLoading.value = false;
};

const activeConversationDisplay = computed(() => {
  if (activeConversation.value) {
    return {
      avatarUrl: activeConversation.value.recipient.avatarUrl || defaultAvatar,
      username: activeConversation.value.recipient.username
    };
  }
  return null;
});

const backToConversations = () => {
  searchQuery.value = '';
  searchResults.value = [];
  currentView.value = 'search';
  activeConversation.value = null; // clear the active conversation
};

const formatTimestamp = (timestamp: Timestamp): string => {
  // Convert Firestore Timestamp to JavaScript Date object
  const date = timestamp.toDate();

  // Use date-fns to format the date
  return format(date, 'pp P');
};
</script>

<style scoped>
.chat-container {
  bottom: 55px;
  right: 0;
  width: 300px;
  height: 500px;
  background-color: var(--ion-background-color);
  /* border: 1px solid var(--ion-color-step-650); */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: absolute; /* Set the position context for absolute children */
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* This will push the child divs apart */
}

.messages {
  display: flexbox;
  overflow-y: auto;
  flex-grow: 1;
}

.searchuser-result-item:hover {
  cursor: pointer;
  color: var(--ion-color-step-650);
}

.message-input-box {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
}

.recipient-avatar {
  margin: 8px 16px 8px 0;
  height: 3.2rem;
  width: 3.2rem;
}
</style>
