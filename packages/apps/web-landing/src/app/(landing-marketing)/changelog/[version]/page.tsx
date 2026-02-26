import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getChangelogReleaseByVersion,
  getChangelogVersions,
} from '@/lib/changelog';

interface PageProps {
  params: Promise<{ version: string }>;
}

export const dynamicParams = false;

function formatDate(date: string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

export async function generateStaticParams() {
  const versions = await getChangelogVersions();
  return versions.map((version) => ({ version }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { version } = await params;
  const release = await getChangelogReleaseByVersion(version);

  if (!release) {
    return {
      title: 'Release Not Found | ContractSpec',
    };
  }

  return {
    title: `Changelog ${release.version} | ContractSpec`,
    description: `${release.changeCount} unique changes across ${release.packageCount} packages.`,
  };
}

export default async function ChangelogVersionPage({ params }: PageProps) {
  const { version } = await params;
  const release = await getChangelogReleaseByVersion(version);

  if (!release) {
    notFound();
  }

  return (
    <main>
      <section className="section-padding hero-gradient border-border relative border-b">
        <div className="mx-auto max-w-5xl space-y-4">
          <Link
            href="/changelog"
            className="text-muted-foreground text-sm hover:underline"
          >
            Back to changelog index
          </Link>
          <h1 className="text-5xl leading-tight font-bold md:text-6xl">
            {release.version}
          </h1>
          <p className="text-muted-foreground text-lg">
            {formatDate(release.date)} · {release.packageCount} packages ·{' '}
            {release.changeCount} unique changes
          </p>
          <div className="flex flex-wrap gap-2">
            {release.layers.map((layer) => (
              <span
                key={`${release.version}-${layer}`}
                className="border-border text-muted-foreground rounded-full border px-2 py-0.5 text-xs"
              >
                {layer}
              </span>
            ))}
            {release.isBreaking && (
              <span className="inline-flex items-center rounded-full border border-red-500/50 bg-red-500/10 px-2 py-0.5 text-xs font-semibold text-red-500">
                Breaking changes
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="mx-auto max-w-5xl space-y-6">
          <article className="card-subtle space-y-4 p-6">
            <h2 className="text-xl font-semibold">Unique release changes</h2>
            <ul className="space-y-3">
              {release.changes.map((change) => (
                <li
                  key={`${release.version}-${change.text}`}
                  className="space-y-2"
                >
                  <p className="text-sm leading-relaxed">- {change.text}</p>
                  <p className="text-muted-foreground text-xs">
                    {change.packages.length} packages · {change.occurrences}{' '}
                    occurrences
                  </p>
                </li>
              ))}
            </ul>
          </article>

          <article className="card-subtle space-y-4 p-6">
            <h2 className="text-xl font-semibold">Impacted packages</h2>
            <ul className="grid gap-3 md:grid-cols-2">
              {release.packages.map((pkg) => (
                <li
                  key={`${release.version}-${pkg.name}`}
                  className="border-border rounded-md border p-3"
                >
                  <p className="font-mono text-sm">{pkg.name}</p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Layer: {pkg.layer} · {pkg.changes.length} changes
                  </p>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </main>
  );
}
