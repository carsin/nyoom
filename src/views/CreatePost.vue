<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Create Post</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-progress-bar v-if="isUploading" :value="uploadProgress"></ion-progress-bar>
      <ion-grid>
        <ion-row>
          <ion-col size-md="6" offset-md="3">
            <ion-item>
              <ion-label position="floating">Caption: </ion-label>
              <ion-input v-model="caption" />
            </ion-item>
            <ion-item v-if="imageURL">
              <img :src="imageURL" alt="Uploaded Image" />
            </ion-item>

            <ion-item>
              <input type="file" accept="image/*" @change="uploadImage" />
            </ion-item>

            <ion-button expand="block" @click="createPost">Create Post</ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
      <ion-toast :is-open="toast.isOpen" :message="toast.message" :color="toast.color" :duration="2000" @didDismiss="toast.isOpen = false"></ion-toast>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonProgressBar, IonContent, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonInput, IonButton, IonToast } from '@ionic/vue';

import { firebaseAuth, db, storage } from "../firebase-service"; 
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import { uploadBytesResumable, getDownloadURL, ref as storageRef } from "firebase/storage";
import { useRouter } from 'vue-router';

const isUploading = ref(false);
const uploadProgress = ref(0);
const toast = ref({ isOpen: false, message: '', color: '' });
const caption = ref('');
const router = useRouter();
let imageURL = '';

// upload image to firebase storage before creating post
const uploadImage = async (event: any) => {
  isUploading.value = true;
  const file = event.target.files[0];
  const storageReference = storageRef(storage, 'posts/' + file.name);
  const uploadTask = uploadBytesResumable(storageReference, file);

  uploadTask.on('state_changed', 
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes);
      uploadProgress.value = progress;
    }, 
    (error) => {
      toast.value = { isOpen: true, message: 'Upload failed: ' + error.message, color: "danger" };
      isUploading.value = false;
    }, 
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        imageURL = downloadURL;
        isUploading.value = false;
        toast.value = { isOpen: true, message: 'Image uploaded successfully!', color: "success"};
      });
    }
  );
};

// sending post to posts firestore collection
const createPost = async () => {
  const postsCollection = collection(db, 'posts');
  const user = firebaseAuth.currentUser;

  // get userdata for username and uid
  if (user) {
    // get user data
    const userDocRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      await addDoc(postsCollection, {
        userId: user.uid,
        username: docSnap.data().username,
        imageURL,
        caption: caption.value,
        upvotes: 0,
        downvotes: 0,
        timestamp: new Date() // Or use Firebase server timestamp
      });
    }
    toast.value = { isOpen: true, message: 'Post created successfully!', color: "success"};
    router.push("/my-profile");
  }
};

</script>
