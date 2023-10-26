<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="tab1" href="/feed">
          <ion-icon aria-hidden="true" :icon="home" />
          <ion-label> Feed </ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab2" href="/search">
          <ion-icon aria-hidden="true" :icon="search" />
          <ion-label>Search</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab3" href="/events">
          <ion-icon aria-hidden="true" :icon="balloon" />
          <ion-label>Events</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab4" href="/market">
          <ion-icon aria-hidden="true" :icon="cart" />
          <ion-label>Market</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab5" :href="userProfileTabHref">
          <ion-icon aria-hidden="true" :icon="person" />
          <ion-label>My Profile</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<style scoped>
.inactive-profile-tab {
  --color-selected: var(--ion-color-medium);
  color: var(--ion-color-medium);
}

.active-profile-tab {
  color: var(--ion-color-primary);
  --color-selected: var(--ion-color-primary);
}
</style>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { home, search, balloon, cart, person } from 'ionicons/icons';
import { onMounted, ref, watch } from 'vue';
import { firebaseAuth, db } from "../firebase-service";
import { doc, getDoc } from "firebase/firestore";
import { useRoute } from 'vue-router';

const userProfileTabHref = ref('/login'); // Default to login
const isOwnProfile = ref(false); // Variable to determine whether it's the user’s own profile
const route = useRoute();

const updateUserProfileHref = async () => {
  const user = firebaseAuth.currentUser;
  if (user) {
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const authenticatedUsername = userDoc.data().username;
      userProfileTabHref.value = `/user/${authenticatedUsername}`;
    }
  }
};

// FIX: this breaks the my profile button sometimes, taking the L for now
// Check if the current route matches the authenticated user's profile and update isOwnProfile accordingly
// watch(route, () => {
//   isOwnProfile.value = (route.path == userProfileTabHref.value);
//   // console.log(route.path + ", " + userProfileTabHref.value + ", " + isOwnProfile.value);
// }, { immediate: true });

onMounted(() => {
  updateUserProfileHref();
});
</script>
