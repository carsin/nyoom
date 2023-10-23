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
      <ion-toast
        v-if="showToast"
        :message="toastMessage"
        duration="2000"
        :color="toastColor"
        :onDidDismiss="handleToastDismiss"
      ></ion-toast>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonItem, IonList, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput, IonToast } from '@ionic/vue';
import { ref } from 'vue';
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'vue-router';
import { firebaseAuth } from '../firebase-service'; // make sure to export it correctly

const email = ref('');
const password = ref('');
const showToast = ref(false);
const toastMessage = ref('');
const toastColor = ref('');

const router = useRouter(); // Getting access to the router instance

const handleLogin = async () => {
  try {
    await signInWithEmailAndPassword(firebaseAuth, email.value, password.value);
    // TEMP: send success browser alert
    alert("Login successful!"); 
    // TODO: fix toast message not appearing
    toastMessage.value = "Login successful!";
    toastColor.value = "success";
    showToast.value = true;
    setTimeout(() => {
      showToast.value = false;
      router.push("/feed");
    }, 1000);
    // Navigation to another page after successful login
  } catch (error) {
    // TEMP: send success browser alert
    alert("Error: " + error.message); 
    // TODO: fix toast message not appearing
    toastMessage.value = "Error during login: " + error.message;
    toastColor.value = "danger";
    showToast.value = true;
    setTimeout(() => {
      showToast.value = false;
    }, 2000);
    // Handling error (you can display a user-friendly message)
    console.error(error.message);
  }
};

const handleToastDismiss = () => {
  showToast.value = false;
};
</script>
