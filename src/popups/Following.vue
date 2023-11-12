<template>
  <ion-content>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button color="medium" @click="cancel"> X </ion-button>
        </ion-buttons>
        <ion-title>Following</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-list>
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
        <ion-button slot="end"> Unfollow </ion-button>
      </ion-item>
    </ion-list>
  </ion-content>
</template>

<script lang="ts" setup>
import { firebaseAuth } from "@/firebase-service";
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  modalController,
  IonList,
  IonItem,
  IonLabel,
  IonAvatar,
  alertController,
} from "@ionic/vue";
import { ref } from "vue";
import { trash, pencil, checkmark, close } from "ionicons/icons";

// Define the expected 'part' prop
const props = defineProps({
  following: Object,
});

const user = firebaseAuth.currentUser;
const editingPart = ref(false); // State to manage the caption editing mode

const cancel = () => modalController.dismiss(null, "cancel");

const toast = ref({ isOpen: false, message: "", color: "" });
</script>
