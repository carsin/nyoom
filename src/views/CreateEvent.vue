  <template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>Create Event</ion-title>
          <router-link slot="end" to="/events">
            <ion-button fill="outline" class="ion-padding-end">Back</ion-button>
          </router-link>
        </ion-toolbar>
      </ion-header>
      <ion-content :fullscreen="true">
        <ion-progress-bar v-if="isUploading" :value="uploadProgress / 100"></ion-progress-bar>
        <ion-grid>
          <ion-row>
            <ion-col size-md="6" offset-md="3">
              <ion-list>
                <ion-item v-if="imageFile">
                  <img :src="imagePreviewUrl" class="post-image" id="imagePreview" alt="Uploaded Image" />
                </ion-item>
                <ion-item class="no-border">
                  <ion-label color="primary" position="stacked">Upload a photo: </ion-label>
                  <input type="file" accept="image/*" @change="handleImagePreview" class="ion-margin-top" />
                  <ion-button @click="handleImageUpload" size="default" fill="outline">Upload Image</ion-button>
                </ion-item>
                <ion-item class="no-border">
                  <ion-label position="stacked" color="primary" class="ion-margin-bottom"> <b>Enter Event Name</b>: </ion-label>
                  <ion-textarea :maxlength="MAX_EVENT_NAME_LENGTH" id="name-input" v-model="eventName"
                    placeholder="Name The Event" aria-label="Event Name input" :autoGrow="true"
                    :counter="true"></ion-textarea>
                </ion-item>
                <ion-item class="no-border">
                  <ion-label position="stacked" color="primary" class="ion-margin-bottom"> <b>Enter Event Description</b>: </ion-label>
                  <ion-textarea :maxlength="MAX_CAPTION_LENGTH" id="description-input" v-model="description"
                    placeholder="Describe The Event" aria-label="Description input" :autoGrow="true"
                    :counter="true"></ion-textarea>
                </ion-item>
                <ion-item class="no-border">
                  <ion-label position="stacked" color="primary" class="ion-margin-bottom"> <b>Enter Adddress</b>: </ion-label>
                  <ion-textarea :maxlength="MAX_EVENT_NAME_LENGTH" id="addres-input" v-model="address"
                    placeholder="Street Address, City, State, Zip Code" aria-label="Address input" :autoGrow="true"
                    :counter="true"></ion-textarea>
                </ion-item>
                <ion-item class="no-border">
                  <ion-label position="stacked" color="primary" class="ion-margin-bottom"> <b>Enter Date and Time</b>: </ion-label>
                  <ion-datetime-button datetime="datetime" class="date-picker"></ion-datetime-button>
                  <ion-modal :keep-contents-mounted="true">
                    <ion-datetime id="datetime"></ion-datetime>
                  </ion-modal>
                </ion-item>
              </ion-list>
              <ion-button :disabled="description.length > MAX_CAPTION_LENGTH || !imageUrl" expand="block" @click="handleCreatePost" fill="outline">Create Event</ion-button>
            </ion-col>
          </ion-row>
        </ion-grid>
        <ion-toast :is-open="toast.isOpen" :message="toast.message" :color="toast.color" :duration="2000" @didDismiss="toast.isOpen = false"></ion-toast>
      </ion-content>
    </ion-page>
  </template>

<style>

.no-border{
    --border-style: none;
}
.date-picker{
  padding-top: 10px;
}

</style>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { IonPage, IonList, IonHeader, IonToolbar, IonTitle, IonProgressBar, IonContent, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonTextarea, IonButton, IonToast, IonDatetimeButton, IonDatetime, IonModal } from '@ionic/vue';
  import { firebaseAuth, db } from "../firebase-service";
  import { doc, getDoc, collection, addDoc } from "firebase/firestore";
  import { useRouter } from 'vue-router';
  import { uploadImageToFirebase } from '@/util/uploadImage';
  import { MAX_CAPTION_LENGTH} from "../util/constants"

  const MAX_EVENT_NAME_LENGTH = 50;
  
  const isUploading = ref(false);
  const uploadProgress = ref(0);
  const toast = ref({ isOpen: false, message: '', color: '' });
  const description = ref('');
  const eventName = ref('');
  const address = ref('');
  const date = ref('');
  const time = ref('');
  const router = useRouter();
  let imageUrl = '';
  let imagePath = '';
  
  const imageFile = ref<File | null>(null);
  const imagePreviewUrl = ref<string | undefined>(undefined);
  
  const handleImagePreview = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      imageFile.value = file;
      imagePreviewUrl.value = URL.createObjectURL(file);
    }
  };
  
  const handleImageUpload = async () => {
    isUploading.value = true;
    if (!imageFile.value) { // no image uploaded
      toast.value = { isOpen: true, message: "You haven't uploaded an image!", color: "danger" };
      return;
    }
  
    try {
      const imageData = await uploadImageToFirebase(imageFile.value, 'posts', (progress: number) => {
        uploadProgress.value = progress;
      });
      imageUrl = imageData.downloadURL;
      imagePath = imageData.imagePath;
      toast.value = { isOpen: true, message: "Successfully uploaded image!", color: "success" };
      isUploading.value = false;
    } catch (error: any) {
      toast.value = { isOpen: true, message: "Error while uploading image: " + error.message, color: "danger" };
      isUploading.value = false;
    }
  };
  
  // sending post to posts firestore collection
  const handleCreatePost = async () => {
    const user = firebaseAuth.currentUser;
  
    if (!imageUrl || !imagePath) {
      toast.value = { isOpen: true, message: 'No image uploaded!', color: "danger" };
      return;
    } else if (description.value.length > MAX_CAPTION_LENGTH) {
      toast.value = { isOpen: true, message: 'Caption too long!', color: "danger" };
      return;
    }
  
    // get userdata for username and uid
    try {
      const eventsCollection = collection(db, 'events');
      if (user) {
        // get user data
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          await addDoc(eventsCollection, {
            userId: user.uid,
            username: docSnap.data().username,
            imageUrl: imageUrl,
            imagePath: imagePath,
            eventName: eventName.value,
            description: description.value,
            address: address.value,
            subscribers: [],
            timestamp: new Date()
          });
        }
        toast.value = { isOpen: true, message: 'Post created successfully!', color: "success" };
        router.push("/feed");
      }
    } catch (error: any) {
      toast.value = { isOpen: true, message: 'Error while posting: ' + error.message, color: "danger" };
      console.error(error.message);
    }
  };
  
  </script>