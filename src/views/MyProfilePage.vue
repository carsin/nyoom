<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>@myusername</ion-title>
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
          <FriendListItemComponent username="@friend1" avatar_src="/src/assets/avatar.svg"/>
          <FriendListItemComponent username="@friend2" avatar_src="/src/assets/avatar.svg"/>
          <FriendListItemComponent username="@friend3" avatar_src="/src/assets/avatar.svg"/>
          <FriendListItemComponent username="@friend4" avatar_src="/src/assets/avatar.svg"/>
          <FriendListItemComponent username="@friend5" avatar_src="/src/assets/avatar.svg"/>
          <FriendListItemComponent username="@friend6" avatar_src="/src/assets/avatar.svg"/>
          <FriendListItemComponent username="@friend7" avatar_src="/src/assets/avatar.svg"/>
          <FriendListItemComponent username="@friend8" avatar_src="/src/assets/avatar.svg"/>
          <FriendListItemComponent username="@friend9" avatar_src="/src/assets/avatar.svg"/>
          <FriendListItemComponent username="@friend10" avatar_src="/src/assets/avatar.svg"/>
        </ion-list>
      </ion-content>
    </ion-menu>
    <ion-content id="main-content" :fullscreen="true">
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
              <ion-title class="ion-margin-bottom">@myusername</ion-title>
              <img id="profile-avatar" src="/src/assets/carpic3.png" />
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
                <ion-text> <b>83482</b> Followers </ion-text>
              </ion-chip>
              <ion-chip color="primary">
                <ion-text> <b>232</b> Following </ion-text>
              </ion-chip>
            </ion-col>
          </ion-row>
          <ion-row class="ion-text-center">
            <ion-col>
              <ion-title size="small">here is where the bio goes. There will be a word/letter limit on the bio in the
                future.</ion-title>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-toolbar>
      <ion-list>
        <FeedCardComponent username=""
          caption="Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat."
          upvotes="2832" downvotes="91" image_src="../src/assets/carpic2.png" />
        <FeedCardComponent username=""
          caption="Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis."
          upvotes="9232" downvotes="822" image_src="../src/assets/carpic4.png" />
      </ion-list>
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
</style>

<script setup lang="ts">
import { IonText, IonMenu, IonMenuToggle, IonChip, IonGrid, IonRow, IonCol, IonIcon, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonList, IonItem } from '@ionic/vue';
import { closeCircle, settingsSharp, peopleSharp, carSportSharp } from 'ionicons/icons';
import FeedCardComponent from '@/components/FeedCardComponent.vue';
import FriendListItemComponent from '@/components/FriendListItemComponent.vue';
</script>
