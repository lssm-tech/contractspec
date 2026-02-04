import type { EvidenceChunk } from '@contractspec/lib.contracts/product-intent/types';

export interface KeywordEvidenceOptions {
  minScore?: number;
}

const normalizeTokens = (value: string): string[] =>
  value
    .toLowerCase()
    .split(/[^a-z0-9]+/g)
    .map((token) => token.trim())
    .filter((token) => token.length > 2);

export const createKeywordEvidenceFetcher =
  (chunks: EvidenceChunk[], options: KeywordEvidenceOptions = {}) =>
  async ({
    query,
    maxChunks,
  }: {
    query: string;
    maxChunks?: number;
  }): Promise<EvidenceChunk[]> => {
    const tokens = normalizeTokens(query);
    if (tokens.length === 0) {
      return maxChunks ? chunks.slice(0, maxChunks) : [...chunks];
    }

    const scored = chunks
      .map((chunk) => {
        const haystack = chunk.text.toLowerCase();
        const score = tokens.reduce(
          (total, token) => total + (haystack.includes(token) ? 1 : 0),
          0
        );
        return { chunk, score };
      })
      .filter((item) => item.score >= (options.minScore ?? 1));

    scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.chunk.chunkId.localeCompare(b.chunk.chunkId);
    });

    const results = scored.map((item) => item.chunk);
    return maxChunks ? results.slice(0, maxChunks) : results;
  };
