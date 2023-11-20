<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="goBack" class="back-button">
            <ion-icon
              slot="icon-only"
              name="arrow-back"
              class="icon-color"
            ></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Add Vehicle</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-progress-bar
        v-if="isUploading"
        :value="uploadProgress"
      ></ion-progress-bar>
      <ion-grid>
        <ion-row>
          <ion-col size-md="6" offset-md="3">

            <!-- Segmented control for selecting vehicle type -->
            <ion-item>
              <ion-segment @ionChange="selectOption($event.detail.value)">
                <ion-segment-button value="Car">
                  <ion-label>Car</ion-label>
                </ion-segment-button>
                <ion-segment-button value="Motorcycle">
                  <ion-label>Motorcycle</ion-label>
                </ion-segment-button>
              </ion-segment>
            </ion-item>

            <!-- Display car modifications if 'Car' is selected -->
            <div v-if="selectedVehicleType === 'Car'">
              <div v-for="(modCategory, index) in carMods" :key="index">
                <ion-item @click="toggleCategory(index, 'car')">
                  <ion-label>{{ modCategory.category }}</ion-label>
                </ion-item>
                <div v-show="carModExpanded[index]">
                  <div v-for="option in modCategory.options" :key="option">
                    <ion-item>
                      <ion-label>{{ option }}</ion-label>
                      <ion-input 
                        type="text" 
                        placeholder="Enter details" 
                        v-model="carModDetails[option]"
                      />
                    </ion-item>
                  </div>
                </div>
              </div>
            </div>

            <!-- Display motorcycle modifications if 'Motorcycle' is selected -->
            <div v-if="selectedVehicleType === 'Motorcycle'">
              <div v-for="(modCategory, index) in motorcycleMods" :key="index">
                <ion-item @click="toggleCategory(index, 'motorcycle')">
                  <ion-label>{{ modCategory.category }}</ion-label>
                </ion-item>
                <div v-show="motorcycleModExpanded[index]">
                  <div v-for="option in modCategory.options" :key="option">
                    <ion-item>
                      <ion-label>{{ option }}</ion-label>
                      <ion-input 
                        type="text" 
                        placeholder="Enter details" 
                        v-model="motorcycleModDetails[option]"
                      />
                    </ion-item>
                  </div>
                </div>
              </div>
            </div>

            <ion-item>
              <ion-label position="floating">Make: </ion-label>
              <ion-input v-model="make" />
            </ion-item>
            <ion-item>
              <ion-label position="floating">Model: </ion-label>
              <ion-input v-model="model" />
            </ion-item>
            <ion-item>
              <ion-label position="floating">Year: </ion-label>
              <ion-input v-model="year" />
            </ion-item>
            <ion-item>
              <ion-label position="floating">Description: </ion-label>
              <ion-input v-model="description" />
            </ion-item>
            <ion-item v-if="imageURL">
              <img :src="imageURL" alt="Uploaded Image" />
            </ion-item>
            <ion-item>
              <input type="file" accept="image/*" @change="uploadImage" />
            </ion-item>
            <ion-button expand="block" @click="addVehicle">Add Vehicle</ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
      <ion-toast
        :is-open="toast.isOpen"
        :message="toast.message"
        :color="toast.color"
        :duration="2000"
        @didDismiss="toast.isOpen = false"
      ></ion-toast>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, Ref } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonProgressBar,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonToast,
  IonSegment,
} from "@ionic/vue";

import { firebaseAuth, db, storage } from "../firebase-service";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import {
  uploadBytesResumable,
  getDownloadURL,
  ref as storageRef,
} from "firebase/storage";
import { useRouter } from "vue-router";

const selectedVehicleType = ref('');
const selectOption = (vehicleType: string) => {
  selectedVehicleType.value = vehicleType;
};
const carMods = ref([
  { category: "Engine Builds", options: ["Cold Air Intakes", "Cooling", "ECU Tunes", "Forced Induction", "Fuel Systems", "Injectors", "Pumps"] },
  { category: "Engine Internals", options: ["Pistons", "Rods", "Cams", "Cranks", "Valves", "Heads", "Bearings"] },
  { category: "Transmission Upgrades", options: ["Clutch", "Coolers", "Flywheel", "Gear Ratio", "Gearbox Type", "Shifter"] },
  { category: "Differential upgrades", options: ["Drive ratio", "Limited slip differential"] },
  { category: "Exhaust systems", options: ["Cat-back", "Downpipes", "Headers", "Muffler", "Resonators"] },
  { category: "Suspension", options: ["Camber Kits", "Coilovers", "Control Arms", "Shock Dampers", "Springs", "Strut Bars", "Sway Bars"] },
  { category: "Brake systems", options: ["Brake pads", "Calipers", "Disks", "Master Cylinders"] },
  { category: "Bodywork", options: ["Bumpers", "Fenders", "Grilles", "Hoods", "Mirrors", "Mudflaps", "Roll-cage", "Skirts", "Spoilers", "Tint"] },
  { category: "Wheels and Tires", options: ["Rims", "Spacers", "Tires"] },
  { category: "Electrical", options: ["Accessory Lights", "Alternator", "Battery", "Fuses and Relays", "Headlights", "Tail Lights", "Wiring"] },
  { category: "Interior Details", options: ["Audio Systems", "Harnesses", "Instrument Clusters", "Gauges", "Mats", "Pedals", "Seats", "Shifter", "Software", "Steering Wheel", "Weight Reduction"] }
]);

