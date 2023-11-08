<template>
  <ion-page>
    <ion-header>
      <ion-toolbar collapse="condense">
        <ion-title>Market</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-segment v-model="selectedTab">
        <ion-segment-button @click="selectTab('parts')" value="Parts" checked>
          <ion-label>Parts</ion-label>
        </ion-segment-button>
        <ion-segment-button
          @click="selectTab('auto-shop')"
          value="Autoshop Offers"
        >
          <ion-label>Autoshop Offers</ion-label>
        </ion-segment-button>
      </ion-segment>

      <!-- Content for the "Parts" tab -->
      <div v-if="isPartsTab">
        <ion-toolbar>
          <ion-title class="ion-text-center">Local Parts</ion-title>
          <ion-button expand="block" @click="postPart">
            Sell Something!
          </ion-button>
        </ion-toolbar>
        <ion-toolbar>
          <ion-searchbar
            show-clear-button="focus"
            placeholder="Search parts"
            class="ion-padding-start ion-padding-end"
          ></ion-searchbar>
          <ion-buttons slot="end">
            <ion-button expand="block" @click="filterModal">
              <ion-icon :icon="funnel" />
            </ion-button>
          </ion-buttons>
          <p>{{ message }}</p>
        </ion-toolbar>
        <ion-grid>
          <ion-row>
            <ion-col v-for="part in parts" :key="part.id" size="6">
              <ion-card @click="partModal(part)">
                <img
                  alt="Part image"
                  :src="part.images"
                  class="custom-image"
                />
                <ion-card-header>
                  <ion-card-subtitle>{{ part.condition }}</ion-card-subtitle>
                  <ion-card-subtitle class="card-price">{{
                    part.price
                  }}</ion-card-subtitle>
                  <ion-card-subtitle class="card-title">{{
                    part.itemName
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
            <ion-button expand="block" @click="filterModal">
              <ion-icon :icon="funnel" />
            </ion-button>
          </ion-buttons>
          <p>{{ message }}</p>
        </ion-toolbar>

        <ion-grid>
          <ion-row>
            <ion-col v-for="offer in offers" :key="offer.id" size="6">
              <ion-card @click="offerModal(offer)">
                <img
                  alt="Offer image"
                  :src="offer.images"
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
import { computed, ref, onMounted } from "vue";
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
  IonButtons,
  IonLabel,
  IonIcon,
} from "@ionic/vue";
import { funnel } from "ionicons/icons";
import { collection, query, getDocs, } from "firebase/firestore";
import { db } from "../firebase-service";
import { useRouter, useRoute } from "vue-router";

const isLoading = ref(true); // Variable to manage loading state
const route = useRoute();
const router = useRouter();
const partData = ref([{}]); // Reactive variable to store user data
const toast = ref({ isOpen: false, message: "", color: "" });
const posts = ref([]); // Variable to hold the user's posts
let noResults = false;

onMounted(async () => {
  const partsQuery = query(collection(db, "parts"));
  const partSnapshot = await getDocs(partsQuery);

  if (partSnapshot.empty) {
    //later implement an empty
    noResults = true;
  } else {
    // parts exists
    isLoading.value = false;

    partData.value = partSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }
});

const store = useStore();
const parts = partData;
const offers = computed(() => store.getters.offers);
const selectedTab = computed(() => store.state.tabs.selectedTab);

const selectTab = (tab: string) => {
  store.commit("tabs/setSelectedTab", tab);
};

const isPartsTab = computed(() => selectedTab.value === "parts");
const isAutoShopTab = computed(() => selectedTab.value === "auto-shop");

import MarketFilter from "../popups/MarketFilter.vue";
import MarketPart from "../popups/MarketPart.vue";
import MarketOffer from "@/popups/MarketOffer.vue";


const message = ref("Sort by: Featured (default)");

const filterModal = async () => {
  const modal = await modalController.create({
    component: MarketFilter,
  });

  modal.present();

  const { data, role } = await modal.onWillDismiss();

  if (role === "confirm") {
    message.value = `Sort by: ${data}`;
  }
};
const partModal = (part:any) => {
  modalController.create({
    component: MarketPart,
    componentProps: {
      part: part,
    },
    cssClass: 'your-modal-css-class', // Add a custom CSS class if needed
  }).then((modal) => {
    modal.present();
  });
};

const offerModal = (offer:any) => {
  modalController.create({
    component: MarketOffer,
    componentProps: {
      offer: offer,
    },
    cssClass: 'your-modal-css-class', // Add a custom CSS class if needed
  }).then((modal) => {
    modal.present();
  });
};

const postPart = () => {
  router.push("/market/post-part");
};
</script>
