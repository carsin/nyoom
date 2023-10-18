<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Events</ion-title>
        <ion-button class="back" slot="end" fill="outline" href="/">Log Out</ion-button>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar show-clear-button="focus" placeholder="Search events"></ion-searchbar>
      </ion-toolbar>
    </ion-header>
      <ion-content :fullscreen="true">
        <ion-grid>
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
        </ion-grid>
      </ion-content>
  </ion-page>
</template>

<style>
.back{
  padding-right: 15px;
}
</style>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonSearchbar, IonButton } from '@ionic/vue';
import ExploreContainer from '@/components/ExampleExploreComponent.vue';
</script>
