import { describe, expect, it, mock, beforeEach } from 'bun:test';
import { syncSpecs } from './sync';

describe('Sync Service', () => {
  const mockFs = {
    glob: mock(() => Promise.resolve(['spec1.ts', 'spec2.ts'])),
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

  beforeEach(() => {
    mockFs.glob.mockClear();
    mockLogger.info.mockClear();
    mockLogger.error.mockClear();
  });

  it('should sync all specs with overrides', async () => {
    const mockValidate = mock((specPath) => Promise.resolve({ valid: true, specPath } as any));
    const mockBuild = mock((specPath) => Promise.resolve({ success: true }));

    const result = await syncSpecs(
      { fs: mockFs as any, logger: mockLogger },
      config,
      { validate: true },
      { validate: mockValidate, build: mockBuild }
    );

    expect(result.specs).toHaveLength(2);
    expect(result.runs).toHaveLength(2);
    expect(mockValidate).toHaveBeenCalledTimes(2);
    expect(mockBuild).toHaveBeenCalledTimes(2);
    
    // Check validation results populated
    expect(result.runs[0]?.validation).toBeDefined();
    expect(result.runs[0]?.build).toBeDefined();
  });

  it('should handle multiple output dirs', async () => {
    const mockBuild = mock();

    await syncSpecs(
      { fs: mockFs as any, logger: mockLogger },
      config,
      { outputDirs: ['dir1', 'dir2'] },
      { build: mockBuild }
    );

    // 2 specs * 2 output dirs = 4 runs
    expect(mockBuild).toHaveBeenCalledTimes(4);
  });

  it('should support dry run', async () => {
    const mockBuild = mock();

    await syncSpecs(
      { fs: mockFs as any, logger: mockLogger },
      config,
      { dryRun: true },
      { build: mockBuild }
    );

    expect(mockBuild).not.toHaveBeenCalled();
    expect(mockLogger.info).toHaveBeenCalledWith(
        expect.stringContaining('[dry-run]'), 
        expect.anything()
    );
  });

  it('should capture errors', async () => {
    const mockValidate = mock(() => Promise.reject(new Error('Validation failed')));

    const result = await syncSpecs(
      { fs: mockFs as any, logger: mockLogger },
      config,
      { validate: true },
      { validate: mockValidate }
    );

    expect(result.runs[0]?.error).toBeDefined();
    expect(result.runs[0]?.error?.phase).toBe('validate');
    expect(result.runs[0]?.error?.message).toBe('Validation failed');
  });
});
