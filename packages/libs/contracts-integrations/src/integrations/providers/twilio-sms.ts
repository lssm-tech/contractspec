import { StabilityEnum } from '@contractspec/lib.contracts-spec/ownership';
import { defineIntegration, IntegrationSpecRegistry } from '../spec';
import type { IntegrationTransportConfig } from '../transport';
import type { IntegrationAuthConfig } from '../auth';

export const twilioSmsIntegrationSpec = defineIntegration({
  meta: {
    key: 'sms.twilio',
    version: '1.0.0',
    category: 'sms',
    title: 'Twilio Messaging',
    description:
      'Twilio SMS integration for transactional and notification messaging.',
    domain: 'communications',
    owners: ['platform.messaging'],
    tags: ['sms', 'messaging'],
    stability: StabilityEnum.Stable,
  },
  supportedModes: ['managed', 'byok'],
  transports: [
    { type: 'rest', baseUrl: 'https://api.twilio.com' },
    {
      type: 'webhook',
      inbound: { signatureHeader: 'x-twilio-signature', signingAlgorithm: 'hmac-sha1' },
    },
    { type: 'sdk', packageName: 'twilio', minVersion: '5.0.0' },
  ],
  preferredTransport: 'rest',
  supportedAuthMethods: [
    { type: 'basic' },
  ],
  capabilities: {
    provides: [{ key: 'sms.outbound', version: '1.0.0' }],
  },
  configSchema: {
    schema: {
      type: 'object',
      properties: {
        fromNumber: {
          type: 'string',
          description: 'Default Twilio phone number used as sender.',
        },
      },
    },
    example: {
      fromNumber: '+15551234567',
    },
  },
  secretSchema: {
    schema: {
      type: 'object',
      required: ['accountSid', 'authToken'],
      properties: {
        accountSid: {
          type: 'string',
          description: 'Twilio Account SID.',
        },
        authToken: {
          type: 'string',
          description: 'Twilio Auth Token.',
        },
      },
    },
    example: {
      accountSid: 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      authToken: 'auth-token',
    },
  },
  healthCheck: {
    method: 'custom',
    timeoutMs: 3000,
  },
  docsUrl: 'https://www.twilio.com/docs/sms/api',
  constraints: {
    rateLimit: {
      rpm: 200,
    },
  },
  byokSetup: {
    setupInstructions:
      'Provide a Twilio account SID, auth token, and verify the outbound sending numbers used by the integration.',
    keyRotationSupported: true,
    quotaTrackingSupported: false,
  },
});

export function registerTwilioSmsIntegration(
  registry: IntegrationSpecRegistry
): IntegrationSpecRegistry {
  return registry.register(twilioSmsIntegrationSpec);
}
