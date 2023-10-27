import {
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { firebaseAuth, db } from "../firebase-service";
import {  MAX_CAPTION_LENGTH } from "../util/constants"

class ManagePostService {
  async updateCaption(imageId: string, newCaption: string, oldCaption: string) {
    if (newCaption === oldCaption) {
      return { success: false, message: "You have entered the same caption!" };
    } else if (newCaption.length > MAX_CAPTION_LENGTH) {
      return { success: false, message: "Caption too long." };
    }

    try {
      const postRef = doc(db, 'posts', imageId);
      const postDoc = await getDoc(postRef);

      if (postDoc.exists()) {
        const postData = postDoc.data();
        const currentUser = firebaseAuth.currentUser;

        if (currentUser && postData.userId === currentUser.uid) {
          await updateDoc(postRef, { caption: newCaption });
          return { success: true, message: "Caption edit confirmed!" };
        } else {
          return { success: false, message: "You are not the owner of this post." };
        }
      } else {
        return { success: false, message: "Post does not exist." };
      }
    } catch (error: any) {
      return { success: false, message: "Error while saving new caption: " + error.message };
    }
  }
}

export const postManager = new ManagePostService();
