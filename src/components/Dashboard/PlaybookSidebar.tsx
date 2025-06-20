import React from 'react';
import { BookOpen, TrendingUp, Target, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Playbook, TradingStats, AccountBalance } from '../../types';

interface PlaybookSidebarProps {
  playbooks: Playbook[];
  stats: TradingStats;
  accountBalance: AccountBalance | null;
}

const PlaybookSidebar: React.FC<PlaybookSidebarProps> = ({ playbooks, stats, accountBalance }) => {
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

  const netPnL = accountBalance?.totalPnL || 0;

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
              (accountBalance?.totalReturnPercent || 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {formatCurrency(1649.94)}
            </span>
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
          <div className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm text-gray-900 dark:text-white font-medium">Opening Drive</span>
            <button className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
              Create new playbook
            </button>
          </div>
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
            <span className="text-sm font-medium text-gray-900 dark:text-white">8/9</span>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: '89%' }}></div>
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
            <div className="w-4 h-4 border border-gray-300 dark:border-gray-600 mt-0.5 flex-shrink-0"></div>
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
    </div>
  );
};

export default PlaybookSidebar;