import { describe, expect, it } from 'bun:test';

import type {
  IntegrationConnection,
  IntegrationSpec,
} from '@contractspec/lib.contracts-integrations';
import type { IntegrationContext } from '@contractspec/integration.runtime/runtime';
import type {
  SecretProvider,
  SecretValue,
} from '@contractspec/integration.runtime/secrets/provider';
import { IntegrationProviderFactory } from './provider-factory';
import { StripePaymentsProvider } from './stripe-payments';
import { PostmarkEmailProvider } from './postmark-email';
import { TwilioSmsProvider } from './twilio-sms';
import { QdrantVectorProvider } from './qdrant-vector';
import { SupabaseVectorProvider } from './supabase-vector';
import { SupabasePostgresProvider } from './supabase-psql';
import { GoogleCloudStorageProvider } from './gcs-storage';
import { ElevenLabsVoiceProvider } from './elevenlabs-voice';
import { GradiumVoiceProvider } from './gradium-voice';
import { FalVoiceProvider } from './fal-voice';
import { MistralLLMProvider } from './mistral-llm';
import { MistralEmbeddingProvider } from './mistral-embedding';
import { PowensOpenBankingProvider } from './powens-openbanking';
import { LinearProjectManagementProvider } from './linear';
import { JiraProjectManagementProvider } from './jira';
import { NotionProjectManagementProvider } from './notion';
import { GranolaMeetingRecorderProvider } from './granola-meeting-recorder';
import { TldvMeetingRecorderProvider } from './tldv-meeting-recorder';
import { FirefliesMeetingRecorderProvider } from './fireflies-meeting-recorder';
import { FathomMeetingRecorderProvider } from './fathom-meeting-recorder';
import { PosthogAnalyticsProvider } from './posthog';
import {
  OpenWearablesHealthProvider,
  UnofficialHealthAutomationProvider,
  WhoopHealthProvider,
} from './health/providers';

