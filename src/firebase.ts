// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import firebaseConfig from "./firebaseConfig"; // Adjust the path to your firebaseConfig file


const app = initializeApp(firebaseConfig);
const db: Firestore = getFirestore(app);
const analytics = getAnalytics(app);

export { db };
