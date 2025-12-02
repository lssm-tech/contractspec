import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpenCheck, FileCode, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Studio Docs Hub – ContractSpec',
  description:
    'Central hub for ContractSpec Studio documentation: getting started, visual builder, deployments, BYOK, and integrations.',
};

const docLinks = [
  {
    title: 'Getting started',
    href: '/docs/studio/getting-started',
    body: 'Create your first Studio project, add specs, and deploy to shared infrastructure.',
  },
  {
    title: 'Visual builder guide',
    href: '/docs/studio/visual-builder',
    body: 'Canvas walkthrough, component palette, and spec validation tips.',
  },
  {
    title: 'Deployment playbook',
    href: '/docs/studio/deployments',
    body: 'Shared vs dedicated environments, health checks, and rollback procedures.',
  },
  {
    title: 'BYOK setup',
    href: '/docs/studio/byok',
    body: 'Key derivation, credential rotation, and audit events.',
  },
  {
    title: 'Integration hub',
    href: '/docs/studio/integrations',
    body: 'Connect data providers, sync schedules, and monitor usage.',
  },
];

export default function StudioDocsIndexPage() {
  return (
    <main className="space-y-16 py-16">
      <section className="section-padding text-center">
        <p className="text-xs font-semibold tracking-[0.3em] text-violet-400 uppercase">
          Docs hub
        </p>
        <h1 className="mt-4 text-4xl font-bold">
          ContractSpec Studio documentation
        </h1>
        <p className="text-muted-foreground mx-auto mt-4 max-w-3xl text-lg">
          Learn how to build with the Studio managed platform: from connecting
          knowledge sources to orchestration of lifecycle ceremonies.
          Future-friendly, mobile-first guides.
        </p>
      </section>

      <section className="section-padding grid gap-4 md:grid-cols-2">
        {docLinks.map((link) => (
          <Link
            key={link.title}
            href={link.href}
            className="card-subtle group space-y-3 p-6 transition hover:border-violet-500/40"
          >
            <h2 className="text-xl font-semibold group-hover:text-violet-400">
              {link.title}
            </h2>
            <p className="text-muted-foreground text-sm">{link.body}</p>
          </Link>
        ))}
      </section>

      <section className="section-padding grid gap-6 md:grid-cols-3">
        <article className="card-subtle space-y-3 p-6">
          <BookOpenCheck className="h-8 w-8 text-violet-400" />
          <h3 className="text-lg font-semibold">Guided tours</h3>
          <p className="text-muted-foreground text-sm">
            Each doc includes a “show me” script tuned for low-tech audiences.
            Pair it with a Studio tour and you are live in 15 minutes.
          </p>
        </article>
        <article className="card-subtle space-y-3 p-6">
          <FileCode className="h-8 w-8 text-violet-400" />
          <h3 className="text-lg font-semibold">Spec examples</h3>
          <p className="text-muted-foreground text-sm">
            Copy-and-paste snippets for capability specs, overlay composition,
            and integration hooks.
          </p>
        </article>
        <article className="card-subtle space-y-3 p-6">
          <Sparkles className="h-8 w-8 text-violet-400" />
          <h3 className="text-lg font-semibold">Auto-evolution notes</h3>
          <p className="text-muted-foreground text-sm">
            Understand how signals feed the evolution module, what each
            suggestion means, and how to approve with confidence.
          </p>
        </article>
      </section>
    </main>
  );
}
