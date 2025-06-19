import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Edit2, Check, X } from 'lucide-react';

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
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white col-span-full">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Starting Balance */}
        <div className="text-center md:text-left">
          <div className="flex items-center justify-between mb-2">
            <p className="text-blue-100 text-sm font-medium">Starting Balance</p>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-200 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
                title="Edit starting balance"
              >
                <Edit2 className="h-4 w-4" />
              </button>
            ) : (
              <div className="flex space-x-1">
                <button
                  onClick={handleSave}
                  className="text-green-200 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={handleCancel}
                  className="text-red-200 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
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
              className="bg-white/20 text-white placeholder-blue-200 border border-white/30 rounded-lg px-3 py-2 text-lg font-bold w-full focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder="Enter balance"
              autoFocus
            />
          ) : (
            <p className="text-2xl font-bold">{formatCurrency(startingBalance)}</p>
          )}
        </div>

        {/* Current Balance */}
        <div className="text-center md:text-left">
          <p className="text-blue-100 text-sm font-medium mb-2">Current Balance</p>
          <p className="text-2xl font-bold">{formatCurrency(currentBalance)}</p>
          <div className="flex items-center justify-center md:justify-start mt-1">
            {totalPnL >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-300 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-300 mr-1" />
            )}
            <span className={`text-sm ${totalPnL >= 0 ? 'text-green-300' : 'text-red-300'}`}>
              {formatCurrency(Math.abs(totalPnL))}
            </span>
          </div>
        </div>

        {/* Total P&L */}
        <div className="text-center md:text-left">
          <p className="text-blue-100 text-sm font-medium mb-2">Total P&L</p>
          <p className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-300' : 'text-red-300'}`}>
            {totalPnL >= 0 ? '+' : ''}{formatCurrency(totalPnL)}
          </p>
          <p className="text-blue-200 text-sm">
            Since start
          </p>
        </div>

        {/* Total Return */}
        <div className="text-center md:text-left">
          <p className="text-blue-100 text-sm font-medium mb-2">Total Return</p>
          <p className={`text-2xl font-bold ${totalReturn >= 0 ? 'text-green-300' : 'text-red-300'}`}>
            {formatPercentage(totalReturn)}
          </p>
          <p className="text-blue-200 text-sm">
            ROI
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between text-sm text-blue-200 mb-2">
          <span>Account Performance</span>
          <span>{formatPercentage(totalReturn)}</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              totalReturn >= 0 ? 'bg-green-400' : 'bg-red-400'
            }`}
            style={{
              width: `${Math.min(Math.abs(totalReturn), 100)}%`
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default AccountBalanceCard;