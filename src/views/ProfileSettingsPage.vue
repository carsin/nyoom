<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>Profile Settings</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content :fullscreen="true">
        <ion-item>
          <ion-input label="Change Username:" placeholder="Enter new username"></ion-input>
          <ion-button id="change-username">Confirm</ion-button>
        </ion-item>
        <ion-item>
          <ion-input label="Change Email:" type="email" placeholder="Enter new email"></ion-input>
          <ion-button id="change-email">Confirm</ion-button>
        </ion-item>
        <ion-button id="change-password" expand="block"> Send Password Change to Email </ion-button>
      
        <ion-toast trigger="change-username" message="Username change request received, confirm this change from your registered email." :duration="3000"></ion-toast>
        <ion-toast trigger="change-email" message="Email request change received, confirm this change from your previous email address." :duration="3000"></ion-toast>
        <ion-toast trigger="change-password" message="Password request change sent to email." :duration="3000"></ion-toast>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup lang="ts">
  import { IonPage, IonToast, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
  </script>
  
