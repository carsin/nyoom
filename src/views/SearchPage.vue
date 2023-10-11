<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Search</ion-title>
        <ion-button slot="end" fill="outline" href="/login">Login</ion-button>
          <ion-button slot="end" fill="outline" href="/register">Register</ion-button>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar show-clear-button="focus" placeholder="Search vehicles by make, model, or owner"></ion-searchbar>
      </ion-toolbar>
      <ion-toolbar>
        <ion-title size="large">Select Make</ion-title>
      </ion-toolbar>

    </ion-header>
      <ion-content>
        <ion-grid>
          <ion-row> <!-- change the row size somehow? -->
            <ion-col size="4">
              <ion-card>
                <img alt="Audi logo" src="../assets/audi-logo-2.png" height='200' width='250'/>
                <ion-card-header>
                    <ion-card-subtitle>Audi</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>

            <ion-col size="4">
              <ion-card>
                <img alt="Mazda logo" src="../assets/mazda.png" height='200' width='250'/>
                <ion-card-header>
                  <ion-card-subtitle>Mazda</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>

            <ion-col size="4">
              <ion-card>
                <img alt="Porsche logo" src="../assets/porsche.png" height='200' width='170'/>
                <ion-card-header>
                  <ion-card-subtitle>Porsche</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>

            <ion-col size="4">
              <ion-card>
                <img alt="Toyota logo" src="../assets/toyota.png" height='200' width='250'/>
                <ion-card-header>
                  <ion-card-subtitle>Toyota</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>

            <ion-col size="4">
              <ion-card>
                <img alt="Tesla logo" src="../assets/tesla.png" height='200' width='250'/>
                <ion-card-header>
                  <ion-card-subtitle>Tesla</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>

            <ion-col size="4">
              <ion-card>
                <img alt="BMW logo" src="../assets/bmw logo.png" height='200' width='200'/>
                <ion-card-header>
                  <ion-card-subtitle>BMW</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>
          </ion-row>

          <ion-row>
            <ion-col size="4">
              <ion-card>
                <img alt="Subaru logo" src="../assets/subaru logo.png" height='200' width='250'/>
                <ion-card-header>
                    <ion-card-subtitle>Subaru</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>

            <ion-col size="4">
              <ion-card>
                <img alt="Ford logo" src="../assets/ford.png" height='200' width='250'/>
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

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
</script>
