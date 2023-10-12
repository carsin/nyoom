<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>Login</ion-title>
          <ion-button slot="end" fill="solid" href="/login">Login</ion-button>
          <ion-button slot="end" fill="outline" href="/register">Register</ion-button>
        </ion-toolbar>
      </ion-header>
      <ion-content :fullscreen="true">
        <ion-item>
            <ion-input label="Username:" placeholder="Enter username"></ion-input>
        </ion-item>
        <ion-item>
            <ion-input label="Password:" type="password" placeholder="Enter password"></ion-input>
        </ion-item>
        <ion-button>
            <ion-title>Login</ion-title>
        </ion-button>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup lang="ts">
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
  </script>
  
