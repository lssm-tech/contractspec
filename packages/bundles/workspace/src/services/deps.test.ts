import { describe, expect, it, mock } from 'bun:test';
import { analyzeDeps, getGraphStats } from './deps';
import type { FsAdapter } from '../ports/fs';

describe('Deps Service', () => {
  it('should build a dependency graph', async () => {
    const mockFs = {
      glob: mock(() =>
        Promise.resolve(['spec1.contracts.ts', 'spec2.contracts.ts'])
      ),
      readFile: mock((path: string) => {
        if (path === 'spec1.contracts.ts') {
          return Promise.resolve(
            `
              import "./spec2.contracts";
              export const op1 = defineCommand({
                meta: { key: 'spec1', version: '1.0.0' },
              });
            `
          );
        }

        return Promise.resolve(
          `
            export const op2 = defineCommand({
              meta: { key: 'spec2', version: '1.0.0' },
            });
          `
        );
      }),
      relative: mock((_from: string, to: string) => to),
      basename: mock((path: string) => path.split('/').pop() ?? path),
    } as unknown as FsAdapter;

    const result = await analyzeDeps({ fs: mockFs });

    expect(result.total).toBe(2);
    expect(result.graph.has('spec1')).toBe(true);
    expect(result.graph.has('spec2')).toBe(true);
    expect(result.cycles).toHaveLength(0);
    expect(result.missing).toHaveLength(0);
  });

  it('should return cycle and missing-dependency collections', async () => {
    const mockFs = {
      glob: mock(() =>
        Promise.resolve(['spec1.contracts.ts', 'spec2.contracts.ts'])
      ),
      readFile: mock((path: string) => {
        if (path === 'spec1.contracts.ts') {
          return Promise.resolve(
            `
              import "./spec2.contracts";
              import "./missing.contracts";
              export const op1 = defineCommand({
                meta: { key: 'spec1', version: '1.0.0' },
              });
            `
          );
        }

        return Promise.resolve(
          `
            import "./spec1.contracts";
            export const op2 = defineCommand({
              meta: { key: 'spec2', version: '1.0.0' },
            });
          `
        );
      }),
      relative: mock((_from: string, to: string) => to),
      basename: mock((path: string) => path.split('/').pop() ?? path),
    } as unknown as FsAdapter;

    const result = await analyzeDeps({ fs: mockFs });

    expect(Array.isArray(result.cycles)).toBe(true);
    expect(Array.isArray(result.missing)).toBe(true);
  });

  it('should calculate stats', () => {
    const graph = new Map<
      string,
      { dependencies: string[]; dependents: string[] }
    >();
    graph.set('a', { dependencies: ['b'], dependents: [] });
    graph.set('b', { dependencies: [], dependents: ['a'] });

    const stats = getGraphStats(graph as never);

    expect(stats.total).toBe(2);
    expect(stats.withDeps).toBe(1);
    expect(stats.withoutDeps).toBe(1);
    expect(stats.used).toBe(1);
    expect(stats.unused).toBe(1);
  });
});
