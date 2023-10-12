<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>@username</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-toolbar>
        <ion-grid>
          <ion-row>
            <ion-col size="1">
              <ion-buttons>
                <ion-button>
                  <ion-icon slot="icon-only" :icon="settingsSharp"></ion-icon>
                </ion-button>
              </ion-buttons>
            </ion-col>
            <ion-col class="ion-text-center" size="10">
              <ion-title class="ion-margin-bottom">@username</ion-title>
              <img id="profile-avatar" src="/src/assets/modified-race-car.jpg" />
            </ion-col>
            <ion-col size="1">
              <ion-buttons class="ion-float-right">
                <ion-list>
                  <ion-item>
                    <ion-button>
                      <ion-icon slot="icon-only" :icon="peopleSharp"></ion-icon>
                    </ion-button>
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
        <FeedCardComponent username="@testmanposting1993"
          caption="Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis."
          upvotes="23563" downvotes="230" image_src="../src/assets/carpic1.png" />
        <FeedCardComponent username="@justanotherpostah42"
          caption="Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat."
          upvotes="2832" downvotes="91" image_src="../src/assets/carpic2.png" />
        <FeedCardComponent username="@thisguylovesposting1973"
          caption="Caption blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah "
          upvotes="2822" downvotes="232" image_src="../src/assets/carpic3.png" />
        <FeedCardComponent username="@thisguylovesposting1973"
          caption="Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis."
          upvotes="9232" downvotes="822" image_src="../src/assets/carpic4.png" />
        <FeedCardComponent username="@thisguylovesposting1973"
          caption="Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis."
          upvotes="10203" downvotes="920" image_src="../src/assets/carpic5.png" />
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
</style>

<script setup lang="ts">
import { IonText, IonChip, IonGrid, IonRow, IonCol, IonIcon, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonList, IonItem } from '@ionic/vue';
import { settingsSharp, peopleSharp, carSportSharp } from 'ionicons/icons';
import FeedCardComponent from '@/components/FeedCardComponent.vue';
</script>
