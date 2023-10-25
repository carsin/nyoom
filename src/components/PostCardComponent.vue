<template>
  <ion-card>
    <ion-grid>
      <ion-row class="ion-align-self-end ion-justify-content-center">
        <ion-button fill="clear">
          <router-link :to="{ path: `/user/${username}` }">
            <ion-card-title color="primary"> {{ username }} </ion-card-title>
          </router-link>
        </ion-button>
      </ion-row>
      <ion-row class="ion-justify-content-center">
        <img id="post-image" v-bind:src="image_src" alt="Post image content" /> <!-- v-bind: use prop in attribute -->
      </ion-row>
      <ion-row class="ion-align-self-end ion-justify-content-center">
        <ion-card-subtitle> {{ formattedTimestamp }} </ion-card-subtitle>
      </ion-row>
      <ion-row>
        <ion-col class="ion-text-left ion-align-self-top" size="8">
          <ion-card-content> {{ caption }} </ion-card-content>
        </ion-col>
        <ion-col class="ion-text-end ion-align-self-top" size="4">
          <ion-chip color="success" @click="handleUpvote(imageId)">
            <ion-icon aria-hidden="true" :icon="arrowUpCircle" />
            <ion-label> {{ upvotes }}</ion-label>
          </ion-chip>
          <ion-chip color="danger">
            <ion-icon aria-hidden="true" :icon="arrowDownCircle" />
            <ion-label> {{ downvotes }}</ion-label>
          </ion-chip>
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-card>
</template>

<style>
#post-image {
  max-height: 40rem;
}
</style>

<script setup lang="ts">
import { defineProps, computed } from 'vue';
import { IonCard, IonLabel, IonButton, IonChip, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonGrid, IonIcon, IonRow, IonCol } from '@ionic/vue';
import { arrowUpCircle, arrowDownCircle } from 'ionicons/icons';
import { getDoc, doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { firebaseAuth, db } from "../firebase-service";

// html props
const props = defineProps({
  imageId: String,
  username: String,
  caption: String,
  upvotes: String,
  downvotes: String,
  image_src: String,
  timestamp: Object,
});

const handleUpvote = async (postId: string) => {
  const postRef = doc(db, 'posts', postId);
  const user = firebaseAuth.currentUser;

  if (user) {
    const userId = user.uid;

    // Get the post document to check if the user has already upvoted
    const postDoc = await getDoc(postRef);

    if (postDoc.exists()) {
      const postData = postDoc.data();
      const upvotes = postData.upvotes || [];

      if (upvotes.includes(userId)) {
        // User has already upvoted, so remove the upvote
        await updateDoc(postRef, {
          upvoters: arrayRemove(userId),
          upvoteCount: postData.upvoteCount - 1
        });
      } else {
        // User has not upvoted, so add the upvote
        await updateDoc(postRef, {
          upvoters: arrayUnion(userId),
          upvoteCount: postData.upvoteCount + 1
        });
      }
    }
  } else {
    // Handle the case where the user is not logged in
    console.error("User not logged in.");
  }
}
  
const handleDownvote = async (postId: string) => {
  const postRef = doc(db, 'posts', postId);
  const user = firebaseAuth.currentUser;

  if (user) {
    const userId = user.uid;

    // Get the post document to check if the user has already upvoted
    const postDoc = await getDoc(postRef);

    if (postDoc.exists()) {
      const postData = postDoc.data();
      const downvoters = postData.downvoters || [];

      if (downvoters.includes(userId)) {
        // User has already downvoted, so remove the downvote
        await updateDoc(postRef, {
          downvoters: arrayRemove(userId),
          downvoteCount: postData.downvoteCount - 1
        });
      } else {
        // User has not downvoted, so add the downvote
        await updateDoc(postRef, {
          downvoters: arrayUnion(userId),
          downvoteCount: postData.downvoteCount + 1
        });
      }
    }
  } else {
    // Handle the case where the user is not logged in
    console.error("User not logged in.");
  }
}

const formattedTimestamp = computed(() => {
  if (props.timestamp) {
    const date = props.timestamp.toDate(); // Convert Firestore timestamp to JavaScript Date
    return date.toLocaleString();
  }
  return '';
});
</script>

