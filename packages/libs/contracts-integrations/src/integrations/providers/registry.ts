import type { IntegrationAuthType } from '../auth';
import { supportsAuthMethod } from '../auth';
import { type IntegrationSpec, IntegrationSpecRegistry } from '../spec';
import type { IntegrationTransportType } from '../transport';
import { supportsTransport } from '../transport';
import { registerAppleHealthIntegration } from './apple-health';
import { registerComposioIntegration } from './composio';
import { registerDeepgramIntegration } from './deepgram';
import { registerEightSleepIntegration } from './eightsleep';
import { registerElevenLabsIntegration } from './elevenlabs';
import { registerFalIntegration } from './fal';
import { registerFathomIntegration } from './fathom';
import { registerFirefliesIntegration } from './fireflies';
import { registerFitbitIntegration } from './fitbit';
import { registerGarminIntegration } from './garmin';
import { registerGcsStorageIntegration } from './gcs-storage';
import { registerGmailIntegration } from './gmail';
import { registerGoogleCalendarIntegration } from './google-calendar';
import { registerGradiumIntegration } from './gradium';
import { registerGranolaIntegration } from './granola';
import { registerJiraIntegration } from './jira';
import { registerLinearIntegration } from './linear';
import { registerMessagingGithubIntegration } from './messaging-github';
import { registerMessagingSlackIntegration } from './messaging-slack';
import { registerMessagingTelegramIntegration } from './messaging-telegram';
import { registerMessagingWhatsappMetaIntegration } from './messaging-whatsapp-meta';
import { registerMessagingWhatsappTwilioIntegration } from './messaging-whatsapp-twilio';
import { registerMistralIntegration } from './mistral';
import { registerMistralConversationalIntegration } from './mistral-conversational';
import { registerMistralSttIntegration } from './mistral-stt';
import { registerMyFitnessPalIntegration } from './myfitnesspal';
import { registerNotionIntegration } from './notion';
import { registerOpenaiRealtimeIntegration } from './openai-realtime';
import { registerOpenWearablesIntegration } from './openwearables';
import { registerOuraIntegration } from './oura';
import { registerPelotonIntegration } from './peloton';
import { registerPosthogIntegration } from './posthog';
import { registerPostmarkIntegration } from './postmark';
import { registerPowensIntegration } from './powens';
import { registerQdrantIntegration } from './qdrant';
import { registerStravaIntegration } from './strava';
import { registerStripeIntegration } from './stripe';
import { registerSupabasePostgresIntegration } from './supabase-postgres';
import { registerSupabaseVectorIntegration } from './supabase-vector';
import { registerTldvIntegration } from './tldv';
import { registerTwilioSmsIntegration } from './twilio-sms';
import { registerWhoopIntegration } from './whoop';

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
	registerMistralSttIntegration(registry);
	registerMistralConversationalIntegration(registry);
	registerElevenLabsIntegration(registry);
	registerGradiumIntegration(registry);
	registerFalIntegration(registry);
	registerGmailIntegration(registry);
	registerGoogleCalendarIntegration(registry);
	registerPosthogIntegration(registry);
	registerTwilioSmsIntegration(registry);
	registerMessagingSlackIntegration(registry);
	registerMessagingGithubIntegration(registry);
	registerMessagingTelegramIntegration(registry);
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
	registerComposioIntegration(registry);

	return registry;
}

/**
 * Filter specs that support a given transport type.
 */
export function filterByTransport(
	specs: IntegrationSpec[],
	transport: IntegrationTransportType
): IntegrationSpec[] {
	return specs.filter(
		(s) => s.transports && supportsTransport(s.transports, transport)
	);
}

/**
 * Filter specs that support a given auth method.
 */
export function filterByAuthMethod(
	specs: IntegrationSpec[],
	method: IntegrationAuthType
): IntegrationSpec[] {
	return specs.filter(
		(s) =>
			s.supportedAuthMethods &&
			supportsAuthMethod(s.supportedAuthMethods, method)
	);
}

/**
 * Filter specs that have a version policy (API versioning support).
 */
export function filterVersioned(specs: IntegrationSpec[]): IntegrationSpec[] {
	return specs.filter((s) => s.versionPolicy !== undefined);
}

/**
 * Filter specs that support BYOK with key rotation.
 */
export function filterByokRotatable(
	specs: IntegrationSpec[]
): IntegrationSpec[] {
	return specs.filter(
		(s) =>
			s.supportedModes.includes('byok') &&
			s.byokSetup?.keyRotationSupported === true
	);
}
