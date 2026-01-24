import { describe, it, expect, vi } from 'vitest';
import {
  checkPolicyForOperation,
  assertPolicyForOperation,
  filterOperationsByPolicy,
  checkRole,
  assertRole,
  checkAnyRole,
  checkPermission,
  assertPermission,
  checkAllPermissions,
  checkCombinedPolicy,
  assertCombinedPolicy,
} from './guards';
import { createPolicyContext, PolicyViolationError } from './context';
import type { AnyOperationSpec } from '../operations/operation';

// ─────────────────────────────────────────────────────────────────────────────
// Test Data
// ─────────────────────────────────────────────────────────────────────────────

const userCtx = createPolicyContext({
  id: 'user-123',
  roles: ['editor', 'reviewer'],
  permissions: ['read:articles', 'write:articles'],
  attributes: { department: 'engineering' },
});

const adminCtx = createPolicyContext({
  id: 'admin-456',
  roles: ['admin', 'editor'],
  permissions: ['read:articles', 'write:articles', 'admin:users'],
  attributes: { department: 'engineering' },
});

const anonymousCtx = createPolicyContext({
  id: 'anonymous',
  roles: [],
  permissions: [],
  attributes: {},
});

const createOperation = (
  auth: 'anonymous' | 'user' | 'admin',
  flags?: string[]
): AnyOperationSpec =>
  ({
    meta: {
      key: 'test.operation',
      version: '1.0.0',
      kind: 'command',
      goal: 'Test operation',
      context: 'Testing',
      owners: [{ team: 'test' }],
    },
    io: {
      input: null,
      output: {} as never,
    },
    policy: {
      auth,
      flags,
    },
  }) as AnyOperationSpec;

// ─────────────────────────────────────────────────────────────────────────────
// Operation Policy Guards Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('checkPolicyForOperation', () => {
  describe('auth level checks', () => {
    it('should allow anonymous operation for any user', () => {
      const op = createOperation('anonymous');

      expect(checkPolicyForOperation(anonymousCtx, op).allowed).toBe(true);
      expect(checkPolicyForOperation(userCtx, op).allowed).toBe(true);
      expect(checkPolicyForOperation(adminCtx, op).allowed).toBe(true);
    });

    it('should allow user operation for authenticated users', () => {
      const op = createOperation('user');

      expect(checkPolicyForOperation(userCtx, op).allowed).toBe(true);
      expect(checkPolicyForOperation(adminCtx, op).allowed).toBe(true);
    });

    it('should deny user operation for anonymous', () => {
      const op = createOperation('user');
      const result = checkPolicyForOperation(anonymousCtx, op);

      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('user');
    });

    it('should allow admin operation for admin users', () => {
      const op = createOperation('admin');

      expect(checkPolicyForOperation(adminCtx, op).allowed).toBe(true);
    });

    it('should deny admin operation for non-admin users', () => {
      const op = createOperation('admin');
      const result = checkPolicyForOperation(userCtx, op);

      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('admin');
      expect(result.missing?.roles).toContain('admin');
    });
  });

  describe('feature flag checks', () => {
    it('should allow when all required flags are present', () => {
      const op = createOperation('user', ['feature-a', 'feature-b']);
      const result = checkPolicyForOperation(userCtx, op, [
        'feature-a',
        'feature-b',
        'feature-c',
      ]);

      expect(result.allowed).toBe(true);
    });

    it('should deny when required flags are missing', () => {
      const op = createOperation('user', ['feature-a', 'feature-b']);
      const result = checkPolicyForOperation(userCtx, op, ['feature-a']);

      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('feature-b');
      expect(result.missing?.flags).toContain('feature-b');
    });

    it('should allow when no flags required', () => {
      const op = createOperation('user');
      const result = checkPolicyForOperation(userCtx, op, []);

      expect(result.allowed).toBe(true);
    });
  });
});

