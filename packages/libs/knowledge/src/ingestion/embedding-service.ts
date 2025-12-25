import type {
  EmbeddingDocument,
  EmbeddingProvider,
  EmbeddingResult,
} from '@lssm/lib.contracts';
import type { DocumentFragment } from './document-processor';

export class EmbeddingService {
  private readonly provider: EmbeddingProvider;
  private readonly batchSize: number;

  constructor(provider: EmbeddingProvider, batchSize = 16) {
    this.provider = provider;
    this.batchSize = batchSize;
  }

  async embedFragments(
    fragments: DocumentFragment[]
  ): Promise<EmbeddingResult[]> {
    const results: EmbeddingResult[] = [];
    for (let i = 0; i < fragments.length; i += this.batchSize) {
      const slice = fragments.slice(i, i + this.batchSize);
      const documents: EmbeddingDocument[] = slice.map((fragment) => ({
        id: fragment.id,
        text: fragment.text,
        metadata: fragment.metadata,
      }));
      const embeddings = await this.provider.embedDocuments(documents);
      results.push(...embeddings);
    }
    return results;
  }
}
