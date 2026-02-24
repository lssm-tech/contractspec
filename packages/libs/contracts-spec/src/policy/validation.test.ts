import { describe, it, expect } from 'bun:test";
import {
  validatePolicySpec,
  validatePolicyConsistency,
  assertPolicySpecValid,
  assertPolicyConsistency,
  PolicyValidationError,
} from './validation';
import { PolicyRegistry } from './registry';
import { OperationSpecRegistry } from '../operations/registry';
import type { PolicySpec } from './spec';
import type { AnyOperationSpec } from '../operations/operation';

// ─────────────────────────────────────────────────────────────────────────────
// Test Data
// ─────────────────────────────────────────────────────────────────────────────

const validPolicy: PolicySpec = {
  meta: {
    key: 'test.policy',
    version: '1.0.0',
    owners: ['platform-team'],
    description: 'Test policy for testing',
    stability: 'experimental',
    tags: [],
  },
  rules: [
    {
      effect: 'allow',
      actions: ['read', 'list'],
      subject: { roles: ['user'] },
    },
    {
      effect: 'allow',
      actions: ['write', 'delete'],
      subject: { roles: ['admin'] },
      rateLimit: 'admin-limit',
      requiresConsent: ['data-processing'],
    },
    {
      effect: 'deny',
      actions: ['*'],
      reason: 'Default deny',
    },
  ],
  rateLimits: [{ id: 'admin-limit', rpm: 100 }],
  consents: [
    {
      id: 'data-processing',
      scope: 'user-data',
      purpose: 'Process user data for service delivery',
    },
  ],
  relationships: [
    {
      subjectType: 'user',
      relation: 'owner',
      objectType: 'document',
    },
  ],
};

const createOperation = (
  policies?: { key: string; version: string }[]
): AnyOperationSpec =>
  ({
    meta: {
      key: 'test.operation',
      version: '1.0.0',
      kind: 'command',
      goal: 'Test operation',
      context: 'Testing',
      owners: ['test-team'],
      description: 'Test operation for testing',
      stability: 'experimental',
      tags: [],
    },
    io: {
      input: null,
      output: {} as never,
    },
    policy: {
      auth: 'user',
      policies,
    },
  }) as AnyOperationSpec;

