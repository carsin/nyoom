<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-button @click="goBack" class="back-button">
              <ion-icon slot="icon-only" name="arrow-back"></ion-icon>
            </ion-button>
          </ion-buttons>
          <ion-title>Details Page</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <!-- Details content here -->
      </ion-content>
    </ion-page>
  </template>
  
  <style scoped>
  .back-button {
    --color: var(--ion-color-back-button);
  }
  </style>
  

  <script lang="ts">
  import { defineComponent } from 'vue';
  import { IonButton } from '@ionic/vue';
  
  export default defineComponent({
    components: {
      IonButton,
    },
    methods: {
      goBack() {
        this.$router.go(-1); // go back one step in the history
      },
    },
  });
  </script>
  