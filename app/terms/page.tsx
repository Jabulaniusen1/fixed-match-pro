import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-50">
      <div className="container mx-auto px-4 py-8 lg:py-16 max-w-4xl">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Terms & Conditions — Fixed Match Pro</h1>
        <p className="text-sm text-gray-600 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

        <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
          <section>
            <p className="text-base lg:text-lg leading-relaxed">
              Welcome to Fixed Match Pro. By accessing or using our website, mobile app, or any of our services ("Services"), you agree to comply with and be bound by the following Terms & Conditions. Please read these terms carefully before using our platform.
            </p>
            <p className="text-base lg:text-lg leading-relaxed font-semibold mt-4">
              If you do not agree to these terms, do not use Fixed Match Pro.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e3a8a] mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-base lg:text-lg leading-relaxed">
              By creating an account, subscribing to any plan, accessing predictions, or using any feature on Fixed Match Pro, you acknowledge that you have read, understood, and agree to these Terms & Conditions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e3a8a] mt-8 mb-4">2. Eligibility</h2>
            <p className="text-base lg:text-lg leading-relaxed mb-4">To use Fixed Match Pro, you must:</p>
            <ul className="list-disc list-inside space-y-2 text-base lg:text-lg ml-4">
              <li>Be at least 18 years old (or the legal betting age in your country).</li>
              <li>Agree to use the platform responsibly.</li>
              <li>Not use the service for any illegal activity.</li>
            </ul>
            <p className="text-base lg:text-lg leading-relaxed mt-4">
              Fixed Match Pro is not a betting company. We provide analytical data and football predictions — NOT gambling services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e3a8a] mt-8 mb-4">3. Nature of Service</h2>
            <p className="text-base lg:text-lg leading-relaxed mb-4">Fixed Match Pro offers:</p>
            <ul className="list-disc list-inside space-y-2 text-base lg:text-lg ml-4">
              <li>Football predictions</li>
              <li>Statistical analysis</li>
              <li>Expert insights</li>
              <li>Premium VIP subscription plans</li>
              <li>Digital content and tools for betting guidance</li>
            </ul>
            <p className="text-base lg:text-lg leading-relaxed mt-4">
              All content is informational and not guaranteed. Fixed Match Pro is not responsible for losses incurred from using our predictions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e3a8a] mt-8 mb-4">4. Account Registration</h2>
            <p className="text-base lg:text-lg leading-relaxed mb-4">
              To access premium features, users must create an account and provide accurate, up-to-date information.
            </p>
            <p className="text-base lg:text-lg leading-relaxed mb-4">Users are responsible for:</p>
            <ul className="list-disc list-inside space-y-2 text-base lg:text-lg ml-4">
              <li>Keeping login details secure</li>
              <li>Preventing unauthorized access</li>
              <li>All activities conducted under their account</li>
            </ul>
            <p className="text-base lg:text-lg leading-relaxed mt-4">
              Fixed Match Pro may suspend or terminate accounts that violate our rules or security standards.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e3a8a] mt-8 mb-4">5. Subscription & Payment</h2>
            <p className="text-base lg:text-lg leading-relaxed mb-4">By purchasing any VIP or premium plan, you agree that:</p>
            <ul className="list-disc list-inside space-y-2 text-base lg:text-lg ml-4">
              <li>All payments are final after predictions are unlocked or accessed</li>
              <li>Subscriptions run for the stated duration (1 week or 1 month)</li>
              <li>Fixed Match Pro may use third-party payment processors</li>
              <li>Prices may vary by country or currency</li>
              <li>Access begins immediately after payment confirmation</li>
            </ul>
            <p className="text-base lg:text-lg leading-relaxed mt-4">
              Fixed Match Pro reserves the right to adjust plan prices or modify plan features when necessary.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e3a8a] mt-8 mb-4">6. No Guarantee of Results</h2>
            <p className="text-base lg:text-lg leading-relaxed mb-4">
              While Fixed Match Pro uses expert analysis and advanced data systems, football outcomes are unpredictable.
            </p>
            <p className="text-base lg:text-lg leading-relaxed mb-4">We do not guarantee:</p>
            <ul className="list-disc list-inside space-y-2 text-base lg:text-lg ml-4">
              <li>100% winning</li>
              <li>Profit</li>
              <li>Accuracy for every prediction</li>
              <li>The outcome of any match</li>
            </ul>
            <p className="text-base lg:text-lg leading-relaxed mt-4 font-semibold">
              Users bet at their own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e3a8a] mt-8 mb-4">7. Restrictions on Use</h2>
            <p className="text-base lg:text-lg leading-relaxed mb-4">Users agree NOT to:</p>
            <ul className="list-disc list-inside space-y-2 text-base lg:text-lg ml-4">
              <li>Share predictions publicly or privately</li>
              <li>Resell or redistribute our content</li>
              <li>Copy, record, or reproduce premium predictions</li>
              <li>Reverse-engineer or tamper with any part of the platform</li>
              <li>Use bots, auto-scripts, or scraping tools</li>
              <li>Use Fixed Match Pro for illegal betting activity</li>
            </ul>
            <p className="text-base lg:text-lg leading-relaxed mt-4">
              Violation of these restrictions can result in account termination without refund.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e3a8a] mt-8 mb-4">8. Intellectual Property</h2>
            <p className="text-base lg:text-lg leading-relaxed">
              All content on Fixed Match Pro — including predictions, data, design, logos, text, charts, dashboards, and branding — is owned by Fixed Match Pro. Users receive access rights only, not ownership. Unauthorized use or reproduction is prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e3a8a] mt-8 mb-4">9. Accuracy, Updates & Availability</h2>
            <p className="text-base lg:text-lg leading-relaxed mb-4">Fixed Match Pro strives to provide timely and accurate updates. However, we do NOT guarantee that:</p>
            <ul className="list-disc list-inside space-y-2 text-base lg:text-lg ml-4">
              <li>Predictions will always be available</li>
              <li>The platform will be free from errors</li>
              <li>Services won't experience downtime</li>
              <li>Updates will arrive at a specific time</li>
            </ul>
            <p className="text-base lg:text-lg leading-relaxed mt-4">
              We may update or modify predictions or features when necessary.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e3a8a] mt-8 mb-4">10. Refund Policy</h2>
            <p className="text-base lg:text-lg leading-relaxed">
              Fixed Match Pro follows a strict Refund Policy. By using our platform, you acknowledge and accept the refund rules outlined in our <a href="/refund" className="text-[#1e3a8a] hover:underline">Refund Policy page</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e3a8a] mt-8 mb-4">11. Account Suspension & Termination</h2>
            <p className="text-base lg:text-lg leading-relaxed mb-4">We may suspend or terminate accounts for:</p>
            <ul className="list-disc list-inside space-y-2 text-base lg:text-lg ml-4">
              <li>Fraudulent activity</li>
              <li>Abusive behavior</li>
              <li>Sharing premium content</li>
              <li>Chargebacks or payment dispute abuse</li>
              <li>Violating our Terms & Conditions</li>
              <li>Threatening our staff or platform stability</li>
            </ul>
            <p className="text-base lg:text-lg leading-relaxed mt-4">
              Terminated accounts are not eligible for refunds.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e3a8a] mt-8 mb-4">12. Disclaimer</h2>
            <p className="text-base lg:text-lg leading-relaxed">
              Fixed Match Pro does not provide betting, gambling, or financial services. All predictions and insights are informational only. Users accept full responsibility for any betting decisions made using our predictions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e3a8a] mt-8 mb-4">13. Limitation of Liability</h2>
            <p className="text-base lg:text-lg leading-relaxed mb-4">Fixed Match Pro is not liable for:</p>
            <ul className="list-disc list-inside space-y-2 text-base lg:text-lg ml-4">
              <li>Betting losses</li>
              <li>Financial losses</li>
              <li>Errors in predictions</li>
              <li>Damages from using or inability to use our platform</li>
              <li>Payment failures caused by banks, networks, or third-party processors</li>
            </ul>
            <p className="text-base lg:text-lg leading-relaxed mt-4">
              To the maximum extent permitted by law, Fixed Match Pro's liability is limited to the amount you paid for your subscription.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e3a8a] mt-8 mb-4">14. Privacy & Data Protection</h2>
            <p className="text-base lg:text-lg leading-relaxed">
              By using Fixed Match Pro, you agree to our <a href="/privacy" className="text-[#1e3a8a] hover:underline">Privacy Policy</a>. We collect and protect your data as outlined in our Privacy Policy page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e3a8a] mt-8 mb-4">15. Changes to Terms</h2>
            <p className="text-base lg:text-lg leading-relaxed">
              Fixed Match Pro may update these Terms & Conditions at any time. Changes become effective immediately upon posting on the platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e3a8a] mt-8 mb-4">16. Contact Information</h2>
            <p className="text-base lg:text-lg leading-relaxed mb-4">For questions or concerns:</p>
            <ul className="list-none space-y-2 text-base lg:text-lg">
              <li>📩 Support Email: <a href="mailto:fixedmatchpro@gmail.com" className="text-[#1e3a8a] hover:underline">fixedmatchpro@gmail.com</a></li>
            </ul>
          </section>
        </div>
      </div>
      </main>
      <Footer />
    </div>
  )
}

