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
        path: "profile",
        component: () => import("@/views/ProfilePage.vue"),
      },
      {
        path: "login",
        component: () => import("@/views/LoginPage.vue"),
      },
      {
        path: "register",
        component: () => import("@/views/RegisterPage.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
