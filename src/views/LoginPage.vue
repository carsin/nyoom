<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login</ion-title>
        <ion-button class="back" slot="end" fill="outline" href="/">Back</ion-button>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-list>
        <ion-item>
          <ion-input v-model="email" label="Email:" placeholder="email@domain.com"></ion-input>
        </ion-item>
        <ion-item>
          <ion-input label="Password: " v-model="password" type="password" placeholder="••••••••"></ion-input>
        </ion-item>
        <ion-button @click="handleLogin" expand="block" fill="outline"> Login </ion-button>
      </ion-list>
      <ion-toast :is-open="toast.isOpen" :message="toast.message" :color="toast.color" :duration="2000"
        @didDismiss="toast.isOpen = false"></ion-toast>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonItem, IonList, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonToast, IonInput } from '@ionic/vue';
import { ref } from 'vue';
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'vue-router';
import { firebaseAuth } from '../firebase-service';

const router = useRouter();
const email = ref('');
const password = ref('');
const toast = ref({ isOpen: false, message: '', color: '' });

const handleLogin = async () => {
  try {
    const userCredentials = await signInWithEmailAndPassword(firebaseAuth, email.value, password.value);
    const user = userCredentials.user;

    if (user.emailVerified) {
      toast.value = { isOpen: true, message: 'Login successful!', color: 'success'}
      router.push("/feed");
    } else {
      toast.value = { isOpen: true, message: 'Please verify your email before logging in with the link sent to ' + email.value, color: 'danger'}
    }
  } catch (error: any) {
    toast.value = { isOpen: true, message: "Error while logging in: " + error.message, color: 'danger'}
    console.error("Error while logging in: " + error.message);
  } 
};
</script>
