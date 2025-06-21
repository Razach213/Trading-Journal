import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { Trade } from '../../types';

interface AddTradeModalProps {
  onClose: () => void;
  onSubmit: (trade: Omit<Trade, 'id' | 'createdAt' | 'updatedAt'>) => void;
  userId: string;
  initialData?: Partial<Trade>;
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

const AddTradeModal: React.FC<AddTradeModalProps> = ({ 
  onClose, 
  onSubmit, 
  userId, 
  initialData 
}) => {
  const firstInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm<TradeFormData>({
    defaultValues: {
      symbol: initialData?.symbol || '',
      type: initialData?.type || 'long',
      entryPrice: initialData?.entryPrice || undefined,
      exitPrice: initialData?.exitPrice || undefined,
      quantity: initialData?.quantity || undefined,
      entryDate: initialData?.entryDate 
        ? new Date(initialData.entryDate).toISOString().slice(0, 16)
        : new Date().toISOString().slice(0, 16),
      exitDate: initialData?.exitDate 
        ? new Date(initialData.exitDate).toISOString().slice(0, 16)
        : '',
      status: initialData?.status || 'open',
      notes: initialData?.notes || '',
      strategy: initialData?.strategy || '',
      tags: initialData?.tags?.join(', ') || ''
    }
  });

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

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Handle click outside modal to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

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

  // Quick preset buttons for common symbols
  const quickSymbols = ['AAPL', 'TSLA', 'NVDA', 'MSFT', 'GOOGL', 'AMZN', 'META', 'SPY'];

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto scrollbar-thin">
      <div className="min-h-screen pt-4 pb-8 px-4">
        <div 
          ref={modalRef}
          className="relative bg-white dark:bg-gray-800 rounded-xl w-full max-w-4xl mx-auto border border-gray-200 dark:border-gray-700 shadow-2xl animate-fade-in-scale"
          style={{ 
            scrollBehavior: 'smooth'
          }}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 sticky top-0 z-10">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {initialData ? 'Edit Trade' : 'Add New Trade'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="max-h-[80vh] overflow-y-auto scrollbar-thin">
            <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-6">
              {/* Symbol and Quick Select */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Symbol *
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {quickSymbols.map((symbol) => (
                      <button
                        key={symbol}
                        type="button"
                        onClick={() => setValue('symbol', symbol)}
                        className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                      >
                        {symbol}
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  ref={firstInputRef}
                  type="text"
                  {...register('symbol', { 
                    required: 'Symbol is required',
                    pattern: {
                      value: /^[A-Za-z0-9]+$/,
                      message: 'Symbol must contain only letters and numbers'
                    }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg font-medium"
                  placeholder="Enter symbol (e.g., AAPL)"
                />
                {errors.symbol && (
                  <p className="text-red-600 dark:text-red-400 text-sm">{errors.symbol.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Trade Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Trade Type *
                  </label>
                  <select
                    {...register('type', { required: 'Trade type is required' })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="long">Long (Buy)</option>
                    <option value="short">Short (Sell)</option>
                  </select>
                  {errors.type && (
                    <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.type.message}</p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status *
                  </label>
                  <select
                    {...register('status', { required: 'Status is required' })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </select>
                  {errors.status && (
                    <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.status.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Entry Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Entry Price *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 dark:text-gray-400">$</span>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      {...register('entryPrice', { 
                        required: 'Entry price is required',
                        min: { value: 0.01, message: 'Entry price must be greater than 0' },
                        valueAsNumber: true
                      })}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="150.00"
                    />
                  </div>
                  {errors.entryPrice && (
                    <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.entryPrice.message}</p>
                  )}
                </div>

                {/* Exit Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Exit Price {status === 'closed' && '*'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 dark:text-gray-400">$</span>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      {...register('exitPrice', { 
                        required: status === 'closed' ? 'Exit price is required for closed trades' : false,
                        min: { value: 0.01, message: 'Exit price must be greater than 0' },
                        valueAsNumber: true
                      })}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="155.00"
                      disabled={status === 'open'}
                    />
                  </div>
                  {errors.exitPrice && (
                    <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.exitPrice.message}</p>
                  )}
                </div>

                {/* Quantity */}
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
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="100"
                  />
                  {errors.quantity && (
                    <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.quantity.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Entry Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Entry Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    {...register('entryDate', { required: 'Entry date is required' })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  {errors.entryDate && (
                    <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.entryDate.message}</p>
                  )}
                </div>

                {/* Exit Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Exit Date & Time {status === 'closed' && '*'}
                  </label>
                  <input
                    type="datetime-local"
                    {...register('exitDate', {
                      required: status === 'closed' ? 'Exit date is required for closed trades' : false
                    })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    disabled={status === 'open'}
                  />
                  {errors.exitDate && (
                    <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.exitDate.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strategy */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Strategy
                  </label>
                  <input
                    type="text"
                    {...register('strategy')}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="e.g., Breakout, Reversal, Scalp"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    {...register('tags')}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="earnings, breakout, missed (comma separated)"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Use "missed" tag to track missed opportunities
                  </p>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Trade Notes
                </label>
                <textarea
                  {...register('notes')}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Trade observations, lessons learned, market conditions, etc..."
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  💡 Detailed notes help improve your trading performance over time
                </p>
              </div>

              {/* P&L Preview for Closed Trades */}
              {status === 'closed' && entryPrice && exitPrice && quantity && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">P&L Preview</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Trade P&L:</span>
                      <span className={`ml-2 font-bold ${
                        ((type === 'long' ? exitPrice - entryPrice : entryPrice - exitPrice) * quantity) >= 0 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        ${((type === 'long' ? exitPrice - entryPrice : entryPrice - exitPrice) * quantity).toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Return:</span>
                      <span className={`ml-2 font-bold ${
                        ((type === 'long' ? exitPrice - entryPrice : entryPrice - exitPrice) / entryPrice * 100) >= 0 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {((type === 'long' ? exitPrice - entryPrice : entryPrice - exitPrice) / entryPrice * 100).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {initialData ? 'Update Trade' : 'Add Trade'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTradeModal;