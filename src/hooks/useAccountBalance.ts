import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AccountBalance } from '../types';
import toast from 'react-hot-toast';

// Demo mode flag
const isDemoMode = !db;

export const useAccountBalance = (userId: string | undefined) => {
  const [accountBalance, setAccountBalance] = useState<AccountBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasSetupBalance, setHasSetupBalance] = useState(false);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setAccountBalance(null);
      setHasSetupBalance(false);
      return;
    }

    if (isDemoMode) {
      // Demo mode - use localStorage
      const demoBalance = localStorage.getItem(`demoBalance_${userId}`);
      const hasSetup = localStorage.getItem(`hasSetupBalance_${userId}`);
      
      setHasSetupBalance(!!hasSetup);
      
      if (demoBalance) {
        try {
          const balance = JSON.parse(demoBalance);
          setAccountBalance(balance);
        } catch (error) {
          console.error('Error loading demo balance:', error);
          // Create default demo balance only if not set up
          if (!hasSetup) {
            const defaultBalance: AccountBalance = {
              id: userId,
              userId,
              startingBalance: 0,
              currentBalance: 0,
              totalPnL: 0,
              totalReturnPercent: 0,
              lastUpdated: new Date()
            };
            setAccountBalance(defaultBalance);
            localStorage.setItem(`demoBalance_${userId}`, JSON.stringify(defaultBalance));
          }
        }
      } else if (!hasSetup) {
        // Create default demo balance only if not set up
        const defaultBalance: AccountBalance = {
          id: userId,
          userId,
          startingBalance: 0,
          currentBalance: 0,
          totalPnL: 0,
          totalReturnPercent: 0,
          lastUpdated: new Date()
        };
        setAccountBalance(defaultBalance);
        localStorage.setItem(`demoBalance_${userId}`, JSON.stringify(defaultBalance));
      }
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Set up real-time listener for account balance
    const unsubscribe = onSnapshot(
      doc(db, 'accountBalances', userId),
      async (doc) => {
        try {
          if (doc.exists()) {
            const data = doc.data();
            const balance: AccountBalance = {
              id: doc.id,
              userId: data.userId,
              startingBalance: data.startingBalance || 0,
              currentBalance: data.currentBalance || data.startingBalance || 0,
              totalPnL: data.totalPnL || 0,
              totalReturnPercent: data.totalReturnPercent || 0,
              lastUpdated: data.lastUpdated?.toDate() || new Date()
            };
            setAccountBalance(balance);
            setHasSetupBalance(balance.startingBalance > 0);
          } else {
            // Create empty balance record
            const defaultBalance: Omit<AccountBalance, 'id'> = {
              userId,
              startingBalance: 0,
              currentBalance: 0,
              totalPnL: 0,
              totalReturnPercent: 0,
              lastUpdated: new Date()
            };
            
            try {
              await setDoc(doc(db, 'accountBalances', userId), defaultBalance);
              setAccountBalance({ ...defaultBalance, id: userId });
              setHasSetupBalance(false);
            } catch (createError) {
              console.error('Error creating account balance:', createError);
              setAccountBalance({ ...defaultBalance, id: userId });
              setHasSetupBalance(false);
            }
          }
          setError(null);
        } catch (err) {
          console.error('Error processing account balance:', err);
          setError('Failed to load account balance');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error('Error fetching account balance:', err);
        setLoading(false);
        
        if (err.code === 'permission-denied') {
          setError('Permission denied. Please check your authentication.');
        } else if (err.code === 'unavailable') {
          setError('Service temporarily unavailable. Please check your internet connection.');
        } else {
          setError('Failed to load account balance. Please try refreshing the page.');
        }
      }
    );

    return unsubscribe;
  }, [userId]);

  const updateStartingBalance = async (newStartingBalance: number): Promise<void> => {
    if (!userId) {
      throw new Error('User ID is required');
    }

    if (!newStartingBalance || newStartingBalance <= 0) {
      throw new Error('Starting balance must be greater than 0');
    }

    try {
      const isFirstTimeSetup = !hasSetupBalance || !accountBalance || accountBalance.startingBalance === 0;
      
      const updatedBalance = {
        userId,
        startingBalance: newStartingBalance,
        currentBalance: isFirstTimeSetup ? newStartingBalance : (accountBalance?.currentBalance || newStartingBalance),
        totalPnL: isFirstTimeSetup ? 0 : (accountBalance?.totalPnL || 0),
        totalReturnPercent: 0,
        lastUpdated: new Date()
      };

      if (isDemoMode) {
        // Demo mode - save to localStorage
        const balanceWithId = { ...updatedBalance, id: userId };
        setAccountBalance(balanceWithId);
        localStorage.setItem(`demoBalance_${userId}`, JSON.stringify(balanceWithId));
        localStorage.setItem(`hasSetupBalance_${userId}`, 'true');
        setHasSetupBalance(true);
        
        if (isFirstTimeSetup) {
          toast.success('🎉 Demo account setup complete! (Data saved locally)');
        } else {
          toast.success('Starting balance updated successfully! (Demo Mode)');
        }
        return;
      }

      // Real Firebase mode
      await setDoc(doc(db, 'accountBalances', userId), updatedBalance, { merge: true });
      
      setAccountBalance(prev => ({
        ...prev,
        id: userId,
        ...updatedBalance
      }));
      
      setHasSetupBalance(true);
      
      if (isFirstTimeSetup) {
        toast.success('🎉 Account setup complete! Ready to start trading!');
      } else {
        toast.success('Starting balance updated successfully!');
      }
    } catch (error: any) {
      console.error('Error updating starting balance:', error);
      
      if (error.code === 'permission-denied') {
        toast.error('Permission denied. Please sign in again.');
      } else if (error.code === 'unavailable') {
        toast.error('Service unavailable. Please check your internet connection.');
      } else {
        toast.error('Failed to update starting balance. Please try again.');
      }
      throw error;
    }
  };

  const updateBalanceFromTrade = async (tradePnL: number) => {
    if (!userId || !accountBalance) {
      throw new Error('Account balance not found');
    }

    try {
      const newTotalPnL = accountBalance.totalPnL + tradePnL;
      const newCurrentBalance = accountBalance.startingBalance + newTotalPnL;
      const newReturnPercent = accountBalance.startingBalance > 0 
        ? (newTotalPnL / accountBalance.startingBalance) * 100 
        : 0;

      const updatedBalance = {
        currentBalance: newCurrentBalance,
        totalPnL: newTotalPnL,
        totalReturnPercent: newReturnPercent,
        lastUpdated: new Date()
      };

      if (isDemoMode) {
        // Demo mode - update localStorage
        const newBalance = { ...accountBalance, ...updatedBalance };
        setAccountBalance(newBalance);
        localStorage.setItem(`demoBalance_${userId}`, JSON.stringify(newBalance));
        return newCurrentBalance;
      }

      await updateDoc(doc(db, 'accountBalances', userId), updatedBalance);
      return newCurrentBalance;
    } catch (error) {
      console.error('Error updating balance from trade:', error);
      throw error;
    }
  };

  const recalculateBalance = async (allClosedTrades: any[]) => {
    if (!userId || !accountBalance) return;

    try {
      const totalPnL = allClosedTrades.reduce((sum, trade) => {
        return sum + (trade.pnl || 0);
      }, 0);

      const newCurrentBalance = accountBalance.startingBalance + totalPnL;
      const newReturnPercent = accountBalance.startingBalance > 0 
        ? (totalPnL / accountBalance.startingBalance) * 100 
        : 0;

      const updatedBalance = {
        currentBalance: newCurrentBalance,
        totalPnL: totalPnL,
        totalReturnPercent: newReturnPercent,
        lastUpdated: new Date()
      };

      if (isDemoMode) {
        // Demo mode - update localStorage
        const newBalance = { ...accountBalance, ...updatedBalance };
        setAccountBalance(newBalance);
        localStorage.setItem(`demoBalance_${userId}`, JSON.stringify(newBalance));
        return;
      }

      await updateDoc(doc(db, 'accountBalances', userId), updatedBalance);
    } catch (error) {
      console.error('Error recalculating balance:', error);
      throw error;
    }
  };

  return {
    accountBalance,
    loading,
    error,
    hasSetupBalance,
    updateStartingBalance,
    updateBalanceFromTrade,
    recalculateBalance,
    isDemoMode
  };
};