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
import { registerLinearIntegration } from './linear';
import { registerJiraIntegration } from './jira';
import { registerNotionIntegration } from './notion';
import { registerGranolaIntegration } from './granola';
import { registerTldvIntegration } from './tldv';
import { registerFirefliesIntegration } from './fireflies';
import { registerFathomIntegration } from './fathom';

/**
 * Creates a registry containing all IntegrationSpec providers shipped by
 * `@contractspec/lib.contracts`.
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
  registerLinearIntegration(registry);
  registerJiraIntegration(registry);
  registerNotionIntegration(registry);
  registerGranolaIntegration(registry);
  registerTldvIntegration(registry);
  registerFirefliesIntegration(registry);
  registerFathomIntegration(registry);

  return registry;
}
