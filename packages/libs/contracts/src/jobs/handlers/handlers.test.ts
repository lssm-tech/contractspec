import { describe, expect, it, vi } from 'vitest';

import { createGmailSyncHandler } from './gmail-sync-handler';
import { createStorageDocumentHandler } from './storage-document-handler';

describe('Job handlers', () => {
  it('invokes Gmail ingestion adapter', async () => {
    const adapter = {
      syncThreads: vi.fn(async () => {}),
    };
    const handler = createGmailSyncHandler(adapter as any);
    await handler({
      id: 'job',
      type: 'gmail-sync',
      payload: { label: 'INBOX' },
      status: 'pending',
      attempts: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    expect(adapter.syncThreads).toHaveBeenCalledWith({ label: 'INBOX' });
  });

  it('downloads object and delegates to storage adapter', async () => {
    const storage = {
      getObject: vi.fn(async () => ({
        bucket: 'test',
        key: 'file.txt',
        contentType: 'text/plain',
        data: new Uint8Array(),
      })),
    };
    const adapter = {
      ingestObject: vi.fn(async () => {}),
    };
    const handler = createStorageDocumentHandler(
      storage as any,
      adapter as any
    );
    await handler({
      id: 'job',
      type: 'storage-document',
      payload: { bucket: 'test', key: 'file.txt' },
      status: 'pending',
      attempts: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(storage.getObject).toHaveBeenCalledWith({
      bucket: 'test',
      key: 'file.txt',
    });
    expect(adapter.ingestObject).toHaveBeenCalled();
  });
});
