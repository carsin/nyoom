<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>Audi Models</ion-title>
        </ion-toolbar>
        <ion-toolbar>
          <ion-searchbar show-clear-button="focus" placeholder="Search Audi vehicles by model or owner"></ion-searchbar>
        </ion-toolbar>
        <ion-toolbar>
          <ion-title size="large">Select Model</ion-title>
          <ion-button class="back" slot="end" fill="outline" href="/search">Back</ion-button>
        </ion-toolbar>
  
      </ion-header>
        <ion-content :fullscreen="true">
          <ion-grid>
            <ion-row>
              <ion-col size="4">
                <ion-card>
                  <img alt="Audi logo" src="../assets/logos/audi.png" height='200' width='250'/>
                  <ion-card-header>
                      <ion-card-subtitle>Audi</ion-card-subtitle>
                  </ion-card-header>
                </ion-card>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/vue';
</script>