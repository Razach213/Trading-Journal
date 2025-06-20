import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Edit2, Check, X, Calculator, Target } from 'lucide-react';

interface AccountBalanceCardProps {
  startingBalance: number;
  currentBalance: number;
  totalPnL: number;
  totalReturn: number;
  onUpdateBalance: (newBalance: number) => void;
}

const AccountBalanceCard: React.FC<AccountBalanceCardProps> = ({
  startingBalance,
  currentBalance,
  totalPnL,
  totalReturn,
  onUpdateBalance
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newBalance, setNewBalance] = useState(startingBalance.toString());

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const handleSave = () => {
    const balance = parseFloat(newBalance);
    if (!isNaN(balance) && balance > 0) {
      onUpdateBalance(balance);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setNewBalance(startingBalance.toString());
    setIsEditing(false);
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 rounded-xl p-6 text-white col-span-full">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Starting Balance */}
        <div className="text-center md:text-left">
          <div className="flex items-center justify-between mb-2">
            <p className="text-blue-100 dark:text-blue-200 text-sm font-medium flex items-center">
              <Calculator className="h-4 w-4 mr-1" />
              Starting Balance
            </p>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-200 dark:text-blue-300 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
                title="Edit starting balance"
              >
                <Edit2 className="h-4 w-4" />
              </button>
            ) : (
              <div className="flex space-x-1">
                <button
                  onClick={handleSave}
                  className="text-green-200 dark:text-green-300 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={handleCancel}
                  className="text-red-200 dark:text-red-300 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
          {isEditing ? (
            <input
              type="number"
              value={newBalance}
              onChange={(e) => setNewBalance(e.target.value)}
              className="bg-white/20 text-white placeholder-blue-200 dark:placeholder-blue-300 border border-white/30 rounded-lg px-3 py-2 text-lg font-bold w-full focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder="Enter balance"
              autoFocus
            />
          ) : (
            <p className="text-2xl font-bold">{formatCurrency(startingBalance)}</p>
          )}
          <p className="text-blue-200 dark:text-blue-300 text-xs mt-1">
            Initial account value
          </p>
        </div>

        {/* Current Balance */}
        <div className="text-center md:text-left">
          <p className="text-blue-100 dark:text-blue-200 text-sm font-medium mb-2 flex items-center justify-center md:justify-start">
            <DollarSign className="h-4 w-4 mr-1" />
            Current Balance
          </p>
          <p className="text-2xl font-bold">{formatCurrency(currentBalance)}</p>
          <div className="flex items-center justify-center md:justify-start mt-1">
            {totalPnL >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-300 dark:text-green-400 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-300 dark:text-red-400 mr-1" />
            )}
            <span className={`text-sm ${totalPnL >= 0 ? 'text-green-300 dark:text-green-400' : 'text-red-300 dark:text-red-400'}`}>
              {formatCurrency(Math.abs(totalPnL))}
            </span>
          </div>
        </div>

        {/* Total P&L */}
        <div className="text-center md:text-left">
          <p className="text-blue-100 dark:text-blue-200 text-sm font-medium mb-2 flex items-center justify-center md:justify-start">
            <Target className="h-4 w-4 mr-1" />
            Total P&L
          </p>
          <p className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-300 dark:text-green-400' : 'text-red-300 dark:text-red-400'}`}>
            {totalPnL >= 0 ? '+' : ''}{formatCurrency(totalPnL)}
          </p>
          <p className="text-blue-200 dark:text-blue-300 text-xs mt-1">
            All-time profit/loss
          </p>
        </div>

        {/* Total Return */}
        <div className="text-center md:text-left">
          <p className="text-blue-100 dark:text-blue-200 text-sm font-medium mb-2 flex items-center justify-center md:justify-start">
            <TrendingUp className="h-4 w-4 mr-1" />
            Total Return
          </p>
          <p className={`text-2xl font-bold ${totalReturn >= 0 ? 'text-green-300 dark:text-green-400' : 'text-red-300 dark:text-red-400'}`}>
            {formatPercentage(totalReturn)}
          </p>
          <p className="text-blue-200 dark:text-blue-300 text-xs mt-1">
            Return on investment
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between text-sm text-blue-200 dark:text-blue-300 mb-2">
          <span>Account Performance</span>
          <span>{formatPercentage(totalReturn)}</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              totalReturn >= 0 ? 'bg-green-400 dark:bg-green-500' : 'bg-red-400 dark:bg-red-500'
            }`}
            style={{
              width: `${Math.min(Math.abs(totalReturn), 100)}%`
            }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-blue-200 dark:text-blue-300 mt-1">
          <span>0%</span>
          <span>{Math.abs(totalReturn) > 100 ? '100%+' : '100%'}</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="bg-white/10 rounded-lg p-3">
          <div className="text-xs text-blue-200 dark:text-blue-300">Balance Change</div>
          <div className="text-sm font-bold">
            {formatCurrency(currentBalance - startingBalance)}
          </div>
        </div>
        <div className="bg-white/10 rounded-lg p-3">
          <div className="text-xs text-blue-200 dark:text-blue-300">Growth Rate</div>
          <div className="text-sm font-bold">
            {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(1)}%
          </div>
        </div>
        <div className="bg-white/10 rounded-lg p-3">
          <div className="text-xs text-blue-200 dark:text-blue-300">Performance</div>
          <div className="text-sm font-bold">
            {totalReturn >= 10 ? 'Excellent' : totalReturn >= 5 ? 'Good' : totalReturn >= 0 ? 'Positive' : 'Negative'}
          </div>
        </div>
        <div className="bg-white/10 rounded-lg p-3">
          <div className="text-xs text-blue-200 dark:text-blue-300">Status</div>
          <div className="text-sm font-bold">
            {totalPnL >= 0 ? 'Profitable' : 'Loss'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountBalanceCard;