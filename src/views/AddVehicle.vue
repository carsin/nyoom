<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="goBack" class="back-button">
            <ion-icon slot="icon-only" :icon="arrowBack" class="icon-color"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Add Vehicle</ion-title>
        <ion-progress-bar v-if="isUploading" :value="uploadProgress / 100"></ion-progress-bar>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
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
                      <ion-input type="text" placeholder="Enter details" v-model="carModDetails[option]" aria-label="Car mod details" />
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
                      <ion-input type="text" placeholder="Enter details" v-model="motorcycleModDetails[option]" aria-label="Motorcycle mod details" />
                    </ion-item>
                  </div>
                </div>
              </div>
            </div>

            <ion-item>
              <ion-label position="floating">Make: </ion-label>
              <ion-input v-model="make" aria-label="Vehicle make" />
            </ion-item>
            <ion-item>
              <ion-label position="floating">Model: </ion-label>
              <ion-input v-model="model" aria-label="Vehicle model" />
            </ion-item>
            <ion-item>
              <ion-label position="floating">Year: </ion-label>
              <ion-input v-model="year" aria-label="Vehicle year" />
            </ion-item>
            <ion-item>
              <ion-label position="floating">Description (optional): </ion-label>
              <ion-input v-model="description" aria-label="Vehicle description" />
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
      <ion-toast :is-open="toast.isOpen" :message="toast.message" :color="toast.color" :duration="2000"
        @didDismiss="toast.isOpen = false"></ion-toast>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, Ref } from "vue";
import { IonPage, IonHeader, IonToolbar, IonTitle, IonProgressBar, IonContent, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonInput, IonButton, IonToast, IonSegment, IonIcon, IonButtons, IonSegmentButton, } from "@ionic/vue";
import { firebaseAuth, db } from "../firebase-service";
import { doc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { arrowBack } from 'ionicons/icons';
import { uploadImageToFirebase } from '@/util/uploadImage';
import { useRouter } from "vue-router";

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
const selectedVehicleType = ref('');
const carModExpanded: Ref<boolean[]> = ref(carMods.value.map(() => false));
const motorcycleModExpanded: Ref<boolean[]> = ref(motorcycleMods.value.map(() => false));
type ModDetails = Record<string, string>;
const carModDetails: Ref<ModDetails> = ref({});
const motorcycleModDetails: Ref<ModDetails> = ref({});
const isUploading = ref(false);
const uploadProgress = ref(0);
const toast = ref({ isOpen: false, message: "", color: "" });
const router = useRouter();
let imageURL = "";
const type = ref(""); // This will store the user's choice ('Car' or 'Motorcycle')
const make = ref("");
const model = ref("");
const year = ref<number | null>(null);
const description = ref("");

const selectOption = (vehicleType: string) => {
  selectedVehicleType.value = vehicleType;
};

const toggleCategory = (index: number, type: 'car' | 'motorcycle') => {
  if (type === 'car') {
    carModExpanded.value[index] = !carModExpanded.value[index];
  } else {
    motorcycleModExpanded.value[index] = !motorcycleModExpanded.value[index];
  }
};

const uploadImage = async (event: any) => {
  const imageFile = event.target.files[0];
  isUploading.value = true;
  if (!imageFile) { // no image uploaded
    toast.value = { isOpen: true, message: "You haven't uploaded an image!", color: "danger" };
    return;
  }

  try {
    const imageData = await uploadImageToFirebase(imageFile, 'vehicles', (progress: number) => {
      uploadProgress.value = progress;
    });
    imageURL = imageData.downloadURL;
    toast.value = { isOpen: true, message: "Successfully uploaded image!", color: "success" };
    isUploading.value = false;
  } catch (error: any) {
    toast.value = { isOpen: true, message: "Error while uploading image: " + error.message, color: "danger" };
    isUploading.value = false;
  }
};

const addVehicle = async () => {
  const user = firebaseAuth.currentUser;
  if (!user) {
    toast.value = { isOpen: true, message: "User is not authenticated.", color: "danger" };
    return;
  }

  try {
    // Validation
    if (!imageURL) throw new Error("Please upload an image for your vehicle.");
    if (!selectedVehicleType.value || !make.value || !model.value || !year.value) throw new Error("All fields are required.");
    if (isNaN(year.value)) throw new Error("Year must be a valid number.");

    // Database operations
    const userDocRef = doc(db, "users", user.uid);
    const vehiclesSubcollectionRef = collection(userDocRef, "vehicles");
    const docSnap = await getDoc(userDocRef);

    if (!docSnap.exists()) throw new Error("User data does not exist.");

    let carModsWithDetails = validateAndMapDetails(carModDetails.value);
    let motorcycleModsWithDetails = validateAndMapDetails(motorcycleModDetails.value);

    await addDoc(vehiclesSubcollectionRef, {
      userId: user.uid,
      type: selectedVehicleType.value.toLowerCase(),
      make: make.value,
      model: model.value,
      year: year.value,
      description: description.value,
      carMods: Object.fromEntries(carModsWithDetails),
      motorcycleMods: Object.fromEntries(motorcycleModsWithDetails),
      imageUrl: imageURL,
      timestamp: serverTimestamp(),
    });

    toast.value = { isOpen: true, message: "Vehicle added successfully!", color: "success" };
    router.go(-1);

  } catch (error) {
    console.error("Error adding vehicle:", error.message);
    toast.value = { isOpen: true, message: `Error adding vehicle: ${error.message}`, color: "danger" };
  }
};

const validateAndMapDetails = (details) => {
  let validDetailsMap = new Map();
  for (const [key, value] of Object.entries(details)) {
    if (value) { // Check if the input is not empty
      validDetailsMap.set(key, value);
    }
  }
  return validDetailsMap;
};

const goBack = () => {
  router.back();
};
</script>
