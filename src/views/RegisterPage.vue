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
          <ion-input label="Email: " v-model="email" placeholder="email@domain.com"></ion-input>
        </ion-item>
        <ion-item>
          <ion-input label="Username: " v-model="username" placeholder="hehexd123"></ion-input>
        </ion-item>
        <ion-item>
          <ion-input label="Password:" v-model="password" type="password" placeholder="••••••••"></ion-input>
        </ion-item>
        <ion-item>
          <ion-input label="Confirm Password: " v-model="confirmPassword" type="password" placeholder="••••••••"></ion-input>
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
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { useRouter } from 'vue-router';
import { firebaseAuth, db } from "../firebase-service";
import { doc, setDoc, collection, query, where, getDocs } from "firebase/firestore";

const router = useRouter();
const email = ref('');
const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const toast = ref({ isOpen: false, message: '', color: '' });

const checkUsernameTaken = async (username: String) => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('username', '==', username));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

const register = async () => {
  if (password.value === confirmPassword.value) {
    if (await checkUsernameTaken(username.value)) { // username in use
      toast.value = { isOpen: true, message: 'Username is already taken. Please choose another one.', color: 'danger' };
    } else {
      try {
        const userCredentials = await createUserWithEmailAndPassword(firebaseAuth, email.value.toString(), password.value.toString());
        const user = userCredentials.user;
        await sendEmailVerification(user);

        // Store user info in Firestore
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, {
          username: username.value,
          avatarURL: "",
          email: email.value,
          biography: "",
          followers: 0,
          following: 0,
          // add other fields as needed
        });

        toast.value = { isOpen: true, message: 'Account created successfully! Please verify your email in the link sent to ' + email.value, color: 'success' }
        router.push("/verify-email");
      } catch (error: any) {
        console.error('Error creating account:', error.message);
        toast.value = { isOpen: true, message: "Error creating account:" + error.message, color: 'danger' }
      }
    }
  } else {
    toast.value = { isOpen: true, message: 'Passwords don\'t match, please try again', color: 'danger' }
    console.error('Passwords do not match');
  }
};
</script>
