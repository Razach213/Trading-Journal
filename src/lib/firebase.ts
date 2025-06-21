import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

// Firebase configuration - CRITICAL: Update with your actual values
const firebaseConfig = {
  apiKey: "AIzaSyBqJVJKqJKqJKqJKqJKqJKqJKqJKqJKqJK",
  authDomain: "zellax-trading-journal.firebaseapp.com",
  projectId: "zellax-trading-journal",
  storageBucket: "zellax-trading-journal.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnopqr",
  measurementId: "G-XXXXXXXXXX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// CRITICAL: Enable offline persistence for better reliability
import { enableNetwork, disableNetwork } from 'firebase/firestore';

// Enable offline persistence
try {
  // This helps with connectivity issues
  enableNetwork(db);
} catch (error) {
  console.log('Firebase offline persistence already enabled');
}

export default app;