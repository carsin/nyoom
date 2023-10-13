<template>
  <ion-page>
    <ion-toolbar collapse="condense">
        <ion-title>Market</ion-title>
        <ion-button slot="end" fill="outline" href="/login">Login</ion-button>
        <ion-button slot="end" fill="outline" href="/register">Register</ion-button>
      </ion-toolbar>
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
      <div v-if="isPartsTab" class="content-with-margin">
        <ion-toolbar>
          <ion-searchbar
            show-clear-button="focus"
            placeholder="Search parts"
          ></ion-searchbar>
        </ion-toolbar>
        <ion-toolbar>
          <ion-title size="large">Local Parts</ion-title>
        </ion-toolbar>
        <ion-grid>
          <ion-row>
            <ion-col v-for="part in parts" :key="part.id" size="2">
              <ion-card :href="'/market/' + part.id">
                <img alt="Part image" :src="part.imageUrl" />
                <ion-card-header>
                  <ion-card-title>{{ part.title }}</ion-card-title>
                  <ion-card-subtitle>{{ part.price }}</ion-card-subtitle>
                  <ion-card-subtitle>{{ part.condition }}</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>

      <!-- Content for the "Autoshop" tab -->
      <div v-if="isAutoShopTab" class="content-with-margin">
        <ion-toolbar>
          <ion-searchbar
            show-clear-button="focus"
            placeholder="Search deals"
          ></ion-searchbar>
        </ion-toolbar>
        <ion-toolbar>
          <ion-title size="large">Autoshop Offers</ion-title>
        </ion-toolbar>
        <ion-grid>
          <ion-row>
            <ion-col v-for="offer in offers" :key="offer.id" size="2">
              <ion-card :href="'/market/autoshop/' + offer.id">
                <img alt="Offer image" :src="offer.imageUrl" />
                <ion-card-header>
                  <ion-card-title>{{ offer.shopName }}</ion-card-title>
                  <ion-card-subtitle>{{ offer.deal }}</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
    </ion-content>
  </ion-page>
</template>

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

import { IonLabel, IonSegment, IonCardTitle, IonCard, IonSegmentButton, IonGrid, IonRow, IonCol, IonCardSubtitle, IonPage, IonToolbar, IonTitle, IonContent, IonCardHeader, IonSearchbar } from '@ionic/vue';
</script>

<style scoped>
.content-with-margin {
  margin-bottom: 40px; /* Adjust the margin size as needed */
}
</style>