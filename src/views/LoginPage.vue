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
          <ion-input v-model="email" label="Email:" placeholder="Enter email"></ion-input>
        </ion-item>
        <ion-item>
          <ion-input v-model="password" label="Password:" type="password" placeholder="Enter password"></ion-input>
        </ion-item>
        <ion-button @click="handleLogin" expand="block" fill="outline"> Login </ion-button>
      </ion-list>
      <ion-toast :is-open="isOpen" :message="toastMessage" :color="toastColor" :duration="4000" @didDismiss="setOpen(false)"></ion-toast>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonItem, IonList, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonToast, IonInput } from '@ionic/vue';
import { ref } from 'vue';
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'vue-router';
import { firebaseAuth } from '../firebase-service'; 

const email = ref('');
const password = ref('');
const isOpen = ref(false);
const toastMessage = ref('');
const toastColor = ref(''); 

const setOpen = (state: boolean) => {
  isOpen.value = state;
};

const router = useRouter(); // Getting access to the router instance

const handleLogin = async () => {
  try {
    await signInWithEmailAndPassword(firebaseAuth, email.value, password.value);
    toastColor.value = 'success';
    toastMessage.value = "Login successful!";
    router.push("/feed");
  } catch (error: any) {
    toastColor.value = 'danger';
    toastMessage.value = error.message;
    console.error(error.message);
  } finally {
    setOpen(true);
  }
};
</script>
