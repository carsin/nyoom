<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Models of {{ make }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-grid>
        <ion-row>
          <ion-col size="6" v-for="model in modelsWithPosts" :key="model.name">
            <ion-card @click="navigateToModelPosts(model.name)">
              <img :src="model.thumbnail" alt="Thumbnail" />
              <ion-card-header>
                <ion-card-title> {{make }} {{ model.name }}</ion-card-title>
              </ion-card-header>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
      <ion-row v-if="modelsWithPosts.length <= 0">
        <h3>No posts of {{ make }}s yet :(</h3>
      </ion-row>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardSubtitle, IonSearchbar, IonCardTitle } from '@ionic/vue';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { useRouter } from 'vue-router';

const route = useRoute();
const db = getFirestore();
const make = route.params.make;
const modelsWithPosts = ref([]);
const router = useRouter();

const navigateToModelPosts = (modelName) => {
  router.push({ name: 'ModelPosts', params: { make: make, model: modelName } });
};

const fetchModelsWithPosts = async () => {
  const postsCollectionRef = collection(db, 'posts');
  const q = query(postsCollectionRef, where('vehicleMake', '==', make));
  const querySnapshot = await getDocs(q);

  let posts = {};
  querySnapshot.forEach((doc) => {
    const postData = doc.data();
    if (!posts[postData.vehicleModel]) {
      posts[postData.vehicleModel] = [];
    }
    posts[postData.vehicleModel].push(postData.imageUrl); // Assume each post has an 'imageUrl'
  });

  modelsWithPosts.value = Object.keys(posts).map(model => ({
    name: model,
    thumbnail: posts[model][Math.floor(Math.random() * posts[model].length)] // Random thumbnail
  }));
};

onMounted(fetchModelsWithPosts);
</script>
