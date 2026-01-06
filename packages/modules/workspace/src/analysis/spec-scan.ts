/**
 * Spec scanning utilities.
 *
 * Scans source code to extract spec definitions and metadata without execution.
 */

import type { SpecScanResult } from '../types/analysis-types';

import {
  findMatchingBrace,
  isStability,
  matchStringArrayField,
  matchStringField,
  matchVersionField,
} from './utils/matchers';

import {
  parsePolicy,
  extractRefList,
  extractTestRefs,
  extractTestCoverage,
} from './spec-parsing-utils';

export { extractTestTarget, extractTestCoverage } from './spec-parsing-utils';

/**
 * Scan all specs from a single source file.
 */
export function scanAllSpecsFromSource(
  code: string,
  filePath: string
): SpecScanResult[] {
  const results: SpecScanResult[] = [];

  // Match export definitions: export const X = defineXXX calls
  const definitionRegex =
    /export\s+const\s+(\w+)\s*=\s*define(Command|Query|Event|Presentation|Capability|Policy|Type)\s*\(/g;
  let match;

  while ((match = definitionRegex.exec(code)) !== null) {
    const start = match.index;
    const end = findMatchingBrace(code, start + match[0].length);
    if (end === -1) continue;

    const block = code.substring(start, end + 1);
    const result = scanSpecSource(block, filePath);
    if (result) {
      results.push(result);
    }
  }

  // Fallback: legacy file scan if no explicit exports found
  if (results.length === 0 && filePath.includes('.spec.')) {
    const result = scanSpecSource(code, filePath);
    if (result.key !== 'unknown') {
      results.push(result);
    }
  }

  return results;
}

/**
 * Scan a single spec source string.
 */
export function scanSpecSource(code: string, filePath: string): SpecScanResult {
  const keyMatch =
    code.match(/key\s*:\s*['"]([^'"]+)['"]/) ??
    code.match(/export\s+const\s+(\w+)\s*=/);
  const key = keyMatch?.[1] ?? 'unknown';

  const version = matchVersionField(code, 'version');
  const description = matchStringField(code, 'description') ?? undefined;
  const goal = matchStringField(code, 'goal') ?? undefined;
  const context = matchStringField(code, 'context') ?? undefined;
  const stabilityRaw = matchStringField(code, 'stability');
  const stability = isStability(stabilityRaw) ? stabilityRaw : undefined;
  const owners = matchStringArrayField(code, 'owners');
  const tags = matchStringArrayField(code, 'tags');

  // Determine type
  let specType: SpecScanResult['specType'] = 'unknown';
  let kind: string | undefined;

  if (code.includes('defineCommand')) {
    specType = 'operation';
    kind = 'command';
  } else if (code.includes('defineQuery')) {
    specType = 'operation';
    kind = 'query';
  } else if (code.includes('defineEvent')) {
    specType = 'event';
    kind = 'event';
  } else if (code.includes('definePresentation')) {
    specType = 'presentation';
    kind = 'presentation';
  } else if (code.includes('definePolicy')) {
    specType = 'policy';
    kind = 'policy';
  } else if (code.includes('defineCapability')) {
    specType = 'capability';
    kind = 'capability';
  } else if (code.includes('defineType')) {
    specType = 'type';
    kind = 'type';
  }

  // Check feature flags/sections
  const hasMeta = /meta\s*:\s*\{/.test(code);
  const hasIo = /io\s*:\s*\{/.test(code);
  const hasPolicy = /policy\s*:\s*\{/.test(code);
  const hasPayload = /payload\s*:\s*\{/.test(code);
  const hasContent = /content\s*:\s*\{/.test(code);
  const hasDefinition = /definition\s*:\s*\{/.test(code);

  // References
  const emittedEvents =
    extractRefList(code, 'emits') ?? extractRefList(code, 'emittedEvents');
  const testRefs = extractTestRefs(code);

  const policyRefs = hasPolicy ? parsePolicy(code) : undefined;

  return {
    filePath,
    key,
    version,
    specType,
    kind: kind as SpecScanResult['kind'],
    description,
    goal,
    context,
    stability,
    owners,
    tags,
    hasMeta,
    hasIo,
    hasPolicy,
    hasPayload,
    hasContent,
    hasDefinition,
    emittedEvents,
    policyRefs,
    testRefs,
    testCoverage: extractTestCoverage(code),
    sourceBlock: code,
  };
}

/**
 * Infer spec type from file path convention.
 */
export function inferSpecTypeFromFilePath(
  filePath: string
): SpecScanResult['specType'] | 'feature' | 'unknown' {
  if (filePath.includes('.contracts.') || /\/operations?\//.test(filePath)) {
    return 'operation';
  }
  if (filePath.includes('.event.') || /\/events?\//.test(filePath)) {
    return 'event';
  }
  if (
    filePath.includes('.presentation.') ||
    /\/presentations?\//.test(filePath)
  ) {
    return 'presentation';
  }
  if (filePath.includes('.policy.') || /\/policies?\//.test(filePath)) {
    return 'policy';
  }
  if (filePath.includes('.feature.') || /\/features?\//.test(filePath)) {
    return 'feature';
  }
  if (filePath.includes('.type.') || /\/types?\//.test(filePath)) {
    return 'type';
  }
  return 'unknown';
}
