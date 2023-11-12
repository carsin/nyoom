<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button color="medium" @click="cancel">Cancel</ion-button>
      </ion-buttons>
      <ion-title>Filter Parts</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="confirm" :strong="true">Confirm</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <ion-list>
      <ion-item
        :class="{ 'selected-option': selectedOption === 'Featured' }"
        @click="selectOption('Featured')"
        >Featured</ion-item
      >
      <ion-item
        :class="{ 'selected-option': selectedOption === 'Price: Low to High' }"
        @click="selectOption('Price: Low to High')"
        >Price: Low to High</ion-item
      >
      <ion-item
        :class="{ 'selected-option': selectedOption === 'Price: High to Low' }"
        @click="selectOption('Price: High to Low')"
        >Price: High to Low</ion-item
      >
      <ion-item
        :class="{
          'selected-option': selectedOption === 'Distance: Closest to Furthest',
        }"
        @click="selectOption('Distance: Closest to Furthest')"
        >Distance: Closest to Furthest</ion-item
      >
      <ion-item
        :class="{ 'selected-option': selectedOption === 'Newest Arrivals' }"
        @click="selectOption('Newest Arrivals')"
        >Newest Arrivals</ion-item
      >
      <ion-item
        :class="{ 'selected-option': selectedOption === 'My Listings' }"
        @click="selectOption('My Listings')"
        >My Listings</ion-item
      >
    </ion-list>
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
import { ref, watchEffect } from "vue";

const name = ref();
const selectedOption = ref("");
const props = defineProps(["userId"]);

const cancel = () => modalController.dismiss(null, "cancel");
const confirm = () => modalController.dismiss(selectedOption.value, "confirm");

const selectOption = (option: any) => {
  selectedOption.value = option;
};
</script>

<style scoped>
.selected-option {
  background-color: #0078d4; /* Change the background color when selected */
  color: #00ff51; /* Change the text color when selected */
}
</style>
