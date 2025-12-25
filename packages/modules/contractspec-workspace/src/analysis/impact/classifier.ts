/**
 * Impact classifier.
 *
 * Classifies contract changes as breaking, non-breaking, or info.
 */

import type { SemanticDiffItem } from '../../types/analysis-types';
import type { SpecSnapshot } from '../snapshot/types';
import { DEFAULT_RULES, findMatchingRule } from './rules';
import type {
  ClassifyOptions,
  ImpactDelta,
  ImpactResult,
  ImpactStatus,
  ImpactSummary,
} from './types';

/**
 * Classify the impact of changes between base and head snapshots.
 *
 * @param baseSpecs - Specs from the base (baseline) version
 * @param headSpecs - Specs from the head (current) version
 * @param diffs - Semantic diff items from comparison
 * @param options - Classification options
 * @returns Classified impact result
 */
export function classifyImpact(
  baseSpecs: SpecSnapshot[],
  headSpecs: SpecSnapshot[],
  diffs: SemanticDiffItem[],
  options: ClassifyOptions = {}
): ImpactResult {
  const rules = options.customRules ?? DEFAULT_RULES;
  const deltas: ImpactDelta[] = [];

  // Create lookup maps
  const baseMap = new Map(baseSpecs.map((s) => [`${s.key}@${s.version}`, s]));
  const headMap = new Map(headSpecs.map((s) => [`${s.key}@${s.version}`, s]));

  // Detect added specs
  const addedSpecs: ImpactResult['addedSpecs'] = [];
  for (const spec of headSpecs) {
    const lookupKey = `${spec.key}@${spec.version}`;
    if (!baseMap.has(lookupKey)) {
      addedSpecs.push({
        key: spec.key,
        version: spec.version,
        type: spec.type,
      });
    }
  }

  // Detect removed specs
  const removedSpecs: ImpactResult['removedSpecs'] = [];
  for (const spec of baseSpecs) {
    const lookupKey = `${spec.key}@${spec.version}`;
    if (!headMap.has(lookupKey)) {
      removedSpecs.push({
        key: spec.key,
        version: spec.version,
        type: spec.type,
      });

      // Removed spec is always breaking
      deltas.push({
        specKey: spec.key,
        specVersion: spec.version,
        specType: spec.type,
        path: `spec.${spec.key}`,
        severity: 'breaking',
        rule: 'endpoint-removed',
        description: `${spec.type === 'operation' ? 'Operation' : 'Event'} '${spec.key}' was removed`,
      });
    }
  }

  // Classify diffs
  for (const diff of diffs) {
    const matchingRule = findMatchingRule(
      { path: diff.path, description: diff.description, type: diff.type },
      rules
    );

    // Extract spec key from path (heuristic)
    const specKey = extractSpecKey(diff.path, baseSpecs, headSpecs);
    const specInfo = findSpecInfo(specKey, baseSpecs, headSpecs);

    deltas.push({
      specKey: specInfo?.key ?? 'unknown',
      specVersion: specInfo?.version ?? 0,
      specType: specInfo?.type ?? 'operation',
      path: diff.path,
      severity: matchingRule?.severity ?? mapDiffTypeToSeverity(diff.type),
      rule: matchingRule?.id ?? 'unknown',
      description: diff.description,
      oldValue: diff.oldValue,
      newValue: diff.newValue,
    });
  }

  // Add added specs as non-breaking changes
  for (const spec of addedSpecs) {
    deltas.push({
      specKey: spec.key,
      specVersion: spec.version,
      specType: spec.type,
      path: `spec.${spec.key}`,
      severity: 'non_breaking',
      rule: 'endpoint-added',
      description: `${spec.type === 'operation' ? 'Operation' : 'Event'} '${spec.key}' was added`,
    });
  }

  // Calculate summary
  const summary = calculateSummary(deltas, addedSpecs, removedSpecs);

  // Determine status
  const hasBreaking = summary.breaking > 0 || summary.removed > 0;
  const hasNonBreaking = summary.nonBreaking > 0 || summary.added > 0;
  const status = determineStatus(hasBreaking, hasNonBreaking);

  return {
    status,
    hasBreaking,
    hasNonBreaking,
    summary,
    deltas,
    addedSpecs,
    removedSpecs,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Calculate summary counts from deltas.
 */
function calculateSummary(
  deltas: ImpactDelta[],
  addedSpecs: ImpactResult['addedSpecs'],
  removedSpecs: ImpactResult['removedSpecs']
): ImpactSummary {
  return {
    breaking: deltas.filter((d) => d.severity === 'breaking').length,
    nonBreaking: deltas.filter((d) => d.severity === 'non_breaking').length,
    info: deltas.filter((d) => d.severity === 'info').length,
    added: addedSpecs.length,
    removed: removedSpecs.length,
  };
}

/**
 * Determine overall status from flags.
 */
function determineStatus(
  hasBreaking: boolean,
  hasNonBreaking: boolean
): ImpactStatus {
  if (hasBreaking) return 'breaking';
  if (hasNonBreaking) return 'non-breaking';
  return 'no-impact';
}

/**
 * Map semantic diff type to impact severity.
 */
function mapDiffTypeToSeverity(type: string): ImpactDelta['severity'] {
  switch (type) {
    case 'breaking':
      return 'breaking';
    case 'removed':
      return 'breaking';
    case 'added':
      return 'non_breaking';
    case 'changed':
      return 'info';
    default:
      return 'info';
  }
}

/**
 * Extract spec key from a diff path (heuristic).
 */
function extractSpecKey(
  _path: string,
  _baseSpecs: SpecSnapshot[],
  _headSpecs: SpecSnapshot[]
): string | undefined {
  // This is a simplified heuristic; in practice would need more context
  return undefined;
}

/**
 * Find spec info from key.
 */
function findSpecInfo(
  key: string | undefined,
  baseSpecs: SpecSnapshot[],
  headSpecs: SpecSnapshot[]
): SpecSnapshot | undefined {
  if (!key) return headSpecs[0] ?? baseSpecs[0];
  return (
    headSpecs.find((s) => s.key === key) ??
    baseSpecs.find((s) => s.key === key)
  );
}
