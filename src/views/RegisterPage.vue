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
      <ion-toast :is-open="isOpen" :message="toastMessage" :duration="3000" :color="toastColor"
        @didDismiss="setOpen(false)"></ion-toast>
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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'vue-router';
import { firebaseAuth } from "../firebase-service";

const router = useRouter();
const email = ref('');
const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const toastMessage = ref('');
const toastColor = ref('');
const isOpen = ref(false);

const setOpen = (state: boolean) => {
  isOpen.value = state;
};

const register = async () => {
  if (password.value === confirmPassword.value) {
    try {
      await createUserWithEmailAndPassword(firebaseAuth, email.value.toString(), password.value.toString());
      toastColor.value = 'success';
      toastMessage.value = 'Account created successfully!';
      setOpen(true);
      router.push("/feed");
    } catch (error: any) {
      console.error('Error creating account:', error.message);
      toastColor.value = 'danger';
      toastMessage.value = error.message;
      setOpen(true);
    }
  } else {
    toastMessage.value = 'Passwords do not match';
    toastColor.value = 'danger';
    setOpen(true);
    console.error('Passwords do not match');
  }
};
</script>
