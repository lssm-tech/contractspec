import { describe, expect, it, mock, spyOn } from 'bun:test';
import { discoverLayers, getAllLayerLocations } from './layer-discovery';
import type { FsAdapter } from '../ports/fs';
import type { LoggerAdapter } from '../ports/logger';

// Mock the module imports
mock.module('@contractspec/module.workspace', () => ({
  isFeatureFile: (file: string) => file.endsWith('.feature.ts'),
  scanFeatureSource: (code: string, file: string) => ({
    key: 'auth',
    filePath: file,
  }),
  isExampleFile: (file: string) => file.endsWith('.example.ts'),
  scanExampleSource: (code: string, file: string) => ({
    key: 'user-flow',
    version: '1.0.0',
    filePath: file,
  }),
  scanAllSpecsFromSource: (code: string, file: string) => {
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
    rm: mock(async () => {}), // Fix: Add rm
  } as unknown as FsAdapter;

  const mockLogger = {
    info: mock(() => {}),
    warn: mock(() => {}),
    error: mock(() => {}),
    debug: mock(() => {}),
    createProgress: mock(() => ({
      // Fix: Add createProgress
      increment: () => {},
      stop: () => {},
    })),
  } as unknown as LoggerAdapter;

  const adapters = { fs: mockFs, logger: mockLogger };

  it('should return empty inventory when no files found', async () => {
    (mockFs.glob as any).mockImplementation(() => Promise.resolve([]));
    const result = await discoverLayers(adapters);

    expect(result.inventory.features.size).toBe(0);
    expect(result.inventory.examples.size).toBe(0);
    expect(result.inventory.appConfigs.size).toBe(0);
    expect(result.inventory.workspaceConfigs.size).toBe(0);
    expect(result.stats.total).toBe(0);
  });

  it('should discover features', async () => {
    (mockFs.glob as any).mockImplementation((opts: any) => {
      if (opts?.pattern?.includes('.contractsrc.json'))
        return Promise.resolve([]);
      return Promise.resolve(['src/features/auth.feature.ts']);
    });

    (mockFs.readFile as any).mockImplementation((path: string) => {
      return Promise.resolve('mock code');
    });

    const result = await discoverLayers(adapters);

    expect(result.inventory.features.size).toBe(1);
    expect(result.inventory.features.get('auth')).toBeDefined();
    expect(result.stats.features).toBe(1);
  });

  it('should discover examples', async () => {
    (mockFs.glob as any).mockImplementation((opts: any) => {
      if (opts?.pattern?.includes('.contractsrc.json'))
        return Promise.resolve([]);
      return Promise.resolve(['src/examples/user-flow.example.ts']);
    });

    (mockFs.readFile as any).mockImplementation(() =>
      Promise.resolve('mock code')
    );

    const result = await discoverLayers(adapters);

    expect(result.inventory.examples.size).toBe(1);
    expect(result.inventory.examples.get('user-flow')).toBeDefined();
    expect(result.stats.examples).toBe(1);
  });

  it('should discover app configs', async () => {
    (mockFs.glob as any).mockImplementation((opts: any) => {
      if (opts?.pattern?.includes('.contractsrc.json'))
        return Promise.resolve([]);
      return Promise.resolve(['src/config/main.app-config.ts']);
    });

    (mockFs.readFile as any).mockImplementation(() =>
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
    (mockFs.glob as any).mockImplementation(() => {
      callCount++;
      if (callCount === 1) return Promise.resolve([]);
      return Promise.resolve(['.contractsrc.json']);
    });

    (mockFs.readFile as any).mockImplementation((path: string) => {
      if (path.endsWith('.contractsrc.json')) {
        return Promise.resolve(JSON.stringify({ projectId: 'test' }));
      }
      return Promise.resolve('');
    });

    const result = await discoverLayers(adapters);

    expect(result.inventory.workspaceConfigs.size).toBe(1);
    expect(result.inventory.workspaceConfigs.has('.contractsrc.json')).toBe(
      true
    );
    expect(result.stats.workspaceConfigs).toBe(1);
  });

  it('should handle invalid workspace configs', async () => {
    let callCount = 0;
    (mockFs.glob as any).mockImplementation(() => {
      callCount++;
      if (callCount === 1) return Promise.resolve([]);
      return Promise.resolve(['.contractsrc.json']);
    });

    (mockFs.readFile as any).mockImplementation(() =>
      Promise.resolve('invalid json')
    );

    const result = await discoverLayers(adapters);

    const configInfo =
      result.inventory.workspaceConfigs.get('.contractsrc.json');
    expect(configInfo?.valid).toBe(false);
    expect(configInfo?.errors).toHaveLength(1);
  });

  it('should skip node_modules and dist files', async () => {
    (mockFs.glob as any).mockImplementation((opts: any) => {
      if (opts?.pattern?.includes('.contractsrc.json'))
        return Promise.resolve([]);
      return Promise.resolve(['node_modules/foo.ts', 'dist/bar.ts']);
    });

    (mockFs.readFile as any).mockImplementation(() => Promise.resolve(''));

    const result = await discoverLayers(adapters);
    expect(result.stats.total).toBe(0);
  });

  it('should handle read errors gracefully', async () => {
    (mockFs.glob as any).mockImplementation((opts: any) => {
      if (opts?.pattern?.includes('.contractsrc.json'))
        return Promise.resolve([]);
      return Promise.resolve(['src/features/auth.feature.ts']);
    });

    (mockFs.readFile as any).mockImplementation(() =>
      Promise.reject(new Error('Read error'))
    );

    const result = await discoverLayers(adapters);
    expect(result.inventory.features.size).toBe(0);
  });

  it('should return all layer locations', async () => {
    const inventory = {
      features: new Map([['auth', { key: 'auth', filePath: 'f.ts' } as any]]),
      examples: new Map([
        ['ex', { key: 'ex', version: '1', filePath: 'e.ts' } as any],
      ]),
      appConfigs: new Map([
        ['app', { key: 'app', version: '1', filePath: 'a.ts' } as any],
      ]),
      workspaceConfigs: new Map([['conf', { file: 'c.json' } as any]]),
    };

    const locations = getAllLayerLocations(inventory as any);
    expect(locations).toHaveLength(4);
    expect(locations.find((l) => l.type === 'feature')).toBeDefined();
    expect(locations.find((l) => l.type === 'example')).toBeDefined();
    expect(locations.find((l) => l.type === 'app-config')).toBeDefined();
    expect(locations.find((l) => l.type === 'workspace-config')).toBeDefined();
  });
});
