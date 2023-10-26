<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Profile Settings</ion-title>
        <ion-button class="ion-padding-end" slot="end" fill="outline" :href="userProfileHref">
          Back to Profile
          <!-- TODO: Figure out why router links sometimes don't work -->
          <!-- <router-link style="text-decoration: none;" :to="userProfileHref"> -->
            <!-- Back to Profile -->
          <!-- </router-link> -->
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
                <img v-else class="profile-avatar" src="https://ionicframework.com/docs/img/demos/avatar.svg" alt="Default avatar" />
              </ion-item>
              <ion-item>
                <ion-label position="stacked" id="avatar" color="primary" aria-label="Change Avatar">Change Avatar:</ion-label>
                <input aria-labelledby="avatarImgUp" type="file" @change="updateAvatar"/>
              </ion-item>
              <ion-item>
                <ion-label position="stacked" color="primary"> <b>Edit Bio</b> </ion-label>
                <div class="bio-container ion-align-items-center">
                  <ion-textarea placeholder="Enter new biography" v-model="newBiography" :maxlength="MAX_BIO_LENGTH" aria-label="Edit Bio" class="bio-textarea" :autoGrow="true" :counter="true"></ion-textarea>
                  <ion-button :disabled="remainingBioChars < 0" @click="updateBiography" fill="outline" size="default" class="bio-button">Update</ion-button>
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
  /* Allows the textarea to grow and take available space */
  flex: 1;
}

.bio-button {
  /* Adds some space between the textarea and button */
  margin-left: 10px;
  
}
</style>

<script setup lang="ts">
import { IonGrid, IonRow, IonCol, IonPage, IonToast, IonHeader, IonTextarea, IonList, IonLabel, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonProgressBar } from '@ionic/vue';
import { ref, onMounted, computed } from 'vue';
import { uploadImageToFirebase } from '../util/uploadImage';
import { firebaseAuth, db } from "../firebase-service";
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { MAX_BIO_LENGTH } from "../util/constants"

const uploadProgress = ref(0);
const isUploading = ref(false);
const toast = ref({ isOpen: false, message: '', color: '' });
const avatarUrl = ref('');
const newBiography = ref(''); // Reactive variable to store the new biography input
// Computed property to calculate the remaining characters
const remainingBioChars = computed(() => MAX_BIO_LENGTH - newBiography.value.length);
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
      userProfileHref.value = `/user/${username}`; // update back button url reference
    }
  }
});

const updateBiography = async () => {
  if (!user || newBiography.value.length < MAX_BIO_LENGTH) {
    toast.value = { isOpen: true, message: "Error: Biography too long, or you are not signed in!", color: "danger" };
    return;
  }

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
};

const updateAvatar = async (event: any) => {
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
