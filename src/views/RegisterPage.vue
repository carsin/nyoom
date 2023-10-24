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
      <ion-toast :is-open="toast.isOpen" :message="toast.message" :duration="3000" :color="toast.color" @didDismiss="toast.isOpen = false"></ion-toast>
    </ion-content>
  </ion-page>
</template>

<style>
.back {
  padding-right: 15px;
}
</style>

<script setup lang="ts">
import { ref } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonInput, IonButton, IonToast } from '@ionic/vue';
import { createUserWithEmailAndPassword, sendEmailVerification, User } from "firebase/auth";
import { useRouter } from 'vue-router';
import { firebaseAuth } from "../firebase-service";

const router = useRouter();
const email = ref('');
const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const toast = ref({ isOpen: false, message: '', color: '' });

const register = async () => {
  if (password.value === confirmPassword.value) {
    try {
      const userCredentials = await createUserWithEmailAndPassword(firebaseAuth, email.value.toString(), password.value.toString());
      const user = userCredentials.user;
      await sendEmailVerification(user);
      toast.value = { isOpen: true, message: 'Account created successfully! Please verify your email in the link sent to ' + email.value, color: 'success'}
      router.push("/verify-email");
    } catch (error: any) {
      console.error('Error creating account:', error.message);
      toast.value = { isOpen: true, message: "Error creating account:" + error.message, color: 'danger'}
    }
  } else {
    toast.value = { isOpen: true, message: 'Passwords don\'t match, please try again', color: 'danger'}
    console.error('Passwords do not match');
  }
};
</script>
