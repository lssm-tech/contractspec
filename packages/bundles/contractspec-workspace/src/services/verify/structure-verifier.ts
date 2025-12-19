/**
 * Tier 1: Structure Verification
 *
 * Verifies that the implementation has correct TypeScript structure:
 * - Types match spec I/O schemas
 * - Required exports exist
 * - Imports are correct
 */

import type { AnyContractSpec } from '@lssm/lib.contracts';
import { isEmitDeclRef } from '@lssm/lib.contracts/spec';
import type {
  VerificationReport,
  VerificationIssue,
} from '@lssm/lib.contracts/llm';
import type { StructureCheck, VerifyInput } from './types';

/**
 * Check if code exports a handler function.
 */
function checkHandlerExport(code: string): StructureCheck {
  const hasExport =
    /export\s+(async\s+)?function\s+\w+/.test(code) ||
    /export\s+const\s+\w+\s*=\s*(async\s*)?\(/.test(code) ||
    /export\s+default\s+(async\s+)?function/.test(code) ||
    /export\s+\{\s*\w+/.test(code);

  return {
    name: 'handler_export',
    passed: hasExport,
    details: hasExport ? undefined : 'No exported handler function found',
    suggestion:
      'Export a function that handles the operation: export async function handle(...) { }',
  };
}

/**
 * Check if code imports from @lssm/lib.contracts.
 */
function checkContractsImport(code: string): StructureCheck {
  const hasImport =
    code.includes("from '@lssm/lib.contracts'") ||
    code.includes('from "@lssm/lib.contracts"');

  return {
    name: 'contracts_import',
    passed: hasImport,
    details: hasImport ? undefined : 'Missing import from @lssm/lib.contracts',
    suggestion: "Add: import { ... } from '@lssm/lib.contracts';",
  };
}

/**
 * Check if code imports from @lssm/lib.schema.
 */
function checkSchemaImport(
  code: string,
  spec: AnyContractSpec
): StructureCheck {
  // Only required if spec uses schema types
  const needsSchema = spec.io.input !== null || spec.io.output !== null;
  if (!needsSchema) {
    return { name: 'schema_import', passed: true };
  }

  const hasImport =
    code.includes("from '@lssm/lib.schema'") ||
    code.includes('from "@lssm/lib.schema"');

  return {
    name: 'schema_import',
    passed: hasImport,
    details: hasImport ? undefined : 'Missing import from @lssm/lib.schema',
    suggestion: "Add: import { ... } from '@lssm/lib.schema';",
  };
}

/**
 * Check for TypeScript any usage.
 */
function checkNoAnyType(code: string): StructureCheck {
  // Match : any, as any, <any>, but not in comments or strings
  const anyPattern = /:\s*any\b|as\s+any\b|<any>/;

  // Simple check - could be enhanced with AST parsing
  const lines = code.split('\n');
  const anyUsages: number[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? '';
    // Skip comments
    if (line.trim().startsWith('//') || line.trim().startsWith('*')) continue;
    if (anyPattern.test(line)) {
      anyUsages.push(i + 1);
    }
  }

  return {
    name: 'no_any_type',
    passed: anyUsages.length === 0,
    details:
      anyUsages.length > 0
        ? `Found 'any' type on lines: ${anyUsages.slice(0, 5).join(', ')}${anyUsages.length > 5 ? '...' : ''}`
        : undefined,
    suggestion: 'Replace any with proper types from the spec schema',
  };
}

/**
 * Check if error codes from spec are handled.
 */
function checkErrorHandling(
  code: string,
  spec: AnyContractSpec
): StructureCheck {
  const errors = spec.io.errors;
  if (!errors || Object.keys(errors).length === 0) {
    return { name: 'error_handling', passed: true };
  }

  const errorCodes = Object.keys(errors);
  const missingErrors: string[] = [];

  for (const errorCode of errorCodes) {
    // Check if error code is mentioned in code
    if (!code.includes(errorCode)) {
      missingErrors.push(errorCode);
    }
  }

  return {
    name: 'error_handling',
    passed: missingErrors.length === 0,
    details:
      missingErrors.length > 0
        ? `Missing error handling for: ${missingErrors.join(', ')}`
        : undefined,
    suggestion: 'Implement handlers for all error cases defined in the spec',
  };
}

/**
 * Check if events are emitted.
 */
function checkEventEmission(
  code: string,
  spec: AnyContractSpec
): StructureCheck {
  const events = spec.sideEffects?.emits;
  if (!events || events.length === 0) {
    return { name: 'event_emission', passed: true };
  }

  // Look for event emission patterns
  const hasEmitPattern =
    code.includes('emit(') ||
    code.includes('.emit(') ||
    code.includes('publish(') ||
    code.includes('.publish(') ||
    code.includes('dispatchEvent') ||
    code.includes('eventBus');

  const eventNames = events.map((e) => {
    if (isEmitDeclRef(e)) {
      return e.ref.name;
    }
    return e.name;
  });

  const mentionedEvents = eventNames.filter((name) => code.includes(name));

  return {
    name: 'event_emission',
    passed: hasEmitPattern && mentionedEvents.length > 0,
    details: !hasEmitPattern
      ? 'No event emission pattern found'
      : mentionedEvents.length === 0
        ? `Events not referenced: ${eventNames.join(', ')}`
        : undefined,
    suggestion: 'Emit events as specified in sideEffects.emits',
  };
}

/**
 * Check for validation of input.
 */
function checkInputValidation(
  code: string,
  spec: AnyContractSpec
): StructureCheck {
  if (!spec.io.input) {
    return { name: 'input_validation', passed: true };
  }

  // Look for validation patterns
  const hasValidation =
    code.includes('.parse(') ||
    code.includes('.safeParse(') ||
    code.includes('validate(') ||
    code.includes('.validate(') ||
    code.includes('schema.') ||
    code.includes('zodSchema') ||
    code.includes('.getZod()');

  return {
    name: 'input_validation',
    passed: hasValidation,
    details: hasValidation ? undefined : 'No input validation pattern found',
    suggestion:
      'Validate input using the schema: schema.parse(input) or schema.safeParse(input)',
  };
}

/**
 * Check for async/await usage on async operations.
 */
function checkAsyncPatterns(
  code: string,
  spec: AnyContractSpec
): StructureCheck {
  // Check if handler is async
  const isAsync =
    /export\s+(const\s+\w+\s*=\s*)?async/.test(code) ||
    /async\s+function/.test(code);

  // For commands, async is typically expected
  const expectsAsync = spec.meta.kind === 'command';

  if (!expectsAsync) {
    return { name: 'async_patterns', passed: true };
  }

  return {
    name: 'async_patterns',
    passed: isAsync,
    details: isAsync
      ? undefined
      : 'Handler should be async for command operations',
    suggestion:
      'Make the handler function async: export async function handle(...)',
  };
}

/**
 * Run all structure checks and produce a verification report.
 */
export function verifyStructure(input: VerifyInput): VerificationReport {
  const { spec, implementationCode, implementationPath } = input;
  const startTime = Date.now();

  const checks: StructureCheck[] = [
    checkHandlerExport(implementationCode),
    checkContractsImport(implementationCode),
    checkSchemaImport(implementationCode, spec),
    checkNoAnyType(implementationCode),
    checkErrorHandling(implementationCode, spec),
    checkEventEmission(implementationCode, spec),
    checkInputValidation(implementationCode, spec),
    checkAsyncPatterns(implementationCode, spec),
  ];

  // Convert checks to issues
  const issues: VerificationIssue[] = checks
    .filter((c) => !c.passed)
    .map((c) => ({
      severity:
        c.name === 'no_any_type' ? ('warning' as const) : ('error' as const),
      category: c.name.includes('import')
        ? ('import' as const)
        : c.name.includes('export')
          ? ('export' as const)
          : ('type' as const),
      message: c.details ?? `Check failed: ${c.name}`,
      location: implementationPath ? { file: implementationPath } : undefined,
      suggestion: c.suggestion,
    }));

  const passedCount = checks.filter((c) => c.passed).length;
  const score = Math.round((passedCount / checks.length) * 100);
  const passed = issues.filter((i) => i.severity === 'error').length === 0;

  // Generate suggestions
  const suggestions = checks
    .filter((c) => !c.passed && c.suggestion)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    .map((c) => c.suggestion!);

  // Calculate coverage
  const errorCount = Object.keys(spec.io.errors ?? {}).length;
  const handledErrors = checks.find((c) => c.name === 'error_handling')?.passed
    ? errorCount
    : 0;

  return {
    tier: 'structure',
    passed,
    score,
    issues,
    suggestions,
    coverage: {
      scenarios: { total: 0, covered: 0 }, // Not applicable for structure tier
      errors: { total: errorCount, handled: handledErrors },
      fields: { total: checks.length, implemented: passedCount },
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
