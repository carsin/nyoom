<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Profile Settings</ion-title>
        <ion-button class="ion-padding-end" slot="end" fill="outline"
          @click="router.go(-1)">
          Back to Profile
        </ion-button>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-progress-bar v-if="isUploading" :value="uploadProgress / 100"></ion-progress-bar>
      <ion-grid>
        <ion-row class="ion-justify-content-center">
          <ion-col>
            <ion-list>
              <ion-item>
                <img class="profile-avatar" :src="avatarUrl || 'https://ionicframework.com/docs/img/demos/avatar.svg'" alt="Avatar image"/>
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
import { useRouter } from 'vue-router';

const router = useRouter();
const uploadProgress = ref(0);
const isUploading = ref(false);
const toast = ref({ isOpen: false, message: '', color: '' });
const avatarUrl = ref('');
const newBiography = ref(''); // reactive variable to store the new biography input
const user = firebaseAuth.currentUser;

onMounted(async () => {
  // get users data and update profile picture on load
  if (user) {
    const userDocRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      avatarUrl.value = docSnap.data().avatarUrl;
      newBiography.value = docSnap.data().biography;
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
  isUploading.value = true;
  const file = event.target.files[0];
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
