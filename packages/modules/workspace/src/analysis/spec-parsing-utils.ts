import {
  escapeRegex,
  matchStringField,
  matchVersionField,
  findMatchingDelimiter,
} from './utils/matchers';

export function parsePolicy(code: string): { key: string; version: string }[] {
  const policyBlock = code.match(/policy\s*:\s*\{([\s\S]*?)\}/);
  if (!policyBlock?.[1]) return [];

  return extractRefList(policyBlock[1], 'policies') ?? [];
}

export function extractRefList(
  code: string,
  field: string
): { key: string; version: string }[] | undefined {
  const regex = new RegExp(`${escapeRegex(field)}\\s*:\\s*\\[([\\s\\S]*?)\\]`);
  const match = code.match(regex);
  if (!match?.[1]) return undefined;

  const inner = match[1];
  const items: { key: string; version: string }[] = [];

  const parts = inner.match(/\{[\s\S]*?\}/g);
  if (parts) {
    for (const part of parts) {
      const k = matchStringField(part, 'key');
      const v = matchVersionField(part, 'version');
      if (k) {
        items.push({ key: k, version: v ?? '1.0.0' });
      }
    }
  }

  return items.length > 0 ? items : undefined;
}

export function extractTestRefs(
  code: string
): { key: string; version: string; type: 'success' | 'error' }[] | undefined {
  const regex = new RegExp(`testRefs\\s*:\\s*\\[([\\s\\S]*?)\\]`);
  const match = code.match(regex);
  if (!match?.[1]) return undefined;

  const inner = match[1];
  const items: { key: string; version: string; type: 'success' | 'error' }[] =
    [];

  const parts = inner.match(/\{[\s\S]*?\}/g);
  if (parts) {
    for (const part of parts) {
      const k = matchStringField(part, 'key');
      const v = matchVersionField(part, 'version');
      const t = matchStringField(part, 'type');
      if (k) {
        items.push({
          key: k,
          version: v ?? '1.0.0',
          type: t === 'error' ? 'error' : 'success',
        });
      }
    }
  }

  return items.length > 0 ? items : undefined;
}

/**
 * Extract test target from a TestSpec source.
 * Parses the `target: { type: 'operation', key, version }` field OR
 * the nested format `target: { type: 'operation', operation: { key, version } }`.
 */
export function extractTestTarget(
  code: string
): { type: 'operation' | 'workflow'; key: string; version: string | undefined } | undefined {
  // Find target block start
  const targetStartMatch = code.match(/target\s*:\s*\{/);
  if (!targetStartMatch || targetStartMatch.index === undefined) return undefined;

  const openBraceIndex = targetStartMatch.index + targetStartMatch[0].length - 1;
  const closeBraceIndex = findMatchingDelimiter(code, openBraceIndex, '{', '}');
  
  if (closeBraceIndex === -1) return undefined;

  const targetBlock = code.substring(openBraceIndex + 1, closeBraceIndex);

  // Extract the type
  const typeMatch = targetBlock.match(/type\s*:\s*['"](\w+)['"]/);
  if (!typeMatch?.[1]) return undefined;

  const type = typeMatch[1];
  if (type !== 'operation' && type !== 'workflow') return undefined;

  // Try flat format first: { type: 'operation', key: '...', version: '...' }
  const flatKey = matchStringField(targetBlock, 'key');
  if (flatKey) {
    const flatVersion = matchVersionField(targetBlock, 'version');
    return {
      type,
      key: flatKey,
      version: flatVersion,
    };
  }

  // Try nested format: { type: 'operation', operation: { key: '...', version: '...' } }
  const refBlockMatch = targetBlock.match(
    new RegExp(`${type}\\s*:\\s*\\{([\\s\\S]*?)\\}`)
  );
  
  if (!refBlockMatch?.[1]) return undefined;

  const refBlock = refBlockMatch[1];

  // Extract key and version from the ref block
  const key = matchStringField(refBlock, 'key');
  if (!key) return undefined;

  const version = matchVersionField(refBlock, 'version');

  return {
    type,
    key,
    version,
  };
}

/**
 * Extract test coverage info from a TestSpec source.
 * Checks for presence of success (expectOutput) and failure (expectError) scenarios.
 * Supports both formats:
 * - New: `expectOutput: {}` and `expectError: {}`
 * - Old: `{ type: 'expectOutput', ... }` and `{ type: 'expectError', ... }`
 */
export function extractTestCoverage(code: string): {
  hasSuccess: boolean;
  hasError: boolean;
} {
  // Check new format: expectOutput: or expectError: as keys
  const hasSuccessNew = /expectOutput\s*:/.test(code);
  const hasErrorNew = /expectError\s*:/.test(code);
  
  // Check old format: { type: 'expectOutput' } or { type: 'expectError' }
  const hasSuccessOld = /(['"]?)type\1\s*:\s*['"]expectOutput['"]/.test(code);
  const hasErrorOld = /(['"]?)type\1\s*:\s*['"]expectError['"]/.test(code);

  return { 
    hasSuccess: hasSuccessNew || hasSuccessOld, 
    hasError: hasErrorNew || hasErrorOld 
  };
}
