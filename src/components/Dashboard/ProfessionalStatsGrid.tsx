import React from 'react';
import { MoreHorizontal, TrendingUp, TrendingDown } from 'lucide-react';
import { TradingStats, AccountBalance } from '../../types';

interface ProfessionalStatsGridProps {
  stats: TradingStats;
  accountBalance: AccountBalance | null;
}

const ProfessionalStatsGrid: React.FC<ProfessionalStatsGridProps> = ({ stats, accountBalance }) => {
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

  const netPnL = accountBalance?.totalPnL || 0;
  const tradeExpectancy = stats.totalTrades > 0 ? netPnL / stats.totalTrades : 0;
  const profitFactor = stats.profitFactor || 0;
  const winRate = stats.winRate || 0;

  const statsData = [
    {
      label: 'Net P&L',
      value: formatCurrency(netPnL),
      subValue: '12',
      color: netPnL >= 0 ? 'text-green-600' : 'text-red-600'
    },
    {
      label: 'Trade Expectancy',
      value: formatCurrency(tradeExpectancy),
      subValue: formatCurrency(tradeExpectancy),
      color: tradeExpectancy >= 0 ? 'text-green-600' : 'text-red-600'
    },
    {
      label: 'Profit Factor',
      value: profitFactor.toFixed(4),
      subValue: '',
      color: profitFactor >= 1 ? 'text-green-600' : 'text-red-600',
      showProgress: true,
      progressValue: Math.min(profitFactor * 50, 100)
    },
    {
      label: 'Win %',
      value: formatPercentage(winRate),
      subValue: '',
      color: winRate >= 50 ? 'text-green-600' : 'text-yellow-600',
      showCircular: true,
      circularValue: winRate
    },
    {
      label: 'Avg win/loss trade',
      value: '',
      subValue: '',
      color: 'text-gray-900',
      showWinLoss: true,
      avgWin: stats.avgWin,
      avgLoss: Math.abs(stats.avgLoss)
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
      {statsData.map((stat, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</span>
            <MoreHorizontal className="h-4 w-4 text-gray-400" />
          </div>
          
          {stat.showWinLoss ? (
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <div className="text-sm font-medium text-green-600 dark:text-green-400">
                  {formatCurrency(stat.avgWin)}
                </div>
                <div className="text-sm font-medium text-red-600 dark:text-red-400">
                  {formatCurrency(stat.avgLoss)}
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <div className="flex-1 h-2 bg-green-500 rounded-l"></div>
                <div className="flex-1 h-2 bg-red-500 rounded-r"></div>
              </div>
            </div>
          ) : (
            <>
              <div className={`text-2xl font-bold ${stat.color} dark:text-white mb-1`}>
                {stat.value}
              </div>
              
              {stat.showProgress && (
                <div className="flex items-center">
                  <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mr-2">
                    <div 
                      className="h-2 bg-green-500 rounded-full transition-all duration-300" 
                      style={{ width: `${stat.progressValue}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {stat.showCircular && (
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
                        strokeDasharray={`${stat.circularValue}, 100`}
                      />
                    </svg>
                  </div>
                </div>
              )}
              
              {stat.subValue && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {stat.subValue}
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProfessionalStatsGrid;