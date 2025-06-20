import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { DollarSign, X, TrendingUp, Target, Award } from 'lucide-react';
import toast from 'react-hot-toast';

interface StartingBalanceModalProps {
  onClose: () => void;
  onSubmit: (balance: number) => void;
  isFirstTime?: boolean;
}

interface BalanceFormData {
  startingBalance: number;
}

const StartingBalanceModal: React.FC<StartingBalanceModalProps> = ({ 
  onClose, 
  onSubmit, 
  isFirstTime = false 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<BalanceFormData>({
    defaultValues: {
      startingBalance: 10000
    }
  });

  const onFormSubmit = async (data: BalanceFormData) => {
    setIsLoading(true);
    try {
      await onSubmit(data.startingBalance);
      toast.success('Starting balance set successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to set starting balance');
    } finally {
      setIsLoading(false);
    }
  };

  const presetAmounts = [1000, 5000, 10000, 25000, 50000, 100000];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full border border-gray-200 dark:border-gray-700 shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {isFirstTime ? 'Welcome to ZellaX!' : 'Update Starting Balance'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isFirstTime ? 'Set your starting account balance' : 'Modify your account balance'}
              </p>
            </div>
          </div>
          {!isFirstTime && (
            <button
              onClick={onClose}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-6">
          {isFirstTime && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-1">
                    Track Your Trading Performance
                  </h3>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    Your starting balance helps us calculate accurate P&L, returns, and performance metrics as you add trades.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Starting Account Balance *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 dark:text-gray-400 text-lg">$</span>
              </div>
              <input
                {...register('startingBalance', { 
                  required: 'Starting balance is required',
                  min: { value: 100, message: 'Minimum balance is $100' },
                  max: { value: 10000000, message: 'Maximum balance is $10,000,000' }
                })}
                type="number"
                step="0.01"
                className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg font-medium"
                placeholder="10,000.00"
              />
            </div>
            {errors.startingBalance && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.startingBalance.message}</p>
            )}
          </div>

          {/* Preset Amount Buttons */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Quick Select
            </label>
            <div className="grid grid-cols-3 gap-2">
              {presetAmounts.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => {
                    const event = { target: { value: amount.toString() } };
                    register('startingBalance').onChange(event);
                  }}
                  className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                >
                  ${amount.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Information Cards */}
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
              <div className="text-xs text-green-700 dark:text-green-300">
                <span className="font-medium">Accurate P&L:</span> Track real profit and loss from your trades
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <Award className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <div className="text-xs text-purple-700 dark:text-purple-300">
                <span className="font-medium">Performance Metrics:</span> Calculate win rate, profit factor, and returns
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {!isFirstTime && (
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <DollarSign className="h-4 w-4 mr-2" />
              )}
              {isFirstTime ? 'Set Starting Balance' : 'Update Balance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StartingBalanceModal;