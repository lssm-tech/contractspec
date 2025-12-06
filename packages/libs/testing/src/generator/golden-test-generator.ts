import { randomUUID } from 'node:crypto';
import { performance } from 'node:perf_hooks';
import type { GoldenTestCase, TrafficSnapshot } from '../types';
import { generateVitestSuite } from '../adapters/vitest-adapter';
import { generateJestSuite } from '../adapters/jest-adapter';

export interface GoldenTestGeneratorOptions {
  suiteName: string;
  runnerImport: string;
  runnerFunction: string;
  framework?: 'vitest' | 'jest';
  serializeMetadata?: (snapshot: TrafficSnapshot) => Record<string, unknown>;
}

export class GoldenTestGenerator {
  constructor(
    private readonly serializeMetadata: GoldenTestGeneratorOptions['serializeMetadata'] = (
      snapshot
    ) =>
      ({
        tenantId: snapshot.tenantId,
        userId: snapshot.userId,
        channel: snapshot.channel,
      }) as Record<string, unknown>
  ) {}

  createCases(snapshots: TrafficSnapshot[]): GoldenTestCase[] {
    return snapshots.map((snapshot, index) => ({
      id: snapshot.id ?? randomUUID(),
      name: snapshot.success
        ? `case-${index + 1}-success`
        : `case-${index + 1}-failure`,
      input: snapshot.input,
      expectedOutput: snapshot.output,
      expectedError: snapshot.error,
      success: snapshot.success,
      metadata: this.serializeMetadata?.(snapshot),
    }));
  }

  generate(
    snapshots: TrafficSnapshot[],
    options: GoldenTestGeneratorOptions
  ): string {
    const cases = this.createCases(snapshots);
    if (options.framework === 'jest') {
      return generateJestSuite({
        suiteName: options.suiteName,
        cases,
        runnerImport: options.runnerImport,
        runnerFunction: options.runnerFunction,
      });
    }
    return generateVitestSuite({
      suiteName: options.suiteName,
      cases,
      runnerImport: options.runnerImport,
      runnerFunction: options.runnerFunction,
    });
  }
}

export type GoldenTestRunner = (
  input: unknown,
  metadata?: Record<string, unknown>
) => Promise<unknown>;

export interface GoldenTestRunResult {
  caseId: string;
  passed: boolean;
  durationMs: number;
  error?: unknown;
}

export async function runGoldenTests(
  cases: GoldenTestCase[],
  runner: GoldenTestRunner
): Promise<GoldenTestRunResult[]> {
  const results: GoldenTestRunResult[] = [];
  for (const testCase of cases) {
    const startedAt = performance.now();
    try {
      const output = await runner(testCase.input, testCase.metadata);
      if (!testCase.success) {
        results.push({
          caseId: testCase.id,
          passed: false,
          durationMs: performance.now() - startedAt,
          error: new Error('Expected failure but runner resolved'),
        });
        continue;
      }
      const matches =
        JSON.stringify(output) ===
        JSON.stringify(testCase.expectedOutput ?? null);
      results.push({
        caseId: testCase.id,
        passed: matches,
        durationMs: performance.now() - startedAt,
        error: matches
          ? undefined
          : { expected: testCase.expectedOutput, received: output },
      });
    } catch (error) {
      const durationMs = performance.now() - startedAt;
      if (!testCase.success) {
        results.push({ caseId: testCase.id, passed: true, durationMs });
      } else {
        results.push({ caseId: testCase.id, passed: false, durationMs, error });
      }
    }
  }
  return results;
}
