import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { DollarSign, X, TrendingUp, Calculator, PiggyBank, BarChart3 } from 'lucide-react';
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
  const firstInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<BalanceFormData>({
    defaultValues: {
      startingBalance: currentBalance
    }
  });

  const watchedBalance = watch('startingBalance');

  // CRITICAL: Auto-focus and ensure modal is visible
  useEffect(() => {
    const timer = setTimeout(() => {
      // Focus the first input
      if (firstInputRef.current) {
        firstInputRef.current.focus();
        firstInputRef.current.select();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // CRITICAL: Auto-scroll to button when balance is entered
  useEffect(() => {
    if (watchedBalance && watchedBalance >= 100 && buttonRef.current && scrollContainerRef.current) {
      const timer = setTimeout(() => {
        // Scroll the button into view within the modal
        buttonRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'end',
          inline: 'nearest'
        });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [watchedBalance]);

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

  // CRITICAL: Prevent body scroll but allow modal scrolling
  useEffect(() => {
    // Store original styles
    const originalBodyOverflow = document.body.style.overflow;
    const originalBodyPosition = document.body.style.position;
    const originalBodyTop = document.body.style.top;
    const originalBodyWidth = document.body.style.width;
    
    // Get current scroll position
    const scrollY = window.scrollY;
    
    // Apply modal-open styles with fixed positioning
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.classList.add('modal-open');
    
    return () => {
      // Restore original styles
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.position = originalBodyPosition;
      document.body.style.top = originalBodyTop;
      document.body.style.width = originalBodyWidth;
      document.body.classList.remove('modal-open');
      
      // Restore scroll position
      window.scrollTo(0, scrollY);
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      {/* CRITICAL: Scrollable Container */}
      <div 
        ref={scrollContainerRef}
        className="w-full h-full max-w-lg overflow-y-auto overscroll-contain"
        style={{ 
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch' // iOS smooth scrolling
        }}
      >
        <div 
          ref={modalRef}
          className="relative bg-white dark:bg-gray-800 rounded-xl w-full border border-gray-200 dark:border-gray-700 shadow-2xl animate-fade-in-scale my-4 mx-auto min-h-fit"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 sm:p-3 rounded-lg shadow-lg">
                  <PiggyBank className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                    {isFirstTime ? '🎉 Welcome to ZellaX!' : 'Update Account Balance'}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
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

          {/* CRITICAL: Scrollable Form Content */}
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-h-[60vh] overflow-y-auto">
            {/* Welcome Message for First Time Users */}
            {isFirstTime && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 sm:p-4">
                <div className="flex items-start space-x-3">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400 mt-0.5" />
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

            {/* Quick Select Popular Amounts - REMOVED AS REQUESTED */}

            {/* Balance Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <Calculator className="h-4 w-4 inline mr-2" />
                Starting Account Balance *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400 text-lg sm:text-xl font-bold">$</span>
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
                  className="w-full pl-10 pr-4 py-3 sm:py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg sm:text-xl font-bold text-center transition-all duration-200"
                  placeholder="10,000.00"
                />
              </div>
              {errors.startingBalance && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-2 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.startingBalance.message}
                </p>
              )}
            </div>

            {/* Balance Preview */}
            {watchedBalance && watchedBalance >= 100 && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-600">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Balance Preview
                </h4>
                <div className="grid grid-cols-2 gap-3 sm:gap-4 text-sm">
                  <div className="text-center p-2 sm:p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <div className="text-gray-600 dark:text-gray-400 text-xs">Starting Balance</div>
                    <div className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                      {formatCurrency(watchedBalance)}
                    </div>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <div className="text-gray-600 dark:text-gray-400 text-xs">Account Type</div>
                    <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {watchedBalance < 5000 ? 'Starter' : 
                       watchedBalance < 25000 ? 'Intermediate' : 
                       watchedBalance < 100000 ? 'Advanced' : 'Professional'}
                    </div>
                  </div>
                </div>

                {/* Accurate P&L Tracking */}
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-green-800 dark:text-green-300">Accurate P&L Tracking</span>
                  </div>
                  <p className="text-xs text-green-700 dark:text-green-400">
                    Calculate real profit and loss from your trades
                  </p>
                </div>

                {/* Performance Metrics */}
                <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-purple-800 dark:text-purple-300">Performance Metrics</span>
                  </div>
                  <p className="text-xs text-purple-700 dark:text-purple-400">
                    Win rate, profit factor, and return calculations
                  </p>
                </div>

                {/* Growth Tracking */}
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-blue-800 dark:text-blue-300">Growth Tracking</span>
                  </div>
                  <p className="text-xs text-blue-700 dark:text-blue-400">
                    Monitor your account growth over time
                  </p>
                </div>
              </div>
            )}

            {/* Help Text */}
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                💡 <span className="font-medium">Pro Tip:</span> You can always update your starting balance later in settings
              </p>
            </div>
          </div>

          {/* CRITICAL: Fixed Action Buttons - ALWAYS VISIBLE AT BOTTOM */}
          <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 sm:p-6 rounded-b-xl shadow-lg">
            <form onSubmit={handleSubmit(onFormSubmit)}>
              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                {!isFirstTime && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full sm:w-auto px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium order-2 sm:order-1"
                  >
                    Cancel
                  </button>
                )}
                <button
                  ref={buttonRef}
                  type="submit"
                  disabled={isLoading || !watchedBalance || watchedBalance < 100}
                  className="w-full sm:w-auto px-6 py-4 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium shadow-lg hover:shadow-xl transform hover:scale-105 text-base sm:text-sm order-1 sm:order-2 min-h-[48px] touch-manipulation"
                  style={{ 
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'manipulation'
                  }}
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
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartingBalanceModal;