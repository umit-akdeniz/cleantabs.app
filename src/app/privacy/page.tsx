import Logo from '@/components/Logo';
import Link from 'next/link';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Logo size="xl" />
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mt-8 mb-4">
            Privacy Policy
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <p>
              CleanTabs ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            
            <h3 className="text-xl font-medium mb-3">Personal Information</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Email address (required for account creation)</li>
              <li>Name (optional, for personalization)</li>
              <li>Profile picture (if you sign up with Google/GitHub)</li>
            </ul>

            <h3 className="text-xl font-medium mb-3">Usage Data</h3>
            <ul className="list-disc pl-6">
              <li>Websites you bookmark and organize</li>
              <li>Categories and notes you create</li>
              <li>Usage patterns and preferences</li>
              <li>Technical data (IP address, browser type, device information)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            <ul className="list-disc pl-6">
              <li>Provide and maintain our service</li>
              <li>Process your subscription payments</li>
              <li>Send important service notifications</li>
              <li>Improve our service and user experience</li>
              <li>Provide customer support</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <p className="mb-4">We implement industry-standard security measures to protect your data:</p>
            <ul className="list-disc pl-6">
              <li>End-to-end encryption for sensitive data</li>
              <li>Secure HTTPS connections</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication</li>
              <li>Secure payment processing through Stripe</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
            <p className="mb-4">We use the following trusted third-party services:</p>
            <ul className="list-disc pl-6">
              <li><strong>Stripe:</strong> For secure payment processing</li>
              <li><strong>Google/GitHub:</strong> For optional OAuth authentication</li>
              <li><strong>Vercel:</strong> For hosting and content delivery</li>
              <li><strong>Supabase:</strong> For secure database hosting</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Your Rights (GDPR Compliance)</h2>
            <ul className="list-disc pl-6">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct your information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and data</li>
              <li><strong>Portability:</strong> Export your data in a standard format</li>
              <li><strong>Withdrawal:</strong> Withdraw consent for data processing</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Data Retention</h2>
            <p>
              We retain your personal data only as long as necessary to provide our service or as required by law. 
              When you delete your account, we will permanently delete your data within 30 days.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <p><strong>Email:</strong> privacy@cleantabs.com</p>
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