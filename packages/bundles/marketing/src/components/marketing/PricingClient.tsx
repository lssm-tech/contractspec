'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle, ChevronDown, ChevronRight } from 'lucide-react';

import { WaitlistSection } from './waitlist-section';
import { PricingThinkingModal } from './pricing-thinking-modal';

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: 'Can I pay for ContractSpec today?',
    answer:
      "Not yet. We're pre-PMF and working closely with a small set of design partners. They get full access during early access and will be first to move onto paid plans once we're confident in the value and stability.",
  },
  {
    question: 'What will you charge for later?',
    answer:
      'Our plan is to charge based on usage: regenerations, AI agent actions, and number of active projects. A generous free tier will stay available so smaller teams and experiments can thrive.',
  },
  {
    question: 'What do I get as a design partner?',
    answer:
      'Direct collaboration on features, priority onboarding, and a founding discount when paid plans launch. You also shape how ContractSpec works for teams like yours.',
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

  const scrollToWaitlist = () => {
    const waitlistElement = document.getElementById('waitlist');
    if (waitlistElement) {
      waitlistElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
            ContractSpec Studio (the managed platform) is in early access.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
            <Link
              href="/install"
              className="btn-primary inline-flex items-center gap-2"
            >
              Install OSS Core <ChevronRight size={16} />
            </Link>
            <button
              onClick={scrollToWaitlist}
              className="btn-ghost inline-flex items-center gap-2"
            >
              Join Studio waitlist
            </button>
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
                  Early access to ContractSpec Studio
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
                  Priority support during early access
                </li>
                <li className="flex gap-2">
                  <CheckCircle
                    size={16}
                    className="mt-0.5 shrink-0 text-violet-400"
                  />
                  Founding discount when paid plans launch
                </li>
              </ul>
              <button
                onClick={scrollToWaitlist}
                className="btn-primary w-full md:w-auto"
              >
                Apply to the waitlist
              </button>
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
                Current
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Design Partner</h2>
                <div className="space-y-1">
                  <div className="text-2xl font-bold">
                    Free during early access
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Founding discount when paid plans launch
                  </p>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="text-muted-foreground flex gap-3 text-sm">
                  <CheckCircle
                    size={16}
                    className="mt-0.5 shrink-0 text-violet-400"
                  />
                  Use ContractSpec Studio for real projects during early access
                </li>
                <li className="text-muted-foreground flex gap-3 text-sm">
                  <CheckCircle
                    size={16}
                    className="mt-0.5 shrink-0 text-violet-400"
                  />
                  Work directly with the founder on architecture & use cases
                </li>
                <li className="text-muted-foreground flex gap-3 text-sm">
                  <CheckCircle
                    size={16}
                    className="mt-0.5 shrink-0 text-violet-400"
                  />
                  Reasonable "fair use" limits on regenerations and AI credits
                </li>
                <li className="text-muted-foreground flex gap-3 text-sm">
                  <CheckCircle
                    size={16}
                    className="mt-0.5 shrink-0 text-violet-400"
                  />
                  Priority support & feedback loops
                </li>
              </ul>
              <button onClick={scrollToWaitlist} className="btn-primary w-full">
                Apply as a design partner
              </button>
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
                Available after public launch
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
              How ContractSpec pricing will work
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

      {/* Waitlist Section */}
      <section className="section-padding hero-gradient">
        <div className="mx-auto max-w-4xl">
          <WaitlistSection />
        </div>
      </section>

      {/* Pricing Thinking Modal */}
      <PricingThinkingModal
        open={pricingModalOpen}
        onOpenChange={setPricingModalOpen}
        onApplyClick={scrollToWaitlist}
      />
    </main>
  );
}
