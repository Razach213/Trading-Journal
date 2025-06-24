import React, { ReactNode } from 'react';
import { useSubscription } from '../hooks/useSubscription';
import { Link } from 'react-router-dom';
import { Lock, ArrowRight } from 'lucide-react';

interface FeatureGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  proOnly?: boolean;
}

const FeatureGuard: React.FC<FeatureGuardProps> = ({ 
  children, 
  fallback,
  proOnly = true
}) => {
  const { subscription, loading } = useSubscription();
  
  // While loading, show nothing
  if (loading) return null;
  
  // If feature is not pro-only, or user has an active subscription, show the feature
  if (!proOnly || (subscription && subscription.isActive)) {
    return <>{children}</>;
  }
  
  // If a custom fallback is provided, use it
  if (fallback) {
    return <>{fallback}</>;
  }
  
  // Default fallback UI
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
      <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
        <Lock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Pro Feature</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        This feature is available exclusively to Pro plan subscribers.
      </p>
      <Link
        to="/pricing"
        className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
      >
        Upgrade Now
        <ArrowRight className="ml-1 h-4 w-4" />
      </Link>
    </div>
  );
};

export default FeatureGuard;