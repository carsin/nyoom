<template>
    <ion-segment-button @click="handleTabClick('parts')">
      <ion-label>Parts</ion-label>
    </ion-segment-button>
  </template>
  
  <script setup lang="ts">
  const handleTabClick = (tab: string) => {
    $emit('tab-click', tab);
  };
  </script>