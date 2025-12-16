/**
 * Spec source scanning utilities.
 * Extracted from cli-contracts/src/utils/spec-scan.ts
 */

import type {
  AnalyzedSpecType,
  AnalyzedOperationKind,
  SpecScanResult,
  RefInfo,
} from '../types/analysis-types';
import type { Stability } from '../types/spec-types';

/**
 * Infer spec type from file path based on naming conventions.
 * Supports all contract types from @lssm/lib.contracts.
 */
export function inferSpecTypeFromFilePath(filePath: string): AnalyzedSpecType {
  // Check more specific patterns first
  if (filePath.includes('.contracts.')) return 'operation';
  if (filePath.includes('.event.')) return 'event';
  if (filePath.includes('.presentation.')) return 'presentation';
  if (filePath.includes('.feature.')) return 'feature';
  if (filePath.includes('.capability.')) return 'capability';
  if (filePath.includes('.data-view.')) return 'data-view';
  if (filePath.includes('.form.')) return 'form';
  if (filePath.includes('.migration.')) return 'migration';
  if (filePath.includes('.workflow.')) return 'workflow';
  if (filePath.includes('.experiment.')) return 'experiment';
  if (filePath.includes('.integration.')) return 'integration';
  if (filePath.includes('.knowledge.')) return 'knowledge';
  if (filePath.includes('.telemetry.')) return 'telemetry';
  if (filePath.includes('.app-config.')) return 'app-config';
  if (filePath.includes('.policy.')) return 'policy';
  if (filePath.includes('.test-spec.')) return 'test-spec';
  return 'unknown';
}

/**
 * Scan spec source code to extract metadata without executing it.
 */
