import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, getDay } from 'date-fns';
import { Trade } from '../../types';

interface ProfessionalCalendarProps {
  trades: Trade[];
}

const ProfessionalCalendar: React.FC<ProfessionalCalendarProps> = ({ trades }) => {
  const currentDate = new Date(2023, 11, 1); // December 2023
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(amount);
  };

  const getDayTrades = (day: Date) => {
    return trades.filter(trade => 
      trade.exitDate && isSameDay(new Date(trade.exitDate), day)
    );
  };

  const getDayPnL = (day: Date) => {
    const dayTrades = getDayTrades(day);
    return dayTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Add empty cells for days before month starts
  const startPadding = Array.from({ length: getDay(monthStart) }, (_, i) => (
    <div key={`padding-${i}`} className="h-16"></div>
  ));

  return (
    <div>
      {/* Week day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {startPadding}
        {days.map(day => {
          const dayTrades = getDayTrades(day);
          const dayPnL = getDayPnL(day);
          const hasData = dayTrades.length > 0;
          
          return (
            <div
              key={day.toISOString()}
              className={`h-16 border border-gray-200 dark:border-gray-700 rounded p-1 text-xs ${
                hasData 
                  ? dayPnL >= 0 
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <div className="font-medium text-gray-900 dark:text-white">
                {format(day, 'd')}
              </div>
              {hasData && (
                <div className="mt-1">
                  <div className={`text-xs font-medium ${
                    dayPnL >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {formatCurrency(dayPnL)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {dayTrades.length} trade{dayTrades.length !== 1 ? 's' : ''}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfessionalCalendar;