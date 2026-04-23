import { Buffer } from 'node:buffer';
import type { AnalyticsProvider } from '@contractspec/integration.provider.analytics';
import { PosthogAnalyticsProvider } from '@contractspec/integration.provider.analytics/impls/posthog';
import type { DatabaseProvider } from '@contractspec/integration.provider.database';
import { SupabasePostgresProvider } from '@contractspec/integration.provider.database/impls/supabase-psql';
import type {
	EmailInboundProvider,
	EmailOutboundProvider,
} from '@contractspec/integration.provider.email';
import { GmailInboundProvider } from '@contractspec/integration.provider.email/impls/gmail-inbound';
import { GmailOutboundProvider } from '@contractspec/integration.provider.email/impls/gmail-outbound';
import { PostmarkEmailProvider } from '@contractspec/integration.provider.email/impls/postmark-email';
import type { EmbeddingProvider } from '@contractspec/integration.provider.embedding';
import { MistralEmbeddingProvider } from '@contractspec/integration.provider.embedding/impls/mistral-embedding';
import type { HealthProvider } from '@contractspec/integration.provider.health';
import { createHealthProviderFromContext } from '@contractspec/integration.provider.health/impls/health-provider-factory';
import type { LLMProvider } from '@contractspec/integration.provider.llm';
import { MistralLLMProvider } from '@contractspec/integration.provider.llm/impls/mistral-llm';
import type { MeetingRecorderProvider } from '@contractspec/integration.provider.meeting-recorder';
import { FathomMeetingRecorderProvider } from '@contractspec/integration.provider.meeting-recorder/impls/fathom-meeting-recorder';
import { FirefliesMeetingRecorderProvider } from '@contractspec/integration.provider.meeting-recorder/impls/fireflies-meeting-recorder';
import { GranolaMeetingRecorderProvider } from '@contractspec/integration.provider.meeting-recorder/impls/granola-meeting-recorder';
import { TldvMeetingRecorderProvider } from '@contractspec/integration.provider.meeting-recorder/impls/tldv-meeting-recorder';
import type { MessagingProvider } from '@contractspec/integration.provider.messaging';
import { GithubMessagingProvider } from '@contractspec/integration.provider.messaging/impls/messaging-github';
import { SlackMessagingProvider } from '@contractspec/integration.provider.messaging/impls/messaging-slack';
import { TelegramMessagingProvider } from '@contractspec/integration.provider.messaging/impls/messaging-telegram';
import { MetaWhatsappMessagingProvider } from '@contractspec/integration.provider.messaging/impls/messaging-whatsapp-meta';
import { TwilioWhatsappMessagingProvider } from '@contractspec/integration.provider.messaging/impls/messaging-whatsapp-twilio';
import type { OpenBankingProvider } from '@contractspec/integration.provider.openbanking';
import type { PowensEnvironment } from '@contractspec/integration.provider.openbanking/impls/powens-client';
import { PowensOpenBankingProvider } from '@contractspec/integration.provider.openbanking/impls/powens-openbanking';
import type { PaymentsProvider } from '@contractspec/integration.provider.payments';
import { StripePaymentsProvider } from '@contractspec/integration.provider.payments/impls/stripe-payments';
import type { ProjectManagementProvider } from '@contractspec/integration.provider.project-management';
import { JiraProjectManagementProvider } from '@contractspec/integration.provider.project-management/impls/jira';
import { LinearProjectManagementProvider } from '@contractspec/integration.provider.project-management/impls/linear';
import { NotionProjectManagementProvider } from '@contractspec/integration.provider.project-management/impls/notion';
import type { SmsProvider } from '@contractspec/integration.provider.sms';
import { TwilioSmsProvider } from '@contractspec/integration.provider.sms/impls/twilio-sms';
import type { ObjectStorageProvider } from '@contractspec/integration.provider.storage';
import { GoogleCloudStorageProvider } from '@contractspec/integration.provider.storage/impls/gcs-storage';
import type { VectorStoreProvider } from '@contractspec/integration.provider.vector-store';
import { QdrantVectorProvider } from '@contractspec/integration.provider.vector-store/impls/qdrant-vector';
import { SupabaseVectorProvider } from '@contractspec/integration.provider.vector-store/impls/supabase-vector';
import type {
	ConversationalProvider,
	STTProvider,
	TTSProvider,
} from '@contractspec/integration.provider.voice';
import { ElevenLabsVoiceProvider } from '@contractspec/integration.provider.voice/impls/elevenlabs-voice';
import { FalVoiceProvider } from '@contractspec/integration.provider.voice/impls/fal-voice';
import { GradiumVoiceProvider } from '@contractspec/integration.provider.voice/impls/gradium-voice';
import { MistralConversationalProvider } from '@contractspec/integration.provider.voice/impls/mistral-conversational';
import { MistralSttProvider } from '@contractspec/integration.provider.voice/impls/mistral-stt';
import type { IntegrationContext } from '@contractspec/integration.runtime/runtime';
import type { SecretValue } from '@contractspec/integration.runtime/secrets/provider';
import type { IntegrationAuthType } from '@contractspec/lib.contracts-integrations/integrations/auth';
import { findAuthConfig } from '@contractspec/lib.contracts-integrations/integrations/auth';
import { buildAuthHeaders } from '@contractspec/lib.contracts-integrations/integrations/auth-helpers';
import { resolveIntegrationRequestContext } from '@contractspec/lib.contracts-integrations/integrations/runtime';
import type { IntegrationTransportType } from '@contractspec/lib.contracts-integrations/integrations/transport';
import { google } from 'googleapis';
import type { ComposioFallbackResolver } from './composio-fallback-resolver';

const SECRET_CACHE = new Map<string, Record<string, unknown>>();

/**
 * Resolved transport, auth, and version context for a provider invocation.
 */
export interface ResolvedProviderContext {
	transport: IntegrationTransportType;
	authMethod: IntegrationAuthType | undefined;
	apiVersion: string | undefined;
	/** Pre-built auth headers from the resolved auth method and secrets. */
	authHeaders: Record<string, string>;
	secrets: Record<string, unknown>;
}

export class IntegrationProviderFactory {
	private readonly composioFallback?: ComposioFallbackResolver;

	constructor(options?: { composioFallback?: ComposioFallbackResolver }) {
		this.composioFallback = options?.composioFallback;
	}
	/**
	 * Resolve transport, auth method, API version, and build auth headers
	 * for a given integration context. Consumers can call this directly
	 * for custom wiring or it is used internally by the create* methods.
	 */
	async resolveProviderContext(
		context: IntegrationContext
	): Promise<ResolvedProviderContext> {
		const secrets = await this.loadSecrets(context);
		const { transport, authMethod, apiVersion } =
			resolveIntegrationRequestContext(context.spec, context.connection);

		let authHeaders: Record<string, string> = {};
		if (authMethod && context.spec.supportedAuthMethods) {
			const authConfig = findAuthConfig(
				context.spec.supportedAuthMethods,
				authMethod
			);
			if (authConfig) {
				const stringSecrets = Object.fromEntries(
					Object.entries(secrets)
						.filter(([, v]) => typeof v === 'string')
						.map(([k, v]) => [k, v as string])
				);
				authHeaders = buildAuthHeaders(authConfig, stringSecrets);
			}
		}

		return { transport, authMethod, apiVersion, authHeaders, secrets };
	}

	async createPaymentsProvider(
		context: IntegrationContext
	): Promise<PaymentsProvider> {
		const secrets = await this.loadSecrets(context);
		switch (context.spec.meta.key) {
			case 'payments.stripe':
				return new StripePaymentsProvider({
					apiKey: requireSecret<string>(
						secrets,
						'apiKey',
						'Stripe API key is required'
					),
				});
			default:
				if (this.composioFallback?.canHandle(context.spec.meta.key)) {
					return this.composioFallback.createPaymentsProxy(context);
				}
				throw new Error(
					`Unsupported payments integration: ${context.spec.meta.key}`
				);
		}
	}

