import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Clock, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';

const SubscriptionBanner: React.FC = () => {
  const { subscription, loading } = useSubscription();
  
  if (loading || !subscription) return null;
  
  // Don't show banner if user has an active subscription and no trial warning
  if (subscription.isActive && !subscription.trialWarning && subscription.plan === 'pro') {
    return null;
  }
  
  // Show trial expiry warning
  if (subscription.trialActive && subscription.trialWarning) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                <span className="font-medium">Trial ending soon!</span> Your Pro trial will expire in {subscription.trialDaysLeft} day{subscription.trialDaysLeft !== 1 ? 's' : ''}.
              </p>
            </div>
            <Link
              to="/pricing"
              className="mt-2 sm:mt-0 flex items-center text-sm font-medium text-yellow-800 dark:text-yellow-300 hover:text-yellow-600 dark:hover:text-yellow-200 transition-colors"
            >
              Upgrade Now
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Show trial expired message
  if (!subscription.isActive && subscription.plan === 'free' && subscription.trialEndDate) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap">
            <div className="flex items-center">
              <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
              <p className="text-sm text-red-800 dark:text-red-300">
                <span className="font-medium">Trial expired.</span> Your Pro trial has ended. Upgrade to continue using premium features.
              </p>
            </div>
            <Link
              to="/pricing"
              className="mt-2 sm:mt-0 flex items-center text-sm font-medium text-red-800 dark:text-red-300 hover:text-red-600 dark:hover:text-red-200 transition-colors"
            >
              Upgrade Now
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Show pending payment status
  if (subscription.paymentStatus === 'pending') {
    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <span className="font-medium">Payment pending.</span> Your Pro plan payment is being reviewed. We'll update you within 24 hours.
              </p>
            </div>
            <Link
              to="/settings"
              className="mt-2 sm:mt-0 flex items-center text-sm font-medium text-blue-800 dark:text-blue-300 hover:text-blue-600 dark:hover:text-blue-200 transition-colors"
            >
              View Status
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Show rejected payment status
  if (subscription.paymentStatus === 'rejected') {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap">
            <div className="flex items-center">
              <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
              <p className="text-sm text-red-800 dark:text-red-300">
                <span className="font-medium">Payment rejected.</span> Your Pro plan payment was not approved. Please check your settings for details.
              </p>
            </div>
            <Link
              to="/settings"
              className="mt-2 sm:mt-0 flex items-center text-sm font-medium text-red-800 dark:text-red-300 hover:text-red-600 dark:hover:text-red-200 transition-colors"
            >
              View Details
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Default banner for free users
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-white mr-2" />
            <p className="text-sm text-white">
              <span className="font-medium">Upgrade to Pro</span> for unlimited trades, advanced analytics, and more!
            </p>
          </div>
          <Link
            to="/pricing"
            className="mt-2 sm:mt-0 flex items-center text-sm font-medium text-white hover:text-blue-100 transition-colors"
          >
            View Plans
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionBanner;