import React, { useState } from 'react';
import { Plus, Filter, Calendar, Eye, Settings, MoreHorizontal, TrendingUp, TrendingDown, BarChart3, Target, Award, DollarSign } from 'lucide-react';
import { User, Trade, TradingStats, AccountBalance, Playbook } from '../../types';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import ProfessionalStatsGrid from './ProfessionalStatsGrid';
import ProfessionalChartsSection from './ProfessionalChartsSection';
import ProfessionalTradesTable from './ProfessionalTradesTable';
import ProfessionalCalendar from './ProfessionalCalendar';
import ZellaScoreWidget from './ZellaScoreWidget';

interface ProfessionalDashboardProps {
  user: User;
  trades: Trade[];
  stats: TradingStats;
  accountBalance: AccountBalance | null;
  playbooks: Playbook[];
  loading: boolean;
  error: string | null;
  onAddTrade: () => void;
  onUpdateTrade: (tradeId: string, updates: Partial<Trade>) => void;
  onDeleteTrade: (tradeId: string) => void;
  onUpdateBalance: (newBalance: number) => Promise<void>;
}

const ProfessionalDashboard: React.FC<ProfessionalDashboardProps> = ({
  user,
  trades,
  stats,
  accountBalance,
  playbooks,
  loading,
  error,
  onAddTrade,
  onUpdateTrade,
  onDeleteTrade,
  onUpdateBalance
}) => {
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'overview' | 'detailed'>('overview');

  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return '$0.00';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatPercentage = (value: number | null | undefined) => {
    if (value === null || value === undefined || isNaN(value)) {
      return '0.0%';
    }
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  // Calculate key metrics
  const netPnL = accountBalance?.totalPnL || 0;
  const tradeExpectancy = stats.totalTrades > 0 ? netPnL / stats.totalTrades : 0;
  const profitFactor = stats.profitFactor || 0;
  const winRate = stats.winRate || 0;
  const avgWinLoss = stats.avgLoss > 0 ? stats.avgWin / stats.avgLoss : 0;

  // Get recent trades for the table
  const recentTrades = trades
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  // Calculate Zella Score (0-100)
  const calculateZellaScore = () => {
    let score = 0;
    
    // Win Rate (0-30 points)
    if (winRate >= 60) score += 30;
    else if (winRate >= 50) score += 25;
    else if (winRate >= 40) score += 20;
    else if (winRate >= 30) score += 15;
    else score += Math.max(0, winRate / 2);
    
    // Profit Factor (0-25 points)
    if (profitFactor >= 2) score += 25;
    else if (profitFactor >= 1.5) score += 20;
    else if (profitFactor >= 1.2) score += 15;
    else if (profitFactor >= 1) score += 10;
    else score += Math.max(0, profitFactor * 5);
    
    // Average Win/Loss Ratio (0-20 points)
    if (avgWinLoss >= 2) score += 20;
    else if (avgWinLoss >= 1.5) score += 15;
    else if (avgWinLoss >= 1) score += 10;
    else score += Math.max(0, avgWinLoss * 5);
    
    // Total Return (0-25 points)
    const totalReturn = accountBalance?.totalReturnPercent || 0;
    if (totalReturn >= 20) score += 25;
    else if (totalReturn >= 15) score += 20;
    else if (totalReturn >= 10) score += 15;
    else if (totalReturn >= 5) score += 10;
    else if (totalReturn >= 0) score += 5;
    
    return Math.min(100, Math.max(0, Math.round(score)));
  };

  const zellaScore = calculateZellaScore();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Dashboard
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Good morning Harry!
                </p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <Eye className="h-4 w-4" />
                <span>Last imported 2 months ago</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                </button>
                <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <Calendar className="h-4 w-4" />
                  <span>Date range</span>
                </button>
                <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <span>All Accounts</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <Settings className="h-4 w-4" />
                  <span>Edit Widgets</span>
                </button>
                <button
                  onClick={onAddTrade}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Import Trades</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Main Stats */}
          <div className="lg:col-span-3 space-y-8">
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {/* Net P&L */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Net P&L</span>
                  <MoreHorizontal className="h-4 w-4 text-gray-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {formatCurrency(netPnL)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">12</div>
              </div>

              {/* Trade Expectancy */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Trade Expectancy</span>
                  <MoreHorizontal className="h-4 w-4 text-gray-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {formatCurrency(tradeExpectancy)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {formatCurrency(tradeExpectancy)}
                </div>
              </div>

              {/* Profit Factor */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Profit Factor</span>
                  <MoreHorizontal className="h-4 w-4 text-gray-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {profitFactor.toFixed(4)}
                </div>
                <div className="flex items-center">
                  <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mr-2">
                    <div 
                      className="h-2 bg-green-500 rounded-full" 
                      style={{ width: `${Math.min(profitFactor * 50, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Win % */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Win %</span>
                  <MoreHorizontal className="h-4 w-4 text-gray-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {formatPercentage(winRate)}
                </div>
                <div className="flex items-center">
                  <div className="w-16 h-16 relative">
                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="2"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                        strokeDasharray={`${winRate}, 100`}
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Avg win/loss trade */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Avg win/loss trade</span>
                  <MoreHorizontal className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="text-sm font-medium text-green-600 dark:text-green-400">
                    {formatCurrency(stats.avgWin)}
                  </div>
                  <div className="text-sm font-medium text-red-600 dark:text-red-400">
                    {formatCurrency(Math.abs(stats.avgLoss))}
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="flex-1 h-2 bg-green-500 rounded-l"></div>
                  <div className="flex-1 h-2 bg-red-500 rounded-r"></div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Daily Net Cumulative P&L Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Daily Net Cumulative P&L
                  </h3>
                  <MoreHorizontal className="h-4 w-4 text-gray-400" />
                </div>
                <div className="h-64">
                  <ProfessionalChartsSection trades={trades} type="cumulative" />
                </div>
              </div>

              {/* Net Daily P&L Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Net Daily P&L
                  </h3>
                  <MoreHorizontal className="h-4 w-4 text-gray-400" />
                </div>
                <div className="h-64">
                  <ProfessionalChartsSection trades={trades} type="daily" />
                </div>
              </div>
            </div>

            {/* Trades Table and Calendar */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Open Positions / Recent Trades */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-4">
                    <button className="text-sm font-medium text-gray-900 dark:text-white border-b-2 border-blue-600 pb-2">
                      Open Positions
                    </button>
                    <button className="text-sm font-medium text-gray-500 dark:text-gray-400 pb-2">
                      Recent Trades
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <ProfessionalTradesTable 
                    trades={recentTrades} 
                    onUpdateTrade={onUpdateTrade}
                    onDeleteTrade={onDeleteTrade}
                  />
                </div>
              </div>

              {/* Calendar */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    December 2023
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                      <span className="text-gray-400">‹</span>
                    </button>
                    <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                      <span className="text-gray-400">›</span>
                    </button>
                    <MoreHorizontal className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <ProfessionalCalendar trades={trades} />
              </div>
            </div>
          </div>

          {/* Right Sidebar - Zella Score */}
          <div className="lg:col-span-1">
            <ZellaScoreWidget 
              score={zellaScore}
              stats={stats}
              accountBalance={accountBalance}
              onUpdateBalance={onUpdateBalance}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;