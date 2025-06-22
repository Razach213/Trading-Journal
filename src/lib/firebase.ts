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
let app;
let auth;
let db;
let storage;
let functions;

try {
  // Check if we have a valid API key
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey === "demo-api-key") {
    console.warn("⚠️ Firebase not configured. Using demo mode.");
    throw new Error("Firebase configuration missing");
  }

  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  functions = getFunctions(app);

  console.log("✅ Firebase initialized successfully");
} catch (error) {
  console.warn("⚠️ Firebase initialization failed, using demo mode:", error);
  
  // Create safe mock objects for demo mode
  auth = {
    currentUser: null,
    onAuthStateChanged: () => () => {},
    signInWithEmailAndPassword: () => Promise.reject(new Error("Demo mode")),
    createUserWithEmailAndPassword: () => Promise.reject(new Error("Demo mode")),
    signInWithPopup: () => Promise.reject(new Error("Demo mode")),
    signOut: () => Promise.reject(new Error("Demo mode"))
  } as any;

  db = null as any;
  storage = null as any;
  functions = null as any;
}

export { auth, db, storage, functions };
export default app;