export function scanSpecSource(code: string, filePath: string): SpecScanResult {
  const specType = inferSpecTypeFromFilePath(filePath);

  const name = matchStringField(code, 'name');
  const description = matchStringField(code, 'description');
  const stabilityRaw = matchStringField(code, 'stability');
  const stability = isStability(stabilityRaw) ? stabilityRaw : undefined;
  const owners = matchStringArrayField(code, 'owners');
  const tags = matchStringArrayField(code, 'tags');

  const version = matchNumberField(code, 'version');
  const kind = inferOperationKind(code);

  const hasMeta = /meta\s*:\s*{/.test(code);
  const hasIo = /\bio\s*:\s*{/.test(code);
  const hasPolicy = /\bpolicy\s*:\s*{/.test(code);
  const hasPayload = /\bpayload\s*:\s*{/.test(code);
  const hasContent = /\bcontent\s*:\s*{/.test(code);
  const hasDefinition = /\bdefinition\s*:\s*{/.test(code);

  // Extract references from operations
  const emittedEvents =
    specType === 'operation' ? extractEmittedEvents(code) : undefined;
  const policyRefs =
    specType === 'operation' ? extractPolicyRefs(code) : undefined;
  const testRefs = extractTestRefs(code);

  return {
    filePath,
    specType,
    name: name ?? undefined,
    description: description ?? undefined,
    stability,
    owners,
    tags,
    version: version ?? undefined,
    kind,
    hasMeta,
    hasIo,
    hasPolicy,
    hasPayload,
    hasContent,
    hasDefinition,
    emittedEvents,
    policyRefs,
    testRefs,
  };
}

/**
 * Extract emitted event refs from operation spec source.
 * Looks for sideEffects.emits array entries.
 */
export function extractEmittedEvents(code: string): RefInfo[] | undefined {
  const events: RefInfo[] = [];

  // Match inline emit declarations: { name: 'x', version: N, ... }
  const inlinePattern = /\{\s*name:\s*['"]([^'"]+)['"]\s*,\s*version:\s*(\d+)/g;
  let match;
  while ((match = inlinePattern.exec(code)) !== null) {
    if (match[1] && match[2]) {
      events.push({
        name: match[1],
        version: Number(match[2]),
      });
    }
  }

  // Match ref pattern: { ref: SomeEventSpec, ... }
  // We can't fully resolve these without execution, but we can note they exist
  const refPattern = /\{\s*ref:\s*(\w+)/g;
  while ((match = refPattern.exec(code)) !== null) {
    // Store a placeholder - actual resolution needs runtime
    if (match[1] && !match[1].startsWith('when')) {
      // We can't extract name/version from a variable ref statically
      // This is noted for completeness but won't be fully resolvable
    }
  }

  return events.length > 0 ? events : undefined;
}

/**
 * Extract policy refs from operation spec source.
 */
export function extractPolicyRefs(code: string): RefInfo[] | undefined {
  const policies: RefInfo[] = [];

  // Match policy ref pattern in policies array
  const policyPattern = /\{\s*name:\s*['"]([^'"]+)['"]\s*,\s*version:\s*(\d+)/g;

  // Only look within policy section
  const policySectionMatch = code.match(/policies\s*:\s*\[([\s\S]*?)\]/);
  if (policySectionMatch?.[1]) {
    let match;
    while ((match = policyPattern.exec(policySectionMatch[1])) !== null) {
      if (match[1] && match[2]) {
        policies.push({
          name: match[1],
          version: Number(match[2]),
        });
      }
    }
  }

  return policies.length > 0 ? policies : undefined;
}

/**
 * Extract test spec refs.
 */
export function extractTestRefs(code: string): RefInfo[] | undefined {
  const tests: RefInfo[] = [];

  // Look for tests array
  const testsSectionMatch = code.match(/tests\s*:\s*\[([\s\S]*?)\]/);
  if (testsSectionMatch?.[1]) {
    const refPattern = /\{\s*name:\s*['"]([^'"]+)['"]\s*,\s*version:\s*(\d+)/g;
    let match;
    while ((match = refPattern.exec(testsSectionMatch[1])) !== null) {
      if (match[1] && match[2]) {
        tests.push({
          name: match[1],
          version: Number(match[2]),
        });
      }
    }
  }

  return tests.length > 0 ? tests : undefined;
}

function matchStringField(code: string, field: string): string | null {
  const regex = new RegExp(`${escapeRegex(field)}\\s*:\\s*['"]([^'"]+)['"]`);
  const match = code.match(regex);
  return match?.[1] ?? null;
}

function matchNumberField(code: string, field: string): number | null {
  const regex = new RegExp(`${escapeRegex(field)}\\s*:\\s*(\\d+)`);
  const match = code.match(regex);
  if (!match?.[1]) return null;
  const parsed = Number(match[1]);
  return Number.isFinite(parsed) ? parsed : null;
}

function matchStringArrayField(
  code: string,
  field: string
): string[] | undefined {
  const regex = new RegExp(`${escapeRegex(field)}\\s*:\\s*\\[([\\s\\S]*?)\\]`);
  const match = code.match(regex);
  if (!match?.[1]) return undefined;

  const inner = match[1];
  const items = Array.from(inner.matchAll(/['"]([^'"]+)['"]/g))
    .map((m) => m[1])
    .filter(
      (value): value is string => typeof value === 'string' && value.length > 0
    );

  return items.length > 0 ? items : undefined;
}

function isStability(value: string | null): value is Stability {
  return (
    value === 'experimental' ||
    value === 'beta' ||
    value === 'stable' ||
    value === 'deprecated'
  );
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Infer operation kind from source code.
 * First checks for defineCommand/defineQuery usage (which set kind automatically),
 * then falls back to explicit kind field.
 */
function inferOperationKind(code: string): AnalyzedOperationKind {
  // Check for defineCommand/defineQuery usage first (they set kind automatically)
  if (/defineCommand\s*\(/.test(code)) return 'command';
  if (/defineQuery\s*\(/.test(code)) return 'query';
  // Fall back to explicit kind field
  const kindRaw = matchStringField(code, 'kind');
  return kindRaw === 'command' || kindRaw === 'query' ? kindRaw : 'unknown';
}
