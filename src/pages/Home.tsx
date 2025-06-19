import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  Zap, 
  TrendingUp, 
  Shield, 
  BarChart3, 
  Users, 
  Star,
  ArrowRight,
  CheckCircle,
  Target,
  Brain,
  Smartphone,
  Globe,
  Award,
  Clock
} from 'lucide-react';

const Home: React.FC = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Deep insights into your trading performance with comprehensive statistics, profit/loss analysis, and performance metrics.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: TrendingUp,
      title: 'Performance Tracking',
      description: 'Monitor your trading progress with detailed charts, win rates, and performance trends over time.',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your trading data is encrypted and secure. We never share your information with third parties.',
      gradient: 'from-purple-500 to-violet-500'
    },
    {
      icon: Brain,
      title: 'Smart Insights',
      description: 'AI-powered analysis helps identify patterns and suggests improvements to your trading strategy.',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: Smartphone,
      title: 'Mobile Ready',
      description: 'Access your trading journal anywhere with our responsive design and mobile-optimized interface.',
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      icon: Globe,
      title: 'Multi-Market Support',
      description: 'Track trades across stocks, forex, crypto, and commodities all in one unified platform.',
      gradient: 'from-indigo-500 to-blue-500'
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Day Trader",
      content: "ZellaX helped me identify my trading patterns and improve my win rate by 40%. The analytics are incredibly detailed and actionable.",
      rating: 5,
      avatar: "SJ",
      company: "Independent Trader"
    },
    {
      name: "Michael Chen",
      role: "Swing Trader",
      content: "The best trading journal I've used. Clean interface, powerful features, and excellent customer support. Highly recommended!",
      rating: 5,
      avatar: "MC",
      company: "Chen Capital"
    },
    {
      name: "Emma Rodriguez",
      role: "Options Trader",
      content: "Finally, a platform that understands what traders need. The performance tracking features are game-changing for my strategy.",
      rating: 5,
      avatar: "ER",
      company: "Rodriguez Trading"
    }
  ];

  const stats = [
    { value: "75K+", label: "Active Traders", icon: Users },
    { value: "2.5M+", label: "Trades Logged", icon: BarChart3 },
    { value: "99.9%", label: "Uptime", icon: Clock },
    { value: "4.9/5", label: "User Rating", icon: Star }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="h-4 w-4 mr-2" />
              New: AI-Powered Trading Insights
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              The Trading Journal
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Built for Winners
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Track, analyze, and improve your trading performance with the most advanced 
              trading journal platform. Join thousands of successful traders who trust ZellaX.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                to={user ? "/dashboard" : "/signup"}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center group shadow-lg"
              >
                {user ? "Go to Dashboard" : "Start Free Trial"}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/features"
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
              >
                View Features
              </Link>
            </div>
            <p className="text-sm text-gray-500">
              ✨ Free 14-day trial • No credit card required • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mb-4 group-hover:scale-110 transition-transform">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Excel
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive suite of tools helps you track, analyze, and improve every aspect of your trading.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className={`bg-gradient-to-r ${feature.gradient} w-12 h-12 rounded-lg flex items-center justify-center mb-6`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Loved by Traders Worldwide
            </h2>
            <p className="text-xl text-gray-600">
              See what our community of successful traders has to say
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-2xl relative hover:bg-gray-100 transition-colors">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-semibold">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-600 text-sm">{testimonial.role}</div>
                    <div className="text-gray-500 text-xs">{testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Take Your Trading to the Next Level
              </h2>
              <div className="space-y-4">
                {[
                  "Real-time performance tracking and analytics",
                  "Advanced risk management tools",
                  "Automated trade import from major brokers",
                  "Custom reporting and data export",
                  "Mobile app for trading on the go"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center text-blue-100">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <Link
                to={user ? "/dashboard" : "/signup"}
                className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors mt-8 group"
              >
                {user ? "Go to Dashboard" : "Start Free Trial"}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="space-y-4">
                  <div className="h-4 bg-white/20 rounded w-3/4"></div>
                  <div className="h-4 bg-white/20 rounded w-1/2"></div>
                  <div className="h-32 bg-white/20 rounded"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-16 bg-white/20 rounded"></div>
                    <div className="h-16 bg-white/20 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Trading?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of traders who have improved their performance with ZellaX
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={user ? "/dashboard" : "/signup"}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 inline-flex items-center justify-center group shadow-lg"
            >
              {user ? "Go to Dashboard" : "Start Your Free Trial"}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/pricing"
              className="border-2 border-gray-600 text-gray-300 px-8 py-4 rounded-lg text-lg font-semibold hover:border-gray-500 hover:text-white transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;