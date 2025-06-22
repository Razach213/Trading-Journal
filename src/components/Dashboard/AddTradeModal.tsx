import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { X, Calculator, DollarSign } from 'lucide-react';
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
  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue, 
    formState: { errors }, 
    clearErrors, 
    trigger,
    setError
  } = useForm<TradeFormData>({
    mode: 'onChange',
    reValidateMode: 'onChange'
  });
  
  const [useManualPnL, setUseManualPnL] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const initialFocusRef = useRef<HTMLInputElement>(null);
  
  const status = watch('status');
  const entryPrice = watch('entryPrice');
  const exitPrice = watch('exitPrice');
  const quantity = watch('quantity');
  const type = watch('type');
  const manualPnL = watch('pnl');
  const symbol = watch('symbol');
  const entryDate = watch('entryDate');

  // Focus first input when modal opens
  useEffect(() => {
    if (initialFocusRef.current) {
      initialFocusRef.current.focus();
    }
    
    // Prevent body scroll
    document.body.classList.add('modal-open');
    
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [onClose]);

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
    onClose();
  };

  return (
    <div className="fixed-modal">
      <div ref={modalRef} className="modal-container">
        <div className="modal-header">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Trade</h2>
          <button
            onClick={onClose}
            className="modal-close-button"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="modal-body modal-scrollbar">
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            <div className="modal-equal-fields">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Symbol
                </label>
                <input
                  type="text"
                  {...register('symbol')}
                  ref={initialFocusRef}
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
                  {...register('type', { 
                    required: 'Type is required'
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  onChange={(e) => {
                    if (e.target.value) {
                      clearErrors('type');
                    }
                  }}
                  onBlur={() => {
                    if (type) {
                      clearErrors('type');
                    }
                  }}
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
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (!isNaN(value) && value > 0) {
                      clearErrors('entryPrice');
                    }
                  }}
                  onBlur={() => {
                    if (entryPrice > 0) {
                      clearErrors('entryPrice');
                    }
                  }}
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
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value) && value >= 1) {
                      clearErrors('quantity');
                    }
                  }}
                  onBlur={() => {
                    if (quantity >= 1) {
                      clearErrors('quantity');
                    }
                  }}
                />
                {errors.quantity && (
                  <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.quantity.message}</p>
                )}
              </div>
            </div>

            <div className="modal-equal-fields">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Entry Date *
                </label>
                <input
                  type="datetime-local"
                  {...register('entryDate', { 
                    required: 'Entry date is required'
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  onChange={(e) => {
                    if (e.target.value) {
                      clearErrors('entryDate');
                    }
                  }}
                  onBlur={() => {
                    if (entryDate) {
                      clearErrors('entryDate');
                    }
                  }}
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
                  {...register('status', { 
                    required: 'Status is required'
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  onChange={(e) => {
                    if (e.target.value) {
                      clearErrors('status');
                    }
                  }}
                  onBlur={() => {
                    if (status) {
                      clearErrors('status');
                    }
                  }}
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Exit Price {!useManualPnL && '*'}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register('exitPrice', { 
                        required: status === 'closed' && !useManualPnL ? 'Exit price is required for closed trades' : false,
                        min: { value: 0.01, message: 'Exit price must be greater than 0' },
                        valueAsNumber: true
                      })}
                      disabled={useManualPnL}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="155.00"
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (!isNaN(value) && value > 0) {
                          clearErrors('exitPrice');
                        }
                      }}
                      onBlur={() => {
                        if (exitPrice && exitPrice > 0) {
                          clearErrors('exitPrice');
                        }
                      }}
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
                </div>

                {/* P&L Calculation Options */}
                <div className="md:col-span-2">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">P&L Calculation</h3>
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
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          <DollarSign className="h-4 w-4 inline mr-1" />
                          Profit/Loss Amount *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          {...register('pnl', { 
                            required: useManualPnL ? 'P&L amount is required' : false,
                            valueAsNumber: true
                          })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Enter profit (+) or loss (-) amount"
                          onChange={(e) => {
                            if (e.target.value) {
                              clearErrors('pnl');
                            }
                          }}
                          onBlur={() => {
                            if (manualPnL !== undefined) {
                              clearErrors('pnl');
                            }
                          }}
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Enter positive number for profit, negative for loss (e.g., 500 or -200)
                        </p>
                        {errors.pnl && (
                          <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.pnl.message}</p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Calculator className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">Auto-calculated P&L</span>
                        </div>
                        {entryPrice && exitPrice && quantity && type && (
                          <div className="bg-white dark:bg-gray-800 rounded p-3 border border-gray-200 dark:border-gray-600">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {type === 'long' 
                                ? `(${exitPrice} - ${entryPrice}) × ${quantity} = `
                                : `(${entryPrice} - ${exitPrice}) × ${quantity} = `
                              }
                              <span className={`font-bold ${
                                ((type === 'long' ? exitPrice - entryPrice : entryPrice - exitPrice) * quantity) >= 0 
                                  ? 'text-green-600 dark:text-green-400' 
                                  : 'text-red-600 dark:text-red-400'
                              }`}>
                                ${((type === 'long' ? exitPrice - entryPrice : entryPrice - exitPrice) * quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            <div className="modal-equal-fields">
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
          </form>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit(onFormSubmit)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Trade
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTradeModal;