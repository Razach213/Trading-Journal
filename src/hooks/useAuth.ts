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
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { User } from '../types';
import toast from 'react-hot-toast';

// Demo mode flag
const isDemoMode = !auth || !db || typeof auth.onAuthStateChanged !== 'function';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDemoMode) {
      console.warn("🔧 Running in demo mode - Firebase not configured");
      
      // Load demo user from localStorage if exists
      const savedDemoUser = localStorage.getItem('demoUser');
      if (savedDemoUser) {
        try {
          const demoUser = JSON.parse(savedDemoUser);
          setUser(demoUser);
        } catch (error) {
          console.error('Error loading demo user:', error);
          localStorage.removeItem('demoUser');
        }
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userData = await getUserData(firebaseUser);
          
          // Check if subscription has expired
          if (userData.subscription && userData.subscription.expiresAt) {
            const expiryDate = new Date(userData.subscription.expiresAt);
            const now = new Date();
            
            if (now > expiryDate && userData.subscription.status === 'active') {
              // Subscription has expired, update user data
              await updateDoc(doc(db, 'users', firebaseUser.uid), {
                plan: 'free',
                'subscription.status': 'expired',
                updatedAt: serverTimestamp()
              });
              
              // Update local user data
              userData.plan = 'free';
              if (userData.subscription) {
                userData.subscription.status = 'expired';
              }
              
              // Notify user
              toast.error('Your subscription has expired. Please renew to access premium features.');
            }
          }
          
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
          subscription: data.subscription ? {
            plan: data.subscription.plan || 'pro',
            status: data.subscription.status || 'active',
            startedAt: data.subscription.startedAt?.toDate() || new Date(),
            expiresAt: data.subscription.expiresAt?.toDate() || new Date(),
            isYearly: data.subscription.isYearly || false
          } : undefined
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
      if (isDemoMode) {
        // Demo mode - simulate successful login
        const demoUser = createDemoUser(email, 'Demo User');
        setUser(demoUser);
        localStorage.setItem('demoUser', JSON.stringify(demoUser));
        toast.success('✅ Signed in successfully (Demo Mode)');
        return;
      }
      
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Successfully signed in!');
    } catch (error: any) {
      console.error("Sign in error:", error);
      
      if (isDemoMode) {
        toast.error("⚠️ Demo Mode: Authentication simulation failed");
      } else {
        toast.error(error.message || "Failed to sign in");
      }
      throw error;
    }
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      if (isDemoMode) {
        // Demo mode - simulate successful signup
        const demoUser = createDemoUser(email, displayName);
        setUser(demoUser);
        localStorage.setItem('demoUser', JSON.stringify(demoUser));
        toast.success('✅ Account created successfully (Demo Mode)');
        return;
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
        await setDoc(doc(db, 'users', result.user.uid), {
          ...newUser,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      
      toast.success('Account created successfully!');
    } catch (error: any) {
      console.error("Sign up error:", error);
      
      if (isDemoMode) {
        toast.error("⚠️ Demo Mode: Account creation simulation failed");
      } else {
        toast.error(error.message || "Failed to create account");
      }
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      if (isDemoMode) {
        // Demo mode - simulate Google sign in
        const demoUser = createDemoUser('demo@google.com', 'Google Demo User');
        setUser(demoUser);
        localStorage.setItem('demoUser', JSON.stringify(demoUser));
        toast.success('✅ Signed in with Google (Demo Mode)');
        return;
      }

      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success('Successfully signed in with Google!');
    } catch (error: any) {
      console.error("Google sign in error:", error);
      
      if (isDemoMode) {
        toast.error("⚠️ Demo Mode: Google sign in simulation failed");
      } else {
        toast.error(error.message || "Failed to sign in with Google");
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (isDemoMode) {
        // Demo mode - clear demo user
        setUser(null);
        localStorage.removeItem('demoUser');
        toast.success('✅ Signed out successfully (Demo Mode)');
        return;
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
    logout,
    isDemoMode
  };
};