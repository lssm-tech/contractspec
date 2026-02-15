/**
 * Test-to-target index service.
 *
 * Builds bidirectional mappings between TestSpecs and their targets,
 * enabling contract-first test discovery instead of naming conventions.
 */

import type { SpecLocation, SpecInventory } from '../integrity';
import type { SpecScanResult } from '@contractspec/module.workspace';

/**
 * Test target extracted from a TestSpec.
 * Matches the TestTarget type from @contractspec/lib.contracts-spec.
 */
export interface ExtractedTestTarget {
  type: 'operation' | 'workflow';
  key: string;
  version?: string;
}

/**
 * Extended spec scan result with test target information.
 */
export interface TestSpecScanResult extends SpecScanResult {
  testTarget?: ExtractedTestTarget;
}

/**
 * Bidirectional index mapping between tests and their targets.
 */
export interface TestToTargetIndex {
  /**
   * Map from target spec key (e.g., "my-op.v1.0.0") to set of test spec keys.
   * A single target can have multiple tests.
   */
  targetToTests: Map<string, Set<string>>;

  /**
   * Map from test spec key to target key.
   * Each test targets exactly one spec.
   */
  testToTarget: Map<string, string>;

  /**
   * Tests with targets that don't exist in the inventory.
   */
  orphanedTests: string[];

  /**
   * Tests without a valid target field (legacy naming convention only).
   */
  testsWithoutTarget: string[];
}

/**
 * Build a spec key from key and version.
 */
function makeSpecKey(key: string, version: string): string {
  return `${key}.v${version}`;
}

/**
 * Build the test-to-target index from test spec scan results.
 *
 * @param testSpecScans - Array of test spec scan results with testTarget info
 * @param inventory - The full spec inventory to validate targets against
 * @returns Bidirectional index for test-target relationships
 */
export function buildTestIndex(
  testSpecScans: TestSpecScanResult[],
  inventory: SpecInventory
): TestToTargetIndex {
  const targetToTests = new Map<string, Set<string>>();
  const testToTarget = new Map<string, string>();
  const orphanedTests: string[] = [];
  const testsWithoutTarget: string[] = [];

  for (const scan of testSpecScans) {
    if (!scan.key || !scan.version) continue;

    const testKey = makeSpecKey(scan.key, scan.version);

    if (!scan.testTarget) {
      // Test doesn't have a target field - relies on naming convention
      testsWithoutTarget.push(testKey);
      continue;
    }

    const { type, key, version } = scan.testTarget;
    const targetVersion = version ?? scan.version; // Default to test's version
    const targetKey = makeSpecKey(key, targetVersion);

    // Validate target exists in inventory
    const targetMap = getTargetMap(inventory, type);
    if (!targetMap || !targetMap.has(targetKey)) {
      orphanedTests.push(testKey);
      continue;
    }

    // Build bidirectional mapping
    testToTarget.set(testKey, targetKey);

    if (!targetToTests.has(targetKey)) {
      targetToTests.set(targetKey, new Set());
    }
    targetToTests.get(targetKey)?.add(testKey);
  }

  return {
    targetToTests,
    testToTarget,
    orphanedTests,
    testsWithoutTarget,
  };
}

/**
 * Get the inventory map for a target type.
 */
function getTargetMap(
  inventory: SpecInventory,
  type: 'operation' | 'workflow'
): Map<string, SpecLocation> | undefined {
  switch (type) {
    case 'operation':
      return inventory.operations;
    case 'workflow':
      return inventory.workflows;
    default:
      return undefined;
  }
}

/**
 * Check if a spec has test coverage via target-based linking.
 *
 * @param specKey - The spec key (e.g., "my-op.v1.0.0")
 * @param index - The test-to-target index
 * @returns true if at least one TestSpec targets this spec
 */
export function hasTargetedTest(
  specKey: string,
  index: TestToTargetIndex
): boolean {
  return index.targetToTests.has(specKey);
}

/**
 * Get all tests that target a specific spec.
 *
 * @param specKey - The spec key (e.g., "my-op.v1.0.0")
 * @param index - The test-to-target index
 * @returns Array of test spec keys, empty if none
 */
export function getTestsForSpec(
  specKey: string,
  index: TestToTargetIndex
): string[] {
  const tests = index.targetToTests.get(specKey);
  return tests ? Array.from(tests) : [];
}

/**
 * Get the target spec for a test.
 *
 * @param testKey - The test spec key
 * @param index - The test-to-target index
 * @returns The target spec key, or undefined if no target
 */
export function getTargetForTest(
  testKey: string,
  index: TestToTargetIndex
): string | undefined {
  return index.testToTarget.get(testKey);
}

export { validateTestRefs } from './test-ref-validator';
export type {
  TestRefValidationResult,
  TestRefValidationOptions,
} from './test-ref-validator';
