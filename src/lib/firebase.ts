import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

// CRITICAL: Firebase configuration - Replace with your actual values
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:demo",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-DEMO"
};

// Initialize Firebase only if we have valid configuration
let app = null;
let auth = null;
let db = null;
let storage = null;
let functions = null;

// Check if we have a valid API key
if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "demo-api-key") {
  try {
    // Initialize Firebase app first
    app = initializeApp(firebaseConfig);
    
    // Only initialize services if app was successfully created
    if (app) {
      auth = getAuth(app);
      db = getFirestore(app);
      storage = getStorage(app);
      functions = getFunctions(app);

      // Set persistence to LOCAL to keep user logged in
      if (auth) {
        auth.setPersistence('LOCAL');
      }

      // Enable offline persistence for Firestore
      if (db) {
        db.enablePersistence({ synchronizeTabs: true })
          .catch((err) => {
            if (err.code === 'failed-precondition') {
              // Multiple tabs open, persistence can only be enabled in one tab at a time
              console.warn('Multiple tabs open, persistence only enabled in one tab');
            } else if (err.code === 'unimplemented') {
              // The current browser does not support all of the features required to enable persistence
              console.warn('Persistence not supported in this browser');
            }
          });
      }

      console.log("✅ Firebase initialized successfully");
    } else {
      throw new Error("Failed to initialize Firebase app");
    }
  } catch (error) {
    console.error("❌ Firebase initialization failed:", error);
    
    // Reset all services to null on error
    app = null;
    auth = null;
    db = null;
    storage = null;
    functions = null;
  }
} else {
  console.warn("⚠️ Firebase not configured. Using demo mode with null services.");
  
  // Keep all services as null in demo mode
  app = null;
  auth = null;
  db = null;
  storage = null;
  functions = null;
}

export { auth, db, storage, functions };
export default app;