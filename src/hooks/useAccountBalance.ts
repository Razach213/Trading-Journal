import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
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
              lastUpdated: new Date(),
              createdAt: new Date(),
              updatedAt: new Date()
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
          lastUpdated: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        setAccountBalance(defaultBalance);
        localStorage.setItem(`demoBalance_${userId}`, JSON.stringify(defaultBalance));
      }
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Get auth token from localStorage
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      setError('No authentication token found. Please sign in again.');
      setLoading(false);
      return;
    }

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
              lastUpdated: data.lastUpdated?.toDate() || new Date(),
              createdAt: data.createdAt?.toDate() || new Date(),
              updatedAt: data.updatedAt?.toDate() || new Date()
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
              lastUpdated: new Date(),
              createdAt: new Date(),
              updatedAt: new Date()
            };
            
            try {
              await setDoc(doc(db, 'accountBalances', userId), {
                ...defaultBalance,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
              });
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

  const updateBalance = async (field: 'startingBalance' | 'currentBalance', newValue: number): Promise<void> => {
    if (!userId) {
      throw new Error('User ID is required');
    }

    if (newValue < 0) {
      throw new Error('Balance cannot be negative');
    }

    try {
      if (!accountBalance) {
        throw new Error('Account balance not found');
      }

      // Calculate new values based on which field is being updated
      let updatedBalance: Partial<AccountBalance> = {
        lastUpdated: new Date()
      };

      if (field === 'startingBalance') {
        // When starting balance changes, recalculate totalPnL and totalReturnPercent
        const newStartingBalance = newValue;
        const totalPnL = accountBalance.currentBalance - newStartingBalance;
        const totalReturnPercent = newStartingBalance > 0 ? (totalPnL / newStartingBalance) * 100 : 0;

        updatedBalance = {
          ...updatedBalance,
          startingBalance: newStartingBalance,
          totalPnL,
          totalReturnPercent
        };
      } else if (field === 'currentBalance') {
        // When current balance changes, recalculate totalPnL and totalReturnPercent
        const newCurrentBalance = newValue;
        const totalPnL = newCurrentBalance - accountBalance.startingBalance;
        const totalReturnPercent = accountBalance.startingBalance > 0 
          ? (totalPnL / accountBalance.startingBalance) * 100 
          : 0;

        updatedBalance = {
          ...updatedBalance,
          currentBalance: newCurrentBalance,
          totalPnL,
          totalReturnPercent
        };
      }

      if (isDemoMode) {
        // Demo mode - save to localStorage
        const newBalance = { ...accountBalance, ...updatedBalance };
        setAccountBalance(newBalance);
        localStorage.setItem(`demoBalance_${userId}`, JSON.stringify(newBalance));
        localStorage.setItem(`hasSetupBalance_${userId}`, 'true');
        setHasSetupBalance(true);
        
        toast.success(`${field === 'startingBalance' ? 'Starting' : 'Current'} balance updated successfully! (Demo Mode)`);
        return;
      }

      // Get auth token from localStorage
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        throw new Error('No authentication token found. Please sign in again.');
      }

      // Real Firebase mode
      await updateDoc(doc(db, 'accountBalances', userId), {
        ...updatedBalance,
        updatedAt: serverTimestamp()
      });
      
      // Update local state
      setAccountBalance(prev => {
        if (!prev) return null;
        return {
          ...prev,
          ...updatedBalance
        } as AccountBalance;
      });
      
      setHasSetupBalance(true);
      
      toast.success(`${field === 'startingBalance' ? 'Starting' : 'Current'} balance updated successfully!`);
    } catch (error: any) {
      console.error(`Error updating ${field}:`, error);
      
      if (error.message?.includes('negative')) {
        toast.error('Balance cannot be negative');
      } else if (error.code === 'permission-denied') {
        toast.error('Permission denied. Please sign in again.');
      } else if (error.code === 'unavailable') {
        toast.error('Service unavailable. Please check your internet connection.');
      } else {
        toast.error(`Failed to update ${field}. Please try again.`);
      }
      throw error;
    }
  };

  const updateStartingBalance = async (newStartingBalance: number): Promise<void> => {
    return updateBalance('startingBalance', newStartingBalance);
  };

  const updateCurrentBalance = async (newCurrentBalance: number): Promise<void> => {
    return updateBalance('currentBalance', newCurrentBalance);
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

      // Get auth token from localStorage
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        throw new Error('No authentication token found. Please sign in again.');
      }

      await updateDoc(doc(db, 'accountBalances', userId), {
        ...updatedBalance,
        updatedAt: serverTimestamp()
      });
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

      // Get auth token from localStorage
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        throw new Error('No authentication token found. Please sign in again.');
      }

      await updateDoc(doc(db, 'accountBalances', userId), {
        ...updatedBalance,
        updatedAt: serverTimestamp()
      });
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
    updateCurrentBalance,
    updateBalanceFromTrade,
    recalculateBalance,
    isDemoMode
  };
};