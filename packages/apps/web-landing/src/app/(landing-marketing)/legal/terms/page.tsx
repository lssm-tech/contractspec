import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | ContractSpec',
  description:
    'Terms of Service for ContractSpec. Read our terms governing use of the ContractSpec website and services.',
};

export default function TermsPage() {
  return (
    <main className="flex grow flex-col items-center justify-center pt-24">
      <section className="section-padding">
        <div className="prose prose-invert mx-auto max-w-3xl">
          <h1 className="mb-4 text-4xl font-bold">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">
            Last updated: December 18, 2025
          </p>

          {/* 1. Definitions */}
          <section className="space-y-4">
            <h2 className="text-foreground text-2xl font-bold">
              1. Definitions
            </h2>
            <p className="text-muted-foreground">
              In these Terms of Service ("Terms"), the following definitions
              apply:
            </p>
            <ul className="text-muted-foreground list-disc space-y-2 pl-6">
              <li>
                <strong className="text-foreground">"ContractSpec"</strong>,{' '}
                <strong className="text-foreground">"we"</strong>,{' '}
                <strong className="text-foreground">"us"</strong>, or{' '}
                <strong className="text-foreground">"our"</strong> refers to
                CHAMAN VENTURES, SASU, operating under the ContractSpec brand.
              </li>
              <li>
                <strong className="text-foreground">"Service"</strong> or{' '}
                <strong className="text-foreground">"Services"</strong> refers
                to the ContractSpec website, ContractSpec Studio, APIs,
                documentation, and any related products or features we provide.
              </li>
              <li>
                <strong className="text-foreground">"User"</strong>,{' '}
                <strong className="text-foreground">"you"</strong>, or{' '}
                <strong className="text-foreground">"your"</strong> refers to
                any individual or entity accessing or using the Services.
              </li>
              <li>
                <strong className="text-foreground">"User Content"</strong>{' '}
                refers to any data, specifications, configurations, or other
                materials you create, upload, or submit through the Services.
              </li>
              <li>
                <strong className="text-foreground">"ContractSpec Core"</strong>{' '}
                refers to the open-source components of ContractSpec available
                under their respective open-source licenses.
              </li>
              <li>
                <strong className="text-foreground">"Design Partner"</strong>{' '}
                refers to early users who have entered into a separate design
                partnership arrangement with us.
              </li>
            </ul>
          </section>

          {/* 2. Who We Are */}
          <section className="mt-10 space-y-4">
            <h2 className="text-foreground text-2xl font-bold">
              2. Who We Are
            </h2>
            <p className="text-muted-foreground">
              ContractSpec is a brand of{' '}
              <strong className="text-foreground">CHAMAN VENTURES</strong>, a
              simplified joint-stock company (SASU) registered in France.
            </p>
            <div className="text-muted-foreground rounded-lg border border-white/10 bg-white/5 p-4">
              <ul className="list-none space-y-1 pl-0">
                <li>CHAMAN VENTURES, SASU</li>
                <li>RCS Paris • SIREN 989 498 902</li>
                <li>229 rue Saint-Honoré, 75001 Paris, France</li>
                <li>
                  Contact:{' '}
                  <a
                    href="mailto:legal@contractspec.io"
                    className="text-primary hover:underline"
                  >
                    legal@contractspec.io
                  </a>
                </li>
              </ul>
            </div>
          </section>

          {/* 3. Acceptance of Terms */}
          <section className="mt-10 space-y-4">
            <h2 className="text-foreground text-2xl font-bold">
              3. Acceptance of Terms
            </h2>
            <p className="text-muted-foreground">
              By accessing or using ContractSpec, you agree to be bound by these
              Terms and our{' '}
              <a href="/legal/privacy" className="text-primary hover:underline">
                Privacy Policy
              </a>
              . If you do not agree to these Terms, you must not use the
              Services.
            </p>
            <p className="text-muted-foreground">
              We may update these Terms from time to time. We will notify you of
              material changes by updating the "Last updated" date. Continued
              use of the Services after changes constitutes acceptance of the
              updated Terms.
            </p>
          </section>

          {/* 4. Eligibility */}
          <section className="mt-10 space-y-4">
            <h2 className="text-foreground text-2xl font-bold">
              4. Eligibility
            </h2>
            <p className="text-muted-foreground">
              To use the Services, you must:
            </p>
            <ul className="text-muted-foreground list-disc space-y-2 pl-6">
              <li>
                Be at least 18 years old or the age of majority in your
                jurisdiction
              </li>
              <li>Have the legal capacity to enter into binding contracts</li>
              <li>
                Not be prohibited from using the Services under applicable laws
              </li>
              <li>
                If acting on behalf of an organisation, have the authority to
                bind that organisation to these Terms
              </li>
            </ul>
          </section>

          {/* 5. Accounts */}
          <section className="mt-10 space-y-4">
            <h2 className="text-foreground text-2xl font-bold">5. Accounts</h2>
            <div className="text-muted-foreground rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
              <p className="mb-2 font-medium text-yellow-500">Note</p>
              <p>
                User accounts are not yet available. When accounts are
                introduced, the following terms will apply:
              </p>
            </div>
            <ul className="text-muted-foreground mt-4 list-disc space-y-2 pl-6">
              <li>
                You are responsible for maintaining the confidentiality of your
                account credentials
              </li>
              <li>
                You are responsible for all activities that occur under your
                account
              </li>
              <li>
                You must notify us immediately of any unauthorised use of your
                account
              </li>
              <li>
                We reserve the right to suspend or terminate accounts that
                violate these Terms
              </li>
            </ul>
          </section>

          {/* 6. License & Intellectual Property */}
          <section className="mt-10 space-y-4">
            <h2 className="text-foreground text-2xl font-bold">
              6. License & Intellectual Property
            </h2>

            <h3 className="text-foreground mt-6 text-xl font-semibold">
              6.1 Our Intellectual Property
            </h3>
            <p className="text-muted-foreground">
              The ContractSpec name, logo, website design, proprietary software,
              documentation, and all associated intellectual property rights are
              owned by CHAMAN VENTURES. Subject to these Terms, we grant you a
              limited, non-exclusive, non-transferable, revocable license to
              access and use the Services for their intended purpose.
            </p>

            <h3 className="text-foreground mt-6 text-xl font-semibold">
              6.2 Open-Source Components
            </h3>
            <p className="text-muted-foreground">
              Certain components of ContractSpec ("ContractSpec Core") are made
              available as open-source software under their respective licenses
              (e.g., MIT, Apache 2.0). Your use of open-source components is
              governed by those licenses, which may grant you additional rights
              not covered by these Terms. In case of conflict between these
              Terms and an open-source license, the open-source license prevails
              for the applicable component.
            </p>

            <h3 className="text-foreground mt-6 text-xl font-semibold">
              6.3 Your Content
            </h3>
            <p className="text-muted-foreground">
              <strong className="text-foreground">You retain ownership</strong>{' '}
              of all User Content you create, upload, or submit through the
              Services. This includes your specifications, configurations, and
              any other materials you generate.
            </p>
            <p className="text-muted-foreground">
              By using the Services, you grant us a limited, non-exclusive,
              worldwide, royalty-free license to host, store, process, and
              display your User Content solely to the extent necessary to
              provide and improve the Services. This license terminates when you
              delete your User Content or close your account, except where
              retention is required by law or for legitimate business purposes
              (e.g., backups, legal compliance).
            </p>

            <h3 className="text-foreground mt-6 text-xl font-semibold">
              6.4 Feedback
            </h3>
            <p className="text-muted-foreground">
              If you provide feedback, suggestions, or ideas about the Services,
              you grant us a perpetual, irrevocable, royalty-free license to
              use, modify, and incorporate such feedback without obligation to
              you.
            </p>
          </section>

          {/* 7. Acceptable Use */}
          <section className="mt-10 space-y-4">
            <h2 className="text-foreground text-2xl font-bold">
              7. Acceptable Use
            </h2>
            <p className="text-muted-foreground">
              When using the Services, you agree not to:
            </p>

            <ul className="text-muted-foreground list-disc space-y-2 pl-6">
              <li>
                <strong className="text-foreground">Abuse the Services:</strong>{' '}
                Use the Services in a manner that disrupts, damages, or impairs
                our infrastructure or other users' experience
              </li>
              <li>
                <strong className="text-foreground">Probe security:</strong>{' '}
                Attempt to gain unauthorised access to our systems, networks, or
                data; perform security testing without prior written permission
              </li>
              <li>
                <strong className="text-foreground">
                  Distribute harmful content:
                </strong>{' '}
                Upload, share, or distribute malware, viruses, or other
                malicious code
              </li>
              <li>
                <strong className="text-foreground">
                  Engage in illegal activity:
                </strong>{' '}
                Use the Services for any purpose that is unlawful, fraudulent,
                or harmful
              </li>
              <li>
                <strong className="text-foreground">
                  Interfere with operations:
                </strong>{' '}
                Attempt to interfere with, disrupt, or circumvent any security
                or access controls
              </li>
              <li>
                <strong className="text-foreground">Violate rights:</strong>{' '}
                Infringe upon the intellectual property, privacy, or other
                rights of third parties
              </li>
              <li>
                <strong className="text-foreground">
                  Misrepresent identity:
                </strong>{' '}
                Impersonate any person or entity, or falsely claim affiliation
                with ContractSpec
              </li>
              <li>
                <strong className="text-foreground">Circumvent limits:</strong>{' '}
                Attempt to bypass any usage limits, rate limits, or access
                restrictions
              </li>
            </ul>

            <p className="text-muted-foreground mt-4">
              We reserve the right to investigate violations and take
              appropriate action, including suspension or termination of access.
            </p>
          </section>

          {/* 8. Beta / Preview Disclaimer */}
          <section className="mt-10 space-y-4">
            <h2 className="text-foreground text-2xl font-bold">
              8. Beta & Preview Services
            </h2>
            <div className="text-muted-foreground rounded-lg border border-orange-500/20 bg-orange-500/5 p-4">
              <p className="mb-2 font-medium text-orange-400">⚠️ Important</p>
              <p>
                ContractSpec is currently in active development. Some features
                may be labelled as "Beta", "Preview", "Alpha", or similar
                designations.
              </p>
            </div>

            <p className="text-muted-foreground mt-4">
              By using beta or preview features, you acknowledge:
            </p>
            <ul className="text-muted-foreground list-disc space-y-2 pl-6">
              <li>
                <strong className="text-foreground">Things may break:</strong>{' '}
                Beta features may contain bugs, errors, or unexpected behaviour
              </li>
              <li>
                <strong className="text-foreground">
                  No availability guarantee:
                </strong>{' '}
                We do not guarantee uptime, availability, or continuity of beta
                features
              </li>
              <li>
                <strong className="text-foreground">
                  Features may change or disappear:
                </strong>{' '}
                We may modify, suspend, or discontinue beta features at any time
                without notice
              </li>
              <li>
                <strong className="text-foreground">Not for production:</strong>{' '}
                Beta features should not be relied upon for mission-critical or
                production workloads unless you accept these risks
              </li>
              <li>
                <strong className="text-foreground">Data may be lost:</strong>{' '}
                We cannot guarantee the preservation of data created using beta
                features
              </li>
            </ul>
          </section>

          {/* 9. Design Partner Terms */}
          <section className="mt-10 space-y-4">
            <h2 className="text-foreground text-2xl font-bold">
              9. Design Partner Program
            </h2>
            <p className="text-muted-foreground">
              We offer a Design Partner program for early users who wish to
              collaborate closely with us to shape the product. If you
              participate as a Design Partner:
            </p>

            <h3 className="text-foreground mt-6 text-xl font-semibold">
              9.1 Scope
            </h3>
            <p className="text-muted-foreground">
              Design Partners receive early access to features, provide
              feedback, and help validate product direction. The specific scope
              of your participation will be outlined in a separate agreement or
              communication.
            </p>

            <h3 className="text-foreground mt-6 text-xl font-semibold">
              9.2 Feedback
            </h3>
            <p className="text-muted-foreground">
              We value your input. Feedback you provide may be used to improve
              the Services. See Section 6.4 for licensing terms regarding
              feedback.
            </p>

            <h3 className="text-foreground mt-6 text-xl font-semibold">
              9.3 Confidentiality
            </h3>
            <p className="text-muted-foreground">
              Design Partners may receive access to confidential or pre-release
              information. Unless otherwise specified in a separate agreement,
              you agree to keep such information confidential and not share it
              publicly without our prior written consent.
            </p>

            <h3 className="text-foreground mt-6 text-xl font-semibold">
              9.4 Mutual Expectations
            </h3>
            <ul className="text-muted-foreground list-disc space-y-2 pl-6">
              <li>
                <strong className="text-foreground">From us:</strong> Regular
                communications, responsiveness to feedback, and transparency
                about product direction
              </li>
              <li>
                <strong className="text-foreground">From you:</strong> Timely
                and honest feedback, reasonable engagement, and adherence to
                these Terms
              </li>
            </ul>
          </section>

          {/* 10. Fees & Billing */}
          <section className="mt-10 space-y-4">
            <h2 className="text-foreground text-2xl font-bold">
              10. Fees & Billing
            </h2>
            <div className="text-muted-foreground rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
              <p className="mb-2 font-medium text-yellow-500">Note</p>
              <p>
                Paid plans are not yet available. When paid plans are
                introduced, the following terms will apply:
              </p>
            </div>
            <ul className="text-muted-foreground mt-4 list-disc space-y-2 pl-6">
              <li>
                Fees will be clearly communicated before you commit to a paid
                plan
              </li>
              <li>
                Payment terms, billing cycles, and refund policies will be
                specified at that time
              </li>
              <li>
                We reserve the right to change pricing with reasonable notice
              </li>
              <li>
                Failure to pay may result in suspension or termination of paid
                features
              </li>
            </ul>
          </section>

          {/* 11. Third-Party Services */}
          <section className="mt-10 space-y-4">
            <h2 className="text-foreground text-2xl font-bold">
              11. Third-Party Services
            </h2>
            <p className="text-muted-foreground">
              The Services may integrate with or contain links to third-party
              services, websites, or content. We do not control and are not
              responsible for third-party services.
            </p>
            <ul className="text-muted-foreground list-disc space-y-2 pl-6">
              <li>
                Your use of third-party services is governed by their respective
                terms and policies
              </li>
              <li>
                We make no warranties or representations about third-party
                services
              </li>
              <li>Links to third-party sites do not imply endorsement</li>
              <li>
                You are responsible for reviewing the terms of any third-party
                services you use
              </li>
            </ul>
          </section>

          {/* 12. Disclaimer of Warranties */}
          <section className="mt-10 space-y-4">
            <h2 className="text-foreground text-2xl font-bold">
              12. Disclaimer of Warranties
            </h2>
            <div className="text-muted-foreground rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="font-medium uppercase">
                THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
                WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.
              </p>
            </div>

            <p className="text-muted-foreground mt-4">
              To the fullest extent permitted by law, we disclaim:
            </p>
            <ul className="text-muted-foreground list-disc space-y-2 pl-6">
              <li>
                Warranties of merchantability, fitness for a particular purpose,
                and non-infringement
              </li>
              <li>
                Any warranty that the Services will be uninterrupted, secure, or
                error-free
              </li>
              <li>
                Any warranty regarding the accuracy, reliability, or
                completeness of content
              </li>
              <li>
                Any warranty that defects will be corrected or that the Services
                are free of viruses or harmful components
              </li>
            </ul>

            <h3 className="text-foreground mt-6 text-xl font-semibold">
              No Professional Advice
            </h3>
            <p className="text-muted-foreground">
              The Services are tools for software development. Nothing in the
              Services constitutes legal, financial, technical, or other
              professional advice. You are solely responsible for evaluating the
              suitability of the Services for your needs and for any decisions
              you make based on the output.
            </p>
          </section>

          {/* 13. Limitation of Liability */}
          <section className="mt-10 space-y-4">
            <h2 className="text-foreground text-2xl font-bold">
              13. Limitation of Liability
            </h2>
            <p className="text-muted-foreground">
              To the maximum extent permitted by applicable law:
            </p>
            <ul className="text-muted-foreground list-disc space-y-2 pl-6">
              <li>
                <strong className="text-foreground">
                  No indirect damages:
                </strong>{' '}
                We shall not be liable for any indirect, incidental, special,
                consequential, or punitive damages, including loss of profits,
                data, goodwill, or other intangible losses
              </li>
              <li>
                <strong className="text-foreground">
                  Limited direct liability:
                </strong>{' '}
                Our total aggregate liability for any claims arising from or
                related to the Services shall not exceed the greater of: (a) the
                amount you paid us in the 12 months preceding the claim, or (b)
                €100
              </li>
              <li>
                <strong className="text-foreground">Exceptions:</strong> These
                limitations do not apply to liability that cannot be excluded
                under applicable law, including liability for fraud or wilful
                misconduct
              </li>
            </ul>
            <p className="text-muted-foreground mt-4">
              You acknowledge that these limitations reflect a reasonable
              allocation of risk and are a fundamental basis of the agreement
              between us.
            </p>
          </section>

          {/* 14. Termination */}
          <section className="mt-10 space-y-4">
            <h2 className="text-foreground text-2xl font-bold">
              14. Termination
            </h2>

            <h3 className="text-foreground mt-6 text-xl font-semibold">
              14.1 By You
            </h3>
            <p className="text-muted-foreground">
              You may stop using the Services at any time. When accounts are
              available, you may close your account through the account settings
              or by contacting us.
            </p>

            <h3 className="text-foreground mt-6 text-xl font-semibold">
              14.2 By Us
            </h3>
            <p className="text-muted-foreground">
              We may suspend or terminate your access to the Services at any
              time, with or without cause, with or without notice. Reasons for
              termination may include:
            </p>
            <ul className="text-muted-foreground list-disc space-y-2 pl-6">
              <li>Violation of these Terms</li>
              <li>
                Conduct that we believe is harmful to other users or our
                business
              </li>
              <li>Extended inactivity</li>
              <li>Discontinuation of the Services</li>
            </ul>

            <h3 className="text-foreground mt-6 text-xl font-semibold">
              14.3 Effect of Termination
            </h3>
            <p className="text-muted-foreground">
              Upon termination, your right to use the Services ceases
              immediately. Provisions that by their nature should survive
              termination will survive, including intellectual property rights,
              disclaimers, limitations of liability, and dispute resolution.
            </p>
          </section>

          {/* 15. Governing Law & Jurisdiction */}
          <section className="mt-10 space-y-4">
            <h2 className="text-foreground text-2xl font-bold">
              15. Governing Law & Jurisdiction
            </h2>
            <p className="text-muted-foreground">
              These Terms are governed by and construed in accordance with the
              laws of <strong className="text-foreground">France</strong>,
              without regard to conflict of law principles.
            </p>
            <p className="text-muted-foreground">
              Any disputes arising from or related to these Terms or the
              Services shall be subject to the exclusive jurisdiction of the
              courts of{' '}
              <strong className="text-foreground">Paris, France</strong>.
            </p>
            <p className="text-muted-foreground">
              If you are a consumer in the European Union, nothing in these
              Terms affects your rights under mandatory consumer protection laws
              of your country of residence.
            </p>
          </section>

          {/* 16. Contact */}
          <section className="mt-10 space-y-4">
            <h2 className="text-foreground text-2xl font-bold">16. Contact</h2>
            <p className="text-muted-foreground">
              If you have any questions about these Terms, please contact us:
            </p>
            <div className="text-muted-foreground rounded-lg border border-white/10 bg-white/5 p-4">
              <p>
                <strong className="text-foreground">Email:</strong>{' '}
                <a
                  href="mailto:legal@contractspec.io"
                  className="text-primary hover:underline"
                >
                  legal@contractspec.io
                </a>
              </p>
              <p className="mt-2">
                <strong className="text-foreground">Address:</strong> CHAMAN
                VENTURES, 229 rue Saint-Honoré, 75001 Paris, France
              </p>
            </div>
          </section>

          {/* Miscellaneous */}
          <section className="mt-10 space-y-4">
            <h2 className="text-foreground text-2xl font-bold">
              17. Miscellaneous
            </h2>
            <ul className="text-muted-foreground list-disc space-y-2 pl-6">
              <li>
                <strong className="text-foreground">Entire Agreement:</strong>{' '}
                These Terms, together with our Privacy Policy and any additional
                agreements, constitute the entire agreement between you and
                ContractSpec regarding the Services
              </li>
              <li>
                <strong className="text-foreground">Severability:</strong> If
                any provision of these Terms is found unenforceable, the
                remaining provisions will continue in effect
              </li>
              <li>
                <strong className="text-foreground">Waiver:</strong> Our failure
                to enforce any right or provision does not constitute a waiver
                of that right or provision
              </li>
              <li>
                <strong className="text-foreground">Assignment:</strong> You may
                not assign or transfer your rights under these Terms without our
                consent. We may assign our rights freely
              </li>
            </ul>
          </section>

          {/* Footer */}
          <div className="mt-12 border-t border-white/10 pt-8">
            <p className="text-muted-foreground text-sm">
              For questions about these terms, please contact us at{' '}
              <a
                href="mailto:legal@contractspec.io"
                className="text-primary hover:underline"
              >
                legal@contractspec.io
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
