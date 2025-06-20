import React, { useState } from 'react';
import { Plus, TrendingUp, DollarSign, Target, Award, BookOpen, BarChart3, Activity, Calendar, Settings } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTrades } from '../hooks/useTrades';
import { useAccountBalance } from '../hooks/useAccountBalance';
import { usePlaybooks } from '../hooks/usePlaybooks';
import AdvancedPerformanceChart from '../components/Dashboard/AdvancedPerformanceChart';
import DetailedStatsGrid from '../components/Dashboard/DetailedStatsGrid';
import TradeTable from '../components/Dashboard/TradeTable';
import PlaybookSidebar from '../components/Dashboard/PlaybookSidebar';
import AddTradeModal from '../components/Dashboard/AddTradeModal';
import ErrorBoundary from '../components/ErrorBoundary';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { trades, stats, loading, error, addTrade, updateTrade, deleteTrade } = useTrades(user?.id);
  const { accountBalance, updateStartingBalance } = useAccountBalance(user?.id);
  const { playbooks } = usePlaybooks(user?.id);
  const [showAddTradeModal, setShowAddTradeModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'playbook-rules', label: 'Playbook Rules', icon: BookOpen },
    { id: 'executed-trades', label: 'Executed Trades', icon: Activity },
    { id: 'missed-trades', label: 'Missed Trades', icon: Target },
    { id: 'notes', label: 'Notes', icon: Calendar }
  ];

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Playbook /</span>
                <span className="text-sm text-blue-600 dark:text-blue-400">Opening</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">/ Overview</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Trading Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <button
                onClick={() => setShowAddTradeModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Trade</span>
              </button>
              <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="xl:col-span-3 space-y-6">
              {/* Stats Grid */}
              <DetailedStatsGrid stats={stats} accountBalance={accountBalance} />

              {/* Performance Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Daily Net Cumulative P&L
                  </h2>
                  <div className="flex items-center space-x-2">
                    <button className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                      1D
                    </button>
                    <button className="text-xs px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
                      1W
                    </button>
                    <button className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                      1M
                    </button>
                  </div>
                </div>
                <AdvancedPerformanceChart trades={trades} />
              </div>

              {/* Trades Table */}
              {activeTab === 'overview' && (
                <TradeTable
                  trades={trades.slice(0, 10)} // Show recent trades
                  onUpdateTrade={updateTrade}
                  onDeleteTrade={deleteTrade}
                  loading={loading}
                  error={error}
                />
              )}

              {activeTab === 'executed-trades' && (
                <TradeTable
                  trades={trades.filter(trade => trade.status === 'closed')}
                  onUpdateTrade={updateTrade}
                  onDeleteTrade={deleteTrade}
                  loading={loading}
                  error={error}
                />
              )}

              {activeTab === 'missed-trades' && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
                  <Target className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Missed Trades</h3>
                  <p className="text-gray-600 dark:text-gray-400">Track trades you missed to improve your strategy</p>
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
                  <Calendar className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Notes Yet</h3>
                  <p className="text-gray-600 dark:text-gray-400">Add trading notes and observations</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="xl:col-span-1">
              <PlaybookSidebar 
                playbooks={playbooks} 
                stats={stats}
                accountBalance={accountBalance}
              />
            </div>
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