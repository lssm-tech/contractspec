import type { RetrievalResult, RetrievalOptions } from '../types';

/**
 * Unified interface for knowledge retrieval.
 *
 * Implementations can use vector stores, static content, or hybrid approaches.
 * This interface is consumed by @lssm/lib.ai-agent for both static injection
 * and dynamic RAG tool queries.
 */
export interface KnowledgeRetriever {
  /**
   * Retrieve relevant content for a query using semantic search.
   *
   * @param query - The search query or question
   * @param options - Retrieval options including space key and filters
   * @returns Array of retrieval results sorted by relevance
   */
  retrieve(query: string, options: RetrievalOptions): Promise<RetrievalResult[]>;

  /**
   * Get static content by space key (for required knowledge injection).
   *
   * Used for injecting required knowledge into agent system prompts
   * without performing semantic search.
   *
   * @param spaceKey - The knowledge space key
   * @returns The static content or null if not available
   */
  getStatic(spaceKey: string): Promise<string | null>;

  /**
   * Check if this retriever supports a given knowledge space.
   *
   * @param spaceKey - The knowledge space key to check
   * @returns True if the space is supported
   */
  supportsSpace(spaceKey: string): boolean;

  /**
   * List all supported knowledge space keys.
   *
   * @returns Array of supported space keys
   */
  listSpaces(): string[];
}

/**
 * Configuration for creating a retriever.
 */
export interface RetrieverConfig {
  /** Default number of results to return */
  defaultTopK?: number;
  /** Default minimum score threshold */
  defaultMinScore?: number;
}

