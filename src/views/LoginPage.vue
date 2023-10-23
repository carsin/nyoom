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
    </ion-content>
  </ion-page>
</template>

<style>
.back{
  padding-right: 15px;
}
</style>

<script setup lang="ts">
import { IonPage, IonItem, IonList, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput } from '@ionic/vue';
import { ref } from 'vue';
import { signInWithEmailAndPassword, } from "firebase/auth";
import { useRouter } from 'vue-router';
import { firebaseAuth } from '../firebase-service'; // make sure to export it correctly

const email = ref('');
const password = ref('');


const router = useRouter(); // Getting access to the router instance

const handleLogin = async () => {
  try {
    await signInWithEmailAndPassword(firebaseAuth, email.value, password.value);
    router.push("/feed");
    // Navigation to another page after successful login
  } catch (error) {
    // Handling error (you can display a user-friendly message)
    console.error(error.message);
  }
};
</script>
