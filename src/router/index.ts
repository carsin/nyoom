import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import TabsPage from "../views/TabsPage.vue";
import { firebaseAuth } from "../firebase-service";
import { onAuthStateChanged } from 'firebase/auth';

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/onboard",
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
    path: '/onboard',
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
    path: '/verify-email',
    component: () => import('@/views/VerifyEmail.vue'),
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
        path: '/user/:username',
        component: () => import('@/views/ProfilePage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/users/:username',
        component: () => import('@/views/ProfilePage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/settings',
        component: () => import('@/views/ProfileSettingsPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/create-post',
        component: () => import('@/views/CreatePost.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/audiModels',
        component: () => import('@/views/AudiModelsPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/404',
        component: () => import('@/views/404Page.vue'),
      },
      {
        path: '/:catchAll(.*)',
        component: () => import('@/views/404Page.vue'),
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  let isNavigationConfirmed = false; // To track if next() has been called

  const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
    if (!isNavigationConfirmed) { // Ensure next() is called only once
      const isAuthenticated = user !== null;
      const isEmailVerified = user?.emailVerified || false;

      if (requiresAuth && !isAuthenticated) {
        next('/onboard');
      } else if (isAuthenticated && !isEmailVerified && to.path !== '/verify-email' && to.path !== '/login') {
        next('/verify-email');
      } else if ((to.path === '/onboard' || to.path === '/login' || to.path === '/register' || to.path == '/verify-email') && isAuthenticated && isEmailVerified) {
        next('/feed');
      } else {
        next();
      }

      isNavigationConfirmed = true; // Mark next() as called
      unsubscribe(); // Cleanup the observer to prevent memory leaks
    }
  });
});

export default router;
