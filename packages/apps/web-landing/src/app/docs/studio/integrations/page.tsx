import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Studio – Integration Hub Guide',
  description:
    'Connect providers, manage BYOK credentials, and sync data in the Studio Integration Hub.',
};

const flow = [
  {
    title: 'Connect a provider',
    body: 'Choose a provider from the marketplace, enter credentials, and run the test connection. Studio encrypts secrets immediately.',
  },
  {
    title: 'Schedule syncs',
    body: 'Define sync cadence (manual, hourly, daily). Studio tracks usage count and last sync timestamp.',
  },
  {
    title: 'Index knowledge',
    body: 'Add documentation or API specs as knowledge sources. Reindex whenever files change.',
  },
];

export default function StudioIntegrationsDocs() {
  return (
    <main className="space-y-12 py-12">
      <header className="space-y-3">
        <p className="text-xs font-semibold tracking-[0.3em] text-violet-400 uppercase">
          Integration hub
        </p>
        <h1 className="text-4xl font-bold">Unified connections with BYOK</h1>
        <p className="text-muted-foreground max-w-3xl text-lg">
          Manage SaaS providers and knowledge sources without scattering secrets
          across tools. Studio gives you a simple card layout plus CLI
          automation.
        </p>
      </header>
      <section className="grid gap-4 md:grid-cols-3">
        {flow.map((step) => (
          <article key={step.title} className="card-subtle space-y-2 p-6">
            <h2 className="text-xl font-semibold">{step.title}</h2>
            <p className="text-muted-foreground text-sm">{step.body}</p>
          </article>
        ))}
      </section>
      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">Monitoring</h2>
        <p className="text-muted-foreground text-sm">
          Every integration exposes sync logs and failure alerts. Use the
          webhook to forward sync events to Slack or PagerDuty.
        </p>
      </section>
    </main>
  );
}
