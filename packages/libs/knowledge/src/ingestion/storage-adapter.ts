import type { GetObjectResult } from '@contractspec/lib.contracts-integrations';
import type { DocumentProcessor } from './document-processor';
import type { EmbeddingService } from './embedding-service';
import type { VectorIndexer } from './vector-indexer';

export class StorageIngestionAdapter {
  constructor(
    private readonly processor: DocumentProcessor,
    private readonly embeddings: EmbeddingService,
    private readonly indexer: VectorIndexer
  ) {}

  async ingestObject(object: GetObjectResult): Promise<void> {
    if (!('data' in object) || !object.data) {
      throw new Error('Storage ingestion requires object data');
    }

    const raw = {
      id: object.key,
      mimeType: object.contentType ?? 'application/octet-stream',
      data: object.data,
      metadata: {
        bucket: object.bucket,
        checksum: object.checksum ?? '',
      },
    };

    const fragments = await this.processor.process(raw);
    const embeddings = await this.embeddings.embedFragments(fragments);
    await this.indexer.upsert(fragments, embeddings);
  }
}


