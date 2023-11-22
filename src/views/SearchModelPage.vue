<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="goBack">
            <ion-icon slot="icon-only" :icon="arrowBack"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Search: Choose {{ make }} Model</ion-title>
      </ion-toolbar>
      <ion-toolbar v-if="isLoading">
        <ion-progress-bar type="indeterminate"></ion-progress-bar>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-grid>
        <ion-row>
          <ion-col size="6" v-for="model in modelsWithPosts" :key="model.name">
            <ion-card class="hover-item" @click="navigateToModelPosts(model.name)">
              <img :src="model.thumbnail" alt="Thumbnail" />
              <ion-card-header class="ion-text-center">
                {{ make }} {{ model.name }}
              </ion-card-header>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
      <ion-row v-if="modelsWithPosts.length <= 0 && !isLoading">
        <h3>No {{ make }} posts yet :(</h3>
      </ion-row>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonProgressBar, IonButtons, IonIcon, IonButton } from '@ionic/vue';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter  } from 'vue-router';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { arrowBack } from 'ionicons/icons';

const route = useRoute();
const db = getFirestore();
const make = route.params.make;
const modelsWithPosts = ref([]);
const router = useRouter();
const isLoading = ref(false);

const navigateToModelPosts = (modelName: string) => {
  router.push({ name: 'ModelPosts', params: { make: make, model: modelName } });
};

const fetchModelsWithPosts = async () => {
  isLoading.value = true;
  const postsCollectionRef = collection(db, 'posts');
  const q = query(postsCollectionRef, where('vehicleMake', '==', make));
  const querySnapshot = await getDocs(q);

  let posts = {};
  querySnapshot.forEach((doc) => {
    const postData = doc.data();
    if (!posts[postData.vehicleModel]) {
      posts[postData.vehicleModel] = [];
    }
    posts[postData.vehicleModel].push(postData.imageUrl);
  });

  modelsWithPosts.value = Object.keys(posts).map(model => ({
    name: model,
    thumbnail: posts[model][Math.floor(Math.random() * posts[model].length)] // random thumbnail
  }));
  isLoading.value = false;
};

onMounted(fetchModelsWithPosts);

const goBack = () => {
  router.back();
};
</script>
