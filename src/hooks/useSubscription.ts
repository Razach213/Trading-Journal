import { useState, useEffect } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './useAuth';
import { pricingConfig } from '../config/pricing';
import toast from 'react-hot-toast';

export interface SubscriptionStatus {
  isActive: boolean;
  plan: 'free' | 'pro';
  trialActive: boolean;
  trialEndDate: Date | null;
  trialDaysLeft: number | null;
  trialWarning: boolean;
  paymentStatus: 'pending' | 'approved' | 'rejected' | null;
  paymentId: string | null;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionStatus>({
    isActive: false,
    plan: 'free',
    trialActive: false,
    trialEndDate: null,
    trialDaysLeft: null,
    trialWarning: false,
    paymentStatus: null,
    paymentId: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !db) {
      setSubscription({
        isActive: false,
        plan: 'free',
        trialActive: false,
        trialEndDate: null,
        trialDaysLeft: null,
        trialWarning: false,
        paymentStatus: null,
        paymentId: null
      });
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Check user document for subscription info
    const userDocRef = doc(db, 'users', user.id);
    
    const unsubscribe = onSnapshot(
      userDocRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          const userPlan = userData.plan || 'free';
          
          // Check if user has an active trial
          const trialEndDate = userData.trialEndDate?.toDate() || null;
          const now = new Date();
          
          let trialActive = false;
          let trialDaysLeft = null;
          let trialWarning = false;
          
          if (trialEndDate && now < trialEndDate) {
            trialActive = true;
            const diffTime = Math.abs(trialEndDate.getTime() - now.getTime());
            trialDaysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            // Show warning if trial is about to expire
            trialWarning = trialDaysLeft <= pricingConfig.trialWarningPeriod;
            
            // If trial is about to expire and warning hasn't been shown yet
            if (trialWarning && !userData.trialWarningShown) {
              toast.error(`Your trial will expire in ${trialDaysLeft} day${trialDaysLeft !== 1 ? 's' : ''}. Please upgrade your plan to continue using premium features.`, {
                duration: 10000,
                icon: '⚠️'
              });
            }
          }
          
          setSubscription({
            isActive: userPlan === 'pro' || trialActive,
            plan: userPlan as 'free' | 'pro',
            trialActive,
            trialEndDate,
            trialDaysLeft,
            trialWarning,
            paymentStatus: userData.paymentStatus || null,
            paymentId: userData.paymentId || null
          });
        } else {
          // Default to free plan if user document doesn't exist
          setSubscription({
            isActive: false,
            plan: 'free',
            trialActive: false,
            trialEndDate: null,
            trialDaysLeft: null,
            trialWarning: false,
            paymentStatus: null,
            paymentId: null
          });
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching subscription:', err);
        setError('Failed to load subscription status');
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user]);

  return {
    subscription,
    loading,
    error
  };
};