import type { Metadata } from 'next';
import Link from 'next/link';

import { Bot, Layers3, Map, Plug, Rocket, Shield, Sparkles, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Studio Features – ContractSpec',
  description:
    'Deep dive into the ContractSpec Studio modules: visual builder, auto-evolution, lifecycle advisor, integration hub, and knowledge layer.',
};

const featureAreas = [
  {
    title: 'Visual builder + specs',
    icon: Layers3,
    body: 'Canvas, component palette, spec editor, and deploy panel working together. Mobile-first UI with undo history.',
    bullets: [
      'Drag-and-drop canvas synced to Studio specs',
      'Component palette with intents and bindings',
      'Deployment panels for shared & dedicated infra',
    ],
  },
  {
    title: 'Progressive Delivery & QA',
    icon: Rocket,
    body: 'Deploy with confidence using canary rollouts, traffic mirroring, and automated golden tests from production data.',
    bullets: [
      'Multi-environment pipelines (Dev, Staging, Prod)',
      'Canary & Blue-Green strategies with auto-rollback',
      'Golden test generation from real traffic',
    ],
  },
  {
    title: 'Auto-evolution',
    icon: Sparkles,
    body: 'Safe regeneration that analyzes telemetry to evolve specs while preserving invariants.',
    bullets: [
      'Analyze telemetry to find usage anomalies',
      'Personalization adapters for tailored UI overlays',
      'Safe spec regeneration with approval workflows',
    ],
  },
  {
    title: 'Lifecycle advisor',
    icon: Map,
    body: 'Guidance layer that converts assessments into learning paths, library recommendations, and ceremony payloads.',
    bullets: [
      'Stage detection from questionnaires + analytics',
      'Personalized learning paths & certifications',
      'Ceremony templates & library adoption plans',
    ],
  },
  {
    title: 'AI Growth Engine',
    icon: TrendingUp,
    body: 'Experiment orchestration and automated content generation to drive product growth without a full platform.',
    bullets: [
      'Typed A/B testing & multi-arm bandits',
      'Generate blogs, landing pages & email drips',
      'SEO optimization & analytics tracking',
    ],
  },
  {
    title: 'AI Support Desk',
    icon: Bot,
    body: 'Production-ready support automation with knowledge grounding, ticket classification, and safety guardrails.',
    bullets: [
      'Auto-resolution with RAG pipelines',
      'Tone-aware responses & escalation policies',
      'Sentiment analysis & ticket classification',
    ],
  },
  {
    title: 'Integration & knowledge hub',
    icon: Plug,
    body: 'BYOK credential manager, sync monitor, and knowledge source indexing for RAG workflows.',
    bullets: [
      'Provider marketplace with categories',
      'Encrypted credential vault per tenant',
      'Knowledge source indexing + reindex buttons',
    ],
  },
  {
    title: 'Security & governance',
    icon: Shield,
    body: 'BYOK enforcement, audit logs, and feature flags to stage rollouts safely.',
    bullets: [
      'Per-tenant encryption material',
      'Granular feature flags for Studio modules',
      'Audit events for deploy, sync, lifecycle changes',
    ],
  },
];

export default function StudioFeaturesPage() {
  return (
    <main className="space-y-16 py-16">
      <section className="section-padding text-center">
        <p className="text-xs font-semibold tracking-[0.3em] text-violet-400 uppercase">
          Studio features
        </p>
        <h1 className="mt-4 text-4xl font-bold">
          One platform, modular layers.
        </h1>
        <p className="text-muted-foreground mx-auto mt-4 max-w-3xl text-lg">
          ContractSpec Studio orchestrates visual building, lifecycle guidance,
          auto-evolution, integrations, and documentation pipelines. Pick the
          layers you need, enable more when you grow.
        </p>
      </section>
      <section className="section-padding grid gap-6 md:grid-cols-2">
        {featureAreas.map((feature) => (
          <article
            key={feature.title}
            className="card-subtle space-y-4 p-6 transition hover:border-violet-500/40"
          >
            <feature.icon className="h-8 w-8 text-violet-400" />
            <div>
              <h2 className="text-2xl font-semibold">{feature.title}</h2>
              <p className="text-muted-foreground mt-2 text-sm">
                {feature.body}
              </p>
            </div>
            <ul className="space-y-2 text-sm">
              {feature.bullets.map((bullet) => (
                <li key={bullet}>• {bullet}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
      <section className="section-padding text-center">
        <p className="text-sm tracking-[0.3em] text-violet-400 uppercase">
          Next steps
        </p>
        <h2 className="mt-3 text-3xl font-semibold">
          Try Studio or chat with our crew.
        </h2>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/studio/pricing"
            className="btn-primary"
          >
            Compare plans
          </Link>
          <Link
            href="/studio/docs"
            className="btn-ghost"
          >
            Browse docs
          </Link>
        </div>
      </section>
    </main>
  );
}
