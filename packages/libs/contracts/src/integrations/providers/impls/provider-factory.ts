import { Buffer } from 'node:buffer';

import type { IntegrationContext } from '../../runtime';
import type { SecretValue } from '../../secrets/provider';
import { MistralLLMProvider } from './mistral-llm';
import { MistralEmbeddingProvider } from './mistral-embedding';
import { QdrantVectorProvider } from './qdrant-vector';
import { GoogleCloudStorageProvider } from './gcs-storage';
import { StripePaymentsProvider } from './stripe-payments';
import { PostmarkEmailProvider } from './postmark-email';
import { TwilioSmsProvider } from './twilio-sms';
import { ElevenLabsVoiceProvider } from './elevenlabs-voice';
import { LinearProjectManagementProvider } from './linear';
import { JiraProjectManagementProvider } from './jira';
import { NotionProjectManagementProvider } from './notion';
import type { PaymentsProvider } from '../payments';
import type { EmailOutboundProvider } from '../email';
import type { SmsProvider } from '../sms';
import type { VectorStoreProvider } from '../vector-store';
import type { ObjectStorageProvider } from '../storage';
import type { VoiceProvider } from '../voice';
import type { LLMProvider } from '../llm';
import type { EmbeddingProvider } from '../embedding';
import type { OpenBankingProvider } from '../openbanking';
import type { ProjectManagementProvider } from '../project-management';
import { PowensOpenBankingProvider } from './powens-openbanking';
import type { PowensEnvironment } from './powens-client';

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

  async createVectorStoreProvider(
    context: IntegrationContext
  ): Promise<VectorStoreProvider> {
    const secrets = await this.loadSecrets(context);
    switch (context.spec.meta.key) {
      case 'vectordb.qdrant':
        return new QdrantVectorProvider({
          url: requireConfig<string>(
            context,
            'apiUrl',
            'Qdrant apiUrl config is required'
          ),
          apiKey: secrets.apiKey as string | undefined,
          clientParams: context.config as Record<string, unknown>,
        });
      default:
        throw new Error(
          `Unsupported vector store integration: ${context.spec.meta.key}`
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
              ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                { credentials: secrets as any }
              : undefined,
        });
      default:
        throw new Error(
          `Unsupported storage integration: ${context.spec.meta.key}`
        );
    }
  }

  async createVoiceProvider(
    context: IntegrationContext
  ): Promise<VoiceProvider> {
    const secrets = await this.loadSecrets(context);
    switch (context.spec.meta.key) {
      case 'ai-voice.elevenlabs':
        return new ElevenLabsVoiceProvider({
          apiKey: requireSecret<string>(
            secrets,
            'apiKey',
            'ElevenLabs API key is required'
          ),
          defaultVoiceId: (context.config as { defaultVoiceId?: string })
            .defaultVoiceId,
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

  private async loadSecrets(
    context: IntegrationContext
  ): Promise<Record<string, unknown>> {
    const cacheKey = context.connection.meta.id;
    if (SECRET_CACHE.has(cacheKey)) {
      const cached = SECRET_CACHE.get(cacheKey);
      if (cached) return cached;
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
