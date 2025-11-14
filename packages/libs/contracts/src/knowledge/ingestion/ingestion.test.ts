import { describe, expect, it, vi } from 'vitest';

import type {
  EmbeddingDocument,
  EmbeddingProvider,
  EmbeddingResult,
} from '../../integrations/providers/embedding';
import type { VectorStoreProvider } from '../../integrations/providers/vector-store';
import type { EmailInboundProvider, EmailThread } from '../../integrations/providers/email';
import type { GetObjectResult } from '../../integrations/providers/storage';
import { DocumentProcessor } from './document-processor';
import { EmbeddingService } from './embedding-service';
import { VectorIndexer } from './vector-indexer';
import { GmailIngestionAdapter } from './gmail-adapter';
import { StorageIngestionAdapter } from './storage-adapter';

describe('Knowledge ingestion services', () => {
  it('processes plain text documents', async () => {
    const processor = new DocumentProcessor();
    const fragments = await processor.process({
      id: 'doc-1',
      mimeType: 'text/plain',
      data: new Uint8Array(Buffer.from('Hello world')),
    });
    expect(fragments).toHaveLength(1);
    const firstFragment = fragments[0];
    if (!firstFragment) {
      throw new Error('Expected at least one fragment from processor');
    }
    expect(firstFragment.text).toBe('Hello world');
  });

  it('embeds fragments in batches', async () => {
    const provider = createEmbeddingProvider();
    const service = new EmbeddingService(provider, 2);
    const fragments = [
      { id: '1', documentId: 'doc', text: 'A', metadata: {} },
      { id: '2', documentId: 'doc', text: 'B', metadata: {} },
      { id: '3', documentId: 'doc', text: 'C', metadata: {} },
    ];
    const embeddings = await service.embedFragments(fragments);
    expect(provider.embedDocuments).toHaveBeenCalledTimes(2);
    expect(embeddings).toHaveLength(3);
  });

  it('indexes embeddings into vector store', async () => {
    const provider = createVectorStoreProvider();
    const indexer = new VectorIndexer(provider, { collection: 'knowledge' });
    await indexer.upsert(
      [
        { id: '1', documentId: 'doc', text: 'text', metadata: {} },
      ],
      [
        { id: '1', vector: [0.1, 0.2], dimensions: 2, model: 'test' },
      ]
    );
    expect(provider.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'knowledge',
      })
    );
  });

  it('ingests gmail threads', async () => {
    const gmail = createGmailProvider();
    const processor = new DocumentProcessor();
    const embeddings = new EmbeddingService(createEmbeddingProvider());
    const indexer = new VectorIndexer(createVectorStoreProvider(), {
      collection: 'knowledge',
    });
    const adapter = new GmailIngestionAdapter(gmail, processor, embeddings, indexer);

    await adapter.syncThreads();
    expect(gmail.listThreads).toHaveBeenCalled();
    expect(indexer['provider'].upsert).toHaveBeenCalled();
  });

  it('ingests storage objects', async () => {
    const processor = new DocumentProcessor();
    const embeddings = new EmbeddingService(createEmbeddingProvider());
    const indexer = new VectorIndexer(createVectorStoreProvider(), {
      collection: 'knowledge',
    });
    const adapter = new StorageIngestionAdapter(processor, embeddings, indexer);

    const object: GetObjectResult = {
      bucket: 'test',
      key: 'doc.txt',
      sizeBytes: 3,
      contentType: 'text/plain',
      data: new Uint8Array(Buffer.from('data')),
    };
    await adapter.ingestObject(object);
    expect(indexer['provider'].upsert).toHaveBeenCalled();
  });
});

function createEmbeddingProvider() {
  return {
    embedDocuments: vi.fn(
      async (documents: EmbeddingDocument[]): Promise<EmbeddingResult[]> =>
        documents.map((doc) => ({
          id: doc.id,
          vector: [0.1, 0.2],
          dimensions: 2,
          model: 'test',
        }))
    ),
    embedQuery: vi.fn(
      async (): Promise<EmbeddingResult> => ({
        id: 'query',
        vector: [0.1, 0.2],
        dimensions: 2,
        model: 'test',
      })
    ),
  } as unknown as EmbeddingProvider;
}

function createVectorStoreProvider() {
  return {
    upsert: vi.fn(async () => {}),
    search: vi.fn(),
    delete: vi.fn(),
  } as unknown as VectorStoreProvider;
}

function createGmailProvider() {
  const thread: EmailThread = {
    id: 'thread-1',
    subject: 'Hello',
    snippet: 'Snippet',
    participants: [{ email: 'user@example.com', name: 'User' }],
    messages: [
      {
        id: 'msg-1',
        threadId: 'thread-1',
        subject: 'Hello',
        from: { email: 'sender@example.com' },
        to: [{ email: 'user@example.com' }],
        cc: [],
        bcc: [],
        sentAt: new Date(),
        textBody: 'Message body',
      },
    ],
    updatedAt: new Date(),
  };

  return {
    listThreads: vi.fn(async () => [thread]),
    getThread: vi.fn(async () => thread),
    listMessagesSince: vi.fn(),
  } as unknown as EmailInboundProvider;
}
