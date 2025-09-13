// Import Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA_K1jqatASvaOm8jeOF1aLPsO4QNhqtAI",
  authDomain: "hackathons-2e810.firebaseapp.com",
  projectId: "hackathons-2e810",
  storageBucket: "hackathons-2e810.appspot.com", // ✅ small fix: should be .appspot.com
  messagingSenderId: "360398512799",
  appId: "1:360398512799:web:acd708d146f6613618f8aa",
  measurementId: "G-85DQPV0KH0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
export const auth = getAuth(app);
export const db = getFirestore(app);
