import { describe, expect, it, mock, beforeEach } from 'bun:test';
import { generateArtifacts } from './generate-artifacts';
import type { WorkspaceAdapters } from '../ports/logger';

// Mock the docs generation because it uses loadSpecFromSource which uses real FS
mock.module('./docs/index', () => ({
  generateDocsFromSpecs: mock(() => Promise.resolve({ blocks: [], count: 1 })),
}));

describe('Generate Artifacts Service', () => {
  const mockFs = {
    exists: mock(() => Promise.resolve(true)),
    glob: mock(() => Promise.resolve(['spec1.ts'])),
    readFile: mock(() => Promise.resolve('')),
    join: mock((...args: string[]) => args.join('/')),
    writeFile: mock(() => Promise.resolve()),
    mkdir: mock(() => Promise.resolve()),
    resolve: mock((...args: string[]) => args.join('/')),
    dirname: mock((p: string) => p),
  };

  const mockScan = mock(() => ({
    specType: 'operation',
    key: 'spec1',
    filePath: 'spec1.ts',
  }));

  const mockLogger = {
    info: mock(),
    warn: mock(),
    error: mock(),
    debug: mock(),
    createProgress: mock(),
  };

  beforeEach(() => {
    mockFs.exists.mockClear();
    mockFs.glob.mockClear();
    mockFs.writeFile.mockClear();
    mockLogger.info.mockClear();
  });

  it('should generate artifacts', async () => {
    const result = await generateArtifacts(
      {
        fs: mockFs,
        scan: mockScan,
        logger: mockLogger,
      } as unknown as WorkspaceAdapters,
      '/cwd/contracts',
      '/cwd/generated'
    );

    expect(result.specsCount).toBe(1);
    expect(result.docsCount).toBe(1);
  });

  it('should handle no specs', async () => {
    mockFs.glob.mockResolvedValue([]);
    const result = await generateArtifacts(
      {
        fs: mockFs,
        scan: mockScan,
        logger: mockLogger,
      } as unknown as WorkspaceAdapters,
      '/cwd/contracts',
      '/cwd/generated'
    );

    expect(result.specsCount).toBe(0);
    expect(result.docsCount).toBe(0);
  });
});
