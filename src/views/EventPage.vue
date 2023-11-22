<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Events</ion-title>
        <router-link slot="end" to="/create-event">
          <ion-button class="ion-padding-end">Create Event</ion-button>
        </router-link>
      </ion-toolbar>
    </ion-header>
      <ion-content :fullscreen="true">
        <ion-refresher slot="fixed" @ionRefresh="refreshEvents($event)">
          <ion-refresher-content pulling-text="Pull to fetch events" refreshing-spinner="circles"
            refreshing-text="Fetching events...">
          </ion-refresher-content>
        </ion-refresher>
        <ion-segment v-model="selectedTab"> 
          <ion-segment-button @click="selectTab('recommended'); fetchRecommendedEvents()" value="Recommended Events" checked> 
            <ion-label>Recommended</ion-label> 
          </ion-segment-button>
          <ion-segment-button @click="selectTab('subscribed'); fetchSubscribedEvents()" value="Subscribed Events">
            <ion-label>Subscribed</ion-label>
          </ion-segment-button>
        </ion-segment>

        <div v-if="isRecommendedTab">
          <ion-toolbar>
            <ion-title class="ion-text-center">Recommended Events</ion-title>
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
          <div v-if="events.length > 0">
            <ion-grid>
              <ion-row>
                <ion-col size-sm="12" size-md="12" size-lg="6" v-for="event in events" :key="event.id">
                  <EventCardComponent :eventId="event.id" :username="event.username" :eventDescription="event.eventDescription"
                    :image_src="event.imageUrl" :imagePath="event.imagePath" :userId="event.userId" :timestamp="event.timestamp"
                    :eventName="event.eventName" :eventType="event.eventType" :datetime="event.datetime" showAvatar />
                </ion-col>
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
          <div v-if="subEvents.length > 0">
            <ion-grid>
              <ion-row>
                <ion-col size-sm="12" size-md="12" size-lg="6" v-for="event in subEvents" :key="event.id">
                  <EventCardComponent :eventId="event.id" :username="event.username" :eventDescription="event.eventDescription"
                    :image_src="event.imageUrl" :imagePath="event.imagePath" :userId="event.userId" :timestamp="event.timestamp"
                    :eventName="event.eventName" :eventType="event.eventType" :datetime="event.datetime" showAvatar />
                </ion-col>
              </ion-row>
            </ion-grid>
          </div>
          <ion-text v-else class="ion-text-center">
            <h3> <i> You have no subscribed events :( </i></h3>
          </ion-text>
        </div>
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
import { doc, getDoc, getDocs, query, collection, orderBy} from "firebase/firestore";
import { useStore } from "vuex";
import { computed } from "vue";
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonSearchbar, IonButton, 
        IonSegment, IonSegmentButton, IonLabel, IonButtons, IonIcon, IonText, IonRefresher, IonRefresherContent } from '@ionic/vue';
import { funnel } from "ionicons/icons";
import { db, firebaseAuth } from "../firebase-service";
import { useRoute } from 'vue-router';

import EventCardComponent from '@/components/EventCardComponent.vue';

const events = ref([]); // Variable to hold the events
const subEvents = ref([]); // Variable to hold the subscribed events
const userData = ref(); // Variable to store users data
const store = useStore();
const selectedTab = computed(() => store.state.eventTabs.selectedTab);
const isLoading = ref(true); // Variable to manage loading state
const route = useRoute();
const toast = ref({ isOpen: false, message: '', color: '' });

onMounted(async () => {
  await fetchRecommendedEvents();
  await fetchSubscribedEvents();
  isLoading.value = false;
});

const fetchRecommendedEvents = async () => {
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
      ...eventData
    };
  });
}

const fetchSubscribedEvents = async () => {
  const currentUser = firebaseAuth.currentUser;
  if(currentUser){
    const currentUserDocRef = doc(db, 'users', currentUser.uid);
    const currentUserDoc = await getDoc(currentUserDocRef);
    if(currentUserDoc.exists()) {
      userData.value = { id: currentUserDoc.id, ...currentUserDoc.data() };
    }
    try {
      const docs = [];

      for (const documentId of userData.value.subscribedEvents) {
        const documentRef = doc(db, 'events', documentId);
        const docSnapshot = await getDoc(documentRef);

        if (docSnapshot.exists()) {
          docs.push({ id: docSnapshot.id, ...docSnapshot.data() });
        } else {
          console.warn(`Document with ID ${documentId} does not exist`);
        }
      }
        subEvents.value = docs;
    } catch (error: any) {
      toast.value = { isOpen: true, message: 'An error occurred: ' + error.message, color: 'danger' };
    }
  }
}

const refreshEvents = async (event: CustomEvent) => {
  isLoading.value = true;
  await fetchRecommendedEvents();
  await fetchSubscribedEvents();
  isLoading.value = false;
  event.target.complete();
}

// refresh posts after posting
watch(() => route.path, async (newPath, oldPath) => {
  if (oldPath === '/create-event' && newPath === '/events') {
    isLoading.value = true;
    await fetchRecommendedEvents();
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
