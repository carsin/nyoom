<template>
    <ion-page>
        <ion-header class="header-margin">
        <ion-toolbar>
          <ion-buttons slot="start">
            <!-- <ion-back-button default-href="/market" @click="goBack"></ion-back-button> -->
            <ion-button @click="goBack" class="back-button">
              <ion-icon slot="icon-only" name="arrow-back" class="icon-color"></ion-icon>
            </ion-button>
          </ion-buttons>
          <ion-title>{{loadedPart.title}}</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <!-- Test if component loads -->
        <!-- <h2 v-if="!loadedPart"> Could not find a part for the given id</h2>
        <h2 v-else>Loaded it</h2> -->
        <img alt="Part image" :src="loadedPart.imageUrl" class="image-resize" />
          <ion-card-subtitle>{{ loadedPart.price }}</ion-card-subtitle>
          <ion-card-subtitle>{{ loadedPart.condition }}</ion-card-subtitle>
          <ion-card-subtitle>{{ loadedPart.description }}</ion-card-subtitle>
          <ion-card-subtitle class="underline-text">{{ loadedPart.location }}</ion-card-subtitle>

      </ion-content>
    </ion-page>
  </template>
  
  <style scoped>
  .header-margin {
    margin-top: 20px; /* You can adjust the margin as needed */
  }
  
  .back-button {
    --color: var(--ion-color-primary); 
  }

  .back-button .icon-color {
    color: red; /* Change the icon color to red */
  }
  .underline-text {
  text-decoration: underline;
}
  .image-resize {
  max-width: 100%; /* Set the maximum width you desire */
  max-height: 500px; /* Set the maximum height you desire */
  margin: 0 auto;
}
  </style>
  

  <script lang="ts">
  import { defineComponent } from 'vue';
  import { IonButton, IonBackButton } from '@ionic/vue';
  export default defineComponent({
  data() {
    return {
      partId: this.$route.params.id
    };
  },
  //only need in case of change while on page rather than on load
  //watch: { "$route"(currentRoute) {this.partId = currentRoute.params.id}},
  computed: {
  loadedPart(): any {
    return this.$store.getters.part(this.partId);
  }
},  
components: {
    IonButton,
    IonBackButton
  },
  methods: {
    goBack() {
      this.$router.go(-1); // go back one step in the history
    },
  },
});
  </script>
  