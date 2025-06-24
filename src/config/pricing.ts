// Pricing configuration
export const pricingConfig = {
  plans: {
    free: {
      name: 'Free',
      price: 0,
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
      name: 'Pro',
      price: 10, // Changed from $19 to $10 as requested
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
    }
  },
  
  // Trial duration in days
  trialDuration: 14,
  
  // Warning period before trial expiry (in days)
  trialWarningPeriod: 2,
  
  // Exchange rate API endpoint (for USD to PKR conversion)
  exchangeRateApi: 'https://api.exchangerate-api.com/v4/latest/USD',
  
  // Default exchange rate as fallback (1 USD to PKR)
  defaultExchangeRate: 278.5
};

// Function to convert USD to PKR
export const convertUsdToPkr = async (usdAmount: number): Promise<number> => {
  try {
    const response = await fetch(pricingConfig.exchangeRateApi);
    const data = await response.json();
    const exchangeRate = data.rates.PKR;
    return usdAmount * exchangeRate;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    // Use default exchange rate as fallback
    return usdAmount * pricingConfig.defaultExchangeRate;
  }
};