import { Buffer } from 'node:buffer';
import { gqlSchemaBuilder } from '../builder';
import { requireAuth } from '../types';
import {
  prisma as studioDb,
  IntegrationProvider,
  KnowledgeSourceType,
  type StudioIntegration,
  type KnowledgeSource,
} from '@lssm/lib.database-contractspec-studio';
import { StudioIntegrationModule } from '../../../modules/integrations';
import { StudioKnowledgeModule } from '../../../modules/knowledge';
import type {
  EmbeddingDocument,
  EmbeddingProvider,
  EmbeddingResult,
  LLMMessage,
  LLMProvider,
  LLMResponse,
  LLMStreamChunk,
  LLMChatOptions,
  TokenCountResult,
  VectorDocument,
  VectorStoreProvider,
  VectorSearchResult,
} from '@lssm/lib.contracts';
import { requireFeatureFlag } from '../guards/feature-flags';
import { ContractSpecFeatureFlags } from '@lssm/lib.progressive-delivery';
import { ensureStudioProjectAccess } from '../guards/project-access';

const VECTOR_DIMENSIONS = 12;

function encodeText(text: string): number[] {
  const vector = new Array<number>(VECTOR_DIMENSIONS).fill(0);
  for (let i = 0; i < text.length; i += 1) {
    const charCode = text.charCodeAt(i);
    const index = i % VECTOR_DIMENSIONS;
    vector[index] = (vector[index] ?? 0) + charCode / 255;
  }
  return vector;
}

function cosineSimilarity(a: number[], b?: number[]): number {
  if (!b || a.length === 0 || b.length === 0) return 0;
  let dot = 0;
  let aNorm = 0;
  let bNorm = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i]! * (b[i] ?? 0);
    aNorm += a[i]! * a[i]!;
    bNorm += (b[i] ?? 0) * (b[i] ?? 0);
  }
  if (!aNorm || !bNorm) return 0;
  return dot / (Math.sqrt(aNorm) * Math.sqrt(bNorm));
}

const debugGraphQL = process.env.CONTRACTSPEC_DEBUG_GRAPHQL_BUILDER === 'true';

if (debugGraphQL) {
  console.log('[graphql-integrations] module loaded');
}

class LocalEmbeddingProvider implements EmbeddingProvider {
  async embedDocuments(
    documents: EmbeddingDocument[]
  ): Promise<EmbeddingResult[]> {
    return documents.map((doc) => ({
      id: doc.id,
      vector: encodeText(doc.text),
      dimensions: VECTOR_DIMENSIONS,
      model: 'local-embedding',
    }));
  }

  async embedQuery(query: string): Promise<EmbeddingResult> {
    return {
      id: 'query',
      vector: encodeText(query),
      dimensions: VECTOR_DIMENSIONS,
      model: 'local-embedding',
    };
  }
}

class InMemoryVectorStore implements VectorStoreProvider {
  private readonly collections = new Map<string, VectorDocument[]>();

  async upsert(request: { collection: string; documents: VectorDocument[] }) {
    const docs = this.collections.get(request.collection) ?? [];
    request.documents.forEach((doc) => {
      const existingIndex = docs.findIndex((item) => item.id === doc.id);
      if (existingIndex >= 0) {
        docs[existingIndex] = doc;
      } else {
        docs.push(doc);
      }
    });
    this.collections.set(request.collection, docs);
  }

  async search(query: {
    collection: string;
    vector: number[];
    topK: number;
  }): Promise<VectorSearchResult[]> {
    const docs = this.collections.get(query.collection) ?? [];
    const scored = docs.map((doc) => ({
      id: doc.id,
      score: cosineSimilarity(query.vector, doc.vector),
      payload: doc.payload,
      vector: doc.vector,
    }));
    return scored.sort((a, b) => b.score - a.score).slice(0, query.topK);
  }

  async delete(request: { collection: string; ids: string[] }) {
    const docs = this.collections.get(request.collection) ?? [];
    this.collections.set(
      request.collection,
      docs.filter((doc) => !request.ids.includes(doc.id))
    );
  }
}

