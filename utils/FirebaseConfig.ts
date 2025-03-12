import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDyTVbP1LEPppYiLsaxkmZg5rX-cbPT6ZI",
  authDomain: "chatgpt-2025.firebaseapp.com",
  projectId: "chatgpt-2025",
  storageBucket: "chatgpt-2025.firebasestorage.app",
  messagingSenderId: "669963224888",
  appId: "1:669963224888:web:250218db4c279ebd5023cd",
  measurementId: "G-M8WY2BGHVX"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
