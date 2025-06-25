import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown, Edit2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface AccountBalanceWidgetProps {
  startingBalance: number;
  currentBalance: number;
  totalPnL: number;
  totalReturn: number;
  onUpdateBalance: (field: 'startingBalance' | 'currentBalance', newValue: number) => Promise<void>;
}

const AccountBalanceWidget: React.FC<AccountBalanceWidgetProps> = ({
  startingBalance,
  currentBalance,
  totalPnL,
  totalReturn,
  onUpdateBalance
}) => {
  const [editingField, setEditingField] = useState<'startingBalance' | 'currentBalance' | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const startEditing = (field: 'startingBalance' | 'currentBalance') => {
    setEditingField(field);
    setEditValue(field === 'startingBalance' ? startingBalance.toString() : currentBalance.toString());
  };

  const cancelEditing = () => {
    setEditingField(null);
    setEditValue('');
  };

  const saveBalance = async () => {
    if (!editingField) return;
    
    const numValue = parseFloat(editValue);
    if (isNaN(numValue) || numValue < 0) {
      toast.error('Please enter a valid positive number');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onUpdateBalance(editingField, numValue);
      toast.success(`${editingField === 'startingBalance' ? 'Starting' : 'Current'} balance updated`);
      setEditingField(null);
    } catch (error) {
      console.error('Error updating balance:', error);
      toast.error('Failed to update balance');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine if there are any trades based on P&L and return values
  const hasTrades = totalPnL !== 0 || totalReturn !== 0 || currentBalance !== startingBalance;

  return (
    <motion.div 
      className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 rounded-xl p-6 text-white shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5), 0 8px 10px -6px rgba(59, 130, 246, 0.3)" }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Starting Balance - Editable */}
        <div className="text-center sm:text-left">
          <p className="text-blue-100 dark:text-blue-200 text-sm font-medium mb-2 flex items-center justify-center sm:justify-start">
            Starting Balance
          </p>
          {editingField === 'startingBalance' ? (
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white">
                  $
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="pl-8 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-blue-200 text-lg font-bold w-40"
                  placeholder="0.00"
                  autoFocus
                />
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={saveBalance}
                  disabled={isSubmitting}
                  className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <Save className="h-5 w-5 text-white" />
                  )}
                </button>
                <button
                  onClick={cancelEditing}
                  className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>
          ) : (
            <div 
              className="flex items-center justify-center sm:justify-start space-x-2 cursor-pointer group"
              onClick={() => startEditing('startingBalance')}
            >
              <p className="text-2xl font-bold">{formatCurrency(startingBalance)}</p>
              <Edit2 className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          )}
          <p className="text-blue-200 dark:text-blue-300 text-xs mt-1">
            Initial trading capital
          </p>
        </div>

        {/* Current Balance - Editable */}
        <div className="text-center sm:text-left">
          <p className="text-blue-100 dark:text-blue-200 text-sm font-medium mb-2 flex items-center justify-center sm:justify-start">
            Current Balance
          </p>
          {editingField === 'currentBalance' ? (
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white">
                  $
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="pl-8 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-blue-200 text-lg font-bold w-40"
                  placeholder="0.00"
                  autoFocus
                />
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={saveBalance}
                  disabled={isSubmitting}
                  className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <Save className="h-5 w-5 text-white" />
                  )}
                </button>
                <button
                  onClick={cancelEditing}
                  className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>
          ) : (
            <div 
              className="flex items-center justify-center sm:justify-start space-x-2 cursor-pointer group"
              onClick={() => startEditing('currentBalance')}
            >
              <p className="text-2xl font-bold">{formatCurrency(currentBalance)}</p>
              <Edit2 className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          )}
          <div className="flex items-center justify-center sm:justify-start mt-1">
            {!hasTrades ? (
              <span className="text-sm text-blue-200 dark:text-blue-300">No trading activity yet</span>
            ) : totalPnL >= 0 ? (
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 text-green-300 dark:text-green-400 mr-1" />
                <span className="text-sm text-green-300 dark:text-green-400">
                  {formatCurrency(Math.abs(totalPnL))}
                </span>
              </div>
            ) : (
              <div className="flex items-center">
                <TrendingDown className="h-4 w-4 text-red-300 dark:text-red-400 mr-1" />
                <span className="text-sm text-red-300 dark:text-red-400">
                  {formatCurrency(Math.abs(totalPnL))}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Total P&L */}
        <div className="text-center sm:text-left">
          <p className="text-blue-100 dark:text-blue-200 text-sm font-medium mb-2 flex items-center justify-center sm:justify-start">
            Total P&L
          </p>
          {!hasTrades ? (
            <p className="text-2xl font-bold">$0.00</p>
          ) : (
            <p className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-300 dark:text-green-400' : 'text-red-300 dark:text-red-400'}`}>
              {totalPnL >= 0 ? '+' : ''}{formatCurrency(totalPnL)}
            </p>
          )}
          <p className="text-blue-200 dark:text-blue-300 text-xs mt-1">
            All-time profit/loss
          </p>
        </div>

        {/* Total Return */}
        <div className="text-center sm:text-left">
          <p className="text-blue-100 dark:text-blue-200 text-sm font-medium mb-2 flex items-center justify-center sm:justify-start">
            Total Return
          </p>
          {!hasTrades ? (
            <p className="text-2xl font-bold">0.00%</p>
          ) : (
            <p className={`text-2xl font-bold ${totalReturn >= 0 ? 'text-green-300 dark:text-green-400' : 'text-red-300 dark:text-red-400'}`}>
              {formatPercentage(totalReturn)}
            </p>
          )}
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
          {!hasTrades ? (
            <div className="h-2 rounded-full bg-blue-400 dark:bg-blue-500 w-0"></div>
          ) : (
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                totalReturn >= 0 ? 'bg-green-400 dark:bg-green-500' : 'bg-red-400 dark:bg-red-500'
              }`}
              style={{
                width: `${Math.min(Math.abs(totalReturn), 100)}%`
              }}
            ></div>
          )}
        </div>
        <div className="flex justify-between text-xs text-blue-200 dark:text-blue-300 mt-1">
          <span>0%</span>
          <span>{Math.abs(totalReturn) > 100 ? '100%+' : '100%'}</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="bg-white/10 rounded-lg p-3 hover:bg-white/15 transition-colors">
          <div className="text-xs text-blue-200 dark:text-blue-300">Balance Change</div>
          <div className="text-sm font-bold">
            {formatCurrency(currentBalance - startingBalance)}
          </div>
        </div>
        <div className="bg-white/10 rounded-lg p-3 hover:bg-white/15 transition-colors">
          <div className="text-xs text-blue-200 dark:text-blue-300">Growth Rate</div>
          <div className="text-sm font-bold">
            {!hasTrades ? '0.0%' : `${totalReturn >= 0 ? '+' : ''}${totalReturn.toFixed(1)}%`}
          </div>
        </div>
        <div className="bg-white/10 rounded-lg p-3 hover:bg-white/15 transition-colors">
          <div className="text-xs text-blue-200 dark:text-blue-300">Performance</div>
          <div className="text-sm font-bold">
            {!hasTrades ? 'No Activity' : 
              totalReturn >= 10 ? 'Excellent' : 
              totalReturn >= 5 ? 'Good' : 
              totalReturn >= 0 ? 'Positive' : 'Negative'}
          </div>
        </div>
        <div className="bg-white/10 rounded-lg p-3 hover:bg-white/15 transition-colors">
          <div className="text-xs text-blue-200 dark:text-blue-300">Status</div>
          <div className="text-sm font-bold">
            {!hasTrades ? 'No Activity' : totalPnL >= 0 ? 'Profitable' : 'Loss'}
          </div>
        </div>
      </div>

      {/* Help Text */}
      <div className="mt-4 text-center">
        <p className="text-xs text-blue-200 dark:text-blue-300 opacity-75">
          💡 <span className="font-medium">Pro Tip:</span> Click on either balance to edit it inline
        </p>
      </div>
    </motion.div>
  );
};

export default AccountBalanceWidget;