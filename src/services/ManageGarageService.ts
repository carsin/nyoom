import { MAX_DESCRIPTION_LENGTH } from "@/util/constants";
import { firebaseAuth, db, storage } from "@/firebase-service";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { ref as storageRef, deleteObject } from "firebase/storage";

class ManageGarageService {
  user: any;

  constructor(user: any) {
    this.user = user;
  }
  
  // Modify existing description
  async updateDescription(userId: string, vehicleId: string, newDescription: string, oldDescription: string) {
    if (newDescription === oldDescription) {
      return { success: false, message: "You have entered the same description!" };
    } else if (newDescription.length > MAX_DESCRIPTION_LENGTH) {
      return { success: false, message: "Description too long." };
    }
    console.log("Editing id: " + vehicleId);

    try {
      const vehicleRef = doc(db, 'users', userId, 'vehicles', vehicleId);
      const vehicleDoc = await getDoc(vehicleRef);
  
      if (vehicleDoc.exists()) {
        const vehicleData = vehicleDoc.data();
  
        if (this.user && vehicleData.userId === this.user.uid) {
          await updateDoc(vehicleRef, { description: newDescription });
          return { success: true, message: "Description edit confirmed!" };
        } else {
          return { success: false, message: "You are not authorized to edit this vehicle's description." };
        }
      } else {
        return { success: false, message: "Vehicle does not exist." };
      }
    } catch (error: any) {
      return { success: false, message: "Error while saving new description: " + error.message };
    }
  }

  async deleteVehicle(vehicleId: string, userId: string) {
    if (!this.user) {
      return { success: false, message: "Error: You are not signed in!" };
    }

    try {
      const vehicleRef = doc(db, 'users', userId, 'vehicles', vehicleId);
      const vehicleSnap = await getDoc(vehicleRef);

      if (!vehicleSnap.exists()) {
        return { success: false, message: "No such vehicle found!" };
      }

      const vehicleData = vehicleSnap.data();
      await deleteDoc(vehicleRef); // Delete the vehicle document
      
      const imageUrl = vehicleData.imageUrl;
      if (imageUrl) { // If there's an image URL, delete the file from storage
        const imageRef = storageRef(storage, imageUrl);
        await deleteObject(imageRef);
      }
      return { success: true, message: "Successfully deleted the vehicle. Good riddance!" };
    } catch (error: any) {
      return { success: false, message: "Error deleting vehicle: " + error.message };
    }
  }

  areMapsEqual(map1: Map<string, string>, map2: Map<string, string>) {
    // Check if map1 and map2 are actually Maps and not null
    if (!(map1 instanceof Map) || !(map2 instanceof Map)) {
      console.error('One or both arguments are not Maps:', map1, map2);
      return false;
    }
  
    if (map1.size !== map2.size) return false;
    for (let [key, val] of map1) {
      if (!map2.has(key) || map2.get(key) !== val) return false;
    }
    return true;
  }
  
  // Modify existing modifications
  async updateMods(userId: string, vehicleId: string, newMods: Map<string, string>, oldMods: Map<string, string>) {
    // Ensure newMods and oldMods are not null or undefined
    if (!newMods || !oldMods || !this.areMapsEqual(newMods, oldMods)) {
      return { success: false, message: "You have entered the same mods or invalid data!" };
    }

    try {
      const vehicleRef = doc(db, 'users', userId, 'vehicles', vehicleId);
      const vehicleDoc = await getDoc(vehicleRef);

      if (vehicleDoc.exists()) {
        const vehicleData = vehicleDoc.data();

        if (this.user && vehicleData.userId === this.user.uid) {
          // Convert Map to Object
          const modsObject = Object.fromEntries(newMods);
          await updateDoc(vehicleRef, { carMods: modsObject });
          return { success: true, message: "Modifications edit confirmed!" };
        } else {
          return { success: false, message: "You are not authorized to edit this vehicle's modifications." };
        }
      } else {
        return { success: false, message: "Vehicle does not exist." };
      }
    } catch (error: any) {
      return { success: false, message: "Error while saving new modifications: " + error.message };
    }
  }
}

export const garageManager = new ManageGarageService(firebaseAuth.currentUser);