import { describe, it, expect, mock, beforeEach } from 'bun:test';
import { implementSkeletonStrategy } from './implement-skeleton';
import type { FixableIssue, FixOptions } from '../types';
import type { FsAdapter } from '../../../ports/fs';

describe('implementSkeletonStrategy', () => {
  let mockFs: any;
  let adapters: { fs: FsAdapter };

  beforeEach(() => {
    mockFs = {
      exists: mock(async () => false),
      writeFile: mock(async () => {}),
      mkdir: mock(async () => {}),
    };
    adapters = { fs: mockFs as unknown as FsAdapter };
  });

  const createIssue = (
    specType: any = 'operation',
    dryRun = false
  ): { issue: FixableIssue; options: FixOptions } => ({
    issue: {
      issue: {
        file: '/test/feature.ts',
        type: 'unresolved-ref',
        message: 'Ref not found',
        severity: 'error',
        featureKey: 'feature',
      },
      ref: { key: 'newSpec', version: '1' } as any,
      specType,
      featureFile: '/test/feature.ts',
      featureKey: 'feature',
      availableStrategies: [],
      strategies: [],
    },
    options: {
      strategy: 'implement-skeleton',
      workspaceRoot: '/test',
      dryRun,
    },
  });

  it('should create a skeleton operation file', async () => {
    const { issue, options } = createIssue('operation');
    const result = await implementSkeletonStrategy(issue, options, adapters);

    expect(result.success).toBe(true);
    expect(mockFs.writeFile).toHaveBeenCalled();
    const content = mockFs.writeFile.mock.calls[0][1];
    expect(content).toContain('defineCommand');
    expect(result.filesChanged).toHaveLength(1);
    expect(result.filesChanged[0].action).toBe('created');
  });

  it('should handle dry run correctly', async () => {
    const { issue, options } = createIssue('operation', true);
    const result = await implementSkeletonStrategy(issue, options, adapters);

    expect(result.success).toBe(true);
    expect(mockFs.writeFile).not.toHaveBeenCalled();
    expect(mockFs.mkdir).not.toHaveBeenCalled();
    expect(result.filesChanged).toHaveLength(1);
    expect(result.filesChanged[0].action).toBe('created');
  });

  it('should fail for unsupported spec type', async () => {
    const { issue, options } = createIssue('unknown-type' as any);
    const result = await implementSkeletonStrategy(issue, options, adapters);

    expect(result.success).toBe(false);
    expect(result.error).toContain('Unsupported spec type');
    expect(mockFs.writeFile).not.toHaveBeenCalled();
  });

  it('should handle file system errors', async () => {
    mockFs.mkdir = mock(() => Promise.reject(new Error('FS Error')));
    const { issue, options } = createIssue('operation');
    const result = await implementSkeletonStrategy(issue, options, adapters);

    expect(result.success).toBe(false);
    expect(result.error).toBe('FS Error');
  });

  it('should generate skeleton for event', async () => {
    const { issue, options } = createIssue('event');
    const result = await implementSkeletonStrategy(issue, options, adapters);

    expect(result.success).toBe(true);
    const content = mockFs.writeFile.mock.calls[0][1];
    expect(content).toContain('defineEvent');
  });

  it('should generate skeleton for presentation', async () => {
    const { issue, options } = createIssue('presentation');
    const result = await implementSkeletonStrategy(issue, options, adapters);

    expect(result.success).toBe(true);
    const content = mockFs.writeFile.mock.calls[0][1];
    expect(content).toContain('definePresentation');
  });

  it('should generate skeleton for capability', async () => {
    const { issue, options } = createIssue('capability');
    const result = await implementSkeletonStrategy(issue, options, adapters);

    expect(result.success).toBe(true);
    const content = mockFs.writeFile.mock.calls[0][1];
    expect(content).toContain('defineCapability');
  });
});
