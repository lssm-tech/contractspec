import { describe, expect, it } from 'bun:test';
import {
  CapabilityRegistry,
  type CapabilitySpec,
  type CapabilitySurfaceRef,
} from './capabilities';
import { type Owner, StabilityEnum, type Tag } from '../ownership';

const baseMeta = {
  title: 'Stripe Payments Capability' as const,
  description: 'Expose Stripe payment operations.' as const,
  domain: 'payments' as const,
  owners: ['@team.payments'] as Owner[],
  tags: ['payments', 'stripe'] as Tag[],
  stability: StabilityEnum.Experimental,
} as const;

function makeSpec(
  key: string,
  version: string,
  options?: {
    provides?: CapabilitySurfaceRef[];
    extends?: { key: string; version: string };
    requires?: { key: string; version?: string; optional?: boolean }[];
  }
): CapabilitySpec {
  return {
    meta: {
      ...baseMeta,
      key,
      version,
      kind: 'integration',
    },
    extends: options?.extends,
    provides: options?.provides ?? [
      {
        surface: 'operation',
        key: 'payments.charge.create',
        version: '1.0.0',
      },
    ],
    requires: options?.requires,
  };
}

describe('CapabilityRegistry', () => {
  it('registers and retrieves capabilities by key/version', () => {
    const registry = new CapabilityRegistry();
    registry.register(makeSpec('payments.stripe', '1.0.0'));
    const spec = registry.get('payments.stripe', '1.0.0');
    expect(spec?.meta.key).toBe('payments.stripe');
    expect(spec?.meta.version).toBe('1.0.0');
  });

  it('returns the highest version when version is omitted', () => {
    const registry = new CapabilityRegistry();
    registry.register(makeSpec('payments.stripe', '1.0.0'));
    registry.register(makeSpec('payments.stripe', '2.0.0'));
    const spec = registry.get('payments.stripe');
    expect(spec?.meta.version).toBe('2.0.0');
  });

  it('ensures capability requirements are satisfied', () => {
    const registry = new CapabilityRegistry();
    registry.register(makeSpec('payments.stripe', '1.0.0'));
    expect(
      registry.satisfies({
        key: 'payments.stripe',
        version: '1.0.0',
      })
    ).toBe(true);
    expect(
      registry.satisfies({
        key: 'payments.stripe',
      })
    ).toBe(true);
    expect(
      registry.satisfies({
        key: 'payments.stripe',
        version: '2.0.0',
      })
    ).toBe(false);
  });

  it('respects optional requirements and local provisions', () => {
    const registry = new CapabilityRegistry();
    const optionalResult = registry.satisfies({
      key: 'feature.local',
      optional: true,
    });
    expect(optionalResult).toBe(true);

    const providedResult = registry.satisfies(
      { key: 'payments.stripe', version: '1.0.0' },
      [{ key: 'payments.stripe', version: '1.0.0' }]
    );
    expect(providedResult).toBe(true);
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Query Methods Tests
  // ─────────────────────────────────────────────────────────────────────────────

  describe('getOperationsFor', () => {
    it('returns operations provided by a capability', () => {
      const registry = new CapabilityRegistry();
      registry.register(
        makeSpec('payments', '1.0.0', {
          provides: [
            { surface: 'operation', key: 'payments.charge.create' },
            { surface: 'operation', key: 'payments.charge.refund' },
            { surface: 'event', key: 'payments.charge.completed' },
          ],
        })
      );

      const ops = registry.getOperationsFor('payments', '1.0.0');
      expect(ops).toContain('payments.charge.create');
      expect(ops).toContain('payments.charge.refund');
      expect(ops).not.toContain('payments.charge.completed');
    });

    it('returns empty array for unknown capability', () => {
      const registry = new CapabilityRegistry();
      const ops = registry.getOperationsFor('unknown', '1.0.0');
      expect(ops).toEqual([]);
    });
  });

  describe('getEventsFor', () => {
    it('returns events provided by a capability', () => {
      const registry = new CapabilityRegistry();
      registry.register(
        makeSpec('payments', '1.0.0', {
          provides: [
            { surface: 'operation', key: 'payments.charge.create' },
            { surface: 'event', key: 'payments.charge.completed' },
            { surface: 'event', key: 'payments.charge.failed' },
          ],
        })
      );

      const events = registry.getEventsFor('payments', '1.0.0');
      expect(events).toContain('payments.charge.completed');
      expect(events).toContain('payments.charge.failed');
      expect(events).not.toContain('payments.charge.create');
    });
  });

  describe('getPresentationsFor', () => {
    it('returns presentations provided by a capability', () => {
      const registry = new CapabilityRegistry();
      registry.register(
        makeSpec('payments', '1.0.0', {
          provides: [
            { surface: 'presentation', key: 'payments.dashboard' },
            { surface: 'presentation', key: 'payments.invoice-view' },
          ],
        })
      );

      const presentations = registry.getPresentationsFor('payments', '1.0.0');
      expect(presentations).toContain('payments.dashboard');
      expect(presentations).toContain('payments.invoice-view');
    });
  });

  describe('getCapabilitiesForOperation', () => {
    it('returns capabilities that provide an operation', () => {
      const registry = new CapabilityRegistry();
      registry.register(
        makeSpec('payments.stripe', '1.0.0', {
          provides: [{ surface: 'operation', key: 'payments.charge.create' }],
        })
      );
      registry.register(
        makeSpec('payments.paypal', '1.0.0', {
          provides: [{ surface: 'operation', key: 'payments.charge.create' }],
        })
      );

      const caps = registry.getCapabilitiesForOperation(
        'payments.charge.create'
      );
      expect(caps).toHaveLength(2);
      expect(caps.map((c) => c.key)).toContain('payments.stripe');
      expect(caps.map((c) => c.key)).toContain('payments.paypal');
    });

    it('returns empty array for operation not in any capability', () => {
      const registry = new CapabilityRegistry();
      const caps = registry.getCapabilitiesForOperation('unknown.operation');
      expect(caps).toEqual([]);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Inheritance Tests
  // ─────────────────────────────────────────────────────────────────────────────

  describe('inheritance', () => {
    it('getAncestors returns parent chain', () => {
      const registry = new CapabilityRegistry();
      registry.register(makeSpec('base', '1.0.0', { provides: [] }));
      registry.register(
        makeSpec('middle', '1.0.0', {
          extends: { key: 'base', version: '1.0.0' },
          provides: [],
        })
      );
      registry.register(
        makeSpec('child', '1.0.0', {
          extends: { key: 'middle', version: '1.0.0' },
          provides: [],
        })
      );

      const ancestors = registry.getAncestors('child', '1.0.0');
      expect(ancestors).toHaveLength(2);
      expect(ancestors[0]?.meta.key).toBe('middle');
      expect(ancestors[1]?.meta.key).toBe('base');
    });

    it('getAncestors handles missing parent gracefully', () => {
      const registry = new CapabilityRegistry();
      registry.register(
        makeSpec('orphan', '1.0.0', {
          extends: { key: 'missing', version: '1.0.0' },
          provides: [],
        })
      );

      const ancestors = registry.getAncestors('orphan', '1.0.0');
      expect(ancestors).toEqual([]);
    });

    it('getEffectiveRequirements includes inherited requirements', () => {
      const registry = new CapabilityRegistry();
      registry.register(
        makeSpec('base', '1.0.0', {
          provides: [],
          requires: [{ key: 'auth', version: '1.0.0' }],
        })
      );
      registry.register(
        makeSpec('child', '1.0.0', {
          extends: { key: 'base', version: '1.0.0' },
          provides: [],
          requires: [{ key: 'logging', version: '1.0.0' }],
        })
      );

      const requirements = registry.getEffectiveRequirements('child', '1.0.0');
      expect(requirements).toHaveLength(2);
      expect(requirements.map((r) => r.key)).toContain('auth');
      expect(requirements.map((r) => r.key)).toContain('logging');
    });

    it('child requirements override parent requirements for same key', () => {
      const registry = new CapabilityRegistry();
      registry.register(
        makeSpec('base', '1.0.0', {
          provides: [],
          requires: [{ key: 'auth', version: '1.0.0' }],
        })
      );
      registry.register(
        makeSpec('child', '1.0.0', {
          extends: { key: 'base', version: '1.0.0' },
          provides: [],
          requires: [{ key: 'auth', version: '2.0.0' }],
        })
      );

      const requirements = registry.getEffectiveRequirements('child', '1.0.0');
      expect(requirements).toHaveLength(1);
      expect(requirements[0]?.key).toBe('auth');
      expect(requirements[0]?.version).toBe('2.0.0');
    });

    it('getEffectiveSurfaces includes inherited surfaces', () => {
      const registry = new CapabilityRegistry();
      registry.register(
        makeSpec('base', '1.0.0', {
          provides: [{ surface: 'operation', key: 'base.op' }],
        })
      );
      registry.register(
        makeSpec('child', '1.0.0', {
          extends: { key: 'base', version: '1.0.0' },
          provides: [{ surface: 'operation', key: 'child.op' }],
        })
      );

      const surfaces = registry.getEffectiveSurfaces('child', '1.0.0');
      expect(surfaces).toHaveLength(2);
      expect(surfaces.map((s) => s.key)).toContain('base.op');
      expect(surfaces.map((s) => s.key)).toContain('child.op');
    });
  });
});
