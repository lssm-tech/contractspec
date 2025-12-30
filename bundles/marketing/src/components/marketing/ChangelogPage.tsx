// export const metadata: Metadata = {
//   title: 'Changelog: ContractSpec',
//   description:
//     'Updates and releases for ContractSpec. New features, improvements, and breaking changes for the spec-first compiler.',
//   keywords: [
//     'changelog',
//     'updates',
//     'releases',
//     'features',
//     'spec-first compiler',
//     'AI code stabilization',
//   ],
//   openGraph: {
//     title: 'Changelog: ContractSpec',
//     description: 'Latest releases and improvements to ContractSpec.',
//     url: 'https://contractspec.io/changelog',
//     type: 'website',
//   },
//   alternates: {
//     canonical: 'https://contractspec.io/changelog',
//   },
// };

const changes = [
  {
    version: 'canary',
    date: 'Jan 2026',
    breaking: false,
    highlights: [
      'Policy decision points (PDP)',
      'Intent → specs compiler',
      'Audit log export (CSV/JSON)',
      'Policy decision replay',
    ],
  },
  {
    version: 'v1.46.0',
    date: 'Dec 2025',
    breaking: true,
    highlights: [
      'Initial public version',
      'Multi-layer support (presentations, mcp, endpoints, operations, events, ...)',
      'JsonSchema and OpenAPI support',
      'Multi AI-agent providers integrations',
    ],
  },
];

export function ChangelogPage() {
  return (
    <main className="pt-24">
      {/* Hero */}
      <section className="section-padding hero-gradient border-border relative border-b">
        <div className="mx-auto max-w-4xl space-y-6 text-center">
          <h1 className="text-5xl leading-tight font-bold md:text-6xl">
            Changelog
          </h1>
          <p className="text-muted-foreground text-lg">
            Latest releases and improvements to ContractSpec.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding">
        <div className="mx-auto max-w-2xl space-y-6">
          {changes.map((change, i) => (
            <div key={i} className="card-subtle space-y-4 p-6">
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="text-lg font-bold">{change.version}</h3>
                  <p className="text-muted-foreground text-sm">{change.date}</p>
                </div>
                {change.breaking && (
                  <span className="rounded border border-red-500/50 bg-red-500/20 px-3 py-1 text-xs font-bold text-red-300">
                    BREAKING
                  </span>
                )}
              </div>
              <ul className="space-y-2">
                {change.highlights.map((highlight, j) => (
                  <li
                    key={j}
                    className="text-muted-foreground flex items-start gap-3 text-sm"
                  >
                    <span className="flex-shrink-0 text-violet-400">→</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
