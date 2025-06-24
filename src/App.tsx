import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Layout/Header';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Playbooks from './pages/Playbooks';
import Pricing from './pages/Pricing';
import Features from './pages/Features';
import About from './pages/About';
import Contact from './pages/Contact';
import Help from './pages/Help';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Settings from './pages/Settings';
import Admin from './pages/Admin';
import AdminPanal from './pages/AdminPanal';
import { getAuth, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import toast from 'react-hot-toast';

// ScrollToTop component to reset scroll position on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Firebase Auth Token Login Hook
function useFirebaseAuthTokenLogin() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      // Skip if no auth instance or already authenticated
      if (!auth) return;
      
      // Check if user is already authenticated
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          // User is already signed in, refresh token
          try {
            const token = await user.getIdToken(true);
            localStorage.setItem('authToken', token);
            console.log('✅ Firebase token refreshed successfully');
          } catch (error) {
            console.error('❌ Error refreshing token:', error);
          }
        } else {
          // No user is signed in, try to use stored token
          const authToken = localStorage.getItem('authToken');
          if (authToken && authToken.startsWith('demo-token-')) {
            // This is a demo token, don't try to use it with Firebase
            return;
          }
          
          if (authToken) {
            try {
              setIsAuthenticating(true);
              setAuthError(null);
              
              // Try to sign in with the stored token
              await signInWithCustomToken(auth, authToken);
              console.log('✅ Firebase sign-in with custom token succeeded.');
            } catch (error: any) {
              console.error('❌ Firebase sign-in failed:', error);
              setAuthError(error.message || 'Authentication failed');
              
              // Clear invalid token
              localStorage.removeItem('authToken');
              
              // Only show error toast if not on login/signup pages
              const currentPath = window.location.pathname;
              if (currentPath !== '/login' && currentPath !== '/signup') {
                toast.error('Your session has expired. Please sign in again.');
              }
            } finally {
              setIsAuthenticating(false);
            }
          }
        }
      });
      
      return unsubscribe;
    };

    initializeAuth();
  }, []);

  return { isAuthenticating, authError };
}

function App() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { isAuthenticating, authError } = useFirebaseAuthTokenLogin();

  // Enhanced Dark Mode Logic with Animation
  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsTransitioning(true);
    
    // Create transition overlay
    const overlay = document.createElement('div');
    overlay.className = 'theme-transition-overlay active';
    document.body.appendChild(overlay);
    
    // Add a smooth transition effect
    setTimeout(() => {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      
      // Remove overlay after transition
      setTimeout(() => {
        overlay.classList.remove('active');
        setTimeout(() => {
          if (document.body.contains(overlay)) {
            document.body.removeChild(overlay);
          }
          setIsTransitioning(false);
        }, 300);
      }, 150);
    }, 150);
  };

  if (isAuthenticating) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="relative min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col transition-all duration-300">
          <ScrollToTop />
          <Header toggleTheme={toggleTheme} />
          <main className="flex-1 animate-fade-in-scale">
            {authError && window.location.pathname !== '/login' && window.location.pathname !== '/signup' && (
              <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 py-2">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-red-800 dark:text-red-200">
                      Authentication error: {authError}
                    </p>
                    <a 
                      href="/login" 
                      className="text-sm font-medium text-red-800 dark:text-red-200 underline"
                    >
                      Sign in again
                    </a>
                  </div>
                </div>
              </div>
            )}
            
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/features" element={<Features />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/help" element={<Help />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              
              {/* Separate Admin Panel Route - No Authentication Required */}
              <Route path="/adminPanal" element={<AdminPanal />} />
              
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/playbooks"
                element={
                  <ProtectedRoute>
                    <Playbooks />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--toast-bg)',
              color: 'var(--toast-color)',
            },
            className: 'dark:bg-gray-800 dark:text-white',
          }}
        />
      </Router>
    </ErrorBoundary>
  );
}

export default App;