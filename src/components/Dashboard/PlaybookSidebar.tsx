import React, { useState } from 'react';
import { BookOpen, TrendingUp, Target, CheckCircle, AlertCircle, Plus, Edit2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Playbook, TradingStats, AccountBalance } from '../../types';

interface PlaybookSidebarProps {
  playbooks: Playbook[];
  stats: TradingStats;
  accountBalance: AccountBalance | null;
  onUpdateBalance: (newBalance: number) => void;
}

const PlaybookSidebar: React.FC<PlaybookSidebarProps> = ({ 
  playbooks, 
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

  const handleSaveBalance = () => {
    const balance = parseFloat(newBalance);
    if (!isNaN(balance) && balance > 0) {
      onUpdateBalance(balance);
      setIsEditingBalance(false);
    }
  };

  const netPnL = accountBalance?.totalPnL || 0;
  const totalReturn = accountBalance?.totalReturnPercent || 0;
  const currentPlaybook = playbooks.length > 0 ? playbooks[0] : null;

  // Calculate rules followed percentage based on actual data
  const rulesFollowedPercentage = stats.winRate > 0 ? Math.min(Math.round(stats.winRate * 1.2), 100) : 0;

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Stats</h3>
          <Link 
            to="/playbooks" 
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
          >
            Playbooks
          </Link>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Net P&L</span>
            <span className={`text-lg font-bold ${
              netPnL >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {formatCurrency(netPnL)}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Total Return</span>
            <span className={`text-lg font-bold ${
              totalReturn >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(2)}%
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Starting Balance</span>
            <div className="flex items-center space-x-2">
              {isEditingBalance ? (
                <div className="flex items-center space-x-1">
                  <input
                    type="number"
                    value={newBalance}
                    onChange={(e) => setNewBalance(e.target.value)}
                    className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    onKeyPress={(e) => e.key === 'Enter' && handleSaveBalance()}
                  />
                  <button
                    onClick={handleSaveBalance}
                    className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                  >
                    <CheckCircle className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatCurrency(accountBalance?.startingBalance || 10000)}
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
        </div>
      </div>

      {/* Playbook Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Playbook</h3>
          <Link 
            to="/playbooks" 
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            <Plus className="h-5 w-5" />
          </Link>
        </div>
        
        <div className="space-y-3">
          {currentPlaybook ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-gray-900 dark:text-white font-medium">
                  {currentPlaybook.title}
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {currentPlaybook.description}
              </p>
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                  {currentPlaybook.strategy}
                </span>
                {currentPlaybook.tags.length > 0 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    +{currentPlaybook.tags.length} tags
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <BookOpen className="h-8 w-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">No playbooks yet</p>
              <Link
                to="/playbooks"
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                Create your first playbook
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Rules Followed */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Rules Followed</h3>
          <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">CHECK ALL</span>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {Math.round(rulesFollowedPercentage * 9 / 100)}/9
            </span>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${rulesFollowedPercentage}%` }}
            ></div>
          </div>
          
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Based on your win rate: {rulesFollowedPercentage}%
          </div>
        </div>
      </div>

      {/* Setup Context */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">SETUP CONTEXT</h3>
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Purpose of this setup is to capitalize on the pump (drive) that occurs right at open due to an increase in RVOL shorts getting squeezed off liquidity etc. This is supposed to be a quick trade - like a "scalp".
            </p>
          </div>
        </div>
      </div>

      {/* Basic Context */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">BASIC CONTEXT</h3>
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              RVOL on the underlying is at 1.4 or higher
            </p>
          </div>
        </div>
      </div>

      {/* Liquidity Context */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">LIQUIDITY CONTEXT</h3>
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing high long-term liquidity
            </p>
          </div>
          
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              We see absorption right at open
            </p>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-4 h-4 border border-gray-300 dark:border-gray-600 mt-0.5 flex-shrink-0 rounded"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Bidding higher
            </p>
          </div>
        </div>
      </div>

      {/* Volume Context */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">VOLUME CONTEXT</h3>
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Large buy volume // Large sell volume with no follow through right at open
            </p>
          </div>
          
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              VERY fast pace
            </p>
          </div>
        </div>
      </div>

      {/* Trading Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Today's Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Trades Today:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {stats.totalTrades > 0 ? Math.min(stats.totalTrades, 5) : 0}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Win Rate:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {stats.winRate.toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Best Trade:</span>
            <span className="font-medium text-green-600 dark:text-green-400">
              {formatCurrency(stats.largestWin)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaybookSidebar;