// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA6y-qwrJ_EZyeIv-toVV6xg72oDLVOCVQ",
  authDomain: "country-capital-quiz-fb04b.firebaseapp.com",
  projectId: "country-capital-quiz-fb04b",
  storageBucket: "country-capital-quiz-fb04b.firebasestorage.app",
  messagingSenderId: "642080487904",
  appId: "1:642080487904:web:d24f635baf2b4f21561385",
  measurementId: "G-ME66E6XBL7",
};

const app = initializeApp(firebaseConfig);
const db: Firestore = getFirestore(app);
const analytics = getAnalytics(app);

export { db };
