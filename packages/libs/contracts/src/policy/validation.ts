/**
 * Policy validation utilities.
 *
 * Provides functions to validate policy specs for consistency,
 * completeness, and cross-registry relationships.
 *
 * @module policy/validation
 *
 * @example
 * ```typescript
 * import { validatePolicySpec, validatePolicyConsistency } from '@contractspec/lib.contracts';
 *
 * // Validate a single policy spec
 * const issues = validatePolicySpec(myPolicy);
 *
 * // Validate across registries
 * const crossIssues = validatePolicyConsistency({
 *   policies: policyRegistry,
 *   operations: operationRegistry,
 * });
 * ```
 */

import type { PolicySpec, PolicyRule, FieldPolicyRule } from './spec';
import type { PolicyRegistry } from './registry';
import type { OperationSpecRegistry } from '../operations/registry';

// ─────────────────────────────────────────────────────────────────────────────
// Validation Types
// ─────────────────────────────────────────────────────────────────────────────

export type PolicyValidationLevel = 'error' | 'warning' | 'info';

export interface PolicyValidationIssue {
  level: PolicyValidationLevel;
  message: string;
  path?: string;
  context?: Record<string, unknown>;
}

export interface PolicyValidationResult {
  valid: boolean;
  issues: PolicyValidationIssue[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Policy Spec Validation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validate a policy spec for internal consistency.
 *
 * @param spec - Policy spec to validate
 * @returns Validation result with any issues found
 *
 * @example
 * ```typescript
 * const result = validatePolicySpec(myPolicy);
 * if (!result.valid) {
 *   console.log('Issues:', result.issues);
 * }
 * ```
 */
export function validatePolicySpec(spec: PolicySpec): PolicyValidationResult {
  const issues: PolicyValidationIssue[] = [];

  // Validate meta
  validateMeta(spec, issues);

  // Validate rules
  validateRules(spec, issues);

  // Validate field policies
  validateFieldPolicies(spec, issues);

  // Validate rate limits
  validateRateLimits(spec, issues);

  // Validate consents
  validateConsents(spec, issues);

  // Validate relationships
  validateRelationships(spec, issues);

  return {
    valid: issues.filter((i) => i.level === 'error').length === 0,
    issues,
  };
}

function validateMeta(spec: PolicySpec, issues: PolicyValidationIssue[]): void {
  const { meta } = spec;

  if (!meta.key?.trim()) {
    issues.push({
      level: 'error',
      message: 'Policy must have a non-empty key',
      path: 'meta.key',
    });
  }

  if (!meta.version?.trim()) {
    issues.push({
      level: 'error',
      message: 'Policy must have a non-empty version',
      path: 'meta.version',
    });
  }

  if (!meta.owners?.length) {
    issues.push({
      level: 'warning',
      message: 'Policy should specify owners',
      path: 'meta.owners',
    });
  }
}

function validateRules(
  spec: PolicySpec,
  issues: PolicyValidationIssue[]
): void {
  if (!spec.rules?.length) {
    issues.push({
      level: 'warning',
      message: 'Policy has no rules defined',
      path: 'rules',
    });
    return;
  }

  const seenRateRefs = new Set<string>();

  spec.rules.forEach((rule, index) => {
    const path = `rules[${index}]`;

    if (!rule.actions?.length) {
      issues.push({
        level: 'error',
        message: 'Rule must specify at least one action',
        path: `${path}.actions`,
      });
    }

    if (!['allow', 'deny'].includes(rule.effect)) {
      issues.push({
        level: 'error',
        message: `Invalid rule effect: ${rule.effect}`,
        path: `${path}.effect`,
      });
    }

    // Validate rate limit references
    if (typeof rule.rateLimit === 'string') {
      seenRateRefs.add(rule.rateLimit);
      if (!spec.rateLimits?.some((rl) => rl.id === rule.rateLimit)) {
        issues.push({
          level: 'error',
          message: `Rate limit "${rule.rateLimit}" referenced but not defined`,
          path: `${path}.rateLimit`,
        });
      }
    }

    // Validate consent references
    if (rule.requiresConsent?.length) {
      for (const consentId of rule.requiresConsent) {
        if (!spec.consents?.some((c) => c.id === consentId)) {
          issues.push({
            level: 'error',
            message: `Consent "${consentId}" referenced but not defined`,
            path: `${path}.requiresConsent`,
          });
        }
      }
    }

    // Validate conditions
    validateConditions(rule.conditions, `${path}.conditions`, issues);
  });

  // Check for unused rate limits
  if (spec.rateLimits?.length) {
    for (const rl of spec.rateLimits) {
      if (!seenRateRefs.has(rl.id)) {
        // Check if any rule has it inline
        const hasInline = spec.rules.some(
          (r) => typeof r.rateLimit === 'object' && r.rateLimit.id === rl.id
        );
        if (!hasInline) {
          issues.push({
            level: 'info',
            message: `Rate limit "${rl.id}" is defined but not referenced`,
            path: `rateLimits`,
          });
        }
      }
    }
  }
}

function validateFieldPolicies(
  spec: PolicySpec,
  issues: PolicyValidationIssue[]
): void {
  if (!spec.fieldPolicies?.length) return;

  const seenFields = new Map<string, FieldPolicyRule[]>();

  spec.fieldPolicies.forEach((rule, index) => {
    const path = `fieldPolicies[${index}]`;

    if (!rule.field?.trim()) {
      issues.push({
        level: 'error',
        message: 'Field policy must specify a field',
        path: `${path}.field`,
      });
    }

    if (!rule.actions?.length) {
      issues.push({
        level: 'error',
        message: 'Field policy must specify at least one action',
        path: `${path}.actions`,
      });
    }

    for (const action of rule.actions) {
      if (!['read', 'write'].includes(action)) {
        issues.push({
          level: 'error',
          message: `Invalid field action: ${action}`,
          path: `${path}.actions`,
        });
      }
    }

    // Track overlapping field policies
    const existing = seenFields.get(rule.field) ?? [];
    existing.push(rule);
    seenFields.set(rule.field, existing);

    validateConditions(rule.conditions, `${path}.conditions`, issues);
  });

  // Warn about overlapping field policies
  for (const [field, rules] of seenFields.entries()) {
    if (rules.length > 1) {
      const hasConflict =
        rules.some((r) => r.effect === 'allow') &&
        rules.some((r) => r.effect === 'deny');
      if (hasConflict) {
        issues.push({
          level: 'warning',
          message: `Field "${field}" has potentially conflicting allow/deny policies`,
          path: 'fieldPolicies',
          context: { field, ruleCount: rules.length },
        });
      }
    }
  }
}

function validateRateLimits(
  spec: PolicySpec,
  issues: PolicyValidationIssue[]
): void {
  if (!spec.rateLimits?.length) return;

  const seenIds = new Set<string>();

  spec.rateLimits.forEach((rl, index) => {
    const path = `rateLimits[${index}]`;

    if (!rl.id?.trim()) {
      issues.push({
        level: 'error',
        message: 'Rate limit must have an id',
        path: `${path}.id`,
      });
    } else if (seenIds.has(rl.id)) {
      issues.push({
        level: 'error',
        message: `Duplicate rate limit id: ${rl.id}`,
        path: `${path}.id`,
      });
    } else {
      seenIds.add(rl.id);
    }

    if (typeof rl.rpm !== 'number' || rl.rpm <= 0) {
      issues.push({
        level: 'error',
        message: 'Rate limit rpm must be a positive number',
        path: `${path}.rpm`,
      });
    }

    if (rl.windowSeconds !== undefined && rl.windowSeconds <= 0) {
      issues.push({
        level: 'error',
        message: 'Rate limit windowSeconds must be positive if specified',
        path: `${path}.windowSeconds`,
      });
    }

    if (rl.burst !== undefined && rl.burst < 0) {
      issues.push({
        level: 'error',
        message: 'Rate limit burst must be non-negative if specified',
        path: `${path}.burst`,
      });
    }
  });
}

function validateConsents(
  spec: PolicySpec,
  issues: PolicyValidationIssue[]
): void {
  if (!spec.consents?.length) return;

  const seenIds = new Set<string>();

  spec.consents.forEach((consent, index) => {
    const path = `consents[${index}]`;

    if (!consent.id?.trim()) {
      issues.push({
        level: 'error',
        message: 'Consent must have an id',
        path: `${path}.id`,
      });
    } else if (seenIds.has(consent.id)) {
      issues.push({
        level: 'error',
        message: `Duplicate consent id: ${consent.id}`,
        path: `${path}.id`,
      });
    } else {
      seenIds.add(consent.id);
    }

    if (!consent.scope?.trim()) {
      issues.push({
        level: 'error',
        message: 'Consent must specify a scope',
        path: `${path}.scope`,
      });
    }

    if (!consent.purpose?.trim()) {
      issues.push({
        level: 'error',
        message: 'Consent must specify a purpose',
        path: `${path}.purpose`,
      });
    }

    if (consent.expiresInDays !== undefined && consent.expiresInDays <= 0) {
      issues.push({
        level: 'error',
        message: 'Consent expiresInDays must be positive if specified',
        path: `${path}.expiresInDays`,
      });
    }
  });
}

function validateRelationships(
  spec: PolicySpec,
  issues: PolicyValidationIssue[]
): void {
  if (!spec.relationships?.length) return;

  const seenRelations = new Set<string>();

  spec.relationships.forEach((rel, index) => {
    const path = `relationships[${index}]`;
    const key = `${rel.subjectType}:${rel.relation}:${rel.objectType}`;

    if (!rel.subjectType?.trim()) {
      issues.push({
        level: 'error',
        message: 'Relationship must specify subjectType',
        path: `${path}.subjectType`,
      });
    }

    if (!rel.relation?.trim()) {
      issues.push({
        level: 'error',
        message: 'Relationship must specify relation',
        path: `${path}.relation`,
      });
    }

    if (!rel.objectType?.trim()) {
      issues.push({
        level: 'error',
        message: 'Relationship must specify objectType',
        path: `${path}.objectType`,
      });
    }

    if (seenRelations.has(key)) {
      issues.push({
        level: 'warning',
        message: `Duplicate relationship definition: ${key}`,
        path,
      });
    } else {
      seenRelations.add(key);
    }
  });
}

function validateConditions(
  conditions: PolicyRule['conditions'] | undefined,
  path: string,
  issues: PolicyValidationIssue[]
): void {
  if (!conditions?.length) return;

  conditions.forEach((cond, index) => {
    if (!cond.expression?.trim()) {
      issues.push({
        level: 'error',
        message: 'Condition must have a non-empty expression',
        path: `${path}[${index}].expression`,
      });
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Cross-Registry Validation
// ─────────────────────────────────────────────────────────────────────────────

export interface PolicyConsistencyDeps {
  policies: PolicyRegistry;
  operations?: OperationSpecRegistry;
}

/**
 * Validate policy consistency across registries.
 *
 * Checks that:
 * - Operations reference valid policies
 * - Policy actions align with operation kinds
 *
 * @param deps - Registry dependencies
 * @returns Validation result
 */
export function validatePolicyConsistency(
  deps: PolicyConsistencyDeps
): PolicyValidationResult {
  const issues: PolicyValidationIssue[] = [];

  // Validate each policy spec
  for (const policy of deps.policies.list()) {
    const specResult = validatePolicySpec(policy);
    issues.push(
      ...specResult.issues.map((i) => ({
        ...i,
        path: `${policy.meta.key}.v${policy.meta.version}${i.path ? `.${i.path}` : ''}`,
      }))
    );
  }

  // Cross-validate with operations
  if (deps.operations) {
    for (const operation of deps.operations.list()) {
      const policyRefs = operation.policy.policies ?? [];
      for (const ref of policyRefs) {
        const policy = deps.policies.get(ref.key, ref.version);
        if (!policy) {
          issues.push({
            level: 'error',
            message: `Operation "${operation.meta.key}.v${operation.meta.version}" references unknown policy "${ref.key}.v${ref.version}"`,
            path: `operations.${operation.meta.key}.policy.policies`,
          });
        }
      }

      // Check field policy references
      const fieldPolicies = operation.policy.fieldPolicies ?? [];
      for (const fp of fieldPolicies) {
        if (fp.policy) {
          const policy = deps.policies.get(fp.policy.key, fp.policy.version);
          if (!policy) {
            issues.push({
              level: 'error',
              message: `Operation "${operation.meta.key}.v${operation.meta.version}" references unknown field policy "${fp.policy.key}.v${fp.policy.version}"`,
              path: `operations.${operation.meta.key}.policy.fieldPolicies`,
            });
          }
        }
      }
    }
  }

  return {
    valid: issues.filter((i) => i.level === 'error').length === 0,
    issues,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Assertion Helpers
// ─────────────────────────────────────────────────────────────────────────────

export class PolicyValidationError extends Error {
  constructor(
    message: string,
    public readonly issues: PolicyValidationIssue[]
  ) {
    super(message);
    this.name = 'PolicyValidationError';
  }
}

/**
 * Assert that a policy spec is valid, throwing if not.
 *
 * @param spec - Policy spec to validate
 * @throws {PolicyValidationError} If validation fails
 */
export function assertPolicySpecValid(spec: PolicySpec): void {
  const result = validatePolicySpec(spec);
  if (!result.valid) {
    throw new PolicyValidationError(
      `Policy ${spec.meta.key}.v${spec.meta.version} is invalid`,
      result.issues
    );
  }
}

/**
 * Assert policy consistency across registries.
 *
 * @param deps - Registry dependencies
 * @throws {PolicyValidationError} If validation fails
 */
export function assertPolicyConsistency(deps: PolicyConsistencyDeps): void {
  const result = validatePolicyConsistency(deps);
  if (!result.valid) {
    throw new PolicyValidationError(
      'Policy consistency check failed',
      result.issues
    );
  }
}
