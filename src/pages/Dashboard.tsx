import React, { useState, useEffect, useRef } from 'react';
import { Plus, TrendingUp, DollarSign, Target, Award, BookOpen, BarChart3, Activity, Calendar, Settings, AlertCircle, FileText } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTrades } from '../hooks/useTrades';
import { useAccountBalance } from '../hooks/useAccountBalance';
import { usePlaybooks } from '../hooks/usePlaybooks';
import AdvancedPerformanceChart from '../components/Dashboard/AdvancedPerformanceChart';
import DetailedStatsGrid from '../components/Dashboard/DetailedStatsGrid';
import AccountBalanceCard from '../components/Dashboard/AccountBalanceCard';
import TradeTable from '../components/Dashboard/TradeTable';
import PlaybookSidebar from '../components/Dashboard/PlaybookSidebar';
import AddTradeModal from '../components/Dashboard/AddTradeModal';
import StartingBalanceModal from '../components/Dashboard/StartingBalanceModal';
import ErrorBoundary from '../components/ErrorBoundary';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { accountBalance, loading: balanceLoading, needsSetup, createAccountBalance, updateStartingBalance } = useAccountBalance(user?.id);
  const { trades, stats, loading, error, addTrade, updateTrade, deleteTrade } = useTrades(user?.id);
  const { playbooks, addPlaybook } = usePlaybooks(user?.id);
  const [showAddTradeModal, setShowAddTradeModal] = useState(false);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Refs for auto-scrolling
  const addTradeButtonRef = useRef<HTMLButtonElement>(null);
  const balanceButtonRef = useRef<HTMLButtonElement>(null);

  // Show balance setup modal for new users
  useEffect(() => {
    if (!balanceLoading && needsSetup && user) {
      setShowBalanceModal(true);
    }
  }, [balanceLoading, needsSetup, user]);

  // Auto-scroll to modal when opened
  useEffect(() => {
    if (showAddTradeModal || showBalanceModal) {
      // Small delay to ensure modal is rendered
      const timer = setTimeout(() => {
        // Scroll to top of page to ensure modal is visible
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [showAddTradeModal, showBalanceModal]);

  // Handle Add Trade button click with scroll
  const handleAddTradeClick = () => {
    setShowAddTradeModal(true);
    
    // Ensure the page scrolls to show the modal
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 50);
  };

  // Handle Balance button click with scroll
  const handleBalanceClick = () => {
    setShowBalanceModal(true);
    
    // Ensure the page scrolls to show the modal
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 50);
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

  // Show loading state while account balance is being set up
  if (balanceLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Setting up your account...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we initialize your trading dashboard
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    { 
      id: 'overview', 
      label: 'Overview', 
      icon: BarChart3,
      count: null
    },
    { 
      id: 'playbook-rules', 
      label: 'Playbook Rules', 
      icon: BookOpen,
      count: playbooks.length
    },
    { 
      id: 'executed-trades', 
      label: 'Executed Trades', 
      icon: Activity,
      count: trades.filter(t => t.status === 'closed').length
    },
    { 
      id: 'missed-trades', 
      label: 'Missed Trades', 
      icon: Target,
      count: trades.filter(trade => 
        trade.notes?.toLowerCase().includes('missed') || 
        trade.tags.some(tag => tag.toLowerCase().includes('missed'))
      ).length
    },
    { 
      id: 'notes', 
      label: 'Notes', 
      icon: FileText,
      count: trades.filter(t => t.notes && t.notes.trim().length > 0).length
    }
  ];

  // Calculate missed trades
  const missedTrades = trades.filter(trade => 
    trade.notes?.toLowerCase().includes('missed') || 
    trade.tags.some(tag => tag.toLowerCase().includes('missed'))
  );

  // Get trades with notes
  const tradesWithNotes = trades.filter(t => t.notes && t.notes.trim().length > 0);

  const handleCreateBalance = async (balance: number) => {
    try {
      await createAccountBalance(balance);
      setShowBalanceModal(false);
    } catch (error) {
      console.error('Error creating account balance:', error);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Account Balance Card */}
            {accountBalance && (
              <AccountBalanceCard
                startingBalance={accountBalance.startingBalance}
                currentBalance={accountBalance.currentBalance}
                totalPnL={accountBalance.totalPnL}
                totalReturn={accountBalance.totalReturnPercent}
                onUpdateBalance={updateStartingBalance}
              />
            )}

            {/* Stats Grid */}
            <DetailedStatsGrid 
              stats={stats} 
              accountBalance={accountBalance}
              missedTradesCount={missedTrades.length}
            />

            {/* Performance Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Daily Net Cumulative P&L
                </h2>
                <div className="flex items-center space-x-2">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Balance: <span className="font-medium text-gray-900 dark:text-white">
                      ${accountBalance?.currentBalance?.toLocaleString() || '0'}
                    </span>
                  </div>
                </div>
              </div>
              <AdvancedPerformanceChart trades={trades} />
            </div>

            {/* Recent Trades */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Trades</h3>
              </div>
              <TradeTable
                trades={trades.slice(0, 5)} // Show only 5 recent trades
                onUpdateTrade={updateTrade}
                onDeleteTrade={deleteTrade}
                loading={loading}
                error={error}
              />
            </div>
          </div>
        );

      case 'playbook-rules':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
              <div className="text-center mb-6">
                <BookOpen className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Trading Rules & Playbooks</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {playbooks.length > 0 
                    ? `You have ${playbooks.length} playbook${playbooks.length > 1 ? 's' : ''} created`
                    : 'Create your first trading playbook to define your strategy rules'
                  }
                </p>
              </div>
              
              {playbooks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {playbooks.map((playbook) => (
                    <div key={playbook.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-lg">{playbook.title}</h4>
                        <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                          {playbook.strategy}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{playbook.description}</p>
                      
                      {playbook.entryRules && (
                        <div className="mb-4">
                          <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Entry Rules:</h5>
                          <p className="text-xs text-gray-600 dark:text-gray-400 bg-green-50 dark:bg-green-900/20 p-3 rounded">
                            {playbook.entryRules}
                          </p>
                        </div>
                      )}
                      
                      {playbook.exitRules && (
                        <div className="mb-4">
                          <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Exit Rules:</h5>
                          <p className="text-xs text-gray-600 dark:text-gray-400 bg-red-50 dark:bg-red-900/20 p-3 rounded">
                            {playbook.exitRules}
                          </p>
                        </div>
                      )}
                      
                      {playbook.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-4">
                          {playbook.tags.map((tag, index) => (
                            <span key={index} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center">
                  <button
                    onClick={() => window.location.href = '/playbooks'}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create First Playbook
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case 'executed-trades':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-green-50 dark:bg-green-900/20">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                    Executed Trades
                  </h3>
                  <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm px-3 py-1 rounded-full font-medium">
                    {trades.filter(t => t.status === 'closed').length} Completed
                  </span>
                </div>
              </div>
              <TradeTable
                trades={trades.filter(trade => trade.status === 'closed')}
                onUpdateTrade={updateTrade}
                onDeleteTrade={deleteTrade}
                loading={loading}
                error={error}
              />
            </div>
          </div>
        );

      case 'missed-trades':
        return (
          <div className="space-y-6">
            {missedTrades.length > 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-orange-50 dark:bg-orange-900/20">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <Target className="h-5 w-5 mr-2 text-orange-600 dark:text-orange-400" />
                      Missed Trades
                    </h3>
                    <span className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-sm px-3 py-1 rounded-full font-medium">
                      {missedTrades.length} Missed
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Analyze missed opportunities to improve your trading strategy
                  </p>
                </div>
                <TradeTable
                  trades={missedTrades}
                  onUpdateTrade={updateTrade}
                  onDeleteTrade={deleteTrade}
                  loading={loading}
                  error={error}
                />
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                <Target className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">No Missed Trades</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  Track trades you missed to improve your strategy. Add "missed" in notes or tags to categorize them.
                </p>
                <div className="space-y-4">
                  <button
                    onClick={handleAddTradeClick}
                    className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Add Missed Trade
                  </button>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    💡 Tip: Use tags like "missed", "opportunity" or add "missed" in trade notes
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'notes':
        return (
          <div className="space-y-6">
            {tradesWithNotes.length > 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                      Trading Notes
                    </h3>
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm px-3 py-1 rounded-full font-medium">
                      {tradesWithNotes.length} Notes
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    All your trading observations and insights
                  </p>
                </div>
                
                <div className="p-6 space-y-6">
                  {tradesWithNotes.map((trade) => (
                    <div key={trade.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <span className="font-semibold text-lg text-gray-900 dark:text-white">{trade.symbol}</span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            trade.type === 'long' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          }`}>
                            {trade.type.toUpperCase()}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            trade.status === 'open' 
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' 
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {trade.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(trade.createdAt).toLocaleDateString()}
                          </div>
                          {trade.pnl !== null && trade.pnl !== undefined && (
                            <div className={`text-sm font-medium ${
                              trade.pnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                            }`}>
                              {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Notes:</h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{trade.notes}</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                          <span>Entry: ${trade.entryPrice}</span>
                          {trade.exitPrice && <span>Exit: ${trade.exitPrice}</span>}
                          <span>Qty: {trade.quantity}</span>
                        </div>
                        
                        {trade.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {trade.tags.map((tag, index) => (
                              <span key={index} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                <FileText className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">No Trading Notes</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  Start adding notes to your trades to track your thoughts, observations, and lessons learned.
                </p>
                <div className="space-y-4">
                  <button
                    onClick={handleAddTradeClick}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Trade with Notes
                  </button>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    💡 Tip: Detailed notes help improve your trading performance over time
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dashboard-container">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Playbook /</span>
                <span className="text-sm text-blue-600 dark:text-blue-400">
                  {playbooks.length > 0 ? playbooks[0].title : 'Opening'}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">/ {tabs.find(t => t.id === activeTab)?.label}</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Trading Dashboard
              </h1>
              {accountBalance && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Account Balance: <span className="font-medium">${accountBalance.currentBalance.toLocaleString()}</span>
                  {accountBalance.totalPnL !== 0 && (
                    <span className={`ml-2 ${accountBalance.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ({accountBalance.totalPnL >= 0 ? '+' : ''}${accountBalance.totalPnL.toFixed(2)})
                    </span>
                  )}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <button
                ref={addTradeButtonRef}
                onClick={handleAddTradeClick}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 btn-hover-lift"
              >
                <Plus className="h-4 w-4" />
                <span>Add Trade</span>
              </button>
              <button 
                ref={balanceButtonRef}
                onClick={handleBalanceClick}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors btn-hover-lift"
                title="Update starting balance"
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
            <nav className="flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                  {tab.count !== null && tab.count > 0 && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      activeTab === tab.id
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="xl:col-span-3">
              {renderTabContent()}
            </div>

            {/* Sidebar */}
            <div className="xl:col-span-1">
              <PlaybookSidebar 
                playbooks={playbooks} 
                stats={stats}
                accountBalance={accountBalance}
                onUpdateBalance={updateStartingBalance}
              />
            </div>
          </div>

          {/* Modals */}
          {showAddTradeModal && (
            <AddTradeModal
              onClose={() => setShowAddTradeModal(false)}
              onSubmit={addTrade}
              userId={user.id}
            />
          )}

          {showBalanceModal && (
            <StartingBalanceModal
              onClose={() => setShowBalanceModal(false)}
              onSubmit={needsSetup ? handleCreateBalance : updateStartingBalance}
              isFirstTime={needsSetup}
            />
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Dashboard;