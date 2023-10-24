<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Verify Email</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <p>Please check your email and follow the link to verify your account. Once verified, you can login.</p>
      <p>This page will redirect once you have verified your email. If it
        doesn't, please ensure you are verified and <a href="login">login here.</a></p>
      <ion-button :disabled="isButtonDisabled" @click="sendVerificationEmail">Send Another Email</ion-button>
      <p v-if="timer > 0">You can resend the email in {{ timer }} seconds.</p>
      <ion-toast :is-open="toast.isOpen" :message="toast.message" :duration="2000" @didDismiss="toast.isOpen = false">
      </ion-toast>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonContent, IonButton, IonToast, IonTitle, IonToolbar } from '@ionic/vue';
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { onAuthStateChanged, User, sendEmailVerification } from "firebase/auth";
import { firebaseAuth } from '../firebase-service';

const router = useRouter();
const isButtonDisabled = ref(true);
const timer = ref(60);
const toast = ref({ isOpen: false, message: '' });

let refreshIntervalId: number | null = null; // store the refresh interval ID

const sendVerificationEmail = async () => {
  const user = firebaseAuth.currentUser;

  if (user) {
    await sendEmailVerification(user);
    startVerifyCooldown(60); // Starting a 60 seconds cooldown after email is sent
    toast.value = { isOpen: true, message: 'Verification email sent!' };
  }
};

const startVerifyCooldown = (duration: number) => {
  isButtonDisabled.value = true;
  timer.value = duration;

  const verifyCooldownInterval = setInterval(() => {
    if (timer.value > 0) {
      timer.value -= 1;
    } else {
      clearInterval(verifyCooldownInterval);
      isButtonDisabled.value = false;
    }
  }, 1000);
};

refreshIntervalId = setInterval(() => {
  const user = firebaseAuth.currentUser;
  refreshUser(user, router.currentRoute.value.path);
}, 5000) as unknown as number;

const refreshUser = async (user: User | null, currentPath: string) => {
  if (user) {
    await user.reload();
    if (user.emailVerified && currentPath === '/verify-email') {
      clearInterval(refreshIntervalId); // Clear the interval when redirecting
      router.push('/feed');
    }
  }
};

// Setting initial cooldown timer
onMounted(() => {
  isButtonDisabled.value = true;
  timer.value = 60; // 60 seconds cooldown

  const verifyCooldownInterval = setInterval(() => {
    if (timer.value > 0) {
      timer.value -= 1;
    } else {
      clearInterval(verifyCooldownInterval);
      isButtonDisabled.value = false;
    }
  }, 1000);

  const unsubscribe = onAuthStateChanged(firebaseAuth, user => {
    refreshUser(user, router.currentRoute.value.path);
  });

  // Periodic check for verification
  refreshIntervalId = setInterval(() => {
    const user = firebaseAuth.currentUser;
    refreshUser(user, router.currentRoute.value.path);
  }, 5000) as unknown as number;

  onUnmounted(() => {
    unsubscribe();
    clearInterval(refreshIntervalId); // ensure the interval is cleared when the component is destroyed
  });
});
</script>
