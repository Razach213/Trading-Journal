import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Star, Zap, ArrowRight, Shield, Headphones, Globe, Calendar, AlertTriangle, Clock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import PaymentModal from '../components/Payment/PaymentModal';
import Logo from '../components/ui/Logo';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import toast from 'react-hot-toast';

const Pricing: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'pro'>('pro');
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [pkrRate, setPkrRate] = useState(280); // Default PKR to USD rate
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [showRenewalReminder, setShowRenewalReminder] = useState(false);
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);

  // Base price in USD
  const baseMonthlyPrice = 10;
  const yearlyDiscount = 0.1; // 10% discount for yearly plan
  const yearlyPrice = Math.round(baseMonthlyPrice * 12 * (1 - yearlyDiscount));

  // Calculate PKR price
  const pkrMonthlyPrice = Math.round(baseMonthlyPrice * pkrRate);
  const pkrYearlyPrice = Math.round(yearlyPrice * pkrRate);

  // Fetch latest exchange rate on component mount
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        // In a real app, you would fetch from an API like:
        // const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        // const data = await response.json();
        // setPkrRate(data.rates.PKR);
        
        // For now, we'll use a hardcoded recent rate
        setPkrRate(280);
      } catch (error) {
        console.error('Error fetching exchange rate:', error);
        // Fallback to default rate
        setPkrRate(280);
      }
    };

    fetchExchangeRate();
  }, []);

  // Check for plan expiry and set renewal reminder
  useEffect(() => {
    if (!user || !db) return;

    const fetchUserSubscription = async () => {
      setIsLoadingUserData(true);
      try {
        const userDoc = await getDoc(doc(db, 'users', user.id));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          
          // Check if user has subscription data
          if (userData.subscription) {
            const { expiresAt, plan } = userData.subscription;
            
            if (expiresAt) {
              const expiryTimestamp = expiresAt.toDate();
              setExpiryDate(expiryTimestamp);
              
              // Calculate if we should show renewal reminder (2 days before expiry)
              const twoDaysBeforeExpiry = new Date(expiryTimestamp);
              twoDaysBeforeExpiry.setDate(twoDaysBeforeExpiry.getDate() - 2);
              
              const today = new Date();
              setShowRenewalReminder(today >= twoDaysBeforeExpiry && today < expiryTimestamp);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user subscription data:', error);
      } finally {
        setIsLoadingUserData(false);
      }
    };

    fetchUserSubscription();
  }, [user, db]);

  const plans = [
    {
      name: 'Starter',
      price: { 
        monthly: 0, 
        yearly: 0,
        pkrMonthly: 0,
        pkrYearly: 0
      },
      description: 'Perfect for getting started with trading journaling',
      features: [
        'Up to 50 trades per month',
        'Basic performance analytics',
        'Trade notes and tags',
        'Mobile responsive design',
        'Email support',
        'Data export (CSV)'
      ],
      popular: false,
      buttonText: 'Get Started Free',
      buttonStyle: 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600',
      icon: Zap,
      gradient: 'from-gray-400 to-gray-600'
    },
    {
      name: 'Pro',
      price: { 
        monthly: baseMonthlyPrice, 
        yearly: yearlyPrice / 12, // Monthly equivalent price
        pkrMonthly: pkrMonthlyPrice,
        pkrYearly: pkrYearlyPrice / 12 // Monthly equivalent price in PKR
      },
      description: 'Advanced features for serious traders',
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
        'Advanced charts',
        'Multi-account support',
        'Team collaboration',
        'API integrations',
        'Dedicated support'
      ],
      popular: true,
      buttonText: 'Start Pro Plan',
      buttonStyle: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700',
      icon: Star,
      gradient: 'from-blue-500 to-purple-600'
    }
  ];

  const faqs = [
    {
      question: 'How long does my subscription last?',
      answer: 'Monthly subscriptions automatically expire after one month, and yearly subscriptions after 12 months. You\'ll need to manually renew your subscription before it expires to maintain access to premium features.'
    },
    {
      question: 'Will I get a reminder before my subscription expires?',
      answer: 'Yes! We\'ll show you a renewal reminder 2 days before your subscription expires so you can renew without interruption.'
    },
    {
      question: 'What happens after my subscription expires?',
      answer: 'After expiry, you\'ll lose access to premium features but can still access your dashboard to view your account and renew your subscription. Your data remains safe and will be fully accessible once you renew.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'For Pakistan: NayaPay and bank transfers. For international users: Binance and cryptocurrency payments.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes! We offer a 14-day free trial for our Pro plan. No credit card required to get started.'
    },
    {
      question: 'Is my trading data secure?',
      answer: 'Yes, we use enterprise-grade security measures including encryption and secure data centers to protect your information.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 30-day money-back guarantee for all paid plans. If you\'re not satisfied, we\'ll refund your payment.'
    }
  ];

  const handlePlanSelect = (plan: 'pro') => {
    if (!user) {
      // Redirect to login if not logged in
      navigate('/login');
      return;
    }
    
    // Set price based on billing cycle and currency
    const price = isYearly ? yearlyPrice : baseMonthlyPrice;
    
    setSelectedPlan(plan);
    setSelectedPrice(price);
    setShowPaymentModal(true);
  };

  // Format currency with proper symbol
  const formatCurrency = (amount: number, currency: 'USD' | 'PKR') => {
    const symbol = currency === 'PKR' ? '₨' : '$';
    return `${symbol}${amount.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Choose the perfect plan for your trading journey. Start free and upgrade as you grow.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm font-medium ${!isYearly ? 'text-white' : 'text-blue-200'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isYearly ? 'bg-blue-500' : 'bg-blue-400'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isYearly ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${isYearly ? 'text-white' : 'text-blue-200'}`}>
              Yearly
            </span>
            <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium animate-pulse">
              Save 10%
            </span>
          </div>
        </div>
      </div>

      {/* Renewal Reminder Banner */}
      {user && showRenewalReminder && expiryDate && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Your subscription expires on {expiryDate.toLocaleDateString()}. Renew now to avoid interruption.
                </p>
              </div>
              <button
                onClick={() => handlePlanSelect('pro')}
                className="text-sm bg-yellow-600 dark:bg-yellow-700 text-white px-4 py-1 rounded-full hover:bg-yellow-700 dark:hover:bg-yellow-600 transition-colors"
              >
                Renew Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl border-2 p-8 transition-all duration-300 hover:shadow-xl ${
                plan.popular
                  ? 'border-blue-500 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20 transform scale-105 shadow-lg'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-current" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}

              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${plan.gradient} rounded-lg mb-4`}>
                  <plan.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  {plan.price.monthly > 0 ? (
                    <div>
                      <div className="flex flex-col items-center">
                        <div className="flex items-baseline">
                          <span className="text-4xl font-bold text-gray-900 dark:text-white">
                            {formatCurrency(isYearly ? plan.price.yearly : plan.price.monthly, 'USD')}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400 ml-1">
                            /month
                          </span>
                        </div>
                        
                        {/* PKR Price */}
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {formatCurrency(isYearly ? plan.price.pkrYearly : plan.price.pkrMonthly, 'PKR')} PKR/month
                        </div>
                        
                        {isYearly && (
                          <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                            Billed annually ({formatCurrency(yearlyPrice, 'USD')})
                            <br />
                            <span className="text-xs">Save 10% compared to monthly</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>
                          {isYearly ? 'Expires after 12 months' : 'Expires after 1 month'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      Free
                    </span>
                  )}
                </div>

                {index === 0 ? (
                  <Link
                    to={user ? "/dashboard" : "/login"}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 mb-8 inline-block transform hover:scale-105 ${plan.buttonStyle}`}
                  >
                    {plan.buttonText}
                  </Link>
                ) : (
                  <button
                    onClick={() => handlePlanSelect('pro')}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 mb-8 inline-block transform hover:scale-105 ${plan.buttonStyle}`}
                  >
                    {plan.buttonText}
                  </button>
                )}
              </div>

              <ul className="space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Subscription Details */}
      <div className="bg-gray-50 dark:bg-gray-800 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-md border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Subscription Details</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Manual Renewal</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    All subscriptions expire automatically after their term (1 month or 12 months). You'll need to manually renew to continue accessing premium features.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Renewal Reminders</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We'll show you a renewal reminder 2 days before your subscription expires, giving you time to renew without interruption.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                  <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Data Protection</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Even if your subscription expires, your data remains safe and accessible once you renew. You'll always have access to your dashboard to manage your account.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Comparison */}
      <div className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose ZellaX?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Built by traders, for traders
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Global Reach</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Trusted by traders in over 100 countries worldwide with 24/7 support.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Bank-Level Security</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your data is protected with enterprise-grade encryption and security measures.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Expert Support</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get help from our team of trading experts and technical support specialists.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{faq.question}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Trading?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of traders who have improved their performance with ZellaX
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={user ? "/dashboard" : "/login"}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 inline-flex items-center justify-center group"
            >
              {user ? "Go to Dashboard" : "Start Free Trial"}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to={user ? "/contact" : "/login"}
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          onClose={() => setShowPaymentModal(false)}
          selectedPlan={selectedPlan}
          planPrice={selectedPrice}
          isYearly={isYearly}
          pkrRate={pkrRate}
          pkrMonthlyPrice={pkrMonthlyPrice}
          pkrYearlyPrice={pkrYearlyPrice}
          baseMonthlyPrice={baseMonthlyPrice}
          yearlyPrice={yearlyPrice}
        />
      )}
    </div>
  );
};

export default Pricing;