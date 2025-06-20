import React from 'react';
import { CheckCircle2, ArrowRight, TrendingUp, BarChart3, Shield, Users } from "lucide-react";
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

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white dark:bg-gray-900">
      <main>
        {/* Hero section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <div className="inline-flex items-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full text-sm font-medium mb-8">
                <TrendingUp className="h-4 w-4 mr-2" />
                Trusted by 75,000+ Traders Worldwide
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                <span className="block text-gray-900 dark:text-white">The Trading Journal</span>
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Built for Winners
                </span>
              </h1>
              
              <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Track, analyze, and improve your trading performance with the most advanced trading journal platform. 
                Join thousands of successful traders who trust ZellaX to elevate their trading game.
              </p>
              
              <div className="mx-auto mt-10 flex flex-col sm:flex-row gap-4 justify-center max-w-md sm:max-w-none">
                <Link
                  to={user ? "/dashboard" : "/signup"}
                  className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 group"
                >
                  {user ? "Go to Dashboard" : "Start Free Trial"}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/features"
                  className="inline-flex items-center justify-center rounded-lg border-2 border-gray-300 dark:border-gray-600 px-8 py-4 text-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
                >
                  View Features
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Feature section */}
        <div className="relative bg-gray-50 dark:bg-gray-800 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">Everything you need</h2>
              <p className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
                All-in-one Trading Platform
              </p>
              <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-300">
                A trading journal is one of the most effective tools for improving your trading performance. 
                Here's what ZellaX offers to help you succeed.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="group">
                  <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 h-full">
                    <div className="bg-blue-100 dark:bg-blue-900 w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
          <div className="mx-auto max-w-4xl text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Trading?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;