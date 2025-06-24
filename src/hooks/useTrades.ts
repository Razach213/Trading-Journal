import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  limit
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Trade, TradingStats } from '../types';
import { useAccountBalance } from './useAccountBalance';
import { useSubscription } from './useSubscription';
import toast from 'react-hot-toast';

// Demo mode flag
const isDemoMode = !db;

export const useTrades = (userId: string | undefined) => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { accountBalance, updateBalanceFromTrade, recalculateBalance } = useAccountBalance(userId);
  const { subscription } = useSubscription();
  const [stats, setStats] = useState<TradingStats>({
    totalTrades: 0,
    winningTrades: 0,
    losingTrades: 0,
    winRate: 0,
    totalPnL: 0,
    avgWin: 0,
    avgLoss: 0,
    profitFactor: 0,
    largestWin: 0,
    largestLoss: 0,
    accountBalance: 0,
    currentBalance: 0,
    totalReturn: 0
  });

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setError(null);
      setTrades([]);
      return;
    }

    if (isDemoMode) {
      // Demo mode - load from localStorage
      try {
        const demoTrades = localStorage.getItem(`demoTrades_${userId}`);
        if (demoTrades) {
          const parsedTrades = JSON.parse(demoTrades);
          setTrades(parsedTrades);
          calculateStats(parsedTrades);
        }
      } catch (error) {
        console.error('Error loading demo trades:', error);
      }
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Apply limit for free plan users
      let tradesQuery;
      if (subscription?.plan === 'free' && !subscription?.isActive) {
        tradesQuery = query(
          collection(db, 'trades'),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc'),
          limit(50) // Limit to 50 trades for free plan
        );
      } else {
        tradesQuery = query(
          collection(db, 'trades'),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );
      }

      const unsubscribe = onSnapshot(
        tradesQuery, 
        (snapshot) => {
          try {
            const tradesData: Trade[] = [];
            snapshot.forEach((doc) => {
              const data = doc.data();
              
              const trade: Trade = {
                id: doc.id,
                userId: data.userId || '',
                symbol: data.symbol || '',
                type: data.type || 'long',
                entryPrice: typeof data.entryPrice === 'number' ? data.entryPrice : 0,
                exitPrice: typeof data.exitPrice === 'number' ? data.exitPrice : null,
                quantity: typeof data.quantity === 'number' ? data.quantity : 0,
                entryDate: data.entryDate?.toDate() || new Date(),
                exitDate: data.exitDate?.toDate() || null,
                status: data.status || 'open',
                pnl: typeof data.pnl === 'number' ? data.pnl : null,
                pnlPercent: typeof data.pnlPercent === 'number' ? data.pnlPercent : null,
                notes: data.notes || null,
                tags: Array.isArray(data.tags) ? data.tags : [],
                strategy: data.strategy || null,
                balanceAfterTrade: typeof data.balanceAfterTrade === 'number' ? data.balanceAfterTrade : null,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date()
              };
              
              tradesData.push(trade);
            });
            
            setTrades(tradesData);
            calculateStats(tradesData);
            setError(null);
          } catch (err) {
            console.error('Error processing trades data:', err);
            setError('Failed to process trades data');
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          console.error('Error fetching trades:', err);
          setLoading(false);
          
          if (err.code === 'permission-denied') {
            setError('You don\'t have permission to access this data. Please sign in again.');
          } else if (err.code === 'failed-precondition') {
            setError('Database index is being created. Please try again in a few minutes.');
          } else if (err.code === 'unavailable') {
            setError('Service is temporarily unavailable. Please check your internet connection.');
          } else {
            setError('Failed to load trades. Please try refreshing the page.');
          }
        }
      );

      return unsubscribe;
    } catch (err) {
      console.error('Error setting up trades listener:', err);
      setLoading(false);
      setError('Failed to initialize trades. Please refresh the page.');
    }
  }, [userId, subscription]);

  const calculateStats = (tradesData: Trade[]) => {
    try {
      // If there are no trades, set default values
      if (!tradesData || tradesData.length === 0) {
        const defaultStats: TradingStats = {
          totalTrades: 0,
          winningTrades: 0,
          losingTrades: 0,
          winRate: 0,
          totalPnL: 0,
          avgWin: 0,
          avgLoss: 0,
          profitFactor: 0,
          largestWin: 0,
          largestLoss: 0,
          accountBalance: accountBalance?.startingBalance || 10000,
          currentBalance: accountBalance?.startingBalance || 10000, // Same as starting balance when no trades
          totalReturn: 0
        };
        setStats(defaultStats);
        return;
      }

      const closedTrades = tradesData.filter(trade => 
        trade.status === 'closed' && 
        trade.pnl !== undefined && 
        trade.pnl !== null &&
        !isNaN(trade.pnl)
      );
      
      // If no closed trades, set stats with zero values but keep account balance
      if (closedTrades.length === 0) {
        const noTradesStats: TradingStats = {
          totalTrades: tradesData.length,
          winningTrades: 0,
          losingTrades: 0,
          winRate: 0,
          totalPnL: 0,
          avgWin: 0,
          avgLoss: 0,
          profitFactor: 0,
          largestWin: 0,
          largestLoss: 0,
          accountBalance: accountBalance?.startingBalance || 10000,
          currentBalance: accountBalance?.startingBalance || 10000, // Same as starting balance when no closed trades
          totalReturn: 0
        };
        setStats(noTradesStats);
        return;
      }

      const winningTrades = closedTrades.filter(trade => (trade.pnl || 0) > 0);
      const losingTrades = closedTrades.filter(trade => (trade.pnl || 0) < 0);
      
      const totalPnL = closedTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
      const totalWins = winningTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
      const totalLosses = Math.abs(losingTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0));
      
      const avgWin = winningTrades.length > 0 ? totalWins / winningTrades.length : 0;
      const avgLoss = losingTrades.length > 0 ? totalLosses / losingTrades.length : 0;
      
      const largestWin = winningTrades.length > 0 ? Math.max(...winningTrades.map(t => t.pnl || 0)) : 0;
      const largestLoss = losingTrades.length > 0 ? Math.min(...losingTrades.map(t => t.pnl || 0)) : 0;

      const profitFactor = totalLosses > 0 ? totalWins / totalLosses : totalWins > 0 ? totalWins : 0;
      const winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0;

      const calculatedStats: TradingStats = {
        totalTrades: tradesData.length,
        winningTrades: winningTrades.length,
        losingTrades: losingTrades.length,
        winRate: Math.round(winRate * 10) / 10,
        totalPnL: accountBalance?.totalPnL || totalPnL,
        avgWin: Math.round(avgWin * 100) / 100,
        avgLoss: Math.round(avgLoss * 100) / 100,
        profitFactor: Math.round(profitFactor * 100) / 100,
        largestWin: Math.round(largestWin * 100) / 100,
        largestLoss: Math.round(largestLoss * 100) / 100,
        accountBalance: accountBalance?.startingBalance || 10000,
        currentBalance: accountBalance?.currentBalance || 10000,
        totalReturn: accountBalance?.totalReturnPercent || 0
      };

      setStats(calculatedStats);
      
    } catch (err) {
      console.error('Error calculating stats:', err);
    }
  };

  // Recalculate stats when account balance changes
  useEffect(() => {
    if (accountBalance) {
      calculateStats(trades);
    }
  }, [accountBalance]);

  const addTrade = async (tradeData: Omit<Trade, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Check if user has reached free plan limit
      if (subscription?.plan === 'free' && !subscription?.isActive && trades.length >= 50) {
        toast.error('You\'ve reached the 50 trade limit on the Free plan. Upgrade to Pro for unlimited trades.');
        return;
      }

      if (isDemoMode) {
        // Demo mode - save to localStorage
        const newTrade: Trade = {
          ...tradeData,
          id: 'demo-' + Date.now(),
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const updatedTrades = [newTrade, ...trades];
        setTrades(updatedTrades);
        localStorage.setItem(`demoTrades_${userId}`, JSON.stringify(updatedTrades));
        calculateStats(updatedTrades);
        toast.success('Trade added successfully! (Demo Mode)');
        return;
      }

      if (!auth?.currentUser) {
        throw new Error('User not authenticated');
      }

      // Calculate balance after trade if it's a closed trade
      let balanceAfterTrade = null;
      if (tradeData.status === 'closed' && tradeData.pnl !== null && tradeData.pnl !== undefined) {
        balanceAfterTrade = await updateBalanceFromTrade(tradeData.pnl);
      }

      const trade = {
        userId: tradeData.userId,
        symbol: tradeData.symbol || '',
        type: tradeData.type || 'long',
        entryPrice: Number(tradeData.entryPrice) || 0,
        exitPrice: tradeData.exitPrice ? Number(tradeData.exitPrice) : null,
        quantity: Number(tradeData.quantity) || 0,
        entryDate: tradeData.entryDate instanceof Date ? tradeData.entryDate : new Date(tradeData.entryDate || new Date()),
        exitDate: tradeData.exitDate ? (tradeData.exitDate instanceof Date ? tradeData.exitDate : new Date(tradeData.exitDate)) : null,
        status: tradeData.status || 'open',
        pnl: tradeData.pnl ? Number(tradeData.pnl) : null,
        pnlPercent: tradeData.pnlPercent ? Number(tradeData.pnlPercent) : null,
        notes: tradeData.notes || null,
        strategy: tradeData.strategy || null,
        tags: Array.isArray(tradeData.tags) ? tradeData.tags : [],
        balanceAfterTrade,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(collection(db, 'trades'), trade);
      toast.success('Trade added successfully!');
    } catch (error: any) {
      console.error('Error adding trade:', error);
      
      if (error.code === 'permission-denied') {
        toast.error('Permission denied. Please check your authentication and try again.');
      } else if (error.message?.includes('price must be greater than 0')) {
        toast.error('Entry and exit prices must be greater than 0');
      } else {
        toast.error(error.message || 'Failed to add trade');
      }
      throw error;
    }
  };

  const updateTrade = async (tradeId: string, updates: Partial<Trade>) => {
    try {
      if (!tradeId) {
        throw new Error('Trade ID is required');
      }

      if (isDemoMode) {
        // Demo mode - update in localStorage
        const updatedTrades = trades.map(trade => 
          trade.id === tradeId ? { ...trade, ...updates, updatedAt: new Date() } : trade
        );
        setTrades(updatedTrades);
        localStorage.setItem(`demoTrades_${userId}`, JSON.stringify(updatedTrades));
        calculateStats(updatedTrades);
        toast.success('Trade updated successfully! (Demo Mode)');
        return;
      }

      if (!auth?.currentUser) {
        throw new Error('User not authenticated');
      }

      // Find the original trade to calculate P&L difference
      const originalTrade = trades.find(t => t.id === tradeId);
      if (!originalTrade) {
        throw new Error('Original trade not found');
      }

      const cleanUpdates = Object.entries(updates).reduce((acc, [key, value]) => {
        if (value !== undefined && key !== 'id' && key !== 'createdAt') {
          if (key === 'entryPrice' || key === 'exitPrice' || key === 'quantity' || key === 'pnl' || key === 'pnlPercent') {
            acc[key] = value === null ? null : Number(value);
          } else if (key === 'entryDate' || key === 'exitDate') {
            acc[key] = value === null ? null : (value instanceof Date ? value : new Date(value));
          } else {
            acc[key] = value === null ? null : value;
          }
        }
        return acc;
      }, {} as any);

      // Handle balance update if P&L changed and trade is closed
      if (cleanUpdates.pnl !== undefined && cleanUpdates.status === 'closed') {
        const originalPnL = originalTrade.status === 'closed' ? (originalTrade.pnl || 0) : 0;
        const newPnL = cleanUpdates.pnl || 0;
        const pnlDifference = newPnL - originalPnL;
        
        if (pnlDifference !== 0) {
          cleanUpdates.balanceAfterTrade = await updateBalanceFromTrade(pnlDifference);
        }
      }

      await updateDoc(doc(db, 'trades', tradeId), {
        ...cleanUpdates,
        updatedAt: serverTimestamp()
      });
      toast.success('Trade updated successfully!');
    } catch (error: any) {
      console.error('Error updating trade:', error);
      toast.error(error.message || 'Failed to update trade');
      throw error;
    }
  };

  const deleteTrade = async (tradeId: string) => {
    try {
      if (!tradeId) {
        throw new Error('Trade ID is required');
      }

      if (isDemoMode) {
        // Demo mode - remove from localStorage
        const updatedTrades = trades.filter(trade => trade.id !== tradeId);
        setTrades(updatedTrades);
        localStorage.setItem(`demoTrades_${userId}`, JSON.stringify(updatedTrades));
        calculateStats(updatedTrades);
        toast.success('Trade deleted successfully! (Demo Mode)');
        return;
      }

      if (!auth?.currentUser) {
        throw new Error('User not authenticated');
      }

      // Find the trade to reverse its P&L effect
      const tradeToDelete = trades.find(t => t.id === tradeId);
      if (tradeToDelete && tradeToDelete.status === 'closed' && tradeToDelete.pnl) {
        // Reverse the P&L effect
        await updateBalanceFromTrade(-tradeToDelete.pnl);
      }

      await deleteDoc(doc(db, 'trades', tradeId));
      toast.success('Trade deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting trade:', error);
      toast.error(error.message || 'Failed to delete trade');
      throw error;
    }
  };

  return {
    trades,
    stats,
    loading,
    error,
    addTrade,
    updateTrade,
    deleteTrade
  };
};