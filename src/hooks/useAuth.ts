import { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { User } from '../types';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if Firebase is properly configured
    if (!auth || typeof auth.onAuthStateChanged !== 'function') {
      console.warn("Firebase Auth not available, using demo mode");
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userData = await getUserData(firebaseUser);
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth state change error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const getUserData = async (firebaseUser: FirebaseUser): Promise<User> => {
    try {
      if (!db) {
        throw new Error("Firestore not available");
      }

      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (userDoc.exists()) {
        return userDoc.data() as User;
      } else {
        const newUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName || 'User',
          photoURL: firebaseUser.photoURL || undefined,
          plan: 'free',
          accountBalance: 0,
          currentBalance: 0,
          createdAt: new Date()
        };
        
        await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
        return newUser;
      }
    } catch (error) {
      console.error("Error getting user data:", error);
      // Return a basic user object if database fails
      return {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        displayName: firebaseUser.displayName || 'User',
        plan: 'free',
        accountBalance: 0,
        currentBalance: 0,
        createdAt: new Date()
      };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      if (!auth || typeof auth.signInWithEmailAndPassword !== 'function') {
        throw new Error("Firebase Auth not configured. Please check your Firebase setup.");
      }
      
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Successfully signed in!');
    } catch (error: any) {
      console.error("Sign in error:", error);
      
      if (error.message.includes("Firebase Auth not configured")) {
        toast.error("Authentication service not available. Please check Firebase configuration.");
      } else {
        toast.error(error.message || "Failed to sign in");
      }
      throw error;
    }
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      if (!auth || typeof auth.createUserWithEmailAndPassword !== 'function') {
        throw new Error("Firebase Auth not configured. Please check your Firebase setup.");
      }

      const result = await createUserWithEmailAndPassword(auth, email, password);
      const newUser: User = {
        id: result.user.uid,
        email: result.user.email!,
        displayName,
        plan: 'free',
        accountBalance: 0,
        currentBalance: 0,
        createdAt: new Date()
      };
      
      if (db) {
        await setDoc(doc(db, 'users', result.user.uid), newUser);
      }
      
      toast.success('Account created successfully!');
    } catch (error: any) {
      console.error("Sign up error:", error);
      
      if (error.message.includes("Firebase Auth not configured")) {
        toast.error("Authentication service not available. Please check Firebase configuration.");
      } else {
        toast.error(error.message || "Failed to create account");
      }
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      if (!auth || typeof auth.signInWithPopup !== 'function') {
        throw new Error("Firebase Auth not configured. Please check your Firebase setup.");
      }

      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success('Successfully signed in with Google!');
    } catch (error: any) {
      console.error("Google sign in error:", error);
      
      if (error.message.includes("Firebase Auth not configured")) {
        toast.error("Authentication service not available. Please check Firebase configuration.");
      } else {
        toast.error(error.message || "Failed to sign in with Google");
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (!auth || typeof auth.signOut !== 'function') {
        throw new Error("Firebase Auth not configured");
      }

      await signOut(auth);
      toast.success('Successfully signed out!');
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error(error.message || "Failed to sign out");
    }
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout
  };
};