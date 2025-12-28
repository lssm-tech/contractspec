/**
 * JSON normalization utilities for deterministic snapshots.
 *
 * Ensures that snapshots are stable across ordering, whitespace,
 * and other non-semantic differences.
 */

import { createHash } from 'crypto';

/**
 * Normalize a value for deterministic JSON serialization.
 * - Sorts object keys alphabetically
 * - Removes undefined values
 * - Preserves null values
 */
export function normalizeValue(value: unknown): unknown {
  if (value === null || value === undefined) {
    return value === null ? null : undefined;
  }

  if (Array.isArray(value)) {
    return value.map(normalizeValue);
  }

  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const sortedKeys = Object.keys(obj).sort();
    const normalized: Record<string, unknown> = {};

    for (const key of sortedKeys) {
      const normalizedValue = normalizeValue(obj[key]);
      // Only include defined values
      if (normalizedValue !== undefined) {
        normalized[key] = normalizedValue;
      }
    }

    return normalized;
  }

  return value;
}

/**
 * Serialize a value to deterministic JSON string.
 */
export function toCanonicalJson(value: unknown): string {
  return JSON.stringify(normalizeValue(value), null, 0);
}

/**
 * Compute a SHA-256 hash of canonical JSON representation.
 */
export function computeHash(value: unknown): string {
  const canonical = toCanonicalJson(value);
  return createHash('sha256').update(canonical).digest('hex').slice(0, 16);
}

/**
 * Sort specs by key and version for deterministic ordering.
 */
export function sortSpecs<T extends { key: string; version: number }>(
  specs: T[]
): T[] {
  return [...specs].sort((a, b) => {
    const keyCompare = a.key.localeCompare(b.key);
    if (keyCompare !== 0) return keyCompare;
    return a.version - b.version;
  });
}

/**
 * Sort field snapshots by name for deterministic ordering.
 */
export function sortFields(
  fields: Record<string, unknown>
): Record<string, unknown> {
  const sorted: Record<string, unknown> = {};
  const keys = Object.keys(fields).sort();
  for (const key of keys) {
    sorted[key] = fields[key];
  }
  return sorted;
}
