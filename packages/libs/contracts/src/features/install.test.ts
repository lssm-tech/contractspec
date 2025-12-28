import { describe, expect, it } from 'bun:test';
import { installFeature } from './install';
import { FeatureRegistry } from './registry';
import type { FeatureModuleSpec } from './types';
import { CapabilityRegistry, type CapabilitySpec } from '../capabilities';
import { StabilityEnum } from '../ownership';

describe('installFeature', () => {
  const createFeature = (
    overrides?: Partial<FeatureModuleSpec>
  ): FeatureModuleSpec => ({
    meta: {
      key: 'test.feature',
      version: 1,
      title: 'Test Feature',
      description: 'A test feature',
      stability: StabilityEnum.Stable,
      owners: ['platform.core'],
      tags: ['test'],
    },
    ...overrides,
  });

  describe('basic registration', () => {
    it('should register feature in registry', () => {
      const features = new FeatureRegistry();
      const feature = createFeature();

      installFeature(feature, { features });

      expect(features.get('test.feature')).toBe(feature);
    });

    it('should return the registry for chaining', () => {
      const features = new FeatureRegistry();
      const feature = createFeature();

      const result = installFeature(feature, { features });

      expect(result).toBe(features);
    });
  });

  describe('capability validation', () => {
    const capabilitySpec: CapabilitySpec = {
      meta: {
        key: 'payments.stripe',
        version: 1,
        title: 'Stripe Payments',
        description: 'Stripe payment processing',
        stability: StabilityEnum.Stable,
        owners: ['team.payments'],
        tags: ['payments'],
        kind: 'integration',
      },
      provides: [
        { surface: 'operation', key: 'payments.charge.create', version: 1 },
      ],
    };

    it('should throw when capability requirement is not satisfied', () => {
      const features = new FeatureRegistry();
      const capabilities = new CapabilityRegistry();
      const feature = createFeature({
        capabilities: {
          requires: [{ key: 'payments.stripe', version: 1 }],
        },
      });

      expect(() => installFeature(feature, { features, capabilities })).toThrow(
        /capability requirement not satisfied/
      );
    });

    it('should allow install when capability is registered', () => {
      const features = new FeatureRegistry();
      const capabilities = new CapabilityRegistry();
      capabilities.register(capabilitySpec);

      const feature = createFeature({
        capabilities: {
          requires: [{ key: 'payments.stripe', version: 1 }],
        },
      });

      expect(() =>
        installFeature(feature, { features, capabilities })
      ).not.toThrow();
      expect(features.get('test.feature')).toBeDefined();
    });

    it('should allow capability requirements satisfied by locally provided capability', () => {
      const features = new FeatureRegistry();
      const capabilities = new CapabilityRegistry();
      capabilities.register(capabilitySpec);

      const feature = createFeature({
        capabilities: {
          provides: [{ key: 'payments.stripe', version: 1 }],
          requires: [{ key: 'payments.stripe', version: 1 }],
        },
      });

      expect(() =>
        installFeature(feature, { features, capabilities })
      ).not.toThrow();
    });

    it('should throw when capability is provided but not registered', () => {
      const features = new FeatureRegistry();
      const capabilities = new CapabilityRegistry();

      const feature = createFeature({
        capabilities: {
          provides: [{ key: 'unregistered.cap', version: 1 }],
        },
      });

      expect(() => installFeature(feature, { features, capabilities })).toThrow(
        /capability not registered/
      );
    });

    it('should throw when requires present but no capability registry', () => {
      const features = new FeatureRegistry();

      const feature = createFeature({
        capabilities: {
          requires: [{ key: 'some.cap', version: 1 }],
        },
      });

      expect(() => installFeature(feature, { features })).toThrow(
        /capability registry required/
      );
    });
  });

  describe('presentation targets validation', () => {
    it('should validate V2 descriptor exists', () => {
      const features = new FeatureRegistry();
      const feature = createFeature({
        presentationsTargets: [
          { key: 'missing.presentation', version: 1, targets: ['react'] },
        ],
      });

      expect(() =>
        installFeature(feature, { features, descriptors: [] })
      ).toThrow(/V2 descriptor not found/);
    });

    it('should validate V2 descriptor has required targets', () => {
      const features = new FeatureRegistry();
      const descriptors = [
        {
          meta: {
            key: 'user.profile',
            version: 1,
            title: 'Profile',
            description: 'User profile',
            stability: 'stable' as const,
            owners: [],
            tags: [],
            domain: '',
            goal: 'Profile view',
            context: 'Context',
          },
          targets: ['markdown'] as (
            | 'react'
            | 'markdown'
            | 'application/json'
            | 'application/xml'
          )[],
          source: {
            type: 'component' as const,
            componentKey: 'UserProfile',
            framework: 'react' as const,
          },
        },
      ];

      const feature = createFeature({
        presentationsTargets: [
          { key: 'user.profile', version: 1, targets: ['react'] },
        ],
      });

      expect(() => installFeature(feature, { features, descriptors })).toThrow(
        /missing target react/
      );
    });

    it('should pass when descriptor has all required targets', () => {
      const features = new FeatureRegistry();
      const descriptors = [
        {
          meta: {
            key: 'user.profile',
            version: 1,
            title: 'Profile',
            description: 'Profile',
            stability: 'stable' as const,
            owners: [],
            tags: [],
            domain: '',
            goal: 'Profile view',
            context: 'Context',
          },
          targets: ['react', 'markdown'] as (
            | 'react'
            | 'markdown'
            | 'application/json'
            | 'application/xml'
          )[],
          source: {
            type: 'component' as const,
            componentKey: 'UserProfile',
            framework: 'react' as const,
          },
        },
      ];

      const feature = createFeature({
        presentationsTargets: [
          { key: 'user.profile', version: 1, targets: ['react'] },
        ],
      });

      expect(() =>
        installFeature(feature, { features, descriptors })
      ).not.toThrow();
    });
  });
});
