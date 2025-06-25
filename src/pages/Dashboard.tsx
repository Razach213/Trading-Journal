import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useTrades } from '../hooks/useTrades';
import { useAccountBalance } from '../hooks/useAccountBalance';
import { format } from 'date-fns';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Plus, 
  Edit, 
  Trash2, 
  Download, 
  Moon, 
  Sun, 
  Menu, 
  X, 
  CheckSquare, 
  PlusCircle, 
  Save, 
  Copy, 
  FileDown,
  Home,
  BookOpen,
  Settings,
  LogOut,
  User,
  Bell,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Zap,
  Calendar,
  Clock,
  Target,
  Award,
  Briefcase,
  Layers,
  MoreHorizontal
} from 'lucide-react';
import { Trade } from '../types';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import toast from 'react-hot-toast';
import ChecklistWidget from '../components/Dashboard/ChecklistWidget';
import PerformanceChart from '../components/Dashboard/PerformanceChart';
import AddTradeModal from '../components/Dashboard/AddTradeModal';
import EditTradeModal from '../components/Dashboard/EditTradeModal';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { trades, stats, loading, error, addTrade, updateTrade, deleteTrade } = useTrades(user?.id);
  const { accountBalance, updateStartingBalance, updateCurrentBalance } = useAccountBalance(user?.id);
  
  const [showAddTradeModal, setShowAddTradeModal] = useState(false);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Trade | null;
    direction: 'ascending' | 'descending';
  }>({
    key: 'entryDate',
    direction: 'descending',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'long' | 'short'>('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Sort trades
  const sortedTrades = React.useMemo(() => {
    if (!trades) return [];
    
    const sortableTrades = [...trades];
    
    if (sortConfig.key) {
      sortableTrades.sort((a, b) => {
        if (a[sortConfig.key!] === null) return 1;
        if (b[sortConfig.key!] === null) return -1;
        
        if (sortConfig.key === 'entryDate' || sortConfig.key === 'exitDate') {
          const dateA = a[sortConfig.key] ? new Date(a[sortConfig.key] as Date).getTime() : 0;
          const dateB = b[sortConfig.key] ? new Date(b[sortConfig.key] as Date).getTime() : 0;
          
          return sortConfig.direction === 'ascending' ? dateA - dateB : dateB - dateA;
        }
        
        if (typeof a[sortConfig.key!] === 'string' && typeof b[sortConfig.key!] === 'string') {
          return sortConfig.direction === 'ascending'
            ? (a[sortConfig.key!] as string).localeCompare(b[sortConfig.key!] as string)
            : (b[sortConfig.key!] as string).localeCompare(a[sortConfig.key!] as string);
        }
        
        return sortConfig.direction === 'ascending'
          ? (a[sortConfig.key!] as number) - (b[sortConfig.key!] as number)
          : (b[sortConfig.key!] as number) - (a[sortConfig.key!] as number);
      });
    }
    
    return sortableTrades;
  }, [trades, sortConfig]);

  // Filter trades
  const filteredTrades = React.useMemo(() => {
    return sortedTrades.filter(trade => {
      const matchesSearch = 
        trade.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (trade.notes && trade.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (trade.strategy && trade.strategy.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = 
        statusFilter === 'all' || 
        trade.status === statusFilter;
      
      const matchesType = 
        typeFilter === 'all' || 
        trade.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [sortedTrades, searchTerm, statusFilter, typeFilter]);

  // Request sort
  const requestSort = (key: keyof Trade) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
  };

  // Format currency
  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return '$0.00';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Export trades to CSV
  const exportToCSV = () => {
    if (!filteredTrades.length) {
      toast.error('No trades to export');
      return;
    }
    
    const headers = ['Symbol', 'Type', 'Entry Price', 'Exit Price', 'Quantity', 'Entry Date', 'Exit Date', 'Status', 'P&L', 'Notes'];
    
    const csvContent = [
      headers.join(','),
      ...filteredTrades.map(trade => [
        trade.symbol,
        trade.type,
        trade.entryPrice,
        trade.exitPrice || '',
        trade.quantity,
        format(new Date(trade.entryDate), 'yyyy-MM-dd HH:mm'),
        trade.exitDate ? format(new Date(trade.exitDate), 'yyyy-MM-dd HH:mm') : '',
        trade.status,
        trade.pnl || '',
        trade.notes ? `"${trade.notes.replace(/"/g, '""')}"` : ''
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `trades_export_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Trades exported to CSV');
  };

  // Export trades to PDF
  const exportToPDF = () => {
    if (!filteredTrades.length) {
      toast.error('No trades to export');
      return;
    }
    
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('Trading Journal Export', 14, 22);
    
    // Add date
    doc.setFontSize(11);
    doc.text(`Generated: ${format(new Date(), 'PPP')}`, 14, 30);
    
    // Add user info if available
    if (user) {
      doc.text(`Trader: ${user.displayName}`, 14, 38);
    }
    
    // Add stats summary
    doc.setFontSize(14);
    doc.text('Performance Summary', 14, 50);
    
    doc.setFontSize(10);
    const summaryData = [
      ['Total Trades', stats.totalTrades.toString()],
      ['Win Rate', `${stats.winRate.toFixed(1)}%`],
      ['Total P&L', formatCurrency(stats.totalPnL)],
      ['Profit Factor', stats.profitFactor.toFixed(2)]
    ];
    
    (doc as any).autoTable({
      startY: 55,
      head: [['Metric', 'Value']],
      body: summaryData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] }
    });
    
    // Add trades table
    doc.setFontSize(14);
    doc.text('Trade History', 14, (doc as any).lastAutoTable.finalY + 15);
    
    const tableData = filteredTrades.map(trade => [
      trade.symbol,
      trade.type.toUpperCase(),
      formatCurrency(trade.entryPrice),
      trade.exitPrice ? formatCurrency(trade.exitPrice) : '-',
      trade.quantity.toString(),
      format(new Date(trade.entryDate), 'yyyy-MM-dd'),
      trade.exitDate ? format(new Date(trade.exitDate), 'yyyy-MM-dd') : '-',
      trade.status.toUpperCase(),
      trade.pnl ? formatCurrency(trade.pnl) : '-'
    ]);
    
    (doc as any).autoTable({
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [['Symbol', 'Type', 'Entry', 'Exit', 'Qty', 'Entry Date', 'Exit Date', 'Status', 'P&L']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] }
    });
    
    // Save the PDF
    doc.save(`trading_journal_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    
    toast.success('Trades exported to PDF');
  };

  // Delete trade with confirmation
  const handleDeleteTrade = (tradeId: string) => {
    if (window.confirm('Are you sure you want to delete this trade? This action cannot be undone.')) {
      deleteTrade(tradeId);
      toast.success('Trade deleted successfully');
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please sign in to access your dashboard
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar - Desktop */}
      <motion.div 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Zap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">ZellaX</span>
            </div>
            <button 
              className="lg:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* User info */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {user.displayName?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">{user.displayName}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user.plan} Plan</p>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            <a href="#" className="flex items-center space-x-3 px-3 py-3 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Home className="h-5 w-5" />
              <span className="font-medium">Dashboard</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <BarChart3 className="h-5 w-5" />
              <span>Analytics</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <BookOpen className="h-5 w-5" />
              <span>Playbooks</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <Calendar className="h-5 w-5" />
              <span>Calendar</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <Layers className="h-5 w-5" />
              <span>Portfolio</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </a>
          </nav>
          
          {/* Bottom actions */}
          <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-3 px-3 py-3 w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-left"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Navigation */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between h-16 px-4 md:px-6">
            <div className="flex items-center">
              <button 
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="ml-4 text-xl font-semibold text-gray-900 dark:text-white hidden sm:block">Trading Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="pl-10 pr-4 py-2 w-64 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white"
                />
              </div>
              
              <button className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                <Bell className="h-6 w-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <button 
                onClick={toggleDarkMode}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
              </button>
              
              <div className="relative">
                <button className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user.displayName?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:block">{user.displayName}</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
        )}

        {/* Main Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome back, {user.displayName}!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Here's your trading performance overview
              </p>
            </motion.div>

            {/* Stats Cards */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total P&L</p>
                    <p className={`text-2xl font-bold ${stats.totalPnL >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {formatCurrency(stats.totalPnL)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {stats.winningTrades} wins, {stats.losingTrades} losses
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stats.totalPnL >= 0 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                    <DollarSign className={`h-6 w-6 ${stats.totalPnL >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
                  </div>
                </div>
                <div className="mt-4 h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-1 ${stats.totalPnL >= 0 ? 'bg-green-500 dark:bg-green-400' : 'bg-red-500 dark:bg-red-400'}`}
                    style={{ width: `${Math.min(Math.abs(stats.winRate), 100)}%` }}
                  ></div>
                </div>
              </motion.div>

              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Win Rate</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {stats.winRate.toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Based on {stats.totalTrades} trades
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="mt-4 h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-1 bg-blue-500 dark:bg-blue-400"
                    style={{ width: `${Math.min(stats.winRate, 100)}%` }}
                  ></div>
                </div>
              </motion.div>

              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Profit Factor</p>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {stats.profitFactor.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {stats.profitFactor >= 1.5 ? 'Excellent' : stats.profitFactor >= 1 ? 'Good' : 'Needs improvement'}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div className="mt-4 h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-1 bg-purple-500 dark:bg-purple-400"
                    style={{ width: `${Math.min(stats.profitFactor * 20, 100)}%` }}
                  ></div>
                </div>
              </motion.div>
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Chart */}
              <motion.div 
                className="lg:col-span-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 h-full">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Performance Chart</h3>
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <Filter className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="h-80">
                    <PerformanceChart trades={trades} />
                  </div>
                </div>
              </motion.div>

              {/* Right Column - Checklist */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <ChecklistWidget userId={user.id} />
              </motion.div>
            </div>

            {/* Trades Table Section */}
            <motion.div 
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Trading Journal</h3>
                    
                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                        <input 
                          type="text" 
                          placeholder="Search trades..." 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2 w-full sm:w-64 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white"
                        />
                      </div>
                      
                      <div className="flex space-x-3">
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value as 'all' | 'open' | 'closed')}
                          className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white"
                        >
                          <option value="all">All Status</option>
                          <option value="open">Open</option>
                          <option value="closed">Closed</option>
                        </select>
                        
                        <select
                          value={typeFilter}
                          onChange={(e) => setTypeFilter(e.target.value as 'all' | 'long' | 'short')}
                          className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white"
                        >
                          <option value="all">All Types</option>
                          <option value="long">Long</option>
                          <option value="short">Short</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Table Actions */}
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {filteredTrades.length} {filteredTrades.length === 1 ? 'trade' : 'trades'}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center space-x-2">
                    <button 
                      onClick={() => setShowAddTradeModal(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Trade</span>
                    </button>
                    
                    <div className="relative group">
                      <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        <Download className="h-4 w-4" />
                        <span>Export</span>
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 hidden group-hover:block z-10">
                        <button 
                          onClick={exportToCSV}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <FileDown className="h-4 w-4" />
                          <span>Export as CSV</span>
                        </button>
                        <button 
                          onClick={exportToPDF}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <FileDown className="h-4 w-4" />
                          <span>Export as PDF</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Table */}
                <div className="overflow-x-auto">
                  {loading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
                    </div>
                  ) : error ? (
                    <div className="flex flex-col items-center justify-center h-64">
                      <p className="text-red-600 dark:text-red-400 mb-2">Error loading trades</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{error}</p>
                    </div>
                  ) : filteredTrades.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64">
                      <p className="text-gray-600 dark:text-gray-400 mb-2">No trades found</p>
                      <button 
                        onClick={() => setShowAddTradeModal(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mt-4"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Your First Trade</span>
                      </button>
                    </div>
                  ) : (
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th 
                            scope="col" 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                            onClick={() => requestSort('symbol')}
                          >
                            <div className="flex items-center space-x-1">
                              <span>Symbol</span>
                              <ArrowUpDown className="h-4 w-4" />
                            </div>
                          </th>
                          <th 
                            scope="col" 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                            onClick={() => requestSort('type')}
                          >
                            <div className="flex items-center space-x-1">
                              <span>Type</span>
                              <ArrowUpDown className="h-4 w-4" />
                            </div>
                          </th>
                          <th 
                            scope="col" 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                            onClick={() => requestSort('entryPrice')}
                          >
                            <div className="flex items-center space-x-1">
                              <span>Entry</span>
                              <ArrowUpDown className="h-4 w-4" />
                            </div>
                          </th>
                          <th 
                            scope="col" 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                            onClick={() => requestSort('exitPrice')}
                          >
                            <div className="flex items-center space-x-1">
                              <span>Exit</span>
                              <ArrowUpDown className="h-4 w-4" />
                            </div>
                          </th>
                          <th 
                            scope="col" 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                            onClick={() => requestSort('pnl')}
                          >
                            <div className="flex items-center space-x-1">
                              <span>P&L</span>
                              <ArrowUpDown className="h-4 w-4" />
                            </div>
                          </th>
                          <th 
                            scope="col" 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                            onClick={() => requestSort('entryDate')}
                          >
                            <div className="flex items-center space-x-1">
                              <span>Date</span>
                              <ArrowUpDown className="h-4 w-4" />
                            </div>
                          </th>
                          <th 
                            scope="col" 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                            onClick={() => requestSort('status')}
                          >
                            <div className="flex items-center space-x-1">
                              <span>Status</span>
                              <ArrowUpDown className="h-4 w-4" />
                            </div>
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredTrades.map((trade) => (
                          <motion.tr 
                            key={trade.id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{trade.symbol}</div>
                              {trade.strategy && (
                                <div className="text-xs text-gray-500 dark:text-gray-400">{trade.strategy}</div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                trade.type === 'long' 
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                                  : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                              }`}>
                                {trade.type.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {formatCurrency(trade.entryPrice)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {trade.exitPrice ? formatCurrency(trade.exitPrice) : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {trade.pnl !== undefined && trade.pnl !== null ? (
                                <span className={`text-sm font-medium ${
                                  trade.pnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                }`}>
                                  {formatCurrency(trade.pnl)}
                                </span>
                              ) : (
                                <span className="text-sm text-gray-500 dark:text-gray-400">-</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {format(new Date(trade.entryDate), 'MMM dd, yyyy')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                trade.status === 'open' 
                                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' 
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                              }`}>
                                {trade.status.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end space-x-2">
                                <button 
                                  onClick={() => setEditingTrade(trade)}
                                  className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteTrade(trade.id)}
                                  className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 lg:hidden z-40">
        <div className="grid grid-cols-5 h-16">
          <button className="flex flex-col items-center justify-center text-blue-600 dark:text-blue-400">
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </button>
          <button className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
            <BarChart3 className="h-5 w-5" />
            <span className="text-xs mt-1">Stats</span>
          </button>
          <button 
            onClick={() => setShowAddTradeModal(true)}
            className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center -mt-5">
              <Plus className="h-6 w-6 text-white" />
            </div>
          </button>
          <button className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
            <BookOpen className="h-5 w-5" />
            <span className="text-xs mt-1">Journal</span>
          </button>
          <button className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">Profile</span>
          </button>
        </div>
      </div>

      {/* Add Trade Modal */}
      <AnimatePresence>
        {showAddTradeModal && (
          <AddTradeModal
            onClose={() => setShowAddTradeModal(false)}
            onSubmit={addTrade}
            userId={user.id}
          />
        )}
      </AnimatePresence>

      {/* Edit Trade Modal */}
      <AnimatePresence>
        {editingTrade && (
          <EditTradeModal
            trade={editingTrade}
            onClose={() => setEditingTrade(null)}
            onSubmit={(updatedTrade) => {
              updateTrade(editingTrade.id, updatedTrade);
              setEditingTrade(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;