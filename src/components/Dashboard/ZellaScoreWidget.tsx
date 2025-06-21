import React, { useState } from 'react';
import { TrendingUp, Award, Target, BarChart3, Edit2, Save, X } from 'lucide-react';
import { TradingStats, AccountBalance } from '../../types';

interface ZellaScoreWidgetProps {
  score: number;
  stats: TradingStats;
  accountBalance: AccountBalance | null;
  onUpdateBalance: (newBalance: number) => Promise<void>;
}

const ZellaScoreWidget: React.FC<ZellaScoreWidgetProps> = ({ 
  score, 
  stats, 
  accountBalance, 
  onUpdateBalance 
}) => {
  const [isEditingBalance, setIsEditingBalance] = useState(false);
  const [newBalance, setNewBalance] = useState(accountBalance?.startingBalance?.toString() || '10000');

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
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const handleSaveBalance = async () => {
    const balance = parseFloat(newBalance);
    if (!isNaN(balance) && balance > 0) {
      await onUpdateBalance(balance);
      setIsEditingBalance(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-600';
    if (score >= 60) return 'from-yellow-500 to-orange-600';
    if (score >= 40) return 'from-orange-500 to-red-600';
    return 'from-red-500 to-rose-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Average';
    return 'Needs Improvement';
  };

  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Zella Score */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Zella Score</h3>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <BarChart3 className="h-4 w-4 inline mr-1" />
            Updated
          </div>
        </div>
        
        <div className="text-center mb-6">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="url(#scoreGradient)"
                strokeWidth="8"
                fill="none"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444"} />
                  <stop offset="100%" stopColor={score >= 80 ? "#059669" : score >= 60 ? "#d97706" : "#dc2626"} />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-3xl font-bold ${getScoreColor(score)} dark:text-white`}>
                  {score}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  +1
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
              Your Zella Score: {score}
            </div>
            <div className={`text-xs font-medium ${getScoreColor(score)}`}>
              {getScoreLabel(score)}
            </div>
          </div>
        </div>

        {/* Score breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Win Rate</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatPercentage(stats.winRate)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Profit Factor</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {(stats.profitFactor || 0).toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Avg win/loss</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {stats.avgLoss > 0 ? (stats.avgWin / Math.abs(stats.avgLoss)).toFixed(2) : '0.00'}
            </span>
          </div>
        </div>
      </div>

      {/* Account Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Summary</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Starting Balance</span>
            <div className="flex items-center space-x-2">
              {isEditingBalance ? (
                <div className="flex items-center space-x-1">
                  <input
                    type="number"
                    value={newBalance}
                    onChange={(e) => setNewBalance(e.target.value)}
                    className="w-24 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    onKeyPress={(e) => e.key === 'Enter' && handleSaveBalance()}
                    autoFocus
                  />
                  <button
                    onClick={handleSaveBalance}
                    className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                  >
                    <Save className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingBalance(false);
                      setNewBalance(accountBalance?.startingBalance?.toString() || '10000');
                    }}
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatCurrency(accountBalance?.startingBalance || 0)}
                  </span>
                  <button
                    onClick={() => setIsEditingBalance(true)}
                    className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <Edit2 className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Current Balance</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {formatCurrency(accountBalance?.currentBalance || 0)}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Total P&L</span>
            <span className={`text-sm font-medium ${
              (accountBalance?.totalPnL || 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {formatCurrency(accountBalance?.totalPnL || 0)}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Total Return</span>
            <span className={`text-sm font-medium ${
              (accountBalance?.totalReturnPercent || 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {formatPercentage(accountBalance?.totalReturnPercent || 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Award className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
          Performance Insights
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {stats.winningTrades} winning trades
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {stats.losingTrades} losing trades
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Best trade: {formatCurrency(stats.largestWin)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZellaScoreWidget;