import { describe, it, expect, mock } from 'bun:test';
import { implementSkeletonStrategy } from './implement-skeleton';
import type { FixableIssue } from '../types';
import type { FsAdapter } from '../../../ports/fs';

describe('implementSkeletonStrategy', () => {
  const mockFs = {
    exists: mock(async () => false),
    writeFile: mock(async () => {
      /* noop */
    }),
    mkdir: mock(async () => {
      /* noop */
    }),
  };

  const adapters = {
    fs: mockFs as unknown as FsAdapter,
    path: { dirname: () => '/test' } as unknown as {
      dirname: (path: string) => string;
    },
  };

  it('should create a skeleton operation file', async () => {
    const issue: FixableIssue = {
      issue: {
        file: '/test/feature.ts',
        type: 'unresolved-ref',
        message: 'Op not found',
        severity: 'error',
        featureKey: 'feature',
      },
      ref: { key: 'newOp', version: '1' } as unknown as FixableIssue['ref'], // Testing with partial RefInfo
      specType: 'operation',
      featureFile: '/test/feature.ts',
      featureKey: 'feature',
      availableStrategies: [],
      strategies: [],
    };

    const result = await implementSkeletonStrategy(
      issue,
      { strategy: 'implement-skeleton', workspaceRoot: '/test' },
      adapters
    );

    expect(result.success).toBe(true);
    // expect(mockFs.exists).toHaveBeenCalled(); // Logic checks existence
    expect(mockFs.writeFile).toHaveBeenCalled();

    const calls = mockFs.writeFile.mock.calls as unknown as unknown[][];
    const writtenContent = calls[0]?.[1] as string;
    expect(writtenContent).toContain('defineCommand');
    expect(writtenContent).toContain("key: 'newOp'");
    expect(writtenContent).toContain("stability: 'in_creation'");
  });
});
