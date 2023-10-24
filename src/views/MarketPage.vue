<template>
  <ion-page>
    <ion-header>
      <ion-toolbar collapse="condense">
        <ion-title>Market</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-segment v-model="selectedTab">
        <ion-segment-button @click="selectTab('parts')">
          <ion-label>Parts</ion-label>
        </ion-segment-button>
        <ion-segment-button @click="selectTab('auto-shop')">
          <ion-label>Autoshop Offers</ion-label>
        </ion-segment-button>
      </ion-segment>

      <!-- Content for the "Parts" tab -->
      <div v-if="isPartsTab">
        <ion-toolbar>
          <ion-title class="ion-text-center">Local Parts</ion-title>
        </ion-toolbar>
        <ion-toolbar>
  <ion-searchbar
    show-clear-button="focus"
    placeholder="Search parts"
    class="ion-padding-start ion-padding-end"
  ></ion-searchbar>
  <ion-buttons slot="end">
  <ion-button expand="block" @click="openModal">
  <ion-icon :icon="funnel" />
</ion-button>
</ion-buttons>
<p>{{ message }}</p>
</ion-toolbar>


        <ion-grid>
          <ion-row>
            <ion-col v-for="part in parts" :key="part.id" size="6">
              <ion-card :href="'/market/' + part.id" class="custom-card">
                <img
                  alt="Part image"
                  :src="part.imageUrl"
                  class="custom-image"
                />
                <ion-card-header>
                  <ion-card-subtitle>{{ part.condition }}</ion-card-subtitle>
                  <ion-card-subtitle class="card-price">{{
                    part.price
                  }}</ion-card-subtitle>
                  <ion-card-subtitle class="card-title">{{
                    part.title
                  }}</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>

      <!-- Content for the "Autoshop" tab -->
      <div v-if="isAutoShopTab">
        <ion-toolbar>
          <ion-title class="ion-text-center">Autoshop Offers</ion-title>
        </ion-toolbar>
        <ion-toolbar>
          <ion-searchbar
            show-clear-button="focus"
            placeholder="Search deals"
          ></ion-searchbar>
          <ion-buttons slot="end">
  <ion-button expand="block" @click="openModal">
  <ion-icon :icon="funnel" />
</ion-button>
</ion-buttons>
<p>{{ message }}</p>
        </ion-toolbar>

        <ion-grid>
          <ion-row>
            <ion-col v-for="offer in offers" :key="offer.id" size="6">
              <ion-card
                :href="'/market/autoshop/' + offer.id"
                class="custom-card"
              >
                <img
                  alt="Offer image"
                  :src="offer.imageUrl"
                  class="custom-image"
                />
                <ion-card-header>
                  <ion-card-subtitle>{{ offer.deal }}</ion-card-subtitle>
                  <ion-card-title class="card-title">{{
                    offer.shopName
                  }}</ion-card-title>
                </ion-card-header>
              </ion-card>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.custom-card {
  height: 250px;
  margin: 0px;
  overflow: hidden;
}
.custom-image {
  height: 100px;
  width: 200px;
}
.card-title {
  color: black;
  font-size: 16px;
  font-weight: "bold";
  max-width: 200px;
  overflow: hidden;
}
.card-price {
  color: green;
  font-weight: "bold";
  max-width: 200px;
  overflow: hidden;
}
</style>

<script setup lang="ts">
import { useStore } from "vuex";
import { computed } from "vue";

const store = useStore();
const parts = computed(() => store.getters.parts);
const offers = computed(() => store.getters.offers);

const selectedTab = computed(() => store.state.tabs.selectedTab);

const selectTab = (tab: String) => {
  store.commit("tabs/setSelectedTab", tab);
};

const isPartsTab = computed(() => selectedTab.value === "parts");
const isAutoShopTab = computed(() => selectedTab.value === "auto-shop");

import Modal from "../popups/Modal.vue";
import { ref } from "vue";

const message = ref(
  "Sort by: Featured (default)"
);

const openModal = async () => {
  const modal = await modalController.create({
    component: Modal,
  });

  modal.present();

  const { data, role } = await modal.onWillDismiss();

  if (role === "confirm") {
    message.value = `Sort by: ${data}`;
  }
};

import {
  IonHeader,
  modalController,
  IonSegment,
  IonCardTitle,
  IonCard,
  IonSegmentButton,
  IonGrid,
  IonRow,
  IonCol,
  IonCardSubtitle,
  IonPage,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCardHeader,
  IonSearchbar,
  IonButton,
} from "@ionic/vue";
import { funnel } from "ionicons/icons";
</script>
