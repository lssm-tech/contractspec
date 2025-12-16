/**
 * Semantic diff computation for contract specs.
 * Extracted from cli-contracts/src/commands/diff/semantic.ts
 */

import type {
  SemanticDiffItem,
  SemanticDiffOptions,
  SpecScanResult,
} from '../../types/analysis-types';
import { scanSpecSource } from '../spec-scan';

/**
 * Compute semantic differences between two spec sources.
 */
export function computeSemanticDiff(
  aCode: string,
  aPath: string,
  bCode: string,
  bPath: string,
  options: SemanticDiffOptions = {}
): SemanticDiffItem[] {
  const a = scanSpecSource(aCode, aPath);
  const b = scanSpecSource(bCode, bPath);

  const diffs: SemanticDiffItem[] = [];

  compareScalar(diffs, 'specType', a.specType, b.specType, {
    breaking: true,
    label: 'Spec type',
  });

  compareScalar(diffs, 'name', a.name, b.name, {
    breaking: true,
    label: 'Name',
  });
  compareScalar(diffs, 'version', a.version, b.version, {
    breaking: true,
    label: 'Version',
  });
  compareScalar(diffs, 'kind', a.kind, b.kind, {
    breaking: true,
    label: 'Kind',
  });

  compareScalar(diffs, 'stability', a.stability, b.stability, {
    breaking: isStabilityDowngrade(a, b),
    label: 'Stability',
  });

  compareArray(diffs, 'owners', a.owners ?? [], b.owners ?? [], {
    label: 'Owners',
  });
  compareArray(diffs, 'tags', a.tags ?? [], b.tags ?? [], { label: 'Tags' });

  compareStructuralHints(diffs, a, b);

  const filtered = options.breakingOnly
    ? diffs.filter((d) => d.type === 'breaking')
    : diffs;

  return filtered;
}

function compareScalar(
  diffs: SemanticDiffItem[],
  path: string,
  a: unknown,
  b: unknown,
  config: { breaking: boolean; label: string }
) {
  if (a === b) return;
  diffs.push({
    type: config.breaking ? 'breaking' : 'changed',
    path,
    oldValue: a,
    newValue: b,
    description: `${config.label} changed`,
  });
}

function compareArray(
  diffs: SemanticDiffItem[],
  path: string,
  a: string[],
  b: string[],
  config: { label: string }
) {
  const aSorted = [...a].sort();
  const bSorted = [...b].sort();
  if (JSON.stringify(aSorted) === JSON.stringify(bSorted)) return;

  diffs.push({
    type: 'changed',
    path,
    oldValue: aSorted,
    newValue: bSorted,
    description: `${config.label} changed`,
  });
}

function isStabilityDowngrade(a: SpecScanResult, b: SpecScanResult): boolean {
  const order: Record<string, number> = {
    experimental: 0,
    beta: 1,
    stable: 2,
    deprecated: 3,
  };
  const aValue = a.stability ? (order[a.stability] ?? 0) : 0;
  const bValue = b.stability ? (order[b.stability] ?? 0) : 0;
  // Moving toward deprecated is effectively a breaking signal for consumers.
  return bValue > aValue;
}

function compareStructuralHints(
  diffs: SemanticDiffItem[],
  a: SpecScanResult,
  b: SpecScanResult
) {
  // For operations these sections are usually required; missing them is breaking.
  compareScalar(diffs, 'hasMeta', a.hasMeta, b.hasMeta, {
    breaking: a.specType === 'operation' || b.specType === 'operation',
    label: 'meta section presence',
  });
  compareScalar(diffs, 'hasIo', a.hasIo, b.hasIo, {
    breaking: a.specType === 'operation' || b.specType === 'operation',
    label: 'io section presence',
  });
  compareScalar(diffs, 'hasPolicy', a.hasPolicy, b.hasPolicy, {
    breaking: a.specType === 'operation' || b.specType === 'operation',
    label: 'policy section presence',
  });
  compareScalar(diffs, 'hasPayload', a.hasPayload, b.hasPayload, {
    breaking: a.specType === 'event' || b.specType === 'event',
    label: 'payload section presence',
  });
  compareScalar(diffs, 'hasContent', a.hasContent, b.hasContent, {
    breaking: a.specType === 'presentation' || b.specType === 'presentation',
    label: 'content section presence',
  });
  compareScalar(diffs, 'hasDefinition', a.hasDefinition, b.hasDefinition, {
    breaking: a.specType === 'workflow' || b.specType === 'workflow',
    label: 'definition section presence',
  });
}


