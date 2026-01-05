import { describe, expect, it, mock } from 'bun:test';
import { listTests, runTests } from './test-service';
import type { WorkspaceAdapters } from '../../ports/logger';
import { OperationSpecRegistry } from '@contractspec/lib.contracts';
import type { TestSpec } from '@contractspec/lib.contracts/tests';

// Mock dependencies
const mockLoadModule = mock(async (path: string) => {
  if (path.includes('valid-spec')) {
    return {
      default: {
        meta: { key: 'test.op', version: '1.0.0' },
        target: { type: 'operation', operation: { key: 'op' } },
        scenarios: [],
      },
    };
  }
  return {};
});

mock.module('../../utils/module-loader', () => ({
  loadTypeScriptModule: mockLoadModule,
}));

describe('TestService', () => {
  const logger = {
    info: mock(),
    warn: mock(),
    error: mock(),
  } as unknown as WorkspaceAdapters['logger'];

  const adapters = { logger } as WorkspaceAdapters;

  describe('listTests', () => {
    it('should list tests from valid files', async () => {
      const tests = await listTests(['valid-spec.ts'], adapters);
      expect(tests).toHaveLength(1);
      expect(tests[0]?.meta.key).toBe('test.op');
    });

    it('should handle empty files', async () => {
      const tests = await listTests(['empty.ts'], adapters);
      expect(tests).toHaveLength(0);
      expect(logger.warn).not.toHaveBeenCalled(); // extractTestSpecs handles empty gracefully
    });

    it('should log warning on load error', async () => {
      mockLoadModule.mockRejectedValueOnce(new Error('Load failed'));
      const tests = await listTests(['error.ts'], adapters);
      expect(tests).toHaveLength(0);
      expect(logger.warn).toHaveBeenCalled();
    });
  });

  describe('runTests', () => {
    it('should execute tests using runner', async () => {
      const registry = new OperationSpecRegistry();
      const spec = {
        meta: { key: 'test', version: '1' },
        scenarios: [], // empty scenarios pass
        target: { type: 'operation', operation: { key: 'op' } },
      } as unknown as TestSpec;

      const result = await runTests([spec], registry);
      expect(result.results).toHaveLength(1);
      expect(result.results[0]?.passed).toBe(0); // 0 passed because 0 scenarios
      expect(result.results[0]?.failed).toBe(0);
    });
  });
});
