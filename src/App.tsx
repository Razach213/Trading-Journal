import React, { useEffect } from 'react'; // useEffect ko import karein
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

function App() {

  // ==========================================================
  // STEP 1: Dark Mode ka logic yahan daalein
  // Yeh code component ke pehli baar load hone par chalta hai
  useEffect(() => {
    // Check karta hai ke user ki pehle se 'dark' choice save hai ya nahi
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []); // Khaali array ka matlab hai yeh sirf page load par ek baar chalega

  // Yeh function button ke click par theme badalta hai
  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    // User ki choice ko save karta hai taake agli baar bhi yaad rahe
    if (isDark) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
  };
  // ==========================================================

  return (
    <Router>
      {/* Main div mein dark mode ki classes add karein */}
      <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col">
        <Header />

        {/* ========================================================== */}
        {/* STEP 2: Yahan par button daalein */}
        <div className="absolute top-4 right-4">
          <button onClick={toggleTheme} className="p-2 bg-gray-300 dark:bg-gray-700 rounded-full text-sm">
            Toggle
          </button>
        </div>
        {/* ========================================================== */}

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
        {/* Agar aap Footer istemal kar rahe hain to yahan hoga */}
        {/* <Footer /> */}
      </div>
      <Toaster />
    </Router>
  );
}

export default App;
