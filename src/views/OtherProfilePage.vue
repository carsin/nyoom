<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>@notmyusername</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-menu side="end" content-id="main-content">
      <ion-header>
        <ion-toolbar>
          <ion-grid>
            <ion-row class="ion-align-items-center">
              <ion-col size="9">
                <ion-title>User's Friends</ion-title>
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
            </ion-col>
            <ion-col class="ion-text-center" size="10">
              <ion-title class="ion-margin-bottom">@notmyusername</ion-title>
              <img id="profile-avatar" src="/src/assets/carpic5.png" alt="Avatar image"/>
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
          <ion-row class="ion-text-center ion-align-items-center">
            <ion-col class="ion-align-items-center">
              <ion-chip color="primary">
                <ion-text> <b>298</b> Followers </ion-text>
              </ion-chip>
              <ion-chip color="primary">
                <ion-text> <b>232</b> Following </ion-text>
              </ion-chip>
              <ion-button id="add-friend" fill="clear" aria-label="Add Friend">
                <ion-icon slot="icon-only" size="medium" :icon="personAddSharp"></ion-icon>
              </ion-button>
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
        <PostCardComponent username=""
          caption="Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis."
          upvotes="23563" downvotes="230" image_src="../src/assets/carpic1.png" />
        <PostCardComponent username=""
          caption="Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat."
          upvotes="2832" downvotes="91" image_src="../src/assets/carpic5.png" />
      </ion-list>
      <ion-toast trigger="add-friend" message="Follow request sent to @notmyusername!" :duration="3000"></ion-toast>
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

#usernameHeader {
  display: inline;
}
</style>

<script setup lang="ts">
import { IonText, IonToast, IonMenu, IonMenuToggle, IonChip, IonGrid, IonRow, IonCol, IonIcon, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonList, IonItem } from '@ionic/vue';
import { personAddSharp, closeCircle, peopleSharp, carSportSharp } from 'ionicons/icons';
import PostCardComponent from '@/components/PostCardComponent.vue';
import FriendListItemComponent from '@/components/FriendListItemComponent.vue';
</script>
