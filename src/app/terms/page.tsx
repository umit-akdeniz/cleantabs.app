import Logo from '@/components/Logo';
import Link from 'next/link';
import AdvancedNav from '@/components/AdvancedNav';
import LandingFooter from '@/components/LandingFooter';

export default function Terms() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <AdvancedNav />
      <div className="container mx-auto px-4 py-16 pt-24 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Terms of Service
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Effective Date: January 1, 2024 | Last Updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">1. Acceptance of Terms</h2>
            <p className="text-slate-900 dark:text-slate-300">
              By accessing or using CleanTabs (&quot;Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). 
              If you disagree with any part of these terms, then you may not access the Service. 
              These Terms constitute a legally binding agreement between you and CleanTabs Inc. (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">2. Description of Service</h2>
            <p className="text-slate-900 dark:text-slate-300">
              CleanTabs is a web-based bookmark organization and management platform that allows users to organize, 
              categorize, and sync their bookmarks across devices. We offer both free and premium subscription tiers 
              with varying features and usage limits.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">3. User Accounts and Registration</h2>
            
            <h3 className="text-xl font-medium mb-3 text-slate-800 dark:text-slate-200">Account Creation</h3>
            <ul className="list-disc pl-6 text-slate-900 dark:text-slate-300">
              <li>You must be at least 13 years old to create an account</li>
              <li>You must provide accurate, complete, and current information</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials</li>
              <li>You must not create multiple accounts for the same person</li>
              <li>You must notify us immediately of any unauthorized use of your account</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-slate-800 dark:text-slate-200">Account Responsibility</h3>
            <p className="text-slate-900 dark:text-slate-300">
              You are solely responsible for all activities that occur under your account. We reserve the right to 
              terminate accounts that violate these Terms or engage in harmful activities.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">4. Acceptable Use Policy</h2>
            
            <h3 className="text-xl font-medium mb-3 text-slate-800 dark:text-slate-200">Permitted Uses</h3>
            <p className="text-slate-900 dark:text-slate-300">You may use our Service for legitimate personal or business purposes in accordance with these Terms.</p>

            <h3 className="text-xl font-medium mb-3 text-slate-800 dark:text-slate-200">Prohibited Activities</h3>
            <p className="text-slate-900 dark:text-slate-300">You agree NOT to:</p>
            <ul className="list-disc pl-6 text-slate-900 dark:text-slate-300">
              <li>Use the Service for any unlawful purpose or in violation of applicable laws</li>
              <li>Store, link to, or distribute illegal, harmful, defamatory, or offensive content</li>
              <li>Attempt to gain unauthorized access to our systems or other users&apos; accounts</li>
              <li>Use automated systems (bots, scripts) to access or use the Service</li>
              <li>Reverse engineer, decompile, or attempt to extract source code</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Violate the privacy or intellectual property rights of others</li>
              <li>Resell, redistribute, or commercially exploit the Service without authorization</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">5. Subscription Plans and Billing</h2>
            
            <h3 className="text-xl font-medium mb-3 text-slate-800 dark:text-slate-200">Free Plan</h3>
            <ul className="list-disc pl-6 text-slate-900 dark:text-slate-300">
              <li>Limited to 1,000 bookmarks</li>
              <li>Basic organization features</li>
              <li>Standard support</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-slate-800 dark:text-slate-200">Premium Plan</h3>
            <ul className="list-disc pl-6 text-slate-900 dark:text-slate-300">
              <li>Unlimited bookmarks</li>
              <li>Advanced features and AI-powered organization</li>
              <li>Priority support</li>
              <li>Monthly billing at $9.99/month</li>
              <li>Annual billing at $99.99/year (2 months free)</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-slate-800 dark:text-slate-200">Billing Terms</h3>
            <ul className="list-disc pl-6 text-slate-900 dark:text-slate-300">
              <li>All payments are processed securely through Stripe</li>
              <li>Subscriptions automatically renew unless cancelled</li>
              <li>Prices are subject to change with 30 days&apos; notice</li>
              <li>Refunds are available within 30 days of payment</li>
              <li>Failure to pay may result in account suspension</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">6. Cancellation and Refunds</h2>
            <ul className="list-disc pl-6 text-slate-900 dark:text-slate-300">
              <li>You may cancel your subscription at any time through your account settings</li>
              <li>Cancellation takes effect at the end of the current billing period</li>
              <li>No refunds for partial billing periods unless required by law</li>
              <li>Free accounts may be terminated at any time</li>
              <li>We may offer prorated refunds at our discretion</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">7. Privacy and Data Protection</h2>
            <p className="text-slate-900 dark:text-slate-300">
              Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information. 
              By using our Service, you agree to the collection and use of information in accordance with our Privacy Policy.
            </p>
            <ul className="list-disc pl-6 text-slate-900 dark:text-slate-300">
              <li>You retain ownership of your bookmark data</li>
              <li>We implement industry-standard security measures</li>
              <li>You can export your data at any time</li>
              <li>Data is deleted within 30 days of account closure</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">8. Intellectual Property Rights</h2>
            
            <h3 className="text-xl font-medium mb-3 text-slate-800 dark:text-slate-200">Our Rights</h3>
            <p className="text-slate-900 dark:text-slate-300">
              The Service and its original content, features, and functionality are and will remain the exclusive property of 
              CleanTabs Inc. and its licensors. The Service is protected by copyright, trademark, and other laws.
            </p>

            <h3 className="text-xl font-medium mb-3 text-slate-800 dark:text-slate-200">Your Rights</h3>
            <p className="text-slate-900 dark:text-slate-300">
              You retain all rights to your user content (bookmarks, notes, categories). By using our Service, 
              you grant us a non-exclusive, worldwide, royalty-free license to use, modify, and display your content 
              solely for the purpose of providing the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">9. Service Availability and Modifications</h2>
            <ul className="list-disc pl-6 text-slate-900 dark:text-slate-300">
              <li>We strive for 99.9% uptime but do not guarantee uninterrupted service</li>
              <li>We may perform scheduled maintenance with advance notice</li>
              <li>We reserve the right to modify or discontinue features</li>
              <li>We may implement emergency updates for security purposes</li>
              <li>Service availability may vary by geographic location</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">10. Disclaimers and Limitation of Liability</h2>
            
            <h3 className="text-xl font-medium mb-3 text-slate-800 dark:text-slate-200">Service Disclaimer</h3>
            <p className="text-slate-900 dark:text-slate-300">
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT ANY WARRANTIES OF ANY KIND, 
              EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, 
              FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>

            <h3 className="text-xl font-medium mb-3 text-slate-800 dark:text-slate-200">Limitation of Liability</h3>
            <p className="text-slate-900 dark:text-slate-300">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL CLEANTABS INC. BE LIABLE FOR ANY 
              INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO 
              LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR USE OF THE SERVICE.
            </p>
            <p className="text-slate-900 dark:text-slate-300 mt-4">
              Our total liability to you for any damages arising from these Terms or your use of the Service 
              shall not exceed the amount you paid us in the twelve (12) months preceding the claim.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">11. Indemnification</h2>
            <p className="text-slate-900 dark:text-slate-300">
              You agree to indemnify, defend, and hold harmless CleanTabs Inc., its officers, directors, employees, 
              and agents from and against any claims, damages, obligations, losses, liabilities, costs, or debt, 
              and expenses (including attorney&apos;s fees) arising from your use of the Service or violation of these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">12. Termination</h2>
            <ul className="list-disc pl-6 text-slate-900 dark:text-slate-300">
              <li>Either party may terminate this agreement at any time</li>
              <li>We may terminate your account for violation of these Terms</li>
              <li>Upon termination, your right to use the Service ceases immediately</li>
              <li>We will provide 30 days&apos; notice before termination unless immediate termination is necessary</li>
              <li>Termination does not affect provisions that should survive termination</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">13. Governing Law and Dispute Resolution</h2>
            <p className="text-slate-900 dark:text-slate-300">
              These Terms are governed by the laws of the State of California, United States, without regard to 
              conflict of law principles. Any disputes arising from these Terms or your use of the Service shall be 
              resolved through binding arbitration in San Francisco, California, except for injunctive relief which 
              may be sought in any court of competent jurisdiction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">14. Changes to Terms</h2>
            <p className="text-slate-900 dark:text-slate-300">
              We reserve the right to modify these Terms at any time. We will provide notice of material changes:
            </p>
            <ul className="list-disc pl-6 text-slate-900 dark:text-slate-300">
              <li>By posting the updated Terms on our website</li>
              <li>By sending email notification to registered users</li>
              <li>By displaying a notice in the Service</li>
            </ul>
            <p className="text-slate-900 dark:text-slate-300 mt-4">
              Your continued use of the Service after any changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">15. Contact Information</h2>
            <p className="text-slate-900 dark:text-slate-300">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <p className="text-slate-900 dark:text-slate-100"><strong>Email:</strong> legal@cleantabs.app</p>
              <p className="text-slate-900 dark:text-slate-100"><strong>Address:</strong> CleanTabs Inc., 1234 Tech Street, San Francisco, CA 94107, USA</p>
              <p className="text-slate-900 dark:text-slate-100"><strong>Phone:</strong> +1 (555) 123-4567</p>
            </div>
          </section>
        </div>

      </div>
      <LandingFooter />
    </div>
  );
}