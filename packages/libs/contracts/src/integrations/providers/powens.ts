import { StabilityEnum } from '../../ownership';
import type { IntegrationSpec } from '../spec';
import type { IntegrationSpecRegistry } from '../spec';

export const powensIntegrationSpec: IntegrationSpec = {
  meta: {
    key: 'openbanking.powens',
    version: 1,
    category: 'open-banking',
    displayName: 'Powens Open Banking',
    title: 'Powens Open Banking (Read)',
    description:
      'Read-only Open Banking integration powered by Powens, exposing accounts, transactions, and balances.',
    domain: 'finance',
    owners: ['platform.finance'],
    tags: ['open-banking', 'powens', 'finance'],
    stability: StabilityEnum.Experimental,
  },
  supportedModes: ['byok'],
  capabilities: {
    provides: [
      { key: 'openbanking.accounts.read', version: 1 },
      { key: 'openbanking.transactions.read', version: 1 },
      { key: 'openbanking.balances.read', version: 1 },
    ],
  },
  configSchema: {
    schema: {
      type: 'object',
      required: ['environment'],
      properties: {
        environment: {
          type: 'string',
          enum: ['sandbox', 'production'],
          description:
            'Powens environment to target. Sandbox uses Powens test API base URL, production uses live endpoints.',
        },
        baseUrl: {
          type: 'string',
          description:
            'Optional override for the Powens API base URL. Defaults to Powens environment defaults.',
        },
        region: {
          type: 'string',
          description:
            'Optional Powens region identifier when targeting a specific data residency cluster.',
        },
        pollingIntervalMs: {
          type: 'number',
          description:
            'Optional custom polling interval in milliseconds for background sync jobs (defaults to platform standard).',
        },
      },
    },
    example: {
      environment: 'sandbox',
      baseUrl: 'https://api-sandbox.powens.com/v2',
      region: 'eu-west-1',
      pollingIntervalMs: 300000,
    },
  },
  secretSchema: {
    schema: {
      type: 'object',
      required: ['clientId', 'clientSecret'],
      properties: {
        clientId: {
          type: 'string',
          description:
            'Powens OAuth client identifier obtained from the Powens Console (BYOK project).',
        },
        clientSecret: {
          type: 'string',
          description:
            'Powens OAuth client secret used to exchange for access tokens.',
        },
        apiKey: {
          type: 'string',
          description:
            'Optional Powens API key (if the tenant project exposes a dedicated API token).',
        },
        webhookSecret: {
          type: 'string',
          description:
            'Optional webhook signing secret used to verify Powens webhook payloads.',
        },
      },
    },
    example: {
      clientId: 'powens-client-id',
      clientSecret: 'powens-client-secret',
      apiKey: 'powens-api-key',
      webhookSecret: 'powens-webhook-secret',
    },
  },
  healthCheck: {
    method: 'ping',
    timeoutMs: 8000,
  },
  docsUrl: 'https://docs.powens.com/',
  constraints: {
    rateLimit: {
      rph: 10000,
      rpm: 600,
    },
  },
  byokSetup: {
    setupInstructions:
      'Create a Powens BYOK project, generate OAuth credentials, and optionally configure webhook delivery for account/transaction updates.',
    requiredScopes: ['accounts:read', 'transactions:read', 'balances:read'],
  },
};

export function registerPowensIntegration(
  registry: IntegrationSpecRegistry
): IntegrationSpecRegistry {
  return registry.register(powensIntegrationSpec);
}



