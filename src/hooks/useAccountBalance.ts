import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AccountBalance } from '../types';
import toast from 'react-hot-toast';

export const useAccountBalance = (userId: string | undefined) => {
  const [accountBalance, setAccountBalance] = useState<AccountBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setAccountBalance(null);
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
              startingBalance: data.startingBalance || 100000, // Default $100,000
              currentBalance: data.currentBalance || data.startingBalance || 100000,
              totalPnL: data.totalPnL || 0,
              totalReturnPercent: data.totalReturnPercent || 0,
              lastUpdated: data.lastUpdated?.toDate() || new Date()
            };
            setAccountBalance(balance);
          } else {
            // CRITICAL: Auto-create default account balance with $100,000
            const defaultBalance: Omit<AccountBalance, 'id'> = {
              userId,
              startingBalance: 100000, // Default $100,000
              currentBalance: 100000,
              totalPnL: 0,
              totalReturnPercent: 0,
              lastUpdated: new Date()
            };
            
            await setDoc(doc(db, 'accountBalances', userId), defaultBalance);
            setAccountBalance({ ...defaultBalance, id: userId });
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

  const updateStartingBalance = async (newStartingBalance: number): Promise<void> => {
    if (!userId || !accountBalance) {
      throw new Error('Account balance not found');
    }

    try {
      // CRITICAL: Maintain the same P&L but recalculate current balance
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
      // CRITICAL: Calculate new values correctly
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
      // CRITICAL: Recalculate total P&L from all closed trades
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
    updateStartingBalance,
    updateBalanceFromTrade,
    recalculateBalance
  };
};