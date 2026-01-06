import {
  escapeRegex,
  matchStringField,
  matchVersionField,
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
 * Parses the `target: { type: 'operation', operation: { key, version } }` field.
 */
export function extractTestTarget(
  code: string
): { type: string; key: string; version: string | undefined } | undefined {
  // Match target block: target: { type: 'operation', operation: { key: '...', version: '...' } }
  // or target: { type: 'workflow', workflow: { key: '...', version: '...' } }

  // First, find the target block
  const targetBlockMatch = code.match(/target\s*:\s*\{([\s\S]*?)\}/);
  if (!targetBlockMatch?.[1]) return undefined;

  const targetBlock = targetBlockMatch[1];

  // Extract the type
  const typeMatch = targetBlock.match(/type\s*:\s*['"](\w+)['"]/);
  if (!typeMatch?.[1]) return undefined;

  const type = typeMatch[1];
  if (type !== 'operation' && type !== 'workflow') return undefined;

  // Extract the nested ref (operation or workflow block)
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
 * Checks for presence of 'expectOutput' (success) and 'expectError' (failure).
 */
export function extractTestCoverage(code: string): {
  hasSuccess: boolean;
  hasError: boolean;
} {
  const hasSuccess = /(['"]?)type\1\s*:\s*['"]expectOutput['"]/.test(code);
  const hasError = /(['"]?)type\1\s*:\s*['"]expectError['"]/.test(code);

  return { hasSuccess, hasError };
}
