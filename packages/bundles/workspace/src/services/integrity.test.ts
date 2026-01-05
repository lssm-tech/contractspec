import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { analyzeIntegrity } from './integrity';
import type { FsAdapter } from '../ports/fs';
import type { LoggerAdapter } from '../ports/logger';
import type { SpecScanResult } from '@contractspec/module.workspace';

// Mock dependencies
let files: string[] = ['spec.ts', 'test.ts'];
let scanResultsByFile: Record<string, SpecScanResult[]> = {};
const mockFs = {
  glob: mock(async () => files),
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
          meta: { key: 'test.op.qa', version: '1.0.0' },
          target: { type: 'operation', key: 'test.op', version: '1.0.0' },
          kind: 'test-spec'
        };
      `;
    }
    if (path === 'no-target-test.ts') {
      return `
        export const test = {
          meta: { key: 'test.op.qa', version: '1.0.0' },
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
  scanAllSpecsFromSource: (_content: string, file: string) =>
    scanResultsByFile[file] ?? [],
}));

describe('IntegrityService', () => {
  const logger = {
    info: mock(),
    warn: mock(),
    error: mock(),
  } as unknown as LoggerAdapter;

  const adapters = { fs: mockFs, logger };

  beforeEach(() => {
    files = ['spec.ts', 'test.ts'];
    scanResultsByFile = {
      'spec.ts': [
        {
          specType: 'operation',
          key: 'test.op',
          version: '1.0.0',
          filePath: 'spec.ts',
          stability: 'stable',
        },
      ],
      'test.ts': [
        {
          specType: 'test-spec',
          key: 'test.op.qa',
          version: '1.0.0',
          filePath: 'test.ts',
          stability: 'experimental',
          testTargets: [
            { type: 'operation', key: 'test.op', version: '1.0.0' },
          ],
        },
      ],
    };
  });

  it('uses parsed test targets when available', async () => {
    const result = await analyzeIntegrity(adapters, {
      requireTestsFor: ['operation'],
    });

    expect(result.coverage.missingTest).toBe(0);
  });

  it('falls back to naming convention when targets are missing', async () => {
    files = ['spec.ts', 'no-target-test.ts'];
    scanResultsByFile = {
      'spec.ts': [
        {
          specType: 'operation',
          key: 'test.op',
          version: '1.0.0',
          filePath: 'spec.ts',
          stability: 'stable',
        },
      ],
      'no-target-test.ts': [
        {
          specType: 'test-spec',
          key: 'test.op.qa',
          version: '1.0.0',
          filePath: 'no-target-test.ts',
          stability: 'experimental',
        },
      ],
    };

    const result = await analyzeIntegrity(adapters, {
      requireTestsFor: ['operation'],
    });

    expect(result.coverage.missingTest).toBe(1);
  });
});
