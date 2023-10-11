<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-toolbar>
        <ion-grid>
          <ion-row>
            <ion-col size="1">
              <ion-buttons>
                <ion-button>
                  <ion-icon slot="icon-only" :icon="settingsSharp"></ion-icon>
                </ion-button>
              </ion-buttons>
            </ion-col>
            <ion-col class="ion-text-center" size="10">
              <ion-title align="center">@username</ion-title>
              <img id="profile-avatar" src="/src/assets/modified-race-car.jpg"/>
            </ion-col>
            <ion-col size="1">
              <ion-buttons class="ion-float-right">
                <ion-list>
                  <ion-item>
                    <ion-button>
                      <ion-icon slot="icon-only" :icon="peopleSharp"></ion-icon>
                    </ion-button>
                  </ion-item>
                  <ion-item>
                    <ion-button>
                      <ion-icon slot="icon-only" :icon="carSportSharp"></ion-icon>
                    </ion-button>
                  </ion-item>
                </ion-list>
              </ion-buttons>
            </ion-col>
          </ion-row>
          <ion-row class="ion-text-center">
            <ion-title size="small">here is where the bio goes. There will be a word/letter limit on the bio in the future.</ion-title>
          </ion-row>
        </ion-grid>
      </ion-toolbar>
      <ion-list>
        <ion-item>
          <ion-card>
            <img alt="Part image" src="https://ionicframework.com/docs/img/demos/card-media.png" />
            <ion-card-header>
              <ion-card-title>Car #1</ion-card-title>
              <ion-card-subtitle>Car Description</ion-card-subtitle>
            </ion-card-header>
          </ion-card>
        </ion-item>
        <ion-item>
          <ion-card>
            <img alt="Part image" src="https://ionicframework.com/docs/img/demos/card-media.png" />
            <ion-card-header>
              <ion-card-title>Car #2</ion-card-title>
              <ion-card-subtitle>Car Description</ion-card-subtitle>
            </ion-card-header>
          </ion-card>
        </ion-item>
        <ion-item>
          <ion-card>
            <img alt="Part image" src="https://ionicframework.com/docs/img/demos/card-media.png" />
            <ion-card-header>
              <ion-card-title>Car #3</ion-card-title>
              <ion-card-subtitle>Car Description</ion-card-subtitle>
            </ion-card-header>
          </ion-card>
        </ion-item>
        <ion-item>
          <ion-card>
            <img alt="Part image" src="https://ionicframework.com/docs/img/demos/card-media.png" />
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

<style>
  #profile-avatar {
    border-radius: 50%;
    width: 100px;
    height: 100px;
    object-fit: cover;
  }
</style>

<script lang="ts">
  import { IonAvatar, IonGrid, IonRow, IonCol, IonIcon, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonList, IonCard, IonItem, IonImg } from '@ionic/vue';
  import { settingsSharp, peopleSharp, carSportSharp } from 'ionicons/icons';
  import { defineComponent } from 'vue';
  export default defineComponent({
    components: { IonButton, IonButtons, IonIcon, IonTitle, IonToolbar, IonList, IonItem, IonCard, IonImg, IonGrid, IonRow, IonCol },
    setup() {
      return { settingsSharp, peopleSharp, carSportSharp };
    },
  });
</script>
