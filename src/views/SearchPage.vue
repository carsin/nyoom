<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Search</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar show-clear-button="focus" placeholder="Search vehicles by make, model, or owner"></ion-searchbar>
      </ion-toolbar>
      <ion-toolbar>
        <ion-title size="large">Select Make</ion-title>
      </ion-toolbar>

      <ion-grid>
        <ion-row> <!-- change the row size somehow? -->

          <ion-col size="4">
            <ion-card>
              <img alt="Audi logo" src="https://ionicframework.com/docs/img/demos/card-media.png"/>
              <ion-card-header>
                  <ion-card-subtitle>Audi</ion-card-subtitle>
              </ion-card-header>
            </ion-card>
          </ion-col>

          <ion-col size="4">
            <ion-card>
              <img alt="Mazda logo" src="https://ionicframework.com/docs/img/demos/card-media.png"/>
              <ion-card-header>
                <ion-card-subtitle>Mazda</ion-card-subtitle>
              </ion-card-header>
            </ion-card>
          </ion-col>

          <ion-col size="4">
            <ion-card>
              <img alt="Porsche logo" src="https://ionicframework.com/docs/img/demos/card-media.png"/>
              <ion-card-header>
                <ion-card-subtitle>Porsche</ion-card-subtitle>
              </ion-card-header>
            </ion-card>
          </ion-col>

          <ion-col size="4">
            <ion-card>
              <img alt="Toyota logo" src="https://ionicframework.com/docs/img/demos/card-media.png"/>
              <ion-card-header>
                <ion-card-subtitle>Toyota</ion-card-subtitle>
              </ion-card-header>
            </ion-card>
          </ion-col>

          <ion-col size="4">
            <ion-card>
              <img alt="Tesla logo" src="https://ionicframework.com/docs/img/demos/card-media.png"/>
              <ion-card-header>
                <ion-card-subtitle>Tesla</ion-card-subtitle>
              </ion-card-header>
            </ion-card>
          </ion-col>

          <ion-col size="4">
            <ion-card>
              <img alt="BMW logo" src="https://ionicframework.com/docs/img/demos/card-media.png"/>
              <ion-card-header>
                <ion-card-subtitle>BMW</ion-card-subtitle>
              </ion-card-header>
            </ion-card>
          </ion-col>

          <ion-col size="4">
            <ion-card>
              <img alt="Subaru logo" src="https://ionicframework.com/docs/img/demos/card-media.png"/>
              <ion-card-header>
                  <ion-card-subtitle>Subaru</ion-card-subtitle>
              </ion-card-header>
            </ion-card>
          </ion-col>

          <ion-col size="4">
            <ion-card>
              <img alt="Ford logo" src="https://ionicframework.com/docs/img/demos/card-media.png"/>
              <ion-card-header>
                <ion-card-subtitle>Ford</ion-card-subtitle>
              </ion-card-header>
            </ion-card>
          </ion-col>

          <ion-col size="4">
            <ion-card>
              <img alt="Make logo" src="https://ionicframework.com/docs/img/demos/card-media.png"/>
              <ion-card-header>
                <ion-card-subtitle>Make</ion-card-subtitle>
              </ion-card-header>
            </ion-card>
          </ion-col>

          <ion-col size="4">
            <ion-card>
              <img alt="Make logo" src="https://ionicframework.com/docs/img/demos/card-media.png"/>
              <ion-card-header>
                <ion-card-subtitle>Make</ion-card-subtitle>
              </ion-card-header>
            </ion-card>
          </ion-col>

          <ion-col size="4">
            <ion-card>
              <img alt="Make logo" src="https://ionicframework.com/docs/img/demos/card-media.png"/>
              <ion-card-header>
                <ion-card-subtitle>Make</ion-card-subtitle>
              </ion-card-header>
            </ion-card>
          </ion-col>

          <ion-col size="4">
            <ion-card>
              <img alt="Make logo" src="https://ionicframework.com/docs/img/demos/card-media.png"/>
              <ion-card-header>
                <ion-card-subtitle>Make</ion-card-subtitle>
              </ion-card-header>
            </ion-card>
          </ion-col>

        <ion-col size="4">
          <ion-card>
            <img alt="Make logo" src="https://ionicframework.com/docs/img/demos/card-media.png"/>
            <ion-card-header>
                <ion-card-subtitle>Make</ion-card-subtitle>
            </ion-card-header>
          </ion-card>
        </ion-col>

        <ion-col size="4">
          <ion-card>
            <img alt="Make logo" src="https://ionicframework.com/docs/img/demos/card-media.png"/>
            <ion-card-header>
              <ion-card-subtitle>Make</ion-card-subtitle>
            </ion-card-header>
          </ion-card>
        </ion-col>

        <ion-col size="4">
          <ion-card>
            <img alt="Make logo" src="https://ionicframework.com/docs/img/demos/card-media.png"/>
            <ion-card-header>
              <ion-card-subtitle>Make</ion-card-subtitle>
            </ion-card-header>
          </ion-card>
        </ion-col>

        <ion-col size="4">
          <ion-card>
            <img alt="Make logo" src="https://ionicframework.com/docs/img/demos/card-media.png"/>
            <ion-card-header>
              <ion-card-subtitle>Make</ion-card-subtitle>
            </ion-card-header>
          </ion-card>
        </ion-col>

        <ion-col size="4">
          <ion-card>
            <img alt="Make logo" src="https://ionicframework.com/docs/img/demos/card-media.png"/>
            <ion-card-header>
              <ion-card-subtitle>Make</ion-card-subtitle>
            </ion-card-header>
          </ion-card>
        </ion-col>

        <ion-col size="4">
          <ion-card>
            <img alt="Make logo" src="https://ionicframework.com/docs/img/demos/card-media.png"/>
            <ion-card-header>
              <ion-card-subtitle>Make</ion-card-subtitle>
            </ion-card-header>
          </ion-card>
        </ion-col>

        </ion-row>

      </ion-grid>

      <!-- <ion-card>
        <img alt="Audi logo" src="https://ionicframework.com/docs/img/demos/card-media.png"/>
        <ion-card-header>
            <ion-card-title>Audi</ion-card-title>
        </ion-card-header>
      </ion-card> -->

    </ion-header>
    <!-- <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Search</ion-title>
        </ion-toolbar>
      </ion-header>

      <ExploreContainer name="Search Page" />
    </ion-content> -->
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import ExploreContainer from '@/components/ExploreContainer.vue';
</script>