class EchoLLMProvider implements LLMProvider {
  async chat(
    messages: LLMMessage[],
    options?: LLMChatOptions
  ): Promise<LLMResponse> {
    const last = messages[messages.length - 1];
    const prompt = last?.content
      .map((part) => ('text' in part ? part.text : ''))
      .join('\n');
    return {
      message: {
        role: 'assistant',
        content: [
          {
            type: 'text',
            text: `Based on available knowledge, here is a concise answer:\n${prompt}`,
          },
        ],
      },
      usage: {
        promptTokens: prompt?.length ?? 0,
        completionTokens: 32,
        totalTokens: (prompt?.length ?? 0) + 32,
      },
    };
  }

  async *stream(
    messages: LLMMessage[],
    options?: LLMChatOptions
  ): AsyncIterable<LLMStreamChunk> {
    const response = await this.chat(messages, options);
    yield { type: 'end', response };
  }

  async countTokens(messages: LLMMessage[]): Promise<TokenCountResult> {
    const total = messages
      .map((msg) =>
        msg.content
          .map((part) => ('text' in part ? part.text.length : 0))
          .reduce((acc, value) => acc + value, 0)
      )
      .reduce((acc, value) => acc + value, 0);
    return { promptTokens: total };
  }
}

const integrationModule = new StudioIntegrationModule();
const knowledgeModule = new StudioKnowledgeModule({
  embeddings: new LocalEmbeddingProvider(),
  vectorStore: new InMemoryVectorStore(),
  llm: new EchoLLMProvider(),
  defaultCollection: 'studio-knowledge',
});

