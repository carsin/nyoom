<template>
  <ion-app>
    <ion-router-outlet/>
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { firebaseAuth } from "./firebase-service";
import { onMounted } from 'vue';

onMounted(() => {
  // Change the title when the component is mounted
  document.title = 'Nyoom';
});
console.log(firebaseAuth);

</script>
