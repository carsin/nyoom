<template>
    <ion-page id="main-content">
      <ion-header>
        <ion-toolbar v-if="isLoading">
          <ion-progress-bar type="indeterminate"></ion-progress-bar>
        </ion-toolbar>
        <ion-toolbar v-if="isCurrentUser">
          <ion-title> Your Garage </ion-title>
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
                            <ion-button>
                                <ion-icon slot="icon-only" name="add-circle-outline"></ion-icon>
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
            <h3> <i> @{{ username }} has no vehicles </i></h3>
          </ion-text>
          <ion-toast :is-open="toast.isOpen" :message="toast.message" :color="toast.color" :duration="3000"
            @didDismiss="toast.isOpen = false"></ion-toast>
        </div>
      </ion-content>
    </ion-page>
  </template>

<script setup lang="ts">
const vehicles = ref([]); // Variable to hold the vehicles
import PersonalHeader from '@/components/PersonalHeader.vue';
import VehicleComponent from '@/components/VehicleComponent.vue';
</script>