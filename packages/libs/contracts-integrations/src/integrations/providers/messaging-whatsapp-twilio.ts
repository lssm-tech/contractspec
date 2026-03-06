import { StabilityEnum } from '@contractspec/lib.contracts-spec/ownership';
import { defineIntegration, IntegrationSpecRegistry } from '../spec';
import type { IntegrationTransportConfig } from '../transport';
import type { IntegrationAuthConfig } from '../auth';

export const messagingWhatsappTwilioIntegrationSpec = defineIntegration({
  meta: {
    key: 'messaging.whatsapp.twilio',
    version: '1.0.0',
    category: 'messaging',
    title: 'WhatsApp via Twilio',
    description:
      'Twilio-powered WhatsApp integration for inbound webhooks and outbound conversational messaging.',
    domain: 'communications',
    owners: ['platform.messaging'],
    tags: ['messaging', 'whatsapp', 'twilio'],
    stability: StabilityEnum.Beta,
  },
  supportedModes: ['managed', 'byok'],
  transports: [
    { type: 'rest', baseUrl: 'https://api.twilio.com' },
    { type: 'webhook', inbound: { signatureHeader: 'x-twilio-signature', signingAlgorithm: 'hmac-sha1' } },
  ],
  preferredTransport: 'rest',
  supportedAuthMethods: [
    { type: 'basic' },
  ],
  capabilities: {
    provides: [
      { key: 'messaging.inbound', version: '1.0.0' },
      { key: 'messaging.outbound', version: '1.0.0' },
    ],
  },
  configSchema: {
    schema: {
      type: 'object',
      properties: {
        fromNumber: {
          type: 'string',
          description:
            'Default WhatsApp-enabled Twilio sender number (e.g. whatsapp:+15551234567).',
        },
      },
    },
    example: {
      fromNumber: 'whatsapp:+15551234567',
    },
  },
  secretSchema: {
    schema: {
      type: 'object',
      required: ['accountSid', 'authToken'],
      properties: {
        accountSid: {
          type: 'string',
          description: 'Twilio account SID.',
        },
        authToken: {
          type: 'string',
          description: 'Twilio auth token.',
        },
      },
    },
    example: {
      accountSid: 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      authToken: '***',
    },
  },
  healthCheck: {
    method: 'custom',
    timeoutMs: 4000,
  },
  docsUrl: 'https://www.twilio.com/docs/whatsapp',
  constraints: {
    rateLimit: {
      rpm: 200,
    },
  },
  byokSetup: {
    setupInstructions:
      'Create a Twilio project with WhatsApp sender provisioning, then provide account SID/auth token and sender number.',
    keyRotationSupported: true,
    quotaTrackingSupported: false,
  },
});

export function registerMessagingWhatsappTwilioIntegration(
  registry: IntegrationSpecRegistry
): IntegrationSpecRegistry {
  return registry.register(messagingWhatsappTwilioIntegrationSpec);
}
