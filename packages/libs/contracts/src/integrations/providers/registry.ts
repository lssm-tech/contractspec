import { IntegrationSpecRegistry } from '../spec';

import { registerStripeIntegration } from './stripe';
import { registerPostmarkIntegration } from './postmark';
import { registerQdrantIntegration } from './qdrant';
import { registerMistralIntegration } from './mistral';
import { registerElevenLabsIntegration } from './elevenlabs';
import { registerGmailIntegration } from './gmail';
import { registerGoogleCalendarIntegration } from './google-calendar';
import { registerTwilioSmsIntegration } from './twilio-sms';
import { registerGcsStorageIntegration } from './gcs-storage';
import { registerPowensIntegration } from './powens';

/**
 * Creates a registry containing all IntegrationSpec providers shipped by
 * `@lssm/lib.contracts`.
 */
export function createDefaultIntegrationSpecRegistry(): IntegrationSpecRegistry {
  const registry = new IntegrationSpecRegistry();

  registerStripeIntegration(registry);
  registerPostmarkIntegration(registry);
  registerQdrantIntegration(registry);
  registerMistralIntegration(registry);
  registerElevenLabsIntegration(registry);
  registerGmailIntegration(registry);
  registerGoogleCalendarIntegration(registry);
  registerTwilioSmsIntegration(registry);
  registerGcsStorageIntegration(registry);
  registerPowensIntegration(registry);

  return registry;
}