	async createEmailOutboundProvider(
		context: IntegrationContext
	): Promise<EmailOutboundProvider> {
		const secrets = await this.loadSecrets(context);
		switch (context.spec.meta.key) {
			case 'email.gmail':
				return new GmailOutboundProvider({
					auth: createGmailAuth(secrets),
				});
			case 'email.postmark':
				return new PostmarkEmailProvider({
					serverToken: requireSecret<string>(
						secrets,
						'serverToken',
						'Postmark server token is required'
					),
					defaultFromEmail: (context.config as { fromEmail?: string })
						.fromEmail,
					messageStream: (context.config as { messageStream?: string })
						.messageStream,
				});
			default:
				if (this.composioFallback?.canHandle(context.spec.meta.key)) {
					return this.composioFallback.createEmailProxy(context);
				}
				throw new Error(
					`Unsupported email integration: ${context.spec.meta.key}`
				);
		}
	}

	async createEmailInboundProvider(
		context: IntegrationContext
	): Promise<EmailInboundProvider> {
		const secrets = await this.loadSecrets(context);
		switch (context.spec.meta.key) {
			case 'email.gmail':
				return new GmailInboundProvider({
					auth: createGmailAuth(secrets),
					includeSpamTrash: Boolean(
						(context.config as { includeSpamTrash?: boolean }).includeSpamTrash
					),
				});
			default:
				throw new Error(
					`Unsupported inbound email integration: ${context.spec.meta.key}`
				);
		}
	}

	async createSmsProvider(context: IntegrationContext): Promise<SmsProvider> {
		const secrets = await this.loadSecrets(context);
		switch (context.spec.meta.key) {
			case 'sms.twilio':
				return new TwilioSmsProvider({
					accountSid: requireSecret<string>(
						secrets,
						'accountSid',
						'Twilio account SID is required'
					),
					authToken: requireSecret<string>(
						secrets,
						'authToken',
						'Twilio auth token is required'
					),
					fromNumber: (context.config as { fromNumber?: string }).fromNumber,
				});
			default:
				if (this.composioFallback?.canHandle(context.spec.meta.key)) {
					return this.composioFallback.createMessagingProxy(
						context
					) as unknown as SmsProvider;
				}
				throw new Error(
					`Unsupported SMS integration: ${context.spec.meta.key}`
				);
		}
	}

	async createMessagingProvider(
		context: IntegrationContext
	): Promise<MessagingProvider> {
		const secrets = await this.loadSecrets(context);
		const config = context.config as {
			defaultChannelId?: string;
			allowUserMentions?: boolean;
			defaultOwner?: string;
			defaultRepo?: string;
			apiBaseUrl?: string;
			defaultChatId?: string;
			phoneNumberId?: string;
			apiVersion?: string;
			fromNumber?: string;
		};

		switch (context.spec.meta.key) {
			case 'messaging.slack':
				return new SlackMessagingProvider({
					botToken: requireSecret<string>(
						secrets,
						'botToken',
						'Slack bot token is required'
					),
					defaultChannelId: config?.defaultChannelId,
					apiBaseUrl: config?.apiBaseUrl,
				});
			case 'messaging.github':
				return new GithubMessagingProvider({
					token: requireSecret<string>(
						secrets,
						'token',
						'GitHub token is required'
					),
					defaultOwner: config?.defaultOwner,
					defaultRepo: config?.defaultRepo,
					apiBaseUrl: config?.apiBaseUrl,
				});
			case 'messaging.telegram':
				return new TelegramMessagingProvider({
					botToken: requireSecret<string>(
						secrets,
						'botToken',
						'Telegram bot token is required'
					),
					defaultChatId: config?.defaultChatId,
					apiBaseUrl: config?.apiBaseUrl,
				});
			case 'messaging.whatsapp.meta':
				return new MetaWhatsappMessagingProvider({
					accessToken: requireSecret<string>(
						secrets,
						'accessToken',
						'Meta WhatsApp access token is required'
					),
					phoneNumberId: requireConfig<string>(
						context,
						'phoneNumberId',
						'Meta WhatsApp phoneNumberId is required'
					),
					apiVersion: config?.apiVersion,
				});
			case 'messaging.whatsapp.twilio':
				return new TwilioWhatsappMessagingProvider({
					accountSid: requireSecret<string>(
						secrets,
						'accountSid',
						'Twilio account SID is required'
					),
					authToken: requireSecret<string>(
						secrets,
						'authToken',
						'Twilio auth token is required'
					),
					fromNumber: config?.fromNumber,
				});
			default:
				if (this.composioFallback?.canHandle(context.spec.meta.key)) {
					return this.composioFallback.createMessagingProxy(context);
				}
				throw new Error(
					`Unsupported messaging integration: ${context.spec.meta.key}`
				);
		}
	}

