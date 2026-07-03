import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration using environment variables with local fallbacks
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBx9SnDnR_JQUItvFmo6wiy0DdaZrlVq3I",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "church-cardiff.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "church-cardiff",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "church-cardiff.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "155111407031",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:155111407031:web:697ff613d85e306b643c32"
};

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
export default app;
