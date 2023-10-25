<template>
  <ion-page>
    <ion-header>
      <ion-toolbar v-if="isLoading">
        <ion-progress-bar type="indeterminate"></ion-progress-bar>
      </ion-toolbar>
      <ion-toolbar v-else>
        <ion-title> @{{ username }}'s Profile </ion-title>
        <ion-button v-if="isCurrentUser" @click="handleLogout" class="back" slot="end" fill="outline">Log Out</ion-button>
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
                <ion-buttons v-if="isCurrentUser">
                  <router-link to="/settings">
                    <ion-button>
                      <ion-icon slot="icon-only" :icon="settingsSharp"></ion-icon>
                    </ion-button>
                  </router-link>
                </ion-buttons>
              </ion-col>
              <ion-col class="ion-text-center" size="10">
                <ion-title class="ion-margin-bottom"> @{{ username }} </ion-title>
                <img v-if="userData.avatarUrl" class="profile-avatar" :src="userData.avatarUrl" alt="Avatar image" />
                <img v-else class="profile-avatar" src="https://ionicframework.com/docs/img/demos/avatar.svg" alt="Default avatar" />
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
                  <ion-text> <b> {{ userData.followers.length - 1}} </b> Followers </ion-text>
                </ion-chip>
                <ion-chip color="primary">
                  <ion-text> <b> {{ userData.following.length - 1}} </b> Following </ion-text>
                </ion-chip>
                <ion-button v-if="!isCurrentUser" id="add-friend" aria-label="Add Friend" @click="handleFollow" :fill="isFollowing ? 'outline' : 'solid'">
                  {{ isFollowing ? ' Unfollow' : ' Follow' }}
                  <ion-icon slot="icon-only" size="medium" :icon="isFollowing ? personRemoveSharp : personAddSharp"></ion-icon>
                </ion-button>
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
            <PostCardComponent v-for="post in posts" :imageId="post.id" :username="post.username" :caption="post.caption" :upvotes="post.upvoteCount" :downvotes="post.downvoteCount" :image_src="post.imageUrl" :timestamp="post.timestamp" />
          </ion-list>
        </ion-list>
        <ion-toast :is-open="toast.isOpen" :message="toast.message" :color="toast.color" :duration="3000" @didDismiss="toast.isOpen = false"></ion-toast>
      </div>
    </ion-content>
  </ion-page>
</template>

<style>
.back {
  padding-right: 15px;
}
</style>

<script setup lang="ts">
import { IonText, IonMenu, IonToast, IonMenuToggle, IonChip, IonGrid, IonRow, IonCol, IonIcon, IonProgressBar, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonList, IonItem } from '@ionic/vue';
import { closeCircle, settingsSharp, peopleSharp, carSportSharp, personAddSharp, personRemoveSharp } from 'ionicons/icons';
import PostCardComponent from '@/components/PostCardComponent.vue';
import FriendListItemComponent from '@/components/FriendListItemComponent.vue';
import { ref, onMounted, onUnmounted } from 'vue';
import { doc, getDoc, getDocs, query, collection, where, onSnapshot, orderBy, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import { firebaseAuth, db } from "../firebase-service";
import { signOut } from 'firebase/auth';
import { useRouter, useRoute } from 'vue-router';

const route = useRoute();
const router = useRouter();
const isCurrentUser = ref(false); // store whether the profile belongs to the authenticated user
const isFollowing = ref(false); // Variable to check if the current user is following the profile user
const isLoading = ref(true); // Variable to manage loading state
const username = ref(route.params.username);
const userData = ref({}); // Reactive variable to store user data
const posts = ref([]); // Variable to hold the user's posts
const toast = ref({ isOpen: false, message: '', color: '' });

onMounted(async () => {
  // Fetch data for the user whose profile is being visited
  const userQuery = query(collection(db, 'users'), where('username', '==', username.value));
  const userSnapshot = await getDocs(userQuery);

  if (userSnapshot.empty) {
    router.push('/404'); // Redirect to 404 page if user doesn't exist
    return;
  }

  // Set user data for the profile being viewed
  userData.value = { uid: userSnapshot.docs[0].id, ...userSnapshot.docs[0].data() };
  
  // Check if the viewed profile belongs to the currently authenticated user
  const currentUser = firebaseAuth.currentUser;
  if (currentUser) {
    const userDocRef = doc(db, 'users', currentUser.uid);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists() && docSnap.data().username === username.value) {
      isCurrentUser.value = true;
    }

    // Check if the current user is following the profile user
    const userDocId = userSnapshot.docs[0].id; // Getting the uid from the document ID
    handleRealtimeUpdates(userDocId);
    isFollowing.value = userData.value.followers.includes(currentUser.uid);
  }

  // Query all posts for the profile being viewed
  const postsQuery = query(
    collection(db, 'posts'),
    where('username', '==', username.value),
    orderBy('timestamp', 'desc')
  );

  const querySnapshot = await getDocs(postsQuery);
  posts.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  isLoading.value = false;
});

// Function to handle the real-time updates
const handleRealtimeUpdates = (userDocId) => {
  const userRef = doc(db, 'users', userDocId);

  // Listening for real-time updates
  const unsubscribe = onSnapshot(userRef, (doc) => {
    if (doc.exists()) {
      userData.value = { uid: doc.id, ...doc.data() }; // Updating userData
    }
  });

  // Cleanup the subscription on component destruction
  onUnmounted(() => {
    unsubscribe();
  });
};

// Function to handle follow/unfollow
const handleFollow = async () => {
  const currentUser = firebaseAuth.currentUser;

  try {
    if (currentUser && userData.value.uid) {
      const userDocRef = doc(db, 'users', userData.value.uid);
      const currentUserDocRef = doc(db, 'users', currentUser.uid);

      if (isFollowing.value) {
        // Unfollow logic
        await updateDoc(userDocRef, {
          followers: arrayRemove(currentUser.uid)
        });
        await updateDoc(currentUserDocRef, {
          following: arrayRemove(userData.value.uid)
        });
        toast.value = { isOpen: true, message: 'Successfully unfollowed ' + username.value, color: 'success' };
      } else {
        // Follow logic
        await updateDoc(userDocRef, {
          followers: arrayUnion(currentUser.uid)
        });
        await updateDoc(currentUserDocRef, {
          following: arrayUnion(userData.value.uid)
        });
        toast.value = { isOpen: true, message: 'Successfully followed ' + username.value, color: 'success' };
      }

      isFollowing.value = !isFollowing.value;
    } else {
      toast.value = { isOpen: true, message: 'Failed to follow/unfollow. User data is missing.', color: 'danger' };
    }
  } catch (error: any) {
    toast.value = { isOpen: true, message: 'An error occurred: ' + error.message, color: 'danger' };
  }
};

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
