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

// export const metadata: Metadata = {
//   title: 'Changelog: ContractSpec',
//   ...
// };

export interface ChangelogEntry {
  version: string;
  date: string;
  isBreaking: boolean;
  packages: {
    name: string;
    changes: string[];
  }[];
}

interface ChangelogPageProps {
  entries: ChangelogEntry[];
}

export function ChangelogPage({ entries }: ChangelogPageProps) {
  return (
    <main>
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
        <div className="mx-auto max-w-3xl space-y-8">
          {entries.map((entry, i) => (
            <div
              key={i}
              className="card-subtle flex flex-col gap-6 p-8 md:flex-row md:items-start"
            >
              {/* Left: Version & Date */}
              <div className="md:w-48 md:flex-shrink-0">
                <div className="sticky top-24">
                  <h3 className="text-2xl font-bold tracking-tight">
                    {entry.version}
                  </h3>
                  <time className="text-muted-foreground mt-1 block text-sm font-medium">
                    {entry.date}
                  </time>
                  {entry.isBreaking && (
                    <span className="mt-2 inline-flex items-center rounded-full border border-red-500/50 bg-red-500/10 px-2.5 py-0.5 text-xs font-semibold text-red-500">
                      Breaking Change
                    </span>
                  )}
                </div>
              </div>

              {/* Right: Changes per package */}
              <div className="flex-1 space-y-6">
                {entry.packages.map((pkg, j) => (
                  <div key={j} className="space-y-3">
                    <h4 className="font-mono text-sm font-semibold text-violet-400">
                      {pkg.name}
                    </h4>
                    <ul className="space-y-2">
                      {pkg.changes.map((change, k) => (
                        <li
                          key={k}
                          className="text-muted-foreground flex items-start gap-3 text-base leading-relaxed"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-violet-500/50" />
                          <span>{change}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
