<template>
  <!-- <ion-card @click="openModal"> -->
    <ion-card>
    <ion-card-header v-if="isLoading">
      <ion-progress-bar type="indeterminate"></ion-progress-bar>
    </ion-card-header>
    <ion-grid>
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
        <!-- <ion-col class="ion-justify-content-center ion-align-items-bottom ion-text-end">
          <div v-if="isPostOwner">
            <ion-button fill="clear" v-if="!editingCaption" @click="editingCaption = true">
              <ion-icon aria-hidden="true" slot="icon-only" :icon="pencil" />
            </ion-button>
            <ion-button v-if="editingCaption" color="danger" fill="clear" @click="editingCaption = false">
              <ion-icon aria-hidden="true" slot="icon-only" :icon="close" />
            </ion-button>
            <ion-button fill="clear" @click="handleEventDelete">
              <ion-icon aria-hidden="true" color="danger" slot="icon-only" :icon="trash" />
            </ion-button>
          </div>
        </ion-col> -->
        <!-- <ion-card-title>@{{ username }}</ion-card-title> -->
      </ion-row>
        
      <ion-row>
        <img :src="image_src" alt="Event image content" />
      </ion-row>
      <ion-row>
        <ion-col>
            <ion-card-subtitle>{{ datetime }}</ion-card-subtitle>
            <ion-card-title>{{ eventName }}</ion-card-title>
        </ion-col>
        <ion-col class="vert-center">
          <ion-buttons class="ion-float-right">
            <ion-button v-if="subscribed" fill="outline" color="primary">Unsubscribe</ion-button>
            <ion-button v-else fill="outline" color="primary">Subscribe</ion-button>
          </ion-buttons>
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-card>
</template>

<style>

.vert-center{
  vertical-align: center;
}

</style>
  
  
<script setup lang="ts">
  import { alertController, IonCard, IonButton, IonGrid, IonCol, IonRow, IonIcon, IonCardSubtitle, IonCardHeader, IonProgressBar, IonAvatar, IonCardTitle, modalController, IonButtons } from '@ionic/vue';
  import { firebaseAuth, db } from "../firebase-service";
  import { onMounted, onUnmounted, computed, ref } from 'vue';
  import { getDocs, collection, query, where, doc, onSnapshot } from "firebase/firestore";
  import { useRouter } from 'vue-router';
  import { postManager } from '../services/ManagePostService';
  import { trash, pencil, close } from 'ionicons/icons';


  // vue props
  const props = defineProps({
  userId: { type: String, default: ''},
  imageId: { type: String, default: '' },
  username: { type: String, default: '' },
  image_src: { type: String, default: '' },
  imagePath: { type: String, default: '' },
  showAvatar: { type: Boolean, default: false },
  eventName: { type: String, default: '' },
  eventDescription: { type: String, default: '' },
  eventType: { type: String, default: '' },
  datetime: { type: String, default: '' },
  timestamp: Object,
});
  
  import { image, personRemoveSharp } from 'ionicons/icons';

  var subscribed:boolean = false;
  const router = useRouter();
  const isLoading = ref(true);
  const eventType = ref(props.eventType); 
  const eventDescription = ref(props.eventDescription);
  const eventName = ref(props.eventName);
  const datetime = ref(props.datetime);
  const avatarUrl = ref('');
  const isPostOwner = ref(false);
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
  const eventRef = doc(db, 'posts', props.imageId);

  // Listening for real-time updates
  const unsubscribe = onSnapshot(eventRef, (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      eventName.value = data.eventName; // Updating eventName
      eventDescription.value = data.eventDescription; // Updating eventDescription
      datetime.value = data.datetime; // Updating datetime
      eventType.value = data.eventType; // Updating eventType
    }
  });

  // Cleanup the subscription on component destruction
  onUnmounted(() => {
    unsubscribe();
  });
};

// show a confirmation dialog before deletion of post
const handleEventDelete = async () => {
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

const formattedTimestamp = computed(() => {
  if (props.timestamp) {
    const date = props.timestamp.toDate(); // Convert Firestore timestamp to JavaScript Date
    return date.toLocaleString();
  }
  return '';
});

  // const openModal = async () => {
  //   const modal = await modalController.create({
  //     component: MarketFilter,
  //  });
  // }
</script>