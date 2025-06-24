import React, { useEffect, useRef, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Trade } from '../../types';
import { format } from 'date-fns';

interface PerformanceChartProps {
  trades: Trade[];
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ trades }) => {
  const [isAnimating, setIsAnimating] = useState(true);
  const [animationProgress, setAnimationProgress] = useState(0);
  const chartRef = useRef<HTMLDivElement>(null);
  
  const chartData = trades
    .filter(trade => trade.status === 'closed' && trade.pnl !== undefined)
    .sort((a, b) => new Date(a.exitDate!).getTime() - new Date(b.exitDate!).getTime())
    .reduce((acc, trade, index) => {
      const previousPnL = index === 0 ? 0 : acc[acc.length - 1].cumulativePnL;
      const cumulativePnL = previousPnL + trade.pnl!;
      
      acc.push({
        date: format(new Date(trade.exitDate!), 'MMM dd'),
        pnl: trade.pnl!,
        cumulativePnL,
        symbol: trade.symbol
      });
      
      return acc;
    }, [] as any[]);

  // Animation effect
  useEffect(() => {
    if (chartData.length === 0) return;
    
    let animationFrame: number;
    let startTime: number | null = null;
    const duration = 1500; // Animation duration in ms
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      setAnimationProgress(progress);
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [chartData.length]);

  // Intersection Observer for re-animation on scroll
  useEffect(() => {
    if (!chartRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsAnimating(true);
          setAnimationProgress(0);
        }
      },
      { threshold: 0.1 }
    );
    
    observer.observe(chartRef.current);
    
    return () => {
      if (chartRef.current) {
        observer.unobserve(chartRef.current);
      }
    };
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Calculate visible data based on animation progress
  const visibleData = isAnimating 
    ? chartData.slice(0, Math.ceil(chartData.length * animationProgress))
    : chartData;

  if (chartData.length === 0) {
    return (
      <div className="h-48 sm:h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <p className="text-sm sm:text-base">No closed trades to display</p>
          <p className="text-xs sm:text-sm mt-1">Complete some trades to see your performance chart</p>
        </div>
      </div>
    );
  }

  // Find min and max values for better visualization
  const minValue = Math.min(...chartData.map(d => d.cumulativePnL));
  const maxValue = Math.max(...chartData.map(d => d.cumulativePnL));
  const domain = [minValue < 0 ? minValue * 1.1 : 0, maxValue * 1.1];

  return (
    <div className="h-48 sm:h-64" ref={chartRef}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={visibleData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
          <defs>
            <linearGradient id="colorPnL" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
            </linearGradient>
            <filter id="shadow" height="200%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#3b82f6" floodOpacity="0.3" />
            </filter>
            <filter id="glow" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="currentColor" 
            className="text-gray-200 dark:text-gray-700" 
            vertical={false}
          />
          
          <XAxis 
            dataKey="date" 
            stroke="currentColor"
            className="text-gray-600 dark:text-gray-400"
            tick={{ fontSize: 10 }}
            interval="preserveStartEnd"
            tickLine={false}
            axisLine={false}
          />
          
          <YAxis 
            stroke="currentColor"
            className="text-gray-600 dark:text-gray-400"
            tick={{ fontSize: 10 }}
            tickFormatter={formatCurrency}
            width={60}
            domain={domain}
            tickLine={false}
            axisLine={false}
          />
          
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--tooltip-bg, #ffffff)',
              color: 'var(--tooltip-color, #374151)',
              border: '1px solid var(--tooltip-border, #e5e7eb)',
              borderRadius: '8px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              padding: '12px',
              fontSize: '12px'
            }}
            className="dark:bg-gray-800 dark:text-white dark:border-gray-600"
            formatter={(value: number, name: string) => [
              formatCurrency(value),
              name === 'cumulativePnL' ? 'Cumulative P&L' : 'Trade P&L'
            ]}
            labelFormatter={(label) => `Date: ${label}`}
            animationDuration={300}
          />
          
          <Area
            type="monotone"
            dataKey="cumulativePnL"
            stroke="#3b82f6"
            strokeWidth={3}
            fill="url(#colorPnL)"
            dot={{ 
              fill: '#3b82f6', 
              strokeWidth: 2, 
              r: 4,
              strokeDasharray: isAnimating ? '0' : '' 
            }}
            activeDot={{ 
              r: 6, 
              stroke: '#3b82f6', 
              strokeWidth: 2,
              fill: '#fff',
              filter: 'url(#glow)'
            }}
            isAnimationActive={false}
            filter="url(#shadow)"
            className="animate-chart-line"
          />
        </AreaChart>
      </ResponsiveContainer>
      
      {/* Animated gradient overlay for 3D effect */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-20"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.05) 100%)',
          borderRadius: 'inherit',
          mixBlendMode: 'overlay'
        }}
      ></div>
      
      {/* Animated bottom reflection */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none opacity-20 dark:opacity-10"
        style={{
          background: 'linear-gradient(to bottom, rgba(59, 130, 246, 0.2), transparent)',
          transform: 'scaleY(-1)',
          filter: 'blur(4px)'
        }}
      ></div>
    </div>
  );
};

export default PerformanceChart;