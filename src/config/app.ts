// App configuration
export const appConfig = {
  name: import.meta.env.VITE_APP_NAME || 'ZellaX',
  url: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
  supportEmail: import.meta.env.VITE_SUPPORT_EMAIL || 'support@zellax.com',
  version: '1.0.0',
  
  // Feature flags
  features: {
    enableStripe: !!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
    enableEmulators: import.meta.env.VITE_ENABLE_EMULATORS === 'true',
    enableAnalytics: !!import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  },
  
  // Limits for free plan
  limits: {
    free: {
      maxTrades: 50,
      maxNotes: 100,
      maxTags: 20,
    }
  }
};