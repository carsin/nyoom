<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Search</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar v-model="searchQuery" show-clear-button="focus" placeholder="Search vehicles by make, model, or owner"></ion-searchbar>
      </ion-toolbar>
      <ion-toolbar>
        <ion-title size="large">Select Make</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-grid>
        <div> 
          <ion-row>
            <ion-col size="6" v-for="make in filteredMakes" :key="make">
              <ion-card @click="navigateToModels(make)">
                <img :alt="`${make} logo`" :src="getMakeLogo(make)" height='100' max-width='100'/>
                <ion-card-header>
                  <ion-card-subtitle>{{ make }}</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>
          </ion-row>
          <!-- ... all other makes in list ... -->
        </div>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<style>
.back{
  padding-right: 15px;
}

.center-align{
  padding-top: 25px;
}

.wider{
  padding-inline: 0;
}
</style>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardSubtitle, IonSearchbar } from '@ionic/vue';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { getMakes } from 'car-info';

const makes = ref(getMakes());
const searchQuery = ref('');
const router = useRouter();

// Function to get the logo URL for each make (you need to implement this)
const getMakeLogo = (make: string) => {
  return `../assets/logos/${make.toLowerCase()}.png`; // Example path, adjust as needed
};

// Computed property to filter makes based on the search query
const filteredMakes = computed(() => {
  return searchQuery.value ? 
         makes.value.filter(make => make.toLowerCase().includes(searchQuery.value.toLowerCase())) :
         makes.value;
});


const navigateToModels = (make) => {
  router.push({ name: 'ModelList', params: { make: make } });
};


</script>
