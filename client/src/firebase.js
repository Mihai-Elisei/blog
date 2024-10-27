// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blog-40103.firebaseapp.com",
  projectId: "blog-40103",
  storageBucket: "blog-40103.appspot.com",
  messagingSenderId: "861047914924",
  appId: "1:861047914924:web:5b5651d0a0544d69543a09"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);