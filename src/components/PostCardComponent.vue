<template>
  <ion-card>
    <ion-card-header v-if="isLoading">
        <ion-progress-bar type="indeterminate"></ion-progress-bar>
    </ion-card-header>
    <ion-grid v-else>
      <!-- Post header -->
      <ion-row>
        <ion-col class="ion-justify-content-center ion-text-left ion-align-items-bottom">
            <ion-button fill="clear">
            <router-link class="avatar-header-link" v-if="showAvatar" style="text-decoration: none;" :to="{ path: `/user/${username}` }">
              <ion-col>
                <ion-avatar v-if="avatarUrl">
                  <img :src="avatarUrl" alt="User avatar" />
                </ion-avatar>
                <ion-avatar v-else>
                  <img src="https://ionicframework.com/docs/img/demos/avatar.svg" alt="Default avatar" />
                </ion-avatar>
              </ion-col>
              <ion-col class="ion-align-items-bottom ion-no-margin ion-margin-start">
                <ion-card-title color="primary"> @{{ username }} </ion-card-title>
                <ion-card-subtitle> {{ formattedTimestamp }} </ion-card-subtitle>
              </ion-col>
            </router-link>
          </ion-button>
        </ion-col>
        <ion-col v-if="!showAvatar" class="ion-text-center ion-align-self-center ion-justify-content-center">
          <ion-card-subtitle> {{ formattedTimestamp }} </ion-card-subtitle>
        </ion-col>
        <ion-col v-if="isOwner" class="ion-justify-content-center ion-align-items-bottom ion-text-end">
          <ion-button fill="clear" v-if="!editingCaption" @click="editingCaption = true">
            <ion-icon aria-hidden="true" slot="icon-only" :icon="pencil" />
          </ion-button>
          <ion-button v-if="editingCaption" color="danger" fill="clear" @click="editingCaption = false">
            <ion-icon aria-hidden="true" slot="icon-only" :icon="close" />
          </ion-button>
          <ion-button fill="clear" @click="confirmDeleteNotification">
            <ion-icon aria-hidden="true" color="danger" slot="icon-only" :icon="trash" />
          </ion-button>
        </ion-col>
      </ion-row>
      <!-- show timestamp if no avatar component -->
      <!-- Post image -->
      <ion-row class="ion-justify-content-center">
        <img id="post-image" :src="image_src" alt="Post image content" />
      </ion-row>
      <!-- Condtional caption editing menu -->
      <ion-row v-if="editingCaption" class="ion-align-items-center">
        <ion-col class="ion-text-left"  size="11">
          <ion-label position="stacked" color="primary"><b>Edit Caption</b> </ion-label>
          <ion-textarea v-model="newCaption" :maxlength="MAX_CAPTION_LENGTH" placeholder="Exude genius here" aria-label="Edit caption input" :counter="true" :autoGrow="true"></ion-textarea>
        </ion-col>
        <ion-col size="1" class="ion-text-right">
          <ion-button :disabled="newCaption.length > MAX_CAPTION_LENGTH" v-if="editingCaption" color="success" @click="saveCaption">
            <ion-icon aria-hidden="true" slot="icon-only" :icon="checkmark" />
          </ion-button>
        </ion-col>
      </ion-row>
      <!-- Caption and vote buttons -->
      <ion-row v-else>
        <ion-col class="ion-text-left ion-align-self-top" size="10">
          <ion-card-content> {{ postCaption }} </ion-card-content>
        </ion-col>
        <ion-col class="ion-text-end ion-align-self-top" size="2">
          <ion-chip color="success" @click="handleVote(imageId, true)">
            <ion-label> {{ upvoteCount?.toString() }}</ion-label>
            <ion-icon aria-hidden="true" :icon="arrowUpCircle" />
          </ion-chip>
          <ion-chip color="danger" @click="handleVote(imageId, false)">
            <ion-label> {{ downvoteCount?.toString() }}</ion-label>
            <ion-icon aria-hidden="true" :icon="arrowDownCircle" />
          </ion-chip>
        </ion-col>
      </ion-row>
    </ion-grid>
    <ion-toast :is-open="toast.isOpen" :message="toast.message" :duration="1000" :color="toast.color" @didDismiss="toast.isOpen = false"></ion-toast>
  </ion-card>
