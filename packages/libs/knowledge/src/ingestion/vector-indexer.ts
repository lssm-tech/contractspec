import type {
  VectorStoreProvider,
  VectorUpsertRequest,
  EmbeddingResult,
} from '@contractspec/lib.contracts';
import type { DocumentFragment } from './document-processor';

export interface VectorIndexConfig {
  collection: string;
  namespace?: string;
  metadata?: Record<string, string>;
}

export class VectorIndexer {
  private readonly provider: VectorStoreProvider;
  private readonly config: VectorIndexConfig;

  constructor(provider: VectorStoreProvider, config: VectorIndexConfig) {
    this.provider = provider;
    this.config = config;
  }

  async upsert(
    fragments: DocumentFragment[],
    embeddings: EmbeddingResult[]
  ): Promise<void> {
    const documents = embeddings.map((embedding) => {
      const fragment = fragments.find((f) => f.id === embedding.id);
      return {
        id: embedding.id,
        vector: embedding.vector,
        payload: {
          ...this.config.metadata,
          ...(fragment?.metadata ?? {}),
          documentId: fragment?.documentId,
        },
        namespace: this.config.namespace,
      };
    });

    const request: VectorUpsertRequest = {
      collection: this.config.collection,
      documents,
    };

    await this.provider.upsert(request);
  }
}
