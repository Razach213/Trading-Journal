import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTrades } from '../hooks/useTrades';
import { useAccountBalance } from '../hooks/useAccountBalance';
import { 
  Plus, 
  Search,
  Filter,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Target
} from 'lucide-react';
import StatsCards from '../components/Dashboard/StatsCards';
import TradeTable from '../components/Dashboard/TradeTable';
import AddTradeModal from '../components/Dashboard/AddTradeModal';
import PerformanceChart from '../components/Dashboard/PerformanceChart';
import AccountBalanceCard from '../components/Dashboard/AccountBalanceCard';
import ErrorBoundary from '../components/ErrorBoundary';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { trades, stats, loading, error, addTrade, updateTrade, deleteTrade } = useTrades(user?.id);
  const { accountBalance, updateStartingBalance } = useAccountBalance(user?.id);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'closed'>('all');
  const [filterType, setFilterType] = useState<'all' | 'long' | 'short'>('all');

  const filteredTrades = trades.filter(trade => {
    const matchesSearch = trade.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (trade.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
                         (trade.strategy?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesStatus = filterStatus === 'all' || trade.status === filterStatus;
    const matchesType = filterType === 'all' || trade.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const exportData = () => {
    try {
      const csvContent = [
        ['Symbol', 'Type', 'Entry Price', 'Exit Price', 'Quantity', 'Entry Date', 'Exit Date', 'Status', 'P&L', 'Balance After Trade', 'Notes'].join(','),
        ...filteredTrades.map(trade => [
          trade.symbol,
          trade.type,
          trade.entryPrice,
          trade.exitPrice || '',
          trade.quantity,
          new Date(trade.entryDate).toISOString(),
          trade.exitDate ? new Date(trade.exitDate).toISOString() : '',
          trade.status,
          trade.pnl || '',
          trade.balanceAfterTrade || '',
          `"${trade.notes || ''}"`
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `zellax-trades-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Trading Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.displayName}</p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <button
                onClick={exportData}
                disabled={loading || filteredTrades.length === 0}
                className="bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 transform hover:scale-105"
              >
                <Plus className="h-5 w-5" />
                <span>Add Trade</span>
              </button>
            </div>
          </div>
        </div>

        {/* Account Balance Card */}
        <ErrorBoundary>
          <div className="mb-8">
            {accountBalance && (
              <AccountBalanceCard
                startingBalance={accountBalance.startingBalance}
                currentBalance={accountBalance.currentBalance}
                totalPnL={accountBalance.totalPnL}
                totalReturn={accountBalance.totalReturnPercent}
                onUpdateBalance={updateStartingBalance}
              />
            )}
          </div>
        </ErrorBoundary>

        {/* Stats Cards */}
        <ErrorBoundary>
          <StatsCards stats={stats} />
        </ErrorBoundary>

        {/* Performance Chart */}
        <div className="mb-8">
          <ErrorBoundary>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Performance Overview</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>Account Balance Progression</span>
                </div>
              </div>
              <PerformanceChart trades={trades} />
            </div>
          </ErrorBoundary>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Open Trades</p>
                <p className="text-2xl font-bold text-blue-600">
                  {trades.filter(t => t.status === 'open').length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Closed Trades</p>
                <p className="text-2xl font-bold text-green-600">
                  {trades.filter(t => t.status === 'closed').length}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Best Trade</p>
                <p className="text-2xl font-bold text-purple-600">
                  ${(stats.largestWin ?? 0).toFixed(0)}
                </p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Account Growth</p>
                <p className="text-2xl font-bold text-orange-600">
                  {accountBalance ? `${accountBalance.totalReturnPercent.toFixed(1)}%` : '0.0%'}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search trades by symbol, notes, or strategy..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'open' | 'closed')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">All Status</option>
              <option value="open">Open Trades</option>
              <option value="closed">Closed Trades</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'long' | 'short')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">All Types</option>
              <option value="long">Long Trades</option>
              <option value="short">Short Trades</option>
            </select>
          </div>
          
          {(searchTerm || filterStatus !== 'all' || filterType !== 'all') && (
            <div className="mt-3 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {filteredTrades.length} of {trades.length} trades
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                  setFilterType('all');
                }}
                className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Trades Table */}
        <ErrorBoundary>
          <TradeTable 
            trades={filteredTrades} 
            onUpdateTrade={updateTrade}
            onDeleteTrade={deleteTrade}
            loading={loading}
            error={error}
          />
        </ErrorBoundary>

        {/* Add Trade Modal */}
        {showAddModal && (
          <ErrorBoundary>
            <AddTradeModal
              onClose={() => setShowAddModal(false)}
              onSubmit={addTrade}
              userId={user!.id}
            />
          </ErrorBoundary>
        )}
      </div>
    </div>
  );
};

export default Dashboard;