import React, { useState } from 'react';
import { 
  Search, 
  Book, 
  Video, 
  MessageCircle, 
  Mail, 
  ChevronRight,
  ChevronDown,
  Star,
  CheckCircle,
  ArrowRight,
  HelpCircle,
  Zap,
  BarChart3,
  Shield,
  CreditCard,
  Settings,
  Users
} from 'lucide-react';

const Help: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const categories = [
    {
      icon: Book,
      title: 'Getting Started',
      description: 'Learn the basics of using ZellaX',
      articles: 12,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: BarChart3,
      title: 'Trading & Analytics',
      description: 'Understanding your trading data',
      articles: 18,
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: Settings,
      title: 'Account Settings',
      description: 'Manage your account and preferences',
      articles: 8,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: CreditCard,
      title: 'Billing & Subscriptions',
      description: 'Payment and subscription management',
      articles: 6,
      color: 'bg-orange-100 text-orange-600'
    },
    {
      icon: Shield,
      title: 'Security & Privacy',
      description: 'Keep your account secure',
      articles: 5,
      color: 'bg-red-100 text-red-600'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Connect with other traders',
      articles: 4,
      color: 'bg-pink-100 text-pink-600'
    }
  ];

  const popularArticles = [
    {
      title: 'How to add your first trade',
      category: 'Getting Started',
      readTime: '3 min read',
      rating: 4.9
    },
    {
      title: 'Understanding P&L calculations',
      category: 'Trading & Analytics',
      readTime: '5 min read',
      rating: 4.8
    },
    {
      title: 'Setting up account balance tracking',
      category: 'Getting Started',
      readTime: '4 min read',
      rating: 4.7
    },
    {
      title: 'Exporting your trading data',
      category: 'Trading & Analytics',
      readTime: '2 min read',
      rating: 4.9
    },
    {
      title: 'Managing your subscription',
      category: 'Billing & Subscriptions',
      readTime: '3 min read',
      rating: 4.6
    }
  ];

  const faqs = [
    {
      question: 'How do I get started with ZellaX?',
      answer: 'Getting started is easy! Simply sign up for a free account, set your starting account balance, and begin adding your trades. Our onboarding guide will walk you through all the essential features to help you get the most out of ZellaX.'
    },
    {
      question: 'Can I import trades from my broker?',
      answer: 'Yes! ZellaX supports CSV imports from most major brokers. You can also manually add trades or use our API for automated trade importing. We\'re continuously adding support for more brokers and trading platforms.'
    },
    {
      question: 'How is my P&L calculated?',
      answer: 'P&L is calculated automatically based on your entry and exit prices, quantity, and trade type (long/short). For long positions: P&L = (Exit Price - Entry Price) × Quantity. For short positions: P&L = (Entry Price - Exit Price) × Quantity.'
    },
    {
      question: 'Is my trading data secure?',
      answer: 'Absolutely! We use bank-level encryption (AES-256) to protect your data both in transit and at rest. Your trading information is stored securely and is never shared with third parties. We also offer two-factor authentication for additional security.'
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, you can cancel your subscription at any time from your account settings. Your account will remain active until the end of your current billing period, and you\'ll continue to have access to all paid features during that time.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 30-day money-back guarantee for all paid plans. If you\'re not satisfied with ZellaX within the first 30 days, contact our support team and we\'ll process a full refund.'
    },
    {
      question: 'How do I track my account balance?',
      answer: 'ZellaX automatically tracks your account balance based on your starting balance and trade P&L. You can set your starting balance in the account settings, and it will update automatically as you add profitable or losing trades.'
    },
    {
      question: 'Can I share my trades publicly?',
      answer: 'Yes! You can choose to make individual trades or your entire trading journal public. This allows you to share your trading ideas with the community and get feedback from other traders.'
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="h-4 w-4 mr-2" />
            Help Center
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How can we
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              help you today?
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Find answers to your questions, learn how to use ZellaX effectively, and get the most out of your trading journal.
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search for help articles, FAQs, or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Video Tutorials</h3>
              <p className="text-gray-600 mb-4">Watch step-by-step guides</p>
              <button className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
                Watch Now →
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Chat</h3>
              <p className="text-gray-600 mb-4">Chat with our support team</p>
              <button className="text-green-600 font-medium hover:text-green-700 transition-colors">
                Start Chat →
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Support</h3>
              <p className="text-gray-600 mb-4">Get detailed help via email</p>
              <a 
                href="mailto:support@zellax.com"
                className="text-purple-600 font-medium hover:text-purple-700 transition-colors"
              >
                Send Email →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse by Category</h2>
            <p className="text-xl text-gray-600">Find help articles organized by topic</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${category.color}`}>
                  <category.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {category.title}
                </h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{category.articles} articles</span>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Articles</h2>
            <p className="text-xl text-gray-600">Most helpful articles from our community</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularArticles.map((article, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                    {article.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{article.rating}</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {article.title}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{article.readTime}</span>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Quick answers to common questions</p>
          </div>

          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                  {expandedFaq === index ? (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredFaqs.length === 0 && searchTerm && (
            <div className="text-center py-12">
              <HelpCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any FAQs matching "{searchTerm}". Try a different search term or contact our support team.
              </p>
              <a
                href="mailto:support@zellax.com"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
              >
                <Mail className="h-4 w-4 mr-2" />
                Contact Support
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
            <p className="text-blue-100 mb-6">
              Can't find what you're looking for? Our support team is here to help you succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@zellax.com"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
              >
                <Mail className="h-4 w-4 mr-2" />
                Email Support
              </a>
              <a
                href="/contact"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Help;