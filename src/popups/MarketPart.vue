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
      <ion-button @click="deletePart">
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
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  modalController,
  IonIcon,
} from "@ionic/vue";
import { ref } from "vue";

// Define the expected 'part' prop
const props = defineProps({
  part: Object,
});

const user = firebaseAuth.currentUser;
const selectedPart = ref(props.part);

const cancel = () => modalController.dismiss(null, "cancel");

//console.log("passed value part is: ", selectedPart.value);

const deletePart = async () => {
  try {
    // Here, implement the code to delete the part from the database
    // You can use Firebase or your database service of choice

    // Display a success message
    toast.value = {
      isOpen: true,
      message: "Part deleted successfully!",
      color: "success",
    };

    // After deletion, navigate the user back to the market page
    // You can use router.push("/market") or your navigation method
  } catch (error) {
    console.error("Error deleting part:", error);
    // Display an error message if the deletion fails
    toast.value = {
      isOpen: true,
      message: "Error deleting part: " + error.message,
      color: "danger",
    };
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
