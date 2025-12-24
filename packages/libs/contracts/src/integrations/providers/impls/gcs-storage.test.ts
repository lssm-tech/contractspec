import { describe, expect, it, vi } from 'bun:test';

import { GoogleCloudStorageProvider } from './gcs-storage';

describe('GoogleCloudStorageProvider', () => {
  it('uploads objects and returns metadata', async () => {
    const storage = createMockStorage();
    const provider = new GoogleCloudStorageProvider({
      bucket: 'test-bucket',
      storage,
    });

    const metadata = await provider.putObject({
      bucket: 'test-bucket',
      key: 'folder/object.txt',
      data: new Uint8Array([1, 2, 3]),
      contentType: 'text/plain',
    });

    expect(storage.bucket).toHaveBeenCalledWith('test-bucket');
    expect(metadata.key).toBe('folder/object.txt');
  });

  it('downloads objects', async () => {
    const storage = createMockStorage();
    const provider = new GoogleCloudStorageProvider({
      bucket: 'test-bucket',
      storage,
    });

    const result = await provider.getObject({
      bucket: 'test-bucket',
      key: 'folder/object.txt',
    });

    expect(result?.data).toBeInstanceOf(Uint8Array);
    expect(result?.data?.length).toBe(3);
  });

  it('generates signed urls', async () => {
    const storage = createMockStorage();
    const provider = new GoogleCloudStorageProvider({
      bucket: 'test-bucket',
      storage,
    });

    const url = await provider.generateSignedUrl({
      bucket: 'test-bucket',
      key: 'file',
      expiresInSeconds: 60,
      method: 'GET',
    });

    expect(url.url).toContain('https://example.com');
  });

  it('lists objects', async () => {
    const storage = createMockStorage();
    const provider = new GoogleCloudStorageProvider({
      bucket: 'test-bucket',
      storage,
    });

    const result = await provider.listObjects({
      bucket: 'test-bucket',
      prefix: 'folder/',
    });

    expect(result.objects).toHaveLength(1);
  });
});

function createMockStorage() {
  const metadata = {
    bucket: 'test-bucket',
    key: 'folder/object.txt',
    size: '3',
    contentType: 'text/plain',
    updated: new Date().toISOString(),
  };

  const file = {
    save: vi.fn(async () => {
      /* noop */
    }),
    makePublic: vi.fn(async () => {
      /* noop */
    }),
    getMetadata: vi.fn(async () => [metadata]),
    exists: vi.fn(async () => [true]),
    download: vi.fn(async () => [Buffer.from([1, 2, 3])]),
    delete: vi.fn(async () => {
      /* noop */
    }),
    getSignedUrl: vi.fn(async () => ['https://example.com/signed']),
    metadata,
  };

  const bucket = {
    file: vi.fn(() => file),
    getFiles: vi.fn(async () => [[{ metadata }], null, {}]),
  };

  return {
    bucket: vi.fn(() => bucket),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as unknown as any;
}
