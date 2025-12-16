/**
 * Tier 2: Behavior Verification
 *
 * Verifies that the implementation covers acceptance scenarios,
 * examples, and error cases defined in the spec.
 */

import type { AnyContractSpec } from '@lssm/lib.contracts';
import { isEmitDeclRef } from '@lssm/lib.contracts/spec';
import type {
  VerificationReport,
  VerificationIssue,
} from '@lssm/lib.contracts/llm';
import type { BehaviorCheck, VerifyInput } from './types';

/**
 * Check if a scenario is likely covered by the implementation.
 */
function checkScenarioCoverage(
  code: string,
  scenario: { name: string; given: string[]; when: string[]; then: string[] }
): BehaviorCheck {
  // Extract keywords from scenario
  const keywords = [
    ...scenario.given,
    ...scenario.when,
    ...scenario.then,
  ].flatMap((s) =>
    s
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 3)
  );

  // Count how many keywords appear in code
  const codeLower = code.toLowerCase();
  const foundKeywords = keywords.filter((kw) => codeLower.includes(kw));
  const coverage =
    keywords.length > 0 ? foundKeywords.length / keywords.length : 0;

  // Also check for test patterns mentioning the scenario
  const scenarioNameLower = scenario.name.toLowerCase().replace(/\s+/g, '');
  const hasTestForScenario =
    codeLower.includes(scenarioNameLower) ||
    codeLower.includes(`test('${scenario.name.toLowerCase()}'`) ||
    codeLower.includes(`it('${scenario.name.toLowerCase()}'`) ||
    codeLower.includes(`describe('${scenario.name.toLowerCase()}'`);

  const passed = coverage >= 0.3 || hasTestForScenario;

  return {
    name: scenario.name,
    type: 'scenario',
    passed,
    expected: `Given: ${scenario.given.join('; ')}; When: ${scenario.when.join('; ')}; Then: ${scenario.then.join('; ')}`,
    details: passed
      ? undefined
      : `Scenario keywords not found in implementation (${Math.round(coverage * 100)}% coverage)`,
  };
}

/**
 * Check if an example is likely handled.
 */
function checkExampleCoverage(
  code: string,
  example: { name: string; input: unknown; output: unknown }
): BehaviorCheck {
  // Extract key values from example
  const inputStr = JSON.stringify(example.input);
  const outputStr = JSON.stringify(example.output);

  // Look for example values in code (could be in tests or implementation)
  const inputValues = extractStringValues(example.input);
  const outputValues = extractStringValues(example.output);

  const codeLower = code.toLowerCase();
  const foundInputValues = inputValues.filter((v) =>
    codeLower.includes(v.toLowerCase())
  );
  const foundOutputValues = outputValues.filter((v) =>
    codeLower.includes(v.toLowerCase())
  );

  const inputCoverage =
    inputValues.length > 0 ? foundInputValues.length / inputValues.length : 1;
  const outputCoverage =
    outputValues.length > 0
      ? foundOutputValues.length / outputValues.length
      : 1;
  const avgCoverage = (inputCoverage + outputCoverage) / 2;

  const passed = avgCoverage >= 0.2;

  return {
    name: example.name,
    type: 'example',
    passed,
    expected: `Input: ${inputStr.slice(0, 100)}...; Output: ${outputStr.slice(0, 100)}...`,
    details: passed
      ? undefined
      : `Example values not found in implementation (${Math.round(avgCoverage * 100)}% coverage)`,
  };
}

/**
 * Extract string values from an object for comparison.
 */
function extractStringValues(obj: unknown): string[] {
  const values: string[] = [];

  function extract(value: unknown): void {
    if (typeof value === 'string' && value.length > 2) {
      values.push(value);
    } else if (Array.isArray(value)) {
      value.forEach(extract);
    } else if (value && typeof value === 'object') {
      Object.values(value).forEach(extract);
    }
  }

  extract(obj);
  return values;
}

/**
 * Check if an error case is handled.
 */
function checkErrorCaseCoverage(
  code: string,
  errorCode: string,
  errorDef: { description: string; http?: number; when: string }
): BehaviorCheck {
  // Check if error code is referenced
  const hasErrorCode = code.includes(errorCode);

  // Check for HTTP status code
  const hasHttpStatus = errorDef.http
    ? code.includes(String(errorDef.http))
    : true;

  // Check for keywords from the 'when' condition
  const whenKeywords = errorDef.when
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 3);
  const codeLower = code.toLowerCase();
  const foundWhenKeywords = whenKeywords.filter((kw) => codeLower.includes(kw));
  const whenCoverage =
    whenKeywords.length > 0
      ? foundWhenKeywords.length / whenKeywords.length
      : 1;

  const passed = hasErrorCode && (hasHttpStatus || whenCoverage >= 0.3);

  return {
    name: `Error: ${errorCode}`,
    type: 'error',
    passed,
    expected: `When: ${errorDef.when}; Return: ${errorCode} (HTTP ${errorDef.http ?? 400})`,
    details: passed
      ? undefined
      : !hasErrorCode
        ? `Error code '${errorCode}' not found in implementation`
        : `Error condition not properly implemented`,
  };
}

