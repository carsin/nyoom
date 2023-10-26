<template>
  <ion-card>
    <ion-grid>
      <ion-row>
        <ion-button fill="clear">
          <!-- TODO: Fix layout -->
          <ion-col size="10" class="ion-float-left">
            <router-link v-if="showAvatar" :to="{ path: `/user/${username}` }">
              <ion-col>
                <ion-avatar v-if="avatarUrl">
                  <img :src="avatarUrl" alt="User avatar" />
                </ion-avatar>
                <ion-avatar v-else>
                  <img src="https://ionicframework.com/docs/img/demos/avatar.svg" alt="Default avatar" />
                </ion-avatar>
              </ion-col>
              <ion-col>
                <ion-card-title color="primary"> @{{ username }} </ion-card-title>
              </ion-col>
            </router-link>
          </ion-col>
        </ion-button>
        <ion-col size="2" v-if="isOwner" class="ion-float-right">
          <ion-button fill="clear" @click="confirmDelete">
            <ion-icon aria-hidden="true" color="danger" slot="icon-only" :icon="trash" />
          </ion-button>
        </ion-col>
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
    <ion-toast :is-open="toast.isOpen" :message="toast.message" :duration="2000" :color="toast.color" @didDismiss="toast.isOpen = false"></ion-toast>
  </ion-card>
</template>

<style>
#post-image {
  max-height: 40rem;
}
</style>

<script setup lang="ts">
import { onMounted, onUnmounted, computed, ref } from 'vue';
import { alertController, IonCard, IonLabel, IonButton, IonChip, IonCardContent, IonCardSubtitle, IonCardTitle, IonGrid, IonIcon, IonRow, IonCol, IonToast, IonAvatar } from '@ionic/vue';
import { arrowUpCircle, arrowDownCircle, trash } from 'ionicons/icons';
import { deleteDoc, getDoc, getDocs, collection, query, where, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { firebaseAuth, db, storage } from "../firebase-service";
import { useRouter } from 'vue-router';

const toast = ref({ isOpen: false, message: '', color: '' });

// vue props
const props = defineProps({
  userId: String,
  imageId: String,
  username: String,
  caption: String,
  upvotes: Number,
  downvotes: Number,
  image_src: String,
  imagePath: String,
  timestamp: Object,
  showAvatar: Boolean,
});

// vue refs for upvotes and downvotes
const router = useRouter();
const upvoteCount = ref(props.upvotes);
const downvoteCount = ref(props.downvotes);
const avatarUrl = ref(''); // Reactive variable to store the avatar URL
const isOwner = ref(false);

onMounted(async () => {
  // Query Firestore based on the username to get avatar URL
  const user = firebaseAuth.currentUser;
  const userQuery = query(collection(db, 'users'), where('username', '==', props.username));
  const querySnapshot = await getDocs(userQuery);

  // check if post belongs to currently authenticated user
  if (user && user.uid === props.userId) {
    console.log(isOwner);
    isOwner.value = true;
  }

  // get avatar belonging to post creator
  if (!querySnapshot.empty) {
    const userData = querySnapshot.docs[0].data();
    avatarUrl.value = userData.avatarUrl || ''; // Set avatar URL
  }

  // Calling the function to handle real-time updates
  handleRealtimeUpdates();
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

// Function to show a confirmation dialog before deletion
const confirmDelete = async () => {
  const alert = await alertController.create({
    header: 'Confirm Delete',
    message: 'Are you sure you want to delete this post?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel'
      },
      {
        text: 'Delete',
        handler: handleDelete
      }
    ]
  });
  await alert.present();
};

// Function to handle the deletion of the post
const handleDelete = async () => {
  try {
    const postRef = doc(db, 'posts', props.imageId);
    await deleteDoc(postRef);
    toast.value = {
      isOpen: true, color: 'danger',
      message: "Successfully deleted the post. Good riddance!",
    };
    router.go(0)
  } catch (error: any) {
    toast.value = {
      isOpen: true, color: 'danger',
      message: "Error while deleting post: " + error.message,
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

