import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Activity, 
  Settings, 
  Database, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  FileText,
  Download,
  RefreshCw,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Plus,
  Mail,
  Phone,
  Calendar,
  Target,
  Award,
  Zap,
  Lock,
  EyeOff,
  WifiOff
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import toast from 'react-hot-toast';
import { isDemoMode } from '../lib/firebase';

// Admin password - hardcoded as requested
const ADMIN_PASSWORD = "Alibot@321";

// Mock data for demo - in real app this would come from Firebase
const mockUsers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', plan: 'pro', status: 'active', joinDate: '2024-01-15', trades: 45, pnl: 2500 },
  { id: '2', name: 'Sarah Smith', email: 'sarah@example.com', plan: 'free', status: 'active', joinDate: '2024-02-20', trades: 12, pnl: 150 },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com', plan: 'premium', status: 'inactive', joinDate: '2024-01-10', trades: 89, pnl: 5200 },
  { id: '4', name: 'Emily Davis', email: 'emily@example.com', plan: 'pro', status: 'active', joinDate: '2024-03-05', trades: 67, pnl: 3100 },
  { id: '5', name: 'Alex Wilson', email: 'alex@example.com', plan: 'free', status: 'active', joinDate: '2024-03-12', trades: 8, pnl: -50 }
];

const mockAnalytics = {
  totalUsers: 75234,
  activeUsers: 45678,
  totalTrades: 2500000,
  totalRevenue: 125000,
  conversionRate: 12.5,
  churnRate: 3.2,
  avgSessionTime: '24m 15s',
  supportTickets: 45
};

const mockRevenueData = [
  { month: 'Jan', revenue: 8500, users: 1200 },
  { month: 'Feb', revenue: 12000, users: 1800 },
  { month: 'Mar', revenue: 15500, users: 2400 },
  { month: 'Apr', revenue: 18200, users: 2900 },
  { month: 'May', revenue: 22000, users: 3500 },
  { month: 'Jun', revenue: 25800, users: 4200 }
];

const mockUserGrowth = [
  { date: '2024-01', free: 1200, pro: 300, premium: 50 },
  { date: '2024-02', free: 1800, pro: 450, premium: 80 },
  { date: '2024-03', free: 2400, pro: 600, premium: 120 },
  { date: '2024-04', free: 2900, pro: 750, premium: 150 },
  { date: '2024-05', free: 3500, pro: 900, premium: 200 },
  { date: '2024-06', free: 4200, pro: 1100, premium: 250 }
];

const mockPlanDistribution = [
  { name: 'Free', value: 65, color: '#94a3b8' },
  { name: 'Pro', value: 25, color: '#3b82f6' },
  { name: 'Premium', value: 10, color: '#8b5cf6' }
];

