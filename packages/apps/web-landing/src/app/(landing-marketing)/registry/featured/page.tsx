import type { Metadata } from 'next';
import Link from 'next/link';
import { getFeaturedPacks } from '@/lib/registry-api';

export const metadata: Metadata = {
  title: 'Featured Packs | agentpacks Registry',
  description: 'Curated selection of the best agentpacks for AI coding tools.',
};

export default async function FeaturedPage() {
  const { packs } = await getFeaturedPacks(20, {
    next: { revalidate: 300 },
  });

  return (
    <div className="section-padding">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Featured Packs</h1>
          <p className="text-muted-foreground mt-2">
            Hand-picked packs recommended by the agentpacks team.
          </p>
        </div>

        {/* Grid */}
        {packs.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-muted-foreground text-lg">
              No featured packs available yet.
            </p>
            <Link
              href="/registry/packs"
              className="text-primary mt-4 inline-block hover:underline"
            >
              Browse all packs →
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {packs.map((pack) => (
              <Link
                key={pack.name}
                href={`/registry/packs/${pack.name}`}
                className="card-subtle group border-border hover:border-primary/50 hover:shadow-primary/5 flex flex-col rounded-xl border p-6 transition-all hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <h3 className="text-foreground group-hover:text-primary text-lg font-semibold">
                    {pack.displayName}
                  </h3>
                  {pack.verified && (
                    <span className="bg-primary/10 text-primary rounded px-2 py-0.5 text-xs font-medium">
                      Verified
                    </span>
                  )}
                </div>

                <p className="text-muted-foreground mt-2 flex-1 text-sm">
                  {pack.description}
                </p>

                <div className="text-muted-foreground mt-4 flex items-center justify-between text-xs">
                  <span>{pack.authorName}</span>
                  <span>{pack.downloads.toLocaleString()} downloads</span>
                </div>

                {pack.targets.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {pack.targets.map((target) => (
                      <span
                        key={target}
                        className="bg-muted/50 text-muted-foreground rounded px-1.5 py-0.5 text-xs"
                      >
                        {target}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/registry/packs"
            className="btn-ghost inline-block px-6 py-2 text-sm"
          >
            Browse all packs →
          </Link>
        </div>
      </div>
    </div>
  );
}
