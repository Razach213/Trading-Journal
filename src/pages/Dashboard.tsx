import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, DollarSign, Target, Award, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTrades } from '../hooks/useTrades';
import { useAccountBalance } from '../hooks/useAccountBalance';
import PerformanceChart from '../components/Dashboard/PerformanceChart';
import StatsCards from '../components/Dashboard/StatsCards';
import TradeTable from '../components/Dashboard/TradeTable';
import AccountBalanceCard from '../components/Dashboard/AccountBalanceCard';
import AddTradeModal from '../components/Dashboard/AddTradeModal';
import InlineStartingBalanceSetup from '../components/Dashboard/InlineStartingBalanceSetup';
import ErrorBoundary from '../components/ErrorBoundary';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { trades, stats, loading, error, addTrade, updateTrade, deleteTrade } = useTrades(user?.id);
  const { 
    accountBalance, 
    loading: balanceLoading, 
    error: balanceError,
    hasSetupBalance, 
    updateStartingBalance,
    updateCurrentBalance
  } = useAccountBalance(user?.id);
  const [showAddTradeModal, setShowAddTradeModal] = useState(false);
  const navigate = useNavigate();

  // Check for authentication errors and redirect if needed
  useEffect(() => {
    // Check if there's an auth token
    const authToken = localStorage.getItem('authToken');
    
    // If no auth token and not loading, redirect to login
    if (!authToken && !authLoading && !user) {
      navigate('/login', { state: { from: '/dashboard' } });
    }
  }, [user, authLoading, navigate]);

  // Check for balance errors that might indicate auth issues
  useEffect(() => {
    if (balanceError && balanceError.includes('Permission denied')) {
      // Clear auth token and redirect to login
      localStorage.removeItem('authToken');
      navigate('/login', { state: { from: '/dashboard', message: 'Your session has expired. Please sign in again.' } });
    }
  }, [balanceError, navigate]);

  const handleUpdateBalance = async (field: 'startingBalance' | 'currentBalance', newValue: number) => {
    try {
      if (field === 'startingBalance') {
        await updateStartingBalance(newValue);
      } else {
        await updateCurrentBalance(newValue);
      }
    } catch (error: any) {
      // If error indicates auth issues, redirect to login
      if (error.message?.includes('Permission denied') || 
          error.message?.includes('No authentication token found')) {
        localStorage.removeItem('authToken');
        navigate('/login', { state: { from: '/dashboard', message: 'Your session has expired. Please sign in again.' } });
      }
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Verifying authentication...
          </h2>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please sign in to access your dashboard
          </h2>
          <button
            onClick={() => navigate('/login', { state: { from: '/dashboard' } })}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  // Show loading state while checking account balance
  if (balanceLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Loading your dashboard...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Setting up your trading environment
          </p>
        </div>
      </div>
    );
  }

  // Show error state if there's a balance error
  if (balanceError && !balanceError.includes('Permission denied')) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-center">
            <div className="bg-red-100 dark:bg-red-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Error Loading Dashboard
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {balanceError}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
              <button
                onClick={() => navigate('/login', { state: { from: '/dashboard' } })}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Sign In Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // CRITICAL: Check if user needs to set starting balance (only show once)
  const needsStartingBalance = !hasSetupBalance;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* CRITICAL: Inline Starting Balance Setup - Show only if needed and not set up */}
        {needsStartingBalance ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <InlineStartingBalanceSetup
              onSubmit={updateStartingBalance}
              defaultValue={10000}
            />
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Welcome back, {user.displayName}!
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Track your trading performance and improve your strategy
                </p>
              </div>
              <button
                onClick={() => setShowAddTradeModal(true)}
                className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 transform hover:scale-105"
              >
                <Plus className="h-5 w-5" />
                <span>Add Trade</span>
              </button>
            </div>

            {/* Account Balance Card */}
            {accountBalance && (
              <div className="mb-8">
                <AccountBalanceCard
                  startingBalance={accountBalance.startingBalance}
                  currentBalance={accountBalance.currentBalance}
                  totalPnL={accountBalance.totalPnL}
                  totalReturn={accountBalance.totalReturnPercent}
                  onUpdateBalance={handleUpdateBalance}
                />
              </div>
            )}

            {/* Stats Cards */}
            <div className="mb-8">
              <StatsCards stats={stats} />
            </div>

            {/* Charts and Performance */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
              <div className="xl:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Performance Chart
                  </h2>
                  <PerformanceChart trades={trades} />
                </div>
              </div>
              
              <div className="xl:col-span-1">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Quick Stats
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
                          <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Best Day</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            ${stats.largestWin.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                          <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Avg Win</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            ${stats.avgWin.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
                          <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Profit Factor</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {stats.profitFactor.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trades Table */}
            <div>
              <TradeTable
                trades={trades}
                onUpdateTrade={updateTrade}
                onDeleteTrade={deleteTrade}
                loading={loading}
                error={error}
              />
            </div>
          </div>
        )}

        {/* Add Trade Modal */}
        {showAddTradeModal && (
          <AddTradeModal
            onClose={() => setShowAddTradeModal(false)}
            onSubmit={addTrade}
            userId={user.id}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default Dashboard;