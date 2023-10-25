<template>
  <ion-card>
    <ion-grid>
      <ion-row class="ion-align-self-end ion-justify-content-center">
        <ion-button fill="clear">
          <router-link :to="{ path: `/user/${username}` }">
            <!-- TODO: make these side by side -->
            <ion-col v-if="showAvatar">
              <ion-avatar v-if="avatarUrl">
                <img :src="avatarUrl" alt="User avatar" />
              </ion-avatar>
              <ion-avatar v-else>
                <img src="https://ionicframework.com/docs/img/demos/avatar.svg" alt="Default avatar" />
              </ion-avatar>
            </ion-col>
            <ion-col>
              <ion-card-title color="primary"> {{ username }} </ion-card-title>
            </ion-col>
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
import { onMounted, onUnmounted, defineProps, computed, ref } from 'vue';
import { IonCard, IonLabel, IonButton, IonChip, IonCardContent, IonCardSubtitle, IonCardTitle, IonGrid, IonIcon, IonRow, IonCol, IonToast, IonAvatar } from '@ionic/vue';
import { arrowUpCircle, arrowDownCircle } from 'ionicons/icons';
import { getDoc, getDocs, collection, query, where, doc, onSnapshot, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
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
  showAvatar: Boolean,
});

// vue refs for upvotes and downvotes
const upvoteCount = ref(props.upvotes);
const downvoteCount = ref(props.downvotes);
const avatarUrl = ref(''); // Reactive variable to store the avatar URL

onMounted(async () => {
  // Query Firestore based on the username to get avatar URL
  const userQuery = query(collection(db, 'users'), where('username', '==', props.username));
  const querySnapshot = await getDocs(userQuery);

  if (!querySnapshot.empty) {
    const userData = querySnapshot.docs[0].data();
    avatarUrl.value = userData.avatarUrl || ''; // Set avatar URL
  }
});

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

const toggleVote = (userId, voters, otherVoters, countKey, otherCountKey, updates) => {
  if (voters.includes(userId)) {
    voters.splice(voters.indexOf(userId), 1);
    updates[countKey]--;
  } else {
    voters.push(userId);
    updates[countKey]++;
    if (otherVoters.includes(userId)) {
      otherVoters.splice(otherVoters.indexOf(userId), 1);
      updates[otherCountKey]--;
    }
  }
};

const handleVote = async (postId: string, isUpvote: boolean) => {
  const postRef = doc(db, 'posts', postId);
  const user = firebaseAuth.currentUser;

  try {
    if (!user) {
      // Handle the case where the user is not logged in
      toast.value = {
        isOpen: true, color: 'danger',
        message: "You are not logged in. Please create an account before voting.",
      };
      return;
    }

    const userId = user.uid;
    const postDoc = await getDoc(postRef);

    if (postDoc.exists()) {
      const postData = postDoc.data();
      const updates = {
        upvoters: postData.upvoters || [],
        downvoters: postData.downvoters || [],
        upvoteCount: postData.upvoteCount || 0,
        downvoteCount: postData.downvoteCount || 0,
      };

      if (isUpvote) {
        toggleVote(userId, updates.upvoters, updates.downvoters, 'upvoteCount', 'downvoteCount', updates);
      } else {
        toggleVote(userId, updates.downvoters, updates.upvoters, 'downvoteCount', 'upvoteCount', updates);
      }

      await updateDoc(postRef, updates);
      toast.value = {
        isOpen: true,
        color: isUpvote ? 'success' : 'danger',
        message: isUpvote ? 'Changed upvote successfully!' : 'Changed downvote successfully!',
      };
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

