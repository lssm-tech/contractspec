import { describe, expect, it } from 'bun:test';

import type { IntegrationConnection } from '@lssm/lib.contracts/integrations/connection';
import type { IntegrationSpec } from '@lssm/lib.contracts/integrations/spec';
import type { IntegrationContext } from '@lssm/integration.runtime/runtime';
import type {
  SecretProvider,
  SecretValue,
} from '@lssm/integration.runtime/secrets/provider';
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
        config: { apiUrl: 'https://example.com' },
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
      version: 1,
      category: key.startsWith('openbanking.')
        ? ('open-banking' as string)
        : (key.split('.')[0] as string),
      displayName: key,
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
      integrationVersion: 1,
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
