<template>
  <ion-fab vertical="bottom" horizontal="end" slot="fixed" v-if="isChatVisible">
    <ion-fab-button @click="toggleChat">
      <ion-icon :icon="isChatOpen ? close: chatbubbles"></ion-icon>
    </ion-fab-button>
    <ion-fab-list side="top" v-show="isChatOpen">
      <div class="chat-container">
        <div>
          <!-- Search results to start new conversations -->
          <ion-list v-if="searchResults.length > 0">
            <ion-list-header lines="full">
              <ion-label>User Search Results:</ion-label>
            </ion-list-header>
            <ion-item v-for="user in searchResults" class="searchuser-result-item" :key="user.uid" @click="startConversationWithUser(user)">
              <ion-avatar slot="start">
                <img :src="user.avatarUrl || 'https://ionicframework.com/docs/img/demos/avatar.svg'">
              </ion-avatar>
              <ion-label>{{ user.username }}</ion-label>
            </ion-item>
          </ion-list>
          <!-- List of current conversations -->
          <ion-list v-if="conversations.length > 0">
            <ion-list-header lines="full">
              <ion-label>Conversations</ion-label>
            </ion-list-header>
            <ion-item v-for="conversation in conversations" :key="conversation.id" @click="enterConversation(conversation)">
              <ion-avatar slot="start">
                <img :src="conversation.avatarUrl || 'https://ionicframework.com/docs/img/demos/avatar.svg'">
              </ion-avatar>
              <ion-label>{{ conversation.title }}</ion-label>
            </ion-item>
          </ion-list>
        </div>
        <!-- Chat content goes here -->
        <div class="messages">
          <!-- This will contain messages -->
        </div>
        <ion-searchbar v-model="searchQuery" @ionChange="searchUsers" @keyup.enter="searchUsers" placeholder="Search users to message..."></ion-searchbar>
        <ion-item lines="none">
          <ion-input placeholder="Type a message..." v-model="message" @keyup.enter="sendMessage"></ion-input>
          <ion-button fill="clear" @click="sendMessage">
            <ion-icon slot="icon-only" :icon="send"></ion-icon>
          </ion-button>
        </ion-item>
      </div>
    </ion-fab-list>
    <ion-toast :is-open="toast.isOpen" :message="toast.message" :duration="3000" :color="toast.color"></ion-toast>
  </ion-fab>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonFab, IonToast, IonFabButton, IonFabList, IonListHeader, IonIcon, IonItem, IonInput, IonSearchbar, IonAvatar, IonLabel, IonButton, IonList } from '@ionic/vue';
import { chatbubbles, close, send} from 'ionicons/icons';
import { limit, collection, query, where, getDocs } from 'firebase/firestore';
import { db, firebaseAuth } from "../firebase-service";

const isChatVisible = ref(true); // You can toggle this based on route if needed
const isChatOpen = ref(false);
const message = ref("");
const searchQuery = ref('');
const searchResults = ref([]);
const conversations = ref([]);
const toast = ref({ isOpen: false, message: '', color: '' });
const preparedConversation = ref('');
const user = firebaseAuth.currentUser;

const toggleChat = () => {
  isChatOpen.value = !isChatOpen.value;
};

const sendMessage = () => {
  if (message.value.trim() !== "") {
    // Handle sending message
    console.log(message.value);
    message.value = ""; // Reset input after sending
  }
};

const searchUsers = async () => {
  if (searchQuery.value.trim() === '') {
    searchResults.value = [];
    return;
  }
  console.log("searching for: " + searchQuery.value);

  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('username', '>=', searchQuery.value.toLocaleLowerCase()), where('username', '<=', searchQuery.value.toLocaleLowerCase() + '\uf8ff'), limit(10));
  const querySnapshot = await getDocs(q);
  searchResults.value = querySnapshot.docs.map(doc => ({
    uid: doc.id,
    ...doc.data()
  }));
  if (searchResults.value.length == 0) {
    toast.value = { isOpen: true, message: "No users found!", color: 'danger' };
  }
  console.log("results: " + searchResults.value);
};

const startConversationWithUser = async (selectedUser) => {
  // clear results and searchbox
  searchResults.value = [];
  searchQuery.value = "";
  conversations.value.push({
    title: selectedUser.username,
    avatar: selectedUser.avatarUrl,
  })
  // Check if a conversation already exists between the current user and the selected user
  // If it exists, navigate to that conversation instead of creating a new one
  
  // Prepare the conversation object in memory with the user's information
  const newConversation = {
    participants: {
      [user.uid]: true, // current user
      [selectedUser.uid]: true // selected user
    },
    messages: [], // Start with an empty array, will be populated with the first message
    // Add other initial fields as necessary
  };

  // Store the prepared conversation object in a ref or a reactive state
  // to be used when the first message is sent
  preparedConversation.value = newConversation;

  // Optionally navigate to a "new message" view where the user can type their first message
  // You might want to pass the preparedConversation object or ID to that view
};

const enterConversation = (conversation) => {
  // Logic to open the existing conversation
  console.log('Entering conversation:', conversation.title);
};
</script>

<style scoped>
.chat-container {
  position: absolute;
  bottom: 55px;
  right: 0;
  width: 300px;
  height: 400px;
  background-color: var(--ion-background-color);
  border: 1px solid #ccc;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.messages {
  padding: 10px;
  overflow-y: auto;
  flex-grow: 1;
}

.searchuser-result-item:hover {
  cursor: pointer;
  color: var(--ion-color-step-650);
}

</style>
