/**
 * Layer discovery tests.
 *
 * Tests for the layer discovery service.
 */

import { describe, expect, it } from 'bun:test';
import {
  createEmptyLayerInventory,
  getAllLayerLocations,
  type LayerInventory,
} from './layer-discovery';

describe('createEmptyLayerInventory', () => {
  it('should create empty maps for all layer types', () => {
    const inventory = createEmptyLayerInventory();

    expect(inventory.features.size).toBe(0);
    expect(inventory.examples.size).toBe(0);
    expect(inventory.appConfigs.size).toBe(0);
    expect(inventory.workspaceConfigs.size).toBe(0);
  });
});

describe('getAllLayerLocations', () => {
  it('should return empty array for empty inventory', () => {
    const inventory = createEmptyLayerInventory();
    const locations = getAllLayerLocations(inventory);

    expect(locations).toEqual([]);
  });

  it('should include features in locations', () => {
    const inventory = createEmptyLayerInventory();
    inventory.features.set('my-feature', {
      filePath: '/path/to/my.feature.ts',
      key: 'my-feature',
      operations: [],
      events: [],
      presentations: [],
      experiments: [],
      capabilities: { provides: [], requires: [] },
      opToPresentationLinks: [],
    });

    const locations = getAllLayerLocations(inventory);

    expect(locations).toHaveLength(1);
    expect(locations[0]).toEqual({
      key: 'my-feature',
      file: '/path/to/my.feature.ts',
      type: 'feature',
    });
  });

  it('should include examples in locations', () => {
    const inventory = createEmptyLayerInventory();
    inventory.examples.set('my-example', {
      filePath: '/path/to/example.ts',
      key: 'my-example',
      version: '1.0.0',
      surfaces: {
        templates: false,
        sandbox: { enabled: false, modes: [] },
        studio: { enabled: false, installable: false },
        mcp: { enabled: false },
      },
      entrypoints: { packageName: '@test/example' },
    });

    const locations = getAllLayerLocations(inventory);

    expect(locations).toHaveLength(1);
    expect(locations[0]).toEqual({
      key: 'my-example',
      version: '1.0.0',
      file: '/path/to/example.ts',
      type: 'example',
    });
  });

  it('should include workspace configs in locations', () => {
    const inventory = createEmptyLayerInventory();
    inventory.workspaceConfigs.set('.contractsrc.json', {
      file: '.contractsrc.json',
      config: { aiProvider: 'claude' },
      valid: true,
      errors: [],
    });

    const locations = getAllLayerLocations(inventory);

    expect(locations).toHaveLength(1);
    expect(locations[0]).toEqual({
      key: '.contractsrc.json',
      file: '.contractsrc.json',
      type: 'workspace-config',
    });
  });

  it('should return all layer types combined', () => {
    const inventory: LayerInventory = {
      features: new Map([
        [
          'feature-1',
          {
            filePath: '/f1.feature.ts',
            key: 'feature-1',
            operations: [],
            events: [],
            presentations: [],
            experiments: [],
            capabilities: { provides: [], requires: [] },
            opToPresentationLinks: [],
          },
        ],
      ]),
      examples: new Map([
        [
          'example-1',
          {
            filePath: '/e1/example.ts',
            key: 'example-1',
            version: '1.0.0',
            surfaces: {
              templates: true,
              sandbox: { enabled: false, modes: [] },
              studio: { enabled: false, installable: false },
              mcp: { enabled: false },
            },
            entrypoints: { packageName: '@test/e1' },
          },
        ],
      ]),
      appConfigs: new Map([
        [
          'app-1',
          {
            filePath: '/app-1.app-config.ts',
            specType: 'app-config',
            key: 'app-1',
            version: '1.0.0',
            hasMeta: true,
            hasIo: false,
            hasPolicy: false,
            hasPayload: false,
            hasContent: false,
            hasDefinition: true,
          },
        ],
      ]),
      workspaceConfigs: new Map([
        [
          '.contractsrc.json',
          {
            file: '.contractsrc.json',
            config: {},
            valid: true,
            errors: [],
          },
        ],
      ]),
    };

    const locations = getAllLayerLocations(inventory);

    expect(locations).toHaveLength(4);
    expect(locations.filter((l) => l.type === 'feature')).toHaveLength(1);
    expect(locations.filter((l) => l.type === 'example')).toHaveLength(1);
    expect(locations.filter((l) => l.type === 'app-config')).toHaveLength(1);
    expect(locations.filter((l) => l.type === 'workspace-config')).toHaveLength(
      1
    );
  });
});
