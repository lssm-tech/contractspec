import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, ShieldCheck, HeadphonesIcon } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Studio Pricing – ContractSpec',
  description:
    'Pricing for ContractSpec Studio managed platform: Starter, Professional, and Enterprise tiers.',
};

const plans = [
  {
    name: 'Starter',
    price: 'Free (beta)',
    description: 'Great for prototyping with shared infrastructure.',
    items: [
      'Shared deployments (DEV + STAGE)',
      'Visual builder & spec editor',
      'Lifecycle stage detection (basic)',
      'Up to 2 integrations',
      'Community channels',
    ],
    cta: 'Start building',
  },
  {
    name: 'Professional',
    price: '$890 / month',
    description:
      'For product teams that need dedicated slices, auto-evolution, and BYOK.',
    items: [
      'Dedicated staging runtime',
      'Auto-evolution suggestions',
      'BYOK credential manager',
      'Lifecycle ceremonies + tracker',
      'Priority support (48h SLA)',
    ],
    highlight: true,
    cta: 'Upgrade to Pro',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description:
      'Multi-region, high-compliance deployments with our managed ops team.',
    items: [
      'Dedicated clusters per environment',
      'Regional isolation + SSO',
      'Customer bespoke ceremonies',
      '24/7 on-call + onboarding team',
      'Feature flag governance',
    ],
    cta: 'Talk to sales',
  },
];

const faqs = [
  {
    question: 'What does BYOK cover?',
    answer:
      'BYOK encrypts integration credentials, deployment secrets, and knowledge source data with tenant-specific material. Keys can live in your HSM or Vault—we only derive data-plane keys.',
  },
  {
    question: 'How do dedicated deployments work?',
    answer:
      'Professional tier gives you isolated runtime slices in our clusters. Enterprise provisions new clusters within your cloud or our managed environment with signed SLAs.',
  },
  {
    question: 'Is there an onboarding service?',
    answer:
      'Enterprise plans include a lifecycle coach and platform engineer for the first 90 days. Professional teams can purchase onboarding credits if needed.',
  },
];

export default function StudioPricingPage() {
  return (
    <main className="space-y-16 py-16">
      <section className="section-padding text-center">
        <p className="text-xs font-semibold tracking-[0.3em] text-violet-400 uppercase">
          Pricing
        </p>
        <h1 className="mt-4 text-4xl font-bold">
          Predictable plans, no surprise overages.
        </h1>
        <p className="text-muted-foreground mx-auto mt-4 max-w-3xl text-lg">
          Every tier includes managed deployments, lifecycle analytics, and
          support. Upgrade when you need dedicated infrastructure or tighter
          SLAs.
        </p>
      </section>

      <section className="section-padding grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <article
            key={plan.name}
            className={`rounded-2xl border p-6 ${
              plan.highlight
                ? 'border-violet-500/40 bg-violet-500/5 shadow-lg'
                : 'border-border bg-card'
            }`}
          >
            <p className="text-sm font-semibold tracking-wide uppercase">
              {plan.name}
            </p>
            <p className="mt-4 text-3xl font-bold">{plan.price}</p>
            <p className="text-muted-foreground mt-2 text-sm">
              {plan.description}
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {plan.items.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/contact"
              className={`btn-primary mt-6 inline-flex w-full justify-center ${
                plan.highlight ? '' : 'btn-ghost'
              }`}
            >
              {plan.cta}
            </Link>
          </article>
        ))}
      </section>

      <section className="section-padding grid gap-6 md:grid-cols-2">
        <div className="card-subtle p-6">
          <ShieldCheck className="h-8 w-8 text-violet-400" />
          <h2 className="mt-4 text-2xl font-semibold">All plans include</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>• Shared telemetry + insights dashboard</li>
            <li>• Feature flag controls per module</li>
            <li>• Knowledge source indexing (100k tokens)</li>
            <li>• Mobile-friendly Studio console</li>
          </ul>
        </div>
        <div className="card-subtle p-6">
          <HeadphonesIcon className="h-8 w-8 text-violet-400" />
          <h2 className="mt-4 text-2xl font-semibold">
            Need purchasing support?
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            We can help with vendor onboarding, security questionnaires, or
            data-processing agreements. Reach out to the team and we will share
            the compliance pack.
          </p>
          <Link href="/contact" className="btn-primary mt-4 inline-flex">
            Contact sales
          </Link>
        </div>
      </section>

      <section className="section-padding space-y-4">
        <h2 className="text-3xl font-semibold">Frequently asked questions</h2>
        <div className="space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="border-border bg-card rounded-xl border p-4"
            >
              <summary className="cursor-pointer text-lg font-semibold">
                {faq.question}
              </summary>
              <p className="text-muted-foreground mt-2 text-sm">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