// ─────────────────────────────────────────────────────────────────────────────
// validatePolicySpec Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('validatePolicySpec', () => {
  it('should pass for valid policy', () => {
    const result = validatePolicySpec(validPolicy);

    expect(result.valid).toBe(true);
    expect(result.issues.filter((i) => i.level === 'error')).toHaveLength(0);
  });

  describe('meta validation', () => {
    it('should error on missing key', () => {
      const policy: PolicySpec = {
        ...validPolicy,
        meta: { ...validPolicy.meta, key: '' },
      };

      const result = validatePolicySpec(policy);

      expect(result.valid).toBe(false);
      expect(result.issues).toContainEqual(
        expect.objectContaining({
          level: 'error',
          path: 'meta.key',
        })
      );
    });

    it('should error on missing version', () => {
      const policy: PolicySpec = {
        ...validPolicy,
        meta: { ...validPolicy.meta, version: '' },
      };

      const result = validatePolicySpec(policy);

      expect(result.valid).toBe(false);
      expect(result.issues).toContainEqual(
        expect.objectContaining({
          level: 'error',
          path: 'meta.version',
        })
      );
    });

    it('should warn on missing owners', () => {
      const policy: PolicySpec = {
        ...validPolicy,
        meta: { ...validPolicy.meta, owners: [] },
      };

      const result = validatePolicySpec(policy);

      expect(result.issues).toContainEqual(
        expect.objectContaining({
          level: 'warning',
          path: 'meta.owners',
        })
      );
    });
  });

  describe('rules validation', () => {
    it('should warn on no rules', () => {
      const policy: PolicySpec = {
        ...validPolicy,
        rules: [],
      };

      const result = validatePolicySpec(policy);

      expect(result.issues).toContainEqual(
        expect.objectContaining({
          level: 'warning',
          message: expect.stringContaining('no rules'),
        })
      );
    });

    it('should error on rule without actions', () => {
      const policy: PolicySpec = {
        ...validPolicy,
        rules: [{ effect: 'allow', actions: [] }],
      };

      const result = validatePolicySpec(policy);

      expect(result.valid).toBe(false);
      expect(result.issues).toContainEqual(
        expect.objectContaining({
          level: 'error',
          path: 'rules[0].actions',
        })
      );
    });

    it('should error on invalid effect', () => {
      const policy: PolicySpec = {
        ...validPolicy,
        rules: [{ effect: 'maybe' as never, actions: ['read'] }],
      };

      const result = validatePolicySpec(policy);

      expect(result.valid).toBe(false);
      expect(result.issues).toContainEqual(
        expect.objectContaining({
          level: 'error',
          message: expect.stringContaining('Invalid rule effect'),
        })
      );
    });

    it('should error on undefined rate limit reference', () => {
      const policy: PolicySpec = {
        ...validPolicy,
        rules: [
          { effect: 'allow', actions: ['read'], rateLimit: 'nonexistent' },
        ],
      };

      const result = validatePolicySpec(policy);

      expect(result.valid).toBe(false);
      expect(result.issues).toContainEqual(
        expect.objectContaining({
          level: 'error',
          message: expect.stringContaining('nonexistent'),
        })
      );
    });

    it('should error on undefined consent reference', () => {
      const policy: PolicySpec = {
        ...validPolicy,
        rules: [
          {
            effect: 'allow',
            actions: ['read'],
            requiresConsent: ['nonexistent'],
          },
        ],
      };

      const result = validatePolicySpec(policy);

      expect(result.valid).toBe(false);
      expect(result.issues).toContainEqual(
        expect.objectContaining({
          level: 'error',
          message: expect.stringContaining('nonexistent'),
        })
      );
    });

    it('should error on empty condition expression', () => {
      const policy: PolicySpec = {
        ...validPolicy,
        rules: [
          {
            effect: 'allow',
            actions: ['read'],
            conditions: [{ expression: '' }],
          },
        ],
      };

      const result = validatePolicySpec(policy);

      expect(result.valid).toBe(false);
      expect(result.issues).toContainEqual(
        expect.objectContaining({
          level: 'error',
          path: 'rules[0].conditions[0].expression',
        })
      );
    });
  });

  describe('field policies validation', () => {
    it('should error on missing field', () => {
      const policy: PolicySpec = {
        ...validPolicy,
        fieldPolicies: [{ effect: 'allow', field: '', actions: ['read'] }],
      };

      const result = validatePolicySpec(policy);

      expect(result.valid).toBe(false);
      expect(result.issues).toContainEqual(
        expect.objectContaining({
          level: 'error',
          path: 'fieldPolicies[0].field',
        })
      );
    });

    it('should error on missing actions', () => {
      const policy: PolicySpec = {
        ...validPolicy,
        fieldPolicies: [{ effect: 'allow', field: 'email', actions: [] }],
      };

      const result = validatePolicySpec(policy);

      expect(result.valid).toBe(false);
      expect(result.issues).toContainEqual(
        expect.objectContaining({
          level: 'error',
          path: 'fieldPolicies[0].actions',
        })
      );
    });

    it('should error on invalid action', () => {
      const policy: PolicySpec = {
        ...validPolicy,
        fieldPolicies: [
          { effect: 'allow', field: 'email', actions: ['execute' as never] },
        ],
      };

      const result = validatePolicySpec(policy);

      expect(result.valid).toBe(false);
      expect(result.issues).toContainEqual(
        expect.objectContaining({
          level: 'error',
          message: expect.stringContaining('Invalid field action'),
        })
      );
    });

    it('should warn on conflicting field policies', () => {
      const policy: PolicySpec = {
        ...validPolicy,
        fieldPolicies: [
          { effect: 'allow', field: 'email', actions: ['read'] },
          { effect: 'deny', field: 'email', actions: ['read'] },
        ],
      };

      const result = validatePolicySpec(policy);

      expect(result.issues).toContainEqual(
        expect.objectContaining({
          level: 'warning',
          message: expect.stringContaining('conflicting'),
        })
      );
    });
  });

  describe('rate limits validation', () => {
    it('should error on missing id', () => {
      const policy: PolicySpec = {
        ...validPolicy,
        rateLimits: [{ id: '', rpm: 100 }],
      };

      const result = validatePolicySpec(policy);

      expect(result.valid).toBe(false);
      expect(result.issues).toContainEqual(
        expect.objectContaining({
          level: 'error',
          path: 'rateLimits[0].id',
        })
      );
    });

    it('should error on duplicate ids', () => {
      const policy: PolicySpec = {
        ...validPolicy,
        rateLimits: [
          { id: 'limit-1', rpm: 100 },
          { id: 'limit-1', rpm: 200 },
        ],
      };

      const result = validatePolicySpec(policy);

      expect(result.valid).toBe(false);
      expect(result.issues).toContainEqual(
        expect.objectContaining({
          level: 'error',
          message: expect.stringContaining('Duplicate rate limit'),
        })
      );
    });

    it('should error on invalid rpm', () => {
      const policy: PolicySpec = {
        ...validPolicy,
        rateLimits: [{ id: 'limit-1', rpm: 0 }],
      };

      const result = validatePolicySpec(policy);

      expect(result.valid).toBe(false);
      expect(result.issues).toContainEqual(
        expect.objectContaining({
          level: 'error',
          message: expect.stringContaining('positive number'),
        })
      );
    });

    it('should error on invalid windowSeconds', () => {
      const policy: PolicySpec = {
        ...validPolicy,
        rateLimits: [{ id: 'limit-1', rpm: 100, windowSeconds: -1 }],
      };

      const result = validatePolicySpec(policy);

      expect(result.valid).toBe(false);
      expect(result.issues).toContainEqual(
        expect.objectContaining({
          level: 'error',
          path: 'rateLimits[0].windowSeconds',
        })
      );
    });

    it('should info on unused rate limit', () => {
      const policy: PolicySpec = {
        ...validPolicy,
        rules: [{ effect: 'allow', actions: ['read'] }],
        rateLimits: [{ id: 'unused-limit', rpm: 100 }],
      };

      const result = validatePolicySpec(policy);

      expect(result.issues).toContainEqual(
        expect.objectContaining({
          level: 'info',
          message: expect.stringContaining('not referenced'),
        })
      );
    });
  });

  describe('consents validation', () => {
    it('should error on missing id', () => {
      const policy: PolicySpec = {
        ...validPolicy,
        consents: [{ id: '', scope: 'data', purpose: 'test' }],
      };

      const result = validatePolicySpec(policy);

      expect(result.valid).toBe(false);
      expect(result.issues).toContainEqual(
        expect.objectContaining({
          level: 'error',
          path: 'consents[0].id',
        })
      );
    });

    it('should error on duplicate ids', () => {
      const policy: PolicySpec = {
        ...validPolicy,
        consents: [
          { id: 'consent-1', scope: 'data', purpose: 'test' },
          { id: 'consent-1', scope: 'other', purpose: 'test' },
        ],
      };

      const result = validatePolicySpec(policy);

      expect(result.valid).toBe(false);
      expect(result.issues).toContainEqual(
        expect.objectContaining({
          level: 'error',
          message: expect.stringContaining('Duplicate consent'),
        })
      );
    });

    it('should error on missing scope', () => {
      const policy: PolicySpec = {
        ...validPolicy,
        consents: [{ id: 'consent-1', scope: '', purpose: 'test' }],
      };

      const result = validatePolicySpec(policy);

      expect(result.valid).toBe(false);
      expect(result.issues).toContainEqual(
        expect.objectContaining({
          level: 'error',
          path: 'consents[0].scope',
        })
      );
    });

    it('should error on missing purpose', () => {
      const policy: PolicySpec = {
        ...validPolicy,
        consents: [{ id: 'consent-1', scope: 'data', purpose: '' }],
      };

      const result = validatePolicySpec(policy);

      expect(result.valid).toBe(false);
      expect(result.issues).toContainEqual(
        expect.objectContaining({
          level: 'error',
          path: 'consents[0].purpose',
        })
      );
    });

    it('should error on invalid expiresInDays', () => {
      const policy: PolicySpec = {
        ...validPolicy,
        consents: [
          { id: 'consent-1', scope: 'data', purpose: 'test', expiresInDays: 0 },
        ],
      };

      const result = validatePolicySpec(policy);

      expect(result.valid).toBe(false);
      expect(result.issues).toContainEqual(
        expect.objectContaining({
          level: 'error',
          path: 'consents[0].expiresInDays',
        })
      );
    });
  });

  describe('relationships validation', () => {
    it('should error on missing subjectType', () => {
      const policy: PolicySpec = {
        ...validPolicy,
        relationships: [
          { subjectType: '', relation: 'owner', objectType: 'doc' },
        ],
      };

      const result = validatePolicySpec(policy);

      expect(result.valid).toBe(false);
      expect(result.issues).toContainEqual(
        expect.objectContaining({
          level: 'error',
          path: 'relationships[0].subjectType',
        })
      );
    });

    it('should error on missing relation', () => {
      const policy: PolicySpec = {
        ...validPolicy,
        relationships: [
          { subjectType: 'user', relation: '', objectType: 'doc' },
        ],
      };

      const result = validatePolicySpec(policy);

      expect(result.valid).toBe(false);
      expect(result.issues).toContainEqual(
        expect.objectContaining({
          level: 'error',
          path: 'relationships[0].relation',
        })
      );
    });

    it('should warn on duplicate relationships', () => {
      const policy: PolicySpec = {
        ...validPolicy,
        relationships: [
          { subjectType: 'user', relation: 'owner', objectType: 'doc' },
          { subjectType: 'user', relation: 'owner', objectType: 'doc' },
        ],
      };

      const result = validatePolicySpec(policy);

      expect(result.issues).toContainEqual(
        expect.objectContaining({
          level: 'warning',
          message: expect.stringContaining('Duplicate relationship'),
        })
      );
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Cross-Registry Validation Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('validatePolicyConsistency', () => {
  it('should pass for consistent registries', () => {
    const policies = new PolicyRegistry([validPolicy]);
    const operations = new OperationSpecRegistry([
      createOperation([{ key: 'test.policy', version: '1.0.0' }]),
    ]);

    const result = validatePolicyConsistency({ policies, operations });

    expect(result.valid).toBe(true);
  });

  it('should error on missing policy reference', () => {
    const policies = new PolicyRegistry([validPolicy]);
    const operations = new OperationSpecRegistry([
      createOperation([{ key: 'nonexistent.policy', version: '1.0.0' }]),
    ]);

    const result = validatePolicyConsistency({ policies, operations });

    expect(result.valid).toBe(false);
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        level: 'error',
        message: expect.stringContaining('nonexistent.policy'),
      })
    );
  });

  it('should validate policy specs in registry', () => {
    const invalidPolicy: PolicySpec = {
      meta: {
        key: '',
        version: '1.0.0',
        owners: [],
        description: '',
        stability: 'experimental',
        tags: [],
      },
      rules: [],
    };
    const policies = new PolicyRegistry([invalidPolicy]);

    const result = validatePolicyConsistency({ policies });

    expect(result.valid).toBe(false);
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        level: 'error',
        path: expect.stringContaining('meta.key'),
      })
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Assertion Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('assertPolicySpecValid', () => {
  it('should not throw for valid policy', () => {
    expect(() => assertPolicySpecValid(validPolicy)).not.toThrow();
  });

  it('should throw PolicyValidationError for invalid policy', () => {
    const invalid: PolicySpec = {
      meta: {
        key: '',
        version: '',
        owners: [],
        description: '',
        stability: 'experimental',
        tags: [],
      },
      rules: [],
    };

    expect(() => assertPolicySpecValid(invalid)).toThrow(PolicyValidationError);
  });
});

describe('assertPolicyConsistency', () => {
  it('should not throw for consistent registries', () => {
    const policies = new PolicyRegistry([validPolicy]);

    expect(() => assertPolicyConsistency({ policies })).not.toThrow();
  });

  it('should throw PolicyValidationError for inconsistent registries', () => {
    const invalid: PolicySpec = {
      meta: {
        key: '',
        version: '',
        owners: [],
        description: '',
        stability: 'experimental',
        tags: [],
      },
      rules: [],
    };
    const policies = new PolicyRegistry([invalid]);

    expect(() => assertPolicyConsistency({ policies })).toThrow(
      PolicyValidationError
    );
  });
});
