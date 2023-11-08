<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Profile Settings</ion-title>
        <ion-button class="ion-padding-end" slot="end" fill="outline" :href="userProfileHref">
          Back to Profile
        </ion-button>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <!-- TODO: Make this look good (center) -->
      <ion-progress-bar v-if="isUploading" :value="uploadProgress / 100"></ion-progress-bar>
      <ion-grid>
        <ion-row class="ion-justify-content-center">
          <ion-col>
            <ion-list>
              <ion-item>
                <img v-if="avatarUrl" class="profile-avatar" :src="avatarUrl" alt="Avatar image"/>
                <img v-else class="profile-avatar" ref="imageFileUpload" src="https://ionicframework.com/docs/img/demos/avatar.svg" alt="Default avatar" />
              </ion-item>
              <ion-item>
                <ion-label position="stacked" id="avatar" color="primary" aria-label="Change Avatar">Change Avatar:</ion-label>
                <input aria-labelledby="avatarImgUp" type="file" @change="updateAvatar"/>
              </ion-item>
              <ion-item>
                <ion-label position="stacked" color="primary"> <b>Edit Bio</b> </ion-label>
                <div class="bio-container ion-align-items-center">
                  <ion-textarea placeholder="Enter new biography" v-model="newBiography" :maxlength="MAX_BIO_LENGTH" aria-label="Edit Bio" class="bio-textarea" :autoGrow="true" :counter="true"/>
                  <ion-button :disabled="newBiography.length > MAX_BIO_LENGTH" @click="handleBioUpdate" fill="outline" size="default" class="bio-button">Update</ion-button>
                </div>
              </ion-item>
            </ion-list>
          </ion-col>
        </ion-row>
      </ion-grid>
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
.bio-container {
  display: flex;
  width: 100%;
}

.bio-textarea {
  flex: 1; /* Allows the textarea to grow and take available space */
}

.bio-button {
  margin-left: 10px; /* Adds some space between the textarea and button */
  justify-self: end;
  
}
</style>

<script setup lang="ts">
import { IonGrid, IonRow, IonCol, IonPage, IonToast, IonHeader, IonTextarea, IonList, IonLabel, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonProgressBar } from '@ionic/vue';
import { ref, onMounted } from 'vue';
import { firebaseAuth, db } from "../firebase-service";
import { doc, getDoc } from 'firebase/firestore';
import { MAX_BIO_LENGTH } from "../util/constants"
import { profileManager } from '../services/ManageProfileService';

const uploadProgress = ref(0);
const isUploading = ref(false);
const toast = ref({ isOpen: false, message: '', color: '' });
const avatarUrl = ref('');
const newBiography = ref(''); // reactive variable to store the new biography input
const userProfileHref = ref('/feed');
const user = firebaseAuth.currentUser;

// get users data and update profile picture on load
onMounted(async () => {
  if (user) {
    const userDocRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      avatarUrl.value = docSnap.data().avatarUrl;
      const username = docSnap.data().username;
      newBiography.value = docSnap.data().biography;
      userProfileHref.value = `/user/${username}`; // update back button url reference
    }
  }
});

const handleBioUpdate = async () => {
  const result = await profileManager.updateBiography(newBiography.value);
  if (result.success) {
    toast.value = { isOpen: true, color: 'success', message: result.message };
  } else {
    toast.value = { isOpen: true, color: 'danger', message: result.message };
  }
};

const updateAvatar = async (event: any) => {
  const file = event.target.files[0];
  isUploading.value = true;
  const result = await profileManager.updateAvatar(file, (progress) => {
    uploadProgress.value = progress;
  });
  // handle result
  if (result.success && result.avatarUrl) {
    avatarUrl.value = result.avatarUrl;
    toast.value = { isOpen: true, color: 'success', message: result.message };
  } else {
    toast.value = { isOpen: true, color: 'danger', message: result.message };
  }
  isUploading.value = false;
};
</script>
