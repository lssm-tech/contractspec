import { describe, expect, it, vi } from 'bun:test';

import { createGmailSyncHandler } from './gmail-sync-handler';
import { createStorageDocumentHandler } from './storage-document-handler';
import { GmailIngestionAdapter } from '../../knowledge/ingestion/gmail-adapter';
import { StorageIngestionAdapter } from '../../knowledge/ingestion/storage-adapter';

describe('Job handlers', () => {
  it('invokes Gmail ingestion adapter', async () => {
    const gmail = { listThreads: vi.fn(async () => []) };
    const processor = { process: vi.fn(async () => []) };
    const embeddings = { embedFragments: vi.fn(async () => []) };
    const indexer = {
      upsert: vi.fn(async () => {
        /* noop */
      }),
    };

    const adapter = new GmailIngestionAdapter(
      gmail as unknown as ConstructorParameters<
        typeof GmailIngestionAdapter
      >[0],
      processor as unknown as ConstructorParameters<
        typeof GmailIngestionAdapter
      >[1],
      embeddings as unknown as ConstructorParameters<
        typeof GmailIngestionAdapter
      >[2],
      indexer as unknown as ConstructorParameters<
        typeof GmailIngestionAdapter
      >[3]
    );
    const spy = vi.spyOn(adapter, 'syncThreads').mockResolvedValue(undefined);

    const handler = createGmailSyncHandler(adapter);
    await handler({
      id: 'job',
      type: 'gmail-sync',
      version: '1.0.0',
      payload: { label: 'INBOX' },
      status: 'pending',
      priority: 0,
      attempts: 0,
      maxRetries: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    expect(spy).toHaveBeenCalledWith({ label: 'INBOX' });
  });

  it('downloads object and delegates to storage adapter', async () => {
    const storage = {
      getObject: vi.fn(async () => ({
        bucket: 'test',
        key: 'file.txt',
        contentType: 'text/plain',
        data: new Uint8Array(),
      })),
      putObject: vi.fn(async () => ({ bucket: 'test', key: 'file.txt' })),
      deleteObject: vi.fn(async () => {
        /* noop */
      }),
      generateSignedUrl: vi.fn(async () => ({
        url: 'http://example',
        expiresAt: new Date(),
      })),
      listObjects: vi.fn(async () => ({ objects: [] })),
    };
    const processor = { process: vi.fn(async () => []) };
    const embeddings = { embedFragments: vi.fn(async () => []) };
    const indexer = {
      upsert: vi.fn(async () => {
        /* noop */
      }),
    };
    const adapter = new StorageIngestionAdapter(
      processor as unknown as ConstructorParameters<
        typeof StorageIngestionAdapter
      >[0],
      embeddings as unknown as ConstructorParameters<
        typeof StorageIngestionAdapter
      >[1],
      indexer as unknown as ConstructorParameters<
        typeof StorageIngestionAdapter
      >[2]
    );
    const ingestSpy = vi
      .spyOn(adapter, 'ingestObject')
      .mockResolvedValue(undefined);
    const handler = createStorageDocumentHandler(
      storage as unknown as Parameters<typeof createStorageDocumentHandler>[0],
      adapter
    );
    await handler({
      id: 'job',
      type: 'storage-document',
      version: '1.0.0',
      payload: { bucket: 'test', key: 'file.txt' },
      status: 'pending',
      priority: 0,
      attempts: 0,
      maxRetries: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(storage.getObject).toHaveBeenCalledWith({
      bucket: 'test',
      key: 'file.txt',
    });
    expect(ingestSpy).toHaveBeenCalled();
  });
});
