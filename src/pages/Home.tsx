import React, { useEffect, useRef } from 'react';
import { CheckCircle2, ArrowRight, TrendingUp, BarChart3, Shield, Users, Zap, ChevronRight, DollarSign, Award, Target, Clock, Laptop, BookOpen, LineChart, PieChart } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const features = [
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Track your trades with detailed entry and exit points, analyze performance with comprehensive metrics."
  },
  {
    icon: TrendingUp,
    title: "Performance Tracking", 
    description: "Monitor your trading progress with detailed charts, win rates, and performance trends over time."
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your trading data is protected with bank-level security. Your data is your own, always."
  },
  {
    icon: Users,
    title: "Community Features",
    description: "Connect with other traders, share insights, and learn from the trading community."
  }
];

const stats = [
  { value: '75K+', label: 'Active Traders' },
  { value: '2.5M+', label: 'Trades Logged' },
  { value: '150+', label: 'Countries' },
  { value: '99.9%', label: 'Uptime' }
];

const testimonials = [
  {
    quote: "ZellaX has completely transformed my trading. The analytics helped me identify patterns I was missing before.",
    author: "Sarah K.",
    role: "Day Trader",
    image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150"
  },
  {
    quote: "The performance tracking features have been invaluable. I've improved my win rate by 15% since I started using ZellaX.",
    author: "Michael R.",
    role: "Swing Trader",
    image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150"
  },
  {
    quote: "As a professional trader, I need reliable tools. ZellaX delivers with its robust analytics and clean interface.",
    author: "Jennifer T.",
    role: "Professional Trader",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150"
  }
];

const benefits = [
  {
    icon: Target,
    title: "Identify Winning Patterns",
    description: "Analyze your successful trades to replicate winning strategies and improve your performance."
  },
  {
    icon: Award,
    title: "Track Your Progress",
    description: "Monitor your growth over time with detailed metrics and performance indicators."
  },
  {
    icon: DollarSign,
    title: "Increase Profitability",
    description: "Make data-driven decisions to optimize your trading strategy and maximize returns."
  },
  {
    icon: Clock,
    title: "Save Time",
    description: "Streamline your trading journal process with our intuitive interface and automated calculations."
  }
];