describe('assertPolicyForOperation', () => {
  it('should not throw when policy is satisfied', () => {
    const op = createOperation('user');
    expect(() => assertPolicyForOperation(userCtx, op)).not.toThrow();
  });

  it('should throw PolicyViolationError when policy is not satisfied', () => {
    const op = createOperation('admin');

    expect(() => assertPolicyForOperation(userCtx, op)).toThrow(
      PolicyViolationError
    );
  });

  it('should audit access attempts', () => {
    const auditHandler = vi.fn();
    const ctx = createPolicyContext(
      { id: 'user', roles: [], permissions: [], attributes: {} },
      { auditHandler }
    );

    const op = createOperation('admin');

    try {
      assertPolicyForOperation(ctx, op);
    } catch {
      // Expected
    }

    expect(auditHandler).toHaveBeenCalled();
  });
});

describe('filterOperationsByPolicy', () => {
  it('should filter operations by policy', () => {
    const ops = [
      createOperation('anonymous'),
      createOperation('user'),
      createOperation('admin'),
    ];

    const filtered = filterOperationsByPolicy(userCtx, ops);

    expect(filtered).toHaveLength(2);
    expect(filtered[0].policy.auth).toBe('anonymous');
    expect(filtered[1].policy.auth).toBe('user');
  });

  it('should filter by feature flags', () => {
    const ops = [
      createOperation('user'),
      createOperation('user', ['feature-x']),
      createOperation('user', ['feature-y']),
    ];

    const filtered = filterOperationsByPolicy(userCtx, ops, ['feature-x']);

    expect(filtered).toHaveLength(2);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Role Guards Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('checkRole', () => {
  it('should return allowed for existing role', () => {
    const result = checkRole(userCtx, 'editor');
    expect(result.allowed).toBe(true);
  });

  it('should return denied for missing role', () => {
    const result = checkRole(userCtx, 'admin', 'test.op');

    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('test.op');
    expect(result.missing?.roles).toContain('admin');
  });
});

describe('assertRole', () => {
  it('should not throw for existing role', () => {
    expect(() => assertRole(userCtx, 'editor')).not.toThrow();
  });

  it('should throw for missing role', () => {
    expect(() => assertRole(userCtx, 'admin', 'test.op')).toThrow(
      PolicyViolationError
    );
  });
});

describe('checkAnyRole', () => {
  it('should return allowed when at least one role matches', () => {
    const result = checkAnyRole(userCtx, ['admin', 'editor']);
    expect(result.allowed).toBe(true);
  });

  it('should return denied when no roles match', () => {
    const result = checkAnyRole(userCtx, ['admin', 'super']);

    expect(result.allowed).toBe(false);
    expect(result.missing?.roles).toContain('admin');
    expect(result.missing?.roles).toContain('super');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Permission Guards Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('checkPermission', () => {
  it('should return allowed for existing permission', () => {
    const result = checkPermission(userCtx, 'read:articles');
    expect(result.allowed).toBe(true);
  });

  it('should return denied for missing permission', () => {
    const result = checkPermission(userCtx, 'admin:users', 'test.op');

    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('test.op');
    expect(result.missing?.permissions).toContain('admin:users');
  });
});

describe('assertPermission', () => {
  it('should not throw for existing permission', () => {
    expect(() => assertPermission(userCtx, 'read:articles')).not.toThrow();
  });

  it('should throw for missing permission', () => {
    expect(() => assertPermission(userCtx, 'admin:users')).toThrow(
      PolicyViolationError
    );
  });
});

describe('checkAllPermissions', () => {
  it('should return allowed when all permissions match', () => {
    const result = checkAllPermissions(userCtx, [
      'read:articles',
      'write:articles',
    ]);
    expect(result.allowed).toBe(true);
  });

  it('should return denied when some permissions are missing', () => {
    const result = checkAllPermissions(userCtx, [
      'read:articles',
      'admin:users',
    ]);

    expect(result.allowed).toBe(false);
    expect(result.missing?.permissions).toContain('admin:users');
    expect(result.missing?.permissions).not.toContain('read:articles');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Combined Policy Guards Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('checkCombinedPolicy', () => {
  it('should check all required roles', () => {
    const result = checkCombinedPolicy(userCtx, {
      roles: ['editor', 'reviewer'],
    });
    expect(result.allowed).toBe(true);
  });

  it('should fail when required role is missing', () => {
    const result = checkCombinedPolicy(userCtx, {
      roles: ['editor', 'admin'],
    });

    expect(result.allowed).toBe(false);
    expect(result.missing?.roles).toContain('admin');
  });

  it('should check any role requirement', () => {
    const result = checkCombinedPolicy(userCtx, {
      anyRole: ['admin', 'editor'],
    });
    expect(result.allowed).toBe(true);
  });

  it('should fail when no role matches anyRole', () => {
    const result = checkCombinedPolicy(userCtx, {
      anyRole: ['admin', 'super'],
    });
    expect(result.allowed).toBe(false);
  });

  it('should check all required permissions', () => {
    const result = checkCombinedPolicy(userCtx, {
      permissions: ['read:articles', 'write:articles'],
    });
    expect(result.allowed).toBe(true);
  });

  it('should fail when required permission is missing', () => {
    const result = checkCombinedPolicy(userCtx, {
      permissions: ['read:articles', 'admin:users'],
    });

    expect(result.allowed).toBe(false);
    expect(result.missing?.permissions).toContain('admin:users');
  });

  it('should check any permission requirement', () => {
    const result = checkCombinedPolicy(userCtx, {
      anyPermission: ['admin:users', 'read:articles'],
    });
    expect(result.allowed).toBe(true);
  });

  it('should check feature flags', () => {
    const result = checkCombinedPolicy(userCtx, { flags: ['feature-a'] }, [
      'feature-a',
      'feature-b',
    ]);
    expect(result.allowed).toBe(true);
  });

  it('should fail when feature flag is missing', () => {
    const result = checkCombinedPolicy(userCtx, { flags: ['feature-x'] }, [
      'feature-a',
    ]);

    expect(result.allowed).toBe(false);
    expect(result.missing?.flags).toContain('feature-x');
  });

  it('should combine multiple requirements', () => {
    const result = checkCombinedPolicy(
      userCtx,
      {
        roles: ['editor'],
        permissions: ['read:articles'],
        flags: ['feature-a'],
      },
      ['feature-a']
    );
    expect(result.allowed).toBe(true);
  });

  it('should report all failures', () => {
    const result = checkCombinedPolicy(
      userCtx,
      {
        roles: ['admin'],
        permissions: ['admin:users'],
        flags: ['feature-x'],
      },
      []
    );

    expect(result.allowed).toBe(false);
    expect(result.missing?.roles).toContain('admin');
    expect(result.missing?.permissions).toContain('admin:users');
    expect(result.missing?.flags).toContain('feature-x');
    expect(result.reason).toContain('Missing roles');
    expect(result.reason).toContain('Missing permissions');
    expect(result.reason).toContain('Missing feature flags');
  });

  it('should include operation name in reason', () => {
    const result = checkCombinedPolicy(
      userCtx,
      { roles: ['admin'] },
      [],
      'admin.action'
    );

    expect(result.reason).toContain('admin.action');
  });
});

describe('assertCombinedPolicy', () => {
  it('should not throw when all requirements are met', () => {
    expect(() =>
      assertCombinedPolicy(userCtx, {
        roles: ['editor'],
        permissions: ['read:articles'],
      })
    ).not.toThrow();
  });

  it('should throw when requirements are not met', () => {
    expect(() => assertCombinedPolicy(userCtx, { roles: ['admin'] })).toThrow(
      PolicyViolationError
    );
  });
});
