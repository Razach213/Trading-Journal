// Stripe configuration
export const stripeConfig = {
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
  secretKey: import.meta.env.VITE_STRIPE_SECRET_KEY,
};

// Stripe price IDs for different plans
export const stripePrices = {
  pro: {
    monthly: 'price_1234567890', // Replace with actual Stripe price ID
    yearly: 'price_0987654321',  // Replace with actual Stripe price ID
  },
  premium: {
    monthly: 'price_abcdefghij', // Replace with actual Stripe price ID
    yearly: 'price_jihgfedcba',  // Replace with actual Stripe price ID
  }
};

// Stripe product features
export const stripeProducts = {
  free: {
    name: 'Starter',
    features: [
      'Up to 50 trades per month',
      'Basic performance analytics',
      'Trade notes and tags',
      'Mobile responsive design',
      'Email support',
      'Data export (CSV)'
    ]
  },
  pro: {
    name: 'Professional',
    features: [
      'Unlimited trades',
      'Advanced analytics & insights',
      'Performance benchmarking',
      'Custom trade categories',
      'Data export (CSV, PDF)',
      'Priority email support',
      'Trading calendar',
      'Risk management tools',
      'Real-time sync',
      'Advanced charts'
    ]
  },
  premium: {
    name: 'Enterprise',
    features: [
      'Everything in Professional',
      'Multi-account support',
      'Team collaboration',
      'Advanced reporting',
      'API integrations',
      'White-label options',
      'Dedicated account manager',
      'Phone support',
      'Custom integrations',
      'SLA guarantee',
      'Advanced security'
    ]
  }
};