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
              <ion-avatar>
                <img :src="avatarUrl || 'https://ionicframework.com/docs/img/demos/avatar.svg'" alt="User avatar" />
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
        <ion-col class="ion-justify-content-center ion-align-items-bottom ion-text-end">
          <div v-if="isPostOwner">
            <ion-button fill="clear" v-if="!editingCaption" @click="editingCaption = true">
              <ion-icon aria-hidden="true" slot="icon-only" :icon="pencil" />
            </ion-button>
            <ion-button v-if="editingCaption" color="danger" fill="clear" @click="editingCaption = false">
              <ion-icon aria-hidden="true" slot="icon-only" :icon="close" />
            </ion-button>
            <ion-button fill="clear" @click="handlePostDelete">
              <ion-icon aria-hidden="true" color="danger" slot="icon-only" :icon="trash" />
            </ion-button>
          </div>
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
        <ion-col class="ion-text-left" size="11">
          <ion-label position="stacked" color="primary"><b>Edit Caption</b> </ion-label>
          <ion-textarea v-model="newCaption" :maxlength="MAX_CAPTION_LENGTH" placeholder="Exude genius here"
            aria-label="Edit caption input" :counter="true" :autoGrow="true" />
        </ion-col>
        <ion-col size="1" class="ion-text-right">
          <ion-button :disabled="newCaption.length > MAX_CAPTION_LENGTH" v-if="editingCaption" color="success"
            @click="handleCaptionUpdate">
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
      <!-- Comments section -->
      <ion-row>
        <ion-col>
          <ion-list>
            <ion-item v-for="comment in comments" :key="comment.id" lines="none">
              <router-link style="text-decoration: none;" :to="{ path: `/user/${comment.username}` }">
                <ion-avatar class="comment-avatar" slot="start">
                  <img :src="comment.avatarUrl || 'https://ionicframework.com/docs/img/demos/avatar.svg'" alt="Comment avatar image"/>
                </ion-avatar>
              </router-link>
              <ion-label>
                <router-link class="avatar-header-link" style="text-decoration: none;" :to="{ path: `/user/${comment.username}` }">
                  <ion-card-subtitle color="primary">@{{ comment.username }}</ion-card-subtitle>
                </router-link>
                <p>{{ comment.text }}</p>
              </ion-label>
              <ion-button v-if="comment.canDelete" fill="clear" slot="end" @click="handleCommentDelete(comment.id)">
                <ion-icon slot="icon-only" color="danger" :icon="trash" />
              </ion-button>
              <ion-note slot="end" class="ion-no-margin">{{ comment.timestamp }}</ion-note>
            </ion-item>
          </ion-list>
        </ion-col>
      </ion-row>
      <!-- Comment input -->
      <ion-row class="ion-align-items-center">
        <ion-col size="9">
          <ion-list>
            <ion-item>
              <ion-input v-model="newCommentText" placeholder="Add comment..."
                :maxlength="MAX_COMMENT_LENGTH" @keyup.enter="handleCommentSubmit"></ion-input>
            </ion-item>
          </ion-list>
        </ion-col>
        <ion-col class="ion-text-right" size="3">
          <ion-button v-if="newCommentText.length > 0" @click="handleCommentSubmit">Comment</ion-button>
        </ion-col>
      </ion-row>
    </ion-grid>
    <ion-toast :is-open="toast.isOpen" :message="toast.message" :duration="1000" :color="toast.color"
      @didDismiss="toast.isOpen = false"></ion-toast>
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

.comment-avatar {
  height: 3.2rem;
  width: 3.2rem;
  margin-right: 8px;
}
</style>

<script setup lang="ts">
import { onMounted, onUnmounted, computed, ref } from 'vue';
import { alertController, IonCard, IonLabel, IonButton, IonChip, IonCardContent, IonCardSubtitle, IonCardTitle, IonGrid, IonIcon, IonProgressBar, IonCardHeader, IonTextarea, IonRow, IonCol, IonToast, IonList, IonItem, IonAvatar, IonNote, IonInput } from '@ionic/vue';
import { arrowUpCircle, arrowDownCircle, trash, pencil, checkmark, close } from 'ionicons/icons';
import { getDocs, collection, query, where, doc, onSnapshot } from "firebase/firestore";
import { firebaseAuth, db } from "../firebase-service";
import { useRouter } from 'vue-router';
import { MAX_CAPTION_LENGTH, MAX_COMMENT_LENGTH } from "../util/constants"
import { postManager } from '../services/ManagePostService';
import { userInfoService } from "../services/UserInfoService";

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

const router = useRouter();
const isLoading = ref(true);
const postCaption = ref(props.caption);
const upvoteCount = ref(props.upvotes);
const downvoteCount = ref(props.downvotes);
const isUpvoted = ref(props.isUpvoted);
const isDownvoted = ref(props.isDownvoted);
const avatarUrl = ref('');
const isPostOwner = ref(false);
const editingCaption = ref(false); // State to manage the caption editing mode
const newCaption = ref(props.caption || ""); // Reactive variable to store the new caption
const toast = ref({ isOpen: false, message: '', color: '' });
const user = firebaseAuth.currentUser;
const newCommentText = ref('');
const comments = ref([]);

onMounted(async () => {
  // Query Firestore based on the username to get avatar URL
  const userQuery = query(collection(db, 'users'), where('username', '==', props.username));
  const querySnapshot = await getDocs(userQuery);
  await handleFetchComments();

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

// Fetch comments for the post
const handleFetchComments = async () => {
  const result = await postManager.fetchComments(props.imageId);
  if (result.success) {
    comments.value = result.comments;
  } else {
    toast.value = { isOpen: true, message: result.message, color: 'danger' };
  }
};

// Submit comment
const handleCommentSubmit = async () => {
  if (newCommentText.value.trim() === '') {
    toast.value = { isOpen: true, message: 'Comment cannot be empty', color: 'danger' };
    return;
  }

  const currentUsername = await userInfoService.getCurrentUserUsername();
  const result = await postManager.submitComment(props.imageId, newCommentText.value, currentUsername);

  if (result.success) {
    newCommentText.value = ''; // clear the textarea
    await handleFetchComments(); // refresh comments
    toast.value = { isOpen: true, message: result.message, color: 'success' };
  } else {
    toast.value = { isOpen: true, message: result.message, color: 'danger' };
  }
};

const handleCommentDelete = async (commentId: string) => {
  const result = await postManager.deleteComment(props.imageId, commentId);
  if (result.success) {
    await handleFetchComments(); // Refresh the comments list
    toast.value = { isOpen: true, message: result.message, color: 'success' };
  } else {
    toast.value = { isOpen: true, message: result.message, color: 'danger' };
  }
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
