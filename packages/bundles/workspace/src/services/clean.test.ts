import { describe, expect, it, mock, beforeEach, afterEach } from 'bun:test';
import { cleanArtifacts } from './clean';

describe('Clean Service', () => {
  const mockFs = {
    glob: mock(() => Promise.resolve([] as string[])),
    stat: mock(() => Promise.resolve({ size: 100, mtime: new Date() })),
    remove: mock(() => Promise.resolve()),
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

  beforeEach(() => {
    mockFs.glob.mockClear();
    mockFs.stat.mockClear();
    mockFs.remove.mockClear();
    mockLogger.info.mockClear();
  });

  it('should remove files returned by glob', async () => {
    mockFs.glob.mockResolvedValue(['dist/file1', 'dist/file2']);
    
    const result = await cleanArtifacts({ fs: mockFs as any, logger: mockLogger });
    
    expect(result.removed).toHaveLength(2);
    expect(mockFs.remove).toHaveBeenCalledTimes(2);
    expect(mockFs.remove).toHaveBeenCalledWith('dist/file1');
  });

  it('should skip files based on age', async () => {
    mockFs.glob.mockResolvedValue(['dist/old', 'dist/new']);
    
    const now = Date.now();
    const day = 1000 * 60 * 60 * 24;
    
    // The original mockFs.stat was defined as `mock(() => Promise.resolve(...))` (0 args).
    // To allow `mockImplementation` to receive a `path` argument, we need to cast it to `any`
    // or redefine the initial mockFs.stat to accept arguments.
    // For this specific test, we'll cast the implementation to `any` to bypass the strict type check.
    (mockFs.stat as any).mockImplementation(async (path: string) => ({
      size: 100,
      mtime: path.includes('old') 
        ? new Date(now - 8 * day)   // 8 days old
        : new Date(now - 1 * day)   // 1 day old
    }));
    // Alternatively, if mockFs.stat was defined as `stat: mock((path: string) => Promise.resolve(...))`,
    // then the `as any` would not be needed here.

    const result = await cleanArtifacts(
      { fs: mockFs as any, logger: mockLogger },
      { olderThanDays: 5 }
    );
    
    expect(result.removed).toHaveLength(1);
    expect(result.removed[0]?.path).toBe('dist/old');
    expect(result.skipped).toHaveLength(1);
    expect(result.skipped[0]?.reason).toContain('younger_than');
  });

  it('should dry run without deleting', async () => {
    mockFs.glob.mockResolvedValue(['dist/file1']);
    
    await cleanArtifacts(
      { fs: mockFs as any, logger: mockLogger },
      { dryRun: true }
    );
    
    expect(mockFs.remove).not.toHaveBeenCalled();
    expect(mockLogger.info).toHaveBeenCalledWith(
        expect.stringContaining('[dry-run]'), 
        expect.anything()
    );
  });

  it('should handle deletion errors', async () => {
    mockFs.glob.mockResolvedValue(['dist/file1']);
    mockFs.remove.mockRejectedValue(new Error('Permission denied'));
    
    const result = await cleanArtifacts({ fs: mockFs as any, logger: mockLogger });
    
    expect(result.removed).toHaveLength(0);
    expect(result.skipped).toHaveLength(1);
    expect(result.skipped[0]?.reason).toBe('Permission denied');
  });
});
