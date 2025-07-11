import Logo from '@/components/Logo';
import Link from 'next/link';
import AdvancedNav from '@/components/AdvancedNav';
import LandingFooter from '@/components/LandingFooter';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <AdvancedNav />
      <div className="container mx-auto px-4 py-16 pt-24 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Privacy Policy
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Effective Date: January 1, 2024 | Last Updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">1. Information We Collect</h2>
            
            <h3 className="text-xl font-medium mb-3 text-slate-800 dark:text-slate-200">Personal Information</h3>
            <p className="text-slate-900 dark:text-slate-300">
              We collect information you provide directly to us when you create an account, use our services, or communicate with us:
            </p>
            <ul className="list-disc pl-6 mb-4 text-slate-900 dark:text-slate-300">
              <li><strong>Account Information:</strong> Name, email address, password</li>
              <li><strong>Profile Information:</strong> Optional profile photo, preferences</li>
              <li><strong>User Content:</strong> Bookmarks, categories, notes, and organizational data you create</li>
              <li><strong>Communication:</strong> Messages sent to customer support</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-slate-800 dark:text-slate-200">Automatically Collected Information</h3>
            <ul className="list-disc pl-6 text-slate-900 dark:text-slate-300">
              <li><strong>Device Information:</strong> Device type, operating system, browser type and version</li>
              <li><strong>Usage Data:</strong> Pages visited, features used, time spent on service</li>
              <li><strong>Log Data:</strong> IP address, access times, error logs</li>
              <li><strong>Cookies:</strong> Authentication tokens, preferences, analytics data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">2. How We Use Your Information</h2>
            <p className="text-slate-900 dark:text-slate-300">We use the information we collect to:</p>
            <ul className="list-disc pl-6 text-slate-900 dark:text-slate-300">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices, updates, and security alerts</li>
              <li>Respond to your comments and questions</li>
              <li>Analyze usage patterns to enhance user experience</li>
              <li>Detect, investigate, and prevent fraudulent activities</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">3. Information Sharing and Disclosure</h2>
            <p className="text-slate-900 dark:text-slate-300">
              We do not sell, trade, or otherwise transfer your personal information to third parties except as described below:
            </p>
            
            <h3 className="text-xl font-medium mb-3 text-slate-800 dark:text-slate-200">Service Providers</h3>
            <p className="text-slate-900 dark:text-slate-300">
              We may share information with trusted third-party service providers who assist us in operating our service:
            </p>
            <ul className="list-disc pl-6 text-slate-900 dark:text-slate-300">
              <li><strong>Stripe:</strong> Payment processing (PCI DSS compliant)</li>
              <li><strong>Vercel:</strong> Hosting and infrastructure</li>
              <li><strong>Google Analytics:</strong> Usage analytics (anonymized)</li>
              <li><strong>Email Service Providers:</strong> Transactional emails</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-slate-800 dark:text-slate-200">Legal Requirements</h3>
            <p className="text-slate-900 dark:text-slate-300">
              We may disclose your information if required by law or in response to valid requests by public authorities.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">4. Data Security</h2>
            <p className="mb-4 text-slate-900 dark:text-slate-300">
              We implement appropriate technical and organizational measures to protect your personal information:
            </p>
            <ul className="list-disc pl-6 text-slate-900 dark:text-slate-300">
              <li><strong>Encryption:</strong> Data in transit (TLS 1.3) and at rest (AES-256)</li>
              <li><strong>Access Controls:</strong> Role-based access with multi-factor authentication</li>
              <li><strong>Regular Audits:</strong> Security assessments and penetration testing</li>
              <li><strong>Incident Response:</strong> Procedures for data breach notification</li>
              <li><strong>Data Minimization:</strong> We collect only necessary information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">5. Your Rights and Choices</h2>
            <p className="text-slate-900 dark:text-slate-300">
              Under applicable data protection laws (including GDPR, CCPA), you have the following rights:
            </p>
            <ul className="list-disc pl-6 text-slate-900 dark:text-slate-300">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
              <li><strong>Erasure:</strong> Request deletion of your personal data</li>
              <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
              <li><strong>Restriction:</strong> Limit processing of your data</li>
              <li><strong>Objection:</strong> Object to processing based on legitimate interests</li>
              <li><strong>Withdraw Consent:</strong> Revoke consent for data processing</li>
            </ul>
            <p className="text-slate-900 dark:text-slate-300 mt-4">
              To exercise these rights, contact us at <strong>privacy@cleantabs.app</strong>. We will respond within 30 days.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">6. Data Retention</h2>
            <p className="text-slate-900 dark:text-slate-300">
              We retain your personal information only as long as necessary for the purposes outlined in this policy:
            </p>
            <ul className="list-disc pl-6 text-slate-900 dark:text-slate-300">
              <li><strong>Account Data:</strong> Retained while your account is active</li>
              <li><strong>User Content:</strong> Retained until you delete it or close your account</li>
              <li><strong>Log Data:</strong> Retained for 12 months for security and analytics</li>
              <li><strong>Financial Records:</strong> Retained for 7 years for tax and legal compliance</li>
            </ul>
            <p className="text-slate-900 dark:text-slate-300 mt-4">
              Upon account deletion, we will delete your personal data within 30 days, except where retention is required by law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">7. International Data Transfers</h2>
            <p className="text-slate-900 dark:text-slate-300">
              Your information may be transferred to and processed in countries other than your country of residence. 
              We ensure appropriate safeguards are in place, including Standard Contractual Clauses approved by the European Commission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">8. Children&apos;s Privacy</h2>
            <p className="text-slate-900 dark:text-slate-300">
              Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. 
              If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">9. Changes to This Policy</h2>
            <p className="text-slate-900 dark:text-slate-300">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by:
            </p>
            <ul className="list-disc pl-6 text-slate-900 dark:text-slate-300">
              <li>Posting the updated policy on our website</li>
              <li>Sending an email notification to registered users</li>
              <li>Displaying a prominent notice in our service</li>
            </ul>
            <p className="text-slate-900 dark:text-slate-300 mt-4">
              Your continued use of our service after any changes indicates your acceptance of the updated policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">10. Contact Information</h2>
            <p className="text-slate-900 dark:text-slate-300">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <p className="text-slate-900 dark:text-slate-100"><strong>Email:</strong> privacy@cleantabs.app</p>
              <p className="text-slate-900 dark:text-slate-100"><strong>Address:</strong> CleanTabs Inc., 1234 Tech Street, San Francisco, CA 94107, USA</p>
              <p className="text-slate-900 dark:text-slate-100"><strong>Data Protection Officer:</strong> dpo@cleantabs.app</p>
            </div>
            <p className="text-slate-900 dark:text-slate-300 mt-4">
              <strong>For EU residents:</strong> You have the right to lodge a complaint with your local data protection authority.
            </p>
          </section>
        </div>

      </div>
      <LandingFooter />
    </div>
  );
}