describe('IntegrationProviderFactory', () => {
  const factory = new IntegrationProviderFactory();

  it('creates Stripe payments provider', async () => {
    const provider = await factory.createPaymentsProvider(
      buildContext({
        key: 'payments.stripe',
        secret: { apiKey: 'sk_test_123' },
      })
    );
    expect(provider).toBeInstanceOf(StripePaymentsProvider);
  });

  it('creates Postmark email provider', async () => {
    const provider = await factory.createEmailOutboundProvider(
      buildContext({
        key: 'email.postmark',
        config: { fromEmail: 'noreply@example.com' },
        secret: { serverToken: 'server-key' },
      })
    );
    expect(provider).toBeInstanceOf(PostmarkEmailProvider);
  });

  it('creates Twilio sms provider', async () => {
    const provider = await factory.createSmsProvider(
      buildContext({
        key: 'sms.twilio',
        secret: { accountSid: 'AC123', authToken: 'token' },
      })
    );
    expect(provider).toBeInstanceOf(TwilioSmsProvider);
  });

  it('creates Qdrant vector store provider', async () => {
    const provider = await factory.createVectorStoreProvider(
      buildContext({
        key: 'vectordb.qdrant',
        config: { apiUrl: 'https://example.com' },
        secret: { apiKey: 'qdrant-key' },
      })
    );
    expect(provider).toBeInstanceOf(QdrantVectorProvider);
  });

  it('creates Supabase vector store provider', async () => {
    const provider = await factory.createVectorStoreProvider(
      buildContext({
        key: 'vectordb.supabase',
        config: { schema: 'public', table: 'tenant_vectors' },
        secret: {
          databaseUrl: 'postgresql://postgres:postgres@localhost:5432/postgres',
        },
      })
    );
    expect(provider).toBeInstanceOf(SupabaseVectorProvider);
  });

  it('creates Supabase Postgres database provider', async () => {
    const provider = await factory.createDatabaseProvider(
      buildContext({
        key: 'database.supabase',
        config: { maxConnections: 5, sslMode: 'require' },
        secret: {
          databaseUrl: 'postgresql://postgres:postgres@localhost:5432/postgres',
        },
      })
    );
    expect(provider).toBeInstanceOf(SupabasePostgresProvider);
  });

  it('creates PostHog analytics provider', async () => {
    const provider = await factory.createAnalyticsProvider(
      buildContext({
        key: 'analytics.posthog',
        config: { host: 'https://app.posthog.com', projectId: '123' },
        secret: {
          personalApiKey: 'phx_personal',
          projectApiKey: 'phc_project',
        },
      })
    );
    expect(provider).toBeInstanceOf(PosthogAnalyticsProvider);
  });

  it('creates Google Cloud storage provider', async () => {
    const provider = await factory.createObjectStorageProvider(
      buildContext({
        key: 'storage.gcs',
        config: { bucket: 'test-bucket' },
        secret: { type: 'service_account' },
      })
    );
    expect(provider).toBeInstanceOf(GoogleCloudStorageProvider);
  });

  it('creates ElevenLabs voice provider', async () => {
    const provider = await factory.createVoiceProvider(
      buildContext({
        key: 'ai-voice.elevenlabs',
        secret: { apiKey: 'eleven-key' },
      })
    );
    expect(provider).toBeInstanceOf(ElevenLabsVoiceProvider);
  });

  it('creates Gradium voice provider', async () => {
    const provider = await factory.createVoiceProvider(
      buildContext({
        key: 'ai-voice.gradium',
        config: { defaultVoiceId: 'voice-1', region: 'eu' },
        secret: { apiKey: 'gd-key' },
      })
    );
    expect(provider).toBeInstanceOf(GradiumVoiceProvider);
  });

  it('creates Fal voice provider', async () => {
    const provider = await factory.createVoiceProvider(
      buildContext({
        key: 'ai-voice.fal',
        config: { modelId: 'fal-ai/chatterbox/text-to-speech' },
        secret: { apiKey: 'fal-key' },
      })
    );
    expect(provider).toBeInstanceOf(FalVoiceProvider);
  });

  it('creates Mistral LLM and embedding providers', async () => {
    const context = buildContext({
      key: 'ai-llm.mistral',
      secret: { apiKey: 'mistral-key' },
    });
    const llm = await factory.createLlmProvider(context);
    const embedding = await factory.createEmbeddingProvider(context);
    expect(llm).toBeInstanceOf(MistralLLMProvider);
    expect(embedding).toBeInstanceOf(MistralEmbeddingProvider);
  });

  it('creates Powens open banking provider', async () => {
    const provider = await factory.createOpenBankingProvider(
      buildContext({
        key: 'openbanking.powens',
        config: { environment: 'sandbox' },
        secret: { clientId: 'client', clientSecret: 'secret' },
      })
    );
    expect(provider).toBeInstanceOf(PowensOpenBankingProvider);
  });

  it('creates Linear project management provider', async () => {
    const provider = await factory.createProjectManagementProvider(
      buildContext({
        key: 'project-management.linear',
        config: { teamId: 'team-1' },
        secret: { apiKey: 'linear-key' },
      })
    );
    expect(provider).toBeInstanceOf(LinearProjectManagementProvider);
  });

  it('creates Jira project management provider', async () => {
    const provider = await factory.createProjectManagementProvider(
      buildContext({
        key: 'project-management.jira',
        config: { siteUrl: 'https://acme.atlassian.net', projectKey: 'PM' },
        secret: { email: 'user@acme.com', apiToken: 'token' },
      })
    );
    expect(provider).toBeInstanceOf(JiraProjectManagementProvider);
  });

  it('creates Notion project management provider', async () => {
    const provider = await factory.createProjectManagementProvider(
      buildContext({
        key: 'project-management.notion',
        config: { databaseId: 'db-1' },
        secret: { apiKey: 'notion-key' },
      })
    );
    expect(provider).toBeInstanceOf(NotionProjectManagementProvider);
  });

  it('creates Granola meeting recorder provider', async () => {
    const provider = await factory.createMeetingRecorderProvider(
      buildContext({
        key: 'meeting-recorder.granola',
        config: { pageSize: 10 },
        secret: { apiKey: 'granola-key' },
      })
    );
    expect(provider).toBeInstanceOf(GranolaMeetingRecorderProvider);
  });

  it('creates Granola MCP meeting recorder provider', async () => {
    const provider = await factory.createMeetingRecorderProvider(
      buildContext({
        key: 'meeting-recorder.granola',
        config: { transport: 'mcp', mcpUrl: 'https://mcp.granola.ai/mcp' },
        secret: { mcpAccessToken: 'granola-mcp-token' },
      })
    );
    expect(provider).toBeInstanceOf(GranolaMeetingRecorderProvider);
  });

  it('creates tl;dv meeting recorder provider', async () => {
    const provider = await factory.createMeetingRecorderProvider(
      buildContext({
        key: 'meeting-recorder.tldv',
        config: { pageSize: 25 },
        secret: { apiKey: 'tldv-key', webhookSecret: 'tldv-secret' },
      })
    );
    expect(provider).toBeInstanceOf(TldvMeetingRecorderProvider);
  });

  it('creates Fireflies meeting recorder provider', async () => {
    const provider = await factory.createMeetingRecorderProvider(
      buildContext({
        key: 'meeting-recorder.fireflies',
        config: { transcriptsPageSize: 15 },
        secret: { apiKey: 'fireflies-key', webhookSecret: 'ff-secret' },
      })
    );
    expect(provider).toBeInstanceOf(FirefliesMeetingRecorderProvider);
  });

  it('creates Fathom meeting recorder provider', async () => {
    const provider = await factory.createMeetingRecorderProvider(
      buildContext({
        key: 'meeting-recorder.fathom',
        config: { includeTranscript: true },
        secret: { apiKey: 'fathom-key', webhookSecret: 'fathom-secret' },
      })
    );
    expect(provider).toBeInstanceOf(FathomMeetingRecorderProvider);
  });

  it('creates Whoop health provider with official transport', async () => {
    const provider = await factory.createHealthProvider(
      buildContext({
        key: 'health.whoop',
        secret: { accessToken: 'whoop-token' },
      })
    );
    expect(provider).toBeInstanceOf(WhoopHealthProvider);
  });

  it('creates OpenWearables health provider when configured as aggregator', async () => {
    const provider = await factory.createHealthProvider(
      buildContext({
        key: 'health.strava',
        config: {
          defaultTransport: 'aggregator-api',
          strategyOrder: ['aggregator-api', 'official-api'],
        },
        secret: { apiKey: 'ow-key' },
      })
    );
    expect(provider).toBeInstanceOf(OpenWearablesHealthProvider);
  });

  it('creates unofficial health provider only when allow-listed', async () => {
    const provider = await factory.createHealthProvider(
      buildContext({
        key: 'health.peloton',
        config: {
          defaultTransport: 'unofficial',
          strategyOrder: ['unofficial', 'aggregator-api'],
          allowUnofficial: true,
          unofficialAllowList: ['health.peloton'],
        },
        secret: { apiKey: 'peloton-cookie' },
      })
    );
    expect(provider).toBeInstanceOf(UnofficialHealthAutomationProvider);
  });

  it('falls back to aggregator when unofficial transport is blocked', async () => {
    const provider = await factory.createHealthProvider(
      buildContext({
        key: 'health.peloton',
        config: {
          defaultTransport: 'unofficial',
          strategyOrder: ['unofficial', 'aggregator-api'],
          allowUnofficial: false,
        },
        secret: { apiKey: 'ow-key' },
      })
    );
    expect(provider).toBeInstanceOf(OpenWearablesHealthProvider);
  });
});

