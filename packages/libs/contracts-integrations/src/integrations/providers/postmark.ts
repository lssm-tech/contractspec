import { StabilityEnum } from '@contractspec/lib.contracts-spec/ownership';
import { defineIntegration, IntegrationSpecRegistry } from '../spec';
import type { IntegrationTransportConfig } from '../transport';
import type { IntegrationAuthConfig } from '../auth';

export const postmarkIntegrationSpec = defineIntegration({
  meta: {
    key: 'email.postmark',
    version: '1.0.0',
    category: 'email',
    title: 'Postmark Transactional Email',
    description: 'Postmark integration for transactional email delivery.',
    domain: 'communications',
    owners: ['platform.messaging'],
    tags: ['email', 'transactional'],
    stability: StabilityEnum.Stable,
  },
  supportedModes: ['managed', 'byok'],
  transports: [
    { type: 'rest', baseUrl: 'https://api.postmarkapp.com' },
    {
      type: 'webhook',
      inbound: { signatureHeader: 'x-postmark-signature', signingAlgorithm: 'hmac-sha256' },
    },
  ],
  preferredTransport: 'rest',
  supportedAuthMethods: [
    { type: 'header', headerName: 'X-Postmark-Server-Token' },
  ],
  capabilities: {
    provides: [{ key: 'email.transactional', version: '1.0.0' }],
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
    keyRotationSupported: true,
    quotaTrackingSupported: false,
  },
});

export function registerPostmarkIntegration(
  registry: IntegrationSpecRegistry
): IntegrationSpecRegistry {
  return registry.register(postmarkIntegrationSpec);
}
