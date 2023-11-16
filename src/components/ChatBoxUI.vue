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
                  <p>{{ conversation.lastMessageSender === currentUser.uid ? currentUsername :
                    conversation.recipientUsername }}: {{ conversation.lastMessageContent || 'Cannot load message.' }}</p>
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
  </ion-fab>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { IonFab, IonFabButton, IonFabList, IonIcon, IonItem, IonAvatar, IonLabel, IonSearchbar, IonInput, IonButton, IonToast, IonList, IonListHeader, IonProgressBar, IonGrid, IonCol, IonRow } from '@ionic/vue';
import { chatbubbles, close, send, arrowBack, mailOutline, checkmark } from 'ionicons/icons';
import { firebaseAuth } from '../firebase-service'; // Import your Firebase configuration
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
  try {
    unsubscribeConvoListener = await chatService.fetchConversations(conversations, userCache);
  } catch (error: any) {
    toast.value = { isOpen: true, message: "Error fetching conversation list: " + error.message, color: 'danger' };
  }
  isLoading.value = false;
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
  } catch (error: any) {
    toast.value = { isOpen: true, message: "Error fetching conversation: " + error.message, color: 'danger' };
  }
  isLoading.value = false;
};

const sendMessage = async () => {
  if (isLoading.value) {
    toast.value = { isOpen: true, message: "Already sending message!", color: 'danger' };
    return;
  }
  isLoading.value = true;
  let message = messageContent.value;
  messageContent.value = '';

  try {
    const result = await chatService.sendMessage(activeConversation.value, message);
    if (!result.success) {
      throw new Error(result.message);
    }
    if (!unsubscribeMessageListener) { // restart message listener if not already
      unsubscribeMessageListener = chatService.listenToMessages(activeConversation.value.id, messages);
    }
  } catch (error: any) {
    messageContent.value = message;
    toast.value = { isOpen: true, message: "Error sending message: " + error.message, color: 'danger' };
  }
  isLoading.value = false;
};

const searchUsers = async () => {
  isLoading.value = true;
  try {
    searchResults.value = await chatService.searchUsers(searchQuery.value);
  } catch (error: any) {
    toast.value = { isOpen: true, message: "Error searching users: " + error.message, color: 'danger' };
  }
  isLoading.value = false;
};

const totalUnreadCount = computed(() => {
  return chatService.computeTotalUnreadCount(conversations.value);
});

const toggleChat = async () => {
  isChatOpen.value = !isChatOpen.value;
  if (!isChatOpen.value) {
    // Reset views when closing the chat
    searchQuery.value = '';
    searchResults.value = [];
  }
  if (!unsubscribeConvoListener) {
    unsubscribeConvoListener = await fetchConversations();
  }
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
