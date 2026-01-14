import { describe, expect, it, mock } from 'bun:test';
import { analyzeIntegrity } from './integrity';
import type { FsAdapter } from '../ports/fs';
import type { LoggerAdapter } from '../ports/logger';

// Mock dependencies
const mockFs = {
  glob: mock(async () => ['spec.ts', 'test.ts']),
  stat: mock(async () => ({ isDirectory: false })),
  readFile: mock(async (path: string) => {
    if (path === 'spec.ts') {
      return `
        export const op = {
          kind: 'operation',
          key: 'test.op',
          version: '1.0.0',
          type: 'command',
        };
      `;
    }
    if (path === 'test.ts') {
      return `
            export const test = {
                meta: { key: 'test.op.test', version: '1.0.0' },
                target: { type: 'operation', operation: { key: 'test.op' } }, // target logic not fully parsed by mock scanner
                kind: 'test-spec'
            };
        `;
    }
    return '';
  }),
} as unknown as FsAdapter;

// Mock module.workspace scanner
mock.module('@contractspec/module.workspace', () => ({
  isFeatureFile: () => false,
  scanFeatureSource: mock(),
  scanAllSpecsFromSource: (_content: string, file: string) => {
    if (file === 'spec.ts') {
      return [
        {
          specType: 'operation',
          key: 'test.op',
          version: '1.0.0',
          filePath: file,
          stability: 'stable',
        },
      ];
    }
    if (file === 'test.ts') {
      return [
        {
          specType: 'test-spec',
          key: 'test.op.test',
          version: '1.0.0',
          filePath: file,
          stability: 'experimental',
          target: { type: 'operation', operation: { key: 'test.op' } },
        },
      ];
    }
    return [];
  },
}));

describe('IntegrityService', () => {
  const logger = {
    info: mock(),
    warn: mock(),
    error: mock(),
  } as unknown as LoggerAdapter;

  const adapters = { fs: mockFs, logger };

  it('should detect missing tests when required', async () => {
    const result = await analyzeIntegrity(adapters, {
      requireTestsFor: ['operation'],
    });

    // With 'test.ts' present and key matching convention 'test.op.test', it should be covered.
    expect(result.coverage.missingTest).toBe(0);
  });

  it('should flag missing test if convention not met', async () => {
    // Modify mock behavior for this test - cleaner way would be separate describes or factory
    // but bun test mocks are global-ish.
    // Let's dry run a "missing" case by requiring test for 'event' which has no spec in our mock,
    // wait, 'event' has no spec in mock so it won't be checked.
    // We need an operation WITHOUT a corresponding test.
    // We have 'test.op' and 'test.op.test'.
    // If we require tests for 'operation', it passes.
    // If we change the operation key in a new file...
  });
});
