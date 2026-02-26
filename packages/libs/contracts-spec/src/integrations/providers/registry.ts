import { IntegrationSpecRegistry } from '../spec';

import { registerStripeIntegration } from './stripe';
import { registerPostmarkIntegration } from './postmark';
import { registerQdrantIntegration } from './qdrant';
import { registerSupabaseVectorIntegration } from './supabase-vector';
import { registerSupabasePostgresIntegration } from './supabase-postgres';
import { registerMistralIntegration } from './mistral';
import { registerElevenLabsIntegration } from './elevenlabs';
import { registerGradiumIntegration } from './gradium';
import { registerFalIntegration } from './fal';
import { registerGmailIntegration } from './gmail';
import { registerGoogleCalendarIntegration } from './google-calendar';
import { registerPosthogIntegration } from './posthog';
import { registerTwilioSmsIntegration } from './twilio-sms';
import { registerMessagingSlackIntegration } from './messaging-slack';
import { registerMessagingGithubIntegration } from './messaging-github';
import { registerMessagingWhatsappMetaIntegration } from './messaging-whatsapp-meta';
import { registerMessagingWhatsappTwilioIntegration } from './messaging-whatsapp-twilio';
import { registerGcsStorageIntegration } from './gcs-storage';
import { registerPowensIntegration } from './powens';
import { registerLinearIntegration } from './linear';
import { registerJiraIntegration } from './jira';
import { registerNotionIntegration } from './notion';
import { registerGranolaIntegration } from './granola';
import { registerTldvIntegration } from './tldv';
import { registerFirefliesIntegration } from './fireflies';
import { registerFathomIntegration } from './fathom';
import { registerDeepgramIntegration } from './deepgram';
import { registerOpenaiRealtimeIntegration } from './openai-realtime';
import { registerOpenWearablesIntegration } from './openwearables';
import { registerWhoopIntegration } from './whoop';
import { registerAppleHealthIntegration } from './apple-health';
import { registerOuraIntegration } from './oura';
import { registerStravaIntegration } from './strava';
import { registerGarminIntegration } from './garmin';
import { registerFitbitIntegration } from './fitbit';
import { registerMyFitnessPalIntegration } from './myfitnesspal';
import { registerEightSleepIntegration } from './eightsleep';
import { registerPelotonIntegration } from './peloton';

/**
 * Creates a registry containing all IntegrationSpec providers shipped by
 * `@contractspec/lib.contracts-spec`.
 */
export function createDefaultIntegrationSpecRegistry(): IntegrationSpecRegistry {
  const registry = new IntegrationSpecRegistry();

  registerStripeIntegration(registry);
  registerPostmarkIntegration(registry);
  registerQdrantIntegration(registry);
  registerSupabaseVectorIntegration(registry);
  registerSupabasePostgresIntegration(registry);
  registerMistralIntegration(registry);
  registerElevenLabsIntegration(registry);
  registerGradiumIntegration(registry);
  registerFalIntegration(registry);
  registerGmailIntegration(registry);
  registerGoogleCalendarIntegration(registry);
  registerPosthogIntegration(registry);
  registerTwilioSmsIntegration(registry);
  registerMessagingSlackIntegration(registry);
  registerMessagingGithubIntegration(registry);
  registerMessagingWhatsappMetaIntegration(registry);
  registerMessagingWhatsappTwilioIntegration(registry);
  registerGcsStorageIntegration(registry);
  registerPowensIntegration(registry);
  registerLinearIntegration(registry);
  registerJiraIntegration(registry);
  registerNotionIntegration(registry);
  registerGranolaIntegration(registry);
  registerTldvIntegration(registry);
  registerFirefliesIntegration(registry);
  registerFathomIntegration(registry);
  registerDeepgramIntegration(registry);
  registerOpenaiRealtimeIntegration(registry);
  registerOpenWearablesIntegration(registry);
  registerWhoopIntegration(registry);
  registerAppleHealthIntegration(registry);
  registerOuraIntegration(registry);
  registerStravaIntegration(registry);
  registerGarminIntegration(registry);
  registerFitbitIntegration(registry);
  registerMyFitnessPalIntegration(registry);
  registerEightSleepIntegration(registry);
  registerPelotonIntegration(registry);

  return registry;
}
