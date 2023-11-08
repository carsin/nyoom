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
      <ion-button @click="editPart">
        <ion-icon name="pencil-outline"></ion-icon>
        Edit
      </ion-button>
      <ion-button @click="handlePartDelete">
        <ion-icon name="trash-outline"></ion-icon>
        Delete
      </ion-button>
    </div>

    <img alt="Part image" :src="selectedPart?.images" class="custom-image" />
    <br />
    <ion-subtitle>{{ selectedPart?.itemName }}</ion-subtitle>
    <br />
    <ion-subtitle class="card-price">{{ selectedPart?.price }}</ion-subtitle>
    <br />
    <ion-subtitle>{{ selectedPart?.condition }}</ion-subtitle>

    <br />
    <ion-button @click="BuyNow">Buy Now</ion-button>
    <ion-button @click="MessageSeller">Message Seller</ion-button>
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

// Define the expected 'part' prop
const props = defineProps({
  part: Object,
});

const user = firebaseAuth.currentUser;
const selectedPart = ref(props.part);

const cancel = () => modalController.dismiss(null, "cancel");

console.log("passed value part is: ", selectedPart.value);
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
          const result = await partManager.deletePart(selectedPart?.value.id);
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
