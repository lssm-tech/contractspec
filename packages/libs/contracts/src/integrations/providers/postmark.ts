import { StabilityEnum } from '../../ownership';
import type { IntegrationSpec, IntegrationSpecRegistry } from '../spec';

export const postmarkIntegrationSpec: IntegrationSpec = {
  meta: {
    key: 'email.postmark',
    version: 1,
    category: 'email',
    displayName: 'Postmark',
    title: 'Postmark Transactional Email',
    description: 'Postmark integration for transactional email delivery.',
    domain: 'communications',
    owners: ['platform.messaging'],
    tags: ['email', 'transactional'],
    stability: StabilityEnum.Stable,
  },
  supportedModes: ['managed', 'byok'],
  capabilities: {
    provides: [{ key: 'email.transactional', version: 1 }],
    requires: [
      {
        key: 'platform.webhooks',
        optional: true,
        reason: 'Optional for inbound bounce handling',
      },
    ],
  },
  configSchema: {
    schema: {
      type: 'object',
      properties: {
        messageStream: {
          type: 'string',
          description:
            'Optional message stream identifier (e.g., transactional).',
        },
        fromEmail: {
          type: 'string',
          description: 'Default From address used for outbound messages.',
        },
      },
    },
    example: {
      messageStream: 'outbound',
      fromEmail: 'notifications@example.com',
    },
  },
  secretSchema: {
    schema: {
      type: 'object',
      required: ['serverToken'],
      properties: {
        serverToken: {
          type: 'string',
          description: 'Server token for the Postmark account.',
        },
      },
    },
    example: {
      serverToken: 'server-***',
    },
  },
  healthCheck: {
    method: 'ping',
    timeoutMs: 3000,
  },
  docsUrl: 'https://postmarkapp.com/developer',
  constraints: {
    rateLimit: {
      rpm: 500,
    },
  },
  byokSetup: {
    setupInstructions:
      'Create a Postmark server token with outbound send permissions and configure allowed from addresses.',
  },
};

export function registerPostmarkIntegration(
  registry: IntegrationSpecRegistry
): IntegrationSpecRegistry {
  return registry.register(postmarkIntegrationSpec);
}