const motorcycleMods = ref([
  { category: "Engine Builds", options: ["Air Filters", "Cooling Systems", "ECU Tunes", "Forced Induction", "Fuel Systems", "Throttle Bodies"] },
  { category: "Engine Internals", options: ["Cams", "Cranks", "Heads", "Pistons", "Rods", "Valves", "Bearings"] },
  { category: "Transmission Upgrades", options: ["Chain and Sprockets", "Clutch", "Quick Shifters"] },
  { category: "Exhaust Systems", options: ["Baffles", "Full Exhaust Systems", "Headers", "Mufflers"] },
  { category: "Suspension", options: ["Forks", "Rear Shocks", "Springs", "Steering Dampers", "Swingarms"] },
  { category: "Brake Systems", options: ["Brake Lines", "Brake Pads", "Calipers", "Discs", "Master Cylinders"] },
  { category: "Bodywork", options: ["Crash Bars", "Fairings", "Fenders", "Footpegs", "Frame Sliders", "Grips", "Hand Guards", "Handlebars", "Levers", "Seats", "Tank Pads/Grips", "Windshields"] },
  { category: "Wheels & Tires", options: ["Rims", "Tires"] },
  { category: "Lighting & Electrical", options: ["Alternators", "Batteries", "Headlights", "Taillights", "Turn Signals", "Wiring Harnesses"] },
  { category: "Accessories", options: ["GPS & Phone Mounts", "Luggage Racks", "Saddlebags", "Tank Bags"] },
  { category: "Instrumentation", options: ["Instrument Clusters", "Gauges"] },
  { category: "Engine Guards", options: ["Engine Guards"] }
]);

const carModExpanded: Ref<boolean[]> = ref(carMods.value.map(() => false));
const motorcycleModExpanded: Ref<boolean[]> = ref(motorcycleMods.value.map(() => false));
type ModDetails = Record<string, string>;
const carModDetails: Ref<ModDetails> = ref({});
const motorcycleModDetails: Ref<ModDetails> = ref({});

const toggleCategory = (index: number, type: 'car' | 'motorcycle') => {
  if (type === 'car') {
    carModExpanded.value[index] = !carModExpanded.value[index];
  } else {
    motorcycleModExpanded.value[index] = !motorcycleModExpanded.value[index];
  }
};

const isUploading = ref(false);
const uploadProgress = ref(0);
const toast = ref({ isOpen: false, message: "", color: "" });
const router = useRouter();
let imageURL = "";

// upload image to firebase storage before creating post
const uploadImage = async (event: any) => {
  isUploading.value = true;
  const file = event.target.files[0];
  const storageReference = storageRef(storage, "posts/" + file.name);
  const uploadTask = uploadBytesResumable(storageReference, file);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = snapshot.bytesTransferred / snapshot.totalBytes;
      uploadProgress.value = progress;
    },
    (error) => {
      toast.value = {
        isOpen: true,
        message: "Upload failed: " + error.message,
        color: "danger",
      };
      isUploading.value = false;
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        imageURL = downloadURL;
        isUploading.value = false;
        toast.value = {
          isOpen: true,
          message: "Image uploaded successfully!",
          color: "success",
        };
      });
    }
  );
};

// sending post to posts firestore collection
const owner = ref("");
const ownerID = ref("");
const type = ref(""); // This will store the user's choice ('Car' or 'Motorcycle')
const make = ref("");
const model = ref("");
const year = ref<number | null>(null);
const description = ref("");
const images = ref([]);

const addVehicle = async () => {
  const vehicleCollection = collection(db, "vehicles");
  const user = firebaseAuth.currentUser;

  try {
    // Check if the imageURL is empty
    if (!imageURL) {
      toast.value = {
        isOpen: true,
        message: "Please upload an image for your vehicle.",
        color: "danger",
      };
      return; // Don't proceed if the image is empty
    }

    if (type.value === null || make.value === "") {
      throw new Error("Choose a type.");
    }

    if (make.value === null || make.value === "") {
      throw new Error("Make cannot be empty.");
    }

    if (model.value === null || model.value === "") {
      throw new Error("Model cannot be empty.");
    }

    if (isNaN(year.value)) {
      throw new Error("Year must be a valid number.");
    }

    if (year.value === null || year.value === "") {
      throw new Error("Price cannot be empty.");
    }

    if (user) {
      // get user data
      const userDocRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        await addDoc(vehicleCollection, {
          userId: user.uid,
          owner: docSnap.data().username,
          type: type.value,
          make: make.value,
          model: model.value,
          year: year.value,
          description: description.value,
          carMods: carMods.value,
          motorcycleMods: motorcycleMods.value,
          images: imageURL,
        });
        toast.value = {
          isOpen: true,
          message: "Vehicle added successfully!",
          color: "success",
        };
      } else {
        throw new Error("User data does not exist.");
      }
    } else {
      throw new Error("User is not authenticated.");
    }
  } catch (error: any) {
    console.error("Error adding vehicle:", error.message);
    toast.value = {
      isOpen: true,
      message: "Error adding vehicle: " + error.message,
      color: "danger",
    };
  }
};

const goBack = () => {
  router.back();
};
</script>
