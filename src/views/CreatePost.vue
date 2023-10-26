<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Create Post</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-progress-bar v-if="isUploading" :value="uploadProgress / 100"></ion-progress-bar>
      <ion-grid>
        <ion-row>
          <ion-col size-md="6" offset-md="3">
            <ion-list>
              <ion-item v-if="imageUrl">
                <img :src="imageUrl" alt="Uploaded Image" />
              </ion-item>
              <ion-item>
                <ion-label color="primary" position="stacked">Upload a photo: </ion-label>
                <!-- TODO: ensure user can't spam database with photos -->
                <input type="file" accept="image/*" @change="uploadImage" class="ion-margin-top"/>
              </ion-item>
              <ion-item>
                <ion-label position="stacked" color="primary" class="ion-margin-bottom"> <b>Enter Caption</b> ({{ caption.length }}/{{ MAX_CAPTION_LENGTH }}):
                </ion-label>
                <ion-textarea :maxlength="MAX_CAPTION_LENGTH" id="caption-input" v-model="caption" placeholder="Say something witty :p" aria-label="Caption input" :autoGrow="true" :counter="true"></ion-textarea>
              </ion-item>
            </ion-list>
            <ion-button :disabled="caption.length > MAX_CAPTION_LENGTH" expand="block" @click="createPost">Create Post</ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
      <ion-toast :is-open="toast.isOpen" :message="toast.message" :color="toast.color" :duration="2000"
        @didDismiss="toast.isOpen = false"></ion-toast>
    </ion-content>
</ion-page></template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonPage, IonList, IonHeader, IonToolbar, IonTitle, IonProgressBar, IonContent, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonTextarea, IonButton, IonToast } from '@ionic/vue';
import { firebaseAuth, db } from "../firebase-service";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import { useRouter } from 'vue-router';
import { uploadImageToFirebase } from '@/util/uploadImage';
import { MAX_CAPTION_LENGTH } from "../util/constants"

const isUploading = ref(false);
const uploadProgress = ref(0);
const toast = ref({ isOpen: false, message: '', color: '' });
const caption = ref('');
const router = useRouter();
let imageUrl = '';
let imagePath = '';

const uploadImage = async (event: any) => {
  isUploading.value = true;
  const file = event.target.files[0];

  try {
    const imageData = await uploadImageToFirebase(file, 'posts', (progress: number) => {
      uploadProgress.value = progress;
    });
    imageUrl = imageData.downloadURL;
    imagePath = imageData.imagePath; 
    toast.value = { isOpen: true, message: "Successfully uploaded image!", color: "success" };
    isUploading.value = false;
  } catch (error: any) {
    toast.value = { isOpen: true, message: "Error while uploading image: " + error.message, color: "danger" };
    isUploading.value = false;
  }
};

// sending post to posts firestore collection
const createPost = async () => {
  const user = firebaseAuth.currentUser;

  if (!imageUrl || !imagePath) {
    toast.value = { isOpen: true, message: 'No image uploaded!', color: "danger" };
    return;
  } else if (caption.value.length > MAX_CAPTION_LENGTH) {
    toast.value = { isOpen: true, message: 'Caption too long!', color: "danger" };
    return;
  }

  // get userdata for username and uid
  try {
    const postsCollection = collection(db, 'posts');
    if (user) {
      // get user data
      const userDocRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        await addDoc(postsCollection, {
          userId: user.uid,
          username: docSnap.data().username,
          imageUrl: imageUrl,
          imagePath: imagePath,
          caption: caption.value,
          upvoteCount: 0,
          downvoteCount: 0,
          upvoters: [],
          downvoters: [],
          timestamp: new Date() // Or use Firebase server timestamp
        });
      }
      toast.value = { isOpen: true, message: 'Post created successfully!', color: "success"};
      router.push("/feed");
    }
  } catch (error: any){
    toast.value = { isOpen: true, message: 'Error while posting: ' + error.message, color: "danger" };
    console.error(error.message);
  }
};

</script>
