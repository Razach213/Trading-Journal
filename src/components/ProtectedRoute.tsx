import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading, authError } = useAuth();
  const location = useLocation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Add a small delay to ensure auth state is properly checked
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCheckingAuth(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [user, loading]);

  // Check if auth token exists in localStorage
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken && !loading && !user) {
      // No token found, redirect to login
      setIsCheckingAuth(false);
    }
  }, [user, loading]);

  // Show loading state while checking authentication
  if (loading || isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Show error state if there's an auth error
  if (authError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-lg mb-4">
            <h2 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">Authentication Error</h2>
            <p className="text-red-700 dark:text-red-400">{authError}</p>
          </div>
          <button
            onClick={() => window.location.href = '/login'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  // Only redirect if we're sure the user is not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;