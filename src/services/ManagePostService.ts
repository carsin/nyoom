import {
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { ref as storageRef, deleteObject } from "firebase/storage"
import { firebaseAuth, db, storage } from "../firebase-service";
import { MAX_CAPTION_LENGTH } from "../util/constants"

// helper function for handleVote to ensure up/downvote exclusivity & singularity
// returns true if vote was added and false if vote was removed
type UpdatesType = {
  [key: string]: number;
};
const toggleVote = ( gId: string, voters: string[], otherVoters: string[], countKey: string, otherCountKey: string, updates: UpdatesType): boolean => {
  if (voters.includes(gId)) {
    voters.splice(voters.indexOf(gId), 1);
    updates[countKey]--;
    return false; // vote removed
  } else {
    voters.push(gId);
    updates[countKey]++;
    if (otherVoters.includes(gId)) {
      otherVoters.splice(otherVoters.indexOf(gId), 1);
      updates[otherCountKey]--;
    }
    return true; // vote added
  }
};

class ManagePostService {
  user: any;
  
  constructor(user: any) {
    this.user = user;
  }
  
  async updateCaption(postId: string, newCaption: string, oldCaption: string) {
    if (newCaption === oldCaption) {
      return { success: false, message: "You have entered the same caption!" };
    } else if (newCaption.length > MAX_CAPTION_LENGTH) {
      return { success: false, message: "Caption too long." };
    }

    try {
      const postRef = doc(db, 'posts', postId);
      const postDoc = await getDoc(postRef);

      if (postDoc.exists()) {
        const postData = postDoc.data();

        if (this.user && postData.userId === this.user.uid) {
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

  async sendVote(postId: string, isUpvote: boolean) {
    const postRef = doc(db, 'posts', postId);
    let isNewVote = false;

    if (!this.user) { // handle case where the user is not logged in
      return { success: false, message: "Error: You are not logged !" };
    }

    try {
      const userId = this.user.uid;
      const postDoc = await getDoc(postRef);

      if (postDoc.exists()) {
        const postData = postDoc.data();
        const updates = {
          upvoters: postData.upvoters || [],
          downvoters: postData.downvoters || [],
          upvoteCount: postData.upvoteCount || 0,
          downvoteCount: postData.downvoteCount || 0,
        };

        if (isUpvote) {
          isNewVote = toggleVote(userId, updates.upvoters, updates.downvoters, 'upvoteCount', 'downvoteCount', updates);
        } else {
          isNewVote = toggleVote(userId, updates.downvoters, updates.upvoters, 'downvoteCount', 'upvoteCount', updates);
        }

        await updateDoc(postRef, updates);
        const message = isUpvote ? "Changed upvote on post!" : "Changed downvote on post!";
        return { success: true, message, isNewVote };
      };
    } catch (error: any) {
      return { success: false, message: "Error voting on post: " + error.message, isNewVote };
    }
    return { success: false, message: "An unknown error occurred while voting."};
  }

  async deletePost(postId: string) {
    if (!this.user) {
      return { success: false, message: "Error: You are not signed in!" };
    }
    
    try {
      const postRef = doc(db, 'posts', postId);
      const postSnap = await getDoc(postRef);
      
      if (!postSnap.exists()) {
        return { success: false, message: "No such post found!" };
      }

      const postData = postSnap.data();
      const imageUrl = postData.imageUrl;
      
      // Delete the post document
      await deleteDoc(postRef);

      // If there's an image URL, delete the file from storage
      if (imageUrl) {
        const imageRef = storageRef(storage, imageUrl); // Replace with the correct path if necessary
        await deleteObject(imageRef);
      }
      return { success: true, message: "Successfully deleted the post. Good riddance!" };
    } catch (error: any) {
      return { success: false, message: "Error deleting post: " + error.message };
    }
  }
}

export const postManager = new ManagePostService(firebaseAuth.currentUser);
