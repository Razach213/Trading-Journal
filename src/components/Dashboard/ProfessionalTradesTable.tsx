import React from 'react';
import { format } from 'date-fns';
import { Trade } from '../../types';

interface ProfessionalTradesTableProps {
  trades: Trade[];
  onUpdateTrade: (tradeId: string, updates: Partial<Trade>) => void;
  onDeleteTrade: (tradeId: string) => void;
}

const ProfessionalTradesTable: React.FC<ProfessionalTradesTableProps> = ({ 
  trades, 
  onUpdateTrade, 
  onDeleteTrade 
}) => {
  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return '$0.00';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return '-';
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      if (isNaN(dateObj.getTime())) return '-';
      return format(dateObj, 'MM-dd-yyyy');
    } catch (error) {
      return '-';
    }
  };

  // Show only open positions or recent trades
  const displayTrades = trades.filter(trade => trade.status === 'open').slice(0, 5);

  if (displayTrades.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400 text-sm">No open positions</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider py-2">
              Open Date
            </th>
            <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider py-2">
              Symbol
            </th>
            <th className="text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider py-2">
              Net P&L
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {displayTrades.map((trade) => (
            <tr key={trade.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <td className="py-3 text-sm text-gray-900 dark:text-white">
                {formatDate(trade.entryDate)}
              </td>
              <td className="py-3 text-sm font-medium text-gray-900 dark:text-white">
                {trade.symbol}
              </td>
              <td className="py-3 text-sm text-right">
                {trade.pnl !== null && trade.pnl !== undefined ? (
                  <span className={`font-medium ${
                    trade.pnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {formatCurrency(trade.pnl)}
                  </span>
                ) : (
                  <span className="text-gray-400 dark:text-gray-500">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProfessionalTradesTable;