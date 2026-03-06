import { describe, expect, it } from 'bun:test';
import type {
  EmbeddingDocument,
  EmbeddingProvider,
  EmbeddingResult,
  VectorSearchQuery,
  VectorSearchResult,
  VectorStoreProvider,
  VectorUpsertRequest,
} from '@contractspec/lib.contracts-integrations';
import { InMemoryContextSnapshotStore } from '@contractspec/lib.context-storage/in-memory-store';
import type {
  ContextPackRecord,
  ContextSnapshotItemInput,
  ContextSnapshotRecord,
} from '@contractspec/lib.context-storage';
import {
  EmbeddingService,
  VectorIndexer,
} from '@contractspec/lib.knowledge/ingestion';
import { ContextSnapshotPipeline } from './context-snapshot-pipeline';

class FakeEmbeddingProvider implements EmbeddingProvider {
  async embedDocuments(
    documents: EmbeddingDocument[]
  ): Promise<EmbeddingResult[]> {
    return documents.map((doc) => ({
      id: doc.id,
      vector: [0.1, 0.2, 0.3],
      dimensions: 3,
      model: 'test',
    }));
  }

  async embedQuery(query: string): Promise<EmbeddingResult> {
    return {
      id: query,
      vector: [0.1, 0.2, 0.3],
      dimensions: 3,
      model: 'test',
    };
  }
}

class FakeVectorStoreProvider implements VectorStoreProvider {
  lastUpsert?: VectorUpsertRequest;

  async upsert(request: VectorUpsertRequest): Promise<void> {
    this.lastUpsert = request;
  }

  async search(_query: VectorSearchQuery): Promise<VectorSearchResult[]> {
    return [];
  }

  async delete(): Promise<void> {}
}

describe('ContextSnapshotPipeline', () => {
  it('persists pack, snapshot, and items', async () => {
    const store = new InMemoryContextSnapshotStore();
    const pipeline = new ContextSnapshotPipeline({ store });
    const pack: ContextPackRecord = {
      packKey: 'context/core',
      version: '1.0.0',
      title: 'Core Context',
      createdAt: new Date().toISOString(),
    };
    const snapshot: ContextSnapshotRecord = {
      snapshotId: 'snap-1',
      packKey: pack.packKey,
      packVersion: pack.version,
      hash: 'hash-1',
      createdAt: new Date().toISOString(),
    };
    const items: ContextSnapshotItemInput[] = [
      {
        itemId: 'doc-1',
        kind: 'docblock',
        sourceKey: 'docs/core',
        content: 'Hello',
      },
    ];

    const result = await pipeline.buildSnapshot({
      pack,
      snapshot,
      items,
      index: false,
    });

    expect(result.itemCount).toBe(1);
    expect(await store.getPack(pack.packKey, pack.version)).toBeTruthy();
    expect(await store.getSnapshot(snapshot.snapshotId)).toBeTruthy();
    const storedItems = await store.listSnapshotItems(snapshot.snapshotId);
    expect(storedItems).toHaveLength(1);
    expect(storedItems[0]?.sourceKey).toBe('docs/core');
  });

  it('indexes fragments when embedding and vector providers are present', async () => {
    const store = new InMemoryContextSnapshotStore();
    const embeddingProvider = new FakeEmbeddingProvider();
    const vectorProvider = new FakeVectorStoreProvider();
    const embeddingService = new EmbeddingService(embeddingProvider, 1);
    const vectorIndexer = new VectorIndexer(vectorProvider, {
      collection: 'context_snapshots',
    });
    const pipeline = new ContextSnapshotPipeline({
      store,
      embeddingService,
      vectorIndexer,
    });
    const pack: ContextPackRecord = {
      packKey: 'context/indexed',
      version: '1.0.0',
      title: 'Indexed Context',
      createdAt: new Date().toISOString(),
    };
    const snapshot: ContextSnapshotRecord = {
      snapshotId: 'snap-2',
      packKey: pack.packKey,
      packVersion: pack.version,
      hash: 'hash-2',
      createdAt: new Date().toISOString(),
    };
    const items: ContextSnapshotItemInput[] = [
      {
        itemId: 'doc-1',
        kind: 'docblock',
        sourceKey: 'docs/indexed',
        content: 'Hello indexed',
      },
    ];

    await pipeline.buildSnapshot({ pack, snapshot, items });

    expect(vectorProvider.lastUpsert?.collection).toBe('context_snapshots');
    expect(vectorProvider.lastUpsert?.documents).toHaveLength(1);
    expect(vectorProvider.lastUpsert?.documents[0]?.payload).toMatchObject({
      snapshotId: 'snap-2',
      sourceKey: 'docs/indexed',
      kind: 'docblock',
    });
  });
});
