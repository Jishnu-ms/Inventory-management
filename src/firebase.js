// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth"; // ✅ Import Auth

const firebaseConfig = {
  apiKey: "AIzaSyCOd19Dmm7wwwByHFfiHKfQt80I0zU9b-o",
  authDomain: "billing-6129a.firebaseapp.com",
  projectId: "billing-6129a",
  storageBucket: "billing-6129a.appspot.com",
  messagingSenderId: "936096873591",
  appId: "1:936096873591:web:20f1a0717c010c0054da72"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore, Storage & Auth instances
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app); // ✅ Create Auth instance

export { db, storage, auth }; // ✅ Export Auth
