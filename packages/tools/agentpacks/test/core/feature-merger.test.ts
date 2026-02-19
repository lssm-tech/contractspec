import { describe, expect, test } from 'bun:test';
import { FeatureMerger } from '../../src/core/feature-merger.js';
import type { LoadedPack } from '../../src/core/pack-loader.js';

function makePack(overrides: Partial<LoadedPack>): LoadedPack {
  return {
    manifest: {
      name: 'test',
      version: '1.0.0',
      description: '',
      tags: [],
      dependencies: [],
      conflicts: [],
      targets: '*',
      features: '*',
    },
    directory: '/tmp/test',
    rules: [],
    commands: [],
    agents: [],
    skills: [],
    hooks: null,
    plugins: [],
    mcp: null,
    ignore: null,
    ...overrides,
  };
}

describe('FeatureMerger', () => {
  test('merges rules from multiple packs (additive, first wins)', () => {
    const packA = makePack({
      manifest: {
        name: 'pack-a',
        version: '1.0.0',
        description: '',
        tags: [],
        dependencies: [],
        conflicts: [],
        targets: '*',
        features: '*',
      },
      rules: [
        {
          name: 'overview',
          sourcePath: '/a/rules/overview.md',
          packName: 'pack-a',
          meta: { root: true },
          content: '# A overview',
        },
        {
          name: 'security',
          sourcePath: '/a/rules/security.md',
          packName: 'pack-a',
          meta: {},
          content: '# A security',
        },
      ],
    });

    const packB = makePack({
      manifest: {
        name: 'pack-b',
        version: '1.0.0',
        description: '',
        tags: [],
        dependencies: [],
        conflicts: [],
        targets: '*',
        features: '*',
      },
      rules: [
        {
          name: 'security',
          sourcePath: '/b/rules/security.md',
          packName: 'pack-b',
          meta: {},
          content: '# B security (should be skipped)',
        },
        {
          name: 'testing',
          sourcePath: '/b/rules/testing.md',
          packName: 'pack-b',
          meta: {},
          content: '# B testing',
        },
      ],
    });

    const merger = new FeatureMerger([packA, packB]);
    const { features, warnings } = merger.merge();

    expect(features.rules).toHaveLength(3);
    expect(features.rules.map((r) => r.name)).toEqual([
      'overview',
      'security',
      'testing',
    ]);
    expect(features.rules[1]!.content).toBe('# A security'); // First wins
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain('pack-b');
  });

  test('merges MCP servers (first wins)', () => {
    const packA = makePack({
      manifest: {
        name: 'pack-a',
        version: '1.0.0',
        description: '',
        tags: [],
        dependencies: [],
        conflicts: [],
        targets: '*',
        features: '*',
      },
      mcp: {
        packName: 'pack-a',
        sourcePath: '/a/mcp.json',
        servers: { serena: { command: 'uvx', args: ['serena'] } },
      },
    });

    const packB = makePack({
      manifest: {
        name: 'pack-b',
        version: '1.0.0',
        description: '',
        tags: [],
        dependencies: [],
        conflicts: [],
        targets: '*',
        features: '*',
      },
      mcp: {
        packName: 'pack-b',
        sourcePath: '/b/mcp.json',
        servers: {
          serena: { command: 'different-serena' },
          context7: { command: 'npx', args: ['-y', '@upstash/context7-mcp'] },
        },
      },
    });

    const merger = new FeatureMerger([packA, packB]);
    const { features, warnings } = merger.merge();

    expect(Object.keys(features.mcpServers)).toEqual(['serena', 'context7']);
    expect(features.mcpServers.serena!.command).toBe('uvx'); // First wins
    expect(warnings).toHaveLength(1);
  });

  test('merges ignore patterns (deduplicated additive)', () => {
    const packA = makePack({
      manifest: {
        name: 'pack-a',
        version: '1.0.0',
        description: '',
        tags: [],
        dependencies: [],
        conflicts: [],
        targets: '*',
        features: '*',
      },
      ignore: {
        packName: 'pack-a',
        sourcePath: '/a/ignore',
        patterns: ['node_modules/', 'dist/'],
      },
    });

    const packB = makePack({
      manifest: {
        name: 'pack-b',
        version: '1.0.0',
        description: '',
        tags: [],
        dependencies: [],
        conflicts: [],
        targets: '*',
        features: '*',
      },
      ignore: {
        packName: 'pack-b',
        sourcePath: '/b/ignore',
        patterns: ['dist/', 'tmp/'],
      },
    });

    const merger = new FeatureMerger([packA, packB]);
    const { features } = merger.merge();

    expect(features.ignorePatterns).toEqual(['node_modules/', 'dist/', 'tmp/']);
  });

  test('handles empty packs', () => {
    const merger = new FeatureMerger([makePack({})]);
    const { features, warnings } = merger.merge();

    expect(features.rules).toEqual([]);
    expect(features.commands).toEqual([]);
    expect(Object.keys(features.mcpServers)).toEqual([]);
    expect(warnings).toEqual([]);
  });
});