const Home: React.FC = () => {
  const { user } = useAuth();
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-scale');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, observerOptions);

    const elements = [
      heroRef.current,
      featuresRef.current,
      statsRef.current,
      benefitsRef.current,
      testimonialsRef.current,
      ctaRef.current
    ];

    elements.forEach(el => {
      if (el) observer.observe(el);
    });

    return () => {
      elements.forEach(el => {
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900">
      <main>
        {/* Hero section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800" />
          
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400/10 dark:bg-blue-600/10 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '0s' }}></div>
            <div className="absolute top-40 right-20 w-72 h-72 bg-purple-400/10 dark:bg-purple-600/10 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-green-400/10 dark:bg-green-600/10 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          </div>
          
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32">
            <div ref={heroRef} className="text-center opacity-0 translate-y-10 transition-all duration-1000 ease-out">
              <div className="inline-flex items-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-6 sm:mb-8 animate-pulse">
                <Zap className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Trusted by 75,000+ Traders Worldwide
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 sm:mb-8">
                <span className="block text-gray-900 dark:text-white">The Trading Journal</span>
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Built for Winners
                </span>
              </h1>
              
              <p className="mx-auto mt-4 sm:mt-6 max-w-2xl text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed px-4 sm:px-0">
                Track, analyze, and improve your trading performance with the most advanced trading journal platform. 
                Join thousands of successful traders who trust ZellaX to elevate their trading game.
              </p>
              
              <div className="mx-auto mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none px-4 sm:px-0">
                <Link
                  to={user ? "/dashboard" : "/signup"}
                  className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 group"
                >
                  {user ? "Go to Dashboard" : "Start Free Trial"}
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/features"
                  className="inline-flex items-center justify-center rounded-lg border-2 border-gray-300 dark:border-gray-600 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
                >
                  View Features
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 px-4 sm:px-0">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                    <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Dashboard Preview */}
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 mx-auto max-w-5xl">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 dark:to-black/40 pointer-events-none"></div>
              <img 
                src="https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=1200" 
                alt="ZellaX Dashboard Preview" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>

        {/* Feature section */}
        <div ref={featuresRef} className="relative bg-gray-50 dark:bg-gray-800 py-20 sm:py-24 lg:py-32 opacity-0 translate-y-10 transition-all duration-1000 ease-out">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 sm:mb-20">
              <h2 className="text-base sm:text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">Everything you need</h2>
              <p className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
                All-in-one Trading Platform
              </p>
              <p className="mx-auto max-w-2xl text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 px-4 sm:px-0">
                A trading journal is one of the most effective tools for improving your trading performance. 
                Here's what ZellaX offers to help you succeed.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
              {features.map((feature, index) => (
                <div key={index} className="group">
                  <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 sm:p-10 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 h-full transform hover:-translate-y-2">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center mb-6 sm:mb-8 group-hover:scale-110 transition-transform">
                      <feature.icon className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Stats & Benefits Section */}
        <div ref={statsRef} className="relative py-20 sm:py-24 lg:py-32 opacity-0 translate-y-10 transition-all duration-1000 ease-out">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Left side - Stats */}
              <div className="relative">
                <div className="chart-3d-container">
                  <div className="chart-3d-element">
                    <img 
                      src="https://images.pexels.com/photos/6770610/pexels-photo-6770610.jpeg?auto=compress&cs=tinysrgb&w=800" 
                      alt="Trading Performance Chart" 
                      className="w-full h-auto rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 animate-chart-rise"
                    />
                    <div className="chart-3d-shadow"></div>
                  </div>
                </div>
                
                <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 max-w-xs animate-float">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Win Rate</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">68.5%</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-green-500 dark:bg-green-400 h-2 rounded-full" style={{ width: '68.5%' }}></div>
                  </div>
                </div>
                
                <div className="absolute -top-6 -left-6 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 max-w-xs animate-float" style={{ animationDelay: '0.5s' }}>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Profit Factor</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">2.4</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 dark:bg-blue-400 h-2 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>
              </div>
              
              {/* Right side - Benefits */}
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Transform Your Trading with Data-Driven Insights
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                  ZellaX helps you identify patterns, track your progress, and make better trading decisions. 
                  Our comprehensive analytics turn your trading data into actionable insights.
                </p>
                
                <div className="space-y-6">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-3 text-white flex-shrink-0">
                        <benefit.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{benefit.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-10">
                  <Link
                    to="/features"
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-800 dark:hover:text-blue-300 transition-colors group"
                  >
                    Explore all features
                    <ChevronRight className="ml-1 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Features Showcase */}
        <div ref={benefitsRef} className="relative bg-gray-50 dark:bg-gray-800 py-20 sm:py-24 lg:py-32 opacity-0 translate-y-10 transition-all duration-1000 ease-out">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Powerful Features for Serious Traders
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                Everything you need to track, analyze, and improve your trading performance
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Feature 1 */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="p-8">
                  <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-6">
                    <LineChart className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Advanced Performance Metrics</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Track win rate, profit factor, average win/loss, and more with our comprehensive analytics dashboard.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-600 dark:text-gray-300">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Real-time P&L tracking</span>
                    </li>
                    <li className="flex items-center text-gray-600 dark:text-gray-300">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Win rate calculations</span>
                    </li>
                    <li className="flex items-center text-gray-600 dark:text-gray-300">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Profit factor analysis</span>
                    </li>
                  </ul>
                </div>
                <img 
                  src="https://images.pexels.com/photos/6771985/pexels-photo-6771985.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="Performance Metrics" 
                  className="w-full h-48 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              {/* Feature 2 */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="p-8">
                  <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-6">
                    <BookOpen className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Trading Playbooks</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Create and save your trading strategies with detailed entry/exit rules and risk management guidelines.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-600 dark:text-gray-300">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Strategy templates</span>
                    </li>
                    <li className="flex items-center text-gray-600 dark:text-gray-300">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Chart screenshot storage</span>
                    </li>
                    <li className="flex items-center text-gray-600 dark:text-gray-300">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Detailed trade rules</span>
                    </li>
                  </ul>
                </div>
                <img 
                  src="https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="Trading Playbooks" 
                  className="w-full h-48 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              {/* Feature 3 */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="p-8">
                  <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-6">
                    <PieChart className="h-7 w-7 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Trade Analysis</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Analyze your trading patterns to identify strengths and areas for improvement.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-600 dark:text-gray-300">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Performance by symbol</span>
                    </li>
                    <li className="flex items-center text-gray-600 dark:text-gray-300">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Strategy comparison</span>
                    </li>
                    <li className="flex items-center text-gray-600 dark:text-gray-300">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Time-based analysis</span>
                    </li>
                  </ul>
                </div>
                <img 
                  src="https://images.pexels.com/photos/7567596/pexels-photo-7567596.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="Trade Analysis" 
                  className="w-full h-48 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Testimonials Section */}
        <div ref={testimonialsRef} className="relative py-20 sm:py-24 lg:py-32 opacity-0 translate-y-10 transition-all duration-1000 ease-out">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800"></div>
          
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Trusted by Traders Worldwide
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                See what our community of traders has to say about ZellaX
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index} 
                  className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.author} 
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{testimonial.author}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 italic">"{testimonial.quote}"</p>
                  <div className="mt-4 flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-5 w-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* How It Works Section */}
        <div className="relative bg-white dark:bg-gray-900 py-20 sm:py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                How ZellaX Works
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                Get started in minutes and transform your trading journey
              </p>
            </div>
            
            <div className="relative">
              {/* Connection line */}
              <div className="absolute top-24 left-1/2 w-1 h-[calc(100%-6rem)] bg-gradient-to-b from-blue-500 to-purple-600 hidden md:block"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
                {/* Step 1 */}
                <div className="md:text-right md:pr-16">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-lg mb-4 md:ml-auto">1</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Sign Up for Free</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Create your account in seconds and get immediate access to all the essential features.
                  </p>
                </div>
                
                {/* Step 1 Image */}
                <div className="md:order-1 md:mt-12">
                  <img 
                    src="https://images.pexels.com/photos/6802042/pexels-photo-6802042.jpeg?auto=compress&cs=tinysrgb&w=800" 
                    alt="Sign Up" 
                    className="rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 w-full h-auto"
                  />
                </div>
                
                {/* Step 2 Image */}
                <div className="md:mt-12">
                  <img 
                    src="https://images.pexels.com/photos/7567444/pexels-photo-7567444.jpeg?auto=compress&cs=tinysrgb&w=800" 
                    alt="Log Your Trades" 
                    className="rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 w-full h-auto"
                  />
                </div>
                
                {/* Step 2 */}
                <div className="md:pl-16">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-lg mb-4">2</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Log Your Trades</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Record your trades with detailed information including entry/exit points, strategy, and notes.
                  </p>
                </div>
                
                {/* Step 3 */}
                <div className="md:text-right md:pr-16">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-lg mb-4 md:ml-auto">3</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Analyze Performance</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Get insights into your trading patterns with our comprehensive analytics dashboard.
                  </p>
                </div>
                
                {/* Step 3 Image */}
                <div className="md:order-3 md:mt-12">
                  <img 
                    src="https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=800" 
                    alt="Analyze Performance" 
                    className="rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 w-full h-auto"
                  />
                </div>
                
                {/* Step 4 Image */}
                <div className="md:mt-12">
                  <img 
                    src="https://images.pexels.com/photos/7567538/pexels-photo-7567538.jpeg?auto=compress&cs=tinysrgb&w=800" 
                    alt="Improve Strategy" 
                    className="rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 w-full h-auto"
                  />
                </div>
                
                {/* Step 4 */}
                <div className="md:pl-16">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-lg mb-4">4</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Improve Your Strategy</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Use data-driven insights to refine your approach and boost your trading performance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Pricing Preview */}
        <div className="relative bg-gray-50 dark:bg-gray-800 py-20 sm:py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                Choose the plan that fits your trading needs
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Free Plan */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Starter</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Perfect for getting started</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white mb-6">$0</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Up to 50 trades per month</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Basic performance analytics</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Trade notes and tags</span>
                  </li>
                </ul>
                <Link
                  to={user ? "/dashboard" : "/signup"}
                  className="block w-full py-3 px-4 text-center bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Get Started Free
                </Link>
              </div>
              
              {/* Pro Plan */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl border-2 border-blue-500 dark:border-blue-500 hover:shadow-2xl transition-all duration-300 transform scale-105 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Professional</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">For serious traders</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white mb-6">$19<span className="text-lg text-gray-600 dark:text-gray-400">/mo</span></p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Unlimited trades</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Advanced analytics & insights</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Performance benchmarking</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Priority support</span>
                  </li>
                </ul>
                <Link
                  to="/pricing"
                  className="block w-full py-3 px-4 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-colors"
                >
                  Start Pro Trial
                </Link>
              </div>
              
              {/* Enterprise Plan */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Enterprise</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">For professional traders</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white mb-6">$49<span className="text-lg text-gray-600 dark:text-gray-400">/mo</span></p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Everything in Professional</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Multi-account support</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Team collaboration</span>
                  </li>
                </ul>
                <Link
                  to="/pricing"
                  className="block w-full py-3 px-4 text-center bg-gray-900 dark:bg-gray-700 text-white rounded-lg font-medium hover:bg-black dark:hover:bg-gray-600 transition-colors"
                >
                  Get Enterprise
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div ref={ctaRef} className="bg-gradient-to-r from-blue-600 to-purple-600 py-20 sm:py-24 lg:py-28 opacity-0 translate-y-10 transition-all duration-1000 ease-out">
          <div className="mx-auto max-w-5xl text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Trading?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
              Join thousands of traders who have improved their performance with ZellaX. 
              Start your journey to consistent profitability today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={user ? "/dashboard" : "/signup"}
                className="inline-flex items-center justify-center rounded-lg bg-white text-blue-600 px-8 py-4 text-lg font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 group"
              >
                {user ? "Go to Dashboard" : "Start Free Trial"}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center rounded-lg border-2 border-white text-white px-8 py-4 text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200"
              >
                View Pricing
              </Link>
            </div>
            
            {/* Floating devices mockup */}
            <div className="mt-16 relative max-w-4xl mx-auto">
              <div className="relative z-10 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/6781341/pexels-photo-6781341.jpeg?auto=compress&cs=tinysrgb&w=1200" 
                  alt="ZellaX Dashboard on Desktop" 
                  className="w-full h-auto"
                />
              </div>
              
              <div className="absolute -bottom-10 -right-10 md:-right-20 w-48 md:w-64 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transform rotate-6 animate-float">
                <img 
                  src="https://images.pexels.com/photos/6802049/pexels-photo-6802049.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="ZellaX on Mobile" 
                  className="w-full h-auto"
                />
              </div>
              
              <div className="absolute -bottom-6 -left-10 md:-left-20 w-40 md:w-56 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transform -rotate-6 animate-float" style={{ animationDelay: '0.5s' }}>
                <img 
                  src="https://images.pexels.com/photos/6802073/pexels-photo-6802073.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="ZellaX Analytics" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Final CTA Banner */}
        <div className="bg-gray-900 dark:bg-black py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <h3 className="text-xl md:text-2xl font-bold text-white">Start your trading journey today</h3>
              <p className="text-gray-400 mt-1">Free 14-day trial. No credit card required.</p>
            </div>
            <Link
              to={user ? "/dashboard" : "/signup"}
              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-base font-semibold text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              {user ? "Go to Dashboard" : "Get Started Free"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;