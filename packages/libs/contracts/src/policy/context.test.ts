import { describe, expect, it, vi } from 'bun:test';
import {
  type AuditEntry,
  createAnonymousPolicyContext,
  createBypassPolicyContext,
  createPolicyContext,
  type PolicyUser,
  PolicyViolationError,
} from './context';

// ─────────────────────────────────────────────────────────────────────────────
// Test Data
// ─────────────────────────────────────────────────────────────────────────────

const testUser: PolicyUser = {
  id: 'user-123',
  tenantId: 'tenant-456',
  roles: ['admin', 'editor'],
  permissions: ['read:articles', 'write:articles', 'delete:articles'],
  attributes: {
    department: 'engineering',
    level: 5,
    active: true,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Factory Function Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('createPolicyContext', () => {
  it('should create context from user info', () => {
    const ctx = createPolicyContext(testUser);

    expect(ctx.user).toEqual(testUser);
    expect(ctx.roles.has('admin')).toBe(true);
    expect(ctx.roles.has('editor')).toBe(true);
    expect(ctx.permissions.has('read:articles')).toBe(true);
  });

  it('should create context with options', () => {
    const auditHandler = vi.fn();
    const ctx = createPolicyContext(testUser, {
      rateLimits: { 'api.call': { limit: 100, windowMs: 60000 } },
      auditHandler,
    });

    expect(ctx.user).toEqual(testUser);
    ctx.auditAccess('test.op', 'allowed');
    expect(auditHandler).toHaveBeenCalled();
  });
});

describe('createAnonymousPolicyContext', () => {
  it('should create context with no roles/permissions', () => {
    const ctx = createAnonymousPolicyContext();

    expect(ctx.user.id).toBe('anonymous');
    expect(ctx.roles.size).toBe(0);
    expect(ctx.permissions.size).toBe(0);
  });
});

describe('createBypassPolicyContext', () => {
  it('should create context with all roles/permissions', () => {
    const ctx = createBypassPolicyContext(
      ['admin', 'super'],
      ['read:all', 'write:all']
    );

    expect(ctx.user.id).toBe('system');
    expect(ctx.hasRole('admin')).toBe(true);
    expect(ctx.hasRole('super')).toBe(true);
    expect(ctx.hasPermission('read:all')).toBe(true);
    expect(ctx.hasPermission('write:all')).toBe(true);
    expect(ctx.getAttribute('bypass')).toBeTrue();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Role-Based Access Control Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('PolicyContext RBAC', () => {
  const ctx = createPolicyContext(testUser);

  describe('hasRole', () => {
    it('should return true for existing role', () => {
      expect(ctx.hasRole('admin')).toBe(true);
      expect(ctx.hasRole('editor')).toBe(true);
    });

    it('should return false for non-existing role', () => {
      expect(ctx.hasRole('super-admin')).toBe(false);
      expect(ctx.hasRole('viewer')).toBe(false);
    });
  });

  describe('hasAnyRole', () => {
    it('should return true when at least one role matches', () => {
      expect(ctx.hasAnyRole(['admin', 'super'])).toBe(true);
      expect(ctx.hasAnyRole(['viewer', 'editor'])).toBe(true);
    });

    it('should return false when no roles match', () => {
      expect(ctx.hasAnyRole(['super', 'viewer'])).toBe(false);
    });

    it('should return false for empty array', () => {
      expect(ctx.hasAnyRole([])).toBe(false);
    });
  });

  describe('hasAllRoles', () => {
    it('should return true when all roles match', () => {
      expect(ctx.hasAllRoles(['admin', 'editor'])).toBe(true);
      expect(ctx.hasAllRoles(['admin'])).toBe(true);
    });

    it('should return false when some roles are missing', () => {
      expect(ctx.hasAllRoles(['admin', 'super'])).toBe(false);
    });

    it('should return true for empty array', () => {
      expect(ctx.hasAllRoles([])).toBe(true);
    });
  });

  describe('requireRole', () => {
    it('should not throw for existing role', () => {
      expect(() => ctx.requireRole('admin')).not.toThrow();
    });

    it('should throw PolicyViolationError for missing role', () => {
      expect(() => ctx.requireRole('super')).toThrow(PolicyViolationError);

      try {
        ctx.requireRole('super');
      } catch (e) {
        expect(e).toBeInstanceOf(PolicyViolationError);
        const error = e as PolicyViolationError;
        expect(error.violationType).toBe('missing_role');
        expect(error.details.requiredRole).toBe('super');
      }
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Permission-Based Access Control Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('PolicyContext Permissions', () => {
  const ctx = createPolicyContext(testUser);

  describe('hasPermission', () => {
    it('should return true for existing permission', () => {
      expect(ctx.hasPermission('read:articles')).toBe(true);
      expect(ctx.hasPermission('write:articles')).toBe(true);
    });

    it('should return false for non-existing permission', () => {
      expect(ctx.hasPermission('admin:users')).toBe(false);
    });
  });

  describe('hasAnyPermission', () => {
    it('should return true when at least one permission matches', () => {
      expect(ctx.hasAnyPermission(['read:articles', 'admin:users'])).toBe(true);
    });

    it('should return false when no permissions match', () => {
      expect(ctx.hasAnyPermission(['admin:users', 'create:users'])).toBe(false);
    });
  });

  describe('hasAllPermissions', () => {
    it('should return true when all permissions match', () => {
      expect(ctx.hasAllPermissions(['read:articles', 'write:articles'])).toBe(
        true
      );
    });

    it('should return false when some permissions are missing', () => {
      expect(ctx.hasAllPermissions(['read:articles', 'admin:users'])).toBe(
        false
      );
    });
  });

  describe('requirePermission', () => {
    it('should not throw for existing permission', () => {
      expect(() => ctx.requirePermission('read:articles')).not.toThrow();
    });

    it('should throw PolicyViolationError for missing permission', () => {
      expect(() => ctx.requirePermission('admin:users')).toThrow(
        PolicyViolationError
      );

      try {
        ctx.requirePermission('admin:users');
      } catch (e) {
        const error = e as PolicyViolationError;
        expect(error.violationType).toBe('missing_permission');
        expect(error.details.requiredPermission).toBe('admin:users');
      }
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Attribute-Based Access Control Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('PolicyContext ABAC', () => {
  const ctx = createPolicyContext(testUser);

  describe('getAttribute', () => {
    it('should return attribute value', () => {
      expect(ctx.getAttribute<string>('department')).toBe('engineering');
      expect(ctx.getAttribute<number>('level')).toBe(5);
      expect(ctx.getAttribute<boolean>('active')).toBe(true);
    });

    it('should return undefined for non-existing attribute', () => {
      expect(ctx.getAttribute('nonexistent')).toBeUndefined();
    });

    it('should support type parameter', () => {
      const dept = ctx.getAttribute<string>('department');
      expect(dept).toBe('engineering');

      const level = ctx.getAttribute<number>('level');
      expect(level).toBe(5);
    });
  });

  describe('checkAttribute', () => {
    it('should return true for matching attribute', () => {
      expect(ctx.checkAttribute('department', 'engineering')).toBe(true);
      expect(ctx.checkAttribute('level', 5)).toBe(true);
      expect(ctx.checkAttribute('active', true)).toBe(true);
    });

    it('should return false for non-matching attribute', () => {
      expect(ctx.checkAttribute('department', 'marketing')).toBe(false);
      expect(ctx.checkAttribute('level', 10)).toBe(false);
    });

    it('should return false for non-existing attribute', () => {
      expect(ctx.checkAttribute('nonexistent', 'value')).toBe(false);
    });
  });

  describe('checkAttributeOneOf', () => {
    it('should return true when attribute is in allowed values', () => {
      expect(
        ctx.checkAttributeOneOf('department', ['engineering', 'marketing'])
      ).toBe(true);
      expect(ctx.checkAttributeOneOf('level', [1, 3, 5, 7])).toBe(true);
    });

    it('should return false when attribute is not in allowed values', () => {
      expect(
        ctx.checkAttributeOneOf('department', ['sales', 'marketing'])
      ).toBe(false);
      expect(ctx.checkAttributeOneOf('level', [1, 2, 3])).toBe(false);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Rate Limiting Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('PolicyContext Rate Limiting', () => {
  describe('checkRateLimit', () => {
    it('should allow when no rate limit configured', () => {
      const ctx = createPolicyContext(testUser);
      const result = ctx.checkRateLimit('api.call');

      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(Infinity);
    });

    it('should check rate limit state', () => {
      const ctx = createPolicyContext(testUser, {
        rateLimits: { 'api.call': { limit: 10, windowMs: 60000 } },
      });

      const result = ctx.checkRateLimit('api.call');
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(10);
    });
  });

  describe('consumeRateLimit', () => {
    it('should decrement remaining count', () => {
      const ctx = createPolicyContext(testUser, {
        rateLimits: { 'api.call': { limit: 5, windowMs: 60000 } },
      });

      let result = ctx.consumeRateLimit('api.call');
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(4);

      result = ctx.consumeRateLimit('api.call');
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(3);
    });

    it('should deny when limit exceeded', () => {
      const ctx = createPolicyContext(testUser, {
        rateLimits: { 'api.call': { limit: 2, windowMs: 60000 } },
      });

      ctx.consumeRateLimit('api.call');
      ctx.consumeRateLimit('api.call');

      const result = ctx.consumeRateLimit('api.call');
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
      expect(result.retryAfterMs).toBeGreaterThan(0);
      expect(result.resetAt).toBeInstanceOf(Date);
    });

    it('should support custom cost', () => {
      const ctx = createPolicyContext(testUser, {
        rateLimits: { 'api.call': { limit: 10, windowMs: 60000 } },
      });

      const result = ctx.consumeRateLimit('api.call', 5);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(5);
    });

    it('should allow when no rate limit configured', () => {
      const ctx = createPolicyContext(testUser);
      const result = ctx.consumeRateLimit('api.call');

      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(Infinity);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Audit Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('PolicyContext Audit', () => {
  it('should call audit handler with entry', async () => {
    const auditHandler = vi.fn();
    const ctx = createPolicyContext(testUser, { auditHandler });

    ctx.auditAccess('article.create', 'allowed');

    // Give time for async call
    await new Promise((r) => setTimeout(r, 10));

    expect(auditHandler).toHaveBeenCalledTimes(1);
    const entry: AuditEntry = auditHandler.mock.calls[0]?.[0] as AuditEntry;
    expect(entry.operation).toBe('article.create');
    expect(entry.result).toBe('allowed');
    expect(entry.userId).toBe('user-123');
    expect(entry.tenantId).toBe('tenant-456');
    expect(entry.timestamp).toBeInstanceOf(Date);
  });

  it('should include reason in audit entry', async () => {
    const auditHandler = vi.fn();
    const ctx = createPolicyContext(testUser, { auditHandler });

    ctx.auditAccess('article.delete', 'denied', 'Missing permission');

    await new Promise((r) => setTimeout(r, 10));

    const entry: AuditEntry = auditHandler.mock.calls[0]?.[0] as AuditEntry;
    expect(entry.result).toBe('denied');
    expect(entry.reason).toBe('Missing permission');
  });

  it('should not throw when no audit handler', () => {
    const ctx = createPolicyContext(testUser);
    expect(() => ctx.auditAccess('test', 'allowed')).not.toThrow();
  });

  it('should not throw when audit handler fails', async () => {
    const auditHandler = vi.fn().mockRejectedValue(new Error('Audit failed'));
    const ctx = createPolicyContext(testUser, { auditHandler });

    expect(() => ctx.auditAccess('test', 'allowed')).not.toThrow();

    await new Promise((r) => setTimeout(r, 10));
    expect(auditHandler).toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// PolicyViolationError Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('PolicyViolationError', () => {
  it('should format missing role message', () => {
    const error = new PolicyViolationError('missing_role', {
      operation: 'admin.action',
      requiredRole: 'admin',
    });

    expect(error.message).toContain('admin.action');
    expect(error.message).toContain('Missing required role "admin"');
    expect(error.violationType).toBe('missing_role');
  });

  it('should format missing permission message', () => {
    const error = new PolicyViolationError('missing_permission', {
      requiredPermission: 'write:users',
    });

    expect(error.message).toContain(
      'Missing required permission "write:users"'
    );
  });

  it('should format rate limit message', () => {
    const error = new PolicyViolationError('rate_limit_exceeded', {
      rateLimitKey: 'api.call',
    });

    expect(error.message).toContain('Rate limit exceeded');
    expect(error.message).toContain('api.call');
  });

  it('should format consent required message', () => {
    const error = new PolicyViolationError('consent_required', {
      consentIds: ['marketing', 'analytics'],
    });

    expect(error.message).toContain('Consent required');
    expect(error.message).toContain('marketing');
  });

  it('should format access denied message', () => {
    const error = new PolicyViolationError('access_denied', {
      reason: 'IP not allowed',
    });

    expect(error.message).toContain('IP not allowed');
  });

  it('should have correct name', () => {
    const error = new PolicyViolationError('access_denied', {});
    expect(error.name).toBe('PolicyViolationError');
  });
});
