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
  EyeOff
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import toast from 'react-hot-toast';

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
                <h3 className="text-sm font-medium text-orange-800">Demo Mode</h3>
                <p className="text-sm text-orange-700 mt-1">
                  This is a demo admin panel. In production, use proper authentication with role-based access control.
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
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-gray-900">Database</p>
                    <p className="text-sm text-gray-600">Operational</p>
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

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Key Performance Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{mockAnalytics.conversionRate}%</p>
                  </div>
                  <Target className="h-8 w-8 text-green-600" />
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Churn Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{mockAnalytics.churnRate}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-red-600" />
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Session Time</p>
                    <p className="text-2xl font-bold text-gray-900">{mockAnalytics.avgSessionTime}</p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Support Tickets</p>
                    <p className="text-2xl font-bold text-gray-900">{mockAnalytics.supportTickets}</p>
                  </div>
                  <Mail className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </div>

            {/* User Growth Chart */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth by Plan</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={mockUserGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="free" stackId="a" fill="#94a3b8" name="Free" />
                  <Bar dataKey="pro" stackId="a" fill="#3b82f6" name="Pro" />
                  <Bar dataKey="premium" stackId="a" fill="#8b5cf6" name="Premium" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Top Performing Users */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Users</h3>
              <div className="space-y-4">
                {mockUsers
                  .sort((a, b) => b.pnl - a.pnl)
                  .slice(0, 5)
                  .map((user, index) => (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.trades} trades</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">${user.pnl.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">{user.plan} plan</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Revenue Tab */}
        {activeTab === 'revenue' && (
          <div className="space-y-8">
            {/* Revenue Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Monthly Recurring Revenue</p>
                    <p className="text-3xl font-bold text-gray-900">${mockAnalytics.totalRevenue.toLocaleString()}</p>
                    <p className="text-sm text-green-600 mt-1">+22.1% from last month</p>
                  </div>
                  <DollarSign className="h-10 w-10 text-green-600" />
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Average Revenue Per User</p>
                    <p className="text-3xl font-bold text-gray-900">$28.50</p>
                    <p className="text-sm text-green-600 mt-1">+5.2% from last month</p>
                  </div>
                  <Users className="h-10 w-10 text-blue-600" />
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Customer Lifetime Value</p>
                    <p className="text-3xl font-bold text-gray-900">$342</p>
                    <p className="text-sm text-green-600 mt-1">+12.8% from last month</p>
                  </div>
                  <Award className="h-10 w-10 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Revenue Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Plan</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Free Plan</span>
                    <span className="font-medium">$0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Pro Plan ($19/month)</span>
                    <span className="font-medium">$85,500</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Premium Plan ($49/month)</span>
                    <span className="font-medium">$39,500</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between font-bold">
                      <span>Total Monthly Revenue</span>
                      <span>${mockAnalytics.totalRevenue.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Credit Card</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">PayPal</span>
                    <span className="font-medium">12%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Bank Transfer</span>
                    <span className="font-medium">3%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Trend */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={mockRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* System Tab */}
        {activeTab === 'system' && (
          <div className="space-y-8">
            {/* System Health */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Database className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="font-medium text-gray-900">Database</p>
                  <p className="text-sm text-green-600">Healthy</p>
                  <p className="text-xs text-gray-500">99.9% uptime</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Globe className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="font-medium text-gray-900">API</p>
                  <p className="text-sm text-green-600">Operational</p>
                  <p className="text-xs text-gray-500">150ms avg response</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Mail className="h-8 w-8 text-yellow-600" />
                  </div>
                  <p className="font-medium text-gray-900">Email Service</p>
                  <p className="text-sm text-yellow-600">Degraded</p>
                  <p className="text-xs text-gray-500">2min delay</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Shield className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="font-medium text-gray-900">Security</p>
                  <p className="text-sm text-green-600">Secure</p>
                  <p className="text-xs text-gray-500">No threats detected</p>
                </div>
              </div>
            </div>

            {/* Server Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Server Performance</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>CPU Usage</span>
                      <span>45%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Memory Usage</span>
                      <span>62%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '62%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Disk Usage</span>
                      <span>78%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Network I/O</span>
                      <span>23%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '23%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Database backup completed</span>
                    <span className="text-gray-500">2 hours ago</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <span>High memory usage detected</span>
                    <span className="text-gray-500">4 hours ago</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Security scan completed</span>
                    <span className="text-gray-500">6 hours ago</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>System update deployed</span>
                    <span className="text-gray-500">1 day ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-8">
            {/* Security Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Failed Login Attempts</p>
                    <p className="text-3xl font-bold text-gray-900">23</p>
                    <p className="text-sm text-red-600 mt-1">Last 24 hours</p>
                  </div>
                  <AlertTriangle className="h-10 w-10 text-red-600" />
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Sessions</p>
                    <p className="text-3xl font-bold text-gray-900">1,247</p>
                    <p className="text-sm text-green-600 mt-1">Currently online</p>
                  </div>
                  <Users className="h-10 w-10 text-green-600" />
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Security Score</p>
                    <p className="text-3xl font-bold text-gray-900">98/100</p>
                    <p className="text-sm text-green-600 mt-1">Excellent</p>
                  </div>
                  <Shield className="h-10 w-10 text-green-600" />
                </div>
              </div>
            </div>

            {/* Security Logs */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Security Events</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium text-red-900">Multiple failed login attempts</p>
                      <p className="text-sm text-red-700">IP: 192.168.1.100 - 5 attempts in 10 minutes</p>
                    </div>
                  </div>
                  <span className="text-sm text-red-600">2 hours ago</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-yellow-900">Unusual login location</p>
                      <p className="text-sm text-yellow-700">User logged in from new country: Germany</p>
                    </div>
                  </div>
                  <span className="text-sm text-yellow-600">4 hours ago</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">Security scan completed</p>
                      <p className="text-sm text-green-700">No vulnerabilities detected</p>
                    </div>
                  </div>
                  <span className="text-sm text-green-600">6 hours ago</span>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-600">Require 2FA for all admin accounts</p>
                  </div>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">Enabled</button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Session Timeout</p>
                    <p className="text-sm text-gray-600">Automatically log out inactive users</p>
                  </div>
                  <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                    <option>30 minutes</option>
                    <option>1 hour</option>
                    <option>2 hours</option>
                    <option>4 hours</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">IP Whitelist</p>
                    <p className="text-sm text-gray-600">Restrict admin access to specific IPs</p>
                  </div>
                  <button className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm">Configure</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;