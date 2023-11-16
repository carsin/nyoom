<template>
  <ion-fab vertical="bottom" horizontal="end" slot="fixed" v-if="isChatVisible">
    <ion-fab-button class="enter-chat-button" @click="toggleChat">
      <ion-icon :icon="isChatOpen ? close : chatbubbles"></ion-icon>
      <span v-if="totalUnreadCount > 0"> {{ totalUnreadCount }}</span>
    </ion-fab-button>
    <ion-fab-list side="top" v-show="isChatOpen">
      <div class="chat-container">
        <!-- Search View -->
        <ion-progress-bar v-if="isLoading" type="indeterminate"></ion-progress-bar>
        <div class="search-view" v-if="currentView === 'search'">
          <ion-searchbar v-model="searchQuery" @keyup.enter="searchUsers" placeholder="Search users to message..."
            class="ion-no-padding"></ion-searchbar>
          <ion-list v-if="searchResults.length > 0">
            <ion-list-header lines="full">
              <ion-label>User Search Results:</ion-label>
            </ion-list-header>
            <ion-item class="searchuser-result-item" v-for="user in searchResults" :key="user.uid"
              @click="prepareConversation(user)">
              <ion-avatar slot="start">
                <img :src="user.avatarUrl || defaultAvatar" alt="Search result avatar">
              </ion-avatar>
              <ion-label>{{ user.username }}</ion-label>
            </ion-item>
          </ion-list>
          <ion-list v-if="conversations.length > 0" class="ion-no-padding">
            <ion-list-header lines="full">
              <ion-label>Active Conversations</ion-label>
            </ion-list-header>
            <ion-item v-for="conversation in conversations" :key="conversation.id"
              @click="prepareConversation(conversation)">
              <ion-avatar class="recipient-avatar">
                <img :src="conversation.recipientAvatarUrl || defaultAvatar" alt="Recipient avatar">
              </ion-avatar>
              <div class="conversation-details">
                <ion-label>
                  <h2>{{ conversation.recipientUsername }}
                    <span v-if="conversation.unreadCounts[currentUser?.uid] > 0" class="unread-count"> ({{
                      conversation.unreadCounts[currentUser?.uid] }} unread) </span>
                  </h2>
                  <p>{{ conversation.lastMessageSender === currentUser.uid ? currentUsername : conversation.recipientUsername }}: {{ conversation.lastMessageContent || 'Cannot load message.' }}</p>
                  <p>{{ formatTimestamp(conversation.lastMessageTimestamp) || 'Timestamp loading...' }}</p>
                </ion-label>
              </div>
            </ion-item>
          </ion-list>
        </div>
        <!-- Conversation View -->
        <div class="conversation-view" v-if="currentView === 'conversation'">
          <ion-list class="message-list ion-no-padding">
            <!-- Conversation header -->
            <ion-list-header class="conversation-header" lines="full" v-if="activeConversationDisplay">
              <ion-avatar @click="router.push('/user/' + activeConversationDisplay.username)" class="recipient-avatar">
                <img :src="activeConversationDisplay.avatarUrl || defaultAvatar" alt="Recipient avatar">
              </ion-avatar>
              <ion-label class="conversation-username"
                @click="router.push('/user/' + activeConversationDisplay.username)">{{ activeConversationDisplay.username
                }}</ion-label>
              <ion-button class="" size="large" fill="clear" @click="backToConversations">
                <ion-icon :icon="arrowBack"></ion-icon>
              </ion-button>
            </ion-list-header>
            <!-- Messages  -->
            <ion-item v-for="message in messages" :key="message.id" lines="inset">
              <ion-label>
                <ion-grid class="ion-no-padding">
                  <ion-row class="ion-align-items-center" style="flex-grow: 1;">
                    <ion-col size="auto"> <!-- sender username -->
                      <b class="message-username conversation-username" @click="navigateToUserProfile(message)">
                        {{ currentUser.uid === message.senderId ? currentUsername : activeConversationDisplay.username }}
                      </b>
                    </ion-col>
                    <ion-col suze="auto"> <!-- timestamp -->
                      <p v-if="message.timestamp" class="message-timestamp">{{ formatTimestamp(message.timestamp) }}</p>
                    </ion-col>
                    <ion-col v-if="message.timestamp" size="auto" class="ion-text-end" style="flex-shrink: 0;">
                      <!-- read receipt icon -->
                      <ion-icon class="message-receipt" :icon="message.readStatus ? checkmark : mailOutline"></ion-icon>
                    </ion-col>
                  </ion-row>
                  <ion-row>
                    <ion-col>
                      <p>{{ message.content }}</p>
                    </ion-col>
                  </ion-row>
                </ion-grid>
              </ion-label>
            </ion-item>
          </ion-list>
          <div class="message-input-box">
            <ion-item lines="none">
              <ion-input placeholder="Type a message..." v-model="messageContent" @keyup.enter="sendMessage"
                :maxlength="MAX_CHATMESSAGE_LENGTH"></ion-input>
              <ion-button fill="clear" @click="sendMessage">
                <ion-icon slot="icon-only" :icon="send"></ion-icon>
              </ion-button>
            </ion-item>
          </div>
        </div>
      </div>
    </ion-fab-list>
    <ion-toast :is-open="toast.isOpen" :message="toast.message" :duration="3000" :color="toast.color"></ion-toast>
  </ion-fab></template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { IonFab, IonFabButton, IonFabList, IonIcon, IonItem, IonAvatar, IonLabel, IonSearchbar, IonInput, IonButton, IonToast, IonList, IonListHeader, IonProgressBar, IonGrid, IonCol, IonRow } from '@ionic/vue';
import { chatbubbles, close, send, arrowBack, mailOutline, checkmark } from 'ionicons/icons';
import { db, firebaseAuth } from '../firebase-service'; // Import your Firebase configuration
import { writeBatch, collection, query, updateDoc, onSnapshot, orderBy, limit, doc, where, getDocs, serverTimestamp, increment, Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import { MAX_CHATMESSAGE_LENGTH } from "../util/constants"
import { userInfoService } from '../services/UserInfoService';
import { chatService } from '../services/ChatService';

const isChatVisible = ref(true);
const isChatOpen = ref(false);
const isLoading = ref(false);
const currentView = ref('search'); // 'search' or 'conversation'
const searchQuery = ref('');
const searchResults = ref([]);
const messageContent = ref('');
const messages = ref([]);
const conversations = ref([]);
const activeConversation = ref();
const defaultAvatar = 'https://ionicframework.com/docs/img/demos/avatar.svg';
const userCache = new Map(); // cache to store fetched user data
const toast = ref({ isOpen: false, message: '', color: '' });
const currentUser = firebaseAuth.currentUser;
const currentUsername = ref('');
const router = useRouter();
let unsubscribeConvoListener: Function;
let unsubscribeMessageListener: Function;

onMounted(async () => {
  unsubscribeConvoListener = await fetchConversations();
  let fetchUsername = await userInfoService.getCurrentUserUsername();
  if (fetchUsername) currentUsername.value = fetchUsername;
});

onBeforeUnmount(() => { // unsubscribe when the component unmounts
  if (unsubscribeConvoListener) {
    unsubscribeConvoListener();
  }
  if (unsubscribeMessageListener) {
    unsubscribeMessageListener();
  }
});

const fetchConversations = async () => {
  isLoading.value = true;

  const conversationsRef = collection(db, 'conversations');
  const q = query(conversationsRef, where('participants', 'array-contains', currentUser?.uid));

  // real-time listener for conversations
  const unsubscribe = onSnapshot(q, async (querySnapshot) => {
    const conversationsWithDetailsPromises = querySnapshot.docs.map(async (doc) => {
      const conversation = {
        id: doc.id,
        ...doc.data(),
      };

      const otherUserId = conversation.participants.find(uid => uid !== currentUser?.uid);
      let userData = userCache.get(otherUserId);

      // fetch user data if not in cache
      if (!userData) {
        userData = await userInfoService.fetchUserData(otherUserId);
        if (userData) {
          userCache.set(otherUserId, userData);
        }
      }

      // format the timestamp of the last message
      // let formattedTimestamp = formatTimestamp(conversation.lastMessageTimestamp);

      return {
        ...conversation,
        recipientUsername: userData?.username,
        recipientAvatarUrl: userData?.avatarUrl,
        lastMessageContent: conversation.lastMessageContent || 'No messages',
        lastMessageTimestamp: conversation.lastMessageTimestamp || '',
        lastMessageSender: conversation.lastMessageSender || ''
      };
    });

    // wait for all conversations and last messages to be fetched
    let fetchedConversations = await Promise.all(conversationsWithDetailsPromises);
    // sort conversations by timestamp in descending order
    fetchedConversations.sort((a, b) => b.lastMessageTimestamp.toMillis() - a.lastMessageTimestamp.toMillis());
    conversations.value = fetchedConversations;
  });

  isLoading.value = false;
  return unsubscribe; // return the unsubscribe function to call when the component unmounts
};

const prepareConversation = async (conversationOrUser) => {
  isLoading.value = true;

  try {
    const result = await chatService.prepareConversation(conversationOrUser, activeConversation, messages);
    if (!result.success) {
      throw new Error(result.message);
    } else {
      unsubscribeConvoListener = result.unsubscribe;
      currentView.value = 'conversation';
    }
  } catch(error: any) {
    toast.value = { isOpen: true, message: "Error fetching conversation: " + error.message, color: 'danger' };
  } finally {
    isLoading.value = false;
  }
};

const sendMessage = async () => {
  if (messageContent.value.trim() === '') return;
  if (isLoading.value) {
    toast.value = { isOpen: true, message: "Already sending message!", color: 'danger' };
    return;
  }
  isLoading.value = true;
  let message = messageContent.value;
  messageContent.value = '';

  const batch = writeBatch(db);

  // if it's a new conversation, create it in Firestore
  let conversationRef;
  let timestamp = serverTimestamp();
  if (!activeConversation.value.id) {
    conversationRef = doc(collection(db, 'conversations'));
    batch.set(conversationRef, {
      participants: activeConversation.value.participants,
      createdAt: timestamp,
      unreadCounts: activeConversation.value.unreadCounts,
      lastMessageSender: currentUser?.uid,
      lastMessageContent: message,
      lastMessageTimestamp: timestamp,
    });
    activeConversation.value.id = conversationRef.id; // set the newly created conversation ID
  } else {
    conversationRef = doc(db, 'conversations', activeConversation.value.id);
    const recipientId = activeConversation.value.participants.find(uid => uid !== currentUser?.uid);
    batch.update(conversationRef, { // update the conversation with the last message details
      lastMessageSender: currentUser?.uid,
      lastMessageContent: message,
      lastMessageTimestamp: timestamp,
      [`unreadCounts.${recipientId}`]: increment(1) // Increment unread count for recipient
    });
  }

  const messagesRef = collection(db, 'conversations', activeConversation.value.id, 'messages');
  // add a new message to the messages subcollection
  const messageDocRef = doc(messagesRef);
  batch.set(messageDocRef, {
    senderId: currentUser?.uid,
    content: message,
    timestamp: timestamp,
    readStatus: false,
  });

  // send the message and update conversation in a single batched write
  try {
    await batch.commit();
    // start listening for messages
    if (!unsubscribeMessageListener) {
      unsubscribeMessageListener = listenToMessages(activeConversation.value.id);
    }
  } catch (error: any) {
    messageContent.value = message;
    toast.value = { isOpen: true, message: "Error sending message: " + error.message, color: 'danger' };
  }
  isLoading.value = false;
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

const resetUnreadCount = async (conversationId) => {
  const conversationRef = doc(db, 'conversations', conversationId);
  await updateDoc(conversationRef, {
    [`unreadCounts.${currentUser?.uid}`]: 0 // Reset unread count for the current user
  });
};

const totalUnreadCount = computed(() => {
  return conversations.value.reduce((total, conversation) => {
    return total + (conversation.unreadCounts[currentUser?.uid] || 0);
  }, 0);
});

const activeConversationDisplay = computed(() => {
  if (activeConversation.value) {
    return {
      avatarUrl: activeConversation.value.recipient.avatarUrl || defaultAvatar,
      username: activeConversation.value.recipient.username
    };
  }
  return null;
});

function navigateToUserProfile(message) {
  const username = message.senderId === currentUser?.uid ? currentUsername.value : activeConversationDisplay.value.username;
  router.push('/user/' + username);
}

const backToConversations = () => {
  searchQuery.value = '';
  searchResults.value = [];
  messages.value = [];
  if (unsubscribeMessageListener) {
    unsubscribeMessageListener();
  }
  activeConversation.value = null; // clear the active conversation
  currentView.value = 'search';
};

const formatTimestamp = (timestamp: Timestamp): string => {
  if (timestamp) {
    return format(timestamp.toDate(), 'pp M/d/yy'); // use date-fns to format the date
  }
  return '';
};
</script>

<style scoped>
.chat-container {
  bottom: 105px;
  right: 55px;
  width: 300px;
  height: 500px;
  background-color: var(--ion-background-color);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
  position: absolute;
  display: flex;
  flex-direction: column;
}

.enter-chat-button {
  position: absolute;
  bottom: 55px;
  right: 3px;
}

.search-view,
.conversation-view {
  background-color: var(--ion-background-color);
  overflow-y: auto;
  flex-grow: 1;
}

.conversation-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--ion-background-color);
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
  background-color: inherit;
}

.recipient-avatar {
  margin: 8px 16px 8px 0;
  height: 3.2rem;
  width: 3.2rem;
}

.recipient-avatar:hover, .conversation-username:hover {
  cursor: pointer;
  color: var(--ion-color-step-650);
}

.message-username {
  padding-right: 4px;
}

.message-timestamp {
  font-style: italic;
  font-size: 90%;
}

.message-receipt {
  padding-right: 4px;
}</style>
