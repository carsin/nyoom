<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Feed</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <ion-header collapse="condense">
                <ion-toolbar>
                    <ion-title size="large">Feed</ion-title>
                </ion-toolbar>
            </ion-header>

            <ExploreContainer name="Feed Page" />

            <ion-card>
                <img alt="Silhouette of mountains" src="https://ionicframework.com/docs/img/demos/card-media.png" />
                <ion-card-header>
                    <ion-card-title>Card Title</ion-card-title>
                    <ion-card-subtitle>Card Subtitle</ion-card-subtitle>
                </ion-card-header>
                <ion-card-content>
                    Here's a small text description for the card content. Nothing more, nothing less.
                </ion-card-content>
            </ion-card>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
  import ExploreContainer from '@/components/ExploreContainer.vue';
</script>
