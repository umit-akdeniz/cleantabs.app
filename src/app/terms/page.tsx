import Logo from '@/components/Logo';
import Link from 'next/link';

export default function Terms() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Logo size="xl" />
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mt-8 mb-4">
            Terms of Service
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
            <p>
              By accessing and using CleanTabs, you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Service Description</h2>
            <p>
              CleanTabs is a web-based bookmark organization and management service that helps users organize their digital workspace. 
              We provide both free and premium subscription plans with varying features and limitations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">User Accounts</h2>
            <ul className="list-disc pl-6">
              <li>You must provide accurate and complete information when creating an account</li>
              <li>You are responsible for maintaining the security of your account credentials</li>
              <li>You must not share your account with others</li>
              <li>You must notify us immediately of any unauthorized use of your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Acceptable Use</h2>
            <h3 className="text-xl font-medium mb-3">You agree NOT to:</h3>
            <ul className="list-disc pl-6">
              <li>Use the service for any illegal or unauthorized purpose</li>
              <li>Store or link to illegal, harmful, or offensive content</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use automated tools to spam or overload our service</li>
              <li>Reverse engineer or attempt to extract our source code</li>
              <li>Resell or redistribute our service without permission</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Subscription and Payment</h2>
            <ul className="list-disc pl-6">
              <li>Premium subscriptions are billed monthly at $9.99/month</li>
              <li>All payments are processed securely through Stripe</li>
              <li>Subscriptions auto-renew unless cancelled</li>
              <li>You can cancel your subscription at any time</li>
              <li>No refunds for partial months</li>
              <li>Free accounts have usage limitations as specified</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Data and Privacy</h2>
            <ul className="list-disc pl-6">
              <li>You retain ownership of your bookmarks and data</li>
              <li>We will not share your personal data without consent</li>
              <li>You can export or delete your data at any time</li>
              <li>We use industry-standard security measures</li>
              <li>See our Privacy Policy for detailed information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Service Availability</h2>
            <ul className="list-disc pl-6">
              <li>We strive for 99.9% uptime but cannot guarantee uninterrupted service</li>
              <li>We may perform maintenance that temporarily affects availability</li>
              <li>We reserve the right to modify or discontinue features</li>
              <li>Critical security updates may be applied without notice</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
            <p className="mb-4">
              To the maximum extent permitted by law, CleanTabs shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages, including without limitation, 
              loss of profits, data, use, goodwill, or other intangible losses.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Termination</h2>
            <ul className="list-disc pl-6">
              <li>You may terminate your account at any time</li>
              <li>We may terminate accounts that violate these terms</li>
              <li>Upon termination, your data will be deleted within 30 days</li>
              <li>Premium subscriptions can be cancelled without penalty</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will notify users of significant changes 
              via email or service notifications. Continued use of the service constitutes acceptance of modified terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <p><strong>Email:</strong> legal@cleantabs.com</p>
              <p><strong>Address:</strong> [Your Business Address]</p>
            </div>
          </section>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to CleanTabs
          </Link>
        </div>
      </div>
    </div>
  );
}