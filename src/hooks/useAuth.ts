import { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  getIdToken
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { User } from '../types';
import toast from 'react-hot-toast';

// Demo mode flag
const isDemoMode = !auth || !db;

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (isDemoMode) {
      console.warn("🔧 Running in demo mode - Firebase not configured");
      
      // Load demo user from localStorage if exists
      const savedDemoUser = localStorage.getItem('demoUser');
      if (savedDemoUser) {
        try {
          const demoUser = JSON.parse(savedDemoUser);
          setUser(demoUser);
          
          // Set a fake auth token for demo mode
          localStorage.setItem('authToken', 'demo-token-' + Date.now());
        } catch (error) {
          console.error('Error loading demo user:', error);
          localStorage.removeItem('demoUser');
        }
      }
      setLoading(false);
      return;
    }

    // Only set up auth listener if auth is available
    if (!auth) {
      setAuthError("Firebase authentication not initialized. Please check your configuration.");
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Set auth token in localStorage
          try {
            const token = await firebaseUser.getIdToken(true); // Force refresh token
            localStorage.setItem('authToken', token);
          } catch (tokenError) {
            console.error("Error getting auth token:", tokenError);
            // Don't throw here, continue with user data
          }
          
          const userData = await getUserData(firebaseUser);
          setUser(userData);
          setAuthError(null);
        } else {
          setUser(null);
          localStorage.removeItem('authToken');
        }
      } catch (error: any) {
        console.error("Auth state change error:", error);
        setAuthError(error.message || "Authentication error");
        setUser(null);
        localStorage.removeItem('authToken');
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
        const data = userDoc.data();
        return {
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: data.displayName || firebaseUser.displayName || 'User',
          photoURL: data.photoURL || firebaseUser.photoURL || undefined,
          plan: data.plan || 'free',
          accountBalance: data.accountBalance || 0,
          currentBalance: data.currentBalance || 0,
          createdAt: data.createdAt?.toDate() || new Date(),
          subscription: data.subscription || undefined
        };
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
        
        await setDoc(doc(db, 'users', firebaseUser.uid), {
          ...newUser,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        return newUser;
      }
    } catch (error) {
      console.error("Error getting user data:", error);
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

  // Demo mode functions
  const createDemoUser = (email: string, displayName: string): User => {
    return {
      id: 'demo-user-' + Date.now(),
      email,
      displayName,
      plan: 'free',
      accountBalance: 10000,
      currentBalance: 10000,
      createdAt: new Date()
    };
  };

  const signIn = async (email: string, password: string) => {
    try {
      setAuthError(null);
      
      if (isDemoMode) {
        // Demo mode - simulate successful login
        const demoUser = createDemoUser(email, 'Demo User');
        setUser(demoUser);
        localStorage.setItem('demoUser', JSON.stringify(demoUser));
        localStorage.setItem('authToken', 'demo-token-' + Date.now());
        toast.success('✅ Signed in successfully (Demo Mode)');
        return;
      }
      
      if (!auth) {
        throw new Error("Auth not initialized");
      }
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Force refresh the token to ensure it's up to date
      const token = await userCredential.user.getIdToken(true);
      localStorage.setItem('authToken', token);
      
      toast.success('Successfully signed in!');
    } catch (error: any) {
      console.error("Sign in error:", error);
      
      if (isDemoMode) {
        toast.error("⚠️ Demo Mode: Authentication simulation failed");
      } else {
        setAuthError(error.message || "Failed to sign in");
        toast.error(error.message || "Failed to sign in");
      }
      throw error;
    }
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      setAuthError(null);
      
      if (isDemoMode) {
        // Demo mode - simulate successful signup
        const demoUser = createDemoUser(email, displayName);
        setUser(demoUser);
        localStorage.setItem('demoUser', JSON.stringify(demoUser));
        localStorage.setItem('authToken', 'demo-token-' + Date.now());
        toast.success('✅ Account created successfully (Demo Mode)');
        return;
      }

      if (!auth || !db) {
        throw new Error("Firebase not initialized");
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
      
      await setDoc(doc(db, 'users', result.user.uid), {
        ...newUser,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // Set auth token
      const token = await result.user.getIdToken(true);
      localStorage.setItem('authToken', token);
      
      toast.success('Account created successfully!');
    } catch (error: any) {
      console.error("Sign up error:", error);
      
      if (isDemoMode) {
        toast.error("⚠️ Demo Mode: Account creation simulation failed");
      } else {
        setAuthError(error.message || "Failed to create account");
        toast.error(error.message || "Failed to create account");
      }
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      setAuthError(null);
      
      if (isDemoMode) {
        // Demo mode - simulate Google sign in
        const demoUser = createDemoUser('demo@google.com', 'Google Demo User');
        setUser(demoUser);
        localStorage.setItem('demoUser', JSON.stringify(demoUser));
        localStorage.setItem('authToken', 'demo-token-' + Date.now());
        toast.success('✅ Signed in with Google (Demo Mode)');
        return;
      }

      if (!auth) {
        throw new Error("Auth not initialized");
      }

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Force refresh the token to ensure it's up to date
      const token = await result.user.getIdToken(true);
      localStorage.setItem('authToken', token);
      
      toast.success('Successfully signed in with Google!');
    } catch (error: any) {
      console.error("Google sign in error:", error);
      
      if (isDemoMode) {
        toast.error("⚠️ Demo Mode: Google sign in simulation failed");
      } else {
        setAuthError(error.message || "Failed to sign in with Google");
        toast.error(error.message || "Failed to sign in with Google");
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      setAuthError(null);
      
      if (isDemoMode) {
        // Demo mode - clear demo user
        setUser(null);
        localStorage.removeItem('demoUser');
        localStorage.removeItem('authToken');
        toast.success('✅ Signed out successfully (Demo Mode)');
        return;
      }

      if (!auth) {
        throw new Error("Auth not initialized");
      }

      await signOut(auth);
      localStorage.removeItem('authToken');
      toast.success('Successfully signed out!');
    } catch (error: any) {
      console.error("Logout error:", error);
      setAuthError(error.message || "Failed to sign out");
      toast.error(error.message || "Failed to sign out");
    }
  };

  // Function to refresh the auth token
  const refreshToken = async () => {
    try {
      if (isDemoMode) {
        // In demo mode, just create a new fake token
        const token = 'demo-token-' + Date.now();
        localStorage.setItem('authToken', token);
        return token;
      }
      
      if (!auth || !auth.currentUser) {
        throw new Error("Not authenticated");
      }
      
      const token = await auth.currentUser.getIdToken(true);
      localStorage.setItem('authToken', token);
      return token;
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw error;
    }
  };

  // Function to check if token is valid and refresh if needed
  const validateToken = async (): Promise<boolean> => {
    try {
      if (isDemoMode) return true;
      
      const token = localStorage.getItem('authToken');
      if (!token) return false;
      
      if (!auth || !auth.currentUser) return false;
      
      // Refresh token to ensure it's valid
      await refreshToken();
      return true;
    } catch (error) {
      console.error("Token validation error:", error);
      return false;
    }
  };

  return {
    user,
    loading,
    authError,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    refreshToken,
    validateToken,
    isDemoMode
  };
};