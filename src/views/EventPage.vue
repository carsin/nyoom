<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Events</ion-title>
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
        <ion-grid>
          <ion-row>
            <ion-col size="6">
              <EventCardComponent username="username" image_src="https://ionicframework.com/docs/img/demos/card-media.png" event-title="Event #1" event-type="Car Meet"></EventCardComponent>
            </ion-col>
            <ion-col size="6">
              <EventCardComponent username="username" image_src="https://ionicframework.com/docs/img/demos/card-media.png" event-title="Event #2" event-type="Car Meet"></EventCardComponent>
            </ion-col>
            <ion-col size="6">
              <EventCardComponent username="username" image_src="https://ionicframework.com/docs/img/demos/card-media.png" event-title="Event #3" event-type="Car Meet"></EventCardComponent>
            </ion-col>
          </ion-row>
        </ion-grid>
          
          <!--<p>{{ message }}</p>
        </ion-toolbar>
        <ion-grid>
          <ion-row>
            <ion-col v-for="part in parts" :key="part.id" size="6">
              <ion-card :href="'/market/' + part.id" class="custom-card">
                <img alt="Part image" :src="part.imageUrl" class="custom-image" />
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
        </ion-grid> -->
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
            <ion-col size="12">
              <EventCardComponent username="username" image_src="https://ionicframework.com/docs/img/demos/card-media.png" event-title="Event #1" event-type="Car Meet"></EventCardComponent>
            </ion-col>
            <ion-col size="12">
              <EventCardComponent username="username" image_src="https://ionicframework.com/docs/img/demos/card-media.png" event-title="Event #2" event-type="Car Meet"></EventCardComponent>
            </ion-col>
            <ion-col size="12">
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
import { useStore } from "vuex";
import { computed } from "vue";
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonSearchbar, 
         IonButton, IonSegment, IonSegmentButton, IonLabel, IonButtons, IonIcon, IonCard } from '@ionic/vue';
import { funnel } from "ionicons/icons";
import EventCardComponent from '@/components/EventCardComponent.vue';

const store = useStore();
const selectedTab = computed(() => store.state.eventTabs.selectedTab);

const selectTab = (tab: String) => {
  store.commit("eventTabs/setSelectedTab", tab);
};

const isRecommendedTab = computed(() => selectedTab.value === "recommended");
const isSubscribedTab = computed(() => selectedTab.value === "subscribed");
// import ExploreContainer from '@/components/ExampleExploreComponent.vue';
</script>
