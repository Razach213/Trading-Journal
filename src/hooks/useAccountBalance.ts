import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
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
      return;
    }

    const fetchAccountBalance = async () => {
      try {
        setLoading(true);
        const balanceDoc = await getDoc(doc(db, 'accountBalances', userId));
        
        if (balanceDoc.exists()) {
          const data = balanceDoc.data();
          setAccountBalance({
            id: balanceDoc.id,
            userId: data.userId,
            startingBalance: data.startingBalance || 10000, // Default $10,000
            currentBalance: data.currentBalance || data.startingBalance || 10000,
            totalPnL: data.totalPnL || 0,
            totalReturnPercent: data.totalReturnPercent || 0,
            lastUpdated: data.lastUpdated?.toDate() || new Date()
          });
        } else {
          // Create default account balance
          const defaultBalance: Omit<AccountBalance, 'id'> = {
            userId,
            startingBalance: 10000, // Default $10,000
            currentBalance: 10000,
            totalPnL: 0,
            totalReturnPercent: 0,
            lastUpdated: new Date()
          };
          
          await setDoc(doc(db, 'accountBalances', userId), defaultBalance);
          setAccountBalance({ ...defaultBalance, id: userId });
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching account balance:', err);
        setError('Failed to load account balance');
      } finally {
        setLoading(false);
      }
    };

    fetchAccountBalance();
  }, [userId]);

  const updateStartingBalance = async (newStartingBalance: number) => {
    if (!userId || !accountBalance) return;

    try {
      const currentPnL = accountBalance.currentBalance - accountBalance.startingBalance;
      const newCurrentBalance = newStartingBalance + currentPnL;
      const newReturnPercent = newStartingBalance > 0 ? (currentPnL / newStartingBalance) * 100 : 0;

      const updatedBalance: Partial<AccountBalance> = {
        startingBalance: newStartingBalance,
        currentBalance: newCurrentBalance,
        totalPnL: currentPnL,
        totalReturnPercent: newReturnPercent,
        lastUpdated: new Date()
      };

      await updateDoc(doc(db, 'accountBalances', userId), updatedBalance);
      
      setAccountBalance(prev => prev ? { ...prev, ...updatedBalance } : null);
      toast.success('Starting balance updated successfully!');
    } catch (error) {
      console.error('Error updating starting balance:', error);
      toast.error('Failed to update starting balance');
    }
  };

  const updateBalanceFromTrade = async (tradePnL: number) => {
    if (!userId || !accountBalance) return;

    try {
      const newCurrentBalance = accountBalance.currentBalance + tradePnL;
      const newTotalPnL = accountBalance.totalPnL + tradePnL;
      const newReturnPercent = accountBalance.startingBalance > 0 
        ? (newTotalPnL / accountBalance.startingBalance) * 100 
        : 0;

      const updatedBalance: Partial<AccountBalance> = {
        currentBalance: newCurrentBalance,
        totalPnL: newTotalPnL,
        totalReturnPercent: newReturnPercent,
        lastUpdated: new Date()
      };

      await updateDoc(doc(db, 'accountBalances', userId), updatedBalance);
      
      setAccountBalance(prev => prev ? { ...prev, ...updatedBalance } : null);
      
      return newCurrentBalance;
    } catch (error) {
      console.error('Error updating balance from trade:', error);
      throw error;
    }
  };

  return {
    accountBalance,
    loading,
    error,
    updateStartingBalance,
    updateBalanceFromTrade
  };
};