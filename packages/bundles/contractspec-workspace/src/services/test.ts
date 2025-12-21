/**
 * Test service.
 *
 * Pure runner wrapper that executes TestSpec scenarios against a OperationSpecRegistry.
 * Loading/compiling spec modules (TS/ESM) is intentionally left to the caller.
 */

import { TestRunner, type TestSpec } from '@lssm/lib.contracts/tests';
import type { OperationSpecRegistry } from '@lssm/lib.contracts';

export type TestRunResult = Awaited<ReturnType<TestRunner['run']>>;

export interface RunTestsResult {
  results: TestRunResult[];
  passed: number;
  failed: number;
}

export async function runTests(
  specs: TestSpec[],
  registry: OperationSpecRegistry
): Promise<RunTestsResult> {
  const runner = new TestRunner({ registry });

  const results: TestRunResult[] = [];
  let passed = 0;
  let failed = 0;

  for (const spec of specs) {
    const result = await runner.run(spec);
    results.push(result);
    passed += result.passed;
    failed += result.failed;
  }

  return { results, passed, failed };
}
