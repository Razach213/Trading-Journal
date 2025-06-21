import React, { useState } from 'react';
import { Plus, TrendingUp, DollarSign, Target, Award } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTrades } from '../hooks/useTrades';
import { useAccountBalance } from '../hooks/useAccountBalance';
import PerformanceChart from '../components/Dashboard/PerformanceChart';
import StatsCards from '../components/Dashboard/StatsCards';
import TradeTable from '../components/Dashboard/TradeTable';
import AccountBalanceCard from '../components/Dashboard/AccountBalanceCard';
import AddTradeModal from '../components/Dashboard/AddTradeModal';
import ErrorBoundary from '../components/ErrorBoundary';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { trades, stats, loading, error, addTrade, updateTrade, deleteTrade } = useTrades(user?.id);
  const { accountBalance, loading: balanceLoading, updateStartingBalance } = useAccountBalance(user?.id);
  const [showAddTradeModal, setShowAddTradeModal] = useState(false);

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

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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

          {/* Account Balance Card - TOP */}
          {accountBalance && (
            <div className="mb-8">
              <AccountBalanceCard
                startingBalance={accountBalance.startingBalance}
                currentBalance={accountBalance.currentBalance}
                totalPnL={accountBalance.totalPnL}
                totalReturn={accountBalance.totalReturnPercent}
                onUpdateBalance={updateStartingBalance}
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

          {/* Add Trade Modal */}
          {showAddTradeModal && (
            <AddTradeModal
              onClose={() => setShowAddTradeModal(false)}
              onSubmit={addTrade}
              userId={user.id}
            />
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Dashboard;