import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { DollarSign, X, TrendingUp, Target, Award, Calculator, PiggyBank, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';

interface StartingBalanceModalProps {
  onClose: () => void;
  onSubmit: (balance: number) => void;
  isFirstTime?: boolean;
  currentBalance?: number;
}

interface BalanceFormData {
  startingBalance: number;
}

const StartingBalanceModal: React.FC<StartingBalanceModalProps> = ({ 
  onClose, 
  onSubmit, 
  isFirstTime = false,
  currentBalance = 10000
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<BalanceFormData>({
    defaultValues: {
      startingBalance: currentBalance
    }
  });

  const watchedBalance = watch('startingBalance');

  // Auto-focus first input when modal opens
  useEffect(() => {
    const timer = setTimeout(() => {
      if (firstInputRef.current) {
        firstInputRef.current.focus();
        firstInputRef.current.select();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Handle escape key to close modal (only if not first time)
  useEffect(() => {
    if (!isFirstTime) {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [onClose, isFirstTime]);

  // Handle click outside modal to close (only if not first time)
  useEffect(() => {
    if (!isFirstTime) {
      const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
          onClose();
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [onClose, isFirstTime]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const onFormSubmit = async (data: BalanceFormData) => {
    setIsLoading(true);
    try {
      await onSubmit(data.startingBalance);
      onClose();
    } catch (error) {
      console.error('Error setting balance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const presetAmounts = [
    { amount: 1000, label: '$1K', popular: false },
    { amount: 5000, label: '$5K', popular: false },
    { amount: 10000, label: '$10K', popular: true },
    { amount: 25000, label: '$25K', popular: false },
    { amount: 50000, label: '$50K', popular: false },
    { amount: 100000, label: '$100K', popular: false }
  ];

  const handlePresetClick = (amount: number) => {
    setValue('startingBalance', amount);
    setSelectedPreset(amount);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in" />
      
      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          ref={modalRef}
          className="relative bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full border border-gray-200 dark:border-gray-700 shadow-2xl animate-fade-in-scale"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 border-b border-gray-200 dark:border-gray-700 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-lg shadow-lg">
                  <PiggyBank className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {isFirstTime ? '🎉 Welcome to ZellaX!' : 'Update Account Balance'}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {isFirstTime 
                      ? 'Set your starting balance to begin tracking performance' 
                      : 'Modify your account starting balance'
                    }
                  </p>
                </div>
              </div>
              {!isFirstTime && (
                <button
                  onClick={onClose}
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-6">
            {/* Welcome Message for First Time Users */}
            {isFirstTime && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-green-900 dark:text-green-200 mb-1">
                      Start Your Trading Journey
                    </h3>
                    <p className="text-xs text-green-700 dark:text-green-300 leading-relaxed">
                      Your starting balance is the foundation for calculating accurate P&L, returns, and performance metrics. 
                      Don't worry - you can always update this later!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Balance Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <Calculator className="h-4 w-4 inline mr-2" />
                Starting Account Balance *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400 text-xl font-bold">$</span>
                </div>
                <input
                  ref={firstInputRef}
                  {...register('startingBalance', { 
                    required: 'Starting balance is required',
                    min: { value: 100, message: 'Minimum balance is $100' },
                    max: { value: 10000000, message: 'Maximum balance is $10,000,000' },
                    valueAsNumber: true
                  })}
                  type="number"
                  step="0.01"
                  className="w-full pl-10 pr-4 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xl font-bold text-center transition-all duration-200"
                  placeholder="10,000.00"
                  onChange={() => setSelectedPreset(null)}
                />
              </div>
              {errors.startingBalance && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-2 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.startingBalance.message}
                </p>
              )}
            </div>

            {/* Preset Amount Buttons */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <Target className="h-4 w-4 inline mr-2" />
                Quick Select Popular Amounts
              </label>
              <div className="grid grid-cols-3 gap-3">
                {presetAmounts.map((preset) => (
                  <button
                    key={preset.amount}
                    type="button"
                    onClick={() => handlePresetClick(preset.amount)}
                    className={`relative px-4 py-3 text-sm font-medium border-2 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                      selectedPreset === preset.amount || watchedBalance === preset.amount
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-lg'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {preset.popular && (
                      <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                        Popular
                      </div>
                    )}
                    <div className="text-center">
                      <div className="font-bold">{preset.label}</div>
                      <div className="text-xs opacity-75">{formatCurrency(preset.amount)}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Balance Preview */}
            {watchedBalance && watchedBalance >= 100 && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Balance Preview
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <div className="text-gray-600 dark:text-gray-400 text-xs">Starting Balance</div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatCurrency(watchedBalance)}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <div className="text-gray-600 dark:text-gray-400 text-xs">Account Type</div>
                    <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {watchedBalance < 5000 ? 'Starter' : 
                       watchedBalance < 25000 ? 'Intermediate' : 
                       watchedBalance < 100000 ? 'Advanced' : 'Professional'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Information Cards */}
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <Target className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                <div className="text-xs text-green-700 dark:text-green-300">
                  <span className="font-medium">Accurate P&L Tracking:</span> Calculate real profit and loss from your trades
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <Award className="h-4 w-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <div className="text-xs text-purple-700 dark:text-purple-300">
                  <span className="font-medium">Performance Metrics:</span> Win rate, profit factor, and return calculations
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <div className="text-xs text-blue-700 dark:text-blue-300">
                  <span className="font-medium">Growth Tracking:</span> Monitor your account growth over time
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              {!isFirstTime && (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading || !watchedBalance || watchedBalance < 100}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Setting up...
                  </>
                ) : (
                  <>
                    <DollarSign className="h-4 w-4 mr-2" />
                    {isFirstTime ? 'Start Trading Journey' : 'Update Balance'}
                  </>
                )}
              </button>
            </div>

            {/* Help Text */}
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                💡 <span className="font-medium">Pro Tip:</span> You can always update your starting balance later in settings
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StartingBalanceModal;