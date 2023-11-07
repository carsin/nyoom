<template>
  <ion-fab vertical="bottom" horizontal="end" slot="fixed" v-if="isChatVisible">
    <ion-fab-button @click="toggleChat">
      <ion-icon :icon="isChatOpen ? closeOutline : chatbubblesOutline"></ion-icon>
    </ion-fab-button>
    <ion-fab-list side="top" v-show="isChatOpen">
      <div class="chat-container">
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
import { IonFab, IonFabButton, IonFabList, IonIcon, IonItem, IonInput, IonButton } from '@ionic/vue';
import { chatbubblesOutline, closeOutline, sendOutline } from 'ionicons/icons';

const isChatVisible = ref(true); // You can toggle this based on route if needed
const isChatOpen = ref(false);
const message = ref("");

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
