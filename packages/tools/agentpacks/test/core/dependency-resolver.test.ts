import { describe, expect, test } from 'bun:test';
import {
  resolveDependencies,
  buildDependencyGraph,
} from '../../src/core/dependency-resolver.js';
import { PackManifestSchema } from '../../src/core/config.js';

function manifest(name: string, deps: string[] = [], conflicts: string[] = []) {
  return PackManifestSchema.parse({ name, dependencies: deps, conflicts });
}

describe('buildDependencyGraph', () => {
  test('builds graph from manifests', () => {
    const graph = buildDependencyGraph([manifest('a', ['b']), manifest('b')]);
    expect(graph.size).toBe(2);
    expect(graph.get('a')?.dependencies).toEqual(['b']);
    expect(graph.get('b')?.dependencies).toEqual([]);
  });
});

describe('resolveDependencies', () => {
  test('sorts independent packs (no deps)', () => {
    const result = resolveDependencies([
      manifest('alpha'),
      manifest('beta'),
      manifest('gamma'),
    ]);
    expect(result.ok).toBe(true);
    expect(result.sorted).toHaveLength(3);
    expect(result.cycles).toEqual([]);
    expect(result.conflictPairs).toEqual([]);
    expect(result.missingDeps).toEqual([]);
  });

  test('sorts linear dependency chain', () => {
    const result = resolveDependencies([
      manifest('app', ['lib']),
      manifest('lib', ['core']),
      manifest('core'),
    ]);
    expect(result.ok).toBe(true);
    // core should come before lib, lib before app
    const coreIdx = result.sorted.indexOf('core');
    const libIdx = result.sorted.indexOf('lib');
    const appIdx = result.sorted.indexOf('app');
    expect(coreIdx).toBeLessThan(libIdx);
    expect(libIdx).toBeLessThan(appIdx);
  });

  test('sorts diamond dependency', () => {
    const result = resolveDependencies([
      manifest('app', ['left', 'right']),
      manifest('left', ['base']),
      manifest('right', ['base']),
      manifest('base'),
    ]);
    expect(result.ok).toBe(true);
    const baseIdx = result.sorted.indexOf('base');
    const appIdx = result.sorted.indexOf('app');
    expect(baseIdx).toBeLessThan(appIdx);
  });

  test('detects circular dependency', () => {
    const result = resolveDependencies([
      manifest('a', ['b']),
      manifest('b', ['a']),
    ]);
    expect(result.ok).toBe(false);
    expect(result.cycles.length).toBeGreaterThan(0);
  });

  test('detects three-way cycle', () => {
    const result = resolveDependencies([
      manifest('a', ['b']),
      manifest('b', ['c']),
      manifest('c', ['a']),
    ]);
    expect(result.ok).toBe(false);
    expect(result.cycles.length).toBeGreaterThan(0);
  });

  test('detects missing dependencies', () => {
    const result = resolveDependencies([manifest('app', ['missing-lib'])]);
    expect(result.ok).toBe(false);
    expect(result.missingDeps).toEqual([['app', 'missing-lib']]);
  });

  test('detects conflicts between packs', () => {
    const result = resolveDependencies([
      manifest('security-strict', [], ['security-minimal']),
      manifest('security-minimal'),
    ]);
    expect(result.ok).toBe(false);
    expect(result.conflictPairs).toHaveLength(1);
    expect(result.conflictPairs[0]).toContain('security-strict');
    expect(result.conflictPairs[0]).toContain('security-minimal');
  });

  test('no false conflicts for non-loaded packs', () => {
    // Conflict references a pack not in the graph — should be ignored
    const result = resolveDependencies([
      manifest('my-pack', [], ['some-other-pack']),
    ]);
    expect(result.ok).toBe(true);
    expect(result.conflictPairs).toEqual([]);
  });

  test('handles complex graph with deps + conflicts', () => {
    const result = resolveDependencies([
      manifest('app', ['base']),
      manifest('base'),
      manifest('extension', ['base'], ['old-extension']),
      manifest('old-extension'),
    ]);
    expect(result.ok).toBe(false);
    expect(result.conflictPairs).toHaveLength(1);
    // But sorting should still work for non-conflicting deps
    const baseIdx = result.sorted.indexOf('base');
    const appIdx = result.sorted.indexOf('app');
    expect(baseIdx).toBeLessThan(appIdx);
  });
});
