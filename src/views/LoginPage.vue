<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login</ion-title>
        <ion-button class="back" slot="end" fill="outline" href="/">Back</ion-button>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-list>
        <ion-item>
            <ion-input label="Username:" placeholder="Enter username"></ion-input>
        </ion-item>
        <ion-item>
            <ion-input label="Password:" type="password" placeholder="Enter password"></ion-input>
        </ion-item>
        <ion-button expand="block" fill="outline" href="/tabs"> Login </ion-button>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<style>
.back{
  padding-right: 15px;
}
</style>
  
<script setup lang="ts">
import { IonPage, IonItem, IonList, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/vue';
</script>