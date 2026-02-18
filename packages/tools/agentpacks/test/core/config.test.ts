import { describe, expect, test } from 'bun:test';
import {
  WorkspaceConfigSchema,
  PackManifestSchema,
  resolveFeatures,
  resolveTargets,
  FEATURE_IDS,
  TARGET_IDS,
} from '../../src/core/config.js';

describe('WorkspaceConfigSchema', () => {
  test('parses minimal config', () => {
    const config = WorkspaceConfigSchema.parse({});
    expect(config.packs).toEqual(['./packs/default']);
    expect(config.targets).toBe('*');
    expect(config.features).toBe('*');
    expect(config.mode).toBe('repo');
    expect(config.delete).toBe(true);
  });

  test('parses full config', () => {
    const config = WorkspaceConfigSchema.parse({
      packs: ['./packs/security', './packs/base'],
      disabled: ['legacy-pack'],
      targets: ['opencode', 'cursor'],
      features: ['rules', 'commands'],
      mode: 'monorepo',
      baseDirs: ['.', 'packages/app'],
      global: false,
      delete: true,
      verbose: true,
    });

    expect(config.packs).toEqual(['./packs/security', './packs/base']);
    expect(config.disabled).toEqual(['legacy-pack']);
    expect(config.targets).toEqual(['opencode', 'cursor']);
    expect(config.mode).toBe('monorepo');
  });

  test('parses per-target features', () => {
    const config = WorkspaceConfigSchema.parse({
      features: {
        opencode: ['*'],
        cursor: ['rules', 'mcp'],
      },
    });

    expect(config.features).toEqual({
      opencode: ['*'],
      cursor: ['rules', 'mcp'],
    });
  });
});

describe('PackManifestSchema', () => {
  test('parses minimal manifest', () => {
    const manifest = PackManifestSchema.parse({ name: 'test-pack' });
    expect(manifest.name).toBe('test-pack');
    expect(manifest.version).toBe('1.0.0');
    expect(manifest.dependencies).toEqual([]);
    expect(manifest.conflicts).toEqual([]);
    expect(manifest.targets).toBe('*');
  });

  test('parses full manifest', () => {
    const manifest = PackManifestSchema.parse({
      name: 'security-pack',
      version: '2.0.0',
      description: 'Security rules',
      tags: ['security'],
      dependencies: ['base-pack'],
      conflicts: ['minimal-pack'],
      targets: ['opencode', 'cursor'],
      features: ['rules', 'hooks'],
    });

    expect(manifest.name).toBe('security-pack');
    expect(manifest.dependencies).toEqual(['base-pack']);
    expect(manifest.targets).toEqual(['opencode', 'cursor']);
  });
});

describe('resolveFeatures', () => {
  test('resolves wildcard features', () => {
    const config = WorkspaceConfigSchema.parse({ features: '*' });
    const features = resolveFeatures(config, 'opencode');
    expect(features).toEqual([...FEATURE_IDS]);
  });

  test('resolves array features', () => {
    const config = WorkspaceConfigSchema.parse({
      features: ['rules', 'commands'],
    });
    const features = resolveFeatures(config, 'opencode');
    expect(features).toEqual(['rules', 'commands']);
  });

  test('resolves per-target features', () => {
    const config = WorkspaceConfigSchema.parse({
      features: {
        opencode: ['*'],
        cursor: ['rules'],
      },
    });

    expect(resolveFeatures(config, 'opencode')).toEqual([...FEATURE_IDS]);
    expect(resolveFeatures(config, 'cursor')).toEqual(['rules']);
    expect(resolveFeatures(config, 'copilot')).toEqual([]);
  });
});

describe('resolveTargets', () => {
  test('resolves wildcard targets', () => {
    const config = WorkspaceConfigSchema.parse({ targets: '*' });
    const targets = resolveTargets(config);
    expect(targets).toEqual([...TARGET_IDS]);
  });

  test('resolves array targets', () => {
    const config = WorkspaceConfigSchema.parse({
      targets: ['opencode', 'cursor'],
    });
    const targets = resolveTargets(config);
    expect(targets).toEqual(['opencode', 'cursor']);
  });
});
