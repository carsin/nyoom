<template>
    <ion-page id="main-content">
      <ion-header>
        <ion-toolbar v-if="isLoading">
          <ion-progress-bar type="indeterminate"></ion-progress-bar>
        </ion-toolbar>
        <ion-toolbar v-if="isCurrentUser">
          <ion-title> My Garage </ion-title>
          <ion-button v-if="isCurrentUser" @click="handleLogout" class="ion-padding-end" slot="end" fill="outline">Log Out</ion-button>
        </ion-toolbar>
        <ion-toolbar v-else>
            <ion-title> @{{ username }}'s Garage </ion-title>
            <ion-button v-if="isCurrentUser" @click="handleLogout" class="ion-padding-end" slot="end" fill="outline">Log Out</ion-button>
        </ion-toolbar>
      </ion-header>
      <ion-content :fullscreen="true">
        <div v-if="!isLoading">
          <ion-toolbar class="ion-margin-bottom">
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
                  <ion-text color="primary">
                    <h1 class="ion-margin-vertical"> @{{ username }} </h1>
                  </ion-text>
                  <img v-if="userData.avatarUrl" class="profile-avatar" :src="userData.avatarUrl" alt="Avatar image" />
                  <img v-else class="profile-avatar" src="https://ionicframework.com/docs/img/demos/avatar.svg"
                    alt="Default avatar" />
                </ion-col>
                <ion-col size="1">
                  <ion-buttons class="ion-float-right">
                    <ion-list>
                      <ion-item>
                        <router-link to="/add-vehicle">
                            <ion-button fill="clear">
                                <ion-icon slot="icon-only" :icon="addCircleOutline"></ion-icon>
                            </ion-button>
                        </router-link>
                      </ion-item>
                    </ion-list>
                  </ion-buttons>
                </ion-col>
              </ion-row>
              <ion-row class="ion-justify-content-center ion-text-center">
                  <ion-button v-if="!isCurrentUser" id="add-friend" aria-label="Add Friend" @click="handleFollow" size="default"
                    :fill="isFollowing ? 'outline' : 'solid'">
                    {{ isFollowing ? ' Unfollow' : ' Follow' }}
                    <ion-icon slot="end" size="medium"
                      :icon="isFollowing ? personRemoveSharp : personAddSharp"></ion-icon>
                  </ion-button>
              </ion-row>
              <ion-row class="ion-text-center">
                <ion-col>
                  <ion-chip color="primary" @click="showUsers('Followers')"> <ion-text> <b> {{ userData.followers.length - 1 }} </b> Followers </ion-text> </ion-chip>
                  <ion-chip color="primary" @click="showUsers('Following')"> <ion-text> <b> {{ userData.following.length - 1 }} </b> Following </ion-text> </ion-chip>
                </ion-col>
              </ion-row>
              <ion-row class="ion-text-center">
                <ion-col>
                  <ion-title size="small"> {{ userData.biography }} </ion-title>
                </ion-col>
              </ion-row>
            </ion-grid>
          </ion-toolbar>
          <div v-if="vehicles.length > 0">
            <ion-grid>
              <ion-row>
                <ion-col size-sm="12" size-md="12" size-lg="6" size-xl="4" v-for="vehicle in vehicles" :key="vehicle.id">
                  <VehicleComponent :imageId="vehicle.id" :username="vehicle.username" :caption="vehicle.caption" :image_src="vehicle.imageUrl" :userId="vehicle.userId" :timestamp="vehicle.timestamp"/>
                </ion-col>
              </ion-row>
            </ion-grid>
          </div>
          <ion-text v-else class="ion-text-center">
            <div v-if="isCurrentUser">
              <h3><i> You have no vehicles </i></h3>
            </div>
            <div v-else>
              <h3><i> @{{ username }} has no vehicles </i></h3>
            </div>
          </ion-text>
          <ion-toast :is-open="toast.isOpen" :message="toast.message" :color="toast.color" :duration="3000"
            @didDismiss="toast.isOpen = false"></ion-toast>
        </div>
      </ion-content>
    </ion-page>
  </template>

<script setup lang="ts">
import { userInfoService } from "@/services/UserInfoService";
import { IonText, IonToast, IonChip, IonGrid, IonRow, IonCol, IonIcon, IonProgressBar, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonList, IonItem } from '@ionic/vue';
import { settingsSharp, addCircleOutline, personAddSharp, personRemoveSharp } from 'ionicons/icons';
import PostCardComponent from '@/components/PostCardComponent.vue';
import { ref, onMounted, onUnmounted } from 'vue';
import { doc, getDoc, getDocs, query, collection, where, onSnapshot, orderBy, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import { firebaseAuth, db } from "../firebase-service";
import { signOut } from 'firebase/auth';
import { useRouter, useRoute } from 'vue-router';

const vehicles = ref([]); // Variable to hold the vehicles
import VehicleComponent from '@/components/VehicleComponent.vue';

const route = useRoute();
const router = useRouter();
const isCurrentUser = ref(false); // store whether the profile belongs to the authenticated user
const isFollowing = ref(false); // Variable to check if the current user is following the profile user
const isLoading = ref(true); // Variable to manage loading state
const username = ref(route.params.username);
const userData = ref({}); // Reactive variable to store user data
const posts = ref([]); // Variable to hold the user's posts
const toast = ref({ isOpen: false, message: '', color: '' });
const menuTitle = ref(''); // To dynamically set the menu title
const userList = ref([]); // To store the list of users to display in the menu
const user = firebaseAuth.currentUser;

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
  if (user) {
    const userDocRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists() && docSnap.data().username === username.value) {
      isCurrentUser.value = true;
    }
  }

  isLoading.value = false;
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