import { describe, expect, it, mock } from 'bun:test';
import { compareSpecs } from './diff';
import type { FsAdapter } from '../ports/fs';
import type { GitAdapter } from '../ports/git';

describe('Diff Service', () => {
  const spec1Code = `
    export const op = defineCommand({
      meta: { key: 'test.op', version: '1.0.0' },
      description: 'before',
    });
  `;

  const spec2Code = `
    export const op = defineCommand({
      meta: { key: 'test.op', version: '1.0.0' },
      description: 'after',
    });
  `;

  it('should compare two local files', async () => {
    const mockFs = {
      exists: mock(async () => true),
      readFile: mock(async (path: string) =>
        path === 'spec1.ts' ? spec1Code : spec2Code
      ),
    } as unknown as FsAdapter;

    const result = await compareSpecs('spec1.ts', 'spec2.ts', {
      fs: mockFs,
      git: { showFile: mock() } as unknown as GitAdapter,
    });

    expect(result.spec1).toBe('spec1.ts');
    expect(result.spec2).toBe('spec2.ts');
    expect(Array.isArray(result.differences)).toBe(true);
  });

  it('should compare against git baseline', async () => {
    const mockFs = {
      exists: mock(async () => true),
      readFile: mock(async () => spec1Code),
    } as unknown as FsAdapter;
    const mockGit = {
      showFile: mock(async () => spec2Code),
    } as unknown as GitAdapter;

    const result = await compareSpecs(
      'spec1.ts',
      'spec1.ts',
      { fs: mockFs, git: mockGit },
      { baseline: 'HEAD' }
    );

    expect(result.spec2).toBe('HEAD:spec1.ts');
    expect(Array.isArray(result.differences)).toBe(true);
  });

  it('should throw if file does not exist', async () => {
    const mockFs = {
      exists: mock(async () => false),
      readFile: mock(),
    } as unknown as FsAdapter;

    expect(
      compareSpecs('missing.ts', 'spec2.ts', {
        fs: mockFs,
        git: { showFile: mock() } as unknown as GitAdapter,
      })
    ).rejects.toThrow('Spec file not found');
  });
});
