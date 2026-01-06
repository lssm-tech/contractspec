
import { describe, it, expect, mock } from 'bun:test';
import { createNodeAdapters } from './factory';

// Mock dependencies
const mockFs = {} as any;
const mockGit = {} as any;
const mockWatcher = {} as any;
const mockAi = {} as any;
const mockLogger = {} as any;
const mockNoopLogger = {} as any;

mock.module('./fs', () => ({
  createNodeFsAdapter: () => mockFs
}));
mock.module('./git', () => ({
  createNodeGitAdapter: () => mockGit
}));
mock.module('./watcher', () => ({
  createNodeWatcherAdapter: () => mockWatcher
}));
mock.module('./ai', () => ({
  createNodeAiAdapter: () => mockAi
}));
mock.module('./logger', () => ({
  createConsoleLoggerAdapter: () => mockLogger,
  createNoopLoggerAdapter: () => mockNoopLogger
}));

describe('Adapter Factory', () => {
  it('should create all adapters with default config', () => {
    const adapters = createNodeAdapters();

    expect(adapters.fs).toBe(mockFs);
    expect(adapters.git).toBe(mockGit);
    expect(adapters.watcher).toBe(mockWatcher);
    expect(adapters.ai).toBe(mockAi);
    expect(adapters.logger).toBe(mockLogger);
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
                operations: '', events: '', presentations: '', forms: ''
            }
        } 
    });
    expect(adapters.ai).toBe(mockAi);
  });

  it('should use silent logger if requested', () => {
      const adapters = createNodeAdapters({ silent: true });
      expect(adapters.logger).toBe(mockNoopLogger);
  });
});
