import { describe, it, expect, mock } from 'bun:test';
import { createNodeAdapters } from './factory';

// Mock dependencies
const mockFs = {} as unknown;
const mockGit = {} as unknown;
const mockWatcher = {} as unknown;
const mockAi = {} as unknown;
const mockLogger = {} as unknown;
const mockNoopLogger = {} as unknown;

mock.module('./fs', () => ({
  createNodeFsAdapter: () => mockFs,
}));
mock.module('./git', () => ({
  createNodeGitAdapter: () => mockGit,
}));
mock.module('./watcher', () => ({
  createNodeWatcherAdapter: () => mockWatcher,
}));
mock.module('./ai', () => ({
  createNodeAiAdapter: () => mockAi,
}));
mock.module('./logger', () => ({
  createConsoleLoggerAdapter: () => mockLogger,
  createNoopLoggerAdapter: () => mockNoopLogger,
}));

describe('Adapter Factory', () => {
  it('should create all adapters with default config', () => {
    const adapters = createNodeAdapters();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(adapters.fs).toBe(mockFs as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(adapters.git).toBe(mockGit as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(adapters.watcher).toBe(mockWatcher as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(adapters.ai).toBe(mockAi as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(adapters.logger).toBe(mockLogger as any);
  });

  it('should use provided config', () => {
    // Config logic inside createNodeAdapters is dealing with types mainly,
    // but we can verify it doesn't crash
    const adapters = createNodeAdapters({
      cwd: '/test',
      config: {
        aiProvider: 'openai',
        agentMode: 'simple',
        outputDir: 'out',
        defaultOwners: [],
        defaultTags: [],
        conventions: {
          operations: '',
          events: '',
          presentations: '',
          forms: '',
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(adapters.ai).toBe(mockAi as any);
  });

  it('should use silent logger if requested', () => {
    const adapters = createNodeAdapters({ silent: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(adapters.logger).toBe(mockNoopLogger as any);
  });
});
