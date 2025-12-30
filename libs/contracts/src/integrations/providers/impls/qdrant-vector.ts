import { QdrantClient, type QdrantClientParams } from '@qdrant/js-client-rest';

import type {
  VectorDeleteRequest,
  VectorSearchQuery,
  VectorSearchResult,
  VectorStoreProvider,
  VectorUpsertRequest,
} from '../vector-store';

export interface QdrantVectorProviderOptions {
  url: string;
  apiKey?: string;
  client?: QdrantClient;
  createCollectionIfMissing?: boolean;
  distance?: 'Cosine' | 'Euclid' | 'Dot' | 'Manhattan';
  clientParams?: Omit<QdrantClientParams, 'url' | 'apiKey'>;
}

export class QdrantVectorProvider implements VectorStoreProvider {
  private readonly client: QdrantClient;
  private readonly createCollectionIfMissing: boolean;
  private readonly distance: 'Cosine' | 'Euclid' | 'Dot' | 'Manhattan';

  constructor(options: QdrantVectorProviderOptions) {
    this.client =
      options.client ??
      new QdrantClient({
        url: options.url,
        apiKey: options.apiKey,
        ...options.clientParams,
      });
    this.createCollectionIfMissing = options.createCollectionIfMissing ?? true;
    this.distance = options.distance ?? 'Cosine';
  }

  async upsert(request: VectorUpsertRequest): Promise<void> {
    if (request.documents.length === 0) return;
    const vectorSize = request.documents[0]?.vector.length ?? 0;

    if (this.createCollectionIfMissing) {
      await this.ensureCollection(request.collection, vectorSize);
    }

    const points = request.documents.map((document) => ({
      id: document.id,
      vector: document.vector,
      payload: {
        ...document.payload,
        ...(document.namespace ? { namespace: document.namespace } : {}),
        ...(document.expiresAt
          ? { expiresAt: document.expiresAt.toISOString() }
          : {}),
      },
    }));

    await this.client.upsert(request.collection, {
      wait: true,
      points,
    });
  }

  async search(query: VectorSearchQuery): Promise<VectorSearchResult[]> {
    const results = await this.client.search(query.collection, {
      vector: query.vector,
      limit: query.topK,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      filter: query.filter as any,
      score_threshold: query.scoreThreshold,
      with_payload: true,
      with_vector: false,
    });

    return results.map((item) => ({
      id: String(item.id),
      score: item.score,
      payload: item.payload ?? undefined,
      namespace:
        typeof item.payload === 'object' && item.payload !== null
          ? (item.payload.namespace as string | undefined)
          : undefined,
    }));
  }

  async delete(request: VectorDeleteRequest): Promise<void> {
    await this.client.delete(request.collection, {
      wait: true,
      points: request.ids,
    });
  }

  private async ensureCollection(
    collectionName: string,
    vectorSize: number
  ): Promise<void> {
    try {
      await this.client.getCollection(collectionName);
    } catch {
      await this.client.createCollection(collectionName, {
        vectors: {
          size: vectorSize,
          distance: this.distance,
        },
      });
    }
  }
}
