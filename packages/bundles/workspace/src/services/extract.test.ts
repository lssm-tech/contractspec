import { describe, expect, it, mock, beforeEach } from 'bun:test';
import { extractContracts } from './extract';
import type { WorkspaceAdapters } from '../ports/logger';

// Mock importFromOpenApiService
mock.module('./openapi/index', () => ({
  importFromOpenApiService: mock(() =>
    Promise.resolve({
      imported: 1,
      skipped: 0,
      errors: 0,
      files: [],
      skippedOperations: [],
      errorMessages: [],
    })
  ),
}));

// Mock config loader
mock.module('./config', () => ({
  loadWorkspaceConfig: mock(() => Promise.resolve({ outputDir: 'src' })),
}));

describe('Extract Service', () => {
  const mockFs = {
    exists: mock(() => Promise.resolve(true)),
    resolve: mock((...args: string[]) => args.join('/')),
    join: mock((...args: string[]) => args.join('/')),
    readFile: mock(() => Promise.resolve('{}')),
  };

  const mockLogger = {
    info: mock(),
    warn: mock(),
    error: mock(),
    debug: mock(),
  };

  beforeEach(() => {
    mockFs.exists.mockClear();
    mockLogger.info.mockClear();
  });

  it('should extract contracts', async () => {
    const result = await extractContracts(
      { fs: mockFs, logger: mockLogger } as unknown as WorkspaceAdapters,
      { source: 'openapi.json', outputDir: 'contracts' },
      '/cwd'
    );

    expect(result.imported).toBe(1);
    expect(mockLogger.info).toHaveBeenCalled();
  });
});
