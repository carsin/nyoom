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
            <ion-label> {{ upvoteCount?.toString() }}</ion-label>
          </ion-chip>
          <ion-chip color="danger" @click="handleVote(imageId, false)">
            <ion-icon aria-hidden="true" :icon="arrowDownCircle" />
            <ion-label> {{ downvoteCount?.toString() }}</ion-label>
          </ion-chip>
        </ion-col>
      </ion-row>
    </ion-grid>
    <ion-toast :is-open="toast.isOpen" :message="toast.message" :duration="2000" :color="toast.color"
      @didDismiss="toast.isOpen = false"></ion-toast>
  </ion-card>
</template>

<style>
#post-image {
  max-height: 40rem;
}
</style>

<script setup lang="ts">
import { onUnmounted, defineProps, computed, ref } from 'vue';
import { IonCard, IonLabel, IonButton, IonChip, IonCardContent, IonCardSubtitle, IonCardTitle, IonGrid, IonIcon, IonRow, IonCol, IonToast } from '@ionic/vue';
import { arrowUpCircle, arrowDownCircle } from 'ionicons/icons';
import { getDoc, doc, onSnapshot, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { firebaseAuth, db } from "../firebase-service";

const toast = ref({ isOpen: false, message: '', color: '' });

// vue props
const props = defineProps({
  imageId: String,
  username: String,
  caption: String,
  upvotes: Number,
  downvotes: Number,
  image_src: String,
  timestamp: Object,
});

// vue refs for upvotes and downvotes
const upvoteCount = ref(props.upvotes);
const downvoteCount = ref(props.downvotes);

// Function to handle the real-time updates
const handleRealtimeUpdates = () => {
  const postRef = doc(db, 'posts', props.imageId);

  // Listening for real-time updates
  const unsubscribe = onSnapshot(postRef, (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      upvoteCount.value = data.upvoteCount; // Updating upvotes
      downvoteCount.value = data.downvoteCount; // Updating downvotes
    }
  });

  // Cleanup the subscription on component destruction
  onUnmounted(() => {
    unsubscribe();
  });
};

// Calling the function to handle real-time updates
handleRealtimeUpdates();

const handleVote = async (postId: string, isUpvote: boolean) => {
  const postRef = doc(db, 'posts', postId);
  const user = firebaseAuth.currentUser;

  try {
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
        toast.value = { // send success toast
          isOpen: true,
          color: isUpvote ? 'success' : 'danger',
          message: isUpvote ? 'Changed upvote successfully!' : 'Changed downvote successfully!',
        };
      }
    } else { // Handle the case where the user is not logged in
      toast.value = {
        isOpen: true, color: 'danger',
        message: "You are not logged in. Please create an account before voting.",
      };
      console.error("User not logged in.");
    }
  } catch (error: any) {
    toast.value = {
      isOpen: true, color: 'danger',
      message: "Error while voting: " + error.message,
    };
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

