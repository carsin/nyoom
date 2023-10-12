<template>
  <ion-card>
    <ion-grid>
      <ion-row class="ion-align-self-end ion-justify-content-center">
        <ion-button fill="clear" href="otherProfile">
          <ion-card-title color="primary"> {{ username }} </ion-card-title>
        </ion-button>
      </ion-row>
      <ion-row class="ion-justify-content-center">
        <img id="post-image" v-bind:src="image_src" /> <!-- v-bind: use prop in attribute -->
      </ion-row>
      <ion-row>
        <ion-col class="ion-text-left ion-align-self-end" size="10">
          <ion-card-content> {{ caption }} </ion-card-content>
        </ion-col>
        <ion-col class="ion-text-end ion-align-self-top ion-margin-top" size="2">
          <ion-chip color="success">
            <ion-icon aria-hidden="true" :icon="arrowUpCircle" />
            <ion-label> {{ upvotes }}</ion-label>
          </ion-chip>
          <ion-chip color="danger">
            <ion-icon aria-hidden="true" :icon="arrowDownCircle" />
            <ion-label> {{ downvotes }}</ion-label>
          </ion-chip>
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
import { IonCard, IonLabel, IonButton, IonChip, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/vue';
defineProps({
  username: String,
  caption: String,
  upvotes: String,
  downvotes: String,
  image_src: String,
});

import { arrowUpCircle, arrowDownCircle } from 'ionicons/icons';
</script>

