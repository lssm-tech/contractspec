/**
 * Snapshot module tests.
 */

import { describe, it, expect } from 'bun:test';
import {
  normalizeValue,
  toCanonicalJson,
  computeHash,
  sortSpecs,
} from './normalizer';
import { generateSnapshot } from './snapshot';

describe('normalizer', () => {
  describe('normalizeValue', () => {
    it('should sort object keys alphabetically', () => {
      const input = { z: 1, a: 2, m: 3 };
      const result = normalizeValue(input);
      expect(Object.keys(result as object)).toEqual(['a', 'm', 'z']);
    });

    it('should remove undefined values', () => {
      const input = { a: 1, b: undefined, c: 3 };
      const result = normalizeValue(input) as Record<string, unknown>;
      expect(result).toEqual({ a: 1, c: 3 });
      expect('b' in result).toBe(false);
    });

    it('should preserve null values', () => {
      const input = { a: 1, b: null };
      const result = normalizeValue(input);
      expect(result).toEqual({ a: 1, b: null });
    });

    it('should normalize nested objects', () => {
      const input = { z: { b: 1, a: 2 }, a: 1 };
      const result = normalizeValue(input) as Record<string, unknown>;
      expect(Object.keys(result)).toEqual(['a', 'z']);
      const zValue = result['z'];
      if (zValue && typeof zValue === 'object') {
        expect(Object.keys(zValue)).toEqual(['a', 'b']);
      }
    });

    it('should normalize arrays', () => {
      const input = [
        { b: 1, a: 2 },
        { d: 3, c: 4 },
      ];
      const result = normalizeValue(input) as object[];
      expect(Object.keys(result[0] as object)).toEqual(['a', 'b']);
      expect(Object.keys(result[1] as object)).toEqual(['c', 'd']);
    });
  });

  describe('toCanonicalJson', () => {
    it('should produce identical output for equivalent objects with different key order', () => {
      const obj1 = { z: 1, a: 2 };
      const obj2 = { a: 2, z: 1 };
      expect(toCanonicalJson(obj1)).toBe(toCanonicalJson(obj2));
    });
  });

  describe('computeHash', () => {
    it('should produce identical hash for equivalent objects', () => {
      const obj1 = { z: 1, a: 2 };
      const obj2 = { a: 2, z: 1 };
      expect(computeHash(obj1)).toBe(computeHash(obj2));
    });

    it('should produce different hash for different objects', () => {
      const obj1 = { a: 1 };
      const obj2 = { a: 2 };
      expect(computeHash(obj1)).not.toBe(computeHash(obj2));
    });
  });

  describe('sortSpecs', () => {
    it('should sort specs by key then version', () => {
      const specs = [
        { key: 'b', version: '2.0.0' },
        { key: 'a', version: '1.0.1' },
        { key: 'c', version: '1.0.0' },
        { key: 'a', version: '1.0.0' },
      ];
      const sorted = sortSpecs(specs);
      expect(sorted).toEqual([
        { key: 'a', version: '1.0.0' },
        { key: 'a', version: '1.0.1' },
        { key: 'b', version: '2.0.0' },
        { key: 'c', version: '1.0.0' },
      ]);
    });
  });
});

describe('generateSnapshot', () => {
  it('should generate snapshot for operation spec', () => {
    const specs = [
      {
        path: 'test.operation.ts',
        content: `
export const Spec = defineCommand({
  meta: { key: 'test.create', version: '1.0.0', kind: 'command', stability: 'stable' },
  io: {
    input: z.object({ name: z.string() }),
    output: z.object({ id: z.string() }),
  },
  policy: {},
});
`,
      },
    ];

    const snapshot = generateSnapshot(specs);

    expect(snapshot.version).toBe('1.0.0');
    expect(snapshot.specs).toHaveLength(1);
    expect(snapshot.specs[0]?.type).toBe('operation');
    expect(snapshot.specs[0]?.key).toBe('test.create');
    expect(snapshot.hash).toBeDefined();
  });

  it('should generate deterministic snapshots', () => {
    const specs = [
      {
        path: 'test.operation.ts',
        content: `
export const Spec = defineCommand({
  meta: { key: 'test.create', version: '1.0.0', kind: 'command', stability: 'stable' },
  io: {},
  policy: {},
});
`,
      },
    ];

    const snapshot1 = generateSnapshot(specs);
    const snapshot2 = generateSnapshot(specs);

    // Hash should be identical (excluding generatedAt which changes)
    expect(snapshot1.hash).toBe(snapshot2.hash);
    expect(snapshot1.specs).toEqual(snapshot2.specs);
  });

  it('should filter by spec types', () => {
    const specs = [
      {
        path: 'test.operation.ts',
        content: `
export const Spec = defineCommand({
  meta: { key: 'test.create', version: '1.0.0', kind: 'command', stability: 'stable' },
  io: {},
  policy: {},
});
`,
      },
      {
        path: 'test.event.ts',
        content: `
export const Spec = defineEvent({
  meta: { key: 'test.created', version: '1.0.0', stability: 'stable' },
  payload: z.object({ id: z.string() }),
});
`,
      },
    ];

    const operationsOnly = generateSnapshot(specs, { types: ['operation'] });
    expect(operationsOnly.specs).toHaveLength(1);
    expect(operationsOnly.specs[0]?.type).toBe('operation');

    const eventsOnly = generateSnapshot(specs, { types: ['event'] });
    expect(eventsOnly.specs).toHaveLength(1);
    expect(eventsOnly.specs[0]?.type).toBe('event');
  });
});
