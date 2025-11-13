import { StabilityEnum } from '../../ownership';
import type { IntegrationSpec } from '../spec';
import type { IntegrationSpecRegistry } from '../spec';

export const stripeIntegrationSpec: IntegrationSpec = {
  meta: {
    key: 'payments.stripe',
    version: 1,
    category: 'payments',
    displayName: 'Stripe',
    title: 'Stripe Payments',
    description:
      'Stripe integration for payment processing, charges, and payouts.',
    domain: 'payments',
    owners: ['platform.payments'],
    tags: ['payments', 'psp'],
    stability: StabilityEnum.Stable,
  },
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
      required: ['apiKey', 'webhookSecret'],
      properties: {
        apiKey: {
          type: 'string',
          description: 'Stripe secret API key (sk_live_... or sk_test_...)',
        },
        webhookSecret: {
          type: 'string',
          description: 'Signing secret for webhook verification',
        },
        accountId: {
          type: 'string',
          description: 'Connected account ID when using Stripe Connect',
        },
      },
    },
    example: {
      apiKey: 'sk_test_123',
      webhookSecret: 'whsec_123',
      accountId: 'acct_123',
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
};

export function registerStripeIntegration(
  registry: IntegrationSpecRegistry
): IntegrationSpecRegistry {
  return registry.register(stripeIntegrationSpec);
}

