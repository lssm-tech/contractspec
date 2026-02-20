'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Pack, TagCount } from '@/lib/registry-api';
import { PackCard } from './pack-card';

const SORT_OPTIONS = [
  { value: 'downloads', label: 'Most Downloads' },
  { value: 'weekly', label: 'Trending' },
  { value: 'updated', label: 'Recently Updated' },
  { value: 'name', label: 'Name A-Z' },
] as const;

const TARGET_OPTIONS = [
  'cursor',
  'opencode',
  'claudecode',
  'copilot',
  'windsurf',
  'aider',
  'roo',
] as const;

interface PackSearchClientProps {
  initialPacks: Pack[];
  initialTotal: number;
  tags: TagCount[];
  initialQuery: string;
  initialSort: string;
  initialPage: number;
}

export function PackSearchClient({
  initialPacks,
  initialTotal,
  tags,
  initialQuery,
  initialSort,
  initialPage,
}: PackSearchClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);

  const updateSearch = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
      params.delete('page'); // Reset to page 1 on filter change
      router.push(`/registry/packs?${params.toString()}`);
    },
    [router, searchParams]
  );

  const totalPages = Math.ceil(initialTotal / 20);

  return (
    <div className="section-padding">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Browse Packs</h1>
          <p className="text-muted-foreground mt-2">
            {initialTotal} pack{initialTotal !== 1 ? 's' : ''} available
          </p>
        </div>

        {/* Search + Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex-1">
            <input
              type="search"
              placeholder="Search packs..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') updateSearch({ q: query });
              }}
              className="border-border bg-card placeholder:text-muted-foreground focus:ring-primary w-full rounded-lg border px-4 py-2 text-sm focus:ring-2 focus:outline-none"
            />
          </div>
          <select
            value={initialSort}
            onChange={(e) => updateSearch({ sort: e.target.value })}
            className="border-border bg-card rounded-lg border px-3 py-2 text-sm"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tag pills */}
        {tags.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {tags.slice(0, 20).map((t) => (
              <button
                type="button"
                key={t.tag}
                onClick={() => updateSearch({ q: t.tag })}
                className="badge text-xs"
              >
                {t.tag}
                <span className="text-muted-foreground ml-1">({t.count})</span>
              </button>
            ))}
          </div>
        )}

        {/* Target filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          {TARGET_OPTIONS.map((target) => (
            <button
              type="button"
              key={target}
              onClick={() => updateSearch({ q: `target:${target}` })}
              className="border-border text-muted-foreground hover:border-primary hover:text-primary rounded-md border px-2.5 py-1 text-xs transition-colors"
            >
              {target}
            </button>
          ))}
        </div>

        {/* Results grid */}
        {initialPacks.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-muted-foreground text-lg">
              No packs found{initialQuery ? ` for "${initialQuery}"` : ''}.
            </p>
            <p className="text-muted-foreground mt-2 text-sm">
              Try a different search term or browse all packs.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {initialPacks.map((pack) => (
              <PackCard key={pack.name} pack={pack} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {initialPage > 1 && (
              <button
                type="button"
                onClick={() => updateSearch({ page: String(initialPage - 1) })}
                className="btn-ghost px-3 py-1 text-sm"
              >
                Previous
              </button>
            )}
            <span className="text-muted-foreground text-sm">
              Page {initialPage} of {totalPages}
            </span>
            {initialPage < totalPages && (
              <button
                type="button"
                onClick={() => updateSearch({ page: String(initialPage + 1) })}
                className="btn-ghost px-3 py-1 text-sm"
              >
                Next
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
