<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Register</ion-title>
        <ion-button class="ion-margin-end" slot="end" href="/">Back</ion-button>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-loading :is-open="isLoading" message="Checking details..."></ion-loading>
      <form @submit.prevent="handleRegister">
        <ion-list>
          <!-- Email input -->
          <ion-item>
            <ion-input v-model="formData.email" @keyup.enter="handleRegister" label="Email:" label-placement="stacked"
              placeholder="email@domain.com" :color="showErrors && emailError ? 'danger' : ''"></ion-input>
          </ion-item>
          <ion-item class="form-error-note" v-if="showErrors && emailError">
            <ion-note color="danger" class="">{{ emailError }}</ion-note>
          </ion-item>
          <!-- Username input -->
          <ion-item>
            <ion-input label="Username: " label-placement="stacked" @keyup.enter="handleRegister"
              v-model="formData.username" :maxlength="MAX_USERNAME_LENGTH"
              placeholder="hehexd123"></ion-input>
          </ion-item>
          <ion-item class="form-error-note" v-if="showErrors && usernameError">
            <ion-note color="danger" class="">{{ usernameError }}</ion-note>
          </ion-item>
          <!-- Password input -->
          <ion-item>
            <ion-input label="Password:" label-placement="stacked" @keyup.enter="handleRegister"
              v-model="formData.password" type="password" placeholder="••••••••"></ion-input>
          </ion-item>
          <ion-item class="form-error-note" v-if="showErrors && passwordError">
            <ion-note color="danger" class="">{{ passwordError }}</ion-note>
          </ion-item>
          <ion-item>
            <ion-input label="Confirm Password: " label-placement="stacked" v-model="formData.confirmPassword"
              @keyup.enter="handleRegister" type="password" placeholder="••••••••"></ion-input>
          </ion-item>
          <ion-item class="form-error-note" v-if="showErrors && confirmPasswordError">
            <ion-note color="danger" class="">{{ confirmPasswordError }}</ion-note>
          </ion-item>
          <ion-button :disabled="registerRequested" type="submit" expand="block" class="ion-margin-top">
            Register </ion-button>
        </ion-list>
      </form>
      <ion-toast :is-open="toast.isOpen" :message="toast.message" :duration="3000" :color="toast.color"
      @didDismiss="toast.isOpen = false"></ion-toast>
    </ion-content>
  </ion-page>
</template>

<style>
.form-error-note {
  /* make error messages not the same size as other items */
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
import { ref } from 'vue';
import { IonPage, IonHeader, IonLoading, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonInput, IonButton, IonToast, IonNote } from '@ionic/vue';
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { useRouter } from 'vue-router';
import { firebaseAuth, db } from "../firebase-service";
import { doc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { MAX_USERNAME_LENGTH } from "../util/constants"

const formData = ref({
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
});
const router = useRouter();
const registerRequested = ref(false);
const showErrors = ref(false);
const isLoading = ref(false);
const toast = ref({ isOpen: false, message: '', color: '' });
const emailError = ref('');
const usernameError = ref('');
const passwordError = ref('');
const confirmPasswordError = ref('');

const checkUsernameTaken = async (username: string) => {
  username = username.toLocaleLowerCase();
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('username', '==', username));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

function validateEmail(email: string) {
  if (!email) {
    return 'Email is required';
  } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
    return 'Please enter a valid email address';
  }
  return '';
}

async function validateUsername(username: string) {
  username = username.toLocaleLowerCase();
  if (!username) {
    return 'Username is required';
  } else if (username.length < 3) {
    return 'Username must be at least 3 characters long';
  } else if (username.length > MAX_USERNAME_LENGTH) {
    return 'Username must be ' + MAX_USERNAME_LENGTH + ' characters or less';
  } else if (/\W/.test(username)) { // adjust the regex based on username criteria
    return 'Username can only contain letters, numbers, and underscores';
  } else if (await checkUsernameTaken(username)) {
    return 'Username is already taken. Please choose another one';
  }
  return '';
}

function validatePassword(password: string) {
  if (!password) {
    return 'Password is required';
  } else if (password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  return '';
}

function validateConfirmPassword(password: string, confirmPassword: string) {
  if (!confirmPassword) {
    return 'Password confirmation is required';
  } else if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return '';
}

const handleRegister = async () => {
  isLoading.value = true;
  showErrors.value = true;
  registerRequested.value = true;
  emailError.value = validateEmail(formData.value.email);
  passwordError.value = validatePassword(formData.value.password);
  confirmPasswordError.value = validateConfirmPassword(formData.value.password, formData.value.confirmPassword);
  usernameError.value = await validateUsername(formData.value.username);

  // Now check if there are any errors before proceeding
  if (emailError.value || usernameError.value || passwordError.value || confirmPasswordError.value) {
    toast.value = { isOpen: true, message: 'Please correct the errors before registering', color: 'danger' };
    registerRequested.value = false;
    isLoading.value = false;
    return;
  }
  
  const username = formData.value.username.toLocaleLowerCase();

  try {
    const userCredentials = await createUserWithEmailAndPassword(firebaseAuth, formData.value.email.toString(), formData.value.password.toString());
    const user = userCredentials.user;
    await sendEmailVerification(user);

    // store user info in Firestore
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, {
      username: username,
      avatarUrl: "",
      email: formData.value.email,
      biography: "",
      followers: [],
      following: [],
      subscribedEvents: [],
    });

    toast.value = { isOpen: true, message: 'Account created successfully! Please verify your email in the link sent to ' + formData.value.email, color: 'success' }
    router.push("/verify-email");
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      emailError.value = 'That email address is already in use';
      toast.value = { isOpen: true, message: emailError.value, color: 'danger' }
    } else {
      toast.value = { isOpen: true, message: "Error creating account: " + error.message, color: 'danger' }
    }
  } finally {
    registerRequested.value = false;
    isLoading.value = false;
  }
} 
</script>
