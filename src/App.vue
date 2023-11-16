<template>
  <ion-app>
    <ion-router-outlet />
    <ChatBoxUI v-if="showChatbox"/>
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import ChatBoxUI from '@/components/ChatBoxUI.vue';
import { watch, ref } from 'vue';
import { firebaseAuth } from "./firebase-service";
import { useRoute } from 'vue-router';
import { authHandler } from './services/AuthHandler';
import { chatService } from './services/ChatService';

document.title = 'Nyoom';

// initialize auth for services
authHandler.addService(chatService); 
// TODO: integrate authHandler into all services

authHandler.initialize();

const route = useRoute();
const showChatbox = ref(false);
const isAuthenticated = ref(firebaseAuth.currentUser != null);

const updateChatboxVisibility = () => {
  // Show chatbox only when the user is authenticated and the current route does not hide the chatbox
  isAuthenticated.value = firebaseAuth.currentUser != null;
  showChatbox.value = isAuthenticated.value && !route.meta.hideChatbox;
};

// Initial check
updateChatboxVisibility();

// Watch for changes in authentication and route
watch([isAuthenticated, route], () => {
  updateChatboxVisibility();
});


</script>
