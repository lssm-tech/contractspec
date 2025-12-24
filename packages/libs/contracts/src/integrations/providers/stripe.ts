import { StabilityEnum } from '../../ownership';
import type { IntegrationSpec } from '../spec';
import type { IntegrationSpecRegistry } from '../spec';

export const stripeIntegrationSpec: IntegrationSpec = {
  meta: {
    key: 'payments.stripe',
    version: 1,
    category: 'payments',
    title: 'Stripe Payments',
    description:
      'Stripe integration for payment processing, charges, and payouts.',
    domain: 'payments',
    owners: ['platform.payments'],
    tags: ['payments', 'psp'],
    stability: StabilityEnum.Stable,
  },
  supportedModes: ['managed', 'byok'],
  capabilities: {
    provides: [{ key: 'payments.psp', version: 1 }],
    requires: [
      {
        key: 'platform.webhooks',
        optional: true,
        reason: 'Recommended for reliable event ingestion',
      },
    ],
  },
  configSchema: {
    schema: {
      type: 'object',
      properties: {
        accountId: {
          type: 'string',
          description: 'Connected account ID when using Stripe Connect (BYOK).',
        },
        region: {
          type: 'string',
          description: 'Optional Stripe region or data residency hint.',
        },
      },
    },
    example: {
      accountId: 'acct_123',
      region: 'us-east-1',
    },
  },
  secretSchema: {
    schema: {
      type: 'object',
      required: ['apiKey', 'webhookSecret'],
      properties: {
        apiKey: {
          type: 'string',
          description: 'Stripe secret API key (sk_live_... or sk_test_...).',
        },
        webhookSecret: {
          type: 'string',
          description: 'Signing secret for webhook verification.',
        },
      },
    },
    example: {
      apiKey: 'sk_live_***',
      webhookSecret: 'whsec_***',
    },
  },
  healthCheck: {
    method: 'ping',
    timeoutMs: 5000,
  },
  docsUrl: 'https://stripe.com/docs/api',
  constraints: {
    rateLimit: {
      rpm: 1000,
      rph: 20000,
    },
  },
  byokSetup: {
    setupInstructions:
      'Create a restricted Stripe API key with write access to Charges and provide a webhook signing secret.',
    requiredScopes: ['charges:write', 'customers:read'],
  },
};

export function registerStripeIntegration(
  registry: IntegrationSpecRegistry
): IntegrationSpecRegistry {
  return registry.register(stripeIntegrationSpec);
}
