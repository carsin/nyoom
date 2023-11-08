<template>
  <div>
    <ion-searchbar 
      v-model="searchQuery" 
      @ionChange="searchUsers" 
      placeholder="Search users..."
    ></ion-searchbar>
    <ion-list v-if="searchResults.length > 0">
      <ion-item v-for="user in searchResults" :key="user.uid" @click="startChatWithUser(user)">
        <ion-avatar slot="start">
          <img :src="user.avatarUrl || defaultAvatar">
        </ion-avatar>
        <ion-label>{{ user.username }}</ion-label>
      </ion-item>
    </ion-list>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { IonSearchbar, IonList, IonItem, IonAvatar, IonLabel } from '@ionic/vue';
import { db } from "../firebase-service";
import { collection, query, where, getDocs } from 'firebase/firestore';

const searchQuery = ref('');
const searchResults = ref([]);
const defaultAvatar = 'default-avatar-url'; // Replace with your default avatar URL

watch(searchQuery, async (newValue, oldValue) => {
  if (newValue !== oldValue && newValue.trim().length > 0) {
    searchUsers();
  }
});

const searchUsers = async () => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('username', '>=', searchQuery.value), where('username', '<=', searchQuery.value + '\uf8ff'));
  const querySnapshot = await getDocs(q);
  searchResults.value = querySnapshot.docs.map(doc => ({
    uid: doc.id,
    ...doc.data()
  }));
};

const startChatWithUser = (user) => {
  // Here you would implement the logic to start a chat with the selected user
  console.log('Starting chat with:', user.username);
};
</script>
