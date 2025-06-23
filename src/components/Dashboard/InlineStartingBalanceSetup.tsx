import React, { useState } from 'react';
import { DollarSign, Calculator, TrendingUp, BarChart3, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface InlineStartingBalanceSetupProps {
  onSubmit: (balance: number) => Promise<void>;
  defaultValue?: number;
}

interface BalanceFormData {
  startingBalance: number;
}

const InlineStartingBalanceSetup: React.FC<InlineStartingBalanceSetupProps> = ({ 
  onSubmit, 
  defaultValue = 10000 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<BalanceFormData>({
    defaultValues: {
      startingBalance: defaultValue
    }
  });

  const watchedBalance = watch('startingBalance');

  const onFormSubmit = async (data: BalanceFormData) => {
    if (!data.startingBalance || data.startingBalance <= 0) {
      toast.error('Please enter a valid starting balance');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      await onSubmit(data.startingBalance);
      toast.success('🎉 Account setup complete! Ready to start trading!');
    } catch (error: any) {
      console.error('Error setting balance:', error);
      
      // Handle specific Firebase errors
      if (error.message?.includes('Firebase Auth not configured') || 
          error.message?.includes('Demo mode') ||
          error.message?.includes('api-key-not-valid') ||
          error.message?.includes('not initialized')) {
        setIsOfflineMode(true);
        setError('Firebase not configured. Running in demo mode.');
        toast.error('⚠️ Firebase not configured. Please check your setup.');
      } else if (error.message?.includes('permission')) {
        setError('Permission denied. Please sign in again.');
        toast.error('Please sign in again to continue');
      } else if (error.message?.includes('network') || error.message?.includes('unavailable')) {
        setError('Network error. Please check your internet connection.');
        toast.error('Please check your internet connection and try again');
      } else {
        setError(error.message || 'Failed to set starting balance');
        toast.error('Failed to set starting balance. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getAccountType = (balance: number) => {
    if (balance < 5000) return 'Beginner';
    if (balance < 25000) return 'Intermediate';
    if (balance < 100000) return 'Advanced';
    return 'Professional';
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 rounded-xl p-6 text-white mb-8 animate-fade-in">
      <div className="text-center mb-6">
        <div className="inline-flex items-center bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
          <BarChart3 className="h-4 w-4 mr-2" />
          Balance Preview
        </div>
        <h2 className="text-2xl font-bold mb-2">Set Your Starting Balance</h2>
        <p className="text-blue-100 dark:text-blue-200">
          Enter your initial trading capital to begin tracking your performance
        </p>
      </div>

      {/* Firebase Configuration Warning */}
      {isOfflineMode && (
        <div className="bg-orange-500/20 border border-orange-400/30 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <WifiOff className="h-5 w-5 text-orange-300" />
            <span className="text-orange-200 font-medium">Demo Mode</span>
          </div>
          <p className="text-orange-100 text-sm mt-1">
            Firebase is not configured. Please update your .env file with valid Firebase credentials.
          </p>
          <div className="mt-2 text-xs text-orange-200">
            <p>1. Go to Firebase Console → Project Settings</p>
            <p>2. Copy your config values to .env file</p>
            <p>3. Restart the development server</p>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && !isOfflineMode && (
        <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-300" />
            <span className="text-red-200 font-medium">Setup Error</span>
          </div>
          <p className="text-red-100 text-sm mt-1">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Balance Input Section */}
        <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Input Field */}
            <div>
              <label className="block text-sm font-medium text-blue-100 dark:text-blue-200 mb-3">
                <Calculator className="h-4 w-4 inline mr-2" />
                Starting Balance
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-blue-200 dark:text-blue-300" />
                </div>
                <input
                  {...register('startingBalance', { 
                    required: 'Starting balance is required',
                    min: { value: 100, message: 'Minimum balance is $100' },
                    max: { value: 10000000, message: 'Maximum balance is $10,000,000' },
                    valueAsNumber: true
                  })}
                  type="number"
                  step="0.01"
                  className="w-full pl-12 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-blue-200 dark:placeholder-blue-300 text-lg font-bold"
                  placeholder="10,000.00"
                  autoFocus
                  disabled={isLoading}
                />
              </div>
              {errors.startingBalance && (
                <p className="text-red-300 dark:text-red-400 text-sm mt-2">
                  {errors.startingBalance.message}
                </p>
              )}
            </div>

            {/* Preview Section */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-blue-100 dark:text-blue-200 text-sm mb-1">Starting Balance</div>
                  <div className="text-xl font-bold">
                    {formatCurrency(watchedBalance || 0)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-blue-100 dark:text-blue-200 text-sm mb-1">Account Type</div>
                  <div className="text-lg font-semibold text-blue-200 dark:text-blue-300">
                    {getAccountType(watchedBalance || 0)}
                  </div>
                </div>
              </div>

              {/* Features Preview */}
              <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-200">Accurate P&L Tracking</span>
                </div>
                <p className="text-xs text-green-300">
                  Calculate real profit and loss from your trades
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={isLoading || !watchedBalance || watchedBalance < 100}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center mx-auto min-w-[200px]"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Setting up...
              </>
            ) : (
              <>
                <DollarSign className="h-5 w-5 mr-2" />
                {isOfflineMode ? 'Continue in Demo Mode' : 'Start Trading Journey'}
              </>
            )}
          </button>
        </div>

        {/* Help Text */}
        <div className="text-center">
          <p className="text-xs text-blue-200 dark:text-blue-300 opacity-75">
            💡 <span className="font-medium">Pro Tip:</span> You can always update your starting balance later in settings
          </p>
          {isOfflineMode && (
            <p className="text-xs text-orange-200 mt-2">
              🔧 <span className="font-medium">Demo Mode:</span> Configure Firebase to save data permanently
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default InlineStartingBalanceSetup;