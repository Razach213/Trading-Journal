import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

// Validate required environment variables
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);
if (missingVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validate that we don't have placeholder values
const placeholderValues = ['your_actual_api_key_here', 'your-project-id', 'your_actual_sender_id', 'your_actual_app_id'];
const hasPlaceholders = Object.values(firebaseConfig).some(value => 
  placeholderValues.some(placeholder => value?.includes(placeholder))
);

if (hasPlaceholders) {
  throw new Error('Firebase configuration contains placeholder values. Please update your .env file with actual Firebase project credentials.');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// Connect to emulators in development (only if explicitly enabled)
if (import.meta.env.DEV && import.meta.env.VITE_ENABLE_EMULATORS === 'true') {
  try {
    // Check if emulators are not already connected
    if (!auth.emulatorConfig) {
      connectAuthEmulator(auth, `http://localhost:${import.meta.env.VITE_EMULATOR_AUTH_PORT || 9099}`);
    }
    
    // Only connect to Firestore emulator if not already connected
    if (!db._delegate._databaseId.projectId.includes('demo-')) {
      connectFirestoreEmulator(db, 'localhost', parseInt(import.meta.env.VITE_EMULATOR_FIRESTORE_PORT || '8080'));
    }
    
    // Only connect to Storage emulator if not already connected
    if (!storage._delegate._host.includes('localhost')) {
      connectStorageEmulator(storage, 'localhost', parseInt(import.meta.env.VITE_EMULATOR_STORAGE_PORT || '9199'));
    }
    
    // Only connect to Functions emulator if not already connected
    if (!functions._delegate._url.includes('localhost')) {
      connectFunctionsEmulator(functions, 'localhost', parseInt(import.meta.env.VITE_EMULATOR_FUNCTIONS_PORT || '5001'));
    }
    
    console.log('Connected to Firebase emulators');
  } catch (error) {
    console.log('Emulators already connected or not available:', error);
  }
} else {
  console.log('Using live Firebase services');
}

export default app;