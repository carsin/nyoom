<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Market</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar show-clear-button="focus" placeholder="Search parts"></ion-searchbar>
      </ion-toolbar>
      <ion-toolbar>
        <ion-title size="large">Local Parts</ion-title>
      </ion-toolbar>

      <ion-grid>
        <ion-row> <!-- change the row size somehow? -->

          <ion-col size="2">
            <ion-card>
              <img alt="Part image" src="https://ionicframework.com/docs/img/demos/card-media.png"/>
              <ion-card-header>
                <ion-card-title>Part Title</ion-card-title>
                <ion-card-subtitle>Part Description</ion-card-subtitle>
              </ion-card-header>
            </ion-card>
          </ion-col>

          <ion-col size="2">
            <ion-card>
              <img alt="Part image" src="https://ionicframework.com/docs/img/demos/card-media.png"/>
              <ion-card-header>
                <ion-card-title>Part Title</ion-card-title>
                <ion-card-subtitle>Part Description</ion-card-subtitle>
              </ion-card-header>
            </ion-card>
          </ion-col>

          <ion-col size="2">
            <ion-card>
              <img alt="Part image" src="https://ionicframework.com/docs/img/demos/card-media.png"/>
              <ion-card-header>
                <ion-card-title>Part Title</ion-card-title>
                <ion-card-subtitle>Part Description</ion-card-subtitle>
              </ion-card-header>
            </ion-card>
          </ion-col>

          <ion-col size="2">
            <ion-card>
              <img alt="Part image" src="https://ionicframework.com/docs/img/demos/card-media.png"/>
              <ion-card-header>
                <ion-card-title>Part Title</ion-card-title>
                <ion-card-subtitle>Part Description</ion-card-subtitle>
              </ion-card-header>
            </ion-card>
          </ion-col>

          <ion-col size="2">
            <ion-card>
              <img alt="Part image" src="https://ionicframework.com/docs/img/demos/card-media.png"/>
              <ion-card-header>
                <ion-card-title>Part Title</ion-card-title>
                <ion-card-subtitle>Part Description</ion-card-subtitle>
              </ion-card-header>
            </ion-card>
          </ion-col>

          <ion-col size="2">
            <ion-card>
              <img alt="Part image" src="https://ionicframework.com/docs/img/demos/card-media.png"/>
              <ion-card-header>
                <ion-card-title>Part Title</ion-card-title>
                <ion-card-subtitle>Part Description</ion-card-subtitle>
              </ion-card-header>
            </ion-card>
          </ion-col>

        </ion-row>
      </ion-grid>

      <ion-toolbar>
        <ion-title size="large">Autoshop Offers</ion-title>
      </ion-toolbar>

      <ion-grid>
        <ion-row> <!-- change the row size somehow? -->

          <ion-col size="2">
            <ion-card>
              <img alt="Part image" src="https://ionicframework.com/docs/img/demos/card-media.png"/>
              <ion-card-header>
                <ion-card-title>Part Title</ion-card-title>
                <ion-card-subtitle>Part Description</ion-card-subtitle>
              </ion-card-header>
            </ion-card>
          </ion-col>

          <ion-col size="2">
            <ion-card>
              <img alt="Part image" src="https://ionicframework.com/docs/img/demos/card-media.png"/>
              <ion-card-header>
                <ion-card-title>Part Title</ion-card-title>
                <ion-card-subtitle>Part Description</ion-card-subtitle>
              </ion-card-header>
            </ion-card>
          </ion-col>

          <ion-col size="2">
            <ion-card>
              <img alt="Part image" src="https://ionicframework.com/docs/img/demos/card-media.png"/>
              <ion-card-header>
                <ion-card-title>Part Title</ion-card-title>
                <ion-card-subtitle>Part Description</ion-card-subtitle>
              </ion-card-header>
            </ion-card>
          </ion-col>

          <ion-col size="2">
            <ion-card>
              <img alt="Part image" src="https://ionicframework.com/docs/img/demos/card-media.png"/>
              <ion-card-header>
                <ion-card-title>Part Title</ion-card-title>
                <ion-card-subtitle>Part Description</ion-card-subtitle>
              </ion-card-header>
            </ion-card>
          </ion-col>

          <ion-col size="2">
            <ion-card>
              <img alt="Part image" src="https://ionicframework.com/docs/img/demos/card-media.png"/>
              <ion-card-header>
                <ion-card-title>Part Title</ion-card-title>
                <ion-card-subtitle>Part Description</ion-card-subtitle>
              </ion-card-header>
            </ion-card>
          </ion-col>

          <ion-col size="2">
            <ion-card>
              <img alt="Part image" src="https://ionicframework.com/docs/img/demos/card-media.png"/>
              <ion-card-header>
                <ion-card-title>Part Title</ion-card-title>
                <ion-card-subtitle>Part Description</ion-card-subtitle>
              </ion-card-header>
            </ion-card>
          </ion-col>

        </ion-row>
      </ion-grid>

    </ion-header>

    <!-- <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Market</ion-title>
        </ion-toolbar> -->
      <!-- </ion-header>

      <ExploreContainer name="Market Page" />
    </ion-content> -->
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import ExploreContainer from '@/components/ExploreContainer.vue';
</script>