export function registerIntegrationsSchema(builder: typeof gqlSchemaBuilder) {
  if (debugGraphQL) {
    console.log('[graphql-integrations] registering schema');
  }
  const IntegrationProviderEnum = builder.enumType('IntegrationProviderEnum', {
    values: Object.values(IntegrationProvider),
  });
  const KnowledgeSourceTypeEnum = builder.enumType('KnowledgeSourceTypeEnum', {
    values: Object.values(KnowledgeSourceType),
  });

  const StudioIntegrationType = builder
    .objectRef<StudioIntegration>('StudioIntegration')
    .implement({
      fields: (t) => ({
        id: t.exposeID('id'),
        organizationId: t.exposeString('organizationId'),
        projectId: t.exposeString('projectId', { nullable: true }),
        provider: t.field({
          type: IntegrationProviderEnum,
          resolve: (integration) => integration.provider,
        }),
        name: t.exposeString('name'),
        enabled: t.exposeBoolean('enabled'),
        usageCount: t.exposeInt('usageCount'),
        lastUsed: t.field({
          type: 'Date',
          nullable: true,
          resolve: (integration) => integration.lastUsed ?? null,
        }),
        config: t.field({
          type: 'JSON',
          nullable: true,
          resolve: (integration) => integration.config ?? null,
        }),
        createdAt: t.field({
          type: 'Date',
          resolve: (integration) => integration.createdAt,
        }),
      }),
    });

  const KnowledgeSourceGraphType = builder
    .objectRef<KnowledgeSource>('KnowledgeSourceRecord')
    .implement({
      fields: (t) => ({
        id: t.exposeID('id'),
        organizationId: t.exposeString('organizationId'),
        projectId: t.exposeString('projectId', { nullable: true }),
        type: t.field({
          type: KnowledgeSourceTypeEnum,
          resolve: (source) => source.type,
        }),
        name: t.exposeString('name'),
        url: t.exposeString('url', { nullable: true }),
        content: t.field({
          type: 'JSON',
          nullable: true,
          resolve: (source) => source.content ?? null,
        }),
        indexed: t.exposeBoolean('indexed'),
        lastIndexed: t.field({
          type: 'Date',
          nullable: true,
          resolve: (source) => source.lastIndexed ?? null,
        }),
        createdAt: t.field({
          type: 'Date',
          resolve: (source) => source.createdAt,
        }),
      }),
    });

  const SyncResultType = builder
    .objectRef<{
      integrationId: string;
      status: string;
      syncedAt: Date;
      usageCount: number;
    }>('IntegrationSyncResult')
    .implement({
      fields: (t) => ({
        integrationId: t.exposeString('integrationId'),
        status: t.exposeString('status'),
        syncedAt: t.field({
          type: 'Date',
          resolve: (result) => result.syncedAt,
        }),
        usageCount: t.exposeInt('usageCount'),
      }),
    });

  const KnowledgeAnswerType = builder
    .objectRef<{
      answer: string;
      references: VectorSearchResult[];
      usage?: LLMResponse['usage'];
    }>('KnowledgeAnswer')
    .implement({
      fields: (t) => ({
        answer: t.exposeString('answer'),
        references: t.field({
          type: 'JSON',
          resolve: (answer) => answer.references,
        }),
        usage: t.field({
          type: 'JSON',
          nullable: true,
          resolve: (answer) => answer.usage ?? null,
        }),
      }),
    });

  const KnowledgeDocumentInput = builder.inputType('KnowledgeDocumentInput', {
    fields: (t) => ({
      id: t.string({ required: true }),
      text: t.string({ required: true }),
      mimeType: t.string(),
      metadata: t.field({ type: 'JSON' }),
    }),
  });

  const ConnectIntegrationInput = builder.inputType('ConnectIntegrationInput', {
    fields: (t) => ({
      provider: t.field({
        type: IntegrationProviderEnum,
        required: true,
      }),
      ownershipMode: t.string(),
      secretProvider: t.string(),
      secretRef: t.string(),
      credentials: t.field({ type: 'JSON', required: false }),
      projectId: t.string(),
      name: t.string(),
      config: t.field({ type: 'JSON' }),
    }),
  });

  const IndexKnowledgeInput = builder.inputType('IndexKnowledgeInput', {
    fields: (t) => ({
      projectId: t.string(),
      type: t.field({ type: KnowledgeSourceTypeEnum, required: true }),
      name: t.string({ required: true }),
      documents: t.field({
        type: [KnowledgeDocumentInput],
        required: true,
      }),
      namespace: t.string(),
      collection: t.string(),
      metadata: t.field({ type: 'JSON' }),
    }),
  });

  const QueryKnowledgeInput = builder.inputType('QueryKnowledgeInput', {
    fields: (t) => ({
      query: t.string({ required: true }),
      projectId: t.string(),
      collection: t.string(),
      namespace: t.string(),
      topK: t.int(),
      systemPrompt: t.string(),
    }),
  });

  builder.queryFields((t) => ({
    studioIntegrations: t.field({
      type: [StudioIntegrationType],
      args: {
        projectId: t.arg.string(),
      },
      resolve: async (_root, args, ctx) => {
        const organization = requireOrganization(ctx);
        if (args.projectId) {
          await ensureStudioProjectAccess({
            projectId: args.projectId,
            userId: ctx.user!.id,
            organizationId: organization.id,
          });
        }
        return studioDb.studioIntegration.findMany({
          where: {
            organizationId: organization.id,
            projectId: args.projectId ?? undefined,
          },
          orderBy: { createdAt: 'desc' },
        });
      },
    }),
    knowledgeSources: t.field({
      type: [KnowledgeSourceGraphType],
      args: {
        projectId: t.arg.string(),
      },
      resolve: async (_root, args, ctx) => {
        const organization = requireOrganization(ctx);
        if (args.projectId) {
          await ensureStudioProjectAccess({
            projectId: args.projectId,
            userId: ctx.user!.id,
            organizationId: organization.id,
          });
        }
        return studioDb.knowledgeSource.findMany({
          where: {
            organizationId: organization.id,
            projectId: args.projectId ?? undefined,
          },
          orderBy: { createdAt: 'desc' },
        });
      },
    }),
    queryKnowledge: t.field({
      type: KnowledgeAnswerType,
      args: {
        input: t.arg({ type: QueryKnowledgeInput, required: true }),
      },
      resolve: async (_root, args, ctx) => {
        const organization = requireOrganization(ctx);
        await ensureOrgHasKnowledge(organization.id);
        const answer = await knowledgeModule.queryKnowledge({
          question: args.input.query,
          collection: args.input.collection,
          namespace: args.input.namespace,
          topK: args.input.topK ?? 5,
          systemPrompt: args.input.systemPrompt,
        });
        return {
          answer: answer.answer,
          references: answer.references,
          usage: answer.usage,
        };
      },
    }),
  }));

  builder.mutationFields((t) => ({
    connectIntegration: t.field({
      type: StudioIntegrationType,
      args: {
        input: t.arg({ type: ConnectIntegrationInput, required: true }),
      },
      resolve: async (_root, args, ctx) => {
        const organization = requireOrganization(ctx);
        requireFeatureFlag(
          ctx,
          ContractSpecFeatureFlags.STUDIO_INTEGRATION_HUB,
          'Integration hub is not enabled for this tenant.'
        );
        return integrationModule.connectIntegration({
          organizationId: organization.id,
          provider: args.input.provider as IntegrationProvider,
          ownershipMode:
            typeof (args.input as { ownershipMode?: unknown }).ownershipMode ===
            'string'
              ? ((args.input as { ownershipMode: string }).ownershipMode as
                  | 'managed'
                  | 'byok')
              : undefined,
          secretProvider:
            typeof (args.input as { secretProvider?: unknown })
              .secretProvider === 'string'
              ? ((args.input as { secretProvider: string })
                  .secretProvider as string)
              : undefined,
          secretRef:
            typeof (args.input as { secretRef?: unknown }).secretRef ===
            'string'
              ? ((args.input as { secretRef: string }).secretRef as string)
              : undefined,
          credentials:
            (args.input as { credentials?: unknown }).credentials &&
            typeof (args.input as { credentials?: unknown }).credentials ===
              'object'
              ? ((args.input as { credentials: Record<string, string> })
                  .credentials as Record<string, string>)
              : undefined,
          projectId: args.input.projectId ?? undefined,
          name: args.input.name ?? undefined,
          config: args.input.config ?? undefined,
        });
      },
    }),
    disconnectIntegration: t.field({
      type: 'Boolean',
      args: { id: t.arg.string({ required: true }) },
      resolve: async (_root, args, ctx) => {
        const organization = requireOrganization(ctx);
        await ensureIntegrationAccess(args.id, organization.id);
        await integrationModule.disconnectIntegration(args.id);
        return true;
      },
    }),
    syncIntegration: t.field({
      type: SyncResultType,
      args: { id: t.arg.string({ required: true }) },
      resolve: async (_root, args, ctx) => {
        const organization = requireOrganization(ctx);
        await ensureIntegrationAccess(args.id, organization.id);
        return integrationModule.syncIntegration(args.id);
      },
    }),
    indexKnowledgeSource: t.field({
      type: KnowledgeSourceGraphType,
      args: {
        input: t.arg({ type: IndexKnowledgeInput, required: true }),
      },
      resolve: async (_root, args, ctx) => {
        const organization = requireOrganization(ctx);
        requireFeatureFlag(
          ctx,
          ContractSpecFeatureFlags.STUDIO_KNOWLEDGE_HUB,
          'Knowledge hub is not enabled for this tenant.'
        );
        const documents = (args.input.documents ?? []).map((doc) =>
          toRawDocument(doc as KnowledgeDocumentInputShape)
        );
        return knowledgeModule.indexSource({
          organizationId: organization.id,
          projectId: args.input.projectId ?? undefined,
          type: args.input.type as KnowledgeSourceType,
          name: args.input.name,
          documents,
          namespace: args.input.namespace ?? undefined,
          collection: args.input.collection ?? undefined,
          metadata:
            (args.input.metadata as Record<string, string>) ?? undefined,
        });
      },
    }),
  }));

  if (debugGraphQL) {
    console.log('[graphql-integrations] schema ready');
  }
}

