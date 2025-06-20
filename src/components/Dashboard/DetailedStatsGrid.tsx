import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target, Award, BarChart3, Activity, Calendar } from 'lucide-react';
import { TradingStats, AccountBalance } from '../../types';

interface DetailedStatsGridProps {
  stats: TradingStats;
  accountBalance: AccountBalance | null;
}

const DetailedStatsGrid: React.FC<DetailedStatsGridProps> = ({ stats, accountBalance }) => {
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

  const netPnL = stats.totalPnL || 0;
  const winRate = stats.winRate || 0;
  const profitFactor = stats.profitFactor || 0;
  const totalTrades = stats.totalTrades || 0;

  const mainStats = [
    {
      label: 'Net P&L',
      value: formatCurrency(netPnL),
      icon: DollarSign,
      color: netPnL >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
      bgColor: netPnL >= 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20',
      change: netPnL >= 0 ? '+' : '',
      large: true
    },
    {
      label: 'Trades',
      value: totalTrades.toString(),
      subValue: '124',
      icon: BarChart3,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      label: 'Win Rate %',
      value: formatPercentage(winRate),
      subValue: '283.21',
      icon: Target,
      color: winRate >= 50 ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400',
      bgColor: winRate >= 50 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'
    },
    {
      label: 'Profit Factor',
      value: formatNumber(profitFactor, 2),
      subValue: '283.21',
      icon: Award,
      color: profitFactor >= 1.5 ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400',
      bgColor: profitFactor >= 1.5 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'
    },
    {
      label: 'Missed Trades',
      value: '31',
      icon: Activity,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    }
  ];

  const detailedStats = [
    {
      label: 'Rules Followed',
      value: '73%',
      color: 'text-green-600 dark:text-green-400'
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
    },
    {
      label: 'Largest Loss',
      value: formatCurrency(Math.abs(stats.largestLoss)),
      color: 'text-red-600 dark:text-red-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {/* Main Stats */}
      {mainStats.map((stat, index) => (
        <div
          key={index}
          className={`${stat.bgColor} rounded-lg p-4 border border-gray-200 dark:border-gray-700 ${
            stat.large ? 'md:col-span-2' : ''
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              {stat.label}
            </span>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className={`text-2xl font-bold ${stat.color}`}>
              {stat.change}{stat.value}
            </span>
            {stat.subValue && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {stat.subValue}
              </span>
            )}
          </div>
        </div>
      ))}

      {/* Detailed Stats Row */}
      <div className="md:col-span-5 grid grid-cols-2 md:grid-cols-5 gap-4 mt-2">
        {detailedStats.map((stat, index) => (
          <div key={index} className="text-center">
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