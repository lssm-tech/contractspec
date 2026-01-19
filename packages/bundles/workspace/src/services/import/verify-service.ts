/**
 * Verify service for imported contracts.
 *
 * Validates extracted contracts against existing codebase and specs.
 */

import type {
  ImportIR,
  EndpointCandidate,
  Ambiguity,
} from '@contractspec/lib.source-extractors';
import type { FsAdapter } from '../../ports/fs';
import type { LoggerAdapter } from '../../ports/logger';

/**
 * Verification result for a single endpoint.
 */
export interface EndpointVerification {
  endpoint: EndpointCandidate;
  status: 'valid' | 'warning' | 'error';
  issues: VerificationIssue[];
}

/**
 * A single verification issue.
 */
export interface VerificationIssue {
  code: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  suggestion?: string;
}

/**
 * Options for verification.
 */
export interface VerifyOptions {
  /** Check for duplicate endpoints */
  checkDuplicates?: boolean;
  /** Check for conflicting paths */
  checkConflicts?: boolean;
  /** Validate schema completeness */
  validateSchemas?: boolean;
  /** Compare against existing specs */
  compareExisting?: boolean;
  /** Path to existing specs */
  existingSpecsPath?: string;
}

/**
 * Result of verification.
 */
export interface VerifyResult {
  valid: boolean;
  endpointResults: EndpointVerification[];
  ambiguities: Ambiguity[];
  summary: {
    totalEndpoints: number;
    validEndpoints: number;
    warningEndpoints: number;
    errorEndpoints: number;
    totalIssues: number;
  };
}

/**
 * Adapters for verification service.
 */
export interface VerifyServiceAdapters {
  fs: FsAdapter;
  logger: LoggerAdapter;
}

/**
 * Verify extracted contracts from IR.
 */
export async function verifyImportedContracts(
  ir: ImportIR,
  options: VerifyOptions,
  adapters: VerifyServiceAdapters
): Promise<VerifyResult> {
  const { logger } = adapters;
  const endpointResults: EndpointVerification[] = [];
  const ambiguities: Ambiguity[] = [...ir.ambiguities];

  logger.info(`Verifying ${ir.endpoints.length} endpoints...`);

  // Check each endpoint
  for (const endpoint of ir.endpoints) {
    const issues: VerificationIssue[] = [];

    // Check confidence level
    if (
      endpoint.confidence.level === 'low' ||
      endpoint.confidence.level === 'ambiguous'
    ) {
      issues.push({
        code: 'LOW_CONFIDENCE',
        message: `Endpoint has ${endpoint.confidence.level} confidence`,
        severity: 'warning',
        suggestion: 'Review source code and add explicit schema annotations',
      });
    }

    // Check for missing input schema
    if (
      !endpoint.input &&
      (endpoint.method === 'POST' ||
        endpoint.method === 'PUT' ||
        endpoint.method === 'PATCH')
    ) {
      issues.push({
        code: 'MISSING_INPUT_SCHEMA',
        message: 'Command endpoint missing input schema',
        severity: 'warning',
        suggestion: 'Add Zod schema or class-validator DTO',
      });
    }

    // Check for missing output schema
    if (!endpoint.output) {
      issues.push({
        code: 'MISSING_OUTPUT_SCHEMA',
        message: 'Endpoint missing output schema',
        severity: 'info',
        suggestion: 'Infer from return type or add explicit schema',
      });
    }

    // Check for duplicate paths
    if (options.checkDuplicates) {
      const duplicates = ir.endpoints.filter(
        (e) =>
          e.id !== endpoint.id &&
          e.path === endpoint.path &&
          e.method === endpoint.method
      );
      if (duplicates.length > 0) {
        issues.push({
          code: 'DUPLICATE_ENDPOINT',
          message: `Duplicate ${endpoint.method} ${endpoint.path} found`,
          severity: 'error',
        });
      }
    }

    // Check for path conflicts
    if (options.checkConflicts) {
      const conflicts = findPathConflicts(endpoint, ir.endpoints);
      for (const conflict of conflicts) {
        issues.push({
          code: 'PATH_CONFLICT',
          message: `Path may conflict with ${conflict.method} ${conflict.path}`,
          severity: 'warning',
        });
      }
    }

    const status = issues.some((i) => i.severity === 'error')
      ? 'error'
      : issues.some((i) => i.severity === 'warning')
        ? 'warning'
        : 'valid';

    endpointResults.push({ endpoint, status, issues });
  }

  // Validate schemas if requested
  if (options.validateSchemas) {
    for (const schema of ir.schemas) {
      if (!schema.fields || schema.fields.length === 0) {
        ambiguities.push({
          type: 'schema',
          itemId: schema.id,
          description: `Schema ${schema.name} has no extracted fields`,
          suggestion: 'Review schema definition and add explicit field types',
          source: schema.source,
        });
      }
    }
  }

  const summary = {
    totalEndpoints: endpointResults.length,
    validEndpoints: endpointResults.filter((r) => r.status === 'valid').length,
    warningEndpoints: endpointResults.filter((r) => r.status === 'warning')
      .length,
    errorEndpoints: endpointResults.filter((r) => r.status === 'error').length,
    totalIssues: endpointResults.reduce((sum, r) => sum + r.issues.length, 0),
  };

  logger.info(
    `Verification complete: ${summary.validEndpoints} valid, ` +
      `${summary.warningEndpoints} warnings, ${summary.errorEndpoints} errors`
  );

  return {
    valid: summary.errorEndpoints === 0,
    endpointResults,
    ambiguities,
    summary,
  };
}

/**
 * Find path conflicts (e.g., /users/:id vs /users/profile).
 */
function findPathConflicts(
  endpoint: EndpointCandidate,
  allEndpoints: EndpointCandidate[]
): EndpointCandidate[] {
  const conflicts: EndpointCandidate[] = [];

  const endpointParts = endpoint.path.split('/').filter(Boolean);

  for (const other of allEndpoints) {
    if (other.id === endpoint.id) continue;
    if (other.method !== endpoint.method) continue;

    const otherParts = other.path.split('/').filter(Boolean);
    if (otherParts.length !== endpointParts.length) continue;

    let mightConflict = true;
    for (let i = 0; i < endpointParts.length; i++) {
      const a = endpointParts[i] ?? '';
      const b = otherParts[i] ?? '';

      const aIsParam = a.startsWith(':') || a.startsWith('{');
      const bIsParam = b.startsWith(':') || b.startsWith('{');

      if (!aIsParam && !bIsParam && a !== b) {
        mightConflict = false;
        break;
      }
    }

    if (mightConflict && endpoint.path !== other.path) {
      conflicts.push(other);
    }
  }

  return conflicts;
}
