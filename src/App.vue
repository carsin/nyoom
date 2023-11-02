<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { firebaseAuth } from "./firebase-service";

document.title = 'Nyoom';

console.log(firebaseAuth);

</script>
