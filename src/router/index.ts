import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import TabsPage from "../views/TabsPage.vue";
import { firebaseAuth } from "../firebase-service";
import { onAuthStateChanged } from 'firebase/auth';

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/market/:id",
    component: () => import("../views/PartDetails.vue"),
    meta: { requiresAuth: true }, 
  },
  {
    path: "/market/autoshop/:id",
    component: () => import("../views/OfferDetails.vue"),
    meta: { requiresAuth: true }, 
  },
  {
    path: '/home',
    component: () => import('@/views/TitlePage.vue'),
  },
  {
    path: '/login',
    component: () => import('@/views/LoginPage.vue'),
  },
  {
    path: '/register',
    component: () => import('@/views/RegisterPage.vue'),
  },
  {
    path: '/tabs',
    component: TabsPage,
    children: [
      {
        path: '/tabs',
        redirect: '/feed'
      },
      {
        path: '/feed',
        component: () => import('@/views/FeedPage.vue'),
        meta: { requiresAuth: true }, 
      },
      {
        path: '/search',
        component: () => import('@/views/SearchPage.vue'),
        meta: { requiresAuth: true }, 
      },
      {
        path: '/events',
        component: () => import('@/views/EventPage.vue'),
        meta: { requiresAuth: true }, 
      },
      {
        path: '/market',
        component: () => import('@/views/MarketPage.vue'),
        meta: { requiresAuth: true }, 
      },
      {
        path: '/myProfile',
        component: () => import('@/views/MyProfilePage.vue'),
        meta: { requiresAuth: true }, 
      },
      {
        path: '/otherProfile',
        component: () => import('@/views/OtherProfilePage.vue'),
        meta: { requiresAuth: true }, 
      },
      {
        path: '/settings',
        component: () => import('@/views/ProfileSettingsPage.vue'),
        meta: { requiresAuth: true }, 
      },
      {
        path: '/audiModels',
        component: () => import('@/views/AudiModelsPage.vue'),
        meta: { requiresAuth: true }, 
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});


router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  onAuthStateChanged(firebaseAuth, (user) => {
    const isAuthenticated = firebaseAuth.currentUser;
    console.log("authenticated:" + isAuthenticated);
    
    if (requiresAuth && !isAuthenticated) {
      next('/home'); // Redirect to login if not authenticated
    } else if ((to.path === '/home' || to.path === '/login' || to.path === '/register') && isAuthenticated) {
      next('/feed'); // Redirect to feed if already authenticated
    } else {
      next(); // Proceed with the navigation
    }
  });
});

export default router;
