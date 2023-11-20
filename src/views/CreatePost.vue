<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Create Post</ion-title>
        <router-link slot="end" to="/feed">
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
              <ion-item>
                <ion-label color="primary" position="stacked">Upload a photo: </ion-label>
                <input type="file" accept="image/*" @change="handleImagePreview" class="ion-margin-top" />
                <ion-button @click="handleImageUpload" size="default">Upload Image</ion-button>
              </ion-item>
              <ion-item>
                <ion-label position="stacked" color="primary" class="ion-margin-bottom"> <b>Enter Caption</b>:
                </ion-label>
                <ion-textarea :maxlength="MAX_CAPTION_LENGTH" id="caption-input" v-model="caption"
                  placeholder="Say something witty :p" aria-label="Caption input" :autoGrow="true"
                  :counter="true"></ion-textarea>
              </ion-item>
              <ion-item @click="openMakeModal">
                <ion-button>
                  <ion-label>Select Vehicle Make</ion-label>
                </ion-button>
                <ion-text>{{ selectedMake }}</ion-text>
              </ion-item>
              <ion-item v-if="selectedMake" @click="openModelModal">
                <ion-button>
                  <ion-label>Select Vehicle Model</ion-label>
                </ion-button>
                <ion-text>{{ selectedModel }}</ion-text>
              </ion-item>

              <!-- Make Selection Modal -->
              <ion-modal :is-open="isMakeModalOpen" @did-dismiss="isMakeModalOpen = false">
                <ion-header>
                  <ion-toolbar>
                    <ion-title>Select Make</ion-title>
                    <ion-buttons slot="end">
                      <ion-button @click="isMakeModalOpen = false">Close</ion-button>
                    </ion-buttons>
                  </ion-toolbar>
                </ion-header>
                <ion-content>
                  <ion-searchbar v-model="makeSearchQuery"></ion-searchbar>
                  <ion-list>
                    <ion-item class="search-item" v-for="make in filteredMakes" :key="make" @click="selectMake(make)">
                      {{ make }}
                    </ion-item>
                  </ion-list>
                </ion-content>
              </ion-modal>

              <!-- Model Selection Modal -->
              <ion-modal :is-open="isModelModalOpen" @did-dismiss="closeModelModal">
                <ion-header>
                  <ion-toolbar>
                    <ion-title>Select Model</ion-title>
                    <ion-buttons slot="end">
                      <ion-button @click="closeModelModal">Close</ion-button>
                    </ion-buttons>
                  </ion-toolbar>
                </ion-header>
                <ion-content>
                  <ion-searchbar v-model="modelSearchQuery"></ion-searchbar>
                  <ion-list>
                    <ion-item v-for="model in filteredModels" :key="model" @click="selectModel(model)">
                      {{ model }}
                    </ion-item>
                    <ion-item v-if="!isCustomModel" @click="enableCustomModelEntry">
                      <ion-label><i>Can't find your model? Enter custom model</i></ion-label>
                    </ion-item>
                  </ion-list>
                  <ion-item v-if="isCustomModel">
                    <ion-label position="floating">Enter Custom Model</ion-label>
                    <ion-input v-model="customModel" placeholder="Type your model" @keyup.enter="closeModelModal"></ion-input>
                  </ion-item>
                </ion-content>
              </ion-modal>
            </ion-list>
            <ion-button :disabled="caption.length > MAX_CAPTION_LENGTH || !imageUrl" expand="block"
              @click="handleCreatePost">Create Post</ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
      <ion-toast :is-open="toast.isOpen" :message="toast.message" :color="toast.color" :duration="2000"
        @didDismiss="toast.isOpen = false"></ion-toast>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { IonPage, IonSearchbar, IonModal, IonList, IonHeader, IonText, IonButtons, IonToolbar, IonTitle, IonProgressBar, IonContent, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonTextarea, IonButton, IonToast, IonInput } from '@ionic/vue';
import { firebaseAuth, db } from "../firebase-service";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import { useRouter } from 'vue-router';
import { uploadImageToFirebase } from '@/util/uploadImage';
import { MAX_CAPTION_LENGTH } from "../util/constants"
import { getMakes, getModels } from 'car-info';

const isUploading = ref(false);
const uploadProgress = ref(0);
const toast = ref({ isOpen: false, message: '', color: '' });
const caption = ref('');
const router = useRouter();
const makes = ref(getMakes());
const models = ref([]);
const selectedMake = ref('');
const selectedModel = ref('');
const makeSearchQuery = ref('');
const modelSearchQuery = ref('');
const isMakeModalOpen = ref(false);
const isModelModalOpen = ref(false);
const isCustomModel = ref(false);
const customModel = ref('');
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
  } else if (caption.value.length > MAX_CAPTION_LENGTH) {
    toast.value = { isOpen: true, message: 'Caption too long!', color: "danger" };
    return;
  } else if (!selectedMake.value || !selectedModel.value) {
    toast.value = { isOpen: true, message: 'Please select both vehicle make and model!', color: "danger" };
    return;
  }


  try {
    const postsCollection = collection(db, 'posts');
    if (user) {
      // get userdata for username and uid
      const userDocRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        await addDoc(postsCollection, {
          userId: user.uid,
          username: docSnap.data().username,
          imageUrl: imageUrl,
          imagePath: imagePath,
          caption: caption.value,
          upvoteCount: 0,
          downvoteCount: 0,
          vehicleMake: selectedMake.value,
          vehicleModel: selectedModel.value,
          upvoters: [],
          downvoters: [],
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

const filteredMakes = computed(() => {
  return makes.value.filter(make =>
    make.toLowerCase().includes(makeSearchQuery.value.toLowerCase())
  );
});

const filteredModels = computed(() => {
  return models.value.filter(model =>
    model.toLowerCase().includes(modelSearchQuery.value.toLowerCase())
  );
});

const openMakeModal = () => {
  isMakeModalOpen.value = true;
  makeSearchQuery.value = '';
};

const selectMake = (make) => {
  selectedMake.value = make;
  selectedModel.value = ''; // Reset the model when a new make is selected
  models.value = getModels(make);
  isMakeModalOpen.value = false;
};

const openModelModal = () => {
  isModelModalOpen.value = true;
  modelSearchQuery.value = '';
};


const enableCustomModelEntry = () => {
  isCustomModel.value = true;
};

const selectModel = (model) => {
  if (!isCustomModel.value) {
    selectedModel.value = model;
    isModelModalOpen.value = false;
  }
};

const closeModelModal = () => {
  isModelModalOpen.value = false;
  modelSearchQuery.value = '';
  if (isCustomModel.value && customModel.value) {
    selectedModel.value = customModel.value;
  }
  // Reset custom model entry
  isCustomModel.value = false;
  customModel.value = '';
};

// load vehicle makes
const loadVehicleMakes = () => {
  makes.value = getMakes(); // Using car-info's getMakes
};

onMounted(loadVehicleMakes);

</script>

<style scoped>
.search-item:hover {
  cursor: pointer;
}
</style>
