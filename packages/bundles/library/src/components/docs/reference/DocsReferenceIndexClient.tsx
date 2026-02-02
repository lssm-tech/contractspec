'use client';

import { useMemo, useState } from 'react';
import {
  DataViewList,
  formRenderer,
  StatusChip,
} from '@contractspec/lib.design-system';
import { VStack, HStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { H1, Muted } from '@contractspec/lib.ui-kit-web/ui/typography';
import {
  DocsIndexDataView,
  DocsSearchForm,
} from '@contractspec/lib.contracts/docs';
import type { DocsIndexEntry } from '../generated/docs-index.generated';

interface Filters {
  query?: string;
  visibility?: string;
  kind?: string;
}

interface DocsReferenceIndexClientProps {
  entries: readonly DocsIndexEntry[];
}

function cleanSummary(summary?: string) {
  if (!summary) return undefined;
  return summary
    .replace(/<!--.*?-->/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function normalizeEntry(entry: DocsIndexEntry): DocsIndexEntry {
  const summary = cleanSummary(entry.summary);
  const kind =
    entry.kind ?? (entry.source === 'generated' ? 'reference' : undefined);
  const visibility =
    entry.visibility ?? (entry.source === 'generated' ? 'public' : undefined);

  return {
    ...entry,
    summary,
    kind,
    visibility,
  };
}

function matchesQuery(entry: DocsIndexEntry, query: string) {
  if (!query) return true;
  const haystack = [entry.title, entry.summary, entry.id, ...(entry.tags ?? [])]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return haystack.includes(query.toLowerCase());
}

export function DocsReferenceIndexClient({
  entries,
}: DocsReferenceIndexClientProps) {
  const [filters, setFilters] = useState<Filters>({});

  const normalizedEntries = useMemo(
    () => entries.map(normalizeEntry),
    [entries]
  );

  const filteredEntries = useMemo(() => {
    const query = filters.query?.trim() ?? '';
    return normalizedEntries.filter((entry) => {
      if (filters.kind && entry.kind !== filters.kind) return false;
      if (filters.visibility && entry.visibility !== filters.visibility)
        return false;
      return matchesQuery(entry, query);
    });
  }, [filters, normalizedEntries]);

  const searchForm = formRenderer.render(DocsSearchForm, {
    defaultValues: {
      query: filters.query ?? '',
      visibility: filters.visibility ?? '',
      kind: filters.kind ?? '',
    },
    overrides: {
      onSubmitOverride: (values: unknown) => {
        const submitted = values as Filters;
        setFilters({
          query: submitted.query ?? '',
          visibility: submitted.visibility ?? '',
          kind: submitted.kind ?? '',
        });
      },
    },
  });

  return (
    <VStack gap="xl">
      <VStack gap="sm">
        <H1>Contract Reference</H1>
        <Muted>
          Auto-generated reference docs for operations, events, forms, data
          views, and presentations.
        </Muted>
      </VStack>

      <VStack gap="sm" className="max-w-2xl">
        {searchForm}
      </VStack>

      <DataViewList
        spec={DocsIndexDataView}
        items={filteredEntries}
        emptyState={<Muted>No reference docs match your filters.</Muted>}
        onSelect={(entry) => {
          if (entry.route) {
            window.location.assign(entry.route);
          }
        }}
        renderActions={(entry) => {
          return (
            <HStack gap="xs" justify="end">
              {entry.kind ? <StatusChip size="sm" label={entry.kind} /> : null}
              {entry.visibility ? (
                <StatusChip size="sm" label={entry.visibility} />
              ) : null}
              {entry.version ? (
                <StatusChip size="sm" label={`v${entry.version}`} />
              ) : null}
            </HStack>
          );
        }}
      />
    </VStack>
  );
}
