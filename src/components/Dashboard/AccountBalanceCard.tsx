import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, Calculator, Target } from 'lucide-react';
import InlineEditableBalance from './InlineEditableBalance';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import PricingButton from '../ui/PricingButton';

interface AccountBalanceCardProps {
  startingBalance: number;
  currentBalance: number;
  totalPnL: number;
  totalReturn: number;
  onUpdateBalance: (field: 'startingBalance' | 'currentBalance', newValue: number) => Promise<void>;
}

const AccountBalanceCard: React.FC<AccountBalanceCardProps> = ({
  startingBalance,
  currentBalance,
  totalPnL,
  totalReturn,
  onUpdateBalance
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

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

  const handleUpgradeClick = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/pricing');
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 rounded-xl p-6 text-white col-span-full">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Starting Balance - Now Editable */}
        <div className="text-center md:text-left">
          <p className="text-blue-100 dark:text-blue-200 text-sm font-medium mb-3 flex items-center justify-center md:justify-start">
            <Calculator className="h-4 w-4 mr-1" />
            Starting Balance
          </p>
          <div className="flex items-center justify-center md:justify-start">
            <InlineEditableBalance
              value={startingBalance}
              onSave={(newValue) => onUpdateBalance('startingBalance', newValue)}
              label="Starting Balance"
              large={true}
              className="text-white"
            />
          </div>
          <p className="text-blue-200 dark:text-blue-300 text-xs mt-2">
            💡 Click to edit your initial capital
          </p>
        </div>

        {/* Current Balance - Now Editable */}
        <div className="text-center md:text-left">
          <p className="text-blue-100 dark:text-blue-200 text-sm font-medium mb-2 flex items-center justify-center md:justify-start">
            <DollarSign className="h-4 w-4 mr-1" />
            Current Balance
          </p>
          <div className="flex items-center justify-center md:justify-start">
            <InlineEditableBalance
              value={currentBalance}
              onSave={(newValue) => onUpdateBalance('currentBalance', newValue)}
              label="Current Balance"
              large={true}
              className="text-white"
            />
          </div>
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
        <div className="bg-white/10 rounded-lg p-3 hover:bg-white/15 transition-colors">
          <div className="text-xs text-blue-200 dark:text-blue-300">Balance Change</div>
          <div className="text-sm font-bold">
            {formatCurrency(currentBalance - startingBalance)}
          </div>
        </div>
        <div className="bg-white/10 rounded-lg p-3 hover:bg-white/15 transition-colors">
          <div className="text-xs text-blue-200 dark:text-blue-300">Growth Rate</div>
          <div className="text-sm font-bold">
            {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(1)}%
          </div>
        </div>
        <div className="bg-white/10 rounded-lg p-3 hover:bg-white/15 transition-colors">
          <div className="text-xs text-blue-200 dark:text-blue-300">Performance</div>
          <div className="text-sm font-bold">
            {totalReturn >= 10 ? 'Excellent' : totalReturn >= 5 ? 'Good' : totalReturn >= 0 ? 'Positive' : 'Negative'}
          </div>
        </div>
        <div className="bg-white/10 rounded-lg p-3 hover:bg-white/15 transition-colors cursor-pointer" onClick={handleUpgradeClick}>
          <div className="text-xs text-blue-200 dark:text-blue-300">Upgrade Plan</div>
          <div className="text-sm font-bold">
            Pro Features
          </div>
        </div>
      </div>

      {/* Help Text */}
      <div className="mt-4 text-center">
        <p className="text-xs text-blue-200 dark:text-blue-300 opacity-75">
          💡 <span className="font-medium">Pro Tip:</span> Click on either balance to edit it inline
        </p>
      </div>
      
      {/* Upgrade Button */}
      <div className="mt-4 flex justify-center">
        <PricingButton 
          variant="outline" 
          size="md"
          className="border-white text-white hover:bg-white/20 dark:border-white dark:text-white dark:hover:bg-white/10"
        >
          Upgrade to Pro for Advanced Insights
        </PricingButton>
      </div>
    </div>
  );
};

export default AccountBalanceCard;