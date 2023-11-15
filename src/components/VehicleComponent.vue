<template>
  <ion-card>
    <ion-card-header v-if="isLoading">
      <ion-progress-bar type="indeterminate"></ion-progress-bar>
    </ion-card-header>
  </ion-card>
</template>