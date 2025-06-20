import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceLine } from 'recharts';
import { Trade } from '../../types';
import { format, subDays, isAfter, isBefore } from 'date-fns';

interface AdvancedPerformanceChartProps {
  trades: Trade[];
}

const AdvancedPerformanceChart: React.FC<AdvancedPerformanceChartProps> = ({ trades }) => {
  const [timeFilter, setTimeFilter] = useState('1W');
  const [hoveredPoint, setHoveredPoint] = useState<any>(null);

  const timeFilters = [
    { label: '1D', value: '1D', days: 1 },
    { label: '1W', value: '1W', days: 7 },
    { label: '1M', value: '1M', days: 30 },
    { label: '3M', value: '3M', days: 90 },
    { label: 'ALL', value: 'ALL', days: 365 }
  ];

  const chartData = useMemo(() => {
    const closedTrades = trades
      .filter(trade => trade.status === 'closed' && trade.pnl !== undefined)
      .sort((a, b) => new Date(a.exitDate!).getTime() - new Date(b.exitDate!).getTime());

    if (closedTrades.length === 0) return [];

    // Filter trades based on selected time period
    const filterDate = timeFilter === 'ALL' 
      ? new Date(0) 
      : subDays(new Date(), timeFilters.find(f => f.value === timeFilter)?.days || 7);

    const filteredTrades = closedTrades.filter(trade => 
      isAfter(new Date(trade.exitDate!), filterDate)
    );

    if (filteredTrades.length === 0) return [];

    // Create data points with smooth interpolation
    const dataPoints = filteredTrades.reduce((acc, trade, index) => {
      const previousPnL = index === 0 ? 0 : acc[acc.length - 1].cumulativePnL;
      const cumulativePnL = previousPnL + trade.pnl!;
      const tradeDate = new Date(trade.exitDate!);
      
      acc.push({
        date: format(tradeDate, 'MM/dd'),
        fullDate: tradeDate,
        pnl: trade.pnl!,
        cumulativePnL,
        symbol: trade.symbol,
        formattedDate: format(tradeDate, 'MMM dd, yyyy'),
        type: trade.type,
        entryPrice: trade.entryPrice,
        exitPrice: trade.exitPrice,
        quantity: trade.quantity,
        winRate: ((acc.filter(p => p.pnl > 0).length + (trade.pnl! > 0 ? 1 : 0)) / (index + 1)) * 100,
        tradeCount: index + 1,
        maxDrawdown: Math.min(...acc.map(p => p.cumulativePnL), cumulativePnL),
        isWin: trade.pnl! > 0
      });
      
      return acc;
    }, [] as any[]);

    // Add starting point if needed
    if (dataPoints.length > 0) {
      const firstTrade = dataPoints[0];
      const startDate = subDays(firstTrade.fullDate, 1);
      dataPoints.unshift({
        date: format(startDate, 'MM/dd'),
        fullDate: startDate,
        pnl: 0,
        cumulativePnL: 0,
        symbol: '',
        formattedDate: format(startDate, 'MMM dd, yyyy'),
        type: '',
        winRate: 0,
        tradeCount: 0,
        maxDrawdown: 0,
        isWin: false
      });
    }

    return dataPoints;
  }, [trades, timeFilter]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatCurrencyDetailed = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  if (chartData.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">📈</div>
          <p className="text-lg font-medium mb-2">No trading data to display</p>
          <p className="text-sm">Complete some trades to see your performance chart</p>
          <div className="mt-4 flex justify-center space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const lastPoint = chartData[chartData.length - 1];
  const isPositive = lastPoint?.cumulativePnL >= 0;
  const maxValue = Math.max(...chartData.map(d => d.cumulativePnL));
  const minValue = Math.min(...chartData.map(d => d.cumulativePnL));
  const range = maxValue - minValue;
  const padding = range * 0.1;

  // Calculate performance metrics
  const totalReturn = lastPoint?.cumulativePnL || 0;
  const winRate = lastPoint?.winRate || 0;
  const maxDrawdown = Math.min(...chartData.map(d => d.maxDrawdown || 0));
  const totalTrades = lastPoint?.tradeCount || 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl p-4 min-w-[250px]">
          <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            {data.formattedDate}
          </div>
          
          {data.symbol && (
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Symbol:</span>
                <span className="font-medium text-gray-900 dark:text-white">{data.symbol}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Type:</span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  data.type === 'long' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                }`}>
                  {data.type?.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Trade P&L:</span>
                <span className={`font-medium ${
                  data.pnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {formatCurrencyDetailed(data.pnl)}
                </span>
              </div>
              <hr className="border-gray-200 dark:border-gray-600" />
            </div>
          )}
          
          <div className="space-y-1 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Cumulative P&L:</span>
              <span className={`font-bold ${
                data.cumulativePnL >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {formatCurrencyDetailed(data.cumulativePnL)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Win Rate:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {data.winRate?.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Total Trades:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {data.tradeCount}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (!payload.symbol) return null; // Don't show dot for starting point
    
    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r={4}
          fill={payload.isWin ? "#10b981" : "#ef4444"}
          stroke="#ffffff"
          strokeWidth={2}
          className="animate-pulse"
        />
        <circle
          cx={cx}
          cy={cy}
          r={8}
          fill={payload.isWin ? "#10b981" : "#ef4444"}
          fillOpacity={0.2}
          className="animate-ping"
        />
      </g>
    );
  };

  return (
    <div className="space-y-4">
      {/* Time Filter Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {timeFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setTimeFilter(filter.value)}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all duration-200 ${
                timeFilter === filter.value
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
        
        {/* Performance Metrics */}
        <div className="flex items-center space-x-4 text-xs">
          <div className="text-center">
            <div className="text-gray-500 dark:text-gray-400">Return</div>
            <div className={`font-bold ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {formatCurrency(totalReturn)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-gray-500 dark:text-gray-400">Win Rate</div>
            <div className="font-bold text-gray-900 dark:text-white">
              {winRate.toFixed(1)}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-gray-500 dark:text-gray-400">Trades</div>
            <div className="font-bold text-gray-900 dark:text-white">
              {totalTrades}
            </div>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative h-80 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg p-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            data={chartData} 
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            onMouseMove={(e) => setHoveredPoint(e?.activePayload?.[0]?.payload)}
            onMouseLeave={() => setHoveredPoint(null)}
          >
            <defs>
              <linearGradient id="colorPnL" x1="0" y1="0" x2="0" y2="1">
                <stop 
                  offset="5%" 
                  stopColor={isPositive ? "#10b981" : "#ef4444"} 
                  stopOpacity={0.4}
                />
                <stop 
                  offset="50%" 
                  stopColor={isPositive ? "#10b981" : "#ef4444"} 
                  stopOpacity={0.2}
                />
                <stop 
                  offset="95%" 
                  stopColor={isPositive ? "#10b981" : "#ef4444"} 
                  stopOpacity={0.05}
                />
              </linearGradient>
              
              {/* Glow effect */}
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
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
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            
            <YAxis 
              stroke="currentColor"
              className="text-gray-600 dark:text-gray-400"
              tick={{ fontSize: 11 }}
              tickFormatter={formatCurrency}
              axisLine={false}
              tickLine={false}
              domain={[minValue - padding, maxValue + padding]}
            />
            
            {/* Zero line */}
            <ReferenceLine 
              y={0} 
              stroke="#6b7280" 
              strokeDasharray="2 2" 
              opacity={0.5}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Area
              type="monotone"
              dataKey="cumulativePnL"
              stroke={isPositive ? "#10b981" : "#ef4444"}
              strokeWidth={3}
              fill="url(#colorPnL)"
              dot={<CustomDot />}
              activeDot={{ 
                r: 6, 
                stroke: isPositive ? "#10b981" : "#ef4444", 
                strokeWidth: 3,
                fill: "#ffffff",
                filter: "url(#glow)"
              }}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
          </AreaChart>
        </ResponsiveContainer>
        
        {/* Floating Stats on Hover */}
        {hoveredPoint && hoveredPoint.symbol && (
          <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg p-3 animate-fade-in">
            <div className="text-xs space-y-1">
              <div className="font-medium text-gray-900 dark:text-white">
                {hoveredPoint.symbol} • {hoveredPoint.type?.toUpperCase()}
              </div>
              <div className={`text-sm font-bold ${
                hoveredPoint.pnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {formatCurrencyDetailed(hoveredPoint.pnl)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Max Drawdown</div>
          <div className="text-sm font-bold text-red-600 dark:text-red-400">
            {formatCurrency(maxDrawdown)}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Best Trade</div>
          <div className="text-sm font-bold text-green-600 dark:text-green-400">
            {formatCurrency(Math.max(...chartData.map(d => d.pnl || 0)))}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Worst Trade</div>
          <div className="text-sm font-bold text-red-600 dark:text-red-400">
            {formatCurrency(Math.min(...chartData.map(d => d.pnl || 0)))}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Avg Trade</div>
          <div className="text-sm font-bold text-gray-900 dark:text-white">
            {formatCurrency(totalReturn / Math.max(totalTrades, 1))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedPerformanceChart;