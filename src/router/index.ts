import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import TabsPage from "../views/TabsPage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/market/:id",
    component: () => import("../views/PartDetails.vue"),
  },
  {
    path: "/market/autoshop/:id",
    component: () => import("../views/OfferDetails.vue"),
  },
  {
    path: "/",
    component: TabsPage,
    children: [
      {
        path: "",
        redirect: "/home",
      },
      {
        path: "home",
        component: () => import("@/views/FeedPage.vue"),
      },
      {
        path: "search",
        component: () => import("@/views/SearchPage.vue"),
      },
      {
        path: "events",
        component: () => import("@/views/EventPage.vue"),
      },
      {
        path: "market",
        component: () => import("@/views/MarketPage.vue"),
      },
      {
        path: "myProfile",
        component: () => import("@/views/MyProfilePage.vue"),
      },
      {
        path: "otherProfile",
        component: () => import("@/views/OtherProfilePage.vue"),
      },
      {
        path: "settings",
        component: () => import("@/views/ProfileSettingsPage.vue"),
      },
      {
        path: "login",
        component: () => import("@/views/LoginPage.vue"),
      },
      {
        path: "register",
        component: () => import("@/views/RegisterPage.vue"),
      },
      {
        path: "audiModels",
        component: () => import("@/views/AudiModelsPage.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
