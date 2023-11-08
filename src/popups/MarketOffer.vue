<template>
  <ion-content>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button color="medium" @click="cancel">
            <!-- <ion-icon name="arrow-back-outline"></ion-icon> -->X
          </ion-button>
        </ion-buttons>
        <ion-title>{{ selectedOffer?.deal }}</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="confirm" :strong="true">Confirm</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <img alt="Offer image" :src="selectedOffer?.images" class="custom-image" />
    <br />
    <ion-subtitle>{{ selectedOffer?.shopName }}</ion-subtitle>
    <br />
    <ion-button @click="BookNow">Book Now</ion-button>
  </ion-content>
</template>

<script lang="ts" setup>
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonList,
  IonItem,
  modalController,
} from "@ionic/vue";
import { ref } from "vue";

// Define the expected 'offer' prop
const props = defineProps({
  offer: Object,
});

const selectedOffer = ref(props.offer);

const cancel = () => modalController.dismiss(null, "cancel");
const confirm = () => modalController.dismiss(selectedOffer.value, "confirm");

console.log("passed value offer is: ", selectedOffer.value);
</script>

<style scoped>
.selected-option {
  background-color: #0078d4; /* Change the background color when selected */
  color: #00ff51; /* Change the text color when selected */
}
</style>
