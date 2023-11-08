<template>
  <!-- <ion-card @click="openModal"> -->
    <ion-card>
    <!-- <ion-card-header v-if="isLoading">
      <ion-progress-bar type="indeterminate"></ion-progress-bar>
    </ion-card-header> -->
    <ion-grid>
      <!-- Post header -->
      <ion-row>
        <!-- Avatar username and timestamp component -->
        <!-- <ion-col class="ion-justify-content-center ion-text-left ion-align-items-bottom">
          <ion-button v-if="showAvatar" fill="clear">
            <router-link class="avatar-header-link" style="text-decoration: none;" :to="{ path: `/user/${username}` }">
              <ion-avatar>
                <img :src="avatarUrl || 'https://ionicframework.com/docs/img/demos/avatar.svg'" alt="User avatar" />
              </ion-avatar>
              <div class="ion-align-items-bottom ion-no-margin ion-margin-start">
                <ion-card-title color="primary"> @{{ username }} </ion-card-title>
                <ion-card-subtitle> {{ formattedTimestamp }} </ion-card-subtitle>
              </div>
            </router-link>
          </ion-button>
        </ion-col> -->
        <!-- show timestamp if no avatar component -->
        <!-- <ion-col v-if="!showAvatar" class="ion-text-center ion-align-self-center ion-justify-content-center">
          <ion-card-subtitle> {{ formattedTimestamp }} </ion-card-subtitle>
        </ion-col>
        <ion-col class="ion-justify-content-center ion-align-items-bottom ion-text-end">
          <div v-if="isPostOwner">
            <ion-button fill="clear" v-if="!editingCaption" @click="editingCaption = true">
              <ion-icon aria-hidden="true" slot="icon-only" :icon="pencil" />
            </ion-button>
            <ion-button v-if="editingCaption" color="danger" fill="clear" @click="editingCaption = false">
              <ion-icon aria-hidden="true" slot="icon-only" :icon="close" />
            </ion-button>
            <ion-button fill="clear" @click="handlePostDelete">
              <ion-icon aria-hidden="true" color="danger" slot="icon-only" :icon="trash" />
            </ion-button>
          </div>
        </ion-col> -->
        <ion-card-title>@{{ username }}</ion-card-title>
      </ion-row>
        
      <ion-row>
        <img :src="image_src" alt="Event image content" />
      </ion-row>
      <ion-row>
        <ion-col>
            <ion-card-subtitle>{{ eventType }}</ion-card-subtitle>
            <ion-card-title>{{ eventTitle }}</ion-card-title>
        </ion-col>
        <ion-col class="vert-center">
          <ion-buttons class="ion-float-right">
            <ion-button v-if="subscribed" fill="outline">Unsubscribe</ion-button>
            <ion-button v-else fill="outline">Subscribe</ion-button>
          </ion-buttons>
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-card>
</template>

<style>

.vert-center{
  vertical-align: center;
}

</style>
  
  
<script setup lang="ts">
  import { IonCard, IonButton, IonGrid, IonCol, IonRow, IonIcon, IonCardSubtitle, IonCardHeader, IonProgressBar, IonAvatar, IonCardTitle, modalController, IonButtons } from '@ionic/vue';
  defineProps({
    username: String,
    eventTitle: String,
    eventType: String,
    image_src: String,
  });
  
  import { image, personRemoveSharp } from 'ionicons/icons';

  var subscribed:boolean = false;

  // const openModal = async () => {
  //   const modal = await modalController.create({
  //     component: MarketFilter,
  //  });
  // }
</script>