<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>Register</ion-title>
          <ion-button slot="end" fill="outline" href="/login">Login</ion-button>
          <ion-button slot="end" fill="solid" href="/register">Register</ion-button>
        </ion-toolbar>
      </ion-header>
      <ion-content :fullscreen="true">
      <ion-list>
        <ion-item>
            <ion-input label="Email:" type="email" placeholder="email@domain.com"></ion-input>
        </ion-item>
        <ion-item>
            <ion-input label="Username:" type="username" placeholder="Enter a username"></ion-input>
        </ion-item>
        <ion-item>
            <ion-input label="Password:" type="password" placeholder="Enter a password"></ion-input>
        </ion-item>
        <ion-item>
            <ion-input label="Confirm Password:" type="password" placeholder="Re-enter password"></ion-input>
        </ion-item>
        <ion-button expand="block"> Register </ion-button>
      </ion-list>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup lang="ts">
  import { IonPage, IonItem, IonList, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
  </script>
  
