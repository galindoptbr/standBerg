import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA8FpdkZfpxSNAOmt7HbDwB8AguBNnA61U",
  authDomain: "standberg-d9413.firebaseapp.com",
  projectId: "standberg-d9413",
  storageBucket: "standberg-d9413.firebasestorage.app",
  messagingSenderId: "891745724837",
  appId: "1:891745724837:web:780d3b0b5be3bf5067a04c",
  measurementId: "G-1VKMZXHT3V",
};

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);

// Exportando instâncias do Firestore e Storage
export const db = getFirestore(app);
export const storage = getStorage(app);
