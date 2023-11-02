<template>
  <ion-page>
    <ion-header>
      <ion-toolbar collapse="condense">
        <ion-progress-bar v-if="isLoading" type="indeterminate"></ion-progress-bar>
        <ion-title>Feed</ion-title>
        <router-link slot="end" to="/create-post">
          <ion-button fill="outline" class="ion-padding-end"> Create Post </ion-button>
        </router-link>
      </ion-toolbar>
    </ion-header>
    <ion-content v-if="!isLoading" :fullscreen="true">
      <div v-if="posts.length > 0">
        <PostCardComponent v-for="post in posts" :imageId="post.id" :username="post.username" :caption="post.caption" :upvotes="post.upvoteCount" :downvotes="post.downvoteCount" :image_src="post.imageUrl" :imagePath="post.imagePath" :userId="post.userId" :timestamp="post.timestamp" :isUpvoted="post.isUpvoted" :isDownvoted="post.isDownvoted" showAvatar/>
      </div>
      <ion-text v-else class="ion-text-center">
        <h3> <i> No one has posted anything :( </i></h3>
      </ion-text>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { IonPage, IonText, IonProgressBar, IonHeader, IonButton, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import PostCardComponent from '@/components/PostCardComponent.vue';
import { db, firebaseAuth } from "../firebase-service";

const posts = ref([]); // Variable to hold the posts
const isLoading = ref(true); // Variable to manage loading state
const user = firebaseAuth.currentUser;

onMounted(async () => {
  // Query all posts and order by timestamp
    const postsQuery = query(
    collection(db, 'posts'),
    orderBy('timestamp', 'desc') // Ordering by timestamp in descending order
  );
  const querySnapshot = await getDocs(postsQuery);

  posts.value = querySnapshot.docs.map(doc => {
    const postData = doc.data();
    return {
      id: doc.id,
      isUpvoted: postData.upvoters.includes(user.uid),
      isDownvoted: postData.downvoters.includes(user.uid),
      ...postData
    };
  });
  isLoading.value = false;
});

</script>
