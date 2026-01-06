import { describe, expect, it, mock } from 'bun:test';
import { watchSpecs } from './watch';

describe('Watch Service', () => {
  const mockWatcher = {
    watch: mock(() => mockWatcherInstance),
  };

  const handlers: ((event: any) => void)[] = [];
  const mockWatcherInstance = {
    on: mock((cb) => handlers.push(cb)),
    close: mock(),
  };

  const mockLogger = {
    info: mock(),
    warn: mock(),
    error: mock(),
    debug: mock(),
    createProgress: mock(() => ({
      start: mock(),
      update: mock(),
      stop: mock(),
      succeed: mock(),
      fail: mock(),
      warn: mock(),
    })),
  };

  const config = {
    version: '1',
    outputDir: 'src',
    contracts: {},
    ignore: [],
  } as any;

  it('should register watcher', () => {
    watchSpecs(
      { watcher: mockWatcher as any, fs: {} as any, logger: mockLogger },
      config,
      { pattern: '**/*.ts' }
    );

    expect(mockWatcher.watch).toHaveBeenCalled();
    expect(mockWatcherInstance.on).toHaveBeenCalled();
  });

  it('should trigger validate and build on change', async () => {
    const mockValidate = mock();
    const mockBuild = mock();

    watchSpecs(
      { watcher: mockWatcher as any, fs: {} as any, logger: mockLogger },
      config,
      { pattern: '**/*.ts', runValidate: true, runBuild: true },
      { validate: mockValidate, build: mockBuild }
    );

    // Simulate change event
    const changeHandler = handlers[handlers.length - 1];
    expect(changeHandler).toBeDefined();
    await changeHandler!({ type: 'change', path: 'spec.ts' });

    expect(mockValidate).toHaveBeenCalledWith('spec.ts');
    expect(mockBuild).toHaveBeenCalledWith('spec.ts');
    expect(mockLogger.info).toHaveBeenCalledWith(
        'watchSpecs.changed', 
        expect.objectContaining({ path: 'spec.ts' })
    );
  });

  it('should respect dry run for build', async () => {
    const mockBuild = mock();

    watchSpecs(
      { watcher: mockWatcher as any, fs: {} as any, logger: mockLogger },
      config,
      { pattern: '**/*.ts', runBuild: true, dryRun: true },
      { build: mockBuild }
    );

    const changeHandler = handlers[handlers.length - 1];
    expect(changeHandler).toBeDefined();
    await changeHandler!({ type: 'change', path: 'spec.ts' });

    expect(mockBuild).not.toHaveBeenCalled();
    expect(mockLogger.info).toHaveBeenCalledWith(
        expect.stringContaining('[dry-run]'), 
        expect.anything()
    );
  });
});
