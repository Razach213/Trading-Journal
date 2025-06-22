/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Extend the color palette for dark mode
        'dark-bg': '#121212',
        'dark-card': '#1e1e1e',
        'dark-border': '#333333',
        'dark-text': '#e5e7eb',
        'dark-text-secondary': '#9ca3af',
      },
      backgroundColor: {
        'dark-elevated': '#2d2d2d',
      },
      borderColor: {
        'dark-subtle': '#404040',
      },
      boxShadow: {
        'dark-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.5)',
        'dark-md': '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.5)',
        'dark-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-in-scale': 'fadeInScale 0.4s ease-out',
        'slide-in-top': 'slideInFromTop 0.5s ease-out',
        'slide-in-bottom': 'slideInFromBottom 0.5s ease-out',
        'chart-line': 'chartLineGrow 2s ease-out',
        'chart-fade': 'chartFadeIn 0.8s ease-out',
        'chart-rise': 'chartRise 1.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
        'chart-glow': 'chartGlow 3s ease-in-out infinite',
        'chart-dot-pulse': 'chartDotPulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};