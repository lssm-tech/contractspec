'use client';

import { DataViewRenderer } from '@contractspec/lib.design-system';
import { VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { ContractReferenceDataView } from '@contractspec/lib.contracts/docs';
import type { DocsIndexEntry } from '../generated/docs-index.generated';
import { DocsMarkdownContent } from './DocsMarkdownContent';

interface DocsReferenceContentProps {
  entry: DocsIndexEntry;
  content: string;
}

function extractMeta(content: string, label: string) {
  const match = content.match(new RegExp(`- \\*\\*${label}\\*\\*: (.+)`, 'i'));
  return match?.[1]?.trim();
}

function cleanSummary(summary?: string) {
  if (!summary) return undefined;
  return summary
    .replace(/<!--.*?-->/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function DocsReferenceContent({
  entry,
  content,
}: DocsReferenceContentProps) {
  const summary = cleanSummary(entry.summary);
  const type = extractMeta(content, 'Type');
  const version = extractMeta(content, 'Version') ?? entry.version;
  const tags = extractMeta(content, 'Tags')
    ?.split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
  const owners = extractMeta(content, 'Owners')
    ?.split(',')
    .map((owner) => owner.trim())
    .filter(Boolean);
  const stability = extractMeta(content, 'Stability') ?? entry.visibility;

  const referenceItem = {
    reference: {
      key: entry.title ?? entry.id,
      version,
      type,
      title: entry.title ?? entry.id,
      description: summary,
      tags: tags ?? entry.tags,
      owners: owners ?? entry.owners,
      stability,
    },
  };

  const detailSpec = {
    ...ContractReferenceDataView,
    meta: {
      ...ContractReferenceDataView.meta,
      title: entry.title ?? ContractReferenceDataView.meta.title,
      description: summary ?? ContractReferenceDataView.meta.description,
    },
  };

  return (
    <VStack gap="xl">
      <DataViewRenderer spec={detailSpec} item={referenceItem} />
      <DocsMarkdownContent content={content} />
    </VStack>
  );
}
