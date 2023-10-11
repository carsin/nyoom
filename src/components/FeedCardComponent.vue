<template>
  <ion-card>
    <ion-grid>
      <ion-row class="ion-justify-content-center">
        <ion-card-header>
          <ion-card-title id="post-username" class="ion-justify-content-start"> {{ username }} </ion-card-title>
        </ion-card-header>
      </ion-row>
      <ion-row class="ion-justify-content-center">
        <img id="post-image" v-bind:src="image_src" /> <!-- v-bind: use prop in attribute -->
      </ion-row>
      <ion-row>
        <ion-col size="9">
          <ion-card-subtitle class="ion-margin"> {{ caption }} </ion-card-subtitle>
        </ion-col>
        <ion-col size="3">
          <ion-button class="ion-float-right"> ↓ {{ downvotes }}</ion-button>
          <ion-button class="ion-float-right"> ↑ {{ upvotes }}</ion-button>
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-card>
</template>

<style>
  #post-image {
    max-height: 40rem;
  }
</style>

<script setup lang="ts">
  import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/vue';
  defineProps({
    username: String,
    caption: String,
    upvotes: String,
    downvotes: String,
    image_src: String,
  });
</script>

