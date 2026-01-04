import { describe, expect, it, mock } from 'bun:test';
import {
  discoverLayers,
  getAllLayerLocations,
  type LayerInventory,
  type WorkspaceConfigInfo,
} from './layer-discovery';
import type {
  FeatureScanResult,
  ExampleScanResult,
  SpecScanResult,
} from '@contractspec/module.workspace';
import type { FsAdapter } from '../ports/fs';
import type { LoggerAdapter } from '../ports/logger';

// Mock the module imports
mock.module('@contractspec/module.workspace', () => ({
  isFeatureFile: (file: string) => file.endsWith('.feature.ts'),
  scanFeatureSource: (_code: string, file: string) => ({
    key: 'auth',
    filePath: file,
  }),
  isExampleFile: (file: string) => file.endsWith('.example.ts'),
  scanExampleSource: (_code: string, file: string) => ({
    key: 'user-flow',
    version: '1.0.0',
    filePath: file,
  }),
  scanAllSpecsFromSource: (_code: string, file: string) => {
    if (file.includes('app-config')) {
      return [
        {
          specType: 'app-config',
          key: 'my-app',
          version: '1.0.0',
          filePath: file,
        },
      ];
    }
    return [];
  },
}));

describe('Layer Discovery', () => {
  const mockFs = {
    glob: mock(() => Promise.resolve([])),
    readFile: mock(() => Promise.resolve('')),
    writeFile: mock(() => Promise.resolve()),
    exists: mock(() => Promise.resolve(false)),
    mkdir: mock(() => Promise.resolve()),
    rm: mock(async () => void 0), // Fix: Add rm
  } as unknown as FsAdapter;

  const mockLogger = {
    info: mock(() => void 0),
    warn: mock(() => void 0),
    error: mock(() => void 0),
    debug: mock(() => void 0),
    createProgress: mock(() => ({
      // Fix: Add createProgress
      increment: () => void 0,
      stop: () => void 0,
    })),
  } as unknown as LoggerAdapter;

  const adapters = { fs: mockFs, logger: mockLogger };

  it('should return empty inventory when no files found', async () => {
    (mockFs.glob as ReturnType<typeof mock>).mockImplementation(() =>
      Promise.resolve([])
    );
    const result = await discoverLayers(adapters);

    expect(result.inventory.features.size).toBe(0);
    expect(result.inventory.examples.size).toBe(0);
    expect(result.inventory.appConfigs.size).toBe(0);
    expect(result.inventory.workspaceConfigs.size).toBe(0);
    expect(result.stats.total).toBe(0);
  });

  it('should discover features', async () => {
    (mockFs.glob as ReturnType<typeof mock>).mockImplementation(
      (opts: { pattern?: string[] }) => {
        if (opts?.pattern?.includes('.contractsrc.json'))
          return Promise.resolve([]);
        return Promise.resolve(['src/features/auth.feature.ts']);
      }
    );

    (mockFs.readFile as ReturnType<typeof mock>).mockImplementation(
      (_path: string) => {
        return Promise.resolve('mock code');
      }
    );

    const result = await discoverLayers(adapters);

    expect(result.inventory.features.size).toBe(1);
    expect(result.inventory.features.get('auth')).toBeDefined();
    expect(result.stats.features).toBe(1);
  });

  it('should discover examples', async () => {
    (mockFs.glob as ReturnType<typeof mock>).mockImplementation(
      (opts: { pattern?: string[] }) => {
        if (opts?.pattern?.includes('.contractsrc.json'))
          return Promise.resolve([]);
        return Promise.resolve(['src/examples/user-flow.example.ts']);
      }
    );

    (mockFs.readFile as ReturnType<typeof mock>).mockImplementation(() =>
      Promise.resolve('mock code')
    );

    const result = await discoverLayers(adapters);

    expect(result.inventory.examples.size).toBe(1);
    expect(result.inventory.examples.get('user-flow')).toBeDefined();
    expect(result.stats.examples).toBe(1);
  });

  it('should discover app configs', async () => {
    (mockFs.glob as ReturnType<typeof mock>).mockImplementation(
      (opts: { pattern?: string[] }) => {
        if (opts?.pattern?.includes('.contractsrc.json'))
          return Promise.resolve([]);
        return Promise.resolve(['src/config/main.app-config.ts']);
      }
    );

    (mockFs.readFile as ReturnType<typeof mock>).mockImplementation(() =>
      Promise.resolve('mock code')
    );

    const result = await discoverLayers(adapters);

    expect(result.inventory.appConfigs.size).toBe(1);
    expect(result.inventory.appConfigs.get('my-app')).toBeDefined();
    expect(result.stats.appConfigs).toBe(1);
  });

  it('should discover workspace configs', async () => {
    // First glob call for files, second for configs
    let callCount = 0;
    (mockFs.glob as ReturnType<typeof mock>).mockImplementation(() => {
      callCount++;
      if (callCount === 1) return Promise.resolve([]);
      return Promise.resolve(['.contractsrc.json']);
    });

    (mockFs.readFile as ReturnType<typeof mock>).mockImplementation(
      (path: string) => {
        if (path.endsWith('.contractsrc.json')) {
          return Promise.resolve(JSON.stringify({ projectId: 'test' }));
        }
        return Promise.resolve('');
      }
    );

    const result = await discoverLayers(adapters);

    expect(result.inventory.workspaceConfigs.size).toBe(1);
    expect(result.inventory.workspaceConfigs.has('.contractsrc.json')).toBe(
      true
    );
    expect(result.stats.workspaceConfigs).toBe(1);
  });

  it('should handle invalid workspace configs', async () => {
    let callCount = 0;
    (mockFs.glob as ReturnType<typeof mock>).mockImplementation(() => {
      callCount++;
      if (callCount === 1) return Promise.resolve([]);
      return Promise.resolve(['.contractsrc.json']);
    });

    (mockFs.readFile as ReturnType<typeof mock>).mockImplementation(() =>
      Promise.resolve('invalid json')
    );

    const result = await discoverLayers(adapters);

    const configInfo =
      result.inventory.workspaceConfigs.get('.contractsrc.json');
    expect(configInfo?.valid).toBe(false);
    expect(configInfo?.errors).toHaveLength(1);
  });

  it('should skip node_modules and dist files', async () => {
    (mockFs.glob as ReturnType<typeof mock>).mockImplementation(
      (opts: { pattern?: string[] }) => {
        if (opts?.pattern?.includes('.contractsrc.json'))
          return Promise.resolve([]);
        return Promise.resolve(['node_modules/foo.ts', 'dist/bar.ts']);
      }
    );

    (mockFs.readFile as ReturnType<typeof mock>).mockImplementation(() =>
      Promise.resolve('')
    );

    const result = await discoverLayers(adapters);
    expect(result.stats.total).toBe(0);
  });

  it('should handle read errors gracefully', async () => {
    (mockFs.glob as ReturnType<typeof mock>).mockImplementation(
      (opts: { pattern?: string[] }) => {
        if (opts?.pattern?.includes('.contractsrc.json'))
          return Promise.resolve([]);
        return Promise.resolve(['src/features/auth.feature.ts']);
      }
    );

    (mockFs.readFile as ReturnType<typeof mock>).mockImplementation(() =>
      Promise.reject(new Error('Read error'))
    );

    const result = await discoverLayers(adapters);
    expect(result.inventory.features.size).toBe(0);
  });

  it('should return all layer locations', async () => {
    const inventory = {
      features: new Map([
        [
          'auth',
          { key: 'auth', filePath: 'f.ts' } as unknown as FeatureScanResult,
        ],
      ]),
      examples: new Map([
        [
          'ex',
          {
            key: 'ex',
            version: '1',
            filePath: 'e.ts',
          } as unknown as ExampleScanResult,
        ],
      ]),
      appConfigs: new Map([
        [
          'app',
          {
            key: 'app',
            version: '1',
            filePath: 'a.ts',
          } as unknown as SpecScanResult,
        ],
      ]),
      workspaceConfigs: new Map([
        [
          'conf',
          {
            file: 'c.json',
            valid: true,
            config: {},
            errors: [],
          } as unknown as WorkspaceConfigInfo,
        ],
      ]),
    } as unknown as LayerInventory;

    const locations = getAllLayerLocations(inventory);
    expect(locations).toHaveLength(4);
    expect(locations.find((l) => l.type === 'feature')).toBeDefined();
    expect(locations.find((l) => l.type === 'example')).toBeDefined();
    expect(locations.find((l) => l.type === 'app-config')).toBeDefined();
    expect(locations.find((l) => l.type === 'workspace-config')).toBeDefined();
  });
});
