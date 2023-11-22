<!-- FIX VALUE FOR ISFOLLOWING (SEE HOW ITS SET IN PROFILE) -->
<template>
  <ion-content>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button color="medium" @click="cancel"> 
            <ion-icon aria-hidden="true" slot="icon-only" :icon="close" />
          </ion-button>
        </ion-buttons>
        <ion-title>{{ type }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-list v-if="following?.value.length > 0">
      <ion-item v-for="account in following?.value" :key="account.uid">
        <router-link
          class="avatar-header-link"
          style="text-decoration: none"
          :to="{ path: `/user/${account.username}` }"
          @click="cancel"
        >
          <ion-avatar slot="start" class="ion-margin-end">
            <img
              :src="
                account.avatarUrl ||
                'https://ionicframework.com/docs/img/demos/avatar.svg'
              "
              alt="User avatar"
            />
          </ion-avatar>
          <ion-label>{{ account.username }}</ion-label>
        </router-link>
        <ion-button
          v-if="!isCurrentUser && account.uid !== currentUser?.uid"
          slot="end"
          id="add-friend"
          aria-label="Add Friend"
          @click="handleFollow(account)"
          size="default"
          :fill="account.isFollowing ? 'outline' : 'solid'"
        >
          {{ account.isFollowing ? " Unfollow" : " Follow" }}
          <ion-icon
            slot="end"
            size="medium"
            :icon="account.isFollowing ? personRemoveSharp : personAddSharp"
          ></ion-icon>
        </ion-button>
      </ion-item>
    </ion-list>
    <div v-else class="ion-text-center">
      <ion-text>
        <h4>
          No one :(
        </h4>
      </ion-text>
    </div>
    <ion-toast
      :is-open="toast.isOpen"
      :message="toast.message"
      :color="toast.color"
      :duration="3000"
      @didDismiss="toast.isOpen = false"
    ></ion-toast>
  </ion-content>
</template>

<script lang="ts" setup>
import { db, firebaseAuth } from "@/firebase-service";
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, modalController, IonList, IonIcon, IonItem, IonLabel, IonAvatar, IonToast, IonText, } from "@ionic/vue";
import { onMounted, ref } from "vue";
import { personAddSharp, personRemoveSharp, close } from "ionicons/icons";
import { doc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";

const props = defineProps({
  following: Object,
  type: String,
});

const isCurrentUser = ref(false); // store whether the profile belongs to the authenticated user
const toast = ref({ isOpen: false, message: "", color: "" });
const currentUser = firebaseAuth.currentUser;

const cancel = () => modalController.dismiss(null, "cancel");
onMounted(() => {
  if (currentUser) {
    console.log(props.following);

    props.following?.value.forEach((other_user: any) => {
      other_user.isFollowing = other_user.followers.includes(currentUser.uid);
      console.log(other_user.isFollowing);
    });
  }
});
const handleFollow = async (account: any) => {
  console.log("STATUS OF FOLLOWING: ", account);

  try {
    if (currentUser && account.uid) {
      const userDocRef = doc(db, "users", account.uid);
      const currentUserDocRef = doc(db, "users", currentUser.uid);

      if (account.isFollowing) {
        // Unfollow logic
        await updateDoc(userDocRef, {
          followers: arrayRemove(currentUser.uid),
        });
        await updateDoc(currentUserDocRef, {
          following: arrayRemove(account.uid),
        });
        toast.value = {
          isOpen: true,
          message: "Successfully unfollowed " + account.username,
          color: "success",
        };
      } else {
        // Follow logic
        await updateDoc(userDocRef, {
          followers: arrayUnion(currentUser.uid),
        });
        await updateDoc(currentUserDocRef, {
          following: arrayUnion(account.uid),
        });
        toast.value = {
          isOpen: true,
          message: "Successfully followed " + account.username,
          color: "success",
        };
      }
      account.isFollowing = !account.isFollowing;
    } else {
      toast.value = {
        isOpen: true,
        message: "Failed to follow/unfollow. User data is missing.",
        color: "danger",
      };
    }
  } catch (error: any) {
    toast.value = {
      isOpen: true,
      message: "An error occurred: " + error.message,
      color: "danger",
    };
  }
};
</script>
