<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { firebaseAuth } from "./firebase-service";
import { signInWithEmailAndPassword } from "firebase/auth";
import { onMounted, resolveComponent } from "vue";
import { useRouter } from 'vue-router';

document.title = 'Nyoom';

// onMounted(() => {
//   firebaseAuth.onAuthStateChanged(async (user) => {
//     if (!user) {
//       try {
//         const resp = await signInWithEmailAndPassword(
//           firebaseAuth,
//           "carson@gmail.com",
//           "password"
//         );
//         console.log("login", resp);
//       } catch (error) {
//         console.error("Authentication error:", error);
//       }
//     } else {
//       console.log("existing", user);
//     }
//   });
// });

console.log(firebaseAuth);

</script>
