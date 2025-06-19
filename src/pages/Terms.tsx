import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Mail, Shield, AlertCircle } from 'lucide-react';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="h-4 w-4 mr-2" />
            Legal Information
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-xl text-blue-100">
            Last updated: June 19, 2025
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Important Notice</h3>
                <p className="text-blue-800">
                  We highly value your feedback on these Terms of Service. For any comments or questions, 
                  please email us at <a href="mailto:support@zellax.com" className="underline font-medium">support@zellax.com</a>.
                </p>
              </div>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2>1. User's Acknowledgment and Acceptance of Terms</h2>
            <p>
              ZellaX LLC ("ZellaX", "we", "us", or "our") provides the ZellaX site and various related services 
              (collectively, the "Site") to you, the user, subject to your acceptance and compliance with all the 
              terms, conditions, and notices stated herein (the "Terms of Service"), as well as any other written 
              agreements between you and ZellaX.
            </p>
            <p>
              By using this Site, you agree to be bound by these Terms of Service. If you do not wish to be bound 
              by these Terms, please do not access or use this Site. Your continued use of the Site constitutes your 
              acceptance of these Terms and any updates we may make from time to time.
            </p>
            <p>
              These Terms are effective as of June 19, 2025. ZellaX reserves the right to modify these Terms at any 
              time without prior notice. It is your responsibility to review these Terms periodically for changes. 
              Continued use of the Site after changes have been posted means you accept and agree to the modifications.
            </p>

            <h2>2. Description of Services</h2>
            <p>
              ZellaX offers a suite of tools and resources including but not limited to trade journaling, trade tracking, 
              performance analytics, educational content, and community interaction features. Users are responsible for 
              providing their own internet access and compatible devices to use our services.
            </p>
            <p>
              We reserve the right to modify, suspend, or discontinue any part of the Site or Services at any time 
              without notice. We shall not be liable to you or any third party for any modification, suspension, or 
              discontinuance of any part of the Site.
            </p>

            <h2>3. Registration Data and Privacy</h2>
            <p>
              Access to certain Site features requires creating an account. You agree to provide truthful, current, 
              and complete information during registration and to keep this information updated.
            </p>
            <p>
              Your personal data will be handled according to our <Link to="/privacy" className="text-blue-600 hover:text-blue-700">Privacy Policy</Link>. 
              By using our Site, you consent to such processing.
            </p>

            <h2>4. Conduct on Site</h2>
            <p>By using this Site, you agree to adhere to all applicable laws and agree not to:</p>
            <ul>
              <li>Post or share unlawful, harmful, abusive, defamatory, obscene, or otherwise objectionable content</li>
              <li>Violate intellectual property rights or proprietary rights of others</li>
              <li>Transmit unsolicited advertising or spam</li>
              <li>Upload viruses or malicious code</li>
              <li>Impersonate any person or entity</li>
              <li>Harass or harm other users</li>
            </ul>
            <p>
              We reserve the right to monitor user content and remove any material that violates these Terms, 
              at our sole discretion.
            </p>

            <h2>5. Subscription & Billing</h2>
            <p>
              ZellaX offers both free and paid subscription plans. Paid subscriptions are billed in advance and are 
              non-refundable. It is the user's responsibility to manage or cancel subscriptions before renewal. 
              All payments are final.
            </p>

            <h2>6. Third-Party Links and Content</h2>
            <p>
              The Site may contain links to third-party websites. ZellaX does not control and is not responsible for 
              such sites' content, privacy policies, or practices. Access third-party sites at your own risk.
            </p>

            <h2>7. Intellectual Property</h2>
            <p>
              All content on ZellaX, including text, graphics, logos, software, and trademarks, is the property of 
              ZellaX or its licensors and is protected by intellectual property laws. You may not reproduce, distribute, 
              or exploit any content without express written consent from ZellaX.
            </p>

            <h2>8. Accuracy of Information</h2>
            <p>
              Information on ZellaX is provided for educational and informational purposes only and should not be 
              relied upon for investment decisions. While we strive for accuracy, we do not guarantee that the 
              information is complete, accurate, or up-to-date.
            </p>

            <h2>9. Investment Disclaimer</h2>
            <p>
              ZellaX does not offer financial or investment advice. All trades and investments are at your own risk. 
              Consult a licensed financial advisor before making any financial decisions. ZellaX and its contributors 
              are not responsible for any losses incurred.
            </p>

            <h2>10. User-Generated Content</h2>
            <p>
              By submitting content (including trade data, comments, or other materials), you grant ZellaX a worldwide, 
              non-exclusive, royalty-free, perpetual license to use, reproduce, modify, adapt, publish, translate, 
              distribute, and display your content in connection with operating and promoting ZellaX.
            </p>
            <p>
              You warrant that you have the necessary rights to grant us this license and that your content does not 
              violate any third-party rights.
            </p>

            <h2>11. Disclaimer of Warranties</h2>
            <p>
              THE SITE AND ALL CONTENT AND SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTY OF ANY KIND, 
              EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. 
              ZELLAX DOES NOT WARRANT THAT THE SITE WILL BE ERROR-FREE OR UNINTERRUPTED.
            </p>

            <h2>12. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, ZELLAX SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, 
              OR CONSEQUENTIAL DAMAGES ARISING FROM YOUR USE OF OR INABILITY TO USE THE SITE OR SERVICES.
            </p>

            <h2>13. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless ZellaX, its affiliates, officers, agents, and employees from any 
              claim or demand, including reasonable attorneys' fees, arising out of your violation of these Terms or your 
              use of the Site.
            </p>

            <h2>14. Account Security</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and for all activities 
              that occur under your account. Notify us immediately if you suspect unauthorized access.
            </p>

            <h2>15. International Use</h2>
            <p>
              ZellaX is operated from the United States. Accessing the Site from locations where its content is illegal 
              is prohibited. You are responsible for compliance with local laws.
            </p>

            <h2>16. Termination</h2>
            <p>
              We may suspend or terminate your access to the Site at any time, with or without notice, for any reason, 
              including breach of these Terms. Upon termination, your right to use the Site will immediately cease.
            </p>

            <h2>17. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed under the laws of the State of Florida, USA, without regard 
              to its conflict of laws principles.
            </p>

            <h2>18. Notices</h2>
            <p>
              All legal notices must be sent to <a href="mailto:support@zellax.com" className="text-blue-600 hover:text-blue-700">support@zellax.com</a>. 
              We may notify you via email or by posting notices on the Site.
            </p>

            <h2>19. Entire Agreement</h2>
            <p>
              These Terms constitute the entire agreement between you and ZellaX and supersede all prior agreements 
              regarding your use of the Site.
            </p>

            <h2>20. Refunds & Cancellations</h2>
            <p>
              ZellaX maintains a no refund policy. All subscription payments are final and non-refundable. It is your 
              responsibility to cancel your subscription before the renewal date to avoid future charges.
            </p>

            <h2>21. Contact Information</h2>
            <p>
              For questions, feedback, or to report any violation of these Terms, please contact 
              <a href="mailto:support@zellax.com" className="text-blue-600 hover:text-blue-700 ml-1">support@zellax.com</a>.
            </p>
          </div>

          {/* Contact Section */}
          <div className="mt-12 bg-gray-50 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Mail className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Questions about these Terms?</h3>
            </div>
            <p className="text-gray-600 mb-4">
              If you have any questions about these Terms of Service or need clarification on any point, 
              we're here to help.
            </p>
            <a
              href="mailto:support@zellax.com"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              <Mail className="h-4 w-4 mr-2" />
              Contact Support
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Terms;