	async createVectorStoreProvider(
		context: IntegrationContext
	): Promise<VectorStoreProvider> {
		const secrets = await this.loadSecrets(context);
		const config = context.config as {
			apiUrl?: string;
			schema?: string;
			table?: string;
			createTableIfMissing?: boolean;
			distanceMetric?: 'cosine' | 'l2' | 'inner_product';
			maxConnections?: number;
			sslMode?: 'require' | 'allow' | 'prefer';
		};

		switch (context.spec.meta.key) {
			case 'vectordb.qdrant':
				return new QdrantVectorProvider({
					url: requireConfig<string>(
						context,
						'apiUrl',
						'Qdrant apiUrl config is required'
					),
					apiKey: secrets.apiKey as string | undefined,
				});
			case 'vectordb.supabase':
				return new SupabaseVectorProvider({
					connectionString: requireDatabaseUrl(
						secrets,
						'Supabase vector databaseUrl secret is required'
					),
					schema: config?.schema,
					table: config?.table,
					createTableIfMissing: config?.createTableIfMissing,
					distanceMetric: config?.distanceMetric,
					maxConnections: config?.maxConnections,
					sslMode: config?.sslMode,
				});
			default:
				if (this.composioFallback?.canHandle(context.spec.meta.key)) {
					return this.composioFallback.createGenericProxy(
						context
					) as unknown as VectorStoreProvider;
				}
				throw new Error(
					`Unsupported vector store integration: ${context.spec.meta.key}`
				);
		}
	}

	async createAnalyticsProvider(
		context: IntegrationContext
	): Promise<AnalyticsProvider> {
		const secrets = await this.loadSecrets(context);
		const config = context.config as {
			host?: string;
			projectId?: string;
			mcpUrl?: string;
		};

		switch (context.spec.meta.key) {
			case 'analytics.posthog':
				return new PosthogAnalyticsProvider({
					host: config?.host,
					projectId: config?.projectId,
					mcpUrl: config?.mcpUrl,
					projectApiKey: secrets.projectApiKey as string | undefined,
					personalApiKey: requireSecret<string>(
						secrets,
						'personalApiKey',
						'PostHog personalApiKey is required'
					),
				});
			default:
				if (this.composioFallback?.canHandle(context.spec.meta.key)) {
					return this.composioFallback.createGenericProxy(
						context
					) as unknown as AnalyticsProvider;
				}
				throw new Error(
					`Unsupported analytics integration: ${context.spec.meta.key}`
				);
		}
	}

	async createDatabaseProvider(
		context: IntegrationContext
	): Promise<DatabaseProvider> {
		const secrets = await this.loadSecrets(context);
		const config = context.config as {
			maxConnections?: number;
			sslMode?: 'require' | 'allow' | 'prefer';
		};

		switch (context.spec.meta.key) {
			case 'database.supabase':
				return new SupabasePostgresProvider({
					connectionString: requireDatabaseUrl(
						secrets,
						'Supabase database databaseUrl secret is required'
					),
					maxConnections: config?.maxConnections,
					sslMode: config?.sslMode,
				});
			default:
				if (this.composioFallback?.canHandle(context.spec.meta.key)) {
					return this.composioFallback.createGenericProxy(
						context
					) as unknown as DatabaseProvider;
				}
				throw new Error(
					`Unsupported database integration: ${context.spec.meta.key}`
				);
		}
	}

	async createObjectStorageProvider(
		context: IntegrationContext
	): Promise<ObjectStorageProvider> {
		const secrets = await this.loadSecrets(context);
		switch (context.spec.meta.key) {
			case 'storage.s3':
			case 'storage.gcs':
				return new GoogleCloudStorageProvider({
					bucket: requireConfig<string>(
						context,
						'bucket',
						'Storage bucket is required'
					),
					clientOptions:
						secrets.type === 'service_account'
							? { credentials: secrets as Record<string, unknown> }
							: undefined,
				});
			default:
				if (this.composioFallback?.canHandle(context.spec.meta.key)) {
					return this.composioFallback.createGenericProxy(
						context
					) as unknown as ObjectStorageProvider;
				}
				throw new Error(
					`Unsupported storage integration: ${context.spec.meta.key}`
				);
		}
	}

	async createVoiceProvider(context: IntegrationContext): Promise<TTSProvider> {
		const secrets = await this.loadSecrets(context);
		const config = context.config as {
			defaultVoiceId?: string;
			region?: 'eu' | 'us';
			baseUrl?: string;
			timeoutMs?: number;
			outputFormat?:
				| 'wav'
				| 'pcm'
				| 'opus'
				| 'ulaw_8000'
				| 'alaw_8000'
				| 'pcm_16000'
				| 'pcm_24000';
			modelId?: string;
			defaultVoiceUrl?: string;
			defaultExaggeration?: number;
			defaultTemperature?: number;
			defaultCfg?: number;
			pollIntervalMs?: number;
		};

		switch (context.spec.meta.key) {
			case 'ai-voice.elevenlabs':
				return new ElevenLabsVoiceProvider({
					apiKey: requireSecret<string>(
						secrets,
						'apiKey',
						'ElevenLabs API key is required'
					),
					defaultVoiceId: config?.defaultVoiceId,
				});
			case 'ai-voice.gradium':
				return new GradiumVoiceProvider({
					apiKey: requireSecret<string>(
						secrets,
						'apiKey',
						'Gradium API key is required'
					),
					defaultVoiceId: config?.defaultVoiceId,
					region: config?.region,
					baseUrl: config?.baseUrl,
					timeoutMs: config?.timeoutMs,
					outputFormat: config?.outputFormat,
				});
			case 'ai-voice.fal':
				return new FalVoiceProvider({
					apiKey: requireSecret<string>(
						secrets,
						'apiKey',
						'Fal API key is required'
					),
					modelId: config?.modelId,
					defaultVoiceUrl: config?.defaultVoiceUrl,
					defaultExaggeration: config?.defaultExaggeration,
					defaultTemperature: config?.defaultTemperature,
					defaultCfg: config?.defaultCfg,
					pollIntervalMs: config?.pollIntervalMs,
				});
			default:
				if (this.composioFallback?.canHandle(context.spec.meta.key)) {
					return this.composioFallback.createGenericProxy(
						context
					) as unknown as TTSProvider;
				}
				throw new Error(
					`Unsupported voice integration: ${context.spec.meta.key}`
				);
		}
	}

	async createSttProvider(context: IntegrationContext): Promise<STTProvider> {
		const secrets = await this.loadSecrets(context);
		const config = context.config as {
			model?: string;
			language?: string;
			serverURL?: string;
		};

		switch (context.spec.meta.key) {
			case 'ai-voice-stt.mistral':
				return new MistralSttProvider({
					apiKey: requireSecret<string>(
						secrets,
						'apiKey',
						'Mistral API key is required'
					),
					defaultModel: config?.model,
					defaultLanguage: config?.language,
					serverURL: config?.serverURL,
				});
			default:
				if (this.composioFallback?.canHandle(context.spec.meta.key)) {
					return this.composioFallback.createGenericProxy(
						context
					) as unknown as STTProvider;
				}
				throw new Error(
					`Unsupported STT integration: ${context.spec.meta.key}`
				);
		}
	}

	async createConversationalProvider(
		context: IntegrationContext
	): Promise<ConversationalProvider> {
		const secrets = await this.loadSecrets(context);
		const config = context.config as {
			model?: string;
			defaultVoice?: string;
			serverURL?: string;
			language?: string;
		};

		switch (context.spec.meta.key) {
			case 'ai-voice-conv.mistral':
				return new MistralConversationalProvider({
					apiKey: requireSecret<string>(
						secrets,
						'apiKey',
						'Mistral API key is required'
					),
					defaultModel: config?.model,
					defaultVoiceId: config?.defaultVoice,
					serverURL: config?.serverURL,
					sttOptions: {
						defaultModel: config?.model,
						defaultLanguage: config?.language,
						serverURL: config?.serverURL,
					},
				});
			default:
				if (this.composioFallback?.canHandle(context.spec.meta.key)) {
					return this.composioFallback.createGenericProxy(
						context
					) as unknown as ConversationalProvider;
				}
				throw new Error(
					`Unsupported conversational integration: ${context.spec.meta.key}`
				);
		}
	}

	async createProjectManagementProvider(
		context: IntegrationContext
	): Promise<ProjectManagementProvider> {
		const secrets = await this.loadSecrets(context);
		const config = context.config as {
			teamId?: string;
			projectId?: string;
			assigneeId?: string;
			stateId?: string;
			labelIds?: string[];
			tagLabelMap?: Record<string, string>;
			siteUrl?: string;
			projectKey?: string;
			issueType?: string;
			defaultLabels?: string[];
			issueTypeMap?: Record<string, string>;
			databaseId?: string;
			summaryParentPageId?: string;
			titleProperty?: string;
			statusProperty?: string;
			priorityProperty?: string;
			tagsProperty?: string;
			dueDateProperty?: string;
			descriptionProperty?: string;
		};

		switch (context.spec.meta.key) {
			case 'project-management.linear':
				return new LinearProjectManagementProvider({
					apiKey: requireSecret<string>(
						secrets,
						'apiKey',
						'Linear API key is required'
					),
					teamId: requireConfig<string>(
						context,
						'teamId',
						'Linear teamId is required'
					),
					projectId: config?.projectId,
					assigneeId: config?.assigneeId,
					stateId: config?.stateId,
					labelIds: config?.labelIds,
					tagLabelMap: config?.tagLabelMap,
				});
			case 'project-management.jira':
				return new JiraProjectManagementProvider({
					siteUrl: requireConfig<string>(
						context,
						'siteUrl',
						'Jira siteUrl is required'
					),
					email: requireSecret<string>(
						secrets,
						'email',
						'Jira email is required'
					),
					apiToken: requireSecret<string>(
						secrets,
						'apiToken',
						'Jira API token is required'
					),
					projectKey: config?.projectKey,
					issueType: config?.issueType,
					defaultLabels: config?.defaultLabels,
					issueTypeMap: config?.issueTypeMap,
				});
			case 'project-management.notion':
				return new NotionProjectManagementProvider({
					apiKey: requireSecret<string>(
						secrets,
						'apiKey',
						'Notion API key is required'
					),
					databaseId: config?.databaseId,
					summaryParentPageId: config?.summaryParentPageId,
					titleProperty: config?.titleProperty,
					statusProperty: config?.statusProperty,
					priorityProperty: config?.priorityProperty,
					tagsProperty: config?.tagsProperty,
					dueDateProperty: config?.dueDateProperty,
					descriptionProperty: config?.descriptionProperty,
				});
			default:
				if (this.composioFallback?.canHandle(context.spec.meta.key)) {
					return this.composioFallback.createProjectManagementProxy(context);
				}
				throw new Error(
					`Unsupported project management integration: ${context.spec.meta.key}`
				);
		}
	}

	async createMeetingRecorderProvider(
		context: IntegrationContext
	): Promise<MeetingRecorderProvider> {
		const secrets = await this.loadSecrets(context);
		const config = context.config as {
			baseUrl?: string;
			pageSize?: number;
			transport?: 'api' | 'mcp';
			mcpUrl?: string;
			mcpHeaders?: Record<string, string>;
			transcriptsPageSize?: number;
			includeTranscript?: boolean;
			includeSummary?: boolean;
			includeActionItems?: boolean;
			includeCrmMatches?: boolean;
			triggeredFor?: string[];
			maxPages?: number;
		};

		switch (context.spec.meta.key) {
			case 'meeting-recorder.granola':
				if (config?.transport === 'mcp') {
					return new GranolaMeetingRecorderProvider({
						transport: 'mcp',
						mcpUrl: config?.mcpUrl,
						mcpHeaders: config?.mcpHeaders,
						mcpAccessToken:
							(secrets.mcpAccessToken as string | undefined) ??
							(secrets.apiKey as string | undefined),
						pageSize: config?.pageSize,
					});
				}
				return new GranolaMeetingRecorderProvider({
					apiKey: requireSecret<string>(
						secrets,
						'apiKey',
						'Granola API key is required'
					),
					baseUrl: config?.baseUrl,
					pageSize: config?.pageSize,
				});
			case 'meeting-recorder.tldv':
				return new TldvMeetingRecorderProvider({
					apiKey: requireSecret<string>(
						secrets,
						'apiKey',
						'tl;dv API key is required'
					),
					baseUrl: config?.baseUrl,
					pageSize: config?.pageSize,
				});
			case 'meeting-recorder.fireflies':
				return new FirefliesMeetingRecorderProvider({
					apiKey: requireSecret<string>(
						secrets,
						'apiKey',
						'Fireflies API key is required'
					),
					baseUrl: config?.baseUrl,
					pageSize: config?.transcriptsPageSize ?? config?.pageSize,
					webhookSecret: secrets.webhookSecret as string | undefined,
				});
			case 'meeting-recorder.fathom':
				return new FathomMeetingRecorderProvider({
					apiKey: requireSecret<string>(
						secrets,
						'apiKey',
						'Fathom API key is required'
					),
					baseUrl: config?.baseUrl,
					includeTranscript: config?.includeTranscript,
					includeSummary: config?.includeSummary,
					includeActionItems: config?.includeActionItems,
					includeCrmMatches: config?.includeCrmMatches,
					triggeredFor: config?.triggeredFor,
					maxPages: config?.maxPages,
					webhookSecret: secrets.webhookSecret as string | undefined,
				});
			default:
				if (this.composioFallback?.canHandle(context.spec.meta.key)) {
					return this.composioFallback.createGenericProxy(
						context
					) as unknown as MeetingRecorderProvider;
				}
				throw new Error(
					`Unsupported meeting recorder integration: ${context.spec.meta.key}`
				);
		}
	}

	async createLlmProvider(context: IntegrationContext): Promise<LLMProvider> {
		const secrets = await this.loadSecrets(context);
		switch (context.spec.meta.key) {
			case 'ai-llm.mistral':
				return new MistralLLMProvider({
					apiKey: requireSecret<string>(
						secrets,
						'apiKey',
						'Mistral API key is required'
					),
					defaultModel: (context.config as { model?: string }).model,
				});
			default:
				if (this.composioFallback?.canHandle(context.spec.meta.key)) {
					return this.composioFallback.createGenericProxy(
						context
					) as unknown as LLMProvider;
				}
				throw new Error(
					`Unsupported LLM integration: ${context.spec.meta.key}`
				);
		}
	}

	async createEmbeddingProvider(
		context: IntegrationContext
	): Promise<EmbeddingProvider> {
		const secrets = await this.loadSecrets(context);
		switch (context.spec.meta.key) {
			case 'ai-llm.mistral':
				return new MistralEmbeddingProvider({
					apiKey: requireSecret<string>(
						secrets,
						'apiKey',
						'Mistral API key is required'
					),
					defaultModel: (context.config as { embeddingModel?: string })
						.embeddingModel,
				});
			default:
				if (this.composioFallback?.canHandle(context.spec.meta.key)) {
					return this.composioFallback.createGenericProxy(
						context
					) as unknown as EmbeddingProvider;
				}
				throw new Error(
					`Unsupported embeddings integration: ${context.spec.meta.key}`
				);
		}
	}

