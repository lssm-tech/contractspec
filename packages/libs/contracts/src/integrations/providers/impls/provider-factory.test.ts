import { describe, expect, it } from 'bun:test';

import type { IntegrationConnection } from '../../connection';
import type { IntegrationSpec } from '../../spec';
import type { IntegrationContext } from '../../runtime';
import type { SecretProvider, SecretValue } from '../../secrets/provider';
import { IntegrationProviderFactory } from './provider-factory';
import { StripePaymentsProvider } from './stripe-payments';
import { PostmarkEmailProvider } from './postmark-email';
import { TwilioSmsProvider } from './twilio-sms';
import { QdrantVectorProvider } from './qdrant-vector';
import { GoogleCloudStorageProvider } from './gcs-storage';
import { ElevenLabsVoiceProvider } from './elevenlabs-voice';
import { MistralLLMProvider } from './mistral-llm';
import { MistralEmbeddingProvider } from './mistral-embedding';
import { PowensOpenBankingProvider } from './powens-openbanking';

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
        config: { apiUrl: 'https://example.com', checkCompatibility: false },
        secret: { apiKey: 'qdrant-key' },
      })
    );
    expect(provider).toBeInstanceOf(QdrantVectorProvider);
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
      category: (key.startsWith('openbanking.')
        ? 'open-banking'
        : key.split('.')[0]) as any, // eslint-disable-line @typescript-eslint/no-explicit-any
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
    deleteSecret: async () => {
      /* noop */
    },
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
      blueprintVersion: '1.0.0',
      configVersion: '1.0.0',
    },
  };
}
