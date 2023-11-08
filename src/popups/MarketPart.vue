<template>
  <ion-content>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button color="medium" @click="cancel">Cancel</ion-button>
        </ion-buttons>
        <ion-title>{{ selectedPart?.itemName }}</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="confirm" :strong="true">Confirm</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <img alt="Part image" :src="selectedPart?.imageUrl" class="custom-image" />
    <br>
    <ion-subtitle>{{ selectedPart?.condition }}</ion-subtitle>
    <br>
    <ion-subtitle>{{ selectedPart?.price }}</ion-subtitle>
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

// Define the expected 'part' prop
const props = defineProps({
  part: Object,
});

const selectedPart = ref(props.part);

const cancel = () => modalController.dismiss(null, "cancel");
const confirm = () => modalController.dismiss(selectedPart.value, "confirm");

console.log("passed value part is: ", selectedPart.value);
</script>

<style scoped>
.selected-option {
  background-color: #0078d4; /* Change the background color when selected */
  color: #00ff51; /* Change the text color when selected */
}
</style>
