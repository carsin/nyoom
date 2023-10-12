<template>
  <ion-page>
    <!-- <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button>
            <ion-icon slot="icon-only" :icon="settingsSharp"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button>
            <ion-icon slot="icon-only" :icon="peopleSharp"></ion-icon>
          </ion-button>
          <ion-button>
            <ion-icon slot="icon-only" :icon="carSportSharp"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title align="center">@username</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-button fill="clear">
          <ion-img src="src\sources\modified-race-car.jpg"></ion-img>
        </ion-button>
      </ion-toolbar>
      <ion-toolbar>
        <ion-title align="center" size="small">here is where the bio goes. There will be a word/letter limit on the bio in the future.</ion-title>
      </ion-toolbar>
    </ion-header> -->

    <ion-content :fullscreen="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button>
            <ion-icon slot="icon-only" :icon="settingsSharp"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button>
            <ion-icon slot="icon-only" :icon="peopleSharp"></ion-icon>
          </ion-button>
          <ion-button>
            <ion-icon slot="icon-only" :icon="carSportSharp"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title align="center">@username</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-button fill="clear">
          <ion-img src="src\sources\modified-race-car.jpg"></ion-img>
        </ion-button>
      </ion-toolbar>
      <ion-toolbar>
        <ion-title align="center" size="small">here is where the bio goes. There will be a word/letter limit on the bio in the future.</ion-title>
      </ion-toolbar>
      <ion-list>
        <ion-item>
          <ion-card>
              <img alt="Part image" src="https://ionicframework.com/docs/img/demos/card-media.png"/>
              <ion-card-header>
                <ion-card-title>Car #1</ion-card-title>
                <ion-card-subtitle>Car Description</ion-card-subtitle>
              </ion-card-header>
          </ion-card>
        </ion-item>
        <ion-item>
          <ion-card>
              <img alt="Part image" src="https://ionicframework.com/docs/img/demos/card-media.png"/>
              <ion-card-header>
                <ion-card-title>Car #2</ion-card-title>
                <ion-card-subtitle>Car Description</ion-card-subtitle>
              </ion-card-header>
          </ion-card>
        </ion-item>
        <ion-item>
          <ion-card>
              <img alt="Part image" src="https://ionicframework.com/docs/img/demos/card-media.png"/>
              <ion-card-header>
                <ion-card-title>Car #3</ion-card-title>
                <ion-card-subtitle>Car Description</ion-card-subtitle>
              </ion-card-header>
          </ion-card>
        </ion-item>
        <ion-item>
          <ion-card>
              <img alt="Part image" src="https://ionicframework.com/docs/img/demos/card-media.png"/>
              <ion-card-header>
                <ion-card-title>Car #4</ion-card-title>
                <ion-card-subtitle>Part Description</ion-card-subtitle>
              </ion-card-header>
          </ion-card>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import ExploreContainer from '@/components/ExploreContainer.vue';
</script>
