import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  BarChart3, 
  TrendingUp, 
  Shield, 
  Brain, 
  Smartphone, 
  Globe,
  Target,
  Clock,
  Users,
  FileText,
  Download,
  Bell,
  Zap,
  CheckCircle,
  ArrowRight,
  Star,
  Award,
  Calendar,
  PieChart,
  Activity
} from 'lucide-react';

const Features: React.FC = () => {
  const { user } = useAuth();

  const mainFeatures = [
    {
      id: 'analytics',
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Deep insights into your trading performance with comprehensive statistics, profit/loss analysis, and performance metrics.',
      features: [
        'Real-time P&L tracking',
        'Win rate calculations',
        'Profit factor analysis',
        'Risk-reward ratios',
        'Performance benchmarking'
      ],
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'tracking',
      icon: TrendingUp,
      title: 'Performance Tracking',
      description: 'Monitor your trading progress with detailed charts, win rates, and performance trends over time.',
      features: [
        'Interactive performance charts',
        'Monthly/yearly comparisons',
        'Drawdown analysis',
        'Consistency metrics',
        'Goal tracking'
      ],
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      id: 'security',
      icon: Shield,
      title: 'Bank-Level Security',
      description: 'Your trading data is protected with enterprise-grade encryption and security measures.',
      features: [
        'AES-256 encryption',
        'Secure data centers',
        'Regular security audits',
        'Privacy compliance',
        'Data backup & recovery'
      ],
      gradient: 'from-red-500 to-pink-500'
    },
    {
      id: 'community',
      icon: Users,
      title: 'Trading Community',
      description: 'Connect with other traders, share insights, and learn from the trading community.',
      features: [
        'Share trading ideas',
        'Community discussions',
        'Learn from experts',
        'Trading challenges',
        'Peer feedback'
      ],
      gradient: 'from-purple-500 to-violet-500'
    }
  ];

  const additionalFeatures = [
    {
      icon: Brain,
      title: 'Smart Insights',
      description: 'AI-powered analysis helps identify patterns and suggests improvements to your trading strategy.'
    },
    {
      icon: Smartphone,
      title: 'Mobile Responsive',
      description: 'Access your trading journal anywhere with our responsive design and mobile-optimized interface.'
    },
    {
      icon: Globe,
      title: 'Multi-Market Support',
      description: 'Track trades across stocks, forex, crypto, and commodities all in one unified platform.'
    },
    {
      icon: Clock,
      title: 'Real-Time Sync',
      description: 'Your data syncs instantly across all devices, ensuring you never lose important trade information.'
    },
    {
      icon: Download,
      title: 'Data Export',
      description: 'Export your trading data in multiple formats including CSV, PDF, and Excel for tax reporting.'
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Get notified about important trading milestones, performance updates, and market insights.'
    },
    {
      icon: Calendar,
      title: 'Trading Calendar',
      description: 'Track important market events, earnings dates, and economic announcements.'
    },
    {
      icon: PieChart,
      title: 'Portfolio Analysis',
      description: 'Comprehensive portfolio tracking with sector allocation and risk distribution analysis.'
    },
    {
      icon: Activity,
      title: 'Performance Metrics',
      description: 'Detailed performance metrics including Sharpe ratio, maximum drawdown, and more.'
    }
  ];

  const pricingTiers = [
    {
      name: 'Starter',
      features: [
        'Up to 50 trades per month',
        'Basic performance analytics',
        'Trade notes and tags',
        'Mobile responsive design',
        'Email support'
      ]
    },
    {
      name: 'Professional',
      features: [
        'Unlimited trades',
        'Advanced analytics & insights',
        'Performance benchmarking',
        'Custom trade categories',
        'Priority support',
        'Advanced charts',
        'Risk management tools'
      ]
    },
    {
      name: 'Enterprise',
      features: [
        'Everything in Professional',
        'Multi-account support',
        'Team collaboration',
        'API integrations',
        'White-label options',
        'Dedicated account manager'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="h-4 w-4 mr-2" />
              Powerful Trading Features
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need to
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Excel in Trading
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover the comprehensive suite of tools and features that make ZellaX 
              the most advanced trading journal platform for serious traders.
            </p>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Core Features
            </h2>
            <p className="text-xl text-gray-600">
              The essential tools every successful trader needs
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {mainFeatures.map((feature, index) => (
              <div 
                key={feature.id} 
                id={feature.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 scroll-mt-20"
              >
                <div className="p-8">
                  <div className={`bg-gradient-to-r ${feature.gradient} w-16 h-16 rounded-xl flex items-center justify-center mb-6`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
                  
                  <div className="space-y-3">
                    {feature.features.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Additional Features
            </h2>
            <p className="text-xl text-gray-600">
              More tools to enhance your trading experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600">
              Find the perfect plan for your trading needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <div key={index} className={`bg-white rounded-2xl p-8 border-2 ${
                index === 1 ? 'border-blue-500 shadow-lg scale-105' : 'border-gray-200'
              } hover:shadow-lg transition-all duration-300`}>
                {index === 1 && (
                  <div className="bg-blue-500 text-white text-center py-2 px-4 rounded-lg text-sm font-medium mb-6">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-6">{tier.name}</h3>
                <ul className="space-y-4">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Trading?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of traders who have improved their performance with ZellaX
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={user ? '/dashboard' : '/signup'}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 inline-flex items-center justify-center group"
            >
              {user ? 'Go to Dashboard' : 'Start Free Trial'}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/pricing"
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;