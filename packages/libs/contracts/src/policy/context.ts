/**
 * Runtime policy context for opt-in policy enforcement.
 *
 * Provides a context object that can be used to check if a user/tenant
 * has specific roles, permissions, and attributes at runtime.
 *
 * @module policy/context
 *
 * @example
 * ```typescript
 * import { createPolicyContext } from '@contractspec/lib.contracts';
 *
 * // Create context from user's roles and permissions
 * const ctx = createPolicyContext({
 *   id: 'user-123',
 *   tenantId: 'tenant-456',
 *   roles: ['admin', 'editor'],
 *   permissions: ['read:articles', 'write:articles'],
 *   attributes: { department: 'engineering' },
 * });
 *
 * // Check roles and permissions
 * if (ctx.hasRole('admin')) {
 *   // User has admin role
 * }
 *
 * // Audit access attempts
 * ctx.auditAccess('article.update', 'allowed');
 * ```
 */

// ─────────────────────────────────────────────────────────────────────────────
// Error Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Error thrown when a policy violation occurs.
 */
export class PolicyViolationError extends Error {
  readonly violationType: PolicyViolationType;
  readonly details: PolicyViolationDetails;

  constructor(type: PolicyViolationType, details: PolicyViolationDetails) {
    const message = formatPolicyViolationMessage(type, details);
    super(message);
    this.name = 'PolicyViolationError';
    this.violationType = type;
    this.details = details;
  }
}

export type PolicyViolationType =
  | 'missing_role'
  | 'missing_permission'
  | 'missing_attribute'
  | 'rate_limit_exceeded'
  | 'consent_required'
  | 'access_denied';

export interface PolicyViolationDetails {
  operation?: string;
  requiredRole?: string;
  requiredPermission?: string;
  requiredAttribute?: { key: string; expected: unknown };
  rateLimitKey?: string;
  consentIds?: string[];
  reason?: string;
}

