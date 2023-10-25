<template>
  <ion-page>
    <ion-content id="main-content" :fullscreen="true">
      <ion-grid>
        <ion-row class="ion-justify-content-center">
          <img alt="Nyoom logo" id="logo" src="/src/assets/Group1.png"/>
        </ion-row>
        <ion-row class="ion-justify-content-center">
          <ion-button class="button-adjust" fill="outline" href="/login" size="large">Login</ion-button>
        </ion-row>
        <ion-row class="ion-justify-content-center">
          <ion-button class="button-adjust" fill="outline" href="/register" size="large">Register</ion-button>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<style>
#logo {
width: 800px;
padding-top: 100px;
padding-bottom: 25px;
/* height: 100px; */
}

.button-adjust{
    width: 200px;
}
</style>

<script setup lang="ts">
  import { IonPage, IonGrid, IonRow, IonButton, IonContent } from '@ionic/vue';
</script>
