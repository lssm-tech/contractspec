import type { QdrantClient } from '@qdrant/js-client-rest';
import { describe, expect, it, vi } from 'vitest';

import { QdrantVectorProvider } from './qdrant-vector';

describe('QdrantVectorProvider', () => {
  it('creates collection when missing before upsert', async () => {
    const client = createMockClient({ collectionExists: false });
    const provider = new QdrantVectorProvider({
      url: 'https://qdrant.local',
      client,
    });

    await provider.upsert({
      collection: 'tenant_vectors',
      documents: [
        {
          id: 'doc-1',
          vector: [0.1, 0.2, 0.3],
          payload: { tenantId: 'tenant' },
        },
      ],
    });

    expect(client.getCollection).toHaveBeenCalledWith('tenant_vectors');
    expect(client.createCollection).toHaveBeenCalledWith(
      'tenant_vectors',
      expect.objectContaining({
        vectors: { size: 3, distance: 'Cosine' },
      })
    );
    expect(client.upsert).toHaveBeenCalledWith('tenant_vectors', {
      wait: true,
      points: [
        {
          id: 'doc-1',
          payload: { tenantId: 'tenant' },
          vector: [0.1, 0.2, 0.3],
        },
      ],
    });
  });

  it('maps search results', async () => {
    const client = createMockClient();
    const provider = new QdrantVectorProvider({
      url: 'https://qdrant.local',
      client,
      createCollectionIfMissing: false,
    });

    const results = await provider.search({
      collection: 'tenant_vectors',
      vector: [0.1, 0.2, 0.3],
      topK: 2,
    });

    expect(client.search).toHaveBeenCalledWith(
      'tenant_vectors',
      expect.objectContaining({ limit: 2 })
    );
    expect(results).toEqual([
      {
        id: '1',
        score: 0.99,
        payload: { tenantId: 'tenant' },
        namespace: undefined,
      },
    ]);
  });

  it('deletes vectors by ids', async () => {
    const client = createMockClient();
    const provider = new QdrantVectorProvider({
      url: 'https://qdrant.local',
      client,
      createCollectionIfMissing: false,
    });

    await provider.delete({
      collection: 'tenant_vectors',
      ids: ['1', '2'],
    });

    expect(client.delete).toHaveBeenCalledWith('tenant_vectors', {
      wait: true,
      points: { ids: ['1', '2'] },
    });
  });
});

interface MockOptions {
  collectionExists?: boolean;
}

function createMockClient(options: MockOptions = {}) {
  const exists = options.collectionExists ?? true;

  return {
    getCollection: exists
      ? vi.fn(async () => ({}))
      : vi.fn(async () => {
          throw new Error('not found');
        }),
    createCollection: vi.fn(async () => ({})),
    upsert: vi.fn(async () => ({})),
    search: vi.fn(async () => [
      {
        id: 1,
        score: 0.99,
        payload: { tenantId: 'tenant' },
      },
    ]),
    delete: vi.fn(async () => ({})),
  } as unknown as QdrantClient;
}
