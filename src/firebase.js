// firebase.js
// This file connects our React app to the Firebase backend.

// 1. Import functions from the Firebase SDK
// 1. Import functions from the Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// 2. Define the configuration using the provided credentials
// Hardcoding these ensures they work in deployment without needing separate environment variable configuration on Vercel
const firebaseConfig = {
    apiKey: "AIzaSyCAWyIcDcofJyVhpPjT2IT6rCpwD0iNUMU",
    authDomain: "smartissues-5b343.firebaseapp.com",
    projectId: "smartissues-5b343",
    storageBucket: "smartissues-5b343.firebasestorage.app",
    messagingSenderId: "78357043378",
    appId: "1:78357043378:web:8a5599af754664613291ab",
    measurementId: "G-RC6HBH8Q00"
};

// 3. Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// 4. Export the services we need
// Auth: For signing up and logging in users
// Firestore: The database where we will store issues
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;