/**
 * Check if events are emitted in the right conditions.
 */
function checkEventConditions(
  code: string,
  spec: AnyContractSpec
): BehaviorCheck[] {
  const events = spec.sideEffects?.emits ?? [];
  const checks: BehaviorCheck[] = [];

  for (const event of events) {
    const eventName = isEmitDeclRef(event) ? event.ref.name : event.name;
    const when = event.when;

    // Check if event name appears near the condition keywords
    const whenKeywords = when
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 3);
    const codeLower = code.toLowerCase();

    // Find if event is mentioned
    const hasEvent = codeLower.includes(eventName.toLowerCase());

    // Find if condition keywords are present
    const foundKeywords = whenKeywords.filter((kw) => codeLower.includes(kw));
    const conditionCoverage =
      whenKeywords.length > 0 ? foundKeywords.length / whenKeywords.length : 1;

    checks.push({
      name: `Event: ${eventName}`,
      type: 'scenario',
      passed: hasEvent && conditionCoverage >= 0.3,
      expected: `Emit ${eventName} when: ${when}`,
      details: !hasEvent
        ? `Event '${eventName}' not found`
        : conditionCoverage < 0.3
          ? `Event condition not properly implemented`
          : undefined,
    });
  }

  return checks;
}

/**
 * Check if idempotency is properly handled.
 */
function checkIdempotency(
  code: string,
  spec: AnyContractSpec
): BehaviorCheck | null {
  if (spec.policy.idempotent === undefined) {
    return null;
  }

  if (!spec.policy.idempotent) {
    // Command that's not idempotent - no specific check needed
    return null;
  }

  // For idempotent operations, look for patterns that ensure idempotency
  const idempotentPatterns = [
    'idempotency',
    'idempotent',
    'already exists',
    'upsert',
    'on conflict',
    'if not exists',
    'dedupe',
    'duplicate',
  ];

  const codeLower = code.toLowerCase();
  const hasIdempotentPattern = idempotentPatterns.some((p) =>
    codeLower.includes(p)
  );

  return {
    name: 'Idempotency',
    type: 'scenario',
    passed: hasIdempotentPattern,
    expected: 'Operation should be idempotent (safe to retry)',
    details: hasIdempotentPattern
      ? undefined
      : 'No idempotency pattern found for idempotent operation',
  };
}

/**
 * Run all behavior checks and produce a verification report.
 */
export function verifyBehavior(input: VerifyInput): VerificationReport {
  const { spec, implementationCode, implementationPath } = input;
  const startTime = Date.now();

  const checks: BehaviorCheck[] = [];

  // Check scenarios
  for (const scenario of spec.acceptance?.scenarios ?? []) {
    checks.push(checkScenarioCoverage(implementationCode, scenario));
  }

  // Check examples
  for (const example of spec.acceptance?.examples ?? []) {
    checks.push(checkExampleCoverage(implementationCode, example));
  }

  // Check error cases
  for (const [code, errorDef] of Object.entries(spec.io.errors ?? {})) {
    checks.push(checkErrorCaseCoverage(implementationCode, code, errorDef));
  }

  // Check event conditions
  checks.push(...checkEventConditions(implementationCode, spec));

  // Check idempotency
  const idempotencyCheck = checkIdempotency(implementationCode, spec);
  if (idempotencyCheck) {
    checks.push(idempotencyCheck);
  }

  // Convert to issues
  const issues: VerificationIssue[] = checks
    .filter((c) => !c.passed)
    .map((c) => ({
      severity: c.type === 'error' ? ('error' as const) : ('warning' as const),
      category:
        c.type === 'scenario'
          ? ('scenario' as const)
          : c.type === 'example'
            ? ('scenario' as const)
            : ('error_handling' as const),
      message: c.details ?? `${c.type} not covered: ${c.name}`,
      location: implementationPath ? { file: implementationPath } : undefined,
      suggestion: c.expected ? `Expected: ${c.expected}` : undefined,
    }));

  // Calculate metrics
  const scenarioChecks = checks.filter((c) => c.type === 'scenario');
  const errorChecks = checks.filter((c) => c.type === 'error');

  const passedCount = checks.filter((c) => c.passed).length;
  const score =
    checks.length > 0 ? Math.round((passedCount / checks.length) * 100) : 100;
  const passed = issues.filter((i) => i.severity === 'error').length === 0;

  // Generate suggestions
  const suggestions = checks
    .filter((c) => !c.passed && c.expected)
    .map((c) => `${c.name}: ${c.expected}`);

  return {
    tier: 'behavior',
    passed,
    score,
    issues,
    suggestions,
    coverage: {
      scenarios: {
        total: scenarioChecks.length,
        covered: scenarioChecks.filter((c) => c.passed).length,
      },
      errors: {
        total: errorChecks.length,
        handled: errorChecks.filter((c) => c.passed).length,
      },
      fields: {
        total: checks.length,
        implemented: passedCount,
      },
    },
    meta: {
      specName: spec.meta.name,
      specVersion: spec.meta.version,
      implementationPath: implementationPath ?? 'unknown',
      verifiedAt: new Date().toISOString(),
      duration: Date.now() - startTime,
    },
  };
}
