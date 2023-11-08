import { MAX_BIO_LENGTH } from "../util/constants"
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { firebaseAuth, db, storage } from "../firebase-service";
import { uploadImageToFirebase } from '../util/uploadImage';

class ManageProfileService {
  user: any;
  
  constructor(user: any) {
    this.user = user;
  }
  
  async updateBiography(newBiography: string) {
    if (!this.user || newBiography.length > MAX_BIO_LENGTH) {
      return { success: false, message: "Error: Biography too long, or you are not signed in!" };
    }

    try {
      // Update the biography in the Firestore database
      const userDocRef = doc(db, 'users', this.user.uid);
      await updateDoc(userDocRef, {
        biography: newBiography.trim()
      });

      return { success: true, message: "Biography updated successfully!" };
    } catch (error: any) {
      return { success: false, message: "Error occurred while editing bio: " + error.message};
    }
  }

  async updateAvatar(file: any, updateProgressCallback: (progress: number) => void) {
    try {
    // First, get the current user's document to find the existing avatarPath
    const userDocRef = doc(db, 'users', this.user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      if (userData.avatarPath) {
        console.log("deleting old avatar from storage");
        const oldAvatarRef = ref(storage, userData.avatarPath);
        await deleteObject(oldAvatarRef);
        console.log("deleted!");
      }
    }
      const newAvatarUrl = await uploadImageToFirebase(file, 'avatars', updateProgressCallback);
      
      if (this.user) {
        // change url in database
        const userDocRef = doc(db, 'users', this.user.uid);
        await updateDoc(userDocRef, {
          avatarUrl: newAvatarUrl.downloadURL,
          avatarPath: newAvatarUrl.imagePath
        });
        return { avatarUrl: newAvatarUrl.downloadURL, success: true, message: "Successfully uploaded avatar!"};
      }
      
    } catch (error: any) {
      return { avatarUrl: "", success: false, message: "An error occurred: " + error.message};
    }
    return { avatarUrl: "", success: false, message: "An error occurred while uploading avatar."};
  }
}

export const profileManager = new ManageProfileService(firebaseAuth.currentUser);
