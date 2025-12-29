import { describe, expect, it } from 'bun:test';
import { CapabilityRegistry, type CapabilitySpec } from './capabilities';
import { type Owner, StabilityEnum, type Tag } from '../ownership';

const baseMeta = {
  title: 'Stripe Payments Capability' as const,
  description: 'Expose Stripe payment operations.' as const,
  domain: 'payments' as const,
  owners: ['@team.payments'] as Owner[],
  tags: ['payments', 'stripe'] as Tag[],
  stability: StabilityEnum.Experimental,
} as const;

function makeSpec(key: string, version: string): CapabilitySpec {
  return {
    meta: {
      ...baseMeta,
      key,
      version,
      kind: 'integration',
    },
    provides: [
      {
        surface: 'operation',
        key: 'payments.charge.create',
        version: '1.0.0',
      },
    ],
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
});
