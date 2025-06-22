import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useForm } from 'react-hook-form';
import { 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Shield, 
  CreditCard, 
  Download, 
  Trash2,
  Eye,
  EyeOff,
  Save,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ProfileFormData {
  displayName: string;
  email: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  tradeReminders: boolean;
  performanceUpdates: boolean;
  marketNews: boolean;
}

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    tradeReminders: false,
    performanceUpdates: true,
    marketNews: false
  });

  const { register: registerProfile, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors } } = useForm<ProfileFormData>({
    defaultValues: {
      displayName: user?.displayName || '',
      email: user?.email || ''
    }
  });

  const { register: registerPassword, handleSubmit: handlePasswordSubmit, watch, reset, formState: { errors: passwordErrors } } = useForm<PasswordFormData>();
  const newPassword = watch('newPassword');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'data', label: 'Data & Privacy', icon: Download }
  ];

  const onProfileSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Password updated successfully!');
      reset();
    } catch (error) {
      toast.error('Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    toast.success('Notification preferences updated');
  };

  const exportData = () => {
    toast.success('Data export started. You will receive an email when ready.');
  };

  const deleteAccount = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Account deletion request submitted');
      setShowDeleteConfirm(false);
    } catch (error) {
      toast.error('Failed to delete account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your account preferences and settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <tab.icon className="h-5 w-5 mr-3" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Profile Information</h2>
                  
                  <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-6">
                    <div className="flex items-center space-x-6">
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">
                          {user?.displayName?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <button
                          type="button"
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Change Photo
                        </button>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">JPG, PNG or GIF. Max size 5MB.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Display Name
                        </label>
                        <input
                          {...registerProfile('displayName', { required: 'Display name is required' })}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        {profileErrors.displayName && (
                          <p className="text-red-600 dark:text-red-400 text-sm mt-1">{profileErrors.displayName.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email Address
                        </label>
                        <input
                          {...registerProfile('email', { 
                            required: 'Email is required',
                            pattern: {
                              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                              message: 'Invalid email address'
                            }
                          })}
                          type="email"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        {profileErrors.email && (
                          <p className="text-red-600 dark:text-red-400 text-sm mt-1">{profileErrors.email.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Current Plan
                      </label>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white capitalize">{user?.plan || 'Free'} Plan</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {user?.plan === 'free' ? 'Up to 50 trades per month' : 'Unlimited trades and advanced features'}
                            </p>
                          </div>
                          <button
                            type="button"
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                          >
                            Upgrade
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
                      >
                        {isLoading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        ) : (
                          <Save className="h-4 w-4 mr-2" />
                        )}
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Security Settings</h2>
                  
                  <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          {...registerPassword('currentPassword', { required: 'Current password is required' })}
                          type={showCurrentPassword ? 'text' : 'password'}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {passwordErrors.currentPassword && (
                        <p className="text-red-600 dark:text-red-400 text-sm mt-1">{passwordErrors.currentPassword.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          {...registerPassword('newPassword', { 
                            required: 'New password is required',
                            minLength: { value: 6, message: 'Password must be at least 6 characters' }
                          })}
                          type={showNewPassword ? 'text' : 'password'}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {passwordErrors.newPassword && (
                        <p className="text-red-600 dark:text-red-400 text-sm mt-1">{passwordErrors.newPassword.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          {...registerPassword('confirmPassword', { 
                            required: 'Please confirm your password',
                            validate: (value) => value === newPassword || 'Passwords do not match'
                          })}
                          type={showConfirmPassword ? 'text' : 'password'}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {passwordErrors.confirmPassword && (
                        <p className="text-red-600 dark:text-red-400 text-sm mt-1">{passwordErrors.confirmPassword.message}</p>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
                      >
                        {isLoading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        ) : (
                          <Lock className="h-4 w-4 mr-2" />
                        )}
                        Update Password
                      </button>
                    </div>
                  </form>

                  <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Two-Factor Authentication</h3>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Authenticator App</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Not enabled</p>
                        </div>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                          Enable
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Email Notifications</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Receive important updates via email</p>
                      </div>
                      <button
                        onClick={() => handleNotificationChange('emailNotifications')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notifications.emailNotifications ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notifications.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Trade Reminders</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Get reminded to log your trades</p>
                      </div>
                      <button
                        onClick={() => handleNotificationChange('tradeReminders')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notifications.tradeReminders ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notifications.tradeReminders ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Performance Updates</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Weekly performance summaries</p>
                      </div>
                      <button
                        onClick={() => handleNotificationChange('performanceUpdates')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notifications.performanceUpdates ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notifications.performanceUpdates ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Market News</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Important market updates and news</p>
                      </div>
                      <button
                        onClick={() => handleNotificationChange('marketNews')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notifications.marketNews ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notifications.marketNews ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Billing Tab */}
              {activeTab === 'billing' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Billing & Subscription</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Current Plan</h3>
                          <p className="text-gray-600 dark:text-gray-400 capitalize">{user?.plan || 'Free'} Plan</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {user?.plan === 'free' ? '$0' : user?.plan === 'pro' ? '$19' : '$49'}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">/month</p>
                        </div>
                      </div>
                      
                      {user?.plan !== 'free' && (
                        <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Next billing date:</span>
                            <span className="text-gray-900 dark:text-white">January 15, 2025</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-4">
                      <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        {user?.plan === 'free' ? 'Upgrade Plan' : 'Change Plan'}
                      </button>
                      {user?.plan !== 'free' && (
                        <button className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          Cancel Subscription
                        </button>
                      )}
                    </div>

                    {user?.plan !== 'free' && (
                      <div className="mt-8">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Payment Method</h3>
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <CreditCard className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">•••• •••• •••• 4242</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Expires 12/26</p>
                              </div>
                            </div>
                            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                              Update
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Data & Privacy Tab */}
              {activeTab === 'data' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Data & Privacy</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Export Your Data</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Download a copy of all your trading data, including trades, notes, and performance metrics.
                      </p>
                      <button
                        onClick={exportData}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                      </button>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Privacy Settings</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Make trades public by default</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">New trades will be visible to the community</p>
                          </div>
                          <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-600">
                            <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                      <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-4">Danger Zone</h3>
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-medium text-red-900 dark:text-red-200">Delete Account</h4>
                            <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                              Permanently delete your account and all associated data. This action cannot be undone.
                            </p>
                            <button
                              onClick={() => setShowDeleteConfirm(true)}
                              className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center text-sm"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Account
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Account</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete your account? This will permanently remove all your data, 
                including trades, notes, and performance history. This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteAccount}
                  disabled={isLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;