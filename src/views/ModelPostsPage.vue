<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Posts of {{ make }} {{ model }}</ion-title>
      </ion-toolbar>
      <ion-toolbar v-if="isLoading">
        <ion-progress-bar type="indeterminate"></ion-progress-bar>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div>
        <ion-grid>
          <ion-row>
            <ion-col size-sm="12" size-md="12" size-lg="6" size-xl="4" v-for="post in posts" :key="post.id">
              <PostCardComponent :imageId="post.id" :username="post.username" :caption="post.caption"
                :upvotes="post.upvoteCount" :downvotes="post.downvoteCount" :image_src="post.imageUrl"
                :imagePath="post.imagePath" :userId="post.userId" :timestamp="post.timestamp" :isUpvoted="post.isUpvoted"
                :isDownvoted="post.isDownvoted" showAvatar />
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
    </ion-content>
  </ion-page></template>

<script setup lang="ts">
import { IonPage, IonHeader, IonContent, IonToolbar, IonGrid, IonRow, IonCol, IonTitle, IonProgressBar } from '@ionic/vue';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { firebaseAuth } from "../firebase-service";
import PostCardComponent from '@/components/PostCardComponent.vue';

const route = useRoute();
const db = getFirestore();
const make = route.params.make;
const model = route.params.model;
const user = firebaseAuth.currentUser;
const posts = ref([]);
const isLoading = ref(false);

const fetchPosts = async () => {
  isLoading.value = true;
  const postsCollectionRef = collection(db, 'posts'); // 
  const q = query(postsCollectionRef, where('vehicleMake', '==', make), where('vehicleModel', '==', model));
  const querySnapshot = await getDocs(q);

  posts.value = querySnapshot.docs.map(doc => {
    const postData = doc.data();
    return {
      id: doc.id,
      isUpvoted: postData.upvoters.includes(user?.uid),
      isDownvoted: postData.downvoters.includes(user?.uid),
      ...postData
    };
  });
  
  isLoading.value = false;
};

onMounted(fetchPosts);
</script>
