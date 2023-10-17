<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login</ion-title>
        <ion-button class="back" slot="end" href="/">Back</ion-button>
        <!-- <ion-button slot="end" fill="solid" href="/login">Login</ion-button>
        <ion-button slot="end" fill="outline" href="/register">Register</ion-button> -->
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
        <ion-button expand="block" href="/home"> Login </ion-button>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<style>
.back{
  padding-right: 20px;
}
</style>
  
<script setup lang="ts">
import { IonPage, IonItem, IonList, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/vue';
</script>