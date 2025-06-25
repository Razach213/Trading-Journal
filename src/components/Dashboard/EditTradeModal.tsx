import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { X, Calculator, DollarSign, Calendar, Tag, BookOpen } from 'lucide-react';
import { Trade } from '../../types';

interface EditTradeModalProps {
  trade: Trade;
  onClose: () => void;
  onSubmit: (trade: Partial<Trade>) => void;
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
  pnl?: number;
  notes?: string;
  strategy?: string;
  tags: string;
}

const EditTradeModal: React.FC<EditTradeModalProps> = ({ trade, onClose, onSubmit }) => {
  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue, 
    formState: { errors } 
  } = useForm<TradeFormData>({
    defaultValues: {
      symbol: trade.symbol,
      type: trade.type,
      entryPrice: trade.entryPrice,
      exitPrice: trade.exitPrice || undefined,
      quantity: trade.quantity,
      entryDate: trade.entryDate ? new Date(trade.entryDate).toISOString().slice(0, 16) : '',
      exitDate: trade.exitDate ? new Date(trade.exitDate).toISOString().slice(0, 16) : undefined,
      status: trade.status,
      pnl: trade.pnl || undefined,
      notes: trade.notes || undefined,
      strategy: trade.strategy || undefined,
      tags: trade.tags ? trade.tags.join(', ') : ''
    }
  });
  
  const [useManualPnL, setUseManualPnL] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  
  const status = watch('status');
  const entryPrice = watch('entryPrice');
  const exitPrice = watch('exitPrice');
  const quantity = watch('quantity');
  const type = watch('type');

  // Focus first input when modal opens
  useEffect(() => {
    // Prevent body scroll
    document.body.classList.add('overflow-hidden');
    
    return () => {
      document.body.classList.remove('overflow-hidden');
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

  const onFormSubmit = async (data: TradeFormData) => {
    setIsSubmitting(true);
    try {
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

      const updatedTrade: Partial<Trade> = {
        symbol: data.symbol ? data.symbol.toUpperCase().trim() : '',
        type: data.type || 'long',
        entryPrice: Number(data.entryPrice) || 0,
        exitPrice: data.status === 'closed' && data.exitPrice ? Number(data.exitPrice) : null,
        quantity: Number(data.quantity) || 0,
        entryDate: data.entryDate ? new Date(data.entryDate) : new Date(),
        exitDate: data.status === 'closed' && data.exitDate ? new Date(data.exitDate) : null,
        status: data.status || 'open',
        pnl: finalPnL,
        pnlPercent,
        notes: data.notes?.trim() || null,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [],
        strategy: data.strategy?.trim() || null
      };

      await onSubmit(updatedTrade);
      onClose();
    } catch (error) {
      console.error('Error updating trade:', error);
      setIsSubmitting(false);
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 }
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <motion.div 
          ref={modalRef} 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-hidden"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Trade</h2>
            <button
              onClick={onClose}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-10rem)]">
            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Symbol *
                  </label>
                  <input
                    type="text"
                    {...register('symbol')}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="AAPL"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type *
                  </label>
                  <select
                    {...register('type')}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="long">Long</option>
                    <option value="short">Short</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Entry Price *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      {...register('entryPrice', { 
                        required: 'Entry price is required',
                        min: { value: 0.01, message: 'Price must be greater than 0' }
                      })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="150.00"
                    />
                  </div>
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
                      min: { value: 0.01, message: 'Quantity must be greater than 0' }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="100"
                  />
                  {errors.quantity && (
                    <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.quantity.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Entry Date *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    <input
                      type="datetime-local"
                      {...register('entryDate', { required: 'Entry date is required' })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
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
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Exit Price {!useManualPnL && '*'}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <DollarSign className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        </div>
                        <input
                          type="number"
                          step="0.01"
                          {...register('exitPrice', {
                            required: !useManualPnL ? 'Exit price is required for closed trades' : false,
                            min: { value: 0.01, message: 'Price must be greater than 0' }
                          })}
                          disabled={useManualPnL}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                          placeholder="155.00"
                        />
                      </div>
                      {errors.exitPrice && (
                        <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.exitPrice.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Exit Date
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        </div>
                        <input
                          type="datetime-local"
                          {...register('exitDate')}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* P&L Calculation Options */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                        <Calculator className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                        P&L Calculation
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span id="manual-pnl-label" className="text-sm text-gray-600 dark:text-gray-400">Manual Input</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={useManualPnL}
                            onChange={() => setUseManualPnL(!useManualPnL)}
                            className="sr-only peer"
                            aria-labelledby="manual-pnl-label"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>

                    {useManualPnL ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          <DollarSign className="h-4 w-4 inline mr-1" />
                          Profit/Loss Amount
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          {...register('pnl', {
                            required: useManualPnL ? 'P&L is required when using manual input' : false
                          })}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Enter profit (+) or loss (-) amount"
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
                </>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <BookOpen className="h-4 w-4 inline mr-1" />
                    Strategy
                  </label>
                  <input
                    type="text"
                    {...register('strategy')}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Breakout, Reversal, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Tag className="h-4 w-4 inline mr-1" />
                    Tags
                  </label>
                  <input
                    type="text"
                    {...register('tags')}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Trade notes and observations..."
                />
              </div>
            </form>
          </div>

          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
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
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                'Update Trade'
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditTradeModal;