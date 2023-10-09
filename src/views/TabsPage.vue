<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="tab1" href="/home">
          <ion-icon aria-hidden="true" :icon="home" />
          <ion-label>Feed</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab2" href="/search">
          <ion-icon aria-hidden="true" :icon="search" />
          <ion-label>Search</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab3" href="/events">
          <ion-icon aria-hidden="true" :icon="balloon" />
          <ion-label>Events</ion-label>
        </ion-tab-button>
                
        <ion-tab-button tab="tab4" href="/market">
          <ion-icon aria-hidden="true" :icon="cart" />
          <ion-label>Market</ion-label>
        </ion-tab-button>
                
        <ion-tab-button tab="tab5" href="/profile">
          <ion-icon aria-hidden="true" :icon="person" />
          <ion-label>My Profile</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { home, search, balloon, cart, person } from 'ionicons/icons';
</script>
