import type { ParsedSpec } from '../types/llm-types';
import type { DocBlock, DocKind } from '@contractspec/lib.contracts/docs';
import { specToMarkdown } from './spec-markdown';

/**
 * Convert a parsed spec to a DocBlock for documentation generation.
 */
export function convertSpecToDocBlock(
  spec: ParsedSpec,
  options?: { rootPath?: string }
): DocBlock {
  const body = specToMarkdown(spec, 'full', { rootPath: options?.rootPath });

  return {
    id: spec.meta.key,
    title: spec.meta.description
      ? `${spec.meta.key} - ${spec.meta.description}`
      : spec.meta.key,
    body: body,
    summary: spec.meta.description,
    kind: mapSpecTypeToDocKind(spec.specType),
    visibility: 'public', // Default to public for now
    version: spec.meta.version,
    tags: spec.meta.tags,
    owners: spec.meta.owners,
    stability: spec.meta.stability,
    domain: inferDomain(spec.meta.key),
    relatedSpecs: extractRelatedSpecs(spec),
  };
}

function mapSpecTypeToDocKind(specType: string): DocKind {
  switch (specType) {
    case 'feature':
      return 'goal'; // Features often describe goals
    case 'operation':
      return 'reference';
    case 'event':
      return 'reference';
    case 'presentation':
      return 'usage';
    default:
      return 'reference';
  }
}

function inferDomain(key: string): string | undefined {
  const parts = key.split('.');
  if (parts.length > 2) {
    return parts[0]; // e.g. "crm.users.create" -> "crm"
  }
  return undefined;
}

function extractRelatedSpecs(spec: ParsedSpec): string[] {
  const related: string[] = [];

  if (spec.emittedEvents) {
    related.push(...spec.emittedEvents.map((r) => r.name));
  }
  if (spec.operations) {
    related.push(...spec.operations.map((r) => r.name));
  }
  if (spec.events) {
    related.push(...spec.events.map((r) => r.name));
  }
  if (spec.testRefs) {
    related.push(...spec.testRefs.map((r) => r.name));
  }

  return [...new Set(related)];
}
