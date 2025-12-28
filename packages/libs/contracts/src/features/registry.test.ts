import { describe, expect, it } from 'bun:test';
import { FeatureRegistry } from './registry';
import type { FeatureModuleSpec } from './types';
import { StabilityEnum } from '../ownership';

describe('FeatureRegistry', () => {
  const createFeature = (
    key: string,
    overrides?: Partial<FeatureModuleSpec>
  ): FeatureModuleSpec => ({
    meta: {
      key,
      version: 1,
      title: `Feature ${key}`,
      description: `Description for ${key}`,
      stability: StabilityEnum.Stable,
      owners: ['platform.core'],
      tags: ['test'],
    },
    ...overrides,
  });

  describe('register', () => {
    it('should register a feature', () => {
      const registry = new FeatureRegistry();
      const feature = createFeature('test.feature');

      registry.register(feature);
      expect(registry.list()).toHaveLength(1);
    });

    it('should return this for chaining', () => {
      const registry = new FeatureRegistry();
      const f1 = createFeature('feature.one');
      const f2 = createFeature('feature.two');

      registry.register(f1).register(f2);
      expect(registry.list()).toHaveLength(2);
    });

    it('should throw on duplicate key', () => {
      const registry = new FeatureRegistry();
      const f1 = createFeature('duplicate.feature');
      const f2 = createFeature('duplicate.feature');

      registry.register(f1);
      expect(() => registry.register(f2)).toThrow(/Duplicate feature/);
    });
  });

  describe('list', () => {
    it('should return empty array for new registry', () => {
      const registry = new FeatureRegistry();
      expect(registry.list()).toEqual([]);
    });

    it('should return all registered features', () => {
      const registry = new FeatureRegistry();
      registry.register(createFeature('a'));
      registry.register(createFeature('b'));
      registry.register(createFeature('c'));

      expect(registry.list()).toHaveLength(3);
    });
  });

  describe('get', () => {
    it('should get feature by key', () => {
      const registry = new FeatureRegistry();
      const feature = createFeature('target.feature');

      registry.register(feature);
      expect(registry.get('target.feature')).toBe(feature);
    });

    it('should return undefined for non-existent key', () => {
      const registry = new FeatureRegistry();
      expect(registry.get('nonexistent')).toBeUndefined();
    });
  });

  describe('listByTag', () => {
    it('should filter features by tag', () => {
      const registry = new FeatureRegistry();
      registry.register(
        createFeature('payments.stripe', {
          meta: {
            key: 'payments.stripe',
            version: 1,
            title: 'Stripe',
            description: 'Stripe payments',
            stability: StabilityEnum.Stable,
            owners: ['platform.payments'],
            tags: ['payments', 'stripe'],
          },
        })
      );
      registry.register(
        createFeature('auth.session', {
          meta: {
            key: 'auth.session',
            version: 1,
            title: 'Session',
            description: 'Session auth',
            stability: StabilityEnum.Stable,
            owners: ['platform.auth'],
            tags: ['auth'],
          },
        })
      );

      const payments = registry.listByTag('payments');
      expect(payments).toHaveLength(1);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(payments[0]!.meta.key).toBe('payments.stripe');
    });
  });

  describe('listByOwner', () => {
    it('should filter features by owner', () => {
      const registry = new FeatureRegistry();
      registry.register(
        createFeature('payments.stripe', {
          meta: {
            key: 'payments.stripe',
            version: 1,
            title: 'Stripe',
            description: 'Stripe payments',
            stability: StabilityEnum.Stable,
            owners: ['team.payments'],
            tags: [],
          },
        })
      );
      registry.register(
        createFeature('auth.session', {
          meta: {
            key: 'auth.session',
            version: 1,
            title: 'Session',
            description: 'Session auth',
            stability: StabilityEnum.Stable,
            owners: ['team.auth'],
            tags: [],
          },
        })
      );

      const paymentsTeam = registry.listByOwner('team.payments');
      expect(paymentsTeam).toHaveLength(1);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(paymentsTeam[0]!.meta.key).toBe('payments.stripe');
    });
  });

  describe('groupBy', () => {
    it('should group features by key function', () => {
      const registry = new FeatureRegistry();
      registry.register(
        createFeature('payments.stripe', {
          meta: {
            key: 'payments.stripe',
            version: 1,
            title: 'Stripe',
            description: 'Stripe',
            stability: StabilityEnum.Stable,
            owners: [],
            tags: [],
            domain: 'payments',
          },
        })
      );
      registry.register(
        createFeature('payments.paypal', {
          meta: {
            key: 'payments.paypal',
            version: 1,
            title: 'PayPal',
            description: 'PayPal',
            stability: StabilityEnum.Beta,
            owners: [],
            tags: [],
            domain: 'payments',
          },
        })
      );
      registry.register(
        createFeature('auth.session', {
          meta: {
            key: 'auth.session',
            version: 1,
            title: 'Session',
            description: 'Session',
            stability: StabilityEnum.Stable,
            owners: [],
            tags: [],
            domain: 'auth',
          },
        })
      );

      const byDomain = registry.groupBy((f) => f.meta.domain ?? 'unknown');
      expect(byDomain.get('payments')).toHaveLength(2);
      expect(byDomain.get('auth')).toHaveLength(1);
    });
  });

  describe('getUniqueTags', () => {
    it('should return unique tags across all features', () => {
      const registry = new FeatureRegistry();
      registry.register(
        createFeature('f1', {
          meta: {
            key: 'f1',
            version: 1,
            title: 'F1',
            description: 'F1',
            stability: StabilityEnum.Stable,
            owners: [],
            tags: ['a', 'b'],
          },
        })
      );
      registry.register(
        createFeature('f2', {
          meta: {
            key: 'f2',
            version: 1,
            title: 'F2',
            description: 'F2',
            stability: StabilityEnum.Stable,
            owners: [],
            tags: ['b', 'c'],
          },
        })
      );

      const tags = registry.getUniqueTags();
      expect(tags).toContain('a');
      expect(tags).toContain('b');
      expect(tags).toContain('c');
      expect(tags.filter((t) => t === 'b')).toHaveLength(1); // No duplicates
    });
  });

  describe('filter', () => {
    it('should filter features by criteria', () => {
      const registry = new FeatureRegistry();
      registry.register(
        createFeature('stable.feature', {
          meta: {
            key: 'stable.feature',
            version: 1,
            title: 'Stable',
            description: 'Stable',
            stability: StabilityEnum.Stable,
            owners: [],
            tags: [],
          },
        })
      );
      registry.register(
        createFeature('beta.feature', {
          meta: {
            key: 'beta.feature',
            version: 1,
            title: 'Beta',
            description: 'Beta',
            stability: StabilityEnum.Beta,
            owners: [],
            tags: [],
          },
        })
      );

      const stable = registry.filter({ stability: ['stable'] });
      expect(stable).toHaveLength(1);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(stable[0]!.meta.key).toBe('stable.feature');
    });
  });
});
