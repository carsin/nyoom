<template>
  <ion-item>
    <ion-chip>
      <ion-avatar>
        <img alt="" :src="avatar_src" />
      </ion-avatar>
      <ion-label> {{ username }} </ion-label>
    </ion-chip>
    <ion-button fill="clear">
      <ion-icon color="danger" :icon="personRemoveSharp"></ion-icon>
    </ion-button>
  </ion-item>
</template>


<script setup lang="ts">
import { IonItem, IonChip, IonAvatar, IonLabel, IonButton } from '@ionic/vue';
defineProps({
  username: String,
  avatar_src: String,
});

import { personRemoveSharp } from 'ionicons/icons';
</script>

