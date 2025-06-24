import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

// CRITICAL: Firebase configuration - Get values from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase only if we have valid configuration
let app = null;
let auth = null;
let db = null;
let storage = null;
let functions = null;

try {
  // Check if we have a valid API key
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey === "your-firebase-api-key-here") {
    console.warn("⚠️ Firebase not configured. Using demo mode.");
    throw new Error("Firebase configuration missing");
  }

  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  functions = getFunctions(app);

  // Enable emulators if in development mode
  if (import.meta.env.VITE_ENABLE_EMULATORS === 'true') {
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectStorageEmulator(storage, 'localhost', 9199);
    connectFunctionsEmulator(functions, 'localhost', 5001);
    console.log("✅ Firebase emulators connected");
  }

  console.log("✅ Firebase initialized successfully");
} catch (error) {
  console.warn("⚠️ Firebase initialization failed, using demo mode:", error);
  
  // Create safe mock objects for demo mode
  auth = {
    currentUser: null,
    onAuthStateChanged: (callback) => {
      // Call callback immediately with null user
      setTimeout(() => callback(null), 0);
      return () => {}; // Return unsubscribe function
    },
    signInWithEmailAndPassword: () => Promise.reject(new Error("Demo mode")),
    createUserWithEmailAndPassword: () => Promise.reject(new Error("Demo mode")),
    signInWithPopup: () => Promise.reject(new Error("Demo mode")),
    signOut: () => Promise.reject(new Error("Demo mode"))
  };

  db = null;
  storage = null;
  functions = null;
}

export { auth, db, storage, functions };
export default app;