import { deleteDoc, doc, updateDoc, } from "firebase/firestore";
import { ref as storageRef, deleteObject } from "firebase/storage";
import { firebaseAuth, db, storage } from "../firebase-service";

class ManagePartService {
  user: any;

  constructor(user: any) {
    this.user = user;
  }

  async updateListing(partId: string, updatedFields: Record<string, any>) {
    try {
      const partRef = doc(db, "parts", partId);
      const partDoc = await getDoc(partRef);

      if (partDoc.exists()) {
        const partData = partDoc.data();

        if (this.user && partData.userId === this.user.uid) {
          await updateDoc(partRef, updatedFields);
          return { success: true, message: "Listing updated successfully!" };
        } else {
          return {
            success: false,
            message: "You are not the owner of this listing.",
          };
        }
      } else {
        return { success: false, message: "Listing does not exist." };
      }
    } catch (error: any) {
      return {
        success: false,
        message: "Error while updating the listing: " + error.message,
      };
    }
  }

  async deletePart(partId: string) {
    if (!this.user) {
      return { success: false, message: "Error: You are not signed in!" };
    }

    try {
      const partRef = doc(db, "parts", partId);
      const partSnap = await getDoc(partRef);

      if (!partSnap.exists()) {
        return { success: false, message: "No such post found!" };
      }

      const partData = partSnap.data();
      const imageUrl = partData.imageUrl;

      await deleteDoc(partRef); // delete the part document

      if (imageUrl) {
        // if there's an image URL, delete the file from storage
        const imageRef = storageRef(storage, imageUrl);
        await deleteObject(imageRef);
      }
      return {
        success: true,
        message: "Successfully deleted the post. Good riddance!",
      };
    } catch (error: any) {
      return {
        success: false,
        message: "Error deleting post: " + error.message,
      };
    }
  }
}

export const partManager = new ManagePartService(firebaseAuth.currentUser);
