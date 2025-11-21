import { describe, expect, it, vi } from 'vitest';

import type { EmbeddingProvider } from '../../integrations/providers/embedding';
import type { VectorStoreProvider } from '../../integrations/providers/vector-store';
import type {
  LLMProvider,
  LLMResponse,
} from '../../integrations/providers/llm';
import { KnowledgeQueryService } from './service';

describe('KnowledgeQueryService', () => {
  it('performs RAG query combining vector search and LLM', async () => {
    const embeddings = createEmbeddingProvider();
    const vectorStore = createVectorStoreProvider();
    const llm = createLlmProvider();
    const service = new KnowledgeQueryService(embeddings, vectorStore, llm, {
      collection: 'knowledge',
      topK: 2,
      systemPrompt: 'Answer questions from context only.',
    });

    const answer = await service.query('What is Project Aurora?');
    expect(embeddings.embedQuery).toHaveBeenCalled();
    expect(vectorStore.search).toHaveBeenCalledWith(
      expect.objectContaining({ collection: 'knowledge' })
    );
    expect(llm.chat).toHaveBeenCalled();
    expect(answer.answer).toContain('Project Aurora');
    expect(answer.references).toHaveLength(2);
  });
});

function createEmbeddingProvider() {
  return {
    embedDocuments: vi.fn(),
    embedQuery: vi.fn(async () => ({
      id: 'query',
      vector: [0.1, 0.2],
      dimensions: 2,
      model: 'test',
    })),
  } as unknown as EmbeddingProvider;
}

function createVectorStoreProvider() {
  return {
    search: vi.fn(async () => [
      {
        id: 'doc-1',
        score: 0.92,
        payload: {
          text: 'Project Aurora is a financial automation initiative.',
        },
      },
      {
        id: 'doc-2',
        score: 0.84,
        payload: { text: 'Aurora automates household bill management.' },
      },
    ]),
    upsert: vi.fn(),
    delete: vi.fn(),
  } as unknown as VectorStoreProvider;
}

function createLlmProvider() {
  return {
    chat: vi.fn(async () => ({
      message: {
        role: 'assistant',
        content: [
          {
            type: 'text',
            text: 'Project Aurora automates financial workflows.',
          },
        ],
      },
      usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 },
    })),
    stream: vi.fn(),
    countTokens: vi.fn(),
  } as unknown as LLMProvider;
}
