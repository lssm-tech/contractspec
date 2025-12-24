import { describe, expect, it } from 'bun:test';
import {
  FeatureRegistry,
  installFeature,
  type FeatureModuleSpec,
} from './features';
import {
  CapabilityRegistry,
  type CapabilitySpec,
  type CapabilityRef,
} from './capabilities';
import { StabilityEnum, type Owner, type Tag } from './ownership';

const baseMeta = {
  version: 1,
  title: 'Stripe Payments Capability' as const,
  description: 'Expose Stripe payment operations.' as const,
  domain: 'payments' as const,
  owners: ['@team.payments'] as Owner[],
  tags: ['payments', 'stripe'] as Tag[],
  stability: StabilityEnum.Experimental,
} as const;

const capabilitySpec: CapabilitySpec = {
  meta: {
    ...baseMeta,
    key: 'payments.stripe',
    version: 1,
    kind: 'integration',
  },
  provides: [
    {
      surface: 'operation',
      name: 'payments.charge.create',
      version: 1,
    },
  ],
};

function featureWithCapabilities(
  provides?: CapabilityRef[]
): FeatureModuleSpec {
  return {
    meta: {
      key: 'payments_stripe_feature',
      version: 1,
      title: 'Stripe Payments',
      description: 'Enable Stripe charge operations.',
      domain: 'payments',
      owners: ['@team.payments'],
      tags: ['payments', 'stripe'],
      stability: StabilityEnum.Experimental,
    },
    capabilities: {
      provides,
      requires: [
        {
          key: 'payments.stripe',
          version: 1,
        },
      ],
    },
  };
}

describe('installFeature capability validation', () => {
  it('throws when capability requirement is not satisfied', () => {
    const features = new FeatureRegistry();
    const capabilities = new CapabilityRegistry();
    const spec = featureWithCapabilities();

    expect(() => installFeature(spec, { features, capabilities })).toThrowError(
      /capability requirement not satisfied/
    );
  });

  it('allows instal when capability registry contains the required capability', () => {
    const features = new FeatureRegistry();
    const capabilities = new CapabilityRegistry();
    capabilities.register(capabilitySpec);
    const spec = featureWithCapabilities();

    expect(() =>
      installFeature(spec, { features, capabilities })
    ).not.toThrow();
    expect(features.get(spec.meta.key)).toBeDefined();
  });

  it('allows capability requirements satisfied by locally provided capability', () => {
    const features = new FeatureRegistry();
    const capabilities = new CapabilityRegistry();
    capabilities.register(capabilitySpec);
    const provides = [{ key: 'payments.stripe', version: 1 }];
    const spec = featureWithCapabilities(provides);

    // Local provide should satisfy requirement when capability is declared
    expect(() =>
      installFeature(spec, { features, capabilities })
    ).not.toThrow();
  });
});
