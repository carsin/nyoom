<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Profile</ion-title>
        <ion-button slot="end" fill="outline" href="/login">Login</ion-button>
        <ion-button slot="end" fill="outline" href="/register">Register</ion-button>
      </ion-toolbar>
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
        </ion-buttons>
        <ion-title align="center">@username</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
     
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
        <ion-item>
          <ExploreContainer name="Profile page" />
        </ion-item>
      </ion-list>

      
    </ion-content>
    
  </ion-page>
</template>

<script lang="ts">
import { IonIcon, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonList, IonCard, IonItem, } from '@ionic/vue';
import { settingsSharp, peopleSharp } from 'ionicons/icons';
import { defineComponent } from 'vue';
//import ExploreContainer from '@/components/ExploreContainer.vue';
export default defineComponent({
    components: { IonButton, IonButtons, IonIcon, IonTitle, IonToolbar, IonList, IonItem, IonCard },
    setup() {
      return { settingsSharp, peopleSharp };
    },
  });
</script>
