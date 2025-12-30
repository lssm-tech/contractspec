// export const metadata: Metadata = {
//   title: 'Studio – Deployment Guide',
//   description:
//     'Learn how Studio provisions shared and dedicated environments, monitors health, and rolls back safely.',
// };

const comparisons = [
  {
    label: 'Shared',
    points: [
      'Ready in seconds',
      'DEV + STAGE by default',
      'Best for prototypes',
      'Managed SSL',
    ],
  },
  {
    label: 'Dedicated',
    points: [
      'Isolated clusters',
      'Choose region + VPC',
      'Rolling deploys',
      'Custom observability sinks',
    ],
  },
];

const checklist = [
  'Validate specs before deploying (Studio does this automatically).',
  'Tag deployments with a description so rituals have context.',
  'Monitor status cards—failed deploys trigger alerts and auto rollback.',
  'Use the CLI to export deployment manifests if you want infra-as-code.',
];

export default function StudioDeploymentsDocs() {
  return (
    <main className="space-y-12 py-12">
      <header className="space-y-3">
        <p className="text-xs font-semibold tracking-[0.3em] text-violet-400 uppercase">
          Deployments
        </p>
        <h1 className="text-4xl font-bold">Shared vs dedicated workflows</h1>
        <p className="text-muted-foreground max-w-3xl text-lg">
          Studio abstracts infra, but you still stay in control. This guide
          explains how environments are provisioned, monitored, and rolled back.
        </p>
      </header>
      <section className="grid gap-4 md:grid-cols-2">
        {comparisons.map((option) => (
          <article key={option.label} className="card-subtle space-y-2 p-6">
            <h2 className="text-2xl font-semibold">
              {option.label} deployments
            </h2>
            <ul className="space-y-1 text-sm">
              {option.points.map((point) => (
                <li key={point}>• {point}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Health & rollback</h2>
        <p className="text-muted-foreground text-sm">
          Every deployment emits health events. If a check fails, Studio pauses
          traffic and offers rollback controls with diff context.
        </p>
        <ul className="space-y-2 text-sm">
          {checklist.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
