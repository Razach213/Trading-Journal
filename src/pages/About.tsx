import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  Target, 
  Users, 
  Award, 
  TrendingUp, 
  Shield, 
  Heart,
  ArrowRight,
  CheckCircle,
  Star,
  Globe,
  Clock
} from 'lucide-react';

const About: React.FC = () => {
  const values = [
    {
      icon: Target,
      title: 'Precision',
      description: 'We believe in accurate data and precise analytics to help traders make informed decisions.'
    },
    {
      icon: Shield,
      title: 'Security',
      description: 'Your trading data is sacred. We protect it with enterprise-grade security measures.'
    },
    {
      icon: Heart,
      title: 'Community',
      description: 'We foster a supportive community where traders can learn, grow, and succeed together.'
    },
    {
      icon: TrendingUp,
      title: 'Growth',
      description: 'We are committed to continuous improvement and helping traders achieve their goals.'
    }
  ];

  const team = [
    {
      name: 'Ali Raza',
      role: 'CEO & Founder',
      bio: 'Built ZellaX to solve the problems he faced as a professional trader.',
      avatar: 'AR',
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      name: 'Sarah Chen',
      role: 'CTO',
      bio: 'Ex-Google engineer passionate about building scalable trading technology. Leads our technical vision and product development.',
      avatar: 'SC',
      gradient: 'from-green-500 to-blue-500'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Head of Product',
      bio: 'Product strategist with deep understanding of trader workflows. Ensures ZellaX meets real-world trading needs.',
      avatar: 'MR',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Emily Davis',
      role: 'Head of Customer Success',
      bio: 'Dedicated to helping traders succeed. Leads our support team and community initiatives.',
      avatar: 'ED',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  const stats = [
    { value: '75K+', label: 'Active Traders', icon: Users },
    { value: '2.5M+', label: 'Trades Logged', icon: TrendingUp },
    { value: '150+', label: 'Countries', icon: Globe },
    { value: '99.9%', label: 'Uptime', icon: Clock }
  ];

  const milestones = [
    {
      year: '2022',
      title: 'Company Founded',
      description: 'ZellaX was born from the need for better trading analytics and journaling tools.'
    },
    {
      year: '2025',
      title: 'First 10K Users',
      description: 'Reached our first major milestone with traders from over 50 countries.'
    },
    {
      year: '2025',
      title: 'Advanced Analytics',
      description: 'Launched AI-powered insights and advanced performance analytics features.'
    },
    {
      year: '2025',
      title: 'Global Expansion',
      description: 'Serving 15K+ traders worldwide with enterprise-grade features and support.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="h-4 w-4 mr-2" />
              About ZellaX
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Built by Traders,
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                for Traders
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              ZellaX was created to solve the real challenges that traders face every day. 
              We understand the importance of accurate data, insightful analytics, and 
              continuous improvement in trading performance.
            </p>
            <Link
              to="/signup"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 inline-flex items-center group"
            >
              Join Our Community
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                We believe that every trader deserves access to professional-grade tools 
                and analytics, regardless of their experience level or account size. Our 
                mission is to democratize trading technology and help traders at all levels 
                improve their performance through better data and insights.
              </p>
              <div className="space-y-4">
                {[
                  'Provide accurate and actionable trading analytics',
                  'Foster a supportive trading community',
                  'Maintain the highest standards of data security',
                  'Continuously innovate and improve our platform'
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Why We Started ZellaX</h3>
                <p className="text-blue-100 leading-relaxed">
                  "As professional traders, we were frustrated by the lack of comprehensive 
                  journaling tools that could provide real insights into our performance. 
                  We built ZellaX to be the platform we wished we had when we started trading."
                </p>
                <div className="mt-6 flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">AJ</span>
                  </div>
                  <div>
                    <div className="font-semibold">Ali Raza</div>
                    <div className="text-blue-200 text-sm">CEO & Founder</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center group">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
                  <value.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600">
              The passionate people behind ZellaX
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 text-center">
                <div className={`bg-gradient-to-r ${member.gradient} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-white text-xl font-bold">{member.avatar}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600">
              Key milestones in our mission to empower traders
            </p>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start space-x-6">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {milestone.year}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Join Our Growing Community
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Be part of the next generation of successful traders using ZellaX
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 inline-flex items-center justify-center group"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
