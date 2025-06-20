import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target, Award, BarChart3 } from 'lucide-react';
import { TradingStats } from '../../types';

interface StatsCardsProps {
  stats: TradingStats;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
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

  // Safe calculations with null checks
  const totalPnL = stats.totalPnL || 0;
  const winRate = stats.winRate || 0;
  const profitFactor = stats.profitFactor || 0;
  const totalTrades = stats.totalTrades || 0;

  const cards = [
    {
      title: 'Total P&L',
      value: formatCurrency(totalPnL),
      icon: DollarSign,
      color: totalPnL >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
      bgColor: totalPnL >= 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20',
      iconBg: totalPnL >= 0 ? 'bg-green-600 dark:bg-green-500' : 'bg-red-600 dark:bg-red-500',
      change: totalPnL >= 0 ? '+' : '',
      gradient: totalPnL >= 0 ? 'from-green-500 to-emerald-600' : 'from-red-500 to-rose-600',
      status: totalPnL >= 0 ? 'Profitable' : totalPnL < 0 ? 'Loss' : 'No Trades',
      statusColor: totalPnL >= 0 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : totalPnL < 0 ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    },
    {
      title: 'Win Rate',
      value: formatPercentage(winRate),
      icon: Target,
      color: winRate >= 50 ? 'text-green-600 dark:text-green-400' : winRate > 0 ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-600 dark:text-gray-400',
      bgColor: winRate >= 50 ? 'bg-green-50 dark:bg-green-900/20' : winRate > 0 ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-gray-50 dark:bg-gray-800',
      iconBg: winRate >= 50 ? 'bg-green-600 dark:bg-green-500' : winRate > 0 ? 'bg-yellow-600 dark:bg-yellow-500' : 'bg-gray-600 dark:bg-gray-500',
      change: '',
      gradient: winRate >= 50 ? 'from-green-500 to-emerald-600' : winRate > 0 ? 'from-yellow-500 to-orange-600' : 'from-gray-500 to-gray-600',
      status: winRate >= 50 ? 'Excellent' : winRate >= 30 ? 'Good' : winRate > 0 ? 'Needs Work' : 'No Data',
      statusColor: winRate >= 50 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : winRate >= 30 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' : winRate > 0 ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    },
    {
      title: 'Total Trades',
      value: totalTrades.toString(),
      icon: BarChart3,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconBg: 'bg-blue-600 dark:bg-blue-500',
      change: '',
      gradient: 'from-blue-500 to-cyan-600',
      status: totalTrades > 50 ? 'Very Active' : totalTrades > 20 ? 'Active' : totalTrades > 0 ? 'Getting Started' : 'New User',
      statusColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
    },
    {
      title: 'Profit Factor',
      value: formatNumber(profitFactor, 2),
      icon: Award,
      color: profitFactor >= 1.5 ? 'text-green-600 dark:text-green-400' : profitFactor >= 1 ? 'text-yellow-600 dark:text-yellow-400' : profitFactor > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400',
      bgColor: profitFactor >= 1.5 ? 'bg-green-50 dark:bg-green-900/20' : profitFactor >= 1 ? 'bg-yellow-50 dark:bg-yellow-900/20' : profitFactor > 0 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-gray-800',
      iconBg: profitFactor >= 1.5 ? 'bg-green-600 dark:bg-green-500' : profitFactor >= 1 ? 'bg-yellow-600 dark:bg-yellow-500' : profitFactor > 0 ? 'bg-red-600 dark:bg-red-500' : 'bg-gray-600 dark:bg-gray-500',
      change: '',
      gradient: profitFactor >= 1.5 ? 'from-green-500 to-emerald-600' : profitFactor >= 1 ? 'from-yellow-500 to-orange-600' : profitFactor > 0 ? 'from-red-500 to-rose-600' : 'from-gray-500 to-gray-600',
      status: profitFactor >= 1.5 ? 'Excellent' : profitFactor >= 1 ? 'Profitable' : profitFactor > 0 ? 'Unprofitable' : 'No Data',
      statusColor: profitFactor >= 1.5 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : profitFactor >= 1 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' : profitFactor > 0 ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div key={index} className={`${card.bgColor} rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1`}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{card.title}</p>
              <div className="flex items-baseline">
                <p className={`text-2xl font-bold ${card.color}`}>
                  {card.change}{card.value}
                </p>
              </div>
              <div className="mt-2">
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${card.statusColor}`}>
                  {card.color.includes('green') ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : card.color.includes('red') ? (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  ) : (
                    <BarChart3 className="h-3 w-3 mr-1" />
                  )}
                  {card.status}
                </div>
              </div>
              
              {/* Additional info for better understanding */}
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {card.title === 'Total P&L' && (
                  <span>
                    {stats.winningTrades > 0 || stats.losingTrades > 0 
                      ? `${stats.winningTrades} wins, ${stats.losingTrades} losses`
                      : 'Complete trades to see P&L'
                    }
                  </span>
                )}
                {card.title === 'Win Rate' && (
                  <span>
                    {stats.winningTrades + stats.losingTrades > 0 
                      ? `Based on ${stats.winningTrades + stats.losingTrades} closed trades`
                      : 'Close trades to calculate'
                    }
                  </span>
                )}
                {card.title === 'Total Trades' && (
                  <span>
                    {stats.totalTrades > 0 
                      ? `${stats.totalTrades - (stats.winningTrades + stats.losingTrades)} open trades`
                      : 'Start by adding your first trade'
                    }
                  </span>
                )}
                {card.title === 'Profit Factor' && (
                  <span>
                    {profitFactor > 0 
                      ? `Wins/Losses ratio: ${formatNumber(profitFactor)}`
                      : 'Complete profitable trades'
                    }
                  </span>
                )}
              </div>
            </div>
            <div className={`bg-gradient-to-r ${card.gradient} p-3 rounded-lg shadow-lg`}>
              <card.icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;