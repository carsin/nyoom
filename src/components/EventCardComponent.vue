<template>
  <!-- <ion-card @click="openModal"> -->
    <ion-card>
      <ion-card-header v-if="isLoading">
        <ion-progress-bar type="indeterminate"></ion-progress-bar>
      </ion-card-header>
      <ion-grid>
        <!-- Post header -->
        <ion-row class="ion-align-items-center">
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
            <!-- <div class="ion-float-right">
              
            </div> -->
            <div v-if="isPostOwner">
              <!-- <ion-button fill="clear" v-if="!editingCaption" @click="editingCaption = true">
                <ion-icon aria-hidden="true" slot="icon-only" :icon="pencil" />
              </ion-button>
              <ion-button v-if="editingCaption" color="danger" fill="clear" @click="editingCaption = false">
                <ion-icon aria-hidden="true" slot="icon-only" :icon="close" />
              </ion-button> -->
              <ion-button fill="clear" size="large" @click="setOpen(true); setDismiss(false)">
                <ion-icon slot="icon-only" :icon="informationCircleOutline" />
              </ion-button>
              <ion-button fill="clear" @click="handleEventDelete">
                <ion-icon aria-hidden="true" color="danger" slot="icon-only" :icon="trash" />
              </ion-button>
            </div>
            <div v-else>
              <ion-button fill="clear" size="large" @click="setOpen(true); setDismiss(false)">
                <ion-icon slot="icon-only" :icon="informationCircleOutline" />
              </ion-button>
            </div>

            <ion-modal :is-open="isOpen" :can-dismiss="onDismiss">
              <ion-header>
                <ion-toolbar>
                  <ion-title color="primary" class=""> <b>Event Info</b> </ion-title>
                  <ion-buttons slot="end">
                    <ion-button color="primary" @click="setDismiss(true); setOpen(false)">Close</ion-button>
                  </ion-buttons>
                </ion-toolbar>
              </ion-header>
              <ion-content class="ion-padding">
                <ion-grid>
                  <ion-row>
                    <ion-col>
                      <ion-list>
                        <ion-item class="no-border">
                          <ion-label position="stacked" color="primary" class="ion-margin-bottom"> <b>Event Name</b>: </ion-label>
                          <ion-text>{{ eventName }}</ion-text>
                        </ion-item>
                        <ion-item class="no-border">
                          <ion-label position="stacked" color="primary" class="ion-margin-bottom"> <b>Event Description</b>: </ion-label>
                          <ion-text>{{ eventDescription }}</ion-text>
                        </ion-item>
                        <ion-item class="no-border">
                          <ion-label position="stacked" color="primary" class="ion-margin-bottom"> <b>When</b>: </ion-label>
                          <ion-text>{{ datetime }}</ion-text>
                        </ion-item>
                        <ion-item class="no-border">
                          <ion-label position="stacked" color="primary" class="ion-margin-bottom"> <b>Where</b>: </ion-label>
                          <ion-button @click="googleMapsLink" fill="clear" color="dark" size="default">
                            <ion-text>{{ address }}</ion-text>
                          </ion-button>
                        </ion-item>
                      </ion-list>
                    </ion-col>
                  </ion-row>
                </ion-grid>
              </ion-content>
            </ion-modal>
            
          </ion-col>
          <!-- <ion-col class="ion-justify-content-center ion-align-items-bottom ion-text-end">
            
          </ion-col> -->
          <!-- <ion-card-title>@{{ username }}</ion-card-title> -->
        </ion-row>
          
        <ion-row class="ion-justify-content-center">
          <div class="post-image-container">
            <img class="post-image" :src="image_src" alt="Event image content" />
          </div>
        </ion-row>
        <ion-row class="ion-align-items-center">
          <ion-col>
              <ion-card-subtitle>{{ datetime }}</ion-card-subtitle>
              <ion-card-title>{{ eventName }}</ion-card-title>
          </ion-col>
          <ion-col>
            <div class="ion-float-right">
              <ion-button v-if="isSubscribed" size="large" fill="clear" color="primary" @click="handleSubscribe()">
                <ion-icon slot="icon-only" :icon="checkmarkCircle"></ion-icon>
              </ion-button>
              <ion-button v-else size="large" fill="clear" color="primary" @click="handleSubscribe()">
                <ion-icon slot="icon-only" :icon="addCircle"></ion-icon>
              </ion-button>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-card>
</template>

<style>

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

.no-border{
    --border-style: none;
}

