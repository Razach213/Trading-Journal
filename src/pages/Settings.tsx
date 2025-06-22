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
  CheckCircle,
  Camera,
  Upload,
  Settings as SettingsIcon,
  Key,
  Smartphone,
  Globe,
  FileText,
  HelpCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ProfileFormData {
  displayName: string;
  email: string;
  bio?: string;
  location?: string;
  website?: string;
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
  weeklyReports: boolean;
  securityAlerts: boolean;
}

interface PrivacySettings {
  publicTrades: boolean;
  showPerformance: boolean;
  allowMessages: boolean;
  profileVisibility: 'public' | 'private' | 'friends';
}

const Settings: React.FC = () => {
  const { user, isDemoMode } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    tradeReminders: false,
    performanceUpdates: true,
    marketNews: false,
    weeklyReports: true,
    securityAlerts: true
  });

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    publicTrades: false,
    showPerformance: true,
    allowMessages: true,
    profileVisibility: 'public'
  });

  const { register: registerProfile, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors } } = useForm<ProfileFormData>({
    defaultValues: {
      displayName: user?.displayName || '',
      email: user?.email || '',
      bio: '',
      location: '',
      website: ''
    }
  });

  const { register: registerPassword, handleSubmit: handlePasswordSubmit, watch, reset, formState: { errors: passwordErrors } } = useForm<PasswordFormData>();
  const newPassword = watch('newPassword');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User, description: 'Personal information and avatar' },
    { id: 'security', label: 'Security', icon: Shield, description: 'Password and authentication' },
    { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Email and push preferences' },
    { id: 'billing', label: 'Billing', icon: CreditCard, description: 'Subscription and payments' },
    { id: 'data', label: 'Data & Privacy', icon: Download, description: 'Export data and privacy settings' }
  ];

  const onProfileSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (isDemoMode) {
        toast.success('Profile updated successfully! (Demo Mode)');
      } else {
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (isDemoMode) {
        toast.success('Password updated successfully! (Demo Mode)');
      } else {
        toast.success('Password updated successfully!');
      }
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

  const handlePrivacyChange = (key: keyof PrivacySettings, value: any) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: value
    }));
    toast.success('Privacy settings updated');
  };

  const exportData = () => {
    if (isDemoMode) {
      toast.success('Data export started! (Demo Mode - Check your downloads folder)');
    } else {
      toast.success('Data export started. You will receive an email when ready.');
    }
  };

  const deleteAccount = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      if (isDemoMode) {
        toast.success('Account deletion request submitted (Demo Mode)');
      } else {
        toast.success('Account deletion request submitted');
      }
      setShowDeleteConfirm(false);
    } catch (error) {
      toast.error('Failed to delete account');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoUpload = () => {
    toast.info('Photo upload feature coming soon!');
  };

  const enable2FA = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    toast.success(twoFactorEnabled ? '2FA disabled' : '2FA enabled');
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
    
    return {
      strength: (strength / 5) * 100,
      label: labels[strength - 1] || 'Very Weak',
      color: colors[strength - 1] || 'bg-red-500'
    };
  };

  const passwordStrength = getPasswordStrength(newPassword || '');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Demo Mode Warning */}
        {isDemoMode && (
          <div className="mb-6 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-orange-800 dark:text-orange-200">Demo Mode Active</h3>
                <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                  Settings changes are simulated and won't be saved permanently. Configure Firebase to enable full functionality.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <SettingsIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
            {isDemoMode && (
              <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 px-2 py-1 rounded-full text-xs font-medium">
                Demo Mode
              </span>
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-400">Manage your account preferences and settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Enhanced Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-start px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-102'
                  }`}
                >
                  <tab.icon className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <div className="font-medium">{tab.label}</div>
                    <div className={`text-xs mt-0.5 ${
                      activeTab === tab.id ? 'text-blue-100' : 'text-gray-500 dark:text-gray-500'
                    }`}>
                      {tab.description}
                    </div>
                  </div>
                </button>
              ))}
            </nav>

            {/* Quick Stats */}
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Account Status</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Plan</span>
                  <span className="font-medium text-gray-900 dark:text-white capitalize">{user?.plan || 'Free'}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">2FA</span>
                  <span className={`font-medium ${twoFactorEnabled ? 'text-green-600' : 'text-red-600'}`}>
                    {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Status</span>
                  <span className="font-medium text-green-600">Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Information</h2>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">Update your personal details and profile picture</p>
                    </div>
                  </div>
                  
                  <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-8">
                    {/* Avatar Section */}
                    <div className="flex items-center space-x-6 p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <div className="relative">
                        <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white text-3xl font-bold">
                            {user?.displayName?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handlePhotoUpload}
                          className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-lg"
                        >
                          <Camera className="h-4 w-4" />
                        </button>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Profile Picture</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          JPG, PNG or GIF. Max size 5MB. Recommended 400x400px.
                        </p>
                        <div className="flex space-x-3">
                          <button
                            type="button"
                            onClick={handlePhotoUpload}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload New
                          </button>
                          <button
                            type="button"
                            className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Display Name *
                        </label>
                        <input
                          {...registerProfile('displayName', { required: 'Display name is required' })}
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Enter your display name"
                        />
                        {profileErrors.displayName && (
                          <p className="text-red-600 dark:text-red-400 text-sm mt-1">{profileErrors.displayName.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email Address *
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
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Enter your email"
                        />
                        {profileErrors.email && (
                          <p className="text-red-600 dark:text-red-400 text-sm mt-1">{profileErrors.email.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Location
                        </label>
                        <input
                          {...registerProfile('location')}
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="City, Country"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Website
                        </label>
                        <input
                          {...registerProfile('website')}
                          type="url"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="https://yourwebsite.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Bio
                      </label>
                      <textarea
                        {...registerProfile('bio')}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Tell us about yourself and your trading experience..."
                      />
                    </div>

                    {/* Current Plan */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Current Plan</h3>
                          <p className="text-gray-600 dark:text-gray-400 capitalize">{user?.plan || 'Free'} Plan</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {user?.plan === 'free' ? 'Up to 50 trades per month' : 'Unlimited trades and advanced features'}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
                        >
                          {user?.plan === 'free' ? 'Upgrade Plan' : 'Manage Plan'}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 flex items-center font-medium"
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
                <div className="p-8">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Security Settings</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your password and security preferences</p>
                  </div>
                  
                  {/* Password Change Form */}
                  <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-6 mb-8">
                    <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                        <Key className="h-5 w-5 mr-2" />
                        Change Password
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Current Password
                          </label>
                          <div className="relative">
                            <input
                              {...registerPassword('currentPassword', { required: 'Current password is required' })}
                              type={showCurrentPassword ? 'text' : 'password'}
                              className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              placeholder="Enter current password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                              {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
                                minLength: { value: 8, message: 'Password must be at least 8 characters' }
                              })}
                              type={showNewPassword ? 'text' : 'password'}
                              className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              placeholder="Enter new password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                              {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                          {passwordErrors.newPassword && (
                            <p className="text-red-600 dark:text-red-400 text-sm mt-1">{passwordErrors.newPassword.message}</p>
                          )}
                          
                          {/* Password Strength Indicator */}
                          {newPassword && (
                            <div className="mt-2">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-gray-600 dark:text-gray-400">Password Strength</span>
                                <span className={`font-medium ${
                                  passwordStrength.strength >= 80 ? 'text-green-600' :
                                  passwordStrength.strength >= 60 ? 'text-blue-600' :
                                  passwordStrength.strength >= 40 ? 'text-yellow-600' : 'text-red-600'
                                }`}>
                                  {passwordStrength.label}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                                  style={{ width: `${passwordStrength.strength}%` }}
                                ></div>
                              </div>
                            </div>
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
                              className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              placeholder="Confirm new password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                          {passwordErrors.confirmPassword && (
                            <p className="text-red-600 dark:text-red-400 text-sm mt-1">{passwordErrors.confirmPassword.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-end mt-6">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center font-medium"
                        >
                          {isLoading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          ) : (
                            <Lock className="h-4 w-4 mr-2" />
                          )}
                          Update Password
                        </button>
                      </div>
                    </div>
                  </form>

                  {/* Two-Factor Authentication */}
                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                      <Smartphone className="h-5 w-5 mr-2" />
                      Two-Factor Authentication
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">Authenticator App</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {twoFactorEnabled ? 'Two-factor authentication is enabled' : 'Add an extra layer of security to your account'}
                          </p>
                        </div>
                        <button
                          onClick={enable2FA}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            twoFactorEnabled 
                              ? 'bg-red-600 text-white hover:bg-red-700' 
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          {twoFactorEnabled ? 'Disable' : 'Enable'}
                        </button>
                      </div>

                      {/* Security Best Practices */}
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">Security Best Practices</h4>
                        <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                          <li>• Use a strong, unique password</li>
                          <li>• Enable two-factor authentication</li>
                          <li>• Regularly review your account activity</li>
                          <li>• Don't share your login credentials</li>
                          <li>• Log out from shared devices</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="p-8">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notification Preferences</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Choose what notifications you want to receive</p>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Email Notifications */}
                    <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                        <Mail className="h-5 w-5 mr-2" />
                        Email Notifications
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">General Email Notifications</h4>
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
                            <h4 className="font-medium text-gray-900 dark:text-white">Trade Reminders</h4>
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
                            <h4 className="font-medium text-gray-900 dark:text-white">Performance Updates</h4>
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
                            <h4 className="font-medium text-gray-900 dark:text-white">Market News</h4>
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

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">Weekly Reports</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Comprehensive weekly trading reports</p>
                          </div>
                          <button
                            onClick={() => handleNotificationChange('weeklyReports')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              notifications.weeklyReports ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                notifications.weeklyReports ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">Security Alerts</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Important security notifications</p>
                          </div>
                          <button
                            onClick={() => handleNotificationChange('securityAlerts')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              notifications.securityAlerts ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                notifications.securityAlerts ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Billing Tab */}
              {activeTab === 'billing' && (
                <div className="p-8">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Billing & Subscription</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your subscription and payment methods</p>
                  </div>
                  
                  <div className="space-y-8">
                    {/* Current Plan */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Current Plan</h3>
                          <p className="text-gray-600 dark:text-gray-400 capitalize text-lg">{user?.plan || 'Free'} Plan</p>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-gray-900 dark:text-white">
                            {user?.plan === 'free' ? '$0' : user?.plan === 'pro' ? '$19' : '$49'}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">/month</p>
                        </div>
                      </div>
                      
                      {user?.plan !== 'free' && (
                        <div className="border-t border-blue-200 dark:border-blue-700 pt-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Next billing date:</span>
                              <div className="font-medium text-gray-900 dark:text-white">January 15, 2025</div>
                            </div>
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Billing cycle:</span>
                              <div className="font-medium text-gray-900 dark:text-white">Monthly</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Plan Features */}
                    <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Plan Features</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {user?.plan === 'free' ? (
                          <>
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">Up to 50 trades per month</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">Basic analytics</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">Email support</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">Unlimited trades</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">Advanced analytics</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">Priority support</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">Export features</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium">
                        {user?.plan === 'free' ? 'Upgrade Plan' : 'Change Plan'}
                      </button>
                      {user?.plan !== 'free' && (
                        <button className="border border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 px-6 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium">
                          Cancel Subscription
                        </button>
                      )}
                    </div>

                    {/* Payment Method */}
                    {user?.plan !== 'free' && (
                      <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Payment Method</h3>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <CreditCard className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">•••• •••• •••• 4242</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Expires 12/26 • Visa</p>
                              </div>
                            </div>
                            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                              Update
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Billing History */}
                    {user?.plan !== 'free' && (
                      <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Billing History</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between py-2">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">December 15, 2024</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Pro Plan - Monthly</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900 dark:text-white">$19.00</p>
                              <p className="text-sm text-green-600">Paid</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">November 15, 2024</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Pro Plan - Monthly</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900 dark:text-white">$19.00</p>
                              <p className="text-sm text-green-600">Paid</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Data & Privacy Tab */}
              {activeTab === 'data' && (
                <div className="p-8">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Data & Privacy</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your data and privacy preferences</p>
                  </div>
                  
                  <div className="space-y-8">
                    {/* Data Export */}
                    <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                        <Download className="h-5 w-5 mr-2" />
                        Export Your Data
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Download a copy of all your trading data, including trades, notes, and performance metrics.
                      </p>
                      <button
                        onClick={exportData}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center font-medium"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                      </button>
                    </div>

                    {/* Privacy Settings */}
                    <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                        <Globe className="h-5 w-5 mr-2" />
                        Privacy Settings
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">Make trades public by default</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">New trades will be visible to the community</p>
                          </div>
                          <button
                            onClick={() => handlePrivacyChange('publicTrades', !privacy.publicTrades)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              privacy.publicTrades ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                privacy.publicTrades ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">Show performance metrics</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Display your trading performance publicly</p>
                          </div>
                          <button
                            onClick={() => handlePrivacyChange('showPerformance', !privacy.showPerformance)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              privacy.showPerformance ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                privacy.showPerformance ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">Allow messages from other traders</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Let other users send you messages</p>
                          </div>
                          <button
                            onClick={() => handlePrivacyChange('allowMessages', !privacy.allowMessages)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              privacy.allowMessages ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                privacy.allowMessages ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Profile Visibility
                          </label>
                          <select
                            value={privacy.profileVisibility}
                            onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          >
                            <option value="public">Public - Anyone can view</option>
                            <option value="friends">Friends only</option>
                            <option value="private">Private - Only you</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
                      <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-4 flex items-center">
                        <AlertTriangle className="h-5 w-5 mr-2" />
                        Danger Zone
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-red-900 dark:text-red-200">Delete Account</h4>
                          <p className="text-sm text-red-700 dark:text-red-300 mt-1 mb-4">
                            Permanently delete your account and all associated data. This action cannot be undone.
                          </p>
                          <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center font-medium"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Account
                          </button>
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