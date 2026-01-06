/**
 * Shared regex matchers and parsing utilities for spec scanning.
 */

import type { Stability } from '../../types/spec-types';

/**
 * Escape regex special characters.
 */
export function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Match a string field in source code.
 */
export function matchStringField(code: string, field: string): string | null {
  const regex = new RegExp(`${escapeRegex(field)}\\s*:\\s*['"]([^'"]+)['"]`);
  const match = code.match(regex);
  return match?.[1] ?? null;
}

/**
 * Match a string field within a limited scope.
 */
export function matchStringFieldIn(code: string, field: string): string | null {
  return matchStringField(code, field);
}

/**
 * Match a version field which can be a string or number.
 */
export function matchVersionField(
  code: string,
  field: string
): string | undefined {
  const regex = new RegExp(
    `${escapeRegex(field)}\\s*:\\s*(?:['"]([^'"]+)['"]|(\\d+(?:\\.\\d+)*))`
  );
  const match = code.match(regex);
  if (match?.[1]) return match[1];
  if (match?.[2]) return match[2];
  return undefined;
}

/**
 * Match a string array field in source code.
 */
export function matchStringArrayField(
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

/**
 * Check if a value is a valid stability.
 */
export function isStability(value: string | null): value is Stability {
  return (
    value === 'experimental' ||
    value === 'beta' ||
    value === 'stable' ||
    value === 'deprecated'
  );
}

/**
 * Find matching closing brace for an opening brace.
 * Returns the index of the closing brace or -1 if not found.
 */
export function findMatchingBrace(code: string, startIndex: number): number {
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
