import type {
  EmbeddingProvider,
  VectorStoreProvider,
} from '@lssm/lib.contracts/integrations/providers';
import type { RetrievalResult, RetrievalOptions } from '../types';
import type { KnowledgeRetriever, RetrieverConfig } from './interface';

/**
 * Configuration for the vector retriever.
 */
export interface VectorRetrieverConfig extends RetrieverConfig {
  /** Embedding provider for query vectorization */
  embeddings: EmbeddingProvider;
  /** Vector store provider for similarity search */
  vectorStore: VectorStoreProvider;
  /** Map of space key to collection name */
  spaceCollections: Map<string, string> | Record<string, string>;
  /** Optional static content for getStatic() calls */
  staticContent?: Map<string, string> | Record<string, string>;
}

/**
 * A retriever that uses vector similarity search.
 *
 * Uses embedding provider to vectorize queries and vector store
 * provider to perform similarity search.
 */
export class VectorRetriever implements KnowledgeRetriever {
  private readonly config: VectorRetrieverConfig;
  private readonly spaceCollections: Map<string, string>;
  private readonly staticContent: Map<string, string>;

  constructor(config: VectorRetrieverConfig) {
    this.config = config;
    this.spaceCollections =
      config.spaceCollections instanceof Map
        ? config.spaceCollections
        : new Map(Object.entries(config.spaceCollections));
    this.staticContent = config.staticContent
      ? config.staticContent instanceof Map
        ? config.staticContent
        : new Map(Object.entries(config.staticContent))
      : new Map();
  }

  async retrieve(
    query: string,
    options: RetrievalOptions
  ): Promise<RetrievalResult[]> {
    const collection = this.spaceCollections.get(options.spaceKey);
    if (!collection) {
      return [];
    }

    // Embed the query
    const embedding = await this.config.embeddings.embedQuery(query);

    // Search the vector store
    const results = await this.config.vectorStore.search({
      collection,
      vector: embedding.vector,
      topK: options.topK ?? this.config.defaultTopK ?? 5,
      namespace: options.tenantId,
      filter: options.filter,
    });

    // Filter by minimum score
    const minScore = options.minScore ?? this.config.defaultMinScore ?? 0;
    const filtered = results.filter((r) => r.score >= minScore);

    // Map to RetrievalResult
    return filtered.map((result) => ({
      content: this.extractContent(result.payload),
      source: result.id,
      score: result.score,
      metadata: result.payload as Record<string, unknown> | undefined,
    }));
  }

  async getStatic(spaceKey: string): Promise<string | null> {
    return this.staticContent.get(spaceKey) ?? null;
  }

  supportsSpace(spaceKey: string): boolean {
    return this.spaceCollections.has(spaceKey);
  }

  listSpaces(): string[] {
    return [...this.spaceCollections.keys()];
  }

  private extractContent(payload: Record<string, unknown> | undefined): string {
    if (!payload) return '';
    if (typeof payload.text === 'string') return payload.text;
    if (typeof payload.content === 'string') return payload.content;
    return JSON.stringify(payload);
  }
}

/**
 * Create a vector retriever from configuration.
 */
export function createVectorRetriever(
  config: VectorRetrieverConfig
): VectorRetriever {
  return new VectorRetriever(config);
}


