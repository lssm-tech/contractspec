import { describe, expect, it } from 'vitest';
import { IntegrationSpecRegistry } from './spec';
import type { IntegrationCategory, IntegrationSpec } from './spec';

const makeSpec = (
  overrides: Partial<IntegrationSpec> = {}
): IntegrationSpec => ({
  meta: {
    key: 'stripe',
    version: 1,
    category: 'payments',
    displayName: 'Stripe',
    title: 'Stripe Payments',
    description: 'Stripe PSP integration.',
    domain: 'payments',
    owners: ['platform.sigil'],
    tags: ['payments'],
    stability: 'stable',
  },
  supportedModes: ['managed', 'byok'],
  capabilities: {
    provides: [{ key: 'payments.psp', version: 1 }],
  },
  configSchema: {
    schema: {
      type: 'object',
      properties: {
        accountId: { type: 'string' },
      },
    },
    example: { accountId: 'acct_123' },
  },
  secretSchema: {
    schema: {
      type: 'object',
      required: ['apiKey'],
      properties: {
        apiKey: { type: 'string' },
      },
    },
    example: { apiKey: 'sk_test_123' },
  },
  ...overrides,
});

describe('IntegrationSpecRegistry', () => {
  it('registers and retrieves specs by key/version', () => {
    const registry = new IntegrationSpecRegistry();
    const spec = makeSpec();

    registry.register(spec);

    expect(registry.get('stripe', 1)).toEqual(spec);
    expect(registry.get('stripe')).toEqual(spec);
  });

  it('throws when registering duplicate specs', () => {
    const registry = new IntegrationSpecRegistry();
    const spec = makeSpec();

    registry.register(spec);
    expect(() => registry.register(spec)).toThrowError(
      /Duplicate IntegrationSpec/
    );
  });

  it.each<IntegrationCategory>(['payments', 'email', 'calendar', 'ai-llm'])(
    'filters by category (%s)',
    (category) => {
      const registry = new IntegrationSpecRegistry();
      const spec = makeSpec({
        meta: {
          ...makeSpec().meta,
          key: `integration-${category}`,
          category,
        },
      });

      registry.register(spec);

      expect(registry.getByCategory(category)).toEqual([spec]);
    }
  );
});
