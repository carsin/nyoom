import { firebaseAuth, db } from "../firebase-service";
import { doc, getDoc, DocumentData } from "firebase/firestore";

class UserInfoService {
  async getCurrentUserUsername(): Promise<string | null> {
    const user = firebaseAuth.currentUser;
    if (!user) return '';

    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      return userDocSnap.data().username;
    } else {
      console.error('User document not found');
      return '';
    }
  }
  
  async fetchUserData(uid: string): Promise<DocumentData | null> {
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      return userDocSnap.data();
    } else {
      console.error('User document not found');
      return null;
    }
  }
}

export const userInfoService = new UserInfoService();
