import { Capacitor } from "@capacitor/core";
import { getApp, initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth, indexedDBLocalPersistence, initializeAuth, } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";

export const firebaseApp = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
});

let _firebaseAuth = null;

if (Capacitor.isNativePlatform()) {
  _firebaseAuth = initializeAuth(getApp(), {
    persistence: indexedDBLocalPersistence,
  });
} else {
  _firebaseAuth = getAuth();
}

export const firebaseAuth = _firebaseAuth;

// get database from firestore
export const db = getFirestore(firebaseApp);
export const users_collection = collection(db, "users");
export const storage = getStorage(firebaseApp);

// TODO: use when project deployed
// Initialize Analytics 
// import { getAnalytics } from "firebase/analytics";
// const analytics = getAnalytics(fireBaseApp);
