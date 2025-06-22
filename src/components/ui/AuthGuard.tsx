import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Loader2, AlertTriangle } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

/**
 * AuthGuard component to protect routes that require authentication
 * Redirects to login page if user is not authenticated
 */
const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  redirectTo = '/login',
  fallback
}) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();
  const [showMessage, setShowMessage] = useState(false);
  
  // Show message after a short delay if still loading
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        setShowMessage(true);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [loading]);

  if (loading) {
    return fallback || (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-4" />
          {showMessage && (
            <p className="text-gray-600 dark:text-gray-400">Verifying authentication...</p>
          )}
        </div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    // Pass the current location to the login page so we can redirect back after login
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;