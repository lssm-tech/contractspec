import { StabilityEnum } from '@contractspec/lib.contracts-spec/ownership';
import { defineIntegration, IntegrationSpecRegistry } from '../spec';

export const messagingWhatsappMetaIntegrationSpec = defineIntegration({
  meta: {
    key: 'messaging.whatsapp.meta',
    version: '1.0.0',
    category: 'messaging',
    title: 'WhatsApp Cloud API (Meta)',
    description:
      'Meta WhatsApp Cloud API integration for inbound message processing and outbound replies.',
    domain: 'communications',
    owners: ['platform.messaging'],
    tags: ['messaging', 'whatsapp', 'meta'],
    stability: StabilityEnum.Beta,
  },
  supportedModes: ['managed', 'byok'],
  capabilities: {
    provides: [
      { key: 'messaging.inbound', version: '1.0.0' },
      { key: 'messaging.outbound', version: '1.0.0' },
    ],
  },
  configSchema: {
    schema: {
      type: 'object',
      required: ['phoneNumberId'],
      properties: {
        phoneNumberId: {
          type: 'string',
          description: 'WhatsApp business phone number ID used for sends.',
        },
        apiVersion: {
          type: 'string',
          description: 'Optional Graph API version (e.g. v22.0).',
        },
      },
    },
    example: {
      phoneNumberId: '1234567890',
      apiVersion: 'v22.0',
    },
  },
  secretSchema: {
    schema: {
      type: 'object',
      required: ['accessToken', 'appSecret', 'verifyToken'],
      properties: {
        accessToken: {
          type: 'string',
          description: 'Meta access token for WhatsApp Cloud API calls.',
        },
        appSecret: {
          type: 'string',
          description: 'Meta app secret used for signature verification.',
        },
        verifyToken: {
          type: 'string',
          description: 'Webhook verify token used during challenge handshake.',
        },
      },
    },
    example: {
      accessToken: 'EAAG***',
      appSecret: '***',
      verifyToken: 'contractspec-verify',
    },
  },
  healthCheck: {
    method: 'custom',
    timeoutMs: 5000,
  },
  docsUrl: 'https://developers.facebook.com/docs/whatsapp',
  constraints: {
    rateLimit: {
      rpm: 120,
    },
  },
  byokSetup: {
    setupInstructions:
      'Create a Meta app with WhatsApp product enabled, add a business phone number, and provide API and webhook credentials.',
  },
});

export function registerMessagingWhatsappMetaIntegration(
  registry: IntegrationSpecRegistry
): IntegrationSpecRegistry {
  return registry.register(messagingWhatsappMetaIntegrationSpec);
}
