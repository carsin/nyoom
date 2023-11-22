<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Search</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar v-model="searchQuery" show-clear-button="focus"
          placeholder="Search profiles or makes"></ion-searchbar>
        <div v-if="userSearchResults.length > 0" class="search-results">
          <ion-list>
            <ion-item v-for="user in userSearchResults" class="hover-item" :key="user.uid"
              @click="navigateToUser(user.username)">
              <ion-avatar slot="start">
                <img :src="user.avatarUrl || 'https://ionicframework.com/docs/img/demos/avatar.svg'" alt="User avatar" />
              </ion-avatar>
              <ion-label>{{ user.username }}</ion-label>
            </ion-item>
          </ion-list>
        </div>
      </ion-toolbar>
      <ion-toolbar>
        <ion-title size="large">Search By Make</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-grid>
        <div>
          <ion-row>
            <ion-col size="6" v-for="make in vehicleSearchResults" :key="make">
              <ion-card class="hover-item" @click="navigateToModels(make)">
                <img class="centered-image" :alt="`${make} logo`" :src="logos[make]" height='100' max-width='100'/>
                <ion-card-header class="ion-text-center">
                  {{ make }}
                </ion-card-header>
              </ion-card>
            </ion-col>
          </ion-row>
        </div>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<style>
.centered-image {
  display: block;
  margin-left: auto;
  margin-right: auto;
  padding-top: 8px;
  height: 100px;
  max-width: 100%;
  object-fit: contain;
}
</style>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonSearchbar, IonItem, IonList, IonAvatar, IonLabel } from '@ionic/vue';
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { collection, query, getDocs, where, limit } from 'firebase/firestore';
import { db, storage } from "../firebase-service";
import { ref as storageRef, getDownloadURL } from 'firebase/storage';

const postedMakes = ref([]);
const searchQuery = ref<string>('');
const router = useRouter();
const userSearchResults = ref([]);
const vehicleSearchResults = ref([]);
const logos = ref({});

const fetchLogos = async (vehicleMakes) => {
  try {
    const logoPromises = vehicleMakes.map(make => {
      const logoRef = storageRef(storage, `logos/${make.toLowerCase()}.png`);
      return getDownloadURL(logoRef).then(url => {
        logos.value[make] = url;
      }).catch(() => {
        logos.value[make] = 'https://static.vecteezy.com/system/resources/thumbnails/017/178/563/small/cross-check-icon-symbol-on-transparent-background-free-png.png';
      });
    });

    await Promise.all(logoPromises);
  } catch (error) {
    console.error("Error fetching logos:", error);
  }
};

// Fetching vehicle makes
const fetchPostedMakes = async () => {
  const makesSet = new Set();
  const postsCollectionRef = collection(db, 'posts');
  const q = query(postsCollectionRef);
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    const postData = doc.data();
    if (postData.vehicleMake) {
      makesSet.add(postData.vehicleMake);
    }
  });

  return Array.from(makesSet); // Returns an array of unique makes
};

// Searching users
const searchUsers = async (username) => {
  if (username.trim() === '') return [];

  const usersRef = collection(db, 'users');
  const userQuery = query(
    usersRef,
    where('username', '>=', username.toLowerCase()),
    where('username', '<=', username.toLowerCase() + '\uf8ff'),
    limit(10)
  );

  const querySnapshot = await getDocs(userQuery);
  return querySnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
};

// Combined search function for users and vehicles
const performSearch = async () => {
  if (searchQuery.value.trim() === '') {
    userSearchResults.value = [];
    vehicleSearchResults.value = postedMakes.value;
    return;
  }

  userSearchResults.value = await searchUsers(searchQuery.value);
  vehicleSearchResults.value = postedMakes.value.filter(make => make.toLowerCase().includes(searchQuery.value.toLowerCase()));
};

watch(searchQuery, performSearch);

const navigateToModels = (make) => {
  router.push({ name: 'ModelList', params: { make } });
};

const navigateToUser = (username) => {
  router.push({ name: 'UserProfile', params: { username } });
};

onMounted(async () => {
  postedMakes.value = await fetchPostedMakes();
  fetchLogos(postedMakes.value);
  vehicleSearchResults.value = postedMakes.value; // Initialize vehicle search results
});
</script>