	async createOpenBankingProvider(
		context: IntegrationContext
	): Promise<OpenBankingProvider> {
		const secrets = await this.loadSecrets(context);
		const config = context.config as {
			environment?: string;
			baseUrl?: string;
			region?: string;
			pollingIntervalMs?: number;
		};

		switch (context.spec.meta.key) {
			case 'openbanking.powens': {
				const environmentValue = requireConfig<string>(
					context,
					'environment',
					'Powens environment (sandbox | production) must be specified in integration config.'
				);
				if (
					environmentValue !== 'sandbox' &&
					environmentValue !== 'production'
				) {
					throw new Error(
						`Powens environment "${environmentValue}" is invalid. Expected "sandbox" or "production".`
					);
				}

				return new PowensOpenBankingProvider({
					clientId: requireSecret<string>(
						secrets,
						'clientId',
						'Powens clientId is required'
					),
					clientSecret: requireSecret<string>(
						secrets,
						'clientSecret',
						'Powens clientSecret is required'
					),
					apiKey: secrets.apiKey as string | undefined,
					environment: environmentValue as PowensEnvironment,
					baseUrl: config?.baseUrl as string | undefined,
				});
			}
			default:
				if (this.composioFallback?.canHandle(context.spec.meta.key)) {
					return this.composioFallback.createGenericProxy(
						context
					) as unknown as OpenBankingProvider;
				}
				throw new Error(
					`Unsupported open banking integration: ${context.spec.meta.key}`
				);
		}
	}

	async createHealthProvider(
		context: IntegrationContext
	): Promise<HealthProvider> {
		const secrets = await this.loadSecrets(context);
		return createHealthProviderFromContext(context, secrets);
	}

	private async loadSecrets(
		context: IntegrationContext
	): Promise<Record<string, unknown>> {
		const cacheKey = context.connection.meta.id;
		if (SECRET_CACHE.has(cacheKey)) {
			const cached = SECRET_CACHE.get(cacheKey);
			return cached ?? {};
		}
		const secret = await context.secretProvider.getSecret(
			context.secretReference
		);
		const value = parseSecret(secret);
		SECRET_CACHE.set(cacheKey, value);
		return value;
	}
}

function parseSecret(secret: SecretValue): Record<string, unknown> {
	const text = Buffer.from(secret.data).toString('utf-8').trim();
	if (!text) return {};
	try {
		return JSON.parse(text);
	} catch {
		return { apiKey: text };
	}
}

function requireSecret<T>(
	secrets: Record<string, unknown>,
	key: string,
	message: string
): T {
	const value = secrets[key];
	if (value == null || value === '') {
		throw new Error(message);
	}
	return value as T;
}

function requireDatabaseUrl(
	secrets: Record<string, unknown>,
	message: string
): string {
	const value =
		secrets.databaseUrl ??
		secrets.connectionString ??
		secrets.postgresUrl ??
		secrets.apiKey;
	if (typeof value !== 'string' || value.trim().length === 0) {
		throw new Error(message);
	}
	return value;
}

function requireConfig<T>(
	context: IntegrationContext,
	key: string,
	message: string
): T {
	const config = context.config as Record<string, unknown>;
	const value = config?.[key];
	if (value == null) {
		throw new Error(message);
	}
	return value as T;
}

function createGmailAuth(secrets: Record<string, unknown>) {
	const clientId = requireSecret<string>(
		secrets,
		'clientId',
		'Gmail clientId is required'
	);
	const clientSecret = requireSecret<string>(
		secrets,
		'clientSecret',
		'Gmail clientSecret is required'
	);
	const refreshToken = requireSecret<string>(
		secrets,
		'refreshToken',
		'Gmail refreshToken is required'
	);
	const redirectUri =
		typeof secrets.redirectUri === 'string'
			? secrets.redirectUri
			: 'https://developers.google.com/oauthplayground';

	const oauth = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
	oauth.setCredentials({ refresh_token: refreshToken });
	return oauth;
}
