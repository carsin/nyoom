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
        <ion-label position="stacked">Change Avatar:</ion-label>
        <input type="file" @change="updateAvatar"/>
      </ion-item>
      <ion-item>
        <ion-label id="editBioLabel" position="stacked">Edit Bio ({{ remainingChars }}/{{ MAX_BIO_LENGTH }}):</ion-label>
        <ion-input placeholder="New biography" v-model="newBiography" :maxlength="MAX_BIO_LENGTH" aria-labelledby="editBioLabel"></ion-input>
        <ion-button :disabled="remainingChars < 0" @click="updateBiography" fill="outline" size="default">Update Biography</ion-button>
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
import { IonPage, IonToast, IonHeader, IonInput, IonLabel, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonProgressBar } from '@ionic/vue';
import { ref, onMounted, computed } from 'vue';
import { uploadImageToFirebase } from '../util/uploadImage';
import { firebaseAuth, db } from "../firebase-service"; 
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const MAX_BIO_LENGTH = 150; // You can adjust this value as needed
const uploadProgress = ref(0);
const isUploading = ref(false);
const toast = ref({ isOpen: false, message: '', color: '' });
const avatarUrl = ref('');
const newBiography = ref(''); // Reactive variable to store the new biography input
// Computed property to calculate the remaining characters
const remainingChars = computed(() => MAX_BIO_LENGTH - newBiography.value.length);

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

const updateBiography = async () => {
  const user = firebaseAuth.currentUser;
  if (user && newBiography.value.trim() !== '' && remainingChars.value >= 0) {
    try {
      // Update the biography in the Firestore database
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        biography: newBiography.value.trim()
      });
      
      toast.value = { isOpen: true, message: "Biography updated successfully!", color: "success" };
    } catch (error: any) {
      toast.value = { isOpen: true, message: "An error occurred: " + error.message, color: "danger" };
    }
  } else {
    toast.value = { isOpen: true, message: "Biography is invalid. Ensure it is not empty and within the character limit.", color: "danger" };
  }
};

const updateAvatar = async (event: any) => {
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
  
