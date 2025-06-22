import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { X, Calculator, DollarSign, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
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
  pnl?: number; // Manual P&L input
  notes?: string;
  strategy?: string;
  tags: string;
}

const AddTradeModal: React.FC<AddTradeModalProps> = ({ onClose, onSubmit, userId }) => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<TradeFormData>();
  const [useManualPnL, setUseManualPnL] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const initialFocusRef = useRef<HTMLInputElement>(null);
  const [animateIn, setAnimateIn] = useState(false);
  
  const status = watch('status');
  const entryPrice = watch('entryPrice');
  const exitPrice = watch('exitPrice');
  const quantity = watch('quantity');
  const type = watch('type');
  const manualPnL = watch('pnl');

  // Focus first input when modal opens and trigger animation
  useEffect(() => {
    setTimeout(() => setAnimateIn(true), 50);
    
    if (initialFocusRef.current) {
      initialFocusRef.current.focus();
    }
    
    // Prevent body scroll
    document.body.classList.add('modal-open');
    
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  // Handle modal close with animation
  const handleClose = () => {
    setAnimateIn(false);
    setTimeout(() => onClose(), 300);
  };

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  // Auto-calculate P&L when prices change (if not using manual)
  React.useEffect(() => {
    if (!useManualPnL && status === 'closed' && entryPrice && exitPrice && quantity) {
      let calculatedPnL: number;
      if (type === 'long') {
        calculatedPnL = (exitPrice - entryPrice) * quantity;
      } else {
        calculatedPnL = (entryPrice - exitPrice) * quantity;
      }
      setValue('pnl', Number(calculatedPnL.toFixed(2)));
    }
  }, [entryPrice, exitPrice, quantity, type, status, useManualPnL, setValue]);

  const onFormSubmit = (data: TradeFormData) => {
    let finalPnL: number | null = null;
    let pnlPercent: number | null = null;

    if (data.status === 'closed') {
      if (useManualPnL && data.pnl !== undefined) {
        // Use manual P&L
        finalPnL = Number(data.pnl);
      } else if (data.exitPrice && entryPrice && quantity) {
        // Auto-calculate P&L
        if (type === 'long') {
          finalPnL = (data.exitPrice - entryPrice) * quantity;
        } else {
          finalPnL = (entryPrice - data.exitPrice) * quantity;
        }
      }

      // Calculate percentage
      if (finalPnL !== null && entryPrice && quantity) {
        pnlPercent = (finalPnL / (entryPrice * quantity)) * 100;
      }
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
      pnl: finalPnL,
      pnlPercent,
      notes: data.notes?.trim() || null,
      tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [],
      strategy: data.strategy?.trim() || null
    };

    onSubmit(trade);
    handleClose();
  };

  return (
    <div className="fixed-modal backdrop-blur-sm">
      <div 
        ref={modalRef} 
        className={`modal-container ${animateIn ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        style={{ 
          transition: 'all 0.3s ease-out',
          maxWidth: '650px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        <div className="modal-header bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-750">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <div className="mr-3 bg-blue-600 dark:bg-blue-500 p-2 rounded-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            Add New Trade
          </h2>
          <button
            onClick={handleClose}
            className="modal-close-button"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="modal-body modal-scrollbar">
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            <div className="modal-equal-fields">
              <div className="form-group">
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
                  ref={initialFocusRef}
                  className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="AAPL"
                />
                {errors.symbol && (
                  <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.symbol.message}</p>
                )}
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type *
                </label>
                <select
                  {...register('type', { required: 'Type is required' })}
                  className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select type</option>
                  <option value="long">Long</option>
                  <option value="short">Short</option>
                </select>
                {errors.type && (
                  <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.type.message}</p>
                )}
              </div>
            </div>

            <div className="modal-equal-fields">
              <div className="form-group">
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
                    className="w-full pl-8 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="150.00"
                  />
                </div>
                {errors.entryPrice && (
                  <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.entryPrice.message}</p>
                )}
              </div>

              <div className="form-group">
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
                  className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="100"
                />
                {errors.quantity && (
                  <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.quantity.message}</p>
                )}
              </div>
            </div>

            <div className="modal-equal-fields">
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Entry Date *
                </label>
                <input
                  type="datetime-local"
                  {...register('entryDate', { required: 'Entry date is required' })}
                  className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                {errors.entryDate && (
                  <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.entryDate.message}</p>
                )}
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status *
                </label>
                <select
                  {...register('status', { required: 'Status is required' })}
                  className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select status</option>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
                {errors.status && (
                  <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.status.message}</p>
                )}
              </div>
            </div>

            {status === 'closed' && (
              <>
                <div className="modal-equal-fields">
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Exit Price {!useManualPnL && '*'}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 dark:text-gray-400">$</span>
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        {...register('exitPrice', { 
                          required: status === 'closed' && !useManualPnL ? 'Exit price is required for closed trades' : false,
                          min: { value: 0.01, message: 'Exit price must be greater than 0' },
                          valueAsNumber: true
                        })}
                        disabled={useManualPnL}
                        className="w-full pl-8 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="155.00"
                      />
                    </div>
                    {errors.exitPrice && (
                      <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.exitPrice.message}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Exit Date
                    </label>
                    <input
                      type="datetime-local"
                      {...register('exitDate')}
                      className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* P&L Calculation Options */}
                <div className="md:col-span-2">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-750 rounded-lg p-5 border border-blue-100 dark:border-gray-700 shadow-inner">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                        <Calculator className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                        P&L Calculation
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span id="manual-pnl-label" className="text-sm text-gray-600 dark:text-gray-400">Manual Input</span>
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={useManualPnL}
                            onChange={() => setUseManualPnL(!useManualPnL)}
                            aria-labelledby="manual-pnl-label"
                          />
                          <span className="toggle-track">
                            <span className="toggle-thumb"></span>
                          </span>
                        </label>
                      </div>
                    </div>

                    {useManualPnL ? (
                      <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-600">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          <DollarSign className="h-4 w-4 inline mr-1" />
                          Profit/Loss Amount *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 dark:text-gray-400">$</span>
                          </div>
                          <input
                            type="number"
                            step="0.01"
                            {...register('pnl', { 
                              required: useManualPnL ? 'P&L amount is required' : false,
                              valueAsNumber: true
                            })}
                            className="w-full pl-8 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Enter profit (+) or loss (-) amount"
                          />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          Enter positive number for profit, negative for loss (e.g., 500 or -200)
                        </p>
                        {errors.pnl && (
                          <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.pnl.message}</p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 mb-2">
                          <Calculator className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">Auto-calculated P&L</span>
                        </div>
                        {entryPrice && exitPrice && quantity && type ? (
                          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600 shadow-sm">
                            <div className="flex flex-col space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Formula:</span>
                                <span className="font-mono">
                                  {type === 'long' 
                                    ? `(Exit - Entry) × Quantity` 
                                    : `(Entry - Exit) × Quantity`
                                  }
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Calculation:</span>
                                <span className="font-mono">
                                  {type === 'long' 
                                    ? `($${exitPrice} - $${entryPrice}) × ${quantity}` 
                                    : `($${entryPrice} - $${exitPrice}) × ${quantity}`
                                  }
                                </span>
                              </div>
                              <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                                <span className="font-medium">Result:</span>
                                <span className={`text-lg font-bold ${
                                  ((type === 'long' ? exitPrice - entryPrice : entryPrice - exitPrice) * quantity) >= 0 
                                    ? 'text-green-600 dark:text-green-400 flex items-center' 
                                    : 'text-red-600 dark:text-red-400 flex items-center'
                                }`}>
                                  {((type === 'long' ? exitPrice - entryPrice : entryPrice - exitPrice) * quantity) >= 0 ? (
                                    <TrendingUp className="h-4 w-4 mr-1" />
                                  ) : (
                                    <TrendingDown className="h-4 w-4 mr-1" />
                                  )}
                                  ${((type === 'long' ? exitPrice - entryPrice : entryPrice - exitPrice) * quantity).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Complete the form to see P&L calculation
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            <div className="modal-equal-fields">
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Strategy
                </label>
                <input
                  type="text"
                  {...register('strategy')}
                  className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Breakout, Reversal, etc."
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  {...register('tags')}
                  className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Trade notes and observations..."
              />
            </div>
          </form>
        </div>

        <div className="modal-footer bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-750">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit(onFormSubmit)}
            className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 flex items-center"
          >
            Add Trade
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTradeModal;