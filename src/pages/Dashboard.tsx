import React, { useState } from 'react';
import { Plus, TrendingUp, DollarSign, Target, Award, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTrades } from '../hooks/useTrades';
import { useAccountBalance } from '../hooks/useAccountBalance';
import { useSubscription } from '../hooks/useSubscription';
import PerformanceChart from '../components/Dashboard/PerformanceChart';
import StatsCards from '../components/Dashboard/StatsCards';
import TradeTable from '../components/Dashboard/TradeTable';
import AccountBalanceCard from '../components/Dashboard/AccountBalanceCard';
import AddTradeModal from '../components/Dashboard/AddTradeModal';
import InlineStartingBalanceSetup from '../components/Dashboard/InlineStartingBalanceSetup';
import FeatureGuard from '../components/FeatureGuard';
import ErrorBoundary from '../components/ErrorBoundary';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { trades, stats, loading, error, addTrade, updateTrade, deleteTrade } = useTrades(user?.id);
  const { 
    accountBalance, 
    loading: balanceLoading, 
    hasSetupBalance, 
    updateStartingBalance,
    updateCurrentBalance
  } = useAccountBalance(user?.id);
  const { subscription } = useSubscription();
  const [showAddTradeModal, setShowAddTradeModal] = useState(false);

  const handleUpdateBalance = async (field: 'startingBalance' | 'currentBalance', newValue: number) => {
    if (field === 'startingBalance') {
      await updateStartingBalance(newValue);
    } else {
      await updateCurrentBalance(newValue);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please sign in to access your dashboard
          </h2>
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

  // CRITICAL: Check if user needs to set starting balance (only show once)
  const needsStartingBalance = !hasSetupBalance;

  // Check if user has reached the free plan trade limit
  const isAtTradeLimit = subscription?.plan === 'free' && trades.length >= 50;

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
                disabled={isAtTradeLimit && !subscription?.isActive}
                className={`mt-4 sm:mt-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 transform hover:scale-105 ${
                  isAtTradeLimit && !subscription?.isActive ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Plus className="h-5 w-5" />
                <span>Add Trade</span>
              </button>
            </div>

            {/* Free Plan Limit Warning */}
            {isAtTradeLimit && !subscription?.isActive && (
              <div className="mb-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Trade Limit Reached</h3>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      You've reached the 50 trade limit on the Free plan. Upgrade to Pro for unlimited trades.
                    </p>
                    <div className="mt-3">
                      <Link
                        to="/pricing"
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                      >
                        Upgrade to Pro
                        <ArrowRight className="ml-2 -mr-0.5 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

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
                <FeatureGuard>
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
                </FeatureGuard>
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