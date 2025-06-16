
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// Replace these values with your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBm794CxOJJJuHbZ6J_CVzrzMR-jH36U3s",
  authDomain: "gasagencysystem-75013.firebaseapp.com",
  projectId: "gasagencysystem-75013",
  storageBucket: "gasagencysystem-75013.firebasestorage.app",
  messagingSenderId: "543710409104",
  appId: "1:543710409104:web:8e09584e09e1018ff24315"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
