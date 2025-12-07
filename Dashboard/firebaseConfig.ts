// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBgxBYXu5dhRbkT3CP6wk1bl1RZpl5THlM",
  authDomain: "embedded-system-e1d18.firebaseapp.com",
  databaseURL: "https://embedded-system-e1d18-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "embedded-system-e1d18",
  storageBucket: "embedded-system-e1d18.firebasestorage.app",
  messagingSenderId: "37826992126",
  appId: "1:37826992126:web:f768b87a7cbeadfd0292af"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
