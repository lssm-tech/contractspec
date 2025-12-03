import type { RetrievalResult, RetrievalOptions } from '../types';
import type { KnowledgeRetriever, RetrieverConfig } from './interface';

/**
 * Configuration for the static retriever.
 */
export interface StaticRetrieverConfig extends RetrieverConfig {
  /** Map of space key to static content */
  content: Map<string, string> | Record<string, string>;
}

/**
 * A simple in-memory retriever for static knowledge content.
 *
 * Useful for:
 * - Required knowledge that doesn't need semantic search
 * - Testing and development
 * - Small knowledge bases that fit in memory
 */
export class StaticRetriever implements KnowledgeRetriever {
  private readonly content: Map<string, string>;

  constructor(config: StaticRetrieverConfig) {
    this.content =
      config.content instanceof Map
        ? config.content
        : new Map(Object.entries(config.content));
  }

  async retrieve(
    query: string,
    options: RetrievalOptions
  ): Promise<RetrievalResult[]> {
    const content = this.content.get(options.spaceKey);
    if (!content) return [];

    // Simple keyword matching for static retriever
    const queryLower = query.toLowerCase();
    const lines = content.split('\n').filter((line) => line.trim());

    const results: RetrievalResult[] = [];
    for (const line of lines) {
      if (line.toLowerCase().includes(queryLower)) {
        results.push({
          content: line,
          source: options.spaceKey,
          score: 1.0,
          metadata: { type: 'static' },
        });
      }
    }

    return results.slice(0, options.topK ?? 5);
  }

  async getStatic(spaceKey: string): Promise<string | null> {
    return this.content.get(spaceKey) ?? null;
  }

  supportsSpace(spaceKey: string): boolean {
    return this.content.has(spaceKey);
  }

  listSpaces(): string[] {
    return [...this.content.keys()];
  }
}

/**
 * Create a static retriever from a content map.
 */
export function createStaticRetriever(
  content: Record<string, string> | Map<string, string>
): StaticRetriever {
  return new StaticRetriever({ content });
}

