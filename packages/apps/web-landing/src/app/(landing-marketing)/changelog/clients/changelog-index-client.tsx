'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { ChangelogManifest } from '@/lib/changelog';

const STORAGE_KEY = 'contractspec.changelog.preferences.v1';

interface ChangelogIndexClientProps {
  manifest: ChangelogManifest;
}

interface SavedPreferences {
  query: string;
  layer: string;
  breakingOnly: boolean;
  pageSize: number;
}

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

export function ChangelogIndexClient({ manifest }: ChangelogIndexClientProps) {
  const defaultPageSize = manifest.config.defaultPageSize;
  const [query, setQuery] = useState('');
  const [layer, setLayer] = useState('all');
  const [breakingOnly, setBreakingOnly] = useState(false);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [visibleCount, setVisibleCount] = useState(defaultPageSize);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return;
      }

      const saved = JSON.parse(raw) as Partial<SavedPreferences>;
      if (typeof saved.query === 'string') {
        setQuery(saved.query);
      }
      if (typeof saved.layer === 'string') {
        setLayer(saved.layer);
      }
      if (typeof saved.breakingOnly === 'boolean') {
        setBreakingOnly(saved.breakingOnly);
      }
      if (typeof saved.pageSize === 'number' && saved.pageSize > 0) {
        setPageSize(saved.pageSize);
        setVisibleCount(saved.pageSize);
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    const saved: SavedPreferences = {
      query,
      layer,
      breakingOnly,
      pageSize,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  }, [breakingOnly, layer, pageSize, query]);

  useEffect(() => {
    setVisibleCount(pageSize);
  }, [pageSize, query, layer, breakingOnly]);

  const filteredReleases = useMemo(() => {
    const loweredQuery = query.trim().toLowerCase();

    return manifest.releases.filter((release) => {
      if (breakingOnly && !release.isBreaking) {
        return false;
      }

      if (layer !== 'all' && !release.layers.includes(layer)) {
        return false;
      }

      if (!loweredQuery) {
        return true;
      }

      if (release.version.toLowerCase().includes(loweredQuery)) {
        return true;
      }

      return release.highlights.some((highlight) =>
        highlight.toLowerCase().includes(loweredQuery)
      );
    });
  }, [breakingOnly, layer, manifest.releases, query]);

  const visibleReleases = filteredReleases.slice(0, visibleCount);
  const hasMore = visibleReleases.length < filteredReleases.length;

  return (
    <main>
      <section className="section-padding hero-gradient border-border relative border-b">
        <div className="mx-auto max-w-5xl space-y-5">
          <h1 className="text-5xl leading-tight font-bold md:text-6xl">
            Changelog
          </h1>
          <p className="text-muted-foreground max-w-3xl text-lg">
            Versioned release history optimized for fast delivery. Filter by
            scope, search highlights, and open detailed release notes on demand.
          </p>
          <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
            <span>{manifest.totalReleases} releases indexed</span>
            <span>{manifest.availableLayers.length} architecture layers</span>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="mx-auto flex max-w-5xl flex-col gap-5">
          <div className="card-subtle grid gap-3 p-4 md:grid-cols-4">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search version or highlights"
              className="border-border bg-background rounded-md border px-3 py-2 text-sm"
            />
            <select
              value={layer}
              onChange={(event) => setLayer(event.target.value)}
              className="border-border bg-background rounded-md border px-3 py-2 text-sm"
            >
              <option value="all">All layers</option>
              {manifest.availableLayers.map((layerOption) => (
                <option key={layerOption} value={layerOption}>
                  {layerOption}
                </option>
              ))}
            </select>
            <select
              value={String(pageSize)}
              onChange={(event) => setPageSize(Number(event.target.value))}
              className="border-border bg-background rounded-md border px-3 py-2 text-sm"
            >
              {[10, 20, 40].map((size) => (
                <option key={size} value={size}>
                  {size} per page
                </option>
              ))}
            </select>
            <label className="text-muted-foreground flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={breakingOnly}
                onChange={(event) => setBreakingOnly(event.target.checked)}
              />
              Breaking changes only
            </label>
          </div>

          {visibleReleases.map((release) => (
            <article
              key={release.version}
              className="card-subtle space-y-4 p-6"
            >
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href={`/changelog/${release.version}`}
                  className="text-2xl font-semibold tracking-tight hover:underline"
                >
                  {release.version}
                </Link>
                <span className="text-muted-foreground text-sm">
                  {formatDate(release.date)}
                </span>
                {release.isBreaking && (
                  <span className="inline-flex items-center rounded-full border border-red-500/50 bg-red-500/10 px-2 py-0.5 text-xs font-semibold text-red-500">
                    Breaking
                  </span>
                )}
              </div>

              <p className="text-muted-foreground text-sm">
                {release.packageCount} packages impacted · {release.changeCount}{' '}
                unique changes
              </p>

              <div className="flex flex-wrap gap-2">
                {release.layers.map((layerName) => (
                  <span
                    key={`${release.version}-${layerName}`}
                    className="border-border text-muted-foreground rounded-full border px-2 py-0.5 text-xs"
                  >
                    {layerName}
                  </span>
                ))}
              </div>

              {release.highlights.length > 0 && (
                <ul className="space-y-2">
                  {release.highlights.map((highlight) => (
                    <li
                      key={`${release.version}-${highlight}`}
                      className="text-muted-foreground text-sm"
                    >
                      - {highlight}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}

          {filteredReleases.length === 0 && (
            <div className="card-subtle text-muted-foreground p-6 text-sm">
              No release matches your filters.
            </div>
          )}

          {hasMore && (
            <button
              type="button"
              onClick={() => setVisibleCount((value) => value + pageSize)}
              className="border-border hover:bg-muted w-full rounded-md border px-4 py-2 text-sm font-medium"
            >
              Load more releases
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
