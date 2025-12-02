'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle, ChevronDown, ChevronRight, Zap } from 'lucide-react';

interface Plan {
  name: string;
  subtitle: string;
  monthlyPrice: number | 'custom';
  annualPrice: number | 'custom';
  description: string;
  features: string[];
  highlight?: boolean;
  cta: string;
  ctaLink: string;
}

const plans: Plan[] = [
  {
    name: 'Free',
    subtitle: 'For individuals & small projects',
    monthlyPrice: 0,
    annualPrice: 0,
    description:
      'Perfect for trying ContractSpec on a side project or learning spec-first development.',
    features: [
      '1 project',
      '50 regenerations/month',
      'All code generators (API, DB, UI)',
      'Standard TypeScript output',
      'Community support',
      'No lock-in — eject anytime',
    ],
    cta: 'Start free',
    ctaLink: '/docs/quickstart',
  },
  {
    name: 'Pro',
    subtitle: 'For teams & collaboration',
    monthlyPrice: 29,
    annualPrice: 24,
    description:
      'For teams shipping production apps with AI assistance who need stability and collaboration.',
    features: [
      'Unlimited projects',
      '500 regenerations/month',
      'Team collaboration (5 seats)',
      'CI/CD integration',
      'Evolution suggestions',
      'Priority email support',
      'Contract versioning',
      'Golden test generation',
    ],
    highlight: true,
    cta: 'Start 14-day trial',
    ctaLink: '/contact',
  },
  {
    name: 'Business',
    subtitle: 'For agencies & compliance needs',
    monthlyPrice: 99,
    annualPrice: 79,
    description:
      'For agencies building multiple projects or companies needing governance and compliance.',
    features: [
      'Everything in Pro',
      'Unlimited regenerations',
      'Unlimited team seats',
      'Audit trail & compliance reports',
      'Contract enforcement policies',
      'Custom templates',
      'SSO/SAML',
      'Dedicated support',
      'SLA guarantee',
    ],
    cta: 'Contact sales',
    ctaLink: '/contact',
  },
];

interface UsageAddon {
  name: string;
  description: string;
  price: string;
}

const usageAddons: UsageAddon[] = [
  {
    name: 'Extra regenerations',
    description: "Beyond your plan's included regenerations",
    price: '$0.10 per regeneration',
  },
  {
    name: 'Extra team seats',
    description: 'Additional collaborators beyond plan limits',
    price: '$10/seat/month',
  },
  {
    name: 'CI/CD minutes',
    description: 'Automated regeneration on git push',
    price: '$0.05 per minute',
  },
];

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: 'What happens to my code if I stop paying?',
    answer:
      "You keep everything. ContractSpec generates standard TypeScript, Prisma schemas, and GraphQL/REST endpoints. There's no runtime dependency. If you cancel, your generated code continues to work. You just can't regenerate or use evolution suggestions anymore.",
  },
  {
    question: 'Can I eject from ContractSpec?',
    answer:
      "Yes, anytime. The generated code is yours — it's standard tech with no proprietary abstractions. You can stop using ContractSpec and maintain the code manually. We're a compiler, not a prison.",
  },
  {
    question: 'What counts as a regeneration?',
    answer:
      "A regeneration is when you run ContractSpec to generate or update code from your specs. Viewing specs, editing specs, and reading docs don't count. Only actual code generation counts against your limit.",
  },
  {
    question: 'Do I need to learn a new language?',
    answer:
      'No. Specs are written in TypeScript with Zod schemas. If you can write z.object({ name: z.string() }), you can write ContractSpec specs. No DSL, no YAML, no magic.',
  },
  {
    question: 'Can I use ContractSpec with my existing codebase?',
    answer:
      "Yes. ContractSpec supports incremental adoption. Start with one API endpoint or one data model. You don't need to rewrite your app — you stabilize it one module at a time.",
  },
  {
    question: 'What surfaces can ContractSpec generate?',
    answer:
      'REST APIs, GraphQL schemas, Prisma database schemas, React forms/views, MCP tools for AI agents, TypeScript types, and validation logic. All from the same spec.',
  },
  {
    question: 'Is there a free trial for paid plans?',
    answer:
      'Yes. Pro and Business plans come with a 14-day free trial. No credit card required to start.',
  },
  {
    question: 'Can I change plans later?',
    answer:
      "Yes. Upgrade or downgrade anytime. If you downgrade, you keep access to existing projects and generated code — you just can't exceed the new plan's limits.",
  },
];

