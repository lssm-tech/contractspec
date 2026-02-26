import { Buffer } from 'node:buffer';

import type { IntegrationContext } from '@contractspec/integration.runtime/runtime';
import type { SecretValue } from '@contractspec/integration.runtime/secrets/provider';
import { MistralLLMProvider } from './mistral-llm';
import { MistralEmbeddingProvider } from './mistral-embedding';
import { QdrantVectorProvider } from './qdrant-vector';
import { SupabaseVectorProvider } from './supabase-vector';
import { SupabasePostgresProvider } from './supabase-psql';
import { GoogleCloudStorageProvider } from './gcs-storage';
import { StripePaymentsProvider } from './stripe-payments';
import { PostmarkEmailProvider } from './postmark-email';
import { TwilioSmsProvider } from './twilio-sms';
import { SlackMessagingProvider } from './messaging-slack';
import { GithubMessagingProvider } from './messaging-github';
import { MetaWhatsappMessagingProvider } from './messaging-whatsapp-meta';
import { TwilioWhatsappMessagingProvider } from './messaging-whatsapp-twilio';
import { ElevenLabsVoiceProvider } from './elevenlabs-voice';
import { GradiumVoiceProvider } from './gradium-voice';
import { FalVoiceProvider } from './fal-voice';
import { LinearProjectManagementProvider } from './linear';
import { JiraProjectManagementProvider } from './jira';
import { NotionProjectManagementProvider } from './notion';
import { GranolaMeetingRecorderProvider } from './granola-meeting-recorder';
import { TldvMeetingRecorderProvider } from './tldv-meeting-recorder';
import { FirefliesMeetingRecorderProvider } from './fireflies-meeting-recorder';
import { FathomMeetingRecorderProvider } from './fathom-meeting-recorder';
import { PosthogAnalyticsProvider } from './posthog';
import type { PaymentsProvider } from '../payments';
import type { EmailOutboundProvider } from '../email';
import type { SmsProvider } from '../sms';
import type { MessagingProvider } from '../messaging';
import type { VectorStoreProvider } from '../vector-store';
import type { AnalyticsProvider } from '../analytics';
import type { DatabaseProvider } from '../database';
import type { ObjectStorageProvider } from '../storage';
import type { TTSProvider } from '../voice';
import type { LLMProvider } from '../llm';
import type { EmbeddingProvider } from '../embedding';
import type { OpenBankingProvider } from '../openbanking';
import type { ProjectManagementProvider } from '../project-management';
import type { MeetingRecorderProvider } from '../meeting-recorder';
import type { HealthProvider } from '../health';
import { PowensOpenBankingProvider } from './powens-openbanking';
import type { PowensEnvironment } from './powens-client';
import { createHealthProviderFromContext } from './health-provider-factory';

const SECRET_CACHE = new Map<string, Record<string, unknown>>();

export class IntegrationProviderFactory {
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
        throw new Error(
          `Unsupported email integration: ${context.spec.meta.key}`
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
        throw new Error(
          `Unsupported voice integration: ${context.spec.meta.key}`
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
