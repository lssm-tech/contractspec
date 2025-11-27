import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Studio – Getting Started',
  description:
    'Create your first ContractSpec Studio project, add specs, and deploy to shared infrastructure.',
};

const steps = [
  {
    title: '1. Create a Studio workspace',
    body: 'Sign in, pick “Studio managed” as product, and invite teammates. We provision the workspace plus default shared environments.',
  },
  {
    title: '2. Add your first project',
    body: 'Click “New project”, choose Starter tier, and keep BYOK disabled for the trial. You can upgrade later.',
  },
  {
    title: '3. Author a spec',
    body: 'Use the Visual Builder or Spec Editor. Pick “Capability” as type and describe the operation (e.g., capture donation).',
  },
  {
    title: '4. Deploy to shared infra',
    body: 'Open the deployment panel, select Development, and hit Deploy. Studio provisions the runtime slice automatically.',
  },
  {
    title: '5. Wire integrations',
    body: 'From Integration Hub, connect one provider (e.g., PostHog). Starter plan supports two providers.',
  },
];

export default function StudioGettingStartedPage() {
  return (
    <main className="space-y-12 py-12">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-400">
          Getting started
        </p>
        <h1 className="text-4xl font-bold">Launch your first Studio project</h1>
        <p className="text-muted-foreground max-w-3xl text-lg">
          This short guide takes you from workspace creation to the first deployment. Every step
          is mobile-friendly and safe to undo.
        </p>
      </header>
      <section className="grid gap-4">
        {steps.map((step) => (
          <article key={step.title} className="card-subtle space-y-2 p-6">
            <h2 className="text-xl font-semibold">{step.title}</h2>
            <p className="text-muted-foreground text-sm">{step.body}</p>
          </article>
        ))}
      </section>
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">CLI helper (optional)</h2>
        <p className="text-muted-foreground text-sm">
          Prefer automation? Use the CLI to pull specs and push overlays.
        </p>
        <pre className="bg-muted/40 border-border overflow-auto rounded-xl border p-4 text-left font-mono text-sm">
{`# Authenticate
cs login

# List projects
cs studio projects list

# Pull specs locally
cs studio specs pull <project-id>

# Push after editing
cs studio specs push <project-id>`}
        </pre>
      </section>
    </main>
  );
}

