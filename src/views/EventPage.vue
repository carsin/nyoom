<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Events</ion-title>
        <router-link slot="end" to="/create-event">
          <ion-button fill="outline" class="ion-padding-end">Create Event</ion-button>
        </router-link>
      </ion-toolbar>
      <!-- <ion-toolbar>
        <ion-searchbar show-clear-button="focus" placeholder="Search events"></ion-searchbar>
      </ion-toolbar> -->
      
    </ion-header>
      <ion-content :fullscreen="true">
        <ion-segment v-model="selectedTab"> 
          <ion-segment-button @click="selectTab('recommended')" value="Recommended Events" checked> 
            <ion-label>Recommended</ion-label> 
          </ion-segment-button>
          <ion-segment-button @click="selectTab('subscribed')" value="Subscribed Events">
            <ion-label>Subscribed</ion-label>
          </ion-segment-button>
        </ion-segment>

      <div v-if="isRecommendedTab">
        <ion-toolbar>
          <ion-title class="ion-text-center">Recommended Events</ion-title>
        </ion-toolbar>
        <ion-toolbar>
          <ion-searchbar show-clear-button="focus" placeholder="Search parts"
            class="ion-padding-start ion-padding-end"></ion-searchbar>
          <ion-buttons slot="end">
            <ion-button expand="block">
              <ion-icon :icon="funnel"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
        <div v-if="events.length > 0">
          <ion-grid>
            <ion-row>
              <ion-col size-sm="12" size-md="12" size-lg="6" v-for="event in events" :key="event.id">
                <EventCardComponent :imageId="event.id" :username="event.username" :eventDescription="event.eventDescription"
                  :image_src="event.imageUrl" :imagePath="event.imagePath" :userId="event.userId" :timestamp="event.timestamp"
                  :eventName="event.eventName" :eventType="event.eventType" :datetime="event.datetime" showAvatar />
              </ion-col>
            <!-- <ion-col size-sm="12" size-md="12" size-lg="6" size-xl="4">
              <EventCardComponent username="username" image_src="https://ionicframework.com/docs/img/demos/card-media.png" event-title="Event #1" event-type="Car Meet"></EventCardComponent>
            </ion-col>
            <ion-col size-sm="12" size-md="12" size-lg="6" size-xl="4">
              <EventCardComponent username="username" image_src="https://ionicframework.com/docs/img/demos/card-media.png" event-title="Event #2" event-type="Car Meet"></EventCardComponent>
            </ion-col>
            <ion-col size-sm="12" size-md="12" size-lg="6" size-xl="4">
              <EventCardComponent username="username" image_src="https://ionicframework.com/docs/img/demos/card-media.png" event-title="Event #3" event-type="Car Meet"></EventCardComponent>
            </ion-col> -->
            </ion-row>
          </ion-grid>
        </div>
        <ion-text v-else class="ion-text-center">
          <h3> <i> No one has posted anything :( </i></h3>
        </ion-text>
      </div>

      <div v-if="isSubscribedTab">
        <ion-toolbar>
          <ion-title class="ion-text-center">Subscribed Events</ion-title>
        </ion-toolbar>
        <ion-toolbar>
          <ion-searchbar show-clear-button="focus" placeholder="Search Events"
            class="ion-padding-start ion-padding-end"></ion-searchbar>
          <ion-buttons slot="end">
            <ion-button expand="block">
              <ion-icon :icon="funnel"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
        <ion-grid>
          <ion-row>
            <ion-col size-sm="12" size-md="12" size-lg="6" size-xl="4">
              <EventCardComponent username="username" image_src="https://ionicframework.com/docs/img/demos/card-media.png" event-title="Event #1" event-type="Car Meet"></EventCardComponent>
            </ion-col>
            <ion-col size-sm="12" size-md="12" size-lg="6" size-xl="4">
              <EventCardComponent username="username" image_src="https://ionicframework.com/docs/img/demos/card-media.png" event-title="Event #2" event-type="Car Meet"></EventCardComponent>
            </ion-col>
            <ion-col size-sm="12" size-md="12" size-lg="6" size-xl="4">
              <EventCardComponent username="username" image_src="https://ionicframework.com/docs/img/demos/card-media.png" event-title="Event #3" event-type="Car Meet"></EventCardComponent>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>

      
        <!-- <ion-grid>
          <ion-row>
            <ion-col>
              <img alt="Google Map Pic" src="../assets/GoogleMapPic.webp"/>
            </ion-col>
            <ion-col>
              <ion-toolbar>
                <ion-title size="large">Local Events</ion-title>
              </ion-toolbar>
            </ion-col>
            <ion-col>
              <ion-toolbar>
                <ion-title size="large">Previously Attended Events</ion-title>
              </ion-toolbar>
            </ion-col>
          </ion-row>
        </ion-grid> -->
      </ion-content>
  </ion-page>
</template>

<style>
.back{
  padding-right: 15px;
}
</style>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useStore } from "vuex";
import { computed } from "vue";
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonSearchbar, 
         IonButton, IonSegment, IonSegmentButton, IonLabel, IonButtons, IonIcon, IonCard } from '@ionic/vue';
import { funnel } from "ionicons/icons";
import { db, firebaseAuth } from "../firebase-service";
import { useRoute } from 'vue-router';

import EventCardComponent from '@/components/EventCardComponent.vue';

const events = ref([]); // Variable to hold the events
const store = useStore();
const selectedTab = computed(() => store.state.eventTabs.selectedTab);
const isLoading = ref(true); // Variable to manage loading state
const user = firebaseAuth.currentUser;
const route = useRoute();

onMounted(async () => {
  await fetchEvents();
  isLoading.value = false;
});

const fetchEvents = async () => {
  // Query all events and order by timestamp
  const eventsQuery = query(
    collection(db, 'events'),
    orderBy('timestamp', 'desc') // Ordering by timestamp in descending order
  );
  const querySnapshot = await getDocs(eventsQuery);

  events.value = querySnapshot.docs.map(doc => {
    const eventData = doc.data();
    return {
      id: doc.id,
      // isUpvoted: eventData.upvoters.includes(user?.uid),
      // isDownvoted: eventData.downvoters.includes(user?.uid),
      ...eventData
    };
  });
}

const refreshEvents = async (event: CustomEvent) => {
  isLoading.value = true;
  await fetchEvents();
  isLoading.value = false;
  event.target.complete();
}

// refresh posts after posting
watch(() => route.path, async (newPath, oldPath) => {
  if (oldPath === '/create-event' && newPath === '/events') {
    isLoading.value = true;
    await fetchEvents();
    isLoading.value = false;
  }
});

const selectTab = (tab: String) => {
  store.commit("eventTabs/setSelectedTab", tab);
};

const isRecommendedTab = computed(() => selectedTab.value === "recommended");
const isSubscribedTab = computed(() => selectedTab.value === "subscribed");
// import ExploreContainer from '@/components/ExampleExploreComponent.vue';
</script>
