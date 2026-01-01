import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contribute to ContractSpec',
  description:
    'Join the ContractSpec open-source community. Report issues, improve docs, build integrations, and help shape the future of spec-first development.',
  openGraph: {
    title: 'Contribute to ContractSpec',
    description:
      'Get started contributing in under 3 minutes. Docs, examples, integrations, and more.',
    url: 'https://contractspec.io/contribute',
  },
  alternates: {
    canonical: 'https://contractspec.io/contribute',
  },
};

export function ContributePage() {
  return (
    <main className="flex grow flex-col items-center justify-center pt-24">
      <section className="section-padding">
        <div className="prose prose-invert mx-auto max-w-2xl">
          <h1 className="mb-8 text-4xl font-bold">
            Contribute to ContractSpec
          </h1>

          {/* Quick Start Box */}
          <div className="not-prose border-border bg-muted/30 mb-12 rounded-lg border p-6">
            <h2 className="text-foreground mb-4 text-xl font-bold">
              ⚡ Quick Start — 3 Minutes to Your First Contribution
            </h2>
            <ol className="text-muted-foreground list-inside list-decimal space-y-2">
              <li>
                Read the{' '}
                <a
                  href="https://github.com/contractspec/contractspec/blob/main/CONTRIBUTING.md"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  CONTRIBUTING guide
                </a>
              </li>
              <li>
                Pick a{' '}
                <a
                  href="https://github.com/contractspec/contractspec/labels/good%20first%20issue"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  good first issue
                </a>{' '}
                or{' '}
                <a
                  href="https://github.com/contractspec/contractspec/labels/help%20wanted"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  help wanted
                </a>{' '}
                label
              </li>
              <li>Open a draft PR early — we'll guide you from there</li>
            </ol>
          </div>

          {/* Why Open Source */}
          <section className="mb-10 space-y-4">
            <h2 className="text-foreground text-2xl font-bold">
              Why Open Source?
            </h2>
            <ul className="text-muted-foreground list-inside list-disc space-y-2">
              <li>
                <strong>Transparency:</strong> You can see exactly how your code
                is compiled and deployed
              </li>
              <li>
                <strong>Trust:</strong> No black boxes — audit the compiler that
                shapes your AI-generated code
              </li>
              <li>
                <strong>Faster ecosystem:</strong> Community contributions
                accelerate adoption and surface real-world edge cases
              </li>
              <li>
                <strong>Community review:</strong> More eyes catch more bugs,
                and better patterns emerge
              </li>
              <li>
                <strong>No lock-in:</strong> You own your code. The spec is
                portable.
              </li>
            </ul>
          </section>

          {/* Where to Contribute */}
          <section className="mb-10 space-y-4">
            <h2 className="text-foreground text-2xl font-bold">
              Where to Contribute
            </h2>
            <ul className="text-muted-foreground list-inside list-disc space-y-2">
              <li>
                <a
                  href="https://github.com/contractspec"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub Organization
                </a>{' '}
                — All repos live here
              </li>
              <li>
                <a
                  href="https://github.com/contractspec/contractspec"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Main Repository
                </a>{' '}
                — Core compiler and specs
              </li>
              <li>
                <a
                  href="https://github.com/contractspec/contractspec/discussions"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Discussions
                </a>{' '}
                — Questions, ideas, and RFCs
              </li>
            </ul>
          </section>

          {/* Contribution Types */}
          <section className="mb-10 space-y-4">
            <h2 className="text-foreground text-2xl font-bold">
              Ways to Contribute
            </h2>
            <div className="text-muted-foreground space-y-3">
              <p>
                <strong className="text-foreground">📄 Documentation:</strong>{' '}
                Fix typos, improve explanations, add missing guides
              </p>
              <p>
                <strong className="text-foreground">
                  📦 Examples & Templates:
                </strong>{' '}
                Build real-world specs for common use cases
              </p>
              <p>
                <strong className="text-foreground">
                  🔌 Integrations & Adapters:
                </strong>{' '}
                Connect ContractSpec to frameworks, databases, and tools
              </p>
              <p>
                <strong className="text-foreground">🐛 Bug Reports:</strong>{' '}
                File issues with clear reproduction steps — minimal cases help
                the most
              </p>
              <p>
                <strong className="text-foreground">
                  🔒 Security Reports:
                </strong>{' '}
                Found a vulnerability? See{' '}
                <a href="#security" className="text-primary hover:underline">
                  Security
                </a>{' '}
                below
              </p>
            </div>
          </section>

          {/* Quality Bar */}
          <section className="mb-10 space-y-4">
            <h2 className="text-foreground text-2xl font-bold">Quality Bar</h2>
            <p className="text-muted-foreground">
              We keep the bar high so the codebase stays maintainable. Every PR
              should:
            </p>
            <ul className="text-muted-foreground list-inside list-disc space-y-2">
              <li>
                <strong>Include tests</strong> — Unit tests for logic,
                integration tests for adapters
              </li>
              <li>
                <strong>Be fully typed</strong> — No <code>any</code>. Strict
                TypeScript only.
              </li>
              <li>
                <strong>Stay small</strong> — One concern per PR. Easier to
                review, faster to merge.
              </li>
              <li>
                <strong>Use clear commit messages</strong> — Describe _what_ and
                _why_, not just _how_
              </li>
            </ul>
            <div className="bg-muted/20 mt-4 rounded-md p-4">
              <h3 className="text-foreground mb-2 font-semibold">
                Spec-First Mindset
              </h3>
              <p className="text-muted-foreground text-sm">
                ContractSpec exists to enforce contracts between humans, AI, and
                code. When contributing, think spec-first: define the behavior
                before the implementation. A well-defined spec makes changes
                safe to regenerate and easy to validate.
              </p>
            </div>
          </section>

          {/* Governance */}
          <section className="mb-10 space-y-4">
            <h2 className="text-foreground text-2xl font-bold">
              Governance & Decision Making
            </h2>
            <p className="text-muted-foreground">
              ContractSpec uses a{' '}
              <strong className="text-foreground">
                founder-led maintainer model
              </strong>
              :
            </p>
            <ul className="text-muted-foreground list-inside list-disc space-y-2">
              <li>
                The founder has final say on significant decisions — for now
              </li>
              <li>All reasoning is shared publicly in issues or PRs</li>
              <li>
                Community input shapes direction; we don't merge in silence
              </li>
              <li>
                This model may evolve as the project matures and trusted
                maintainers emerge
              </li>
            </ul>
          </section>

          {/* Security */}
          <section className="mb-10 space-y-4" id="security">
            <h2 className="text-foreground text-2xl font-bold">Security</h2>
            <p className="text-muted-foreground">
              If you discover a security vulnerability, please{' '}
              <strong className="text-foreground">do not</strong> open a public
              issue.
            </p>
            <p className="text-muted-foreground">
              Instead, email us at{' '}
              <a
                href="mailto:security@contractspec.io"
                className="text-primary hover:underline"
              >
                security@contractspec.io
              </a>{' '}
              with:
            </p>
            <ul className="text-muted-foreground list-inside list-disc space-y-2">
              <li>A clear description of the vulnerability</li>
              <li>Steps to reproduce</li>
              <li>Potential impact</li>
            </ul>
            <p className="text-muted-foreground">
              We'll acknowledge within 48 hours and work with you to coordinate
              disclosure.
            </p>
          </section>

          {/* Code of Conduct */}
          <section className="mb-10 space-y-4">
            <h2 className="text-foreground text-2xl font-bold">
              Code of Conduct
            </h2>
            <p className="text-muted-foreground">
              We expect all contributors to follow our{' '}
              <a
                href="https://github.com/contractspec/contractspec/blob/main/CODE_OF_CONDUCT.md"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Code of Conduct
              </a>
              . Be respectful, constructive, and assume good intent.
            </p>
          </section>

          {/* Go Deeper */}
          <section className="border-border mt-12 space-y-4 border-t pt-8">
            <h2 className="text-foreground text-2xl font-bold">
              Want to Go Deeper?
            </h2>
            <p className="text-muted-foreground">
              If you're considering a long-term commitment to ContractSpec —
              reviewing PRs regularly, shaping roadmap, mentoring new
              contributors — we'd love to talk.
            </p>
            <p className="text-muted-foreground">
              This isn't a job offer. It's an invitation to help build something
              meaningful together. Reach out at{' '}
              <a
                href="mailto:maintainers@contractspec.io"
                className="text-primary hover:underline"
              >
                maintainers@contractspec.io
              </a>{' '}
              and tell us what you'd bring to the table.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
