<template>
  <ion-fab vertical="bottom" horizontal="end" slot="fixed" v-if="isChatVisible">
    <ion-fab-button @click="toggleChat">
      <ion-icon :icon="isChatOpen ? closeOutline : chatbubblesOutline"></ion-icon>
    </ion-fab-button>
    <ion-fab-list side="top" v-show="isChatOpen">
      <div class="chat-container">
        <div>
          <ion-searchbar v-model="searchQuery" @ionChange="searchUsers" @keyup.enter="searchUsers" placeholder="Search users to message..."></ion-searchbar>
          <ion-list>
            <!-- List of current conversations -->
            <ion-item v-for="conversation in conversations" :key="conversation.id"
              @click="enterConversation(conversation)">
              <ion-label>{{ conversation.title }}</ion-label>
            </ion-item>
            <!-- Search results to start new conversations -->
            <ion-item v-for="user in searchResults" :key="user.uid" @click="startConversationWithUser(user)">
              <ion-avatar slot="start">
                <img :src="user.avatarUrl || defaultAvatar">
              </ion-avatar>
              <ion-label>{{ user.username }}</ion-label>
            </ion-item>
          </ion-list>
        </div>
        <!-- Chat content goes here -->
        <div class="messages">
          <!-- This will contain messages -->
        </div>
        <ion-item lines="none">
          <ion-input placeholder="Type a message..." v-model="message" @keyup.enter="sendMessage"></ion-input>
          <ion-button fill="clear" @click="sendMessage">
            <ion-icon slot="icon-only" :icon="sendOutline"></ion-icon>
          </ion-button>
        </ion-item>
      </div>
    </ion-fab-list>
  </ion-fab>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonFab, IonFabButton, IonFabList, IonIcon, IonItem, IonInput, IonSearchbar, IonAvatar, IonLabel, IonButton, IonList } from '@ionic/vue';
import { chatbubblesOutline, closeOutline, sendOutline } from 'ionicons/icons';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from "../firebase-service";

const isChatVisible = ref(true); // You can toggle this based on route if needed
const isChatOpen = ref(false);
const message = ref("");
const searchQuery = ref('');
const searchResults = ref([]);
const conversations = ref([]);
const defaultAvatar = 'default-avatar-url'; // Replace with your default avatar URL

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
  const q = query(usersRef, where('username', '>=', searchQuery.value.toLocaleLowerCase()), where('username', '<=', searchQuery.value.toLocaleLowerCase() + '\uf8ff'));
  const querySnapshot = await getDocs(q);
  searchResults.value = querySnapshot.docs.map(doc => ({
    uid: doc.id,
    ...doc.data()
  }));
  console.log("results: " + searchResults.value);
};

const startConversationWithUser = (user) => {
  // Here you would implement the logic to create a new conversation with the selected user
  console.log('Starting conversation with:', user.username);
  // clear results and searchbox
  searchResults.value = [];
  searchQuery.value = "";
  conversations.value.push({
    title: user.username,
  })
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
  background-color: white;
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
</style>
