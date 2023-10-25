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
          <ion-chip color="success" @click="handleVote(true)">
            <ion-icon aria-hidden="true" :icon="arrowUpCircle" />
            <ion-label> {{ postData.upvotes.toString() }}</ion-label>
          </ion-chip>
          <ion-chip color="danger" @click="handleVote(false)">
            <ion-icon aria-hidden="true" :icon="arrowDownCircle" />
            <ion-label> {{ postData.toString() }}</ion-label>
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
import { defineProps, computed, ref } from 'vue';
import { IonCard, IonLabel, IonButton, IonChip, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonGrid, IonIcon, IonRow, IonCol, IonToast } from '@ionic/vue';
import { arrowUpCircle, arrowDownCircle } from 'ionicons/icons';
import { getDoc, doc, updateDoc, arrayUnion, arrayRemove, DocumentData } from "firebase/firestore";
import { useDocument } from 'vuefire';
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

const user = firebaseAuth.currentUser;
let postData = ref<DocumentData>();

try {
  console.log()
  const postRef = doc(db, 'posts', props.imageId); // fetching the post document from Firestore 
  const { data } = useDocument(postRef);
  
  if (data.value) {
    postData.value = data.value;
  } else {
    toast.value = {
      isOpen: true, color: 'danger',
      message: "Post data is unavailable",
    }
    throw new Error("Post data is not available");
  }

} catch (error: any) {
  console.error(error.message);
  toast.value = {
    isOpen: true, color: 'danger',
    message: "Error fetching post data: " + error.message,
  };
}

const handleVote = async (isUpvote: boolean) => {
  try {
    if (user) {
      const userId = user.uid;

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
      await updateDoc(postDoc, updates);
      toast.value = { // send success toast
        isOpen: true, color: 'success',
        message: isUpvote ? 'Upvoted successfully!' : 'Downvoted successfully!',
      };
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

