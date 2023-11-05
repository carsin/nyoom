<template>
  <ion-card>
    <ion-card-header v-if="isLoading">
        <ion-progress-bar type="indeterminate"></ion-progress-bar>
    </ion-card-header>
    <ion-grid v-else>
      <!-- Post header -->
      <ion-row>
        <!-- Avatar username and timestamp component -->
        <ion-col class="ion-justify-content-center ion-text-left ion-align-items-bottom">
          <ion-button v-if="showAvatar" fill="clear">
            <router-link class="avatar-header-link" style="text-decoration: none;" :to="{ path: `/user/${username}` }">
                <ion-avatar v-if="avatarUrl">
                  <img :src="avatarUrl" alt="User avatar" />
                </ion-avatar>
                <ion-avatar v-else>
                  <img src="https://ionicframework.com/docs/img/demos/avatar.svg" alt="Default avatar" />
                </ion-avatar>
              <div class="ion-align-items-bottom ion-no-margin ion-margin-start">
                <ion-card-title color="primary"> @{{ username }} </ion-card-title>
                <ion-card-subtitle> {{ formattedTimestamp }} </ion-card-subtitle>
              </div>
            </router-link>
          </ion-button>
        </ion-col>
        <!-- show timestamp if no avatar component -->
        <ion-col v-if="!showAvatar" class="ion-text-center ion-align-self-center ion-justify-content-center">
          <ion-card-subtitle> {{ formattedTimestamp }} </ion-card-subtitle>
        </ion-col>
        <ion-col v-if="isPostOwner" class="ion-justify-content-center ion-align-items-bottom ion-text-end">
          <ion-button fill="clear" v-if="!editingCaption" @click="editingCaption = true">
            <ion-icon aria-hidden="true" slot="icon-only" :icon="pencil" />
          </ion-button>
          <ion-button v-if="editingCaption" color="danger" fill="clear" @click="editingCaption = false">
            <ion-icon aria-hidden="true" slot="icon-only" :icon="close" />
          </ion-button>
          <ion-button fill="clear" @click="handlePostDelete">
            <ion-icon aria-hidden="true" color="danger" slot="icon-only" :icon="trash" />
          </ion-button>
        </ion-col>
      </ion-row>
      <!-- Post image -->
      <ion-row class="ion-justify-content-center">
        <div class="post-image-container">
          <img class="post-image" :src="image_src" alt="Post image content" />
        </div>
      </ion-row>
      <!-- Condtional caption editing menu -->
      <ion-row v-if="editingCaption" class="ion-align-items-center">
        <ion-col class="ion-text-left"  size="11">
          <ion-label position="stacked" color="primary"><b>Edit Caption</b> </ion-label>
          <ion-textarea v-model="newCaption" :maxlength="MAX_CAPTION_LENGTH" placeholder="Exude genius here" aria-label="Edit caption input" :counter="true" :autoGrow="true"/>
        </ion-col>
        <ion-col size="1" class="ion-text-right">
          <ion-button :disabled="newCaption.length > MAX_CAPTION_LENGTH" v-if="editingCaption" color="success" @click="handleCaptionUpdate">
            <ion-icon aria-hidden="true" slot="icon-only" :icon="checkmark" />
          </ion-button>
        </ion-col>
      </ion-row>
      <!-- Caption and vote buttons -->
      <ion-row v-else>
        <ion-col class="ion-text-left ion-align-self-top" size="8">
          <ion-card-content> {{ postCaption }} </ion-card-content>
        </ion-col>
        <ion-col class="ion-text-end ion-align-self-top" size="4">
          <ion-chip :outline="isUpvoted ? false : true" color="success" @click="handleVote(true)">
            <ion-label :class="{ voted: isUpvoted }"> {{ upvoteCount?.toString() }}</ion-label>
            <ion-icon aria-hidden="true" :icon="arrowUpCircle" />
          </ion-chip>
          <ion-chip :outline="isDownvoted ? false : true" color="danger" @click="handleVote(false)">
            <ion-label :class="{ voted: isDownvoted }"> {{ downvoteCount?.toString() }}</ion-label>
            <ion-icon aria-hidden="true" :icon="arrowDownCircle" />
          </ion-chip>
        </ion-col>
      </ion-row>
    </ion-grid>
    <ion-toast :is-open="toast.isOpen" :message="toast.message" :duration="1000" :color="toast.color" @didDismiss="toast.isOpen = false"></ion-toast>
  </ion-card>
