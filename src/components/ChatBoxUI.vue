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
                <p class="message-timestamp ion-text-end">{{ formatTimestamp(message.timestamp) }}</p>
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
import { collection, query, onSnapshot, where, getDocs, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
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
    const convs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Fetch user details for all conversations in parallel
    const userDetailsPromises = convs.map(async (conversation) => {
      const otherUserId = conversation.participants.find(uid => uid !== currentUser?.uid);
      let userData = userCache.get(otherUserId);

      // Fetch user data if not in cache
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
      };
    });

    // Wait for all user details to be fetched
    conversations.value = await Promise.all(userDetailsPromises);
  });

  isLoading.value = false;
  return unsubscribe; // Return the unsubscribe function to call when the component unmounts
};

const prepareConversation = async (conversation) => {
  isLoading.value = true;
  if (!currentUser) {
    console.error('No current user logged in.');
    return;
  }

  // Define the current user's UID and the selected user's UID
  const currentUserUid = currentUser.uid;
  const recipientUid = conversation.participants.find(uid => uid !== currentUser?.uid);

  // Query to check if a conversation between the two users already exists
  const conversationQuery = query(
    collection(db, 'conversations'),
    where('participants', 'array-contains', currentUserUid)
  );

  let conversationId = null;
  const querySnapshot = await getDocs(conversationQuery);
  const recipientData = await userInfoService.fetchUserData(recipientUid);

  // Check if a document with the selected user as a participant already exists
  querySnapshot.forEach((conversationDoc) => {
    const data = conversationDoc.data();
    if (data.participants.includes(recipientUid)) {
      // Conversation found
      activeConversation.value = {
        id: conversationDoc.id,
        recipient: {
          avatarUrl: recipientData?.avatarUrl,
          username: recipientData?.username
        },
        ...data
      };
      conversationId = conversationDoc.id; // Capture the conversation ID
      console.log(activeConversation.value);
      console.log("found conversation!")
    } else {
      console.log("new conversation");
    }
  });
  
  // Start listening to messages
  if (conversationId) {
    listenToMessages(conversationId);
  }

  // If no conversation exists, prepare a new one without an ID (it will be assigned once the first message is sent)
  if (!conversationId) {
    activeConversation.value = {
      participants: [currentUserUid, recipientUid],
      recipient: {
        avatarUrl: recipientData?.avatarUrl,
        username: recipientData?.username
      },
      messages: []
    };
  }
  isLoading.value = false;
  currentView.value = 'conversation'; // switch to conversation view
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
  const userQuery = query(usersRef, where('username', '>=', searchQuery.value.toLocaleLowerCase()), where('username', '<=', searchQuery.value.toLocaleLowerCase() + '\uf8ff'));
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
    console.log(activeConversation.value);
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