</template>

<style>
#post-image {
  max-height: 50rem;
  border-radius: 0.5rem;
}
</style>

<script setup lang="ts">
import { onMounted, onUnmounted, computed, ref } from 'vue';
import { alertController, IonCard, IonLabel, IonButton, IonChip, IonCardContent, IonCardSubtitle, IonCardTitle, IonGrid, IonIcon, IonProgressBar, IonCardHeader, IonTextarea, IonRow, IonCol, IonToast, IonAvatar } from '@ionic/vue';
import { arrowUpCircle, arrowDownCircle, trash, pencil, checkmark, close } from 'ionicons/icons';
import { deleteDoc, getDoc, getDocs, collection, query, where, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { firebaseAuth, db } from "../firebase-service";
import { useRouter } from 'vue-router';
import { MAX_CAPTION_LENGTH } from "../util/constants"

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
const isLoading = ref(true); // Variable to manage loading state
const postCaption = ref(props.caption);
const upvoteCount = ref(props.upvotes);
const downvoteCount = ref(props.downvotes);
const avatarUrl = ref(''); // Reactive variable to store the avatar URL
const isOwner = ref(false);
const editingCaption = ref(false); // State to manage the editing mode
const newCaption = ref(props.caption || ""); // Reactive variable to store the new caption
const toast = ref({ isOpen: false, message: '', color: '' });
const user = firebaseAuth.currentUser;

onMounted(async () => {
  // Query Firestore based on the username to get avatar URL
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
  isLoading.value = false;
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
      postCaption.value = data.caption; // Updating caption
    }
  });

  // Cleanup the subscription on component destruction
  onUnmounted(() => {
    unsubscribe();
  });

};

// helper function for handleVote to ensure up/downvote exclusivity & singularity
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

// sending of upvote and downvotes
const handleVote = async (postId: string, isUpvote: boolean) => {
  const postRef = doc(db, 'posts', postId);

  if (!user) {
    // Handle the case where the user is not logged in
    toast.value = {
      isOpen: true, color: 'danger',
      message: "You are not logged in. Please create an account before voting.",
    };
    return;
  }

  try {
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
        message: isUpvote ? 'Changed upvote on ' + props.username + "'s post" : 'Changed downvote on ' + props.username + "'s post"
      };
    }
  } catch (error: any) {
    toast.value = {
      isOpen: true, color: 'danger',
      message: "Error while voting: " + error.message,
    };
  }
};

// show a confirmation dialog before deletion of post
const confirmDeleteNotification = async () => {
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

// handle the deletion of the post
const handleDelete = async () => {
  try {
    const postRef = doc(db, 'posts', props.imageId);
    await deleteDoc(postRef);
    toast.value = {
      isOpen: true, color: 'success',
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

// save the updated caption
const saveCaption = async () => {
  if (newCaption.value == props.caption) {
    toast.value = { isOpen: true, message: "You have entered the same caption!", color: "danger" };
    return;
  } else if (newCaption.value.length < MAX_CAPTION_LENGTH) {
    toast.value = { isOpen: true, message: "Caption too long!", color: "danger" };
    return;
  }

  try {
    const postRef = doc(db, 'posts', props.imageId);
    await updateDoc(postRef, { caption: newCaption.value });
    editingCaption.value = false; // Exit editing mode
    toast.value = {
      isOpen: true, color: 'success',
      message: "Caption edit confirmed!",
    };
  } catch (error: any) {
    toast.value = {
      isOpen: true, color: 'danger',
      message: "Error while saving new caption: " + error.message,
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