function buildContext({
  key,
  config = {},
  secret = {},
}: {
  key: string;
  config?: Record<string, unknown>;
  secret?: Record<string, unknown>;
}): IntegrationContext {
  const spec: IntegrationSpec = {
    meta: {
      key,
      version: '1.0.0',
      category: key.startsWith('openbanking.')
        ? ('open-banking' as IntegrationSpec['meta']['category'])
        : (key.split('.')[0] as IntegrationSpec['meta']['category']),
      title: key,
      description: `${key} provider`,
      domain: 'test',
      owners: ['test.owner'],
      tags: ['test'],
      stability: 'experimental',
    },
    supportedModes: ['managed'],
    capabilities: { provides: [] },
    configSchema: { schema: {} },
    secretSchema: { schema: {} },
  };
  const connection: IntegrationConnection = {
    meta: {
      id: `conn-${key}`,
      tenantId: 'tenant',
      integrationKey: key,
      integrationVersion: '1.0.0',
      label: key,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    ownershipMode: 'managed',
    config,
    secretProvider: 'gcp',
    secretRef: 'mock://secret',
    status: 'connected',
  };
  const secretProvider: SecretProvider = {
    id: 'mock',
    canHandle: () => true,
    getSecret: async () =>
      ({
        data: Buffer.from(JSON.stringify(secret)),
        retrievedAt: new Date(),
      }) as SecretValue,
    setSecret: async () => ({
      reference: 'mock://secret',
      version: '1',
    }),
    rotateSecret: async () => ({
      reference: 'mock://secret',
      version: '2',
    }),
    deleteSecret: async () => undefined,
  };

  return {
    tenantId: 'tenant',
    appId: 'app',
    spec,
    connection,
    config,
    secretProvider,
    secretReference: 'mock://secret',
    trace: {
      blueprintName: 'blueprint',
      blueprintVersion: 1,
      configVersion: 1,
    },
  };
}
