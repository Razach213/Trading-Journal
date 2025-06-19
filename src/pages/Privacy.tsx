import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail, Lock, Eye, Database, UserCheck } from 'lucide-react';

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="h-4 w-4 mr-2" />
            Privacy & Security
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-blue-100">
            Your privacy and data security are our top priorities
          </p>
        </div>
      </section>

      {/* Privacy Highlights */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Privacy at a Glance</h2>
            <p className="text-xl text-gray-600">How we protect and handle your data</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Encrypted & Secure</h3>
              <p className="text-gray-600">
                All your data is encrypted with bank-level security both in transit and at rest.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Never Shared</h3>
              <p className="text-gray-600">
                We never sell or share your personal trading data with third parties.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">You're in Control</h3>
              <p className="text-gray-600">
                You have full control over your data and can delete it anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2>Privacy Notice</h2>
            <p>
              This Privacy Notice explains the privacy practices for ZellaX LLC. ZellaX ("we", "us", or "our") 
              operates the website www.zellax.com (the "Site").
            </p>
            <p>
              This page informs you of our policies regarding the collection, use, and disclosure of personal data 
              when you use our Services and the choices you have regarding that data.
            </p>
            <p>
              We use your data to provide and improve our Services. By using the Site, you agree to the collection 
              and use of information in accordance with this policy.
            </p>

            <h2>Information Collection, Use, and Sharing</h2>
            <p>
              We are the sole owners of the information collected on this Site. We only have access to information 
              that you voluntarily provide to us through registration, trade entries, or other direct interactions. 
              We do not sell or rent this information to anyone.
            </p>
            <p>
              We use your information strictly to deliver and improve the Services we offer. We do not share your 
              information with any third party outside of our organization except as necessary to fulfill your requests.
            </p>

            <h3>Specifically:</h3>
            <ul>
              <li>
                If you choose to share a trade publicly, certain information related to that trade will be visible 
                to other users of the Site (for example, shared trade ideas or performance data). If you prefer to 
                keep this information private, please refrain from using the public sharing features.
              </li>
              <li>
                Unless you ask us not to, we may contact you via email to share updates about new features, products, 
                special offers, or changes to this Privacy Policy.
              </li>
              <li>
                We may use third-party web analytics services to track aggregated traffic data and site usage. These 
                services may use cookies and collect standard internet log information such as your IP address, browser 
                type, and browsing patterns. This information is used only to help us improve the Site and Services; 
                no personally identifiable information is shared with these third parties.
              </li>
            </ul>
            <p>
              In no circumstance will your personal, individual data be sold, published, or made publicly available 
              beyond what you have explicitly shared yourself.
            </p>

            <h2>Your Access to and Control Over Information</h2>
            <p>You have full control over your personal information. You can:</p>
            <ul>
              <li>Request to see what data we have about you</li>
              <li>Request corrections to any incorrect or incomplete information</li>
              <li>Ask us to delete any data we have about you</li>
              <li>Express concerns about how we use your data</li>
              <li>Opt out of any future communications from us</li>
            </ul>
            <p>
              To exercise any of these rights, simply contact us at 
              <a href="mailto:support@zellax.com" className="text-blue-600 hover:text-blue-700 ml-1">support@zellax.com</a>.
            </p>

            <h2>Security</h2>
            <p>
              We take data security seriously. When you submit sensitive information through our Site, it is protected 
              both online and offline.
            </p>
            <p>
              Whenever we collect sensitive data (such as trade entries or account details), this information is 
              encrypted during transmission using industry-standard security protocols.
            </p>
            <p>
              Access to your information is restricted to employees or contractors who need it to perform a specific 
              task (for example, customer support). The computers and servers on which we store personally identifiable 
              information are kept in a secure environment.
            </p>
            <p>
              Despite our best efforts, please note that no method of electronic storage or transmission over the 
              Internet is 100% secure. However, we continually strive to implement and maintain reasonable, commercially 
              acceptable security procedures to protect your information.
            </p>

            <h2>Data Retention</h2>
            <p>
              We retain your personal information only for as long as necessary to provide you with our Services and 
              as described in this Privacy Policy. We will retain and use your information to the extent necessary to 
              comply with our legal obligations, resolve disputes, and enforce our agreements.
            </p>

            <h2>International Data Transfers</h2>
            <p>
              Your information may be transferred to and maintained on computers located outside of your state, province, 
              country, or other governmental jurisdiction where the data protection laws may differ from those of your 
              jurisdiction. We ensure that such transfers are conducted in accordance with applicable data protection laws.
            </p>

            <h2>Children's Privacy</h2>
            <p>
              Our Service is not intended for use by children under the age of 13. We do not knowingly collect personally 
              identifiable information from children under 13. If you become aware that a child has provided us with 
              personal information, please contact us and we will take steps to remove such information.
            </p>

            <h2>Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
              Privacy Policy on this page and updating the "effective date" at the top of this Privacy Policy.
            </p>
            <p>
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy 
              are effective when they are posted on this page.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, believe that we are not abiding by it, or wish to 
              exercise any data rights, please contact us immediately at 
              <a href="mailto:support@zellax.com" className="text-blue-600 hover:text-blue-700 ml-1">support@zellax.com</a>.
            </p>
          </div>

          {/* Contact Section */}
          <div className="mt-12 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <Database className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Data Protection Officer</h3>
            </div>
            <p className="text-gray-600 mb-4">
              If you have specific questions about how we handle your data or want to exercise your privacy rights, 
              our Data Protection Officer is here to help.
            </p>
            <a
              href="mailto:privacy@zellax.com"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              <Mail className="h-4 w-4 mr-2" />
              Contact Privacy Team
            </a>
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Security Features</h2>
            <p className="text-xl text-gray-600">How we keep your data safe</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Lock className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AES-256 Encryption</h3>
              <p className="text-sm text-gray-600">Military-grade encryption for all data</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Secure Servers</h3>
              <p className="text-sm text-gray-600">Enterprise-grade server infrastructure</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <UserCheck className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Access Controls</h3>
              <p className="text-sm text-gray-600">Strict employee access policies</p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Database className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Regular Backups</h3>
              <p className="text-sm text-gray-600">Automated secure data backups</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Privacy;