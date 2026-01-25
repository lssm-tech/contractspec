import { describe, expect, it } from 'bun:test';
import {
  createCapabilityContext,
  createEmptyCapabilityContext,
  CapabilityMissingError,
} from './context';
import {
  assertCapabilityForOperation,
  checkCapabilityForOperation,
  filterOperationsByCapability,
} from './guards';
import type { AnyOperationSpec } from '../operations/operation';
import { SchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';
import { type Owner, StabilityEnum, type Tag } from '../ownership';

// ─────────────────────────────────────────────────────────────────────────────
// Test Helpers
// ─────────────────────────────────────────────────────────────────────────────

const baseMeta = {
  title: 'Test' as const,
  description: 'Test description' as const,
  domain: 'test' as const,
  owners: ['@team.test'] as Owner[],
  tags: ['test'] as Tag[],
  stability: StabilityEnum.Experimental,
} as const;

function makeOperation(
  key: string,
  capability?: { key: string; version: string }
): AnyOperationSpec {
  return {
    meta: {
      ...baseMeta,
      key,
      version: '1.0.0',
      kind: 'command',
      goal: 'Test operation',
      context: 'Test context',
    },
    capability,
    io: {
      input: new SchemaModel({
        name: 'TestInput',
        fields: {
          id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
        },
      }),
      output: new SchemaModel({
        name: 'TestOutput',
        fields: {
          success: { type: ScalarTypeEnum.Boolean(), isOptional: false },
        },
      }),
    },
    policy: { auth: 'user' },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Context Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('CapabilityContext', () => {
  describe('createCapabilityContext', () => {
    it('creates context from capability refs', () => {
      const ctx = createCapabilityContext([
        { key: 'payments', version: '1.0.0' },
        { key: 'analytics', version: '2.0.0' },
      ]);

      expect(ctx.capabilities.has('payments')).toBe(true);
      expect(ctx.capabilities.has('analytics')).toBe(true);
      expect(ctx.capabilities.has('unknown')).toBe(false);
    });

    it('stores version information', () => {
      const ctx = createCapabilityContext([
        { key: 'payments', version: '1.0.0' },
      ]);

      expect(ctx.capabilityVersions.get('payments')).toBe('1.0.0');
    });
  });

  describe('hasCapability', () => {
    it('returns true for enabled capability', () => {
      const ctx = createCapabilityContext([
        { key: 'payments', version: '1.0.0' },
      ]);

      expect(ctx.hasCapability('payments')).toBe(true);
    });

    it('returns false for disabled capability', () => {
      const ctx = createCapabilityContext([
        { key: 'payments', version: '1.0.0' },
      ]);

      expect(ctx.hasCapability('analytics')).toBe(false);
    });

    it('checks version when specified', () => {
      const ctx = createCapabilityContext([
        { key: 'payments', version: '1.0.0' },
      ]);

      expect(ctx.hasCapability('payments', '1.0.0')).toBe(true);
      expect(ctx.hasCapability('payments', '2.0.0')).toBe(false);
    });
  });

  describe('requireCapability', () => {
    it('does not throw for enabled capability', () => {
      const ctx = createCapabilityContext([
        { key: 'payments', version: '1.0.0' },
      ]);

      expect(() => ctx.requireCapability('payments')).not.toThrow();
    });

    it('throws CapabilityMissingError for disabled capability', () => {
      const ctx = createCapabilityContext([]);

      expect(() => ctx.requireCapability('payments')).toThrow(
        CapabilityMissingError
      );
    });

    it('throws with correct capability key', () => {
      const ctx = createCapabilityContext([]);

      try {
        ctx.requireCapability('payments', '1.0.0');
        expect.unreachable('Should have thrown');
      } catch (err) {
        expect(err).toBeInstanceOf(CapabilityMissingError);
        expect((err as CapabilityMissingError).capabilityKey).toBe('payments');
        expect((err as CapabilityMissingError).requiredVersion).toBe('1.0.0');
      }
    });
  });

  describe('hasAllCapabilities', () => {
    it('returns true when all capabilities are enabled', () => {
      const ctx = createCapabilityContext([
        { key: 'payments', version: '1.0.0' },
        { key: 'analytics', version: '1.0.0' },
      ]);

      expect(ctx.hasAllCapabilities(['payments', 'analytics'])).toBe(true);
    });

    it('returns false when any capability is missing', () => {
      const ctx = createCapabilityContext([
        { key: 'payments', version: '1.0.0' },
      ]);

      expect(ctx.hasAllCapabilities(['payments', 'analytics'])).toBe(false);
    });

    it('returns true for empty array', () => {
      const ctx = createCapabilityContext([]);

      expect(ctx.hasAllCapabilities([])).toBe(true);
    });
  });

  describe('hasAnyCapability', () => {
    it('returns true when at least one capability is enabled', () => {
      const ctx = createCapabilityContext([
        { key: 'payments', version: '1.0.0' },
      ]);

      expect(ctx.hasAnyCapability(['payments', 'analytics'])).toBe(true);
    });

    it('returns false when no capabilities are enabled', () => {
      const ctx = createCapabilityContext([]);

      expect(ctx.hasAnyCapability(['payments', 'analytics'])).toBe(false);
    });

    it('returns false for empty array', () => {
      const ctx = createCapabilityContext([
        { key: 'payments', version: '1.0.0' },
      ]);

      expect(ctx.hasAnyCapability([])).toBe(false);
    });
  });

  describe('getMatchingCapabilities', () => {
    it('returns exact match', () => {
      const ctx = createCapabilityContext([
        { key: 'payments', version: '1.0.0' },
        { key: 'payments.stripe', version: '1.0.0' },
      ]);

      expect(ctx.getMatchingCapabilities('payments')).toEqual(['payments']);
    });

    it('returns wildcard matches', () => {
      const ctx = createCapabilityContext([
        { key: 'payments', version: '1.0.0' },
        { key: 'payments.stripe', version: '1.0.0' },
        { key: 'payments.paypal', version: '1.0.0' },
        { key: 'analytics', version: '1.0.0' },
      ]);

      const matches = ctx.getMatchingCapabilities('payments.*');
      expect(matches).toContain('payments.stripe');
      expect(matches).toContain('payments.paypal');
      expect(matches).not.toContain('payments');
      expect(matches).not.toContain('analytics');
    });

    it('returns empty array for no matches', () => {
      const ctx = createCapabilityContext([
        { key: 'payments', version: '1.0.0' },
      ]);

      expect(ctx.getMatchingCapabilities('analytics*')).toEqual([]);
    });
  });

  describe('createEmptyCapabilityContext', () => {
    it('creates context with no capabilities', () => {
      const ctx = createEmptyCapabilityContext();

      expect(ctx.capabilities.size).toBe(0);
      expect(ctx.hasCapability('anything')).toBe(false);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Guard Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('Capability Guards', () => {
  describe('checkCapabilityForOperation', () => {
    it('allows operation without capability requirement', () => {
      const ctx = createEmptyCapabilityContext();
      const op = makeOperation('test.op');

      const result = checkCapabilityForOperation(ctx, op);

      expect(result.allowed).toBe(true);
    });

    it('allows operation when capability is enabled', () => {
      const ctx = createCapabilityContext([
        { key: 'payments', version: '1.0.0' },
      ]);
      const op = makeOperation('payments.charge', {
        key: 'payments',
        version: '1.0.0',
      });

      const result = checkCapabilityForOperation(ctx, op);

      expect(result.allowed).toBe(true);
    });

    it('denies operation when capability is missing', () => {
      const ctx = createEmptyCapabilityContext();
      const op = makeOperation('payments.charge', {
        key: 'payments',
        version: '1.0.0',
      });

      const result = checkCapabilityForOperation(ctx, op);

      expect(result.allowed).toBe(false);
      expect(result.missingCapability?.key).toBe('payments');
    });
  });

  describe('assertCapabilityForOperation', () => {
    it('does not throw for allowed operation', () => {
      const ctx = createCapabilityContext([
        { key: 'payments', version: '1.0.0' },
      ]);
      const op = makeOperation('payments.charge', {
        key: 'payments',
        version: '1.0.0',
      });

      expect(() => assertCapabilityForOperation(ctx, op)).not.toThrow();
    });

    it('throws for denied operation', () => {
      const ctx = createEmptyCapabilityContext();
      const op = makeOperation('payments.charge', {
        key: 'payments',
        version: '1.0.0',
      });

      expect(() => assertCapabilityForOperation(ctx, op)).toThrow(
        CapabilityMissingError
      );
    });
  });

  describe('filterOperationsByCapability', () => {
    it('filters operations to only enabled capabilities', () => {
      const ctx = createCapabilityContext([
        { key: 'payments', version: '1.0.0' },
      ]);

      const ops = [
        makeOperation('payments.charge', { key: 'payments', version: '1.0.0' }),
        makeOperation('analytics.track', {
          key: 'analytics',
          version: '1.0.0',
        }),
        makeOperation('open.endpoint'), // No capability
      ];

      const filtered = filterOperationsByCapability(ctx, ops);

      expect(filtered).toHaveLength(2);
      expect(filtered.map((o) => o.meta.key)).toContain('payments.charge');
      expect(filtered.map((o) => o.meta.key)).toContain('open.endpoint');
      expect(filtered.map((o) => o.meta.key)).not.toContain('analytics.track');
    });
  });
});
