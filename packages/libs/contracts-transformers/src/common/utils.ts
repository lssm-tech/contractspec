/**
 * Common utilities for contract transformations.
 */

/**
 * Convert a string to PascalCase.
 */
export function toPascalCase(str: string): string {
  return str
    .replace(/[-_./\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^./, (c) => c.toUpperCase());
}

/**
 * Convert a string to camelCase.
 */
export function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

/**
 * Convert a string to kebab-case.
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_./]+/g, '-')
    .toLowerCase();
}

/**
 * Convert a string to snake_case.
 */
export function toSnakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s\-./]+/g, '_')
    .toLowerCase();
}

/**
 * Sanitize a string to be a valid TypeScript identifier.
 */
export function toValidIdentifier(str: string): string {
  // Remove invalid characters
  let result = str.replace(/[^a-zA-Z0-9_$]/g, '_');
  // Ensure it doesn't start with a number
  if (/^[0-9]/.test(result)) {
    result = '_' + result;
  }
  return result;
}

/**
 * Generate a ContractSpec key from an operation identifier.
 */
export function toSpecKey(operationId: string, prefix?: string): string {
  const key = toCamelCase(operationId);
  return prefix ? `${prefix}.${key}` : key;
}

/**
 * Generate a file name from a spec name.
 */
export function toFileName(specName: string): string {
  return toKebabCase(specName.replace(/\./g, '-')) + '.ts';
}

/**
 * Deep equality check for objects.
 */
export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a === null || b === null) return false;
  if (typeof a !== typeof b) return false;

  if (typeof a === 'object') {
    const aObj = a as Record<string, unknown>;
    const bObj = b as Record<string, unknown>;

    const aKeys = Object.keys(aObj);
    const bKeys = Object.keys(bObj);

    if (aKeys.length !== bKeys.length) return false;

    for (const key of aKeys) {
      if (!bKeys.includes(key)) return false;
      if (!deepEqual(aObj[key], bObj[key])) return false;
    }

    return true;
  }

  return false;
}

/**
 * Get a value from an object by JSON path.
 */
export function getByPath(obj: unknown, path: string): unknown {
  const parts = path.split('.').filter(Boolean);
  let current: unknown = obj;

  for (const part of parts) {
    if (current === null || current === undefined) return undefined;
    if (typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[part];
  }

  return current;
}

/**
 * Extract path parameters from a URL path template.
 * e.g., "/users/{userId}/orders/{orderId}" -> ["userId", "orderId"]
 */
export function extractPathParams(path: string): string[] {
  const matches = path.match(/\{([^}]+)\}/g) || [];
  return matches.map((m) => m.slice(1, -1));
}

/**
 * Normalize a URL path for comparison.
 */
export function normalizePath(path: string): string {
  // Remove leading/trailing slashes
  let normalized = path.replace(/^\/+|\/+$/g, '');
  // Replace multiple slashes with single
  normalized = normalized.replace(/\/+/g, '/');
  // Add leading slash
  return '/' + normalized;
}
