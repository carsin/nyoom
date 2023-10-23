<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Register</ion-title>
        <ion-button class="back" slot="end" fill="outline" href="/">Back</ion-button>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-list>
        <ion-item>
          <ion-input v-model="email" placeholder="email@domain.com"></ion-input>
        </ion-item>
        <ion-item>
          <ion-input v-model="username" placeholder="Enter a username"></ion-input>
        </ion-item>
        <ion-item>
          <ion-input v-model="password" type="password" placeholder="Enter a password"></ion-input>
        </ion-item>
        <ion-item>
          <ion-input v-model="confirmPassword" type="password" placeholder="Re-enter password"></ion-input>
        </ion-item>
        <ion-button expand="block" fill="outline" @click="register"> Register </ion-button>
      </ion-list>
      <ion-toast
        v-if="toastMessage"
        :message="toastMessage"
        :duration="2000"
        :color="toastColor"
        @didDismiss="toastMessage = ''"
      ></ion-toast>
    </ion-content>
  </ion-page>
</template>

<style>
.back{
  padding-right: 15px;
}
</style>

<script setup lang="ts">
import { ref } from 'vue';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonInput,
  IonButton,
  IonToast
} from '@ionic/vue';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "../firebase-service";

const email = ref('');
const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const toastMessage = ref('');
const toastColor = ref('');

const register = async () => {
  if (password.value === confirmPassword.value) {
    try {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email.value.toString(), password.value.toString());
      console.log('Account created:', userCredential.user);
      toastMessage.value = 'Account created successfully!';
      toastColor.value = 'success';
      // You can add navigation or other actions here
    } catch (error) {
      console.error('Error creating account:', error.message);
      toastMessage.value = error.message;
      toastColor.value = 'danger';
      // You might want to show an error message to the user
    }
  } else {
    console.error('Passwords do not match');
    // You might want to show an error message to the user
  }
};
</script>
