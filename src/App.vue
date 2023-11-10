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

document.title = 'Nyoom';

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
