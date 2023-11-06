<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login</ion-title>
        <ion-button class="ion-margin-end" slot="end" fill="outline" href="/">Back</ion-button>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <form @submit.prevent="handleLogin">
        <ion-list>
          <ion-item>
            <ion-input @keyup.enter="handleLogin" v-model="formData.email" label="Email:" label-placement="stacked" placeholder="email@domain.com" :color="showErrors && emailError ? 'danger' : ''"></ion-input>
          </ion-item>
          <ion-item class="form-error-note" v-if="showErrors && emailError">
            <ion-note color="danger"  class="">{{ emailError }}</ion-note>
          </ion-item>
          <ion-item>
            <ion-input @keyup.enter="handleLogin" label="Password: " label-placement="stacked" v-model="formData.password" type="password" placeholder="••••••••" :color="showErrors && passwordError ? 'danger' : ''"></ion-input>
          </ion-item>
          <ion-item class="form-error-note" v-if="showErrors && passwordError">
            <ion-note color="danger">{{ passwordError }}</ion-note>
          </ion-item>
          <ion-button :disabled="loginRequested" type="submit" @click="handleLogin" expand="block" fill="outline" class="ion-margin-top"> Login </ion-button>
        </ion-list>
      </form>
      <ion-toast :is-open="toast.isOpen" :message="toast.message" :color="toast.color" :duration="2000"
        @didDismiss="toast.isOpen = false"></ion-toast>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.form-error-note { /* make error messages not the same size as other items */
  --padding-start: 16px;
  --padding-end: 0;
  --padding-top: 0;
  --padding-bottom: 0;
  --min-height: 0;
}

.form-error-note ion-note {
  font-size: 0.9em; 
}
</style>

<script setup lang="ts">
import { IonPage, IonNote, IonItem, IonList, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonToast, IonInput } from '@ionic/vue';
import { ref } from 'vue';
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'vue-router';
import { firebaseAuth } from '../firebase-service';

const router = useRouter();
const toast = ref({ isOpen: false, message: '', color: '' });
const loginRequested = ref(false); // used to disable login button once request is made
const formData = ref({
  email: '',
  password: '',
});
const showErrors = ref(false);
const emailError = ref('');
const passwordError = ref('');

function validateEmail(email: string) {
  if (!showErrors.value) return ''; // dont show messages before login pressed
  if (!email) {
    return 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    return 'Please enter a valid email address';
  }
  return '';
}


function validatePassword(password: string) {
  if (!showErrors.value) return ''; // dont show messages before login pressed
  if (!password) {
    return 'Password is required';
  }
  return '';
}

const handleLogin = async () => {
  showErrors.value = true;
  emailError.value = validateEmail(formData.value.email);
  passwordError.value = validatePassword(formData.value.password);
  if (emailError.value || passwordError.value) { // if there are errors, do not proceed with login
    toast.value = { isOpen: true, message: 'Please correct the errors before logging in', color: 'danger' };
    return;
  }
  
  loginRequested.value = true; // disable login button
  try {
    const userCredentials = await signInWithEmailAndPassword(firebaseAuth, formData.value.email, formData.value.password);
    const user = userCredentials.user;

    if (user.emailVerified) {
      toast.value = { isOpen: true, message: 'Login successful!', color: 'success'}
      showErrors.value = false;
      router.push("/feed");
    } else {
      toast.value = { isOpen: true, message: 'Please verify your email before logging in with the link sent to ' + formData.value.email, color: 'danger'}
    }
  } catch (error: any) {
    toast.value = { isOpen: true, message: "Error while logging in: " + error.message, color: 'danger'}
    console.error("Error while logging in: " + error.message);
  } finally {
    loginRequested.value = false;
  } 
};
</script>
