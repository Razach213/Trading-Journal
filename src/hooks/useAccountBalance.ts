import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AccountBalance } from '../types';
import toast from 'react-hot-toast';

export const useAccountBalance = (userId: string | undefined) => {
  const [accountBalance, setAccountBalance] = useState<AccountBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsSetup, setNeedsSetup] = useState(false);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setAccountBalance(null);
      setNeedsSetup(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Set up real-time listener for account balance
    const unsubscribe = onSnapshot(
      doc(db, 'accountBalances', userId),
      (doc) => {
        try {
          if (doc.exists()) {
            const data = doc.data();
            const balance: AccountBalance = {
              id: doc.id,
              userId: data.userId,
              startingBalance: data.startingBalance || 10000,
              currentBalance: data.currentBalance || data.startingBalance || 10000,
              totalPnL: data.totalPnL || 0,
              totalReturnPercent: data.totalReturnPercent || 0,
              lastUpdated: data.lastUpdated?.toDate() || new Date()
            };
            setAccountBalance(balance);
            setNeedsSetup(false);
          } else {
            // No account balance found - user needs to set it up
            setAccountBalance(null);
            setNeedsSetup(true);
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
        setError('Failed to load account balance');
      }
    );

    return unsubscribe;
  }, [userId]);

  const createAccountBalance = async (startingBalance: number) => {
    if (!userId) throw new Error('User ID is required');

    try {
      const newBalance: Omit<AccountBalance, 'id'> = {
        userId,
        startingBalance,
        currentBalance: startingBalance,
        totalPnL: 0,
        totalReturnPercent: 0,
        lastUpdated: new Date()
      };

      await setDoc(doc(db, 'accountBalances', userId), newBalance);
      setNeedsSetup(false);
      toast.success('Account balance set successfully!');
    } catch (error) {
      console.error('Error creating account balance:', error);
      toast.error('Failed to set account balance');
      throw error;
    }
  };

  const updateStartingBalance = async (newStartingBalance: number) => {
    if (!userId || !accountBalance) return;

    try {
      // Calculate new current balance maintaining the same P&L
      const currentPnL = accountBalance.totalPnL;
      const newCurrentBalance = newStartingBalance + currentPnL;
      const newReturnPercent = newStartingBalance > 0 ? (currentPnL / newStartingBalance) * 100 : 0;

      const updatedBalance = {
        startingBalance: newStartingBalance,
        currentBalance: newCurrentBalance,
        totalReturnPercent: newReturnPercent,
        lastUpdated: new Date()
      };

      await updateDoc(doc(db, 'accountBalances', userId), updatedBalance);
      toast.success('Starting balance updated successfully!');
    } catch (error) {
      console.error('Error updating starting balance:', error);
      toast.error('Failed to update starting balance');
      throw error;
    }
  };

  const updateBalanceFromTrade = async (tradePnL: number) => {
    if (!userId || !accountBalance) {
      throw new Error('Account balance not found');
    }

    try {
      // Calculate new values
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
      // Calculate total P&L from all closed trades
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
    needsSetup,
    createAccountBalance,
    updateStartingBalance,
    updateBalanceFromTrade,
    recalculateBalance
  };
};