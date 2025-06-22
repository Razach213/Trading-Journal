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

// Check if we have valid Firebase configuration
const hasValidConfig = firebaseConfig.apiKey && 
                      firebaseConfig.apiKey !== "demo-api-key" &&
                      firebaseConfig.projectId && 
                      firebaseConfig.projectId !== "demo-project" &&
                      !firebaseConfig.apiKey.includes("your-") &&
                      !firebaseConfig.projectId.includes("your-");

// Initialize Firebase only if we have valid configuration
let app = null;
let auth = null;
let db = null;
let storage = null;
let functions = null;

if (hasValidConfig) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    functions = getFunctions(app);
    console.log("✅ Firebase initialized successfully");
  } catch (error) {
    console.warn("⚠️ Firebase initialization failed:", error);
    // Fall back to demo mode
    app = null;
    auth = null;
    db = null;
    storage = null;
    functions = null;
  }
} else {
  console.warn("⚠️ Firebase not configured properly. Using demo mode.");
  console.warn("📝 To fix this:");
  console.warn("1. Go to Firebase Console → Project Settings");
  console.warn("2. Copy your config values to .env file");
  console.warn("3. Restart the development server");
}

// Create safe mock objects for demo mode when Firebase is not configured
if (!auth) {
  auth = {
    currentUser: null,
    onAuthStateChanged: (callback) => {
      // Call callback immediately with null user for demo mode
      setTimeout(() => callback(null), 0);
      return () => {}; // Return unsubscribe function
    },
    signInWithEmailAndPassword: () => Promise.reject(new Error("Firebase not configured - Demo mode active")),
    createUserWithEmailAndPassword: () => Promise.reject(new Error("Firebase not configured - Demo mode active")),
    signInWithPopup: () => Promise.reject(new Error("Firebase not configured - Demo mode active")),
    signOut: () => Promise.reject(new Error("Firebase not configured - Demo mode active"))
  };
}

// Export the configuration status for other components to check
export const isFirebaseConfigured = hasValidConfig;
export const isDemoMode = !hasValidConfig;

export { auth, db, storage, functions };
export default app;