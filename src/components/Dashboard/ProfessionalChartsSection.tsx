import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { Trade } from '../../types';
import { format, parseISO, startOfDay, isSameDay } from 'date-fns';

interface ProfessionalChartsSectionProps {
  trades: Trade[];
  type: 'cumulative' | 'daily';
}

const ProfessionalChartsSection: React.FC<ProfessionalChartsSectionProps> = ({ trades, type }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const generateChartData = () => {
    const closedTrades = trades
      .filter(trade => trade.status === 'closed' && trade.pnl !== undefined)
      .sort((a, b) => new Date(a.exitDate!).getTime() - new Date(b.exitDate!).getTime());

    if (closedTrades.length === 0) return [];

    if (type === 'cumulative') {
      // Cumulative P&L chart
      return closedTrades.reduce((acc, trade, index) => {
        const previousPnL = index === 0 ? 0 : acc[acc.length - 1].cumulativePnL;
        const cumulativePnL = previousPnL + trade.pnl!;
        
        acc.push({
          date: format(new Date(trade.exitDate!), 'MM/dd/yyyy'),
          cumulativePnL,
          pnl: trade.pnl!,
          symbol: trade.symbol
        });
        
        return acc;
      }, [] as any[]);
    } else {
      // Daily P&L chart - group trades by day
      const dailyPnL = new Map<string, number>();
      
      closedTrades.forEach(trade => {
        const dateKey = format(new Date(trade.exitDate!), 'MM/dd/yyyy');
        const currentPnL = dailyPnL.get(dateKey) || 0;
        dailyPnL.set(dateKey, currentPnL + trade.pnl!);
      });

      return Array.from(dailyPnL.entries()).map(([date, pnl]) => ({
        date,
        pnl,
        isPositive: pnl >= 0
      }));
    }
  };

  const chartData = generateChartData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg p-3">
          <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
            {label}
          </div>
          {type === 'cumulative' ? (
            <div className="text-sm">
              <div className={`font-bold ${
                data.cumulativePnL >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                Cumulative: {formatCurrency(data.cumulativePnL)}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Trade: {formatCurrency(data.pnl)}
              </div>
            </div>
          ) : (
            <div className={`text-sm font-bold ${
              data.pnl >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(data.pnl)}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <p className="text-sm">No trading data available</p>
          <p className="text-xs mt-1">Complete some trades to see charts</p>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      {type === 'cumulative' ? (
        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <defs>
            <linearGradient id="colorPnL" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorPnLNegative" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 10 }}
            stroke="#6b7280"
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 10 }}
            tickFormatter={formatCurrency}
            stroke="#6b7280"
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="cumulativePnL"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#colorPnL)"
          />
        </AreaChart>
      ) : (
        <BarChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 10 }}
            stroke="#6b7280"
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 10 }}
            tickFormatter={formatCurrency}
            stroke="#6b7280"
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="pnl" 
            fill={(entry: any) => entry.isPositive ? "#10b981" : "#ef4444"}
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      )}
    </ResponsiveContainer>
  );
};

export default ProfessionalChartsSection;