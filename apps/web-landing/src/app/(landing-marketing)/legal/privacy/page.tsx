import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | ContractSpec',
  description:
    'Learn how ContractSpec collects, uses, and protects your personal data in compliance with GDPR.',
};

export default function PrivacyPage() {
  return (
    <main className="flex grow flex-col items-center justify-center pt-24">
      <section className="section-padding">
        <div className="prose prose-invert mx-auto max-w-3xl">
          <h1 className="mb-4 text-4xl font-bold">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">
            Last updated: December 18, 2025
          </p>

          {/* 1. Who We Are */}
          <section className="space-y-4">
            <h2 className="text-foreground text-2xl font-bold">
              1. Who We Are
            </h2>
            <p className="text-muted-foreground">
              <strong className="text-foreground">ContractSpec</strong> is a
              brand of{' '}
              <strong className="text-foreground">CHAMAN VENTURES</strong>, a
              simplified joint-stock company (SASU) registered in France.
            </p>
            <div className="text-muted-foreground rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="mb-2">
                <strong className="text-foreground">Data Controller:</strong>
              </p>
              <ul className="list-none space-y-1 pl-0">
                <li>CHAMAN VENTURES, SASU</li>
                <li>RCS Paris • SIREN 989 498 902</li>
                <li>229 rue Saint-Honoré, 75001 Paris, France</li>
                <li>
                  Contact:{' '}
                  <a
                    href="mailto:privacy@contractspec.io"
                    className="text-primary hover:underline"
                  >
                    privacy@contractspec.io
                  </a>
                </li>
              </ul>
            </div>
            <p className="text-muted-foreground">
              We are responsible for deciding how we hold and use personal data
              about you. We are required under data protection legislation to
              notify you of the information contained in this privacy policy.
            </p>
          </section>

          {/* 2. What This Policy Covers */}
          <section className="mt-10 space-y-4">
            <h2 className="text-foreground text-2xl font-bold">
              2. What This Policy Covers
            </h2>
            <p className="text-muted-foreground">
              This privacy policy explains:
            </p>
            <ul className="text-muted-foreground list-disc space-y-2 pl-6">
              <li>
                What personal data we collect through the ContractSpec website
                and services
              </li>
              <li>Why we collect and process your data</li>
              <li>How we store and protect your data</li>
              <li>Who we may share your data with</li>
              <li>
                Your rights under the General Data Protection Regulation (GDPR)
              </li>
            </ul>
            <p className="text-muted-foreground">
              This policy applies to visitors of our website, users who sign up
              for our waitlist or contact us, and customers who use our
              services.
            </p>
          </section>

          {/* 3. Data We Collect */}
          <section className="mt-10 space-y-4">
            <h2 className="text-foreground text-2xl font-bold">
              3. Data We Collect
            </h2>
            <p className="text-muted-foreground">
              We collect different types of data depending on how you interact
              with ContractSpec:
            </p>

            <div className="overflow-x-auto">
              <table className="text-muted-foreground w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-foreground py-3 pr-4 text-left font-semibold">
                      Category
                    </th>
                    <th className="text-foreground py-3 pr-4 text-left font-semibold">
                      Data Collected
                    </th>
                    <th className="text-foreground py-3 text-left font-semibold">
                      When Collected
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/10">
                    <td className="py-3 pr-4 font-medium">Website Analytics</td>
                    <td className="py-3 pr-4">
                      Page views, click events, device type, browser,
                      approximate location (country level), session duration,
                      referral source
                    </td>
                    <td className="py-3">
                      When browsing our website (with consent in EU/EEA)
                    </td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-3 pr-4 font-medium">
                      Contact / Waitlist
                    </td>
                    <td className="py-3 pr-4">
                      Name, email address, message content
                    </td>
                    <td className="py-3">
                      When you submit a form or join our waitlist
                    </td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-3 pr-4 font-medium">Account Data</td>
                    <td className="py-3 pr-4">
                      <em>Not yet applicable</em> — We do not currently offer
                      user accounts. This section will be updated when accounts
                      are introduced.
                    </td>
                    <td className="py-3">—</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-3 pr-4 font-medium">Billing Data</td>
                    <td className="py-3 pr-4">
                      <em>Not yet applicable</em> — We do not currently process
                      payments. This section will be updated when billing is
                      introduced.
                    </td>
                    <td className="py-3">—</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 4. Why We Process Data */}
          <section className="mt-10 space-y-4">
            <h2 className="text-foreground text-2xl font-bold">
              4. Why We Process Data (Purposes & Legal Bases)
            </h2>
            <p className="text-muted-foreground">
              Under GDPR, we must have a lawful basis for processing your
              personal data. We rely on the following:
            </p>

            <div className="overflow-x-auto">
              <table className="text-muted-foreground w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-foreground py-3 pr-4 text-left font-semibold">
                      Purpose
                    </th>
                    <th className="text-foreground py-3 pr-4 text-left font-semibold">
                      Legal Basis
                    </th>
                    <th className="text-foreground py-3 text-left font-semibold">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/10">
                    <td className="py-3 pr-4 font-medium">
                      Website operation & security
                    </td>
                    <td className="py-3 pr-4">Legitimate interest</td>
                    <td className="py-3">
                      Ensuring our website functions correctly, preventing
                      abuse, and maintaining security
                    </td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-3 pr-4 font-medium">
                      Analytics & improvement
                    </td>
                    <td className="py-3 pr-4">Consent</td>
                    <td className="py-3">
                      Understanding how users interact with our site to improve
                      our services (gated behind consent in EU/EEA)
                    </td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-3 pr-4 font-medium">
                      Responding to enquiries
                    </td>
                    <td className="py-3 pr-4">
                      Legitimate interest / Contract
                    </td>
                    <td className="py-3">
                      Responding to your questions, processing waitlist
                      requests, or pre-contractual discussions
                    </td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-3 pr-4 font-medium">Service delivery</td>
                    <td className="py-3 pr-4">Contract</td>
                    <td className="py-3">
                      If/when you become a customer, processing your data is
                      necessary to fulfil our contractual obligations
                    </td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-3 pr-4 font-medium">Legal compliance</td>
                    <td className="py-3 pr-4">Legal obligation</td>
                    <td className="py-3">
                      Complying with applicable laws, regulations, or legal
                      processes
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 5. Cookies & Tracking */}
          <section className="mt-10 space-y-4">
            <h2 className="text-foreground text-2xl font-bold">
              5. Cookies & Tracking
            </h2>
            <p className="text-muted-foreground">
              We use <strong className="text-foreground">PostHog</strong> for
              product analytics to understand how visitors use our website.
              PostHog may use cookies or similar technologies to collect this
              information.
            </p>

            <h3 className="text-foreground mt-6 text-xl font-semibold">
              Consent in the EU/EEA
            </h3>
            <p className="text-muted-foreground">
              If you are located in the European Union or European Economic
              Area, we gate analytics tracking behind your explicit consent.
              Analytics cookies will not be set until you opt-in through our
              cookie consent mechanism.
            </p>

            <h3 className="text-foreground mt-6 text-xl font-semibold">
              Withdrawing Consent / Opting Out
            </h3>
            <p className="text-muted-foreground">
              You can withdraw consent or opt out at any time:
            </p>
            <ul className="text-muted-foreground list-disc space-y-2 pl-6">
              <li>
                <strong>Cookie settings:</strong> Use the cookie preferences
                link in our website footer to manage your consent
              </li>
              <li>
                <strong>Browser settings:</strong> Configure your browser to
                reject cookies or alert you when cookies are being set
              </li>
              <li>
                <strong>PostHog opt-out:</strong> PostHog respects "Do Not
                Track" browser signals where applicable
              </li>
            </ul>
            <p className="text-muted-foreground">
              Note: Rejecting analytics cookies will not affect your ability to
              use our website.
            </p>
          </section>

          {/* 6. Sub-processors / Recipients */}
          <section className="mt-10 space-y-4">
            <h2 className="text-foreground text-2xl font-bold">
              6. Sub-processors & Recipients
            </h2>
            <p className="text-muted-foreground">
              We share data with the following third-party service providers who
              process data on our behalf:
            </p>

            <div className="overflow-x-auto">
              <table className="text-muted-foreground w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-foreground py-3 pr-4 text-left font-semibold">
                      Provider
                    </th>
                    <th className="text-foreground py-3 pr-4 text-left font-semibold">
                      Purpose
                    </th>
                    <th className="text-foreground py-3 text-left font-semibold">
                      Location
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/10">
                    <td className="py-3 pr-4 font-medium">PostHog</td>
                    <td className="py-3 pr-4">Product analytics</td>
                    <td className="py-3">EU (PostHog Cloud EU) or US</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-3 pr-4 font-medium">Vercel</td>
                    <td className="py-3 pr-4">Website hosting & CDN</td>
                    <td className="py-3">Global (including EU regions)</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-3 pr-4 font-medium">Scaleway</td>
                    <td className="py-3 pr-4">Cloud infrastructure</td>
                    <td className="py-3">France / EU</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-3 pr-4 font-medium">
                      Email provider <em>(TBD)</em>
                    </td>
                    <td className="py-3 pr-4">
                      Transactional & marketing emails
                    </td>
                    <td className="py-3">
                      <em>To be confirmed</em>
                    </td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-3 pr-4 font-medium">
                      Error tracking <em>(TBD)</em>
                    </td>
                    <td className="py-3 pr-4">Application error monitoring</td>
                    <td className="py-3">
                      <em>To be confirmed</em>
                    </td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-3 pr-4 font-medium">
                      Payment processor <em>(TBD)</em>
                    </td>
                    <td className="py-3 pr-4">
                      Billing & subscription management
                    </td>
                    <td className="py-3">
                      <em>To be confirmed</em>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-muted-foreground mt-4">
              We carefully select our sub-processors and require them to
              maintain appropriate security measures and only process data
              according to our instructions.
            </p>
          </section>

          {/* 7. International Transfers */}
          <section className="mt-10 space-y-4">
            <h2 className="text-foreground text-2xl font-bold">
              7. International Data Transfers
            </h2>
            <p className="text-muted-foreground">
              As a France-based company, we aim to keep your data within the
              European Union wherever possible.
            </p>
            <p className="text-muted-foreground">
              However, some of our service providers may process data outside
              the EU/EEA. When this occurs, we ensure appropriate safeguards are
              in place, such as:
            </p>
            <ul className="text-muted-foreground list-disc space-y-2 pl-6">
              <li>
                <strong>Standard Contractual Clauses (SCCs)</strong> approved by
                the European Commission
              </li>
              <li>
                <strong>Adequacy decisions</strong> where the recipient country
                has been deemed to provide adequate protection
              </li>
              <li>
                <strong>Binding Corporate Rules</strong> where applicable
              </li>
            </ul>
            <p className="text-muted-foreground">
              You may request more information about these safeguards by
              contacting us at{' '}
              <a
                href="mailto:privacy@contractspec.io"
                className="text-primary hover:underline"
              >
                privacy@contractspec.io
              </a>
              .
            </p>
          </section>

          {/* 8. Retention */}
          <section className="mt-10 space-y-4">
            <h2 className="text-foreground text-2xl font-bold">
              8. Data Retention
            </h2>
            <p className="text-muted-foreground">
              We retain your personal data only for as long as necessary to
              fulfil the purposes for which it was collected:
            </p>

            <div className="overflow-x-auto">
              <table className="text-muted-foreground w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-foreground py-3 pr-4 text-left font-semibold">
                      Data Type
                    </th>
                    <th className="text-foreground py-3 text-left font-semibold">
                      Retention Period
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/10">
                    <td className="py-3 pr-4 font-medium">Analytics data</td>
                    <td className="py-3">24 months from collection</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-3 pr-4 font-medium">
                      Waitlist / contact form data
                    </td>
                    <td className="py-3">
                      Until you request deletion or 24 months after last
                      interaction
                    </td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-3 pr-4 font-medium">
                      Account data (when applicable)
                    </td>
                    <td className="py-3">
                      Duration of account plus 12 months after closure
                    </td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-3 pr-4 font-medium">
                      Billing records (when applicable)
                    </td>
                    <td className="py-3">
                      10 years (French legal requirement)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-muted-foreground mt-4">
              We may retain certain data longer if required by law or to
              establish, exercise, or defend legal claims.
            </p>
          </section>

          {/* 9. Your Rights */}
          <section className="mt-10 space-y-4">
            <h2 className="text-foreground text-2xl font-bold">
              9. Your Rights Under GDPR
            </h2>
            <p className="text-muted-foreground">
              As a data subject in the EU, you have the following rights:
            </p>

            <ul className="text-muted-foreground list-disc space-y-3 pl-6">
              <li>
                <strong className="text-foreground">Right to access</strong> —
                Request a copy of the personal data we hold about you
              </li>
              <li>
                <strong className="text-foreground">
                  Right to rectification
                </strong>{' '}
                — Request correction of inaccurate or incomplete data
              </li>
              <li>
                <strong className="text-foreground">
                  Right to erasure ("right to be forgotten")
                </strong>{' '}
                — Request deletion of your personal data in certain
                circumstances
              </li>
              <li>
                <strong className="text-foreground">
                  Right to restriction
                </strong>{' '}
                — Request that we limit how we use your data
              </li>
              <li>
                <strong className="text-foreground">
                  Right to data portability
                </strong>{' '}
                — Receive your data in a structured, machine-readable format
              </li>
              <li>
                <strong className="text-foreground">Right to object</strong> —
                Object to processing based on legitimate interests or direct
                marketing
              </li>
              <li>
                <strong className="text-foreground">
                  Right to withdraw consent
                </strong>{' '}
                — Where processing is based on consent, withdraw it at any time
              </li>
            </ul>

            <p className="text-muted-foreground mt-4">
              To exercise any of these rights, please contact us at{' '}
              <a
                href="mailto:privacy@contractspec.io"
                className="text-primary hover:underline"
              >
                privacy@contractspec.io
              </a>
              . We will respond within one month as required by GDPR.
            </p>
          </section>

          {/* 10. Security */}
          <section className="mt-10 space-y-4">
            <h2 className="text-foreground text-2xl font-bold">10. Security</h2>
            <p className="text-muted-foreground">
              We implement appropriate technical and organisational measures to
              protect your personal data against unauthorised access,
              alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="text-muted-foreground list-disc space-y-2 pl-6">
              <li>Encryption of data in transit (TLS/HTTPS)</li>
              <li>Encryption of data at rest where appropriate</li>
              <li>Access controls and authentication</li>
              <li>Regular security reviews and updates</li>
              <li>Careful vetting of sub-processors</li>
            </ul>
            <p className="text-muted-foreground">
              While we strive to protect your data, no method of transmission
              over the Internet or electronic storage is 100% secure. We cannot
              guarantee absolute security but are committed to continuous
              improvement.
            </p>
          </section>

          {/* 11. Contact & Complaints */}
          <section className="mt-10 space-y-4">
            <h2 className="text-foreground text-2xl font-bold">
              11. Contact & Complaints
            </h2>
            <p className="text-muted-foreground">
              If you have any questions, concerns, or requests regarding this
              privacy policy or our data practices, please contact us:
            </p>
            <div className="text-muted-foreground rounded-lg border border-white/10 bg-white/5 p-4">
              <p>
                <strong className="text-foreground">Email:</strong>{' '}
                <a
                  href="mailto:privacy@contractspec.io"
                  className="text-primary hover:underline"
                >
                  privacy@contractspec.io
                </a>
              </p>
              <p className="mt-2">
                <strong className="text-foreground">Address:</strong> CHAMAN
                VENTURES, 229 rue Saint-Honoré, 75001 Paris, France
              </p>
            </div>

            <h3 className="text-foreground mt-6 text-xl font-semibold">
              Supervisory Authority
            </h3>
            <p className="text-muted-foreground">
              If you are not satisfied with our response or believe we are
              processing your data unlawfully, you have the right to lodge a
              complaint with a supervisory authority. In France, the relevant
              authority is:
            </p>
            <div className="text-muted-foreground rounded-lg border border-white/10 bg-white/5 p-4">
              <p>
                <strong className="text-foreground">
                  Commission Nationale de l'Informatique et des Libertés (CNIL)
                </strong>
              </p>
              <p>3 Place de Fontenoy, TSA 80715, 75334 Paris Cedex 07</p>
              <p>
                Website:{' '}
                <a
                  href="https://www.cnil.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  www.cnil.fr
                </a>
              </p>
            </div>
          </section>

          {/* Changes Notice */}
          <section className="mt-10 space-y-4">
            <h2 className="text-foreground text-2xl font-bold">
              12. Changes to This Policy
            </h2>
            <p className="text-muted-foreground">
              We may update this privacy policy from time to time to reflect
              changes in our practices, technology, legal requirements, or for
              other operational reasons. We will notify you of any material
              changes by updating the "Last updated" date at the top of this
              page.
            </p>
            <p className="text-muted-foreground">
              We encourage you to review this policy periodically to stay
              informed about how we protect your data.
            </p>
          </section>

          {/* Footer */}
          <div className="mt-12 border-t border-white/10 pt-8">
            <p className="text-muted-foreground text-sm">
              For questions about this privacy policy, please contact us at{' '}
              <a
                href="mailto:privacy@contractspec.io"
                className="text-primary hover:underline"
              >
                privacy@contractspec.io
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
