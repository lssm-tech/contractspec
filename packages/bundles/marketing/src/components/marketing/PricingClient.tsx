'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle, ChevronDown, ChevronRight } from 'lucide-react';

import { StudioSignupSection } from './studio-signup-section';
import { PricingThinkingModal } from './pricing-thinking-modal';

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: 'Can I use ContractSpec Studio today?',
    answer:
      'Yes. ContractSpec Studio is live at app.contractspec.studio. Start with the free tier and upgrade as paid plans roll out.',
  },
  {
    question: 'What will you charge for later?',
    answer:
      'Pricing is evolving toward usage: regenerations, AI agent actions, and active projects. A generous free tier will remain so smaller teams and experiments can thrive.',
  },
  {
    question: 'What do I get as a design partner?',
    answer:
      'Direct collaboration on roadmap priorities, hands-on onboarding, and priority support. You also help shape Studio workflows before broad rollout.',
  },
  {
    question: 'Will you ever charge per seat?',
    answer:
      'No. We want everyone in your team to use ContractSpec without friction. Pricing is tied to how much of your system we help you maintain, not how many teammates you invite.',
  },
];

export function PricingClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [pricingModalOpen, setPricingModalOpen] = useState(false);

  const openStudio = () => {
    window.open(
      'https://app.contractspec.studio',
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <main className="">
      {/* Hero */}
      <section className="section-padding hero-gradient relative">
        <div className="mx-auto max-w-4xl space-y-6 text-center">
          <h1 className="text-5xl leading-tight font-bold md:text-6xl">
            Transparent, usage-based pricing – after we earn it.
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            ContractSpec Core (the OSS compiler) is and always will be free.
            ContractSpec Studio is live, with paid plans rolling out
            progressively.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
            <Link
              href="/install"
              className="btn-primary inline-flex items-center gap-2"
            >
              Install OSS Core <ChevronRight size={16} />
            </Link>
            <Link
              href="https://app.contractspec.studio"
              className="btn-ghost inline-flex items-center gap-2"
            >
              Try Studio Free
            </Link>
          </div>
        </div>
      </section>

      {/* Design-Partner Highlight Strip */}
      <section className="section-padding border-border border-b">
        <div className="mx-auto max-w-6xl">
          <div className="card-subtle flex flex-col gap-6 p-8 md:flex-row md:items-center">
            <div className="flex-1 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1">
                <span className="text-sm font-medium text-violet-300">
                  Now accepting design partners
                </span>
              </div>
              <h2 className="text-2xl font-bold">
                Help us design the compiler for AI-native software.
              </h2>
              <p className="text-muted-foreground text-sm">
                We work closely with a small group of teams building serious
                products with AI. You bring real-world complexity, we bring the
                spec-first engine and a lot of attention.
              </p>
            </div>
            <div className="flex-1 space-y-4">
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li className="flex gap-2">
                  <CheckCircle
                    size={16}
                    className="mt-0.5 shrink-0 text-violet-400"
                  />
                  Priority access to new Studio capabilities
                </li>
                <li className="flex gap-2">
                  <CheckCircle
                    size={16}
                    className="mt-0.5 shrink-0 text-violet-400"
                  />
                  Hands-on onboarding and architecture help
                </li>
                <li className="flex gap-2">
                  <CheckCircle
                    size={16}
                    className="mt-0.5 shrink-0 text-violet-400"
                  />
                  Influence over roadmap and features
                </li>
                <li className="flex gap-2">
                  <CheckCircle
                    size={16}
                    className="mt-0.5 shrink-0 text-violet-400"
                  />
                  Priority support through direct channels
                </li>
                <li className="flex gap-2">
                  <CheckCircle
                    size={16}
                    className="mt-0.5 shrink-0 text-violet-400"
                  />
                  Pricing input and partner incentives
                </li>
              </ul>
              <Link
                href="/design-partner"
                className="btn-primary w-full md:w-auto"
              >
                Apply as a design partner
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Future Pricing Tiers */}
      <section className="section-padding border-border border-b">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-3">
            {/* OSS Core (Forever Free) */}
            <div className="card-subtle col-span-3 space-y-6 border-violet-500/20 p-6">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-violet-500 px-3 py-1 text-xs font-medium text-white">
                <div className="text-1xl font-bold">Free Forever</div>
                <p className="text-muted-foreground text-xs">
                  Apache 2.0 / MIT License
                </p>
              </div>
              <div className="flex flex-row justify-around">
                <div className="w-1/2">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold">OSS Core</h2>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    The complete spec-first compiler. Generate API, DB, and UI
                    code locally.
                  </p>
                </div>
                <ul className="space-y-3">
                  <li className="text-muted-foreground flex gap-3 text-sm">
                    <CheckCircle
                      size={16}
                      className="mt-0.5 shrink-0 text-violet-400"
                    />
                    Unlimited local regenerations
                  </li>
                  <li className="text-muted-foreground flex gap-3 text-sm">
                    <CheckCircle
                      size={16}
                      className="mt-0.5 shrink-0 text-violet-400"
                    />
                    All standard generators included
                  </li>
                  <li className="text-muted-foreground flex gap-3 text-sm">
                    <CheckCircle
                      size={16}
                      className="mt-0.5 shrink-0 text-violet-400"
                    />
                    Run in your own CI/CD
                  </li>
                  <li className="text-muted-foreground flex gap-3 text-sm">
                    <CheckCircle
                      size={16}
                      className="mt-0.5 shrink-0 text-violet-400"
                    />
                    Community support
                  </li>
                </ul>
              </div>
              <Link href="/install" className="btn-ghost w-full">
                Install now
              </Link>
            </div>

            {/* Design Partner (Current) */}
            <div className="card-subtle relative space-y-6 bg-violet-500/5 p-6 ring-2 ring-violet-500">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-violet-500 px-3 py-1 text-xs font-medium text-white">
                Live program
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Design Partner</h2>
                <div className="space-y-1">
                  <div className="text-2xl font-bold">Invite-based</div>
                  <p className="text-muted-foreground text-xs">
                    Built for teams shaping the next Studio capabilities
                  </p>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="text-muted-foreground flex gap-3 text-sm">
                  <CheckCircle
                    size={16}
                    className="mt-0.5 shrink-0 text-violet-400"
                  />
                  Use ContractSpec Studio for real projects
                </li>
                <li className="text-muted-foreground flex gap-3 text-sm">
                  <CheckCircle
                    size={16}
                    className="mt-0.5 shrink-0 text-violet-400"
                  />
                  Work directly with the team on architecture and workflow
                  design
                </li>
                <li className="text-muted-foreground flex gap-3 text-sm">
                  <CheckCircle
                    size={16}
                    className="mt-0.5 shrink-0 text-violet-400"
                  />
                  Access to partner-only previews and feedback loops
                </li>
                <li className="text-muted-foreground flex gap-3 text-sm">
                  <CheckCircle
                    size={16}
                    className="mt-0.5 shrink-0 text-violet-400"
                  />
                  Priority support and roadmap influence
                </li>
              </ul>
              <Link href="/design-partner" className="btn-primary w-full">
                Apply as a design partner
              </Link>
            </div>

            {/* Builder (Coming Soon) */}
            <div className="card-subtle relative space-y-6 p-6">
              <div className="bg-muted border-border absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border px-3 py-1 text-xs font-medium">
                Coming soon
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Builder</h2>
                <div className="space-y-1">
                  <div className="text-2xl font-bold">
                    Usage-based, for solo builders and small teams
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground text-sm">
                Pay only for what you regenerate and the AI you consume. No
                seat-based pricing, and a generous free tier for experiments.
              </p>
              <ul className="space-y-2">
                <li className="text-muted-foreground text-sm">1–3 projects</li>
                <li className="text-muted-foreground text-sm">
                  Generous monthly free regenerations
                </li>
                <li className="text-muted-foreground text-sm">
                  Pay-as-you-go beyond the free tier
                </li>
              </ul>
              <button
                disabled
                className="btn-ghost w-full cursor-not-allowed opacity-50"
              >
                Available after pricing rollout
              </button>
            </div>

            {/* Team / Enterprise (Coming Soon) */}
            <div className="card-subtle relative space-y-6 p-6">
              <div className="bg-muted border-border absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border px-3 py-1 text-xs font-medium">
                Coming soon
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Team & Platform</h2>
                <div className="space-y-1">
                  <div className="text-2xl font-bold">
                    Custom, for teams standardizing on ContractSpec
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground text-sm">
                For teams running multiple apps or platforms on ContractSpec,
                with stricter governance, data, and compliance needs.
              </p>
              <ul className="space-y-3">
                <li className="text-muted-foreground flex gap-3 text-sm">
                  <CheckCircle
                    size={16}
                    className="mt-0.5 shrink-0 text-violet-400"
                  />
                  Multiple projects and environments
                </li>
                <li className="text-muted-foreground flex gap-3 text-sm">
                  <CheckCircle
                    size={16}
                    className="mt-0.5 shrink-0 text-violet-400"
                  />
                  Advanced RBAC and policy packs
                </li>
                <li className="text-muted-foreground flex gap-3 text-sm">
                  <CheckCircle
                    size={16}
                    className="mt-0.5 shrink-0 text-violet-400"
                  />
                  SSO, audit trails, and longer retention
                </li>
                <li className="text-muted-foreground flex gap-3 text-sm">
                  <CheckCircle
                    size={16}
                    className="mt-0.5 shrink-0 text-violet-400"
                  />
                  Priority support & SLAs
                </li>
              </ul>
              <Link href="/contact" className="btn-ghost w-full">
                Talk to us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How Pricing Will Work */}
      <section className="section-padding border-border bg-muted/20 border-b">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-bold">
              How ContractSpec pricing works now and next
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              We charge based on how much of your stack we help you maintain,
              not how many people click around in the UI.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="card-subtle space-y-3 p-6">
              <h3 className="font-bold">Generous free tier</h3>
              <p className="text-muted-foreground text-sm">
                One serious project, small spec, and enough monthly
                regenerations to ship something real.
              </p>
            </div>
            <div className="card-subtle space-y-3 p-6">
              <h3 className="font-bold">Usage-based beyond free</h3>
              <p className="text-muted-foreground text-sm">
                You pay for regenerations and AI agent actions, not per-seat.
                The more your system evolves via ContractSpec, the more you pay.
              </p>
            </div>
            <div className="card-subtle space-y-3 p-6">
              <h3 className="font-bold">No lock-in</h3>
              <p className="text-muted-foreground text-sm">
                Generated code is standard, readable, and exportable. If you
                leave, your app keeps running.
              </p>
            </div>
          </div>
          <div className="pt-6 text-center">
            <button
              onClick={() => setPricingModalOpen(true)}
              className="btn-ghost"
            >
              View our tentative pricing model
            </button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding border-border border-b">
        <div className="mx-auto max-w-3xl space-y-8">
          <h2 className="text-center text-3xl font-bold">
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="card-subtle overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between p-6 text-left"
                >
                  <span className="font-medium">{faq.question}</span>
                  <ChevronDown
                    size={20}
                    className={`text-muted-foreground transition-transform ${
                      openFaq === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="text-muted-foreground px-6 pb-6 text-sm">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="pt-4 text-center">
            <p className="text-muted-foreground mb-2 text-sm">Still unsure?</p>
            <Link
              href="/contact"
              className="text-sm font-medium text-violet-400 hover:text-violet-300"
            >
              Contact us →
            </Link>
          </div>
        </div>
      </section>

      {/* Studio Signup Section */}
      <section className="section-padding hero-gradient">
        <div className="mx-auto max-w-4xl">
          <StudioSignupSection />
        </div>
      </section>

      {/* Pricing Thinking Modal */}
      <PricingThinkingModal
        open={pricingModalOpen}
        onOpenChange={setPricingModalOpen}
        onApplyClick={openStudio}
      />
    </main>
  );
}