interface KnowledgeDocumentInputShape {
  id: string;
  text: string;
  mimeType?: string | null;
  metadata?: Record<string, string>;
}

function toRawDocument(input: KnowledgeDocumentInputShape) {
  return {
    id: input.id,
    mimeType: input.mimeType ?? 'text/plain',
    data: Buffer.from(input.text, 'utf-8'),
    metadata: input.metadata,
  };
}

async function ensureIntegrationAccess(id: string, organizationId: string) {
  const integration = await studioDb.studioIntegration.findFirst({
    where: { id, organizationId },
  });
  if (!integration) throw new Error('Integration not found');
}

async function ensureOrgHasKnowledge(organizationId: string) {
  const count = await studioDb.knowledgeSource.count({
    where: { organizationId },
  });
  if (count === 0) {
    await studioDb.knowledgeSource.create({
      data: {
        organizationId,
        type: KnowledgeSourceType.DOCUMENTATION,
        name: 'Getting Started',
        content: { description: 'Seed knowledge entry' },
        indexed: false,
      },
    });
  }
}

function requireAuthAndGet(ctx: Parameters<typeof requireAuth>[0]) {
  requireAuth(ctx);
  return ctx.user!;
}

function requireOrganization(ctx: Parameters<typeof requireAuth>[0]) {
  if (!ctx.organization) {
    throw new Error('Organization context is required for this operation.');
  }
  return ctx.organization;
}
