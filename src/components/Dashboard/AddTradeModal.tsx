import React from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { Trade } from '../../types';

interface AddTradeModalProps {
  onClose: () => void;
  onSubmit: (trade: Omit<Trade, 'id' | 'createdAt' | 'updatedAt'>) => void;
  userId: string;
}

interface TradeFormData {
  symbol: string;
  type: 'long' | 'short';
  entryPrice: number;
  exitPrice?: number;
  quantity: number;
  entryDate: string;
  exitDate?: string;
  status: 'open' | 'closed';
  notes?: string;
  strategy?: string;
  tags: string;
}

const AddTradeModal: React.FC<AddTradeModalProps> = ({ onClose, onSubmit, userId }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<TradeFormData>();
  const status = watch('status');
  const entryPrice = watch('entryPrice');
  const exitPrice = watch('exitPrice');
  const quantity = watch('quantity');
  const type = watch('type');

  const onFormSubmit = (data: TradeFormData) => {
    let pnl: number | null = null;
    let pnlPercent: number | null = null;

    if (data.status === 'closed' && data.exitPrice && entryPrice && quantity) {
      if (type === 'long') {
        pnl = (data.exitPrice - entryPrice) * quantity;
      } else {
        pnl = (entryPrice - data.exitPrice) * quantity;
      }
      pnlPercent = (pnl / (entryPrice * quantity)) * 100;
    }

    const trade: Omit<Trade, 'id' | 'createdAt' | 'updatedAt'> = {
      userId,
      symbol: data.symbol.toUpperCase().trim(),
      type: data.type,
      entryPrice: Number(data.entryPrice),
      exitPrice: data.status === 'closed' && data.exitPrice ? Number(data.exitPrice) : null,
      quantity: Number(data.quantity),
      entryDate: new Date(data.entryDate),
      exitDate: data.status === 'closed' && data.exitDate ? new Date(data.exitDate) : null,
      status: data.status,
      pnl,
      pnlPercent,
      notes: data.notes?.trim() || null,
      tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [],
      strategy: data.strategy?.trim() || null
    };

    onSubmit(trade);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Trade</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Symbol *
              </label>
              <input
                type="text"
                {...register('symbol', { 
                  required: 'Symbol is required',
                  pattern: {
                    value: /^[A-Za-z0-9]+$/,
                    message: 'Symbol must contain only letters and numbers'
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="AAPL"
              />
              {errors.symbol && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.symbol.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type *
              </label>
              <select
                {...register('type', { required: 'Type is required' })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select type</option>
                <option value="long">Long</option>
                <option value="short">Short</option>
              </select>
              {errors.type && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.type.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Entry Price *
              </label>
              <input
                type="number"
                step="0.01"
                {...register('entryPrice', { 
                  required: 'Entry price is required',
                  min: { value: 0.01, message: 'Entry price must be greater than 0' },
                  valueAsNumber: true
                })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="150.00"
              />
              {errors.entryPrice && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.entryPrice.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quantity *
              </label>
              <input
                type="number"
                {...register('quantity', { 
                  required: 'Quantity is required',
                  min: { value: 1, message: 'Quantity must be at least 1' },
                  valueAsNumber: true
                })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="100"
              />
              {errors.quantity && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.quantity.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Entry Date *
              </label>
              <input
                type="datetime-local"
                {...register('entryDate', { required: 'Entry date is required' })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              {errors.entryDate && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.entryDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status *
              </label>
              <select
                {...register('status', { required: 'Status is required' })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select status</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
              {errors.status && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.status.message}</p>
              )}
            </div>

            {status === 'closed' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Exit Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('exitPrice', { 
                      required: status === 'closed' ? 'Exit price is required for closed trades' : false,
                      min: { value: 0.01, message: 'Exit price must be greater than 0' },
                      valueAsNumber: true
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="155.00"
                  />
                  {errors.exitPrice && (
                    <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.exitPrice.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Exit Date
                  </label>
                  <input
                    type="datetime-local"
                    {...register('exitDate')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Strategy
              </label>
              <input
                type="text"
                {...register('strategy')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Breakout, Reversal, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags
              </label>
              <input
                type="text"
                {...register('tags')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="earnings, breakout (comma separated)"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Trade notes and observations..."
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Trade
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTradeModal;