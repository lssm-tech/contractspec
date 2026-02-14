import { describe, expect, it } from 'bun:test';
import { IntegrationSpecRegistry } from '@contractspec/lib.contracts-integrations';
import {
  registerElevenLabsIntegration,
  registerGcsStorageIntegration,
  registerGmailIntegration,
  registerGoogleCalendarIntegration,
  registerMistralIntegration,
  registerPostmarkIntegration,
  registerPowensIntegration,
  registerQdrantIntegration,
  registerStripeIntegration,
  registerTwilioSmsIntegration,
} from '@contractspec/lib.contracts-integrations';
import { composeAppConfig } from '@contractspec/lib.contracts-spec/app-config/runtime';
import { validateTenantConfig } from '@contractspec/lib.contracts-spec/app-config/validation';
import {
  KnowledgeSpaceRegistry,
  registerEmailThreadsKnowledgeSpace,
  registerFinancialDocsKnowledgeSpace,
  registerFinancialOverviewKnowledgeSpace,
} from '@contractspec/lib.contracts-spec/knowledge';
import {
  DocumentProcessor,
  EmbeddingService,
  KnowledgeQueryService,
  VectorIndexer,
} from '@contractspec/lib.knowledge';
import type {
  EmbeddingDocument,
  EmbeddingProvider,
  EmbeddingResult,
} from '@contractspec/lib.contracts-integrations';
import type {
  VectorDeleteRequest,
  VectorSearchQuery,
  VectorSearchResult,
  VectorStoreProvider,
  VectorUpsertRequest,
} from '@contractspec/lib.contracts-integrations';
import type {
  LLMMessage,
  LLMProvider,
  LLMResponse,
  LLMStreamChunk,
} from '@contractspec/lib.contracts-integrations';

import {
  pocketFamilyOfficeBlueprint,
  pocketFamilyOfficeConnections,
  pocketFamilyOfficeKnowledgeSources,
  pocketFamilyOfficeTenantSample,
} from '..';

describe('Pocket Family Office blueprint', () => {
  it('declares all required integration slots', () => {
    const slotIds = new Set(
      (pocketFamilyOfficeBlueprint.integrationSlots ?? []).map(
        (slot) => slot.slotId
      )
    );

    expect(slotIds).toEqual(
      new Set([
        'primaryLLM',
        'primaryVectorDb',
        'primaryStorage',
        'primaryOpenBanking',
        'emailInbound',
        'emailOutbound',
        'calendarScheduling',
        'voicePlayback',
        'smsNotifications',
        'paymentsProcessing',
      ])
    );
  });
});

describe('Pocket Family Office configuration', () => {
  function buildIntegrationRegistry() {
    return registerTwilioSmsIntegration(
      registerStripeIntegration(
        registerPostmarkIntegration(
          registerElevenLabsIntegration(
            registerGoogleCalendarIntegration(
              registerGmailIntegration(
                registerGcsStorageIntegration(
                  registerQdrantIntegration(
                    registerPowensIntegration(
                      registerMistralIntegration(new IntegrationSpecRegistry())
                    )
                  )
                )
              )
            )
          )
        )
      )
    );
  }

  function buildKnowledgeRegistry() {
    return registerEmailThreadsKnowledgeSpace(
      registerFinancialDocsKnowledgeSpace(
        registerFinancialOverviewKnowledgeSpace(new KnowledgeSpaceRegistry())
      )
    );
  }

  it('composes without missing references', () => {
    const integrations = buildIntegrationRegistry();
    const knowledgeSpaces = buildKnowledgeRegistry();

    const composition = composeAppConfig(
      pocketFamilyOfficeBlueprint,
      pocketFamilyOfficeTenantSample,
      {
        integrationSpecs: integrations,
        integrationConnections: pocketFamilyOfficeConnections,
        knowledgeSpaces,
        knowledgeSources: pocketFamilyOfficeKnowledgeSources,
      }
    );

    const blockingMissing = composition.missing.filter((item) =>
      [
        'integrationConnection',
        'integrationSpec',
        'integrationSlot',
        'knowledgeSpace',
        'knowledgeSource',
      ].includes(item.type)
    );
    expect(blockingMissing).toEqual([]);

    const validation = validateTenantConfig(
      pocketFamilyOfficeBlueprint,
      pocketFamilyOfficeTenantSample,
      {
        integrationSpecs: integrations,
        knowledgeSpaces,
        knowledgeSources: pocketFamilyOfficeKnowledgeSources,
        tenantConnections: pocketFamilyOfficeConnections,
      }
    );
    expect(validation.valid).toBe(true);
    expect(validation.errors).toHaveLength(0);
  });

  it('ingests a document and answers a knowledge query end-to-end', async () => {
    const embeddings = new FakeEmbeddingProvider();
    const vectorStore = new InMemoryVectorStore();
    const llm = new FakeLLMProvider();

    const processor = new DocumentProcessor();
    const embeddingService = new EmbeddingService(embeddings, 2);
    const indexer = new VectorIndexer(vectorStore, {
      collection: 'tenant.family-office',
      metadata: { tenantId: 'tenant.family-office' },
    });

    const rawDocument = {
      id: 'invoice-2025-01',
      mimeType: 'text/plain',
      data: new TextEncoder().encode(
        [
          'Invoice #2025-01',
          'Vendor: Solar Co-op',
          'Amount due: 245.90 EUR',
          'Due date: 2025-02-05',
        ].join('\n')
      ),
      metadata: {
        category: 'utilities',
      },
    };

    const fragments = await processor.process(rawDocument);
    const enrichedFragments = fragments.map((fragment) => ({
      ...fragment,
      metadata: {
        ...(fragment.metadata ?? {}),
        text: fragment.text,
      },
    }));
    const fragmentEmbeddings =
      await embeddingService.embedFragments(enrichedFragments);
    await indexer.upsert(enrichedFragments, fragmentEmbeddings);

    const queryService = new KnowledgeQueryService(
      embeddings,
      vectorStore,
      llm,
      {
        collection: 'tenant.family-office',
        systemPrompt:
          'Provide concise household finance summaries. Reference the provided context explicitly.',
      }
    );

    const answer = await queryService.query('What invoices are due next week?');

    expect(answer.answer).toContain('Invoice #2025-01');
    expect(answer.references?.[0]?.text).toContain('Solar Co-op');
    expect(answer.usage?.totalTokens).toBeGreaterThan(0);
  });
});

class FakeEmbeddingProvider implements EmbeddingProvider {
  private dimensions = 8;

  async embedDocuments(
    documents: EmbeddingDocument[]
  ): Promise<EmbeddingResult[]> {
    return documents.map((document) => ({
      id: document.id,
      vector: this.vectorFor(document.text),
      dimensions: this.dimensions,
      model: 'fake-embed',
      metadata: { source: 'fake' },
    }));
  }

  async embedQuery(query: string): Promise<EmbeddingResult> {
    return {
      id: 'query',
      vector: this.vectorFor(query),
      dimensions: this.dimensions,
      model: 'fake-embed',
    };
  }

  private vectorFor(text: string) {
    const base = Array.from(text.slice(0, this.dimensions)).map((char) =>
      char.charCodeAt(0)
    );
    const padded = [...base];
    while (padded.length < this.dimensions) {
      padded.push(0);
    }
    const norm = Math.sqrt(
      padded.reduce((sum, value) => sum + value * value, 0)
    );
    return padded.map((value) => (norm === 0 ? 0 : value / norm));
  }
}

class InMemoryVectorStore implements VectorStoreProvider {
  private collections = new Map<
    string,
    { id: string; vector: number[]; payload?: Record<string, unknown> }[]
  >();

  async upsert(request: VectorUpsertRequest): Promise<void> {
    const list = this.collections.get(request.collection) ?? [];
    for (const document of request.documents) {
      const existingIndex = list.findIndex((item) => item.id === document.id);
      const payload = document.payload
        ? JSON.parse(JSON.stringify(document.payload))
        : undefined;
      const record = {
        id: document.id,
        vector: [...document.vector],
        payload,
      };
      if (existingIndex >= 0) {
        list.splice(existingIndex, 1, record);
      } else {
        list.push(record);
      }
    }
    this.collections.set(request.collection, list);
  }

  async search(query: VectorSearchQuery): Promise<VectorSearchResult[]> {
    const list = this.collections.get(query.collection) ?? [];
    return list
      .map((item) => ({
        id: item.id,
        score: cosineSimilarity(query.vector, item.vector),
        payload: item.payload,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, query.topK);
  }

  async delete(request: VectorDeleteRequest): Promise<void> {
    const list = this.collections.get(request.collection);
    if (!list) return;
    this.collections.set(
      request.collection,
      list.filter((item) => !request.ids.includes(item.id))
    );
  }
}

class FakeLLMProvider implements LLMProvider {
  async chat(messages: LLMMessage[]): Promise<LLMResponse> {
    const last = messages[messages.length - 1];
    const context =
      last?.content
        .map((part) => ('text' in part ? part.text : ''))
        .join('\n') || '';
    const responseText = `Summary:\n${(context || '')
      .split('\n')
      .filter((line) => line.includes('Invoice'))
      .join('\n')}`;
    return {
      message: {
        role: 'assistant',
        content: [{ type: 'text', text: responseText }],
      },
      usage: {
        promptTokens: 50,
        completionTokens: 30,
        totalTokens: 80,
      },
    };
  }

  async *stream(messages: LLMMessage[]): AsyncIterable<LLMStreamChunk> {
    const response = await this.chat(messages);
    yield {
      type: 'end',
      response,
    };
  }

  async countTokens(messages: LLMMessage[]) {
    const length = messages.reduce(
      (sum, message) =>
        sum +
        message.content.reduce(
          (inner, part) =>
            inner + ('text' in part ? part.text.split(/\s+/).length : 0),
          0
        ),
      0
    );
    return { promptTokens: length };
  }
}

function cosineSimilarity(a: number[], b: number[]): number {
  const min = Math.min(a.length, b.length);
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < min; i += 1) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    dot += a[i]! * b[i]!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    normA += a[i]! * a[i]!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    normB += b[i]! * b[i]!;
  }
  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator === 0 ? 0 : dot / denominator;
}
