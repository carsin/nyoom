import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from "../firebase-service"; 

// upload image to firebase storage and return URL
export const uploadImageToFirebase = async (
  file: File,
  directory: string,
  onProgress: (progress: number) => void
) => {
  const storageReference = storageRef(storage, `${directory}/${file.name}`);
  const metadata = {
    cacheControl: 'public,max-age=86400', // cache for 1 day
  };
  const uploadTask = uploadBytesResumable(storageReference, file, metadata);

  return new Promise<{ downloadURL: string, imagePath: string }>((resolve, reject) => {
    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(progress);
      }, 
      (error) => {
        reject(new Error('Upload failed: ' + error.message));
      }, 
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve({
            downloadURL,
            imagePath: `${directory}/${file.name}` // include the directory and file name as the imagePath
          });
        });
      }
    );
  });
};