</template>

<style scoped>
.post-image-container {
  padding: 0px 16px 0px; /* horizontal padding only */
  border-radius: 8px; 
  overflow: hidden; /* ensure that the border-radius is applied to the image inside */
  line-height: 0; /* removes any extra space below the image */
}

.post-image {
  border-radius: 0.5rem;
  width: auto; /* maintain the aspect ratio */
  height: auto; /* maintain the aspect ratio */
  max-height: 35rem;
  display: block; /* remove bottom space */
  max-width: 100%; /* ensure the image does not overflow the padding */
}

.voted {
  font-weight: bold;
}
</style>

<script setup lang="ts">
import { onMounted, onUnmounted, computed, ref } from 'vue';
import { alertController, IonCard, IonLabel, IonButton, IonChip, IonCardContent, IonCardSubtitle, IonCardTitle, IonGrid, IonIcon, IonProgressBar, IonCardHeader, IonTextarea, IonRow, IonCol, IonToast, IonAvatar } from '@ionic/vue';
import { arrowUpCircle, arrowDownCircle, trash, pencil, checkmark, close } from 'ionicons/icons';
import { getDocs, collection, query, where, doc, onSnapshot } from "firebase/firestore";
import { firebaseAuth, db } from "../firebase-service";
import { useRouter } from 'vue-router';
import { MAX_CAPTION_LENGTH } from "../util/constants"
import { postManager } from '../services/ManagePostService';

// vue props
const props = defineProps({
  userId: { type: String, default: ''},
  imageId: { type: String, default: '' },
  username: { type: String, default: '' },
  caption: { type: String, default: '' },
  upvotes: { type: Number, default: -1 },
  downvotes: { type: Number, default: -1 },
  image_src: { type: String, default: '' },
  isUpvoted: { type: Boolean, default: false },
  isDownvoted: { type: Boolean, default: false },
  imagePath: { type: String, default: '' },
  showAvatar: { type: Boolean, default: false },
  timestamp: Object,
});

// vue refs for upvotes and downvotes
const router = useRouter();
const isLoading = ref(true); // Variable to manage loading state
const postCaption = ref(props.caption);
const upvoteCount = ref(props.upvotes);
const downvoteCount = ref(props.downvotes);
const isUpvoted = ref(props.isUpvoted);
const isDownvoted = ref(props.isDownvoted);
const avatarUrl = ref(''); // Reactive variable to store the avatar URL
const isPostOwner = ref(false);
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
    isPostOwner.value = true;
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


// sending of upvote and downvotes
const handleVote = async (isUpvote: boolean) => {
  const result = await postManager.sendVote(props.imageId, isUpvote);
  if (result.success) {
    // reset the vote status
    isUpvoted.value = false;
    isDownvoted.value = false;
    // set the new vote status
    if (result.isNewVote) {
      isUpvoted.value = isUpvote;
      isDownvoted.value = !isUpvote;
    }
    toast.value = { isOpen: true, color: 'success', message: result.message };
  } else {
    toast.value = { isOpen: true, color: 'danger', message: result.message };
  }
};

// show a confirmation dialog before deletion of post
const handlePostDelete = async () => {
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
        handler: async () => { // handle the deletion of the post
          const result = await postManager.deletePost(props.imageId);
          if (result.success) {
            toast.value = { isOpen: true, color: 'success', message: result.message };
            router.go(0);
          } else {
            toast.value = { isOpen: true, color: 'danger', message: result.message };
          }
        }
      }
    ]
  });
  await alert.present();
};

// save the updated caption
const handleCaptionUpdate = async () => {
  const result = await postManager.updateCaption(props.imageId, newCaption.value, props.caption);
  if (result.success) {
    toast.value = { isOpen: true, color: 'success', message: result.message };
    editingCaption.value = false;
  } else {
    toast.value = { isOpen: true, color: 'danger', message: result.message };
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
