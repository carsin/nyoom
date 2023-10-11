<template>
  <base-layout page-title="Market">
  </base-layout>
    <ion-content>
      <ion-toolbar>
        <ion-searchbar show-clear-button="focus" placeholder="Search parts"></ion-searchbar>
      </ion-toolbar>

      <ion-toolbar>
        <ion-title size="large">Local Parts</ion-title>
      </ion-toolbar>

      <ion-grid>
        <ion-row>
          <ion-col v-for="part in parts" :key="part.id" size="2">
            <ion-card :href="'market/' + part.id">
              <img alt="Part image" :src="part.imageUrl" />
              <ion-card-header>
                <ion-card-title>{{ part.title }}</ion-card-title>
                <ion-card-subtitle>{{ part.description }}</ion-card-subtitle>
              </ion-card-header>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>

      <ion-toolbar>
        <ion-title size="large">Autoshop Offers</ion-title>
      </ion-toolbar>
      <ion-grid>
        <ion-row>
          <ion-col v-for="offer in offers" :key="offer.id" size="2">
            <ion-card :router-link="'market/' + offer.id">
              <img alt="Offer image" :src="offer.imageUrl" />
              <ion-card-header>
                <ion-card-title>{{ offer.shopName }}</ion-card-title>
                <ion-card-subtitle>{{ offer.deal }}</ion-card-subtitle>
              </ion-card-header>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>

</template>

<script setup lang="ts">
import { useStore } from "vuex";
import { computed } from "vue";

const store = useStore();

const parts = computed(() => store.getters.parts);
const offers = computed(() => store.getters.offers);
</script>

