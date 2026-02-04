import { describe, expect, it } from 'bun:test';
import { createKeywordEvidenceFetcher } from '../evidence/keyword-retriever';
import type { EvidenceChunk } from '@contractspec/lib.contracts/product-intent/types';

describe('createKeywordEvidenceFetcher', () => {
  it('returns the highest scoring chunks first', async () => {
    const chunks: EvidenceChunk[] = [
      { chunkId: 'A', text: 'Admins need faster setup', meta: {} },
      { chunkId: 'B', text: 'End users want speed', meta: {} },
      { chunkId: 'C', text: 'Billing concerns', meta: {} },
    ];

    const fetcher = createKeywordEvidenceFetcher(chunks);
    const result = await fetcher({ query: 'setup speed', maxChunks: 2 });

    expect(result.map((chunk) => chunk.chunkId)).toEqual(['A', 'B']);
  });
});
