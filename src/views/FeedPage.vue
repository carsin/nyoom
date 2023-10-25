<template>
  <ion-page>
    <ion-header>
      <ion-toolbar collapse="condense">
        <ion-title>Feed</ion-title>
          <ion-button class="back" slot="end" fill="outline">
            <router-link style="text-decoration: none;" to="/create-post"> Create Post </router-link>
          </ion-button>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <PostCardComponent v-for="post in posts" :imageId="post.id" :username="post.username" :caption="post.caption" :upvotes="post.upvoteCount" :downvotes="post.downvoteCount" :image_src="post.imageURL" :timestamp="post.timestamp" />
      <ion-fab>
        <ion-fab-button slot="fixed" vertical="bottom" horizontal="end">
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase-service"; // Adjust the import based on your file structure
import { IonIcon, IonPage, IonFab, IonFabButton, IonHeader, IonButton, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import { add } from 'ionicons/icons';
import PostCardComponent from '@/components/PostCardComponent.vue';

const posts = ref([]); // Variable to hold the posts

onMounted(async () => {
  // Query all posts and order by timestamp
    const postsQuery = query(
    collection(db, 'posts'),
    orderBy('timestamp', 'desc') // Ordering by timestamp in descending order
  );
  const querySnapshot = await getDocs(postsQuery);
  
  posts.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
});

</script>
