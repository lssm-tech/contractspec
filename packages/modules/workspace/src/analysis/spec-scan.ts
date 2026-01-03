/**
 * Spec source scanning utilities.
 * Extracted from cli-contractspec/src/utils/spec-scan.ts
 */

import type {
  AnalyzedOperationKind,
  AnalyzedSpecType,
  RefInfo,
  SpecScanResult,
} from '../types/analysis-types';
import type { Stability } from '../types/spec-types';

/**
 * Infer spec type from file path based on naming conventions.
 * Supports all contract types from @contractspec/lib.contracts.
 */
export function inferSpecTypeFromFilePath(filePath: string): AnalyzedSpecType {
  // Check more specific patterns first
  // Operation patterns: .contracts. OR /contracts/ directory
  if (
    filePath.includes('.contracts.') ||
    filePath.includes('.operations.') ||
    filePath.includes('/operations/') ||
    filePath.includes('.operation.') ||
    filePath.includes('/operation/')
  )
    return 'operation';

  // Event patterns: .event. OR /events/ OR /events.ts
  if (
    filePath.includes('.event.') ||
    filePath.includes('/events/') ||
    filePath.endsWith('/events.ts')
  )
    return 'event';

  // Presentation patterns: .presentation. OR /presentations/ OR /presentations.ts
  if (
    filePath.includes('.presentation.') ||
    filePath.includes('/presentations/') ||
    filePath.endsWith('/presentations.ts')
  )
    return 'presentation';

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

  const key = matchStringField(code, 'key');
  const description = matchStringField(code, 'description');
  const goal = matchStringField(code, 'goal');
  const context = matchStringField(code, 'context');
  const stabilityRaw = matchStringField(code, 'stability');
  const stability = isStability(stabilityRaw) ? stabilityRaw : undefined;
  const owners = matchStringArrayField(code, 'owners');
  const tags = matchStringArrayField(code, 'tags');

  const version = matchVersionField(code, 'version');
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
    key: key ?? undefined,
    description: description ?? undefined,
    goal: goal ?? undefined,
    context: context ?? undefined,
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
    sourceBlock: code,
  };
}

/**
 * Extract emitted event refs from operation spec source.
 * Looks for sideEffects.emits array entries.
 */
export function extractEmittedEvents(code: string): RefInfo[] | undefined {
  const events: RefInfo[] = [];

  // Match inline emit declarations: { key: 'x', version: '1' or 1, ... }
  const inlinePattern =
    /\{\s*key:\s*['"]([^'"]+)['"]\s*,\s*version:\s*(?:['"]([^'"]+)['"]|(\d+(?:\.\d+)*))/g;
  let match;
  while ((match = inlinePattern.exec(code)) !== null) {
    const key = match[1];
    const version = match[2] || match[3];
    if (key && version) {
      events.push({ key, version });
    }
  }

  // Match ref pattern: { ref: SomeEventSpec, ... }
  // We can't fully resolve these without execution, but we can note they exist
  const refPattern = /\{\s*ref:\s*(\w+)/g;
  while ((match = refPattern.exec(code)) !== null) {
    // Store a placeholder - actual resolution needs runtime
    if (match[1] && !match[1].startsWith('when')) {
      // We can't extract key/version from a variable ref statically
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
  const policyPattern =
    /\{\s*key:\s*['"]([^'"]+)['"]\s*,\s*version:\s*(?:['"]([^'"]+)['"]|(\d+(?:\.\d+)*))/g;

  // Only look within policy section
  const policySectionMatch = code.match(/policies\s*:\s*\[([\s\S]*?)\]/);
  if (policySectionMatch?.[1]) {
    let match;
    while ((match = policyPattern.exec(policySectionMatch[1])) !== null) {
      const key = match[1];
      const version = match[2] || match[3];
      if (key && version) {
        policies.push({ key, version });
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
    const refPattern =
      /\{\s*key:\s*['"]([^'"]+)['"]\s*,\s*version:\s*(?:['"]([^'"]+)['"]|(\d+(?:\.\d+)*))/g;
    let match;
    while ((match = refPattern.exec(testsSectionMatch[1])) !== null) {
      const key = match[1];
      const version = match[2] || match[3];
      if (key && version) {
        tests.push({ key, version });
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

function matchVersionField(code: string, field: string): string | undefined {
  const regex = new RegExp(
    `${escapeRegex(field)}\\s*:\\s*(?:['"]([^'"]+)['"]|(\\d+(?:\\.\\d+)*))`
  );
  const match = code.match(regex);
  if (match?.[1]) return match[1];
  if (match?.[2]) return match[2];
  return undefined;
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

/**
 * Infer operation kind from a specific code block.
 */
function inferOperationKindFromBlock(block: string): AnalyzedOperationKind {
  if (/defineCommand\s*\(/.test(block)) return 'command';
  if (/defineQuery\s*\(/.test(block)) return 'query';
  const kindRaw = matchStringField(block, 'kind');
  return kindRaw === 'command' || kindRaw === 'query' ? kindRaw : 'unknown';
}

/**
 * Extract key and version from a meta block.
 */
function extractMetaFromBlock(
  block: string
): { key: string; version: string } | null {
  const key = matchStringField(block, 'key');
  const version = matchVersionField(block, 'version');
  if (key && version !== undefined) {
    return { key, version };
  }
  return null;
}

/**
 * Define function patterns for all spec types.
 */
const DEFINE_FUNCTION_PATTERNS = [
  // Operations
  { pattern: /defineCommand\s*\(\s*\{/g, type: 'operation' as const },
  { pattern: /defineQuery\s*\(\s*\{/g, type: 'operation' as const },
  // Events
  { pattern: /defineEvent\s*\(\s*\{/g, type: 'event' as const },
  // Presentations (both v1 and v2 patterns)
  {
    pattern: /:\s*PresentationSpec\s*=\s*\{/g,
    type: 'presentation' as const,
  },
  {
    pattern: /:\s*PresentationSpec\s*=\s*\{/g,
    type: 'presentation' as const,
  },
  {
    pattern: /:\s*PresentationDescriptor\s*=\s*\{/g,
    type: 'presentation' as const,
  },
  { pattern: /definePresentation\s*\(\s*\{/g, type: 'presentation' as const },
  // Capabilities
  { pattern: /defineCapability\s*\(\s*\{/g, type: 'capability' as const },
  // Workflows
  { pattern: /defineWorkflow\s*\(\s*\{/g, type: 'workflow' as const },
  // Experiments
  { pattern: /defineExperiment\s*\(\s*\{/g, type: 'experiment' as const },
  // Integrations
  { pattern: /defineIntegration\s*\(\s*\{/g, type: 'integration' as const },
  // Knowledge
  { pattern: /defineKnowledge\s*\(\s*\{/g, type: 'knowledge' as const },
  // Telemetry
  { pattern: /defineTelemetry\s*\(\s*\{/g, type: 'telemetry' as const },
  // App config
  { pattern: /defineAppConfig\s*\(\s*\{/g, type: 'app-config' as const },
  // Policy
  { pattern: /definePolicy\s*\(\s*\{/g, type: 'policy' as const },
  // Test spec
  { pattern: /defineTestSpec\s*\(\s*\{/g, type: 'test-spec' as const },
  // Data view
  { pattern: /defineDataView\s*\(\s*\{/g, type: 'data-view' as const },
  // Form
  { pattern: /defineForm\s*\(\s*\{/g, type: 'form' as const },
  // Migration
  { pattern: /defineMigration\s*\(\s*\{/g, type: 'migration' as const },
];

/**
 * Find matching closing brace for an opening brace.
 * Returns the index of the closing brace or -1 if not found.
 */
function findMatchingBrace(code: string, startIndex: number): number {
  let depth = 0;
  let inString = false;
  let stringChar = '';

  for (let i = startIndex; i < code.length; i++) {
    const char = code[i];
    const prevChar = i > 0 ? code[i - 1] : '';

    // Handle string literals
    if ((char === '"' || char === "'" || char === '`') && prevChar !== '\\') {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
      }
      continue;
    }

    if (inString) continue;

    if (char === '{') {
      depth++;
    } else if (char === '}') {
      depth--;
      if (depth === 0) {
        return i;
      }
    }
  }

  return -1;
}

/**
 * Scan spec source code to extract ALL specs from a file.
 * This function finds multiple spec definitions in a single file.
 */
export function scanAllSpecsFromSource(
  code: string,
  filePath: string
): SpecScanResult[] {
  const results: SpecScanResult[] = [];
  const baseSpecType = inferSpecTypeFromFilePath(filePath);

  // Track positions we've already processed to avoid duplicates
  const processedPositions = new Set<number>();

  for (const { pattern, type } of DEFINE_FUNCTION_PATTERNS) {
    // Reset the regex lastIndex
    pattern.lastIndex = 0;

    let match;
    while ((match = pattern.exec(code)) !== null) {
      const startPos = match.index;

      // Skip if we've already processed this position
      if (processedPositions.has(startPos)) continue;
      processedPositions.add(startPos);

      // Find the opening brace position
      const openBracePos = code.indexOf('{', startPos);
      if (openBracePos === -1) continue;

      // Find the matching closing brace
      const closeBracePos = findMatchingBrace(code, openBracePos);
      if (closeBracePos === -1) continue;

      // Extract the block content
      const block = code.slice(openBracePos, closeBracePos + 1);

      // Extract meta information
      const meta = extractMetaFromBlock(block);
      if (!meta) continue;

      // Extract additional metadata
      const description = matchStringField(block, 'description');
      const goal = matchStringField(block, 'goal');
      const context = matchStringField(block, 'context');
      const stabilityRaw = matchStringField(block, 'stability');
      const stability = isStability(stabilityRaw) ? stabilityRaw : undefined;
      const owners = matchStringArrayField(block, 'owners');
      const tags = matchStringArrayField(block, 'tags');

      const hasMeta = /meta\s*:\s*{/.test(block);
      const hasIo = /\bio\s*:\s*{/.test(block);
      const hasPolicy = /\bpolicy\s*:\s*{/.test(block);
      const hasPayload = /\bpayload\s*:\s*{/.test(block);
      const hasContent = /\bcontent\s*:\s*{/.test(block);
      const hasDefinition = /\bdefinition\s*:\s*{/.test(block);

      // Infer kind for operations
      const kind =
        type === 'operation' ? inferOperationKindFromBlock(block) : 'unknown';

      // Extract references from operations
      const emittedEvents =
        type === 'operation' ? extractEmittedEvents(block) : undefined;
      const policyRefs =
        type === 'operation' ? extractPolicyRefs(block) : undefined;
      const testRefs = extractTestRefs(block);

      results.push({
        filePath,
        specType: type,
        key: meta.key,
        version: meta.version,
        description: description ?? undefined,
        goal: goal ?? undefined,
        context: context ?? undefined,
        stability,
        owners,
        tags,
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
        sourceBlock: block,
      });
    }
  }

  // If no specs found via patterns, fall back to file-type based scanning
  // This handles cases where the file uses non-standard patterns
  if (results.length === 0 && baseSpecType !== 'unknown') {
    const fallback = scanSpecSource(code, filePath);
    if (fallback.key && fallback.version !== undefined) {
      results.push({ ...fallback, sourceBlock: code });
    }
  }

  return results;
}
