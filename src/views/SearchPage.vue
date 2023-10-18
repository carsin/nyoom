<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Search</ion-title>
        <ion-button class="back" slot="end" fill="outline" href="/">Log Out</ion-button>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar show-clear-button="focus" placeholder="Search vehicles by make, model, or owner"></ion-searchbar>
      </ion-toolbar>
      <ion-toolbar>
        <ion-title size="large">Select Make</ion-title>
      </ion-toolbar>

    </ion-header>
      <ion-content :fullscreen="true">
        <ion-grid>
          <ion-row>
            <ion-col size="4">
              <ion-card href="audiModels">
                <ion-title align="center">
                  <img alt="Audi logo" src="../assets/logos/audi-logo-2.png" height='200' width='250'/>
                </ion-title>
                <ion-card-header>
                    <ion-card-subtitle>Audi</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>

            <ion-col size="4">
              <ion-card>
                <ion-title align="center">
                  <img alt="Mazda logo" src="../assets/logos/mazda.png" height='200' width='250'/>
                </ion-title>
                <ion-card-header>
                  <ion-card-subtitle>Mazda</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>

            <ion-col size="4">
              <ion-card>
                <ion-title align="center">
                  <img alt="Porsche logo" src="../assets/logos/porsche.png" height='200' width='170'/>
                </ion-title>
                <ion-card-header>
                  <ion-card-subtitle>Porsche</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>

            <ion-col size="4">
              <ion-card>
                <ion-title align="center">
                  <img alt="Toyota logo" src="../assets/logos/toyota.png" height='200' width='250'/>
                </ion-title>
                <ion-card-header>
                  <ion-card-subtitle>Toyota</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>

            <ion-col size="4">
              <ion-card>
                <ion-title align="center">
                  <img alt="Tesla logo" src="../assets/logos/tesla.png" height='200' width='250'/>
                </ion-title>
                <ion-card-header>
                  <ion-card-subtitle>Tesla</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>

            <ion-col size="4">
              <ion-card>
                <ion-title align="center">
                  <img alt="BMW logo" src="../assets/logos/bmw logo.png" height='200' width='200'/>
                </ion-title>
                <ion-card-header>
                  <ion-card-subtitle>BMW</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>
          </ion-row>

          <ion-row>
            <ion-col size="4">
              <ion-card>
                <ion-title align="center">
                  <img alt="Subaru logo" src="../assets/logos/subaru logo.png" height='200' width='250'/>
                </ion-title>
                <ion-card-header>
                    <ion-card-subtitle>Subaru</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>

            <ion-col size="4">
              <ion-card>
                <ion-title align="center">
                  <img alt="Ford logo" src="../assets/logos/ford.png" height='200' width='300'/>
                </ion-title>
                <ion-card-header>
                  <ion-card-subtitle>Ford</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>

            <ion-col size="4">
              <ion-card>
                <ion-title align="center">
                  <img alt="Nissan logo" src="../assets/logos/nissan.png" height="200" width="225"/>
                </ion-title>
                <ion-card-header>
                  <ion-card-subtitle>Nissan</ion-card-subtitle>
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

          <ion-row>
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
      </ion-content>
  </ion-page>
</template>

<style>
.back{
  padding-right: 15px;
}
</style>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardSubtitle, IonSearchbar } from '@ionic/vue';
</script>
