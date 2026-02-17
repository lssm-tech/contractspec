import Link from '@contractspec/lib.ui-link';

const coreLoop = [
  {
    title: 'Evidence',
    body: 'Ingest product signals from meetings, support, analytics, code reviews, docs, and Slack.',
  },
  {
    title: 'Correlation',
    body: 'Cluster signals into scored patterns with hybrid heuristics plus AI signature extraction.',
  },
  {
    title: 'Decision',
    body: 'Create timeboxed focus zones and evidence-backed briefs with citation chains.',
  },
  {
    title: 'Change',
    body: 'Compile patch intents into spec diffs, deterministic impact reports, and task packs.',
  },
  {
    title: 'Export',
    body: 'Push deliverables to Linear, Jira, Notion, and GitHub with full decision context.',
  },
  {
    title: 'Check + Autopilot',
    body: 'Verify outcomes, capture learning dividends, and automate safely with policy gates.',
  },
];

export function StudioOverviewPage() {
  return (
    <main className="space-y-12 py-16">
      <section className="section-padding space-y-4">
        <p className="text-xs font-semibold tracking-[0.3em] text-violet-400 uppercase">
          ContractSpec Studio
        </p>
        <h1 className="text-4xl font-bold md:text-5xl">
          Compiler for product truth
        </h1>
        <p className="text-muted-foreground max-w-3xl text-lg">
          ContractSpec Studio is the AI-powered product decision engine built on
          top of ContractSpec. It turns product signals into spec-first
          deliverables through a deterministic loop:
        </p>
        <p className="text-muted-foreground font-mono text-sm">
          Evidence -&gt; Correlation -&gt; Decision -&gt; Change -&gt; Export
          -&gt; Check -&gt; Notify -&gt; Autopilot
        </p>
      </section>

      <section className="section-padding grid gap-4 md:grid-cols-2">
        {coreLoop.map((step) => (
          <article key={step.title} className="card-subtle space-y-2 p-6">
            <h2 className="text-xl font-semibold">{step.title}</h2>
            <p className="text-muted-foreground text-sm">{step.body}</p>
          </article>
        ))}
      </section>

      <section className="section-padding card-subtle space-y-4 p-6">
        <h2 className="text-2xl font-semibold">Use Studio now</h2>
        <p className="text-muted-foreground text-sm">
          Studio is live and runs the same spec-first grammar as the OSS
          compiler. Keep your contracts, keep your code, and add a full
          decision-to-change workflow on top.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="https://app.contractspec.studio" className="btn-primary">
            Try Studio
          </Link>
          <Link
            href="https://app.contractspec.studio/docs"
            className="btn-ghost"
          >
            Read Studio docs
          </Link>
        </div>
      </section>
    </main>
  );
}
