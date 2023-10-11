<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-button @click="goBack" class="back-button">
              <ion-icon slot="icon-only" name="arrow-back"></ion-icon>
            </ion-button>
          </ion-buttons>
          <ion-title>{{loadedPart.title}}</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <!-- Details content here -->
        <h2 v-if="!loadedPart"> Could not find a part for the given id</h2>
        <h2 v-else>Loaded it</h2>
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
  data() {
    return {
      partId: this.$route.params.id
    };
  },
  watch: { "$route"(currentRoute) {this.partId = currentRoute.params.id}},
  computed: {
  loadedPart(): any {
    return this.$store.getters.part(this.partId);
  }
},  
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
  