// Password Authentication Component
const AdminPasswordAuth: React.FC<{ onAuthenticated: () => void }> = ({ onAuthenticated }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate authentication delay
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        // Store authentication in sessionStorage (will be cleared when browser closes)
        sessionStorage.setItem('adminAuthenticated', 'true');
        sessionStorage.setItem('adminAuthTime', Date.now().toString());
        onAuthenticated();
        toast.success('🎉 Admin access granted!');
      } else {
        setError('Incorrect password. Please try again.');
        toast.error('❌ Invalid admin password');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-full mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Access</h1>
          <p className="text-gray-600">Enter the admin password to continue</p>
        </div>

        {/* Firebase Configuration Warning */}
        {isDemoMode && (
          <div className="bg-orange-500/20 border border-orange-400/30 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <WifiOff className="h-5 w-5 text-orange-300" />
              <span className="text-orange-200 font-medium">Demo Mode</span>
            </div>
            <p className="text-orange-100 text-sm mt-1">
              Firebase is not configured. Admin panel is running in demo mode with mock data.
            </p>
            <div className="mt-2 text-xs text-orange-200">
              <p>1. Go to Firebase Console → Project Settings</p>
              <p>2. Copy your config values to .env file</p>
              <p>3. Restart the development server</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 pr-12"
                placeholder="Enter admin password"
                required
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {error && (
              <p className="text-red-600 text-sm mt-2 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1" />
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !password}
            className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-3 px-4 rounded-lg hover:from-red-700 hover:to-pink-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Authenticating...
              </>
            ) : (
              <>
                <Lock className="h-5 w-5 mr-2" />
                Access Admin Panel
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-orange-800">
                  {isDemoMode ? 'Demo Mode Active' : 'Admin Panel'}
                </h3>
                <p className="text-sm text-orange-700 mt-1">
                  {isDemoMode 
                    ? 'This is a demo admin panel with mock data. Configure Firebase for full functionality.'
                    : 'This is a demo admin panel. In production, use proper authentication with role-based access control.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Admin: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      const adminAuth = sessionStorage.getItem('adminAuthenticated');
      const authTime = sessionStorage.getItem('adminAuthTime');
      
      if (adminAuth === 'true' && authTime) {
        // Check if authentication is still valid (24 hours)
        const authTimestamp = parseInt(authTime);
        const now = Date.now();
        const twentyFourHours = 24 * 60 * 60 * 1000;
        
        if (now - authTimestamp < twentyFourHours) {
          setIsAuthenticated(true);
        } else {
          // Authentication expired
          sessionStorage.removeItem('adminAuthenticated');
          sessionStorage.removeItem('adminAuthTime');
          setIsAuthenticated(false);
        }
      }
    };

    checkAuth();
  }, []);

  // Check if user is signed in
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'revenue', label: 'Revenue', icon: DollarSign },
    { id: 'system', label: 'System', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = !filterPlan || user.plan === filterPlan;
    const matchesStatus = !filterStatus || user.status === filterStatus;
    
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Data refreshed successfully!');
    }, 1000);
  };

  const exportData = (type: string) => {
    // In real app, this would export actual data
    const data = type === 'users' ? mockUsers : mockAnalytics;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} data exported successfully!`);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuthenticated');
    sessionStorage.removeItem('adminAuthTime');
    setIsAuthenticated(false);
    toast.success('Logged out from admin panel');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">Please sign in to access the admin panel.</p>
        </div>
      </div>
    );
  }

  // Show password authentication if not authenticated
  if (!isAuthenticated) {
    return <AdminPasswordAuth onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Zap className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold text-gray-900">ZellaX Admin</span>
              </div>
              <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                Admin Panel
              </div>
              {isDemoMode && (
                <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                  Demo Mode
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={refreshData}
                disabled={isLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Lock className="h-4 w-4" />
                <span>Logout</span>
              </button>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user.displayName?.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">{user.displayName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Firebase Connection Warning */}
        {isDemoMode && (
          <div className="mb-8 bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <WifiOff className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-orange-800">Firebase Not Configured</h3>
                <p className="text-sm text-orange-700 mt-1">
                  The admin panel is running in demo mode with mock data. To enable full functionality:
                </p>
                <ol className="text-xs text-orange-600 mt-2 list-decimal list-inside space-y-1">
                  <li>Go to Firebase Console → Project Settings</li>
                  <li>Copy your config values to .env file</li>
                  <li>Restart the development server</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900">{mockAnalytics.totalUsers.toLocaleString()}</p>
                    <p className="text-sm text-green-600 mt-1">+12.5% from last month</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Users</p>
                    <p className="text-3xl font-bold text-gray-900">{mockAnalytics.activeUsers.toLocaleString()}</p>
                    <p className="text-sm text-green-600 mt-1">+8.2% from last month</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Activity className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Trades</p>
                    <p className="text-3xl font-bold text-gray-900">{(mockAnalytics.totalTrades / 1000000).toFixed(1)}M</p>
                    <p className="text-sm text-green-600 mt-1">+15.3% from last month</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                    <p className="text-3xl font-bold text-gray-900">${mockAnalytics.totalRevenue.toLocaleString()}</p>
                    <p className="text-sm text-green-600 mt-1">+22.1% from last month</p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <DollarSign className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Revenue Chart */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Growth</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={mockRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                    <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Plan Distribution */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mockPlanDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {mockPlanDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3">
                  {isDemoMode ? (
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">Database</p>
                    <p className="text-sm text-gray-600">
                      {isDemoMode ? 'Demo Mode' : 'Operational'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-gray-900">API Services</p>
                    <p className="text-sm text-gray-600">Operational</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="font-medium text-gray-900">Email Service</p>
                    <p className="text-sm text-gray-600">Degraded Performance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={filterPlan}
                  onChange={(e) => setFilterPlan(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Plans</option>
                  <option value="free">Free</option>
                  <option value="pro">Pro</option>
                  <option value="premium">Premium</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <button
                  onClick={() => exportData('users')}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trades</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P&L</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold">{user.name.charAt(0)}</span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.plan === 'premium' ? 'bg-purple-100 text-purple-800' :
                            user.plan === 'pro' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.trades}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm font-medium ${user.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ${user.pnl.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.joinDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Other tabs content would go here... */}
        {activeTab !== 'dashboard' && activeTab !== 'users' && (
          <div className="bg-white rounded-lg p-12 shadow-sm border border-gray-200 text-center">
            <div className="text-gray-400 mb-4">
              <Settings className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {tabs.find(tab => tab.id === activeTab)?.label} Panel
            </h3>
            <p className="text-gray-600 mb-6">
              {isDemoMode 
                ? 'This section is available in demo mode with mock data.'
                : 'This section would contain real data when Firebase is properly configured.'
              }
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium">
              {isDemoMode ? '🔧 Demo Mode Active' : '⚡ Coming Soon'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;