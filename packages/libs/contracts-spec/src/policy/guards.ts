/**
 * Policy guards for runtime enforcement.
 *
 * Provides utilities to assert that operations have their required
 * policy constraints satisfied before execution.
 *
 * @module policy/guards
 *
 * @example
 * ```typescript
 * import { assertPolicyForOperation } from '@contractspec/lib.contracts-spec';
 *
 * // In a handler or middleware
 * assertPolicyForOperation(ctx, operation);
 * ```
 */

import type { PolicyContext } from './context';
import { PolicyViolationError } from './context';
import type { AnyOperationSpec } from '../operations/operation';

// ─────────────────────────────────────────────────────────────────────────────
// Guard Types
// ─────────────────────────────────────────────────────────────────────────────

/** Result of a policy guard check. */
export interface PolicyGuardResult {
  /** Whether the guard passed. */
  allowed: boolean;
  /** Reason for denial if guard failed. */
  reason?: string;
  /** Missing requirements if guard failed. */
  missing?: {
    roles?: string[];
    permissions?: string[];
    flags?: string[];
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Auth Level Mapping
// ─────────────────────────────────────────────────────────────────────────────

const AUTH_LEVEL_ORDER = ['anonymous', 'user', 'admin'] as const;

function _getAuthLevelIndex(level: 'anonymous' | 'user' | 'admin'): number {
  return AUTH_LEVEL_ORDER.indexOf(level);
}

function checkAuthLevel(
  ctx: PolicyContext,
  required: 'anonymous' | 'user' | 'admin'
): boolean {
  // Anonymous always passes
  if (required === 'anonymous') return true;

  // User level requires being authenticated (not anonymous)
  if (required === 'user') {
    return ctx.user.id !== 'anonymous';
  }

  // Admin level requires admin role
  if (required === 'admin') {
    return ctx.hasRole('admin');
  }

  return false;
}

// ─────────────────────────────────────────────────────────────────────────────
// Guard Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Check if an operation's policy constraints are satisfied.
 *
 * @param ctx - Policy context to check against
 * @param operation - Operation spec to check
 * @param flags - Available feature flags
 * @returns Guard result indicating if operation is allowed
 *
 * @example
 * ```typescript
 * const result = checkPolicyForOperation(ctx, myOperation, ['feature-x']);
 * if (!result.allowed) {
 *   console.log('Denied:', result.reason);
 * }
 * ```
 */
export function checkPolicyForOperation(
  ctx: PolicyContext,
  operation: AnyOperationSpec,
  flags: string[] = []
): PolicyGuardResult {
  const { policy } = operation;
  const operationName = `${operation.meta.key}.v${operation.meta.version}`;
  const missing: PolicyGuardResult['missing'] = {};

  // Check auth level
  if (!checkAuthLevel(ctx, policy.auth)) {
    return {
      allowed: false,
      reason: `Operation "${operationName}" requires "${policy.auth}" auth level`,
      missing: {
        roles: policy.auth === 'admin' ? ['admin'] : undefined,
      },
    };
  }

  // Check feature flags
  if (policy.flags?.length) {
    const availableFlags = new Set(flags);
    const missingFlags = policy.flags.filter((f) => !availableFlags.has(f));
    if (missingFlags.length > 0) {
      missing.flags = missingFlags;
      return {
        allowed: false,
        reason: `Operation "${operationName}" requires feature flags: ${missingFlags.join(', ')}`,
        missing,
      };
    }
  }

  return { allowed: true };
}

/**
 * Assert that an operation's policy constraints are satisfied.
 *
 * @param ctx - Policy context to check against
 * @param operation - Operation spec to check
 * @param flags - Available feature flags
 * @throws {PolicyViolationError} If policy is not satisfied
 *
 * @example
 * ```typescript
 * // Throws if policy not satisfied
 * assertPolicyForOperation(ctx, myOperation);
 *
 * // Safe to proceed with operation
 * await handler(input);
 * ```
 */
export function assertPolicyForOperation(
  ctx: PolicyContext,
  operation: AnyOperationSpec,
  flags: string[] = []
): void {
  const result = checkPolicyForOperation(ctx, operation, flags);
  if (!result.allowed) {
    const operationName = `${operation.meta.key}.v${operation.meta.version}`;

    // Audit the denial
    ctx.auditAccess(operationName, 'denied', result.reason);

    throw new PolicyViolationError('access_denied', {
      operation: operationName,
      reason: result.reason,
    });
  }

  // Audit the allowance
  const operationName = `${operation.meta.key}.v${operation.meta.version}`;
  ctx.auditAccess(operationName, 'allowed');
}

/**
 * Filter operations to only those with satisfied policy constraints.
 *
 * @param ctx - Policy context to check against
 * @param operations - Operations to filter
 * @param flags - Available feature flags
 * @returns Operations that have their policies satisfied
 */
export function filterOperationsByPolicy(
  ctx: PolicyContext,
  operations: AnyOperationSpec[],
  flags: string[] = []
): AnyOperationSpec[] {
  return operations.filter(
    (op) => checkPolicyForOperation(ctx, op, flags).allowed
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Role-Based Guards
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Check if user has the required role for an operation.
 *
 * @param ctx - Policy context to check against
 * @param requiredRole - Role required for the operation
 * @param operation - Optional operation name for error messages
 * @returns Guard result
 */
export function checkRole(
  ctx: PolicyContext,
  requiredRole: string,
  operation?: string
): PolicyGuardResult {
  if (ctx.hasRole(requiredRole)) {
    return { allowed: true };
  }

  return {
    allowed: false,
    reason: operation
      ? `Operation "${operation}" requires role "${requiredRole}"`
      : `Missing required role "${requiredRole}"`,
    missing: { roles: [requiredRole] },
  };
}

/**
 * Assert user has the required role.
 *
 * @param ctx - Policy context to check against
 * @param requiredRole - Role required
 * @param operation - Optional operation name for error messages
 * @throws {PolicyViolationError} If role is missing
 */
export function assertRole(
  ctx: PolicyContext,
  requiredRole: string,
  operation?: string
): void {
  const result = checkRole(ctx, requiredRole, operation);
  if (!result.allowed) {
    throw new PolicyViolationError('missing_role', {
      operation,
      requiredRole,
    });
  }
}

/**
 * Check if user has any of the required roles.
 *
 * @param ctx - Policy context to check against
 * @param requiredRoles - Any of these roles is sufficient
 * @param operation - Optional operation name for error messages
 * @returns Guard result
 */
export function checkAnyRole(
  ctx: PolicyContext,
  requiredRoles: string[],
  operation?: string
): PolicyGuardResult {
  if (ctx.hasAnyRole(requiredRoles)) {
    return { allowed: true };
  }

  return {
    allowed: false,
    reason: operation
      ? `Operation "${operation}" requires one of roles: ${requiredRoles.join(', ')}`
      : `Missing required role (need one of: ${requiredRoles.join(', ')})`,
    missing: { roles: requiredRoles },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Permission-Based Guards
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Check if user has the required permission.
 *
 * @param ctx - Policy context to check against
 * @param requiredPermission - Permission required
 * @param operation - Optional operation name for error messages
 * @returns Guard result
 */
export function checkPermission(
  ctx: PolicyContext,
  requiredPermission: string,
  operation?: string
): PolicyGuardResult {
  if (ctx.hasPermission(requiredPermission)) {
    return { allowed: true };
  }

  return {
    allowed: false,
    reason: operation
      ? `Operation "${operation}" requires permission "${requiredPermission}"`
      : `Missing required permission "${requiredPermission}"`,
    missing: { permissions: [requiredPermission] },
  };
}

/**
 * Assert user has the required permission.
 *
 * @param ctx - Policy context to check against
 * @param requiredPermission - Permission required
 * @param operation - Optional operation name for error messages
 * @throws {PolicyViolationError} If permission is missing
 */
export function assertPermission(
  ctx: PolicyContext,
  requiredPermission: string,
  operation?: string
): void {
  const result = checkPermission(ctx, requiredPermission, operation);
  if (!result.allowed) {
    throw new PolicyViolationError('missing_permission', {
      operation,
      requiredPermission,
    });
  }
}

/**
 * Check if user has all of the required permissions.
 *
 * @param ctx - Policy context to check against
 * @param requiredPermissions - All of these permissions are required
 * @param operation - Optional operation name for error messages
 * @returns Guard result
 */
export function checkAllPermissions(
  ctx: PolicyContext,
  requiredPermissions: string[],
  operation?: string
): PolicyGuardResult {
  const missing = requiredPermissions.filter((p) => !ctx.hasPermission(p));
  if (missing.length === 0) {
    return { allowed: true };
  }

  return {
    allowed: false,
    reason: operation
      ? `Operation "${operation}" requires permissions: ${missing.join(', ')}`
      : `Missing required permissions: ${missing.join(', ')}`,
    missing: { permissions: missing },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Combined Guards
// ─────────────────────────────────────────────────────────────────────────────

export interface CombinedPolicyRequirements {
  roles?: string[];
  anyRole?: string[];
  permissions?: string[];
  anyPermission?: string[];
  flags?: string[];
}

/**
 * Check multiple policy requirements at once.
 *
 * @param ctx - Policy context to check against
 * @param requirements - Combined requirements to check
 * @param flags - Available feature flags
 * @param operation - Optional operation name for error messages
 * @returns Guard result
 */
export function checkCombinedPolicy(
  ctx: PolicyContext,
  requirements: CombinedPolicyRequirements,
  flags: string[] = [],
  operation?: string
): PolicyGuardResult {
  const missing: PolicyGuardResult['missing'] = {};
  const reasons: string[] = [];

  // Check required roles (all must match)
  if (requirements.roles?.length) {
    const missingRoles = requirements.roles.filter((r) => !ctx.hasRole(r));
    if (missingRoles.length > 0) {
      missing.roles = missingRoles;
      reasons.push(`Missing roles: ${missingRoles.join(', ')}`);
    }
  }

  // Check any role (at least one must match)
  if (requirements.anyRole?.length) {
    if (!ctx.hasAnyRole(requirements.anyRole)) {
      missing.roles = [...(missing.roles ?? []), ...requirements.anyRole];
      reasons.push(`Need one of roles: ${requirements.anyRole.join(', ')}`);
    }
  }

  // Check required permissions (all must match)
  if (requirements.permissions?.length) {
    const missingPerms = requirements.permissions.filter(
      (p) => !ctx.hasPermission(p)
    );
    if (missingPerms.length > 0) {
      missing.permissions = missingPerms;
      reasons.push(`Missing permissions: ${missingPerms.join(', ')}`);
    }
  }

  // Check any permission (at least one must match)
  if (requirements.anyPermission?.length) {
    if (!ctx.hasAnyPermission(requirements.anyPermission)) {
      missing.permissions = [
        ...(missing.permissions ?? []),
        ...requirements.anyPermission,
      ];
      reasons.push(
        `Need one of permissions: ${requirements.anyPermission.join(', ')}`
      );
    }
  }

  // Check feature flags
  if (requirements.flags?.length) {
    const availableFlags = new Set(flags);
    const missingFlags = requirements.flags.filter(
      (f) => !availableFlags.has(f)
    );
    if (missingFlags.length > 0) {
      missing.flags = missingFlags;
      reasons.push(`Missing feature flags: ${missingFlags.join(', ')}`);
    }
  }

  if (reasons.length > 0) {
    const prefix = operation ? `Operation "${operation}": ` : '';
    return {
      allowed: false,
      reason: prefix + reasons.join('; '),
      missing,
    };
  }

  return { allowed: true };
}

/**
 * Assert multiple policy requirements at once.
 *
 * @param ctx - Policy context to check against
 * @param requirements - Combined requirements to check
 * @param flags - Available feature flags
 * @param operation - Optional operation name for error messages
 * @throws {PolicyViolationError} If any requirement is not met
 */
export function assertCombinedPolicy(
  ctx: PolicyContext,
  requirements: CombinedPolicyRequirements,
  flags: string[] = [],
  operation?: string
): void {
  const result = checkCombinedPolicy(ctx, requirements, flags, operation);
  if (!result.allowed) {
    throw new PolicyViolationError('access_denied', {
      operation,
      reason: result.reason,
    });
  }
}
