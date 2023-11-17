<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="goBack" class="back-button">
            <ion-icon
              slot="icon-only"
              name="arrow-back"
              class="icon-color"
            ></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Sell Part</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-progress-bar
        v-if="isUploading"
        :value="uploadProgress"
      ></ion-progress-bar>
      <ion-grid>
        <ion-row>
          <ion-col size-md="6" offset-md="3">
            <ion-item>
              <ion-label position="floating">Item Name: </ion-label>
              <ion-input v-model="itemName" />
            </ion-item>
            <ion-item>
              <ion-label position="floating">Price: </ion-label>
              <ion-input v-model="price" />
            </ion-item>
            <ion-item>
              <ion-label position="floating">Condition: </ion-label>
              <ion-input v-model="condition" />
            </ion-item>
            <ion-item>
              <ion-label position="floating">Description: </ion-label>
              <ion-input v-model="description" />
            </ion-item>
            <ion-item>
              <ion-label position="floating">Location: </ion-label>
              <ion-input v-model="location" />
            </ion-item>
            <ion-item v-if="imageURL">
              <img :src="imageURL" alt="Uploaded Image" />
            </ion-item>

            <ion-item>
              <input type="file" accept="image/*" @change="uploadImage" />
            </ion-item>

            <ion-button expand="block" @click="createPart"
              >List Part</ion-button
            >
          </ion-col>
        </ion-row>
      </ion-grid>
      <ion-toast
        :is-open="toast.isOpen"
        :message="toast.message"
        :color="toast.color"
        :duration="2000"
        @didDismiss="toast.isOpen = false"
      ></ion-toast>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonProgressBar,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonToast,
} from "@ionic/vue";

import { firebaseAuth, db, storage } from "../firebase-service";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import {
  uploadBytesResumable,
  getDownloadURL,
  ref as storageRef,
} from "firebase/storage";
import { useRouter } from "vue-router";

const isUploading = ref(false);
const uploadProgress = ref(0);
const toast = ref({ isOpen: false, message: "", color: "" });
const caption = ref("");
const router = useRouter();
let imageURL = "";

// upload image to firebase storage before creating post
const uploadImage = async (event: any) => {
  isUploading.value = true;
  const file = event.target.files[0];
  const storageReference = storageRef(storage, "posts/" + file.name);
  const uploadTask = uploadBytesResumable(storageReference, file);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = snapshot.bytesTransferred / snapshot.totalBytes;
      uploadProgress.value = progress;
    },
    (error) => {
      toast.value = {
        isOpen: true,
        message: "Upload failed: " + error.message,
        color: "danger",
      };
      isUploading.value = false;
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        imageURL = downloadURL;
        isUploading.value = false;
        toast.value = {
          isOpen: true,
          message: "Image uploaded successfully!",
          color: "success",
        };
      });
    }
  );
};

// sending post to posts firestore collection
const seller = ref("");
const sellerId = ref("");
const itemName = ref("");
const price = ref<number | null>(null);
const description = ref("");
const condition = ref("");
const location = ref("");
const images = ref([]);

const createPart = async () => {
  const partsCollection = collection(db, "parts");
  const user = firebaseAuth.currentUser;

  try {
    // Check if the imageURL is empty
    if (!imageURL) {
      toast.value = {
        isOpen: true,
        message: "Please upload an image for the part.",
        color: "danger",
      };
      return; // Don't proceed if the image is empty
    }

    // Check if the price is a valid number
    if (isNaN(price.value)) {
      throw new Error("Price must be a valid number.");
    }
    // Check if the price is not null or empty
    if (price.value === null || price.value === "") {
      throw new Error("Price cannot be empty.");
    }
    // Check if the item name is not null or empty
    if (itemName.value === null || itemName.value === "") {
      throw new Error("Item name cannot be empty.");
    }

    if (user) {
      // get user data
      const userDocRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        await addDoc(partsCollection, {
          userId: user.uid,
          seller: docSnap.data().username,
          itemName: itemName.value,
          price: price.value,
          condition: condition.value,
          description: description.value,
          location: location.value,
          images: imageURL,
        });
        toast.value = {
          isOpen: true,
          message: "Part listed successfully!",
          color: "success",
        };
        router.push("/market");
      } else {
        throw new Error("User data does not exist.");
      }
    } else {
      throw new Error("User is not authenticated.");
    }
  } catch (error: any) {
    console.error("Error creating part:", error.message);
    toast.value = {
      isOpen: true,
      message: "Error creating part: " + error.message,
      color: "danger",
    };
  }
};

const goBack = () => {
  router.back();
};
</script>
