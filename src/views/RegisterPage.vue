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
        <ion-header collapse="condense">
          <ion-toolbar>
            <ion-title size="large">Register</ion-title>
          </ion-toolbar>
        </ion-header>
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
        <ion-button>
            <ion-title>Register</ion-title>
        </ion-button>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup lang="ts">
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
  </script>
  
