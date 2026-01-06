import { describe, expect, it, mock, beforeEach, afterEach } from 'bun:test';
import { compareSpecs } from './diff';
import type { FsAdapter } from '../ports/fs';
import type { GitAdapter } from '../ports/git';

const mockComputeSemanticDiff = mock(() => []);

describe('Diff Service', () => {
  const mockFs = {
    exists: mock(() => Promise.resolve(true)),
    readFile: mock(() => Promise.resolve('spec content')),
  };

  const mockGit = {
    showFile: mock(() => Promise.resolve('old content')),
  };

  beforeEach(() => {
    mockFs.exists.mockClear();
    mockFs.readFile.mockClear();
    mockGit.showFile.mockClear();
    mockComputeSemanticDiff.mockClear();

    mock.module('@contractspec/module.workspace', () => ({
      computeSemanticDiff: mockComputeSemanticDiff,
    }));
  });

  afterEach(() => {
    mock.restore();
  });

  it('should compare two local files', async () => {
    const result = await compareSpecs('spec1.ts', 'spec2.ts', {
      fs: mockFs as unknown as FsAdapter,

      git: mockGit as unknown as GitAdapter,
    });

    expect(result.spec1).toBe('spec1.ts');
    expect(result.spec2).toBe('spec2.ts');
    expect(mockFs.readFile).toHaveBeenCalledTimes(2);
    expect(mockGit.showFile).not.toHaveBeenCalled();
    expect(mockComputeSemanticDiff).toHaveBeenCalled();
  });

  it('should compare against git baseline', async () => {
    const result = await compareSpecs(
      'spec1.ts',
      'spec1.ts',
      {
        fs: mockFs as unknown as FsAdapter,

        git: mockGit as unknown as GitAdapter,
      },
      { baseline: 'HEAD' }
    );

    expect(result.spec1).toBe('spec1.ts');
    expect(result.spec2).toBe('HEAD:spec1.ts');
    expect(mockFs.readFile).toHaveBeenCalledTimes(1);
    expect(mockGit.showFile).toHaveBeenCalledWith('HEAD', 'spec1.ts');
  });

  it('should throw if file does not exist', async () => {
    mockFs.exists.mockResolvedValue(false);

    expect(
      compareSpecs('missing.ts', 'spec2.ts', {
        fs: mockFs as unknown as FsAdapter,

        git: mockGit as unknown as GitAdapter,
      })
    ).rejects.toThrow('Spec file not found');
  });
});
