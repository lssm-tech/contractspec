import { describe, expect, it } from 'bun:test';
import { VisualizationRegistry, visualizationKey } from './registry';
import type { VisualizationSpec } from './spec';

describe('VisualizationRegistry', () => {
  const createSpec = (
    key: string,
    version = '1.0.0'
  ): VisualizationSpec => ({
    meta: {
      key,
      version,
      title: key,
      description: `Visualization ${key}`,
      goal: 'Test visualization registry',
      context: 'Registry tests',
      stability: 'stable',
      owners: ['platform.core'],
      tags: ['test'],
    },
    source: {
      primary: { key: `${key}.query`, version: '1.0.0' },
    },
    visualization: {
      kind: 'metric',
      measures: [{ key: 'value', label: 'Value', dataPath: 'value' }],
      measure: 'value',
    },
  });

  it('registers and resolves latest versions', () => {
    const registry = new VisualizationRegistry();
    registry.register(createSpec('analytics.mrr', '1.0.0'));
    registry.register(createSpec('analytics.mrr', '2.0.0'));

    expect(registry.get('analytics.mrr')?.meta.version).toBe('2.0.0');
  });

  it('throws on duplicate key and version', () => {
    const registry = new VisualizationRegistry();
    registry.register(createSpec('analytics.mrr'));

    expect(() => registry.register(createSpec('analytics.mrr'))).toThrow(
      /Duplicate contract/
    );
  });
});

describe('visualizationKey', () => {
  it('builds a registry key from meta', () => {
    expect(visualizationKey(createNamedSpec('analytics.geo', '3.0.0'))).toBe(
      'analytics.geo.v3.0.0'
    );
  });
});

function createNamedSpec(key: string, version: string): VisualizationSpec {
  return {
    meta: {
      key,
      version,
      title: key,
      description: key,
      goal: 'Goal',
      context: 'Context',
      stability: 'stable',
      owners: ['platform.core'],
      tags: ['test'],
    },
    source: {
      primary: { key: `${key}.query`, version: '1.0.0' },
    },
    visualization: {
      kind: 'metric',
      measures: [{ key: 'value', label: 'Value', dataPath: 'value' }],
      measure: 'value',
    },
  };
}