</style>
  
  
<script setup lang="ts">
  import { 
    alertController, 
    IonCard, 
    IonButton, 
    IonGrid, 
    IonCol, 
    IonRow, 
    IonIcon, 
    IonCardSubtitle, 
    IonCardHeader, 
    IonProgressBar, 
    IonAvatar, 
    IonCardTitle, 
    modalController, 
    IonButtons,
    IonHeader,
    IonModal,
    IonToolbar,
    IonContent,
    IonTitle,
    IonList,
    IonItem,
    IonLabel,
    IonText
  } from '@ionic/vue';
  import { firebaseAuth, db } from "../firebase-service";
  import { onMounted, onUnmounted, computed, ref } from 'vue';
  import { doc, getDoc, getDocs, query, collection, where, onSnapshot, orderBy, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";
  import { useRouter } from 'vue-router';
  import { eventManager } from '@/services/ManageEventService';
  import { trash, pencil, close, informationCircleOutline, checkmarkCircle, addCircle } from 'ionicons/icons';

  // vue props
  const props = defineProps({
  userId: { type: String, default: ''},
  eventId: { type: String, default: '' },
  username: { type: String, default: '' },
  image_src: { type: String, default: '' },
  imagePath: { type: String, default: '' },
  showAvatar: { type: Boolean, default: false },
  eventName: { type: String, default: '' },
  eventDescription: { type: String, default: '' },
  eventType: { type: String, default: '' },
  datetime: { type: String, default: '' },
  address: { type: String, default: '' },
  isSubscribed: { type: Boolean, default: false},
  timestamp: Object,
});

  const router = useRouter();
  const eventId = ref(props.eventId)
  const isSubscribed = ref(props.isSubscribed);
  const isLoading = ref(true);
  const eventType = ref(props.eventType); 
  const eventDescription = ref(props.eventDescription);
  const eventName = ref(props.eventName);
  const datetime = ref(props.datetime);
  const address = ref(props.address);
  const avatarUrl = ref('');
  const isPostOwner = ref(false);
  const toast = ref({ isOpen: false, message: '', color: '' });
  const user = firebaseAuth.currentUser;
  const isOpen = ref(false);
  const onDismiss = ref(false);

  // address.value = `https://www.google.com/maps/dir/${encodeURIComponent(startingAddress)}/${encodeURIComponent(this.destinationAddress)}`

const setOpen = (open: boolean) => (isOpen.value = open);
const setDismiss = (dismiss: boolean) => (onDismiss.value = dismiss);

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
    if(userData.subscribedEvents.includes(eventId.value)) {
      isSubscribed.value = true;
    }
  }
  

  // Calling the function to handle real-time updates
  isLoading.value = false;
  handleRealtimeUpdates();
});

// Function to handle the real-time updates
const handleRealtimeUpdates = () => {
  const eventRef = doc(db, 'events', props.eventId);

  // Listening for real-time updates
  const unsubscribe = onSnapshot(eventRef, (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      eventName.value = data.eventName; // Updating eventName
      eventDescription.value = data.description; // Updating eventDescription
      datetime.value = data.datetime; // Updating datetime
      eventType.value = data.eventType; // Updating eventType
      address.value = data.address; // Updating address
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
    message: 'Are you sure you want to delete this event?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel'
      },
      {
        text: 'Delete',
        handler: async () => { // handle the deletion of the post
          const result = await eventManager.deleteEvent(props.eventId);
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

const handleSubscribe = async () => {
  const currentUser = firebaseAuth.currentUser;
  try {
    if (currentUser && eventId.value) {
      // const eventDocRef = doc(db, 'events', eventData.value.uid);
      const currentUserDocRef = doc(db, 'users', currentUser.uid);

      if (isSubscribed.value) {
        // Unsubscribe logic
        await updateDoc(currentUserDocRef, {
          subscribedEvents: arrayRemove(eventId.value)
        });
        toast.value = { isOpen: true, message: 'Successfully unsubscribed to ' + eventName, color: 'success' };
      } else {
        // Subscribe logic
        await updateDoc(currentUserDocRef, {
          subscribedEvents: arrayUnion(eventId.value)
        });
        toast.value = { isOpen: true, message: 'Successfully subscribed to ' + eventName, color: 'success' };
      }

      isSubscribed.value = !isSubscribed.value;
    } else {
      toast.value = { isOpen: true, message: 'Failed to follow/unfollow. User data is missing.', color: 'danger' };
    }
  } catch (error: any) {
    toast.value = { isOpen: true, message: 'An error occurred: ' + error.message, color: 'danger' };
  }
};

const formattedTimestamp = computed(() => {
  if (props.timestamp) {
    const date = props.timestamp.toDate(); // Convert Firestore timestamp to JavaScript Date
    return date.toLocaleString();
  }
  return '';
});

const googleMapsLink = () => {
      // Use the Geolocation API to get the current user's location
      // Note: Geolocation may not work on insecure origins (non-HTTPS)
      const startingAddress = "current location"; // Replace with actual geolocation logic

      // Construct the Google Maps URL with the starting and destination addresses
      const googleMapsLink =  `https://www.google.com/maps?q=${encodeURIComponent(address.value)}`;
      window.open(googleMapsLink, "_blank");
    }
</script>