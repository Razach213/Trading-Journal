import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Trade } from '../../types';
import { format } from 'date-fns';

interface AdvancedPerformanceChartProps {
  trades: Trade[];
}

const AdvancedPerformanceChart: React.FC<AdvancedPerformanceChartProps> = ({ trades }) => {
  const chartData = trades
    .filter(trade => trade.status === 'closed' && trade.pnl !== undefined)
    .sort((a, b) => new Date(a.exitDate!).getTime() - new Date(b.exitDate!).getTime())
    .reduce((acc, trade, index) => {
      const previousPnL = index === 0 ? 0 : acc[acc.length - 1].cumulativePnL;
      const cumulativePnL = previousPnL + trade.pnl!;
      
      acc.push({
        date: format(new Date(trade.exitDate!), 'MM/dd'),
        pnl: trade.pnl!,
        cumulativePnL,
        symbol: trade.symbol,
        formattedDate: format(new Date(trade.exitDate!), 'MMM dd, yyyy')
      });
      
      return acc;
    }, [] as any[]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  if (chartData.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <div className="text-4xl mb-2">📈</div>
          <p>No trading data to display</p>
          <p className="text-sm">Complete some trades to see your performance chart</p>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...chartData.map(d => d.cumulativePnL));
  const minValue = Math.min(...chartData.map(d => d.cumulativePnL));
  const isPositive = chartData[chartData.length - 1]?.cumulativePnL >= 0;

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPnL" x1="0" y1="0" x2="0" y2="1">
              <stop 
                offset="5%" 
                stopColor={isPositive ? "#10b981" : "#ef4444"} 
                stopOpacity={0.3}
              />
              <stop 
                offset="95%" 
                stopColor={isPositive ? "#10b981" : "#ef4444"} 
                stopOpacity={0.05}
              />
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="currentColor" 
            className="text-gray-200 dark:text-gray-700" 
            opacity={0.3}
          />
          <XAxis 
            dataKey="date" 
            stroke="currentColor"
            className="text-gray-600 dark:text-gray-400"
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            stroke="currentColor"
            className="text-gray-600 dark:text-gray-400"
            tick={{ fontSize: 12 }}
            tickFormatter={formatCurrency}
            axisLine={false}
            tickLine={false}
            domain={[minValue * 1.1, maxValue * 1.1]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--tooltip-bg, #ffffff)',
              color: 'var(--tooltip-color, #374151)',
              border: '1px solid var(--tooltip-border, #e5e7eb)',
              borderRadius: '8px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              fontSize: '14px'
            }}
            className="dark:bg-gray-800 dark:text-white dark:border-gray-600"
            formatter={(value: number, name: string) => [
              formatCurrency(value),
              name === 'cumulativePnL' ? 'Cumulative P&L' : 'Trade P&L'
            ]}
            labelFormatter={(label, payload) => {
              if (payload && payload[0]) {
                return `${payload[0].payload.formattedDate}`;
              }
              return `Date: ${label}`;
            }}
          />
          <Area
            type="monotone"
            dataKey="cumulativePnL"
            stroke={isPositive ? "#10b981" : "#ef4444"}
            strokeWidth={3}
            fill="url(#colorPnL)"
            dot={{ 
              fill: isPositive ? "#10b981" : "#ef4444", 
              strokeWidth: 2, 
              r: 4,
              stroke: "#ffffff"
            }}
            activeDot={{ 
              r: 6, 
              stroke: isPositive ? "#10b981" : "#ef4444", 
              strokeWidth: 3,
              fill: "#ffffff"
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AdvancedPerformanceChart;