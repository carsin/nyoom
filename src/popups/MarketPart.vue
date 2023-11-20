<template>
  <ion-content>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button color="medium" @click="cancel"> X </ion-button>
        </ion-buttons>
        <ion-title>Part Details</ion-title>
      </ion-toolbar>
    </ion-header>

    <!-- Display trash and edit icons if the user IDs match -->
    <div v-if="selectedPart?.userId === user?.uid">
      <ion-button fill="clear" v-if="!editingPart" @click="startEditing">
        <ion-icon aria-hidden="true" slot="icon-only" :icon="pencil" />
      </ion-button>
      <ion-button
        v-if="editingPart"
        color="danger"
        @click="editingPart = false"
      >
        X
      </ion-button>
      <ion-button fill="clear" @click="handlePartDelete">
        <ion-icon
          aria-hidden="true"
          color="danger"
          slot="icon-only"
          :icon="trash"
        />
      </ion-button>
      <!-- Conditional part editing menu -->
      <ion-row v-if="editingPart">
        <ion-col size="11">
          <ion-label position="stacked" color="primary"
            ><b>Edit Part Info</b></ion-label
          >
          <ion-input v-model="newPrice" placeholder="Edit price"></ion-input>
          <ion-input
            v-model="newCondition"
            placeholder="Edit condition"
          ></ion-input>
          <ion-input
            v-model="newDescription"
            placeholder="Edit description"
          ></ion-input>
          <ion-input
            v-model="newLocation"
            placeholder="Edit location"
          ></ion-input>
        </ion-col>
        <ion-button
          v-if="editingPart"
          color="success"
          @click="handlePartUpdate"
        >
          <ion-icon aria-hidden="true" slot="icon-only" :icon="checkmark" />
        </ion-button>
      </ion-row>
    </div>

    <div v-if="editingPart === false">
      <img alt="Part image" :src="selectedPart?.images" class="custom-image" />
      <br />
      <ion-subtitle>{{ selectedPart?.itemName }}</ion-subtitle>
      <br />
      <ion-subtitle class="card-price">${{ selectedPart?.price }}</ion-subtitle>
      <br />
      <ion-subtitle>{{ selectedPart?.condition }}</ion-subtitle>
      <br />
      <ion-subtitle>{{ selectedPart?.description }}</ion-subtitle>
      <div v-if="selectedPart?.userId !== user?.uid">
        <ion-button @click="BuyNow">Buy Now</ion-button>
        <ion-button @click="MessageSeller">Message Seller</ion-button>
      </div>
    </div>
  </ion-content>
</template>

<script lang="ts" setup>
import { firebaseAuth } from "@/firebase-service";
import router from "@/router";
import { partManager } from "@/services/ManagePartService";
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  modalController,
  IonIcon,
  alertController,
} from "@ionic/vue";
import { ref } from "vue";
import { trash, pencil, checkmark } from "ionicons/icons";

// Define the expected 'part' prop
const props = defineProps({
  part: Object,
});

const user = firebaseAuth.currentUser;
const selectedPart = ref(props.part);
const editingPart = ref(false); // State to manage the caption editing mode

const cancel = () => modalController.dismiss(null, "cancel");

const toast = ref({ isOpen: false, message: "", color: "" });

// show a confirmation dialog before deletion of post
const handlePartDelete = async () => {
  const alert = await alertController.create({
    header: "Confirm Delete",
    message: "Are you sure you want to delete this listing?",
    buttons: [
      {
        text: "Cancel",
        role: "cancel",
      },
      {
        text: "Delete",
        handler: async () => {
          // handle the deletion of the post
          console.log("clicked delete");
          const result = await partManager.deletePart(selectedPart?.value.id);
          console.log("result: ", result);
          if (result.success) {
            toast.value = {
              isOpen: true,
              color: "success",
              message: result.message,
            };
            router.go(0);
          } else {
            toast.value = {
              isOpen: true,
              color: "danger",
              message: result.message,
            };
          }
        },
      },
    ],
  });
  await alert.present();
};

const newPrice = ref(selectedPart.value.price || ""); // Reactive variable to store the new price
const newCondition = ref(selectedPart.value.condition || ""); // Reactive variable to store the new condition
const newDescription = ref(selectedPart.value.description || ""); // Reactive variable to store the new description
const newLocation = ref(selectedPart.value.location || ""); // Reactive variable to store the new location

const startEditing = () => {
  editingPart.value = true;
  newPrice.value = selectedPart.value.price; // Display current price when editing starts
};
const handlePartUpdate = async () => {
  const result = await partManager.updateListing(selectedPart.value.id, {
    price: newPrice.value, // Replace with the new price
    condition: newCondition.value, // Replace with the new condition
    description: newDescription.value, // Replace with the new description
    location: newLocation.value, // Replace with the new location
  });

  if (result.success) {
    toast.value = { isOpen: true, color: "success", message: result.message };
    editingPart.value = false;
  } else {
    toast.value = { isOpen: true, color: "danger", message: result.message };
  }
};
</script>

<style scoped>
.selected-option {
  background-color: #0078d4; /* Change the background color when selected */
  color: #00ff51; /* Change the text color when selected */
}
.card-price {
  color: green;
  font-weight: bold;
  max-width: 200px;
  overflow: hidden;
}
</style>
