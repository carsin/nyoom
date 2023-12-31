<template>
  <ion-page>
    <ion-header>
      <ion-toolbar collapse="condense">
        <ion-progress-bar
          v-if="isLoading"
          type="indeterminate"
        ></ion-progress-bar>
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
            v-model="searchQuery"
            show-clear-button="focus"
            placeholder="Search parts"
            class="ion-padding-start ion-padding-end"
          ></ion-searchbar>
          <ion-buttons slot="end">
            <ion-button expand="block" @click="filterModal(user.uid)">
              <ion-icon :icon="funnel" />
            </ion-button>
          </ion-buttons>
          <p>{{ message }}</p>
        </ion-toolbar>
        <ion-refresher slot="fixed" @ionRefresh="refreshParts($event)">
          <ion-refresher-content
            pulling-text="Pull to fetch new parts"
            refreshing-spinner="circles"
            refreshing-text="Fetching new parts..."
          >
          </ion-refresher-content>
        </ion-refresher>
        <div v-if="isPartsTab && parts.length > 0">
          <ion-grid>
            <ion-row>
              <ion-col v-for="part in filteredParts" :key="part.id" size="6">
                <ion-card @click="partModal(part)" class="card-dimensions">
                  <img
                    alt="Part image"
                    :src="part.images"
                    class="custom-image"
                  />
                  <ion-card-header>
                    <ion-card-subtitle>{{ part.condition }}</ion-card-subtitle>
                    <ion-card-subtitle class="card-price"
                      >${{ part.price }}</ion-card-subtitle
                    >
                    <ion-card-subtitle class="card-title">
                      {{ part.itemName ? truncateText(part.itemName, 18) : "" }}
                    </ion-card-subtitle>
                  </ion-card-header>
                </ion-card>
              </ion-col>
            </ion-row>
          </ion-grid>
        </div>
        <ion-text v-else class="ion-text-center">
          <h3><i> No one has posted anything :( </i></h3>
        </ion-text>
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
        </ion-toolbar>

        <ion-grid>
          <ion-row>
            <ion-col v-for="offer in offers" :key="offer.id" size="6">
              <ion-card @click="offerModal(offer)" class="card-dimensions">
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
  font-weight: bold;
  max-width: 200px;
  overflow: hidden;
}

.card-dimensions {
  color: green;
  font-weight: bold;
  height: 200px;
  overflow: hidden;
}
</style>

<script setup lang="ts">
import { useStore } from "vuex";
import { computed, ref, onMounted, watch } from "vue";
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
  IonText,
  IonProgressBar,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/vue";
import { funnel } from "ionicons/icons";
import { collection, query, getDocs, where, orderBy } from "firebase/firestore";
import { db, firebaseAuth } from "../firebase-service";
import { useRouter, useRoute } from "vue-router";
import MarketFilter from "../popups/MarketFilter.vue";
import MarketPart from "../popups/MarketPart.vue";
import MarketOffer from "@/popups/MarketOffer.vue";

const user = firebaseAuth.currentUser;
const isLoading = ref(true); // Variable to manage loading state
const route = useRoute();
const router = useRouter();
const partData = ref([{}]); // Reactive variable to store user data
const offerData = ref([{}]); // Reactive variable to store user data
const searchQuery = ref(""); // Reactive variable to store search query
let noResults = false;
const filterSelection = ref("Featured");

onMounted(async () => {
  await fetchParts();
  isLoading.value = false;
});

const fetchParts = async () => {
  let partsQuery = query(collection(db, "parts"));

  if (filterSelection.value === "My Listings") {
    console.log("inside mylistings");
    partsQuery = query(
      collection(db, "parts"),
      where("userId", "==", user?.uid)
    );
    console.log(partsQuery);
  }

  if (filterSelection.value === "Price: High to Low") {
    console.log("inside price sort");
    partsQuery = query(collection(db, "parts"), orderBy("price", "desc"));
    console.log(partsQuery);
  }

  if (filterSelection.value === "Price: Low to High") {
    console.log("inside price sort");
    partsQuery = query(collection(db, "parts"), orderBy("price"));
    console.log(partsQuery);
  }

  if (filterSelection.value === "Newest Arrivals") {
    console.log("inside newest arrivals sort");
    partsQuery = query(collection(db, "parts"), orderBy("timeStamp", "desc"));
    console.log(partsQuery);
  }

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
  const offersQuery = query(collection(db, "offers"));
  const offerSnapshot = await getDocs(offersQuery);

  if (offerSnapshot.empty) {
    //later implement an empty
    noResults = true;
  } else {
    // parts exists
    isLoading.value = false;

    offerData.value = offerSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }
};

const refreshParts = async (event: CustomEvent) => {
  isLoading.value = true;
  await fetchParts();
  isLoading.value = false;
  event.target.complete();
};

// refresh posts after posting
watch(
  () => route.path,
  async (newPath, oldPath) => {
    if (oldPath === "/market/post-part" && newPath === "/market") {
      isLoading.value = true;
      await fetchParts();
      isLoading.value = false;
    }
  }
);

watch(
  () => filterSelection.value,
  async () => {
    isLoading.value = true;
    console.log("refresh out of filter");
    await fetchParts();
    isLoading.value = false;
  }
);

const filteredParts = computed(() => {
  if (!searchQuery.value) {
    return parts.value;
  }
  return parts.value.filter((part) => {
    return part.itemName
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());
  });
});

const truncateText = (text: string, maxLength: number) => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }
  return text;
};

const store = useStore();
const parts = partData;
const offers = offerData;
const selectedTab = computed(() => store.state.tabs.selectedTab);

const selectTab = (tab: string) => {
  store.commit("tabs/setSelectedTab", tab);
};

const isPartsTab = computed(() => selectedTab.value === "parts");
const isAutoShopTab = computed(() => selectedTab.value === "auto-shop");
const message = ref("Sort by: Featured (default)");

const filterModal = async (userId: any) => {
  const modal = await modalController.create({
    component: MarketFilter,
    componentProps: {
      userId: userId,
    },
  });

  modal.present();

  const { data, role } = await modal.onWillDismiss();

  if (role === "confirm") {
    filterSelection.value = `${data}`;
    message.value = `Sort by: ${data}`;
  }
};

const partModal = (part: any) => {
  modalController
    .create({
      component: MarketPart,
      componentProps: {
        part: part,
      },
      cssClass: "your-modal-css-class",
    })
    .then((modal) => {
      modal.present();
    });
};

const offerModal = (offer: any) => {
  modalController
    .create({
      component: MarketOffer,
      componentProps: {
        offer: offer,
      },
      cssClass: "your-modal-css-class",
    })
    .then((modal) => {
      modal.present();
    });
};

const postPart = () => {
  router.push("/market/post-part");
};
</script>
