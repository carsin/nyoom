<template>
  <ion-card>
    <ion-card-header v-if="isLoading">
      <ion-progress-bar type="indeterminate"></ion-progress-bar>
    </ion-card-header>
    <ion-grid v-else>
      <!-- Header -->
      <ion-row>
        <ion-col class="ion-justify-content-center ion-align-items-bottom ion-text-end">
          <div v-if="isPostOwner">
            <ion-button fill="clear" v-if="!editingVehicle" @click="editingVehicle = true">
              <ion-icon aria-hidden="true" slot="icon-only" :icon="pencil" />
            </ion-button>
            <ion-button v-if="editingVehicle" color="danger" fill="clear" @click="editingVehicle = false">
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

      <!-- Vehicle details (Make, Model, Year) -->
      <ion-row>
        <ion-col size="4" class="ion-text-left">
          <ion-note color="primary"><b>Make: </b>{{ make }}</ion-note>
        </ion-col>
        <ion-col size="4" class="ion-text-center">
          <ion-note color="primary"><b>Model: </b>{{ model }}</ion-note>
        </ion-col>
        <ion-col size="4" class="ion-text-right">
          <ion-note color="primary"><b>Year: </b>{{ year }}</ion-note>
        </ion-col>
      </ion-row>

      <!-- Condtional description editing menu -->
      <ion-row v-if="editingVehicle" class="ion-align-items-center">
        <ion-col class="ion-text-left" size="9">
          <ion-label position="stacked" color="primary"><b>Edit Description</b> </ion-label>
          <ion-textarea v-model="newDescription" :maxlength="MAX_DESCRIPTION_LENGTH" placeholder="Exude genius here"
            aria-label="Edit description input" :counter="true" :autoGrow="true" />
        </ion-col>
        <ion-col size="3" class="ion-text-right">
          <ion-button :disabled="newDescription.length > MAX_DESCRIPTION_LENGTH" v-if="editingVehicle" color="success"
            @click="handleDescriptionUpdate">
            <ion-icon aria-hidden="true" slot="icon-only" :icon="checkmark" />
          </ion-button>
        </ion-col>
      </ion-row>

      <!-- Description -->
      <ion-row v-else>
        <ion-col class="ion-text-left ion-align-self-top" size="8">
          <ion-card-content> {{ postDescription }} </ion-card-content>
        </ion-col>
      </ion-row>

      <!-- Editable Modifications -->
      <ion-row>
        <ion-col>
          <ion-list>
            <ion-item v-for="(value, key) in vehicleMods" :key="key">
              <ion-label>{{ key }}: <span v-if="!editingVehicle">{{ value }} </span></ion-label>
              <ion-input v-if="editingVehicle" v-model="editableMods[key]" :value="value" type="text"></ion-input>
            </ion-item>
          </ion-list>
          <ion-button v-if="editingVehicle" @click="handleModsUpdate">Update Modifications</ion-button>
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
import { onMounted, onUnmounted, ref } from 'vue';
import { alertController, IonCard, IonLabel, IonButton, IonCardContent, IonGrid, IonIcon, IonInput, IonProgressBar, IonCardHeader, IonTextarea, IonRow, IonCol, IonToast, IonNote, IonList, IonItem } from '@ionic/vue';
import { trash, pencil, checkmark, close } from 'ionicons/icons';
import { collection, query, where, doc, onSnapshot } from "firebase/firestore";
import { firebaseAuth, db } from "../firebase-service";
import { useRouter } from 'vue-router';
import { MAX_DESCRIPTION_LENGTH } from "../util/constants"
import { garageManager } from '../services/ManageGarageService';

// vue props
const props = defineProps({
  userId: { type: String, default: ''},
  vehicleId: { type: String, default: ''},
  username: { type: String, default: ''},
  description: { type: String, default: '' },
  image_src: { type: String, default: '' },
  vehicle_type: { type: String, default: '' },
  make: { type: String, default: '' },
  model: { type: String, default: '' },
  year: { type: String, default: '' },
  carMods: { type: Map<string, string>, default: '' },
});

const router = useRouter();
const isLoading = ref(true);
const postDescription = ref(props.description);
const isPostOwner = ref(false);
const editingVehicle = ref(false); // State to manage the description editing mode
const newDescription = ref(props.description || ""); // Reactive variable to store the new description
const toast = ref({ isOpen: false, message: '', color: '' });
const user = firebaseAuth.currentUser;

// Convert the carMods prop to a reactive object for editing
const editableMods = ref({});
const vehicleMods = ref<Map<string, string>>(new Map<string, string>);

// Method to handle modifications update

onMounted(async () => {
  editableMods.value = { ...props.carMods };
  vehicleMods.value = props.carMods;

  // check if post belongs to currently authenticated user
  if (user && user.uid === props.userId) {
    isPostOwner.value = true;
  }

  // Calling the function to handle real-time updates
  isLoading.value = false;
  handleRealtimeUpdates();
});

// Function to handle the real-time updates
const handleRealtimeUpdates = () => {
  const vehicleRef = doc(db, 'users', props.userId, 'vehicles', props.vehicleId);

  // Listening for real-time updates
  const unsubscribe = onSnapshot(vehicleRef, (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      postDescription.value = data.description; // Updating description
    }
  });

  // Cleanup the subscription on component destruction
  onUnmounted(() => {
    unsubscribe();
  });
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
          const result = await garageManager.deleteVehicle(props.vehicleId, props.userId);
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

// save the updated description
const handleDescriptionUpdate = async () => {
  const result = await garageManager.updateDescription(props.userId, props.vehicleId, newDescription.value, props.description);
  if (result.success) {
    toast.value = { isOpen: true, color: 'success', message: result.message };
    editingVehicle.value = false;
  } else {
    toast.value = { isOpen: true, color: 'danger', message: result.message };
  }
};

const handleModsUpdate = async () => {
  console.log(editableMods);
  const result = await garageManager.updateMods(props.userId, props.vehicleId, editableMods.value, props.carMods);
  if (result.success) {
    toast.value = { isOpen: true, color: 'success', message: result.message };
    // Update the original carMods prop to reflect the changes
    vehicleMods.value = editableMods.value;
    editingVehicle.value = false;
  } else {
    toast.value = { isOpen: true, color: 'danger', message: result.message };
  }
};

</script>
