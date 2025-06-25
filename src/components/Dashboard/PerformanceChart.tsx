import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';
import { BarChart3 } from 'lucide-react';
import { Trade } from '../../types';
import { format } from 'date-fns';

interface PerformanceChartProps {
  trades: Trade[];
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ trades }) => {
  const [isClient, setIsClient] = useState(false);
  const [chartData, setChartData] = useState<any>({
    options: {
      chart: {
        id: 'performance-chart',
        type: 'area',
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true
          }
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350
          }
        },
        dropShadow: {
          enabled: true,
          top: 0,
          left: 0,
          blur: 3,
          opacity: 0.2
        }
      },
      colors: ['#3b82f6'],
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'vertical',
          shadeIntensity: 0.3,
          gradientToColors: ['#8b5cf6'],
          inverseColors: false,
          opacityFrom: 0.7,
          opacityTo: 0.3,
          stops: [0, 90, 100]
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      grid: {
        borderColor: '#e0e0e0',
        row: {
          colors: ['transparent', 'transparent'],
          opacity: 0.5
        }
      },
      markers: {
        size: 4,
        colors: ['#3b82f6'],
        strokeColors: '#fff',
        strokeWidth: 2,
        hover: {
          size: 7
        }
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            colors: '#64748b'
          }
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      yaxis: {
        labels: {
          formatter: function(value: number) {
            return '$' + value.toFixed(0);
          },
          style: {
            colors: '#64748b'
          }
        }
      },
      tooltip: {
        x: {
          format: 'dd MMM yyyy'
        },
        y: {
          formatter: function(value: number) {
            return '$' + value.toFixed(2);
          }
        },
        theme: 'dark'
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right'
      }
    },
    series: [{
      name: 'Cumulative P&L',
      data: []
    }]
  });

  // Process trades data for chart
  useEffect(() => {
    // Only run on client-side
    setIsClient(true);
    
    if (!trades || trades.length === 0) {
      return;
    }
    
    const closedTrades = trades
      .filter(trade => trade.status === 'closed' && trade.pnl !== undefined && trade.pnl !== null)
      .sort((a, b) => new Date(a.exitDate!).getTime() - new Date(b.exitDate!).getTime());
    
    if (closedTrades.length === 0) {
      return;
    }
    
    const categories: string[] = [];
    const data: number[] = [];
    let cumulativePnL = 0;
    
    closedTrades.forEach(trade => {
      if (trade.exitDate && trade.pnl !== undefined && trade.pnl !== null) {
        cumulativePnL += trade.pnl;
        categories.push(format(new Date(trade.exitDate), 'MMM dd'));
        data.push(parseFloat(cumulativePnL.toFixed(2)));
      }
    });
    
    setChartData(prevState => ({
      ...prevState,
      options: {
        ...prevState.options,
        xaxis: {
          ...prevState.options.xaxis,
          categories
        },
        theme: {
          mode: document.documentElement.classList.contains('dark') ? 'dark' : 'light'
        }
      },
      series: [{
        name: 'Cumulative P&L',
        data
      }]
    }));
  }, [trades]);

  // Update chart theme when dark mode changes
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const darkMode = document.documentElement.classList.contains('dark');
          setChartData(prevState => ({
            ...prevState,
            options: {
              ...prevState.options,
              theme: {
                mode: darkMode ? 'dark' : 'light'
              },
              grid: {
                ...prevState.options.grid,
                borderColor: darkMode ? '#374151' : '#e0e0e0'
              },
              xaxis: {
                ...prevState.options.xaxis,
                labels: {
                  ...prevState.options.xaxis.labels,
                  style: {
                    colors: darkMode ? '#9ca3af' : '#64748b'
                  }
                }
              },
              yaxis: {
                ...prevState.options.yaxis,
                labels: {
                  ...prevState.options.yaxis.labels,
                  style: {
                    colors: darkMode ? '#9ca3af' : '#64748b'
                  }
                }
              }
            }
          }));
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => {
      observer.disconnect();
    };
  }, []);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  if (trades.length === 0 || !chartData.series[0].data.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-gray-400 dark:text-gray-500 mb-4">
          <BarChart3 className="h-12 w-12 mx-auto" />
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-center">
          No closed trades yet. Complete some trades to see your performance chart.
        </p>
      </div>
    );
  }

  return (
    <motion.div 
      className="h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="area"
        height="100%"
      />
    </motion.div>
  );
};

export default PerformanceChart;