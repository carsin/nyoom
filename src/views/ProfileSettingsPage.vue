<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Profile Settings</ion-title>
        <ion-button class="back" slot="end" fill="outline" href="/my-profile">Back</ion-button>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <!-- TODO: Make this look good -->
      <ion-progress-bar v-if="isUploading" :value="uploadProgress / 100"></ion-progress-bar>
      <ion-item>
        <img class="profile-avatar" :src="avatarUrl">
      </ion-item>
      <ion-item>
        <ion-label>Change Avatar:</ion-label>
        <ion-input type="file" @change="uploadAvatar"></ion-input>
      </ion-item>
      <!-- TODO: Implement this functionality -->
      <!-- <ion-item> -->
      <!--   <ion-input label="Change Username:" placeholder="Enter new username"></ion-input> -->
      <!--   <ion-button id="change-username" fill="outline">Confirm</ion-button> -->
      <!-- </ion-item> -->
      <!-- <ion-item> -->
      <!--   <ion-input label="Change Email:" type="email" placeholder="Enter new email"></ion-input> -->
      <!--   <ion-button id="change-email" fill="outline">Confirm</ion-button> -->
      <!-- </ion-item> -->
      <!-- <ion-button id="change-password" expand="block" fill="outline"> Send Password Change to Email </ion-button> -->
      <!---->
      <!-- <ion-toast trigger="change-username" message="Username change request received, confirm this change from your registered email." :duration="3000"></ion-toast> -->
      <!-- <ion-toast trigger="change-email" message="Email request change received, confirm this change from your previous email address." :duration="3000"></ion-toast> -->
      <!-- <ion-toast trigger="change-password" message="Password request change sent to email." :duration="3000"></ion-toast> -->
      <ion-toast :is-open="toast.isOpen" :message="toast.message" :color="toast.color" :duration="2000" @didDismiss="toast.isOpen = false"></ion-toast>
    </ion-content>
  </ion-page>
</template>

<style>
.back{
  padding-right: 15px;
}
</style>
  
<script setup lang="ts">
import { IonPage, IonToast, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/vue';

import { ref, onMounted } from 'vue';
import { uploadImageToFirebase } from '../util/uploadImage';
import { firebaseAuth, db } from "../firebase-service"; 
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const uploadProgress = ref(0);
const isUploading = ref(false);
const toast = ref({ isOpen: false, message: '', color: '' });
const avatarUrl = ref('');

// get users profile picture on load
onMounted(async () => {
  const user = firebaseAuth.currentUser;
  if (user) {
    const userDocRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      avatarUrl.value = docSnap.data().avatarUrl;
      if (avatarUrl.value == "") {
        avatarUrl.value = "https://ionicframework.com/docs/img/demos/avatar.svg";
      }
    }
  }
});

const uploadAvatar = async (event: any) => {
  const user = firebaseAuth.currentUser;
  const file = event.target.files[0];
  isUploading.value = true;

  try {
    const newAvatarUrl = await uploadImageToFirebase(file, 'avatars', (progress) => {
      uploadProgress.value = progress;
    });
    if (user) {
      // change url in database
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        avatarUrl: newAvatarUrl
      });
      // update UI
      avatarUrl.value = newAvatarUrl; 
      isUploading.value = false;
      toast.value = { isOpen: true, message: "Successfully uploaded avatar!", color: "success" };
    }
    
  } catch (error: any) {
    toast.value = { isOpen: true, message: "An error occurred: " + error.message, color: "danger" };
    isUploading.value = false;
  }
};
</script>
  
