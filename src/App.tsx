import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Layout/Header';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Pricing from './pages/Pricing';
import Features from './pages/Features';
import About from './pages/About';
import Contact from './pages/Contact';
import Help from './pages/Help';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Settings from './pages/Settings';
import { AuthProvider } from './hooks/useAuth'; // Assuming AuthProvider is exported from useAuth
import { ResponsiveProvider } from './hooks/useResponsive'; // Assuming ResponsiveProvider is exported from useResponsive

function App() {

  // Dark Mode ka logic
  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    if (isDark) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <AuthProvider>
      <ResponsiveProvider>
        <Router>
          <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col">
            <Header toggleTheme={toggleTheme} />
            <main className="flex-1">
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
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
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
              </Routes>
            </main>
          </div>
          <Toaster />
        </Router>
      </ResponsiveProvider>
    </AuthProvider>
  );
}

export default App;
