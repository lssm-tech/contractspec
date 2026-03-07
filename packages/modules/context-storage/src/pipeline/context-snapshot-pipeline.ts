import { Buffer } from 'node:buffer';
import type {
  ContextPackRecord,
  ContextSnapshotItemInput,
  ContextSnapshotRecord,
} from '@contractspec/lib.context-storage';
import type { ContextSnapshotStore } from '@contractspec/lib.context-storage/store';
import {
  DocumentProcessor,
  EmbeddingService,
  VectorIndexer,
  type DocumentFragment,
  type RawDocument,
} from '@contractspec/lib.knowledge/ingestion';

export interface ContextSnapshotBuildInput {
  pack: ContextPackRecord;
  snapshot: ContextSnapshotRecord;
  items: ContextSnapshotItemInput[];
  index?: boolean;
}

export interface ContextSnapshotBuildResult {
  snapshot: ContextSnapshotRecord;
  itemCount: number;
}

export interface ContextSnapshotPipelineOptions {
  store: ContextSnapshotStore;
  documentProcessor?: DocumentProcessor;
  embeddingService?: EmbeddingService;
  vectorIndexer?: VectorIndexer;
}

export class ContextSnapshotPipeline {
  private readonly store: ContextSnapshotStore;
  private readonly processor: DocumentProcessor;
  private readonly embeddingService?: EmbeddingService;
  private readonly vectorIndexer?: VectorIndexer;

  constructor(options: ContextSnapshotPipelineOptions) {
    this.store = options.store;
    this.processor = options.documentProcessor ?? new DocumentProcessor();
    this.embeddingService = options.embeddingService;
    this.vectorIndexer = options.vectorIndexer;
  }

  async buildSnapshot(
    input: ContextSnapshotBuildInput
  ): Promise<ContextSnapshotBuildResult> {
    await this.store.upsertPack(input.pack);
    const snapshot = await this.store.createSnapshot({
      ...input.snapshot,
      itemCount: input.items.length,
    });
    await this.store.addSnapshotItems(snapshot.snapshotId, input.items);

    if (input.index !== false && this.embeddingService && this.vectorIndexer) {
      const documents = input.items.map((item) =>
        toRawDocument(item, snapshot.snapshotId)
      );
      const fragments = await this.collectFragments(documents);
      const embeddings = await this.embeddingService.embedFragments(fragments);
      await this.vectorIndexer.upsert(fragments, embeddings);
    }

    return { snapshot, itemCount: input.items.length };
  }

  private async collectFragments(
    documents: RawDocument[]
  ): Promise<DocumentFragment[]> {
    const fragments: DocumentFragment[] = [];
    for (const document of documents) {
      const next = await this.processor.process(document);
      fragments.push(...next);
    }
    return fragments;
  }
}

function toRawDocument(
  item: ContextSnapshotItemInput,
  snapshotId: string
): RawDocument {
  const content =
    typeof item.content === 'string'
      ? item.content
      : JSON.stringify(item.content);
  const mimeType =
    typeof item.content === 'string' ? 'text/plain' : 'application/json';
  const metadata = {
    snapshotId,
    sourceKey: item.sourceKey,
    sourceVersion: item.sourceVersion ?? 'latest',
    kind: item.kind,
  };
  return {
    id: item.itemId,
    mimeType,
    data: Buffer.from(content, 'utf-8'),
    metadata,
  };
}
