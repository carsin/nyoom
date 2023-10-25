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
          <ion-chip color="success" @click="handleVote(imageId, true)">
            <ion-icon aria-hidden="true" :icon="arrowUpCircle" />
            <ion-label> {{ upvotes?.toString() }}</ion-label>
          </ion-chip>
          <ion-chip color="danger" @click="handleVote(imageId, false)">
            <ion-icon aria-hidden="true" :icon="arrowDownCircle" />
            <ion-label> {{ downvotes?.toString() }}</ion-label>
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
import { defineProps, computed, ref } from 'vue';
import { IonCard, IonLabel, IonButton, IonChip, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonGrid, IonIcon, IonRow, IonCol } from '@ionic/vue';
import { arrowUpCircle, arrowDownCircle } from 'ionicons/icons';
import { getDoc, doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { firebaseAuth, db } from "../firebase-service";

// html props
const props = defineProps({
  imageId: String,
  username: String,
  caption: String,
  upvotes: Number,
  downvotes: Number,
  image_src: String,
  timestamp: Object,
});

const handleVote = async (postId: string, isUpvote: boolean) => {
  const postRef = doc(db, 'posts', postId);
  const user = firebaseAuth.currentUser;

  if (user) {
    const userId = user.uid;
    const postDoc = await getDoc(postRef);

    if (postDoc.exists()) {
      const postData = postDoc.data();
      const upvoters = postData.upvoters || [];
      const downvoters = postData.downvoters || [];
      let updates: any = {};

      if (isUpvote) {
        // Removing userId from downvoters list and decrement downvoteCount if user had previously downvoted
        if (downvoters.includes(userId)) {
          updates.downvoters = arrayRemove(userId);
          updates.downvoteCount = postData.downvoteCount - 1;
        }

        // If user had previously upvoted, remove the upvote; otherwise, add the upvote
        if (upvoters.includes(userId)) {
          updates.upvoters = arrayRemove(userId);
          updates.upvoteCount = postData.upvoteCount - 1;
        } else {
          updates.upvoters = arrayUnion(userId);
          updates.upvoteCount = postData.upvoteCount + 1;
        }
      } else {
        // Removing userId from upvoters list and decrement upvoteCount if user had previously upvoted
        if (upvoters.includes(userId)) {
          updates.upvoters = arrayRemove(userId);
          updates.upvoteCount = postData.upvoteCount - 1;
        }

        // If user had previously downvoted, remove the downvote; otherwise, add the downvote
        if (downvoters.includes(userId)) {
          updates.downvoters = arrayRemove(userId);
          updates.downvoteCount = postData.downvoteCount - 1;
        } else {
          updates.downvoters = arrayUnion(userId);
          updates.downvoteCount = postData.downvoteCount + 1;
        }
      }

      // Apply the accumulated updates to the post document
      await updateDoc(postRef, updates);
    }
  } else {
    // Handle the case where the user is not logged in
    console.error("User not logged in.");
  }
};

const formattedTimestamp = computed(() => {
  if (props.timestamp) {
    const date = props.timestamp.toDate(); // Convert Firestore timestamp to JavaScript Date
    return date.toLocaleString();
  }
  return '';
});
</script>

