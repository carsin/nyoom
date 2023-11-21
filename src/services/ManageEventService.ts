import { doc, collection, query, orderBy, getDocs, getDoc, addDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { ref as storageRef, deleteObject } from "firebase/storage"
import { firebaseAuth, db, storage } from "../firebase-service";
import { MAX_CAPTION_LENGTH } from "../util/constants";


class ManageEventService {
  user: any;

  constructor(user: any) {
    this.user = user;
  }

  async deleteEvent(postId: string) {
    if (!this.user) {
      return { success: false, message: "Error: You are not signed in!" };
    }

    try {
      const eventRef = doc(db, 'events', postId);
      const eventSnap = await getDoc(eventRef);

      if (!eventSnap.exists()) {
        return { success: false, message: "No such event found!" };
      }

      const eventData = eventSnap.data();
      await deleteDoc(eventRef); // delete the post document
      
      const imageUrl = eventData.imageUrl;
      if (imageUrl) { // if there's an image URL, delete the file from storage
        const imageRef = storageRef(storage, imageUrl);
        await deleteObject(imageRef);
      }
      return { success: true, message: "Successfully deleted the event. Good riddance!" };
    } catch (error: any) {
      return { success: false, message: "Error deleting event: " + error.message };
    }
  }
}

export const eventManager = new ManageEventService(firebaseAuth.currentUser);