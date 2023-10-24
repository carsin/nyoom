<template>
  <ion-page>
    <ion-header>
      <ion-toolbar v-if="isLoading">
        <ion-progress-bar type="indeterminate"></ion-progress-bar>
      </ion-toolbar>
      <ion-toolbar v-else>
        <ion-title> @{{ username }} </ion-title>
        <ion-button @click="handleLogout" class="back" slot="end" fill="outline">Log Out</ion-button>
      </ion-toolbar>
    </ion-header>
    <ion-menu side="end" content-id="main-content">
      <ion-header>
        <ion-toolbar>
          <ion-grid>
            <ion-row class="ion-align-items-center">
              <ion-col size="9">
                <ion-title>My Friends</ion-title>
              </ion-col>
              <ion-col size="3">
                <ion-menu-toggle>
                  <ion-button fill="clear">
                    <ion-icon slot="icon-only" size="medium" :icon="closeCircle"></ion-icon>
                  </ion-button>
                </ion-menu-toggle>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <ion-list>
          <FriendListItemComponent username="@friend1" avatar_src="/src/assets/avatar.svg" />
          <FriendListItemComponent username="@friend2" avatar_src="/src/assets/avatar.svg" />
          <FriendListItemComponent username="@friend3" avatar_src="/src/assets/avatar.svg" />
          <FriendListItemComponent username="@friend4" avatar_src="/src/assets/avatar.svg" />
          <FriendListItemComponent username="@friend5" avatar_src="/src/assets/avatar.svg" />
          <FriendListItemComponent username="@friend6" avatar_src="/src/assets/avatar.svg" />
          <FriendListItemComponent username="@friend7" avatar_src="/src/assets/avatar.svg" />
          <FriendListItemComponent username="@friend8" avatar_src="/src/assets/avatar.svg" />
          <FriendListItemComponent username="@friend9" avatar_src="/src/assets/avatar.svg" />
          <FriendListItemComponent username="@friend10" avatar_src="/src/assets/avatar.svg" />
        </ion-list>
      </ion-content>
    </ion-menu>
    <ion-content id="main-content" :fullscreen="true">
      <div v-if="!isLoading">
        <ion-toolbar>
          <ion-grid>
            <ion-row>
              <ion-col size="1">
                <ion-buttons>
                  <ion-button href="/settings">
                    <ion-icon slot="icon-only" :icon="settingsSharp"></ion-icon>
                  </ion-button>
                </ion-buttons>
              </ion-col>
              <ion-col class="ion-text-center" size="10">
                <ion-title class="ion-margin-bottom"> @{{ username }} </ion-title>
                <img id="profile-avatar" src="/src/assets/carpic3.png" alt="Avatar image" />
              </ion-col>
              <ion-col size="1">
                <ion-buttons class="ion-float-right">
                  <ion-list>
                    <ion-item>
                      <ion-menu-toggle>
                        <ion-button>
                          <ion-icon slot="icon-only" :icon="peopleSharp"></ion-icon>
                        </ion-button>
                      </ion-menu-toggle>
                    </ion-item>
                    <ion-item>
                      <ion-button>
                        <ion-icon slot="icon-only" :icon="carSportSharp"></ion-icon>
                      </ion-button>
                    </ion-item>
                  </ion-list>
                </ion-buttons>
              </ion-col>
            </ion-row>
            <ion-row class="ion-text-center">
              <ion-col>
                <ion-chip color="primary">
                  <ion-text> <b> {{ userData.followers }} </b> Followers </ion-text>
                </ion-chip>
                <ion-chip color="primary">
                  <ion-text> <b> {{ userData.following }} </b> Following </ion-text>
                </ion-chip>
              </ion-col>
            </ion-row>
            <ion-row class="ion-text-center">
              <ion-col>
                <ion-title size="small"> {{ userData.biography }} </ion-title>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-toolbar>
        <ion-list>
          <ion-list>
            <PostCardComponent v-for="post in posts" :key="post.id" :username="userData.username" :caption="post.caption"
              :upvotes="post.upvotes.toString()" :downvotes="post.downvotes.toString()" :image_src="post.imageURL" :timestamp="post.timestamp"  />
          </ion-list>
        </ion-list>
        <ion-toast :is-open="toast.isOpen" :message="toast.message" :color="toast.color" :duration="3000"
            @didDismiss="toast.isOpen = false"></ion-toast>
      </div>
    </ion-content>
  </ion-page>
</template>

<style>
#profile-avatar {
  border-radius: 50%;
  width: 100px;
  height: 100px;
  object-fit: cover;
}

#friends-title {
  display: inline-block;
}

.back {
  padding-right: 15px;
}
</style>

<script setup lang="ts">
import { IonText, IonMenu, IonToast, IonMenuToggle, IonChip, IonGrid, IonRow, IonCol, IonIcon, IonProgressBar, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonList, IonItem } from '@ionic/vue';
import { closeCircle, settingsSharp, peopleSharp, carSportSharp } from 'ionicons/icons';
import PostCardComponent from '@/components/PostCardComponent.vue';
import FriendListItemComponent from '@/components/FriendListItemComponent.vue';
import { ref, onMounted } from 'vue';
import { doc, getDoc, getDocs, query, collection, where, orderBy } from "firebase/firestore";
import { firebaseAuth, db } from "../firebase-service"; 
import { signOut } from 'firebase/auth';
import { useRouter, useRoute } from 'vue-router';

const isLoading = ref(true); // Variable to manage loading state
const route = useRoute();
const router = useRouter();
const username = ref(route.params.username);
const userData = ref({}); // Reactive variable to store user data
const toast = ref({ isOpen: false, message: '', color: '' });
const posts = ref([]); // Variable to hold the user's posts

onMounted(async () => {
  // Check if the user exists in the 'users' collection
  const userQuery = query(collection(db, 'users'), where('username', '==', username.value));
  const userSnapshot = await getDocs(userQuery);

  if (userSnapshot.empty) {
    router.push('/404'); // Redirect to 404 page if user doesn't exist
  } else { // user exists
    userData.value = userSnapshot.docs[0].data(); // get user data
    // query all users posts
    const postsQuery = query(
      collection(db, 'posts'),
      where('username', '==', username.value),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(postsQuery);
    posts.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    isLoading.value = false;
  }
});

const handleLogout = async () => {
  try {
    await signOut(firebaseAuth);
    toast.value = { isOpen: true, message: 'Logout successful!', color: 'success' }
    router.push('/onboard')
  } catch (error: any) { 
    toast.value = { isOpen: true, message: 'An error occurred during logout: ' + error.message, color: 'danger' }
    console.error(error.message);
  }
};
</script>