export default function PricingClient() {
  const [annual, setAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="pt-24">
      {/* Hero */}
      <section className="section-padding hero-gradient relative">
        <div className="mx-auto max-w-4xl space-y-6 text-center">
          <h1 className="text-5xl leading-tight font-bold md:text-6xl">
            Simple, transparent pricing
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Start free. Scale with your team. No surprise bills. No lock-in.
          </p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <span
              className={`text-sm ${!annual ? 'text-foreground' : 'text-muted-foreground'}`}
            >
              Monthly
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative h-7 w-14 rounded-full transition-colors ${
                annual ? 'bg-violet-500' : 'bg-muted'
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${
                  annual ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
            <span
              className={`text-sm ${annual ? 'text-foreground' : 'text-muted-foreground'}`}
            >
              Annual{' '}
              <span className="font-medium text-emerald-400">(Save 17%)</span>
            </span>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="section-padding border-border border-b">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`card-subtle relative space-y-6 p-6 ${
                  plan.highlight ? 'bg-violet-500/5 ring-2 ring-violet-500' : ''
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-violet-500 px-3 py-1 text-xs font-medium text-white">
                    Most Popular
                  </div>
                )}
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">{plan.name}</h2>
                  <p className="text-muted-foreground text-sm">
                    {plan.subtitle}
                  </p>
                </div>
                <div className="space-y-1">
                  {plan.monthlyPrice === 'custom' ? (
                    <div className="text-4xl font-bold">Custom</div>
                  ) : (
                    <>
                      <div className="text-4xl font-bold">
                        ${annual ? plan.annualPrice : plan.monthlyPrice}
                        <span className="text-muted-foreground text-lg font-normal">
                          /mo
                        </span>
                      </div>
                      {annual && plan.monthlyPrice > 0 && (
                        <p className="text-muted-foreground text-xs">
                          Billed annually
                        </p>
                      )}
                    </>
                  )}
                </div>
                <p className="text-muted-foreground text-sm">
                  {plan.description}
                </p>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li
                      key={i}
                      className="text-muted-foreground flex gap-3 text-sm"
                    >
                      <CheckCircle
                        size={16}
                        className="mt-0.5 flex-shrink-0 text-violet-400"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.ctaLink}
                  className={`inline-flex w-full items-center justify-center gap-2 ${
                    plan.highlight ? 'btn-primary' : 'btn-ghost'
                  }`}
                >
                  {plan.cta} <ChevronRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Usage-based add-ons */}
      <section className="section-padding border-border bg-muted/20 border-b">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="space-y-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1">
              <Zap size={16} className="text-emerald-400" />
              <span className="text-sm font-medium text-emerald-300">
                Usage-Based Add-ons
              </span>
            </div>
            <h2 className="text-3xl font-bold">Scale as you grow</h2>
            <p className="text-muted-foreground mx-auto max-w-2xl">
              Need more? Pay only for what you use beyond your plan limits.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {usageAddons.map((addon) => (
              <div key={addon.name} className="card-subtle space-y-3 p-6">
                <h3 className="font-bold">{addon.name}</h3>
                <p className="text-muted-foreground text-sm">
                  {addon.description}
                </p>
                <p className="text-sm font-medium text-violet-400">
                  {addon.price}
                </p>
              </div>
            ))}
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
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding hero-gradient">
        <div className="mx-auto max-w-4xl space-y-6 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Ready to stabilize your codebase?
          </h2>
          <p className="text-muted-foreground text-lg">
            Start free. No credit card required. Upgrade when you're ready.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
            <Link
              href="/docs/quickstart"
              className="btn-primary inline-flex items-center gap-2"
            >
              Get started free <ChevronRight size={16} />
            </Link>
            <Link href="/contact" className="btn-ghost">
              Talk to sales
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
