import React, { Fragment, useState } from 'react';
import { Popover, Transition, Menu } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import ThemeToggle from '../ui/ThemeToggle';

const navigation = [
  { name: 'Features', href: '/features' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

interface HeaderProps {
  toggleTheme: () => void;
}

export default function Header({ toggleTheme }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Popover className="relative bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between py-4 md:py-6 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400 transition-all duration-300 group-hover:scale-110" />
                <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2 h-2 sm:w-3 sm:h-3 bg-orange-500 rounded-full animate-pulse"></div>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white transition-colors">ZellaX</span>
            </Link>
          </div>
          
          <div className="-my-2 -mr-2 md:hidden">
            <Popover.Button className="inline-flex items-center justify-center rounded-md bg-white dark:bg-gray-800 p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-colors">
              <span className="sr-only">Open menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </Popover.Button>
          </div>
          
          <Popover.Group as="nav" className="hidden space-x-6 lg:space-x-10 md:flex">
            {/* Company Dropdown */}
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="inline-flex items-center text-sm lg:text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-200 hover:scale-105 group">
                  Company
                  <ChevronDownIcon className="ml-1 h-4 w-4 transition-transform group-hover:rotate-180" aria-hidden="true" />
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute left-0 z-10 mt-2 w-56 origin-top-left rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-200 dark:border-gray-700">
                  <div className="py-1">
                    {navigation.map((item) => (
                      <Menu.Item key={item.name}>
                        {({ active }) => (
                          <Link
                            to={item.href}
                            className={`${
                              active ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                            } group flex items-center px-4 py-2 text-sm transition-colors`}
                          >
                            {item.name}
                          </Link>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </Popover.Group>
          
          <div className="hidden items-center justify-end md:flex md:flex-1 lg:w-0 space-x-2 lg:space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle toggleTheme={toggleTheme} className="scale-75 lg:scale-100" />

            {user ? (
              <div className="flex items-center space-x-2 lg:space-x-4">
                <Link
                  to="/dashboard"
                  className="text-sm lg:text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-200 hover:scale-105"
                >
                  Dashboard
                </Link>
                <Link
                  to="/playbooks"
                  className="text-sm lg:text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-200 hover:scale-105"
                >
                  Playbooks
                </Link>
                <Link
                  to="/settings"
                  className="text-sm lg:text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-200 hover:scale-105"
                >
                  Settings
                </Link>
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110">
                    <span className="text-white text-xs lg:text-sm font-semibold">
                      {user.displayName?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-sm lg:text-base font-medium text-gray-500 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 hover:scale-105"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="whitespace-nowrap text-sm lg:text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-200 hover:scale-105"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="ml-4 lg:ml-8 inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-gradient-to-r from-blue-600 to-purple-600 px-3 lg:px-4 py-2 text-sm lg:text-base font-medium text-white shadow-sm hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

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
          className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden z-20"
        >
          {({ close }) => (
            <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white dark:bg-gray-800 divide-y-2 divide-gray-50 dark:divide-gray-700 border border-gray-200 dark:border-gray-600">
              <div className="pt-5 pb-6 px-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400" />
                    <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">ZellaX</span>
                  </div>
                  <div className="-mr-2">
                    <Popover.Button className="bg-white dark:bg-gray-800 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-colors">
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </Popover.Button>
                  </div>
                </div>
                <div className="mt-6">
                  <nav className="grid gap-y-6">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => close()}
                        className="-m-3 p-3 flex items-center rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <span className="ml-3 text-base font-medium text-gray-900 dark:text-white">
                          {item.name}
                        </span>
                      </Link>
                    ))}
                  </nav>
                </div>
              </div>
              <div className="py-6 px-5 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium text-gray-900 dark:text-white">Dark Mode</span>
                  <ThemeToggle toggleTheme={toggleTheme} className="scale-75" />
                </div>
                {user ? (
                  <div className="space-y-4">
                    <Link
                      to="/dashboard"
                      onClick={() => close()}
                      className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/playbooks"
                      onClick={() => close()}
                      className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Playbooks
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => close()}
                      className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Settings
                    </Link>
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
                      Sign up
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
  );
}