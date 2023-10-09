<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Feed</ion-title>
                <ion-button slot="end" fill="outline" href="/login">Login</ion-button>
          <ion-button slot="end" fill="outline" href="/register">Register</ion-button>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <ion-header collapse="condense">
                <ion-toolbar>
                    <ion-title size="large">Feed</ion-title>
                </ion-toolbar>
            </ion-header>

            <!-- INFINITE SCROLL OF POSTS -->
            <ion-list>
                <ion-item v-for="(item, index) in items">
                    <ion-card>
                        <img :src="'https://picsum.photos/300/300?random=' + index" alt="avatar" />
                    <ion-card-header>
                        <ion-card-title>Card Title</ion-card-title>
                        <ion-card-subtitle>Card Subtitle</ion-card-subtitle>
                    </ion-card-header>
                    <ion-card-content>
                    Here's a small text description for the card content. Nothing more, nothing less.
                            Here's a small text description for the card content. Nothing more, nothing less.
                        </ion-card-content>
                    </ion-card>

                    <ion-label>{{ item }}</ion-label>
                </ion-item>
            </ion-list>
            <ion-infinite-scroll @ionInfinite="ionInfinite">
                <ion-infinite-scroll-content></ion-infinite-scroll-content>
            </ion-infinite-scroll>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
// import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
// import ExploreContainer from '@/components/ExploreContainer.vue';
// import { defineComponent } from 'vue';
//
    import {
        IonContent, IonInfiniteScroll, IonInfiniteScrollContent, IonList, IonItem, IonImg, IonLabel, InfiniteScrollCustomEvent, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonPage, IonHeader, IonToolbar, IonTitle,
    } from '@ionic/vue';
  
    import { defineComponent, reactive } from 'vue';
    export default defineComponent({
        components: {
            IonContent,
            IonInfiniteScroll,
            IonInfiniteScrollContent,
            IonList,
            IonItem,
            IonImg,
            IonLabel,
        },
        setup() {
            const items = reactive([]);
            const generateItems = () => { // add more item logic
                const count = items.length + 1;
                for (let i = 0; i < 50; i++) {
                    items.push(`Item ${count + i}`); // dunno why this gives off an error
                }
            };
            const ionInfinite = (ev: InfiniteScrollCustomEvent) => {
                generateItems();
                setTimeout(() => ev.target.complete(), 500);
            };
            generateItems();
            return { ionInfinite, items };
        },
    });
</script>
