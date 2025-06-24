import React, { Fragment, useState, useEffect } from 'react';
import { Popover, Transition, Menu } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Zap, Settings, User, BarChart3, TrendingUp, Shield, Users, DollarSign, HelpCircle, Mail, Info, Crown } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import ThemeToggle from '../ui/ThemeToggle';

const featuresMenu = [
  {
    name: 'Analytics',
    description: 'Advanced trading analytics and insights',
    href: '/features',
    icon: BarChart3,
    onClick: () => {
      // Scroll to analytics section on features page
      setTimeout(() => {
        const element = document.getElementById('analytics');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  },
  {
    name: 'Trade Tracking',
    description: 'Comprehensive trade journaling',
    href: '/features',
    icon: TrendingUp,
    onClick: () => {
      // Scroll to tracking section on features page
      setTimeout(() => {
        const element = document.getElementById('tracking');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  },
  {
    name: 'Security',
    description: 'Bank-level data protection',
    href: '/features',
    icon: Shield,
    onClick: () => {
      // Scroll to security section on features page
      setTimeout(() => {
        const element = document.getElementById('security');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  },
  {
    name: 'Community',
    description: 'Connect with other traders',
    href: '/features',
    icon: Users,
    onClick: () => {
      // Scroll to community section on features page
      setTimeout(() => {
        const element = document.getElementById('community');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }
];

const resourcesMenu = [
  {
    name: 'Help Center',
    description: 'Get help and support',
    href: '/help',
    icon: HelpCircle
  },
  {
    name: 'Contact Support',
    description: 'Reach out to our team',
    href: '/contact',
    icon: Mail
  },
  {
    name: 'About Us',
    description: 'Learn about our mission',
    href: '/about',
    icon: Info
  }
];

interface HeaderProps {
  toggleTheme: () => void;
}

export default function Header({ toggleTheme }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Track scroll position for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleFeatureClick = (item: typeof featuresMenu[0]) => {
    navigate(item.href);
    if (item.onClick) {
      item.onClick();
    }
  };

  // CRITICAL: Check if user is admin - ONLY for specific emails
  const adminEmails = ['thealiraza22@gmail.com', 'ramdanmubarak10@gmail.com'];
  const isAdmin = user && adminEmails.includes(user.email);

  return (
    <header className={`sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-all duration-300 ${
      isScrolled ? 'shadow-md' : ''
    }`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <Zap className="h-7 w-7 text-blue-600 dark:text-blue-400 transition-all duration-300 group-hover:scale-110" />
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white transition-colors">ZellaX</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* Features Dropdown */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                Features
                <ChevronDownIcon className="ml-1 h-4 w-4 transition-transform ui-open:rotate-180" />
              </Menu.Button>
              
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute left-0 z-50 mt-2 w-80 origin-top-left rounded-md bg-white dark:bg-gray-800 py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-200 dark:border-gray-700">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Features</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Powerful tools for traders</p>
                  </div>
                  
                  {featuresMenu.map((item) => (
                    <Menu.Item key={item.name}>
                      {({ active }) => (
                        <button
                          onClick={() => handleFeatureClick(item)}
                          className={`${
                            active ? 'bg-gray-100 dark:bg-gray-700' : ''
                          } flex items-start px-4 py-3 text-sm transition-colors w-full text-left hover:bg-gray-50 dark:hover:bg-gray-700`}
                        >
                          <div className="flex-shrink-0">
                            <item.icon className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                          </div>
                          <div className="ml-3">
                            <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
                          </div>
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/features"
                          className={`${
                            active ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                          } block px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors`}
                        >
                          View all features →
                        </Link>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

            {/* Pricing Link */}
            <Link
              to="/pricing"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Pricing
            </Link>

            {/* Resources Dropdown */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                Resources
                <ChevronDownIcon className="ml-1 h-4 w-4 transition-transform ui-open:rotate-180" />
              </Menu.Button>
              
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute left-0 z-50 mt-2 w-72 origin-top-left rounded-md bg-white dark:bg-gray-800 py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-200 dark:border-gray-700">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Resources</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Help and support</p>
                  </div>
                  
                  {resourcesMenu.map((item) => (
                    <Menu.Item key={item.name}>
                      {({ active }) => (
                        <Link
                          to={item.href}
                          className={`${
                            active ? 'bg-gray-100 dark:bg-gray-700' : ''
                          } flex items-start px-4 py-3 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-700`}
                        >
                          <div className="flex-shrink-0">
                            <item.icon className="h-5 w-5 text-gray-600 dark:text-gray-400 mt-0.5" />
                          </div>
                          <div className="ml-3">
                            <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
                          </div>
                        </Link>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Transition>
            </Menu>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle toggleTheme={toggleTheme} className="scale-75" />

            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/playbooks"
                  className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Playbooks
                </Link>
                
                {/* Admin Link - ONLY show for authorized admin emails */}
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="hidden md:flex items-center space-x-1 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30"
                  >
                    <Crown className="h-4 w-4" />
                    <span>Admin</span>
                  </Link>
                )}
                
                {/* User Menu */}
                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-sm font-semibold">
                        {user.displayName?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <ChevronDownIcon className="h-4 w-4 transition-transform ui-open:rotate-180 hidden md:block" />
                  </Menu.Button>
                  
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-200 dark:border-gray-700">
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{user.displayName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                        <div className="mt-1 flex items-center space-x-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 capitalize">
                            {user.plan} Plan
                          </span>
                          {isAdmin && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                              Admin Access
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/settings"
                            className={`${
                              active ? 'bg-gray-100 dark:bg-gray-700' : ''
                            } flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors`}
                          >
                            <Settings className="h-4 w-4 mr-3" />
                            Account Settings
                          </Link>
                        )}
                      </Menu.Item>
                      
                      {/* Admin Panel Link - ONLY for authorized admin emails */}
                      {isAdmin && (
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/admin"
                              className={`${
                                active ? 'bg-red-50 dark:bg-red-900/20' : ''
                              } flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors`}
                            >
                              <Crown className="h-4 w-4 mr-3" />
                              Admin Panel
                            </Link>
                          )}
                        </Menu.Item>
                      )}
                      
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/help"
                            className={`${
                              active ? 'bg-gray-100 dark:bg-gray-700' : ''
                            } flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors`}
                          >
                            <HelpCircle className="h-4 w-4 mr-3" />
                            Help & Support
                          </Link>
                        )}
                      </Menu.Item>
                      
                      <div className="border-t border-gray-200 dark:border-gray-700">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={`${
                                active ? 'bg-red-50 dark:bg-red-900/20' : ''
                              } flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors`}
                            >
                              <User className="h-4 w-4 mr-3" />
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <Popover className="md:hidden">
            <Popover.Button className="inline-flex items-center justify-center rounded-md bg-white dark:bg-gray-800 p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors">
              <span className="sr-only">Open menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </Popover.Button>

            <Transition
              as={Fragment}
              enter="duration-200 ease-out"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="duration-100 ease-in"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Popover.Panel 
                focus 
                className="fixed inset-0 z-50 bg-white dark:bg-gray-900 overflow-y-auto"
              >
                {({ close }) => (
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-2">
                        <Zap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">ZellaX</span>
                      </div>
                      <button
                        onClick={() => close()}
                        className="bg-white dark:bg-gray-800 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
                      >
                        <span className="sr-only">Close menu</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto py-6 px-4">
                      <nav className="grid gap-y-8">
                        {/* Main Navigation Links */}
                        <div className="grid grid-cols-1 gap-y-4">
                          <Link
                            to="/"
                            className="flex items-center p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            onClick={() => close()}
                          >
                            <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
                            <span className="text-base font-medium text-gray-900 dark:text-white">Home</span>
                          </Link>
                          
                          <Link
                            to="/dashboard"
                            className="flex items-center p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            onClick={() => close()}
                          >
                            <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
                            <span className="text-base font-medium text-gray-900 dark:text-white">Dashboard</span>
                          </Link>
                          
                          <Link
                            to="/playbooks"
                            className="flex items-center p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            onClick={() => close()}
                          >
                            <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
                            <span className="text-base font-medium text-gray-900 dark:text-white">Playbooks</span>
                          </Link>
                          
                          <Link
                            to="/pricing"
                            className="flex items-center p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            onClick={() => close()}
                          >
                            <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
                            <span className="text-base font-medium text-gray-900 dark:text-white">Pricing</span>
                          </Link>
                          
                          <Link
                            to="/settings"
                            className="flex items-center p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            onClick={() => close()}
                          >
                            <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
                            <span className="text-base font-medium text-gray-900 dark:text-white">Settings</span>
                          </Link>
                          
                          <Link
                            to="/help"
                            className="flex items-center p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            onClick={() => close()}
                          >
                            <HelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
                            <span className="text-base font-medium text-gray-900 dark:text-white">Help</span>
                          </Link>
                          
                          {/* Admin Panel Link - Mobile - ONLY for authorized admin emails */}
                          {isAdmin && (
                            <Link
                              to="/adminPanal"
                              onClick={() => close()}
                              className="flex items-center p-3 rounded-md bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                            >
                              <Crown className="h-5 w-5 text-red-600 dark:text-red-400 mr-3" />
                              <span className="text-base font-medium">Admin Panel</span>
                            </Link>
                          )}
                        </div>
                      </nav>
                    </div>
                    
                    <div className="border-t border-gray-200 dark:border-gray-700 p-4 mt-auto">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-base font-medium text-gray-900 dark:text-white">Dark Mode</span>
                        <ThemeToggle toggleTheme={toggleTheme} className="scale-75" />
                      </div>
                      
                      {user ? (
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold">
                                {user.displayName?.charAt(0).toUpperCase() || 'U'}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{user.displayName}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 capitalize">
                                  {user.plan} Plan
                                </span>
                                {isAdmin && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                                    Admin
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => {
                              handleLogout();
                              close();
                            }}
                            className="w-full flex items-center justify-center px-4 py-3 border border-red-300 dark:border-red-600 rounded-md shadow-sm text-base font-medium text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                          >
                            Sign out
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Link
                            to="/signup"
                            onClick={() => close()}
                            className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                          >
                            Get Started
                          </Link>
                          <Link
                            to="/login"
                            onClick={() => close()}
                            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            Sign in
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Popover.Panel>
            </Transition>
          </Popover>
        </div>
      </div>
      
      {/* Mobile Bottom Navigation */}
      {user && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 md:hidden z-40">
          <div className="grid grid-cols-4 h-16">
            <Link 
              to="/dashboard" 
              className={`flex flex-col items-center justify-center ${
                location.pathname === '/dashboard' 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <BarChart3 className="h-6 w-6" />
              <span className="text-xs mt-1">Dashboard</span>
            </Link>
            
            <Link 
              to="/playbooks" 
              className={`flex flex-col items-center justify-center ${
                location.pathname === '/playbooks' 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <TrendingUp className="h-6 w-6" />
              <span className="text-xs mt-1">Playbooks</span>
            </Link>
            
            <Link 
              to="/settings" 
              className={`flex flex-col items-center justify-center ${
                location.pathname === '/settings' 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <Settings className="h-6 w-6" />
              <span className="text-xs mt-1">Settings</span>
            </Link>
            
            {isAdmin ? (
              <Link 
                to="/adminPanal" 
                className={`flex flex-col items-center justify-center ${
                  location.pathname === '/adminPanal' 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <Crown className="h-6 w-6" />
                <span className="text-xs mt-1">Admin</span>
              </Link>
            ) : (
              <Link 
                to="/help" 
                className={`flex flex-col items-center justify-center ${
                  location.pathname === '/help' 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <HelpCircle className="h-6 w-6" />
                <span className="text-xs mt-1">Help</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}