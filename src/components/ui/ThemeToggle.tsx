import React, { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

interface ThemeToggleProps {
  toggleTheme: () => void;
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ toggleTheme, className = '' }) => {
  const [isDark, setIsDark] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const handleToggle = () => {
    setIsAnimating(true);
    
    // Add a slight delay to show the animation
    setTimeout(() => {
      toggleTheme();
      setIsDark(!isDark);
      setIsAnimating(false);
    }, 150);
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isAnimating}
      className={`
        relative inline-flex items-center justify-center
        w-12 h-12 rounded-xl
        bg-gradient-to-br from-gray-100 to-gray-200 
        dark:from-gray-800 dark:to-gray-900
        border border-gray-300 dark:border-gray-600
        shadow-lg hover:shadow-xl
        transition-all duration-300 ease-out
        transform hover:scale-105 active:scale-95
        focus:outline-none focus:ring-4 focus:ring-blue-500/30
        disabled:cursor-not-allowed
        group
        ${className}
      `}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Sun Icon */}
      <div className={`
        absolute inset-0 flex items-center justify-center
        transition-all duration-500 ease-out
        ${isDark 
          ? 'opacity-0 scale-50 rotate-180' 
          : 'opacity-100 scale-100 rotate-0'
        }
        ${isAnimating ? 'animate-pulse' : ''}
      `}>
        <SunIcon className="w-6 h-6 text-amber-500 drop-shadow-sm" />
        
        {/* Sun rays animation */}
        <div className={`
          absolute inset-0 
          ${!isDark && !isAnimating ? 'animate-spin' : ''}
          transition-all duration-1000
        `} style={{ animationDuration: '8s' }}>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-2 bg-amber-400/60 rounded-full"
              style={{
                top: '8px',
                left: '50%',
                transformOrigin: '50% 16px',
                transform: `translateX(-50%) rotate(${i * 45}deg)`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Moon Icon */}
      <div className={`
        absolute inset-0 flex items-center justify-center
        transition-all duration-500 ease-out
        ${isDark 
          ? 'opacity-100 scale-100 rotate-0' 
          : 'opacity-0 scale-50 -rotate-180'
        }
        ${isAnimating ? 'animate-pulse' : ''}
      `}>
        <MoonIcon className="w-6 h-6 text-blue-400 drop-shadow-sm" />
        
        {/* Stars around moon */}
        {isDark && !isAnimating && (
          <div className="absolute inset-0">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`
                  absolute w-1 h-1 bg-blue-300 rounded-full
                  animate-twinkle
                `}
                style={{
                  top: `${20 + Math.sin(i * 60 * Math.PI / 180) * 12}px`,
                  left: `${24 + Math.cos(i * 60 * Math.PI / 180) * 12}px`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '2s',
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Loading spinner during animation */}
      {isAnimating && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        </div>
      )}

      {/* Ripple effect on click */}
      <div className="absolute inset-0 rounded-xl overflow-hidden">
        <div className={`
          absolute inset-0 bg-white/30 dark:bg-white/10 rounded-full
          scale-0 group-active:scale-150
          transition-transform duration-300 ease-out
          opacity-0 group-active:opacity-100
        `} />
      </div>
    </button>
  );
};

export default ThemeToggle;