function formatPolicyViolationMessage(
  type: PolicyViolationType,
  details: PolicyViolationDetails
): string {
  const prefix = details.operation
    ? `Policy violation for "${details.operation}": `
    : 'Policy violation: ';

  switch (type) {
    case 'missing_role':
      return `${prefix}Missing required role "${details.requiredRole}"`;
    case 'missing_permission':
      return `${prefix}Missing required permission "${details.requiredPermission}"`;
    case 'missing_attribute':
      return `${prefix}Missing or invalid attribute "${details.requiredAttribute?.key}"`;
    case 'rate_limit_exceeded':
      return `${prefix}Rate limit exceeded for key "${details.rateLimitKey}"`;
    case 'consent_required':
      return `${prefix}Consent required: ${details.consentIds?.join(', ')}`;
    case 'access_denied':
      return `${prefix}${details.reason ?? 'Access denied'}`;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Rate Limit Types
// ─────────────────────────────────────────────────────────────────────────────

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt?: Date;
  retryAfterMs?: number;
}

export interface RateLimitState {
  key: string;
  count: number;
  windowStart: number;
  windowMs: number;
  limit: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Audit Types
// ─────────────────────────────────────────────────────────────────────────────

export interface AuditEntry {
  timestamp: Date;
  operation: string;
  result: 'allowed' | 'denied';
  reason?: string;
  userId?: string;
  tenantId?: string;
  attributes?: Record<string, unknown>;
}

export type AuditHandler = (entry: AuditEntry) => void | Promise<void>;

// ─────────────────────────────────────────────────────────────────────────────
// User Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * User information for policy evaluation.
 */
export interface PolicyUser {
  /** Unique user identifier. */
  id: string;
  /** Optional tenant/organization ID for multi-tenant contexts. */
  tenantId?: string;
  /** Roles assigned to the user. */
  roles: string[];
  /** Permissions granted to the user. */
  permissions: string[];
  /** Additional attributes for ABAC evaluation. */
  attributes: Record<string, unknown>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Context Interface
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Runtime context for checking policy access.
 *
 * Created from user information (roles, permissions, attributes).
 * Provides methods to check and require policy compliance at runtime.
 */
export interface PolicyContext {
  /** The user for this context. */
  readonly user: PolicyUser;

  /** Set of user roles. */
  readonly roles: ReadonlySet<string>;

  /** Set of user permissions. */
  readonly permissions: ReadonlySet<string>;

  // ─────────────────────────────────────────────────────────────────────────
  // Role-Based Access Control (RBAC)
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Check if user has a specific role.
   * @param role - Role to check
   * @returns True if user has the role
   */
  hasRole(role: string): boolean;

  /**
   * Check if user has any of the specified roles.
   * @param roles - Roles to check
   * @returns True if user has at least one role
   */
  hasAnyRole(roles: string[]): boolean;

  /**
   * Check if user has all of the specified roles.
   * @param roles - Roles to check
   * @returns True if user has all roles
   */
  hasAllRoles(roles: string[]): boolean;

  /**
   * Require a role, throwing if not present.
   * @param role - Role to require
   * @throws {PolicyViolationError} If role is missing
   */
  requireRole(role: string): void;

  // ─────────────────────────────────────────────────────────────────────────
  // Permission-Based Access Control
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Check if user has a specific permission.
   * @param permission - Permission to check
   * @returns True if user has the permission
   */
  hasPermission(permission: string): boolean;

  /**
   * Check if user has any of the specified permissions.
   * @param permissions - Permissions to check
   * @returns True if user has at least one permission
   */
  hasAnyPermission(permissions: string[]): boolean;

  /**
   * Check if user has all of the specified permissions.
   * @param permissions - Permissions to check
   * @returns True if user has all permissions
   */
  hasAllPermissions(permissions: string[]): boolean;

  /**
   * Require a permission, throwing if not present.
   * @param permission - Permission to require
   * @throws {PolicyViolationError} If permission is missing
   */
  requirePermission(permission: string): void;

  // ─────────────────────────────────────────────────────────────────────────
  // Attribute-Based Access Control (ABAC)
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Get a user attribute value.
   * @param key - Attribute key
   * @returns Attribute value or undefined
   */
  getAttribute<T = unknown>(key: string): T | undefined;

  /**
   * Check if an attribute matches an expected value.
   * @param key - Attribute key
   * @param expected - Expected value
   * @returns True if attribute equals expected value
   */
  checkAttribute(key: string, expected: unknown): boolean;

  /**
   * Check if an attribute is one of the allowed values.
   * @param key - Attribute key
   * @param allowedValues - Array of allowed values
   * @returns True if attribute is in allowed values
   */
  checkAttributeOneOf(key: string, allowedValues: unknown[]): boolean;

  // ─────────────────────────────────────────────────────────────────────────
  // Rate Limiting
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Check rate limit for a key.
   * @param key - Rate limit key (e.g., operation name)
   * @returns Rate limit result
   */
  checkRateLimit(key: string): RateLimitResult;

  /**
   * Consume rate limit for a key (increment counter).
   * @param key - Rate limit key
   * @param cost - Cost of the operation (default: 1)
   * @returns Rate limit result after consumption
   */
  consumeRateLimit(key: string, cost?: number): RateLimitResult;

  // ─────────────────────────────────────────────────────────────────────────
  // Audit
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Record an access attempt for audit purposes.
   * @param operation - Operation being accessed
   * @param result - Whether access was allowed or denied
   * @param reason - Optional reason for the decision
   */
  auditAccess(
    operation: string,
    result: 'allowed' | 'denied',
    reason?: string
  ): void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Context Options
// ─────────────────────────────────────────────────────────────────────────────

export interface PolicyContextOptions {
  /** Rate limit configurations by key. */
  rateLimits?: Record<string, { limit: number; windowMs: number }>;
  /** Handler for audit entries. */
  auditHandler?: AuditHandler;
}

// ─────────────────────────────────────────────────────────────────────────────
// Context Implementation
// ─────────────────────────────────────────────────────────────────────────────

class PolicyContextImpl implements PolicyContext {
  readonly user: PolicyUser;
  readonly roles: ReadonlySet<string>;
  readonly permissions: ReadonlySet<string>;

  private readonly rateLimitStates = new Map<string, RateLimitState>();
  private readonly rateLimitConfigs: Record<
    string,
    { limit: number; windowMs: number }
  >;
  private readonly auditHandler?: AuditHandler;

  constructor(user: PolicyUser, options: PolicyContextOptions = {}) {
    this.user = user;
    this.roles = new Set(user.roles);
    this.permissions = new Set(user.permissions);
    this.rateLimitConfigs = options.rateLimits ?? {};
    this.auditHandler = options.auditHandler;
  }

  // RBAC
  hasRole(role: string): boolean {
    return this.roles.has(role);
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.some((r) => this.roles.has(r));
  }

  hasAllRoles(roles: string[]): boolean {
    return roles.every((r) => this.roles.has(r));
  }

  requireRole(role: string): void {
    if (!this.hasRole(role)) {
      throw new PolicyViolationError('missing_role', { requiredRole: role });
    }
  }

  // Permissions
  hasPermission(permission: string): boolean {
    return this.permissions.has(permission);
  }

  hasAnyPermission(permissions: string[]): boolean {
    return permissions.some((p) => this.permissions.has(p));
  }

  hasAllPermissions(permissions: string[]): boolean {
    return permissions.every((p) => this.permissions.has(p));
  }

  requirePermission(permission: string): void {
    if (!this.hasPermission(permission)) {
      throw new PolicyViolationError('missing_permission', {
        requiredPermission: permission,
      });
    }
  }

  // ABAC
  getAttribute<T = unknown>(key: string): T | undefined {
    return this.user.attributes[key] as T | undefined;
  }

  checkAttribute(key: string, expected: unknown): boolean {
    return this.user.attributes[key] === expected;
  }

  checkAttributeOneOf(key: string, allowedValues: unknown[]): boolean {
    return allowedValues.includes(this.user.attributes[key]);
  }

  // Rate Limiting
  checkRateLimit(key: string): RateLimitResult {
    const config = this.rateLimitConfigs[key];
    if (!config) {
      return { allowed: true, remaining: Infinity };
    }

    const now = Date.now();
    const state = this.rateLimitStates.get(key);

    if (!state || now - state.windowStart >= config.windowMs) {
      return { allowed: true, remaining: config.limit };
    }

    const remaining = Math.max(0, config.limit - state.count);
    if (remaining <= 0) {
      const resetAt = new Date(state.windowStart + config.windowMs);
      const retryAfterMs = state.windowStart + config.windowMs - now;
      return { allowed: false, remaining: 0, resetAt, retryAfterMs };
    }

    return { allowed: true, remaining };
  }

  consumeRateLimit(key: string, cost = 1): RateLimitResult {
    const config = this.rateLimitConfigs[key];
    if (!config) {
      return { allowed: true, remaining: Infinity };
    }

    const now = Date.now();
    let state = this.rateLimitStates.get(key);

    // Reset window if expired
    if (!state || now - state.windowStart >= config.windowMs) {
      state = {
        key,
        count: 0,
        windowStart: now,
        windowMs: config.windowMs,
        limit: config.limit,
      };
    }

    // Check if we can consume
    if (state.count + cost > config.limit) {
      const resetAt = new Date(state.windowStart + config.windowMs);
      const retryAfterMs = state.windowStart + config.windowMs - now;
      this.rateLimitStates.set(key, state);
      return {
        allowed: false,
        remaining: Math.max(0, config.limit - state.count),
        resetAt,
        retryAfterMs,
      };
    }

    // Consume
    state.count += cost;
    this.rateLimitStates.set(key, state);
    return {
      allowed: true,
      remaining: Math.max(0, config.limit - state.count),
    };
  }

  // Audit
  auditAccess(
    operation: string,
    result: 'allowed' | 'denied',
    reason?: string
  ): void {
    if (!this.auditHandler) return;

    const entry: AuditEntry = {
      timestamp: new Date(),
      operation,
      result,
      reason,
      userId: this.user.id,
      tenantId: this.user.tenantId,
      attributes: this.user.attributes,
    };

    // Fire and forget - don't block on audit
    void Promise.resolve(this.auditHandler(entry)).catch(() => {
      // Silently ignore audit errors to not affect request flow
    });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Factory Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Creates a policy context from user information.
 *
 * @param user - User information for policy evaluation
 * @param options - Additional context options
 * @returns PolicyContext for checking/requiring policy compliance
 *
 * @example
 * ```typescript
 * const ctx = createPolicyContext({
 *   id: 'user-123',
 *   roles: ['editor'],
 *   permissions: ['read:articles'],
 *   attributes: { department: 'marketing' },
 * });
 *
 * ctx.requireRole('editor');
 * ctx.requirePermission('read:articles');
 * ```
 */
export function createPolicyContext(
  user: PolicyUser,
  options?: PolicyContextOptions
): PolicyContext {
  return new PolicyContextImpl(user, options);
}

/**
 * Creates an empty policy context (no roles/permissions).
 * Useful for anonymous users or testing.
 */
export function createAnonymousPolicyContext(
  options?: PolicyContextOptions
): PolicyContext {
  return new PolicyContextImpl(
    {
      id: 'anonymous',
      roles: [],
      permissions: [],
      attributes: {},
    },
    options
  );
}

/**
 * Creates a bypass policy context with all roles/permissions.
 * Useful for admin users or internal services.
 *
 * @param allRoles - All roles to grant
 * @param allPermissions - All permissions to grant
 */
export function createBypassPolicyContext(
  allRoles: string[],
  allPermissions: string[],
  options?: PolicyContextOptions
): PolicyContext {
  return new PolicyContextImpl(
    {
      id: 'system',
      roles: allRoles,
      permissions: allPermissions,
      attributes: { bypass: true },
    },
    options
  );
}
