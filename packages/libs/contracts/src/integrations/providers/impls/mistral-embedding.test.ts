import type { Mistral } from '@mistralai/mistralai';
import type * as components from '@mistralai/mistralai/models/components/index.js';
import { describe, expect, it, vi } from 'vitest';

import { MistralEmbeddingProvider } from './mistral-embedding';

describe('MistralEmbeddingProvider', () => {
  it('maps embedding responses', async () => {
    const client = createMockClient();
    const provider = new MistralEmbeddingProvider({
      apiKey: 'test-key',
      client,
      defaultModel: 'mistral-embed-latest',
    });

    const results = await provider.embedDocuments([
      { id: 'doc-1', text: 'hello world' },
    ]);

    expect(client.embeddings.create).toHaveBeenCalledWith({
      model: 'mistral-embed-latest',
      inputs: ['hello world'],
    });
    expect(results).toEqual([
      {
        id: 'doc-1',
        vector: [0.1, 0.2, 0.3],
        dimensions: 3,
        model: 'mistral-embed-latest',
        metadata: undefined,
      },
    ]);
  });

  it('supports embedding query helper', async () => {
    const client = createMockClient();
    const provider = new MistralEmbeddingProvider({
      apiKey: 'test-key',
      client,
    });
    const result = await provider.embedQuery('search me');
    expect(result.vector.length).toBe(3);
  });
});

function createMockClient() {
  const response: components.EmbeddingResponse = {
    id: 'emb',
    object: 'list',
    model: 'mistral-embed-latest',
    usage: {
      promptTokens: 5,
      completionTokens: 0,
      totalTokens: 5,
    },
    data: [
      {
        index: 0,
        embedding: [0.1, 0.2, 0.3],
        object: 'embedding',
      },
    ],
  };

  return {
    embeddings: {
      create: vi.fn(async () => response),
    },
  } as unknown as Mistral;
}
