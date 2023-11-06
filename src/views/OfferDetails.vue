<template>
  <ion-page>
    <ion-header class="header-margin">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="goBack" class="back-button">
            <ion-icon slot="icon-only" name="arrow-back" class="icon-color"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>{{ loadedOffer.shopName }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <img alt="Part image" :src="loadedOffer.imageUrl" class="image-resize" />
      <ion-card-subtitle>{{ loadedOffer.deal }}</ion-card-subtitle>
    </ion-content>
  </ion-page>
</template>
  
<style scoped>
.header-margin {
  margin-top: 20px;
  /* You can adjust the margin as needed */
}

.back-button {
  --color: var(--ion-color-primary);
}

.back-button .icon-color {
  color: red;
  /* Change the icon color to red */
}

.underline-text {
  text-decoration: underline;
}

.image-resize {
  max-width: 100%;
  /* Set the maximum width you desire */
  max-height: 500px;
  /* Set the maximum height you desire */
  margin: 0 auto;
}
</style>
  

<script lang="ts">
import { defineComponent } from 'vue';
import { IonButton, IonBackButton } from '@ionic/vue';
export default defineComponent({
  data() {
    return {
      offerId: this.$route.params.id
    };
  },
  //only need in case of change while on page rather than on load
  //watch: { "$route"(currentRoute) {this.partId = currentRoute.params.id}},
  computed: {
    loadedOffer(): any {
      return this.$store.getters.offer(this.offerId);
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
  
