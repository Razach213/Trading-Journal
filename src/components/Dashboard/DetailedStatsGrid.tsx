import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target, Award, BarChart3, Activity, Calendar, PiggyBank } from 'lucide-react';
import { TradingStats, AccountBalance } from '../../types';

interface DetailedStatsGridProps {
  stats: TradingStats;
  accountBalance: AccountBalance | null;
  missedTradesCount?: number;
}

const DetailedStatsGrid: React.FC<DetailedStatsGridProps> = ({ 
  stats, 
  accountBalance, 
  missedTradesCount = 0 
}) => {
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
    return `${value.toFixed(1)}%`;
  };

  const formatNumber = (value: number | null | undefined, decimals: number = 2) => {
    if (value === null || value === undefined || isNaN(value)) {
      return '0.00';
    }
    return value.toFixed(decimals);
  };

  const netPnL = accountBalance?.totalPnL || stats.totalPnL || 0;
  const winRate = stats.winRate || 0;
  const profitFactor = stats.profitFactor || 0;
  const totalTrades = stats.totalTrades || 0;
  const startingBalance = accountBalance?.startingBalance || 0;

  const mainStats = [
    {
      label: 'Starting Balance',
      value: formatCurrency(startingBalance),
      icon: PiggyBank,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      change: '',
      subValue: 'Initial capital',
      large: false
    },
    {
      label: 'Net P&L',
      value: formatCurrency(netPnL),
      icon: DollarSign,
      color: netPnL >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
      bgColor: netPnL >= 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20',
      change: netPnL >= 0 ? '+' : '',
      subValue: netPnL >= 0 ? 'Profitable' : 'Loss',
      large: true
    },
    {
      label: 'Trades',
      value: totalTrades.toString(),
      subValue: `${stats.winningTrades}W ${stats.losingTrades}L`,
      icon: BarChart3,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      label: 'Win Rate %',
      value: formatPercentage(winRate),
      subValue: `${stats.winningTrades + stats.losingTrades} closed`,
      icon: Target,
      color: winRate >= 50 ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400',
      bgColor: winRate >= 50 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'
    },
    {
      label: 'Profit Factor',
      value: formatNumber(profitFactor, 2),
      subValue: profitFactor > 0 ? 'Profitable' : 'Unprofitable',
      icon: Award,
      color: profitFactor >= 1.5 ? 'text-green-600 dark:text-green-400' : profitFactor >= 1 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400',
      bgColor: profitFactor >= 1.5 ? 'bg-green-50 dark:bg-green-900/20' : profitFactor >= 1 ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-red-50 dark:bg-red-900/20'
    }
  ];

  const detailedStats = [
    {
      label: 'Current Balance',
      value: formatCurrency(accountBalance?.currentBalance || startingBalance),
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      label: 'Total Return',
      value: `${accountBalance?.totalReturnPercent >= 0 ? '+' : ''}${(accountBalance?.totalReturnPercent || 0).toFixed(2)}%`,
      color: (accountBalance?.totalReturnPercent || 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
    },
    {
      label: 'Average Winner',
      value: formatCurrency(stats.avgWin),
      color: 'text-green-600 dark:text-green-400'
    },
    {
      label: 'Average Loser',
      value: formatCurrency(Math.abs(stats.avgLoss)),
      color: 'text-red-600 dark:text-red-400'
    },
    {
      label: 'Largest Profit',
      value: formatCurrency(stats.largestWin),
      color: 'text-green-600 dark:text-green-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {/* Main Stats */}
      {mainStats.map((stat, index) => (
        <div
          key={index}
          className={`${stat.bgColor} rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1 ${
            stat.large ? 'md:col-span-2' : ''
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              {stat.label}
            </span>
            <div className={`p-2 rounded-lg ${stat.bgColor.replace('50', '100').replace('900/20', '800/30')}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className={`text-2xl font-bold ${stat.color}`}>
              {stat.change}{stat.value}
            </span>
          </div>
          {stat.subValue && (
            <div className="mt-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {stat.subValue}
              </span>
            </div>
          )}
        </div>
      ))}

      {/* Detailed Stats Row */}
      <div className="md:col-span-5 grid grid-cols-2 md:grid-cols-5 gap-4 mt-2">
        {detailedStats.map((stat, index) => (
          <div key={index} className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-sm transition-shadow">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              {stat.label}
            </div>
            <div className={`text-lg font-semibold ${stat.color}`}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetailedStatsGrid;