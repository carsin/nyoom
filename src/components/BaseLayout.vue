<template>
<ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ pageTitle }}</ion-title>
        <ion-button slot="end" fill="outline" href="/login">Login</ion-button>
        <ion-button slot="end" fill="outline" href="/register">Register</ion-button>
      </ion-toolbar>

    </ion-header>
        
      <slot></slot>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton } from '@ionic/vue';
export default {
    props: ['pageTitle'],
    components: {IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton}
}
</script>