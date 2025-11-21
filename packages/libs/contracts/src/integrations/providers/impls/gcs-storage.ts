import { Storage, type StorageOptions } from '@google-cloud/storage';

import type {
  ObjectStorageProvider,
  PutObjectInput,
  GetObjectResult,
  StorageObjectMetadata,
  ListObjectsQuery,
  ListObjectsResult,
  SignedUrlOptions,
  DeleteObjectInput,
} from '../storage';

export interface GoogleCloudStorageProviderOptions {
  bucket: string;
  storage?: Storage;
  clientOptions?: StorageOptions;
}

export class GoogleCloudStorageProvider implements ObjectStorageProvider {
  private readonly storage: Storage;
  private readonly bucketName: string;

  constructor(options: GoogleCloudStorageProviderOptions) {
    this.storage =
      options.storage ?? new Storage(options.clientOptions ?? undefined);
    this.bucketName = options.bucket;
  }

  async putObject(input: PutObjectInput): Promise<StorageObjectMetadata> {
    const bucketName = input.bucket ?? this.bucketName;
    const bucket = this.storage.bucket(bucketName);
    const file = bucket.file(input.key);
    const buffer = toBuffer(input.data);
    await file.save(buffer, {
      resumable: false,
      contentType: input.contentType,
      metadata: input.metadata,
    });
    if (input.makePublic) {
      await file.makePublic();
    }
    const [metadata] = await file.getMetadata();
    return toMetadata(metadata);
  }

  async getObject(input: DeleteObjectInput): Promise<GetObjectResult | null> {
    const bucketName = input.bucket ?? this.bucketName;
    const bucket = this.storage.bucket(bucketName);
    const file = bucket.file(input.key);
    const [exists] = await file.exists();
    if (!exists) return null;
    const [contents] = await file.download();
    const [metadata] = await file.getMetadata();
    return {
      ...toMetadata(metadata),
      data: new Uint8Array(contents),
    };
  }

  async deleteObject(input: DeleteObjectInput): Promise<void> {
    const bucketName = input.bucket ?? this.bucketName;
    const bucket = this.storage.bucket(bucketName);
    const file = bucket.file(input.key);
    await file.delete({ ignoreNotFound: true });
  }

  async generateSignedUrl(options: SignedUrlOptions): Promise<{
    url: string;
    expiresAt: Date;
  }> {
    const bucketName = options.bucket ?? this.bucketName;
    const bucket = this.storage.bucket(bucketName);
    const file = bucket.file(options.key);
    const action = options.method === 'PUT' ? 'write' : 'read';
    const expires = Date.now() + options.expiresInSeconds * 1000;
    const [url] = await file.getSignedUrl({
      action,
      expires,
      contentType: options.contentType,
    });
    return { url, expiresAt: new Date(expires) };
  }

  async listObjects(query: ListObjectsQuery): Promise<ListObjectsResult> {
    const bucketName = query.bucket ?? this.bucketName;
    const bucket = this.storage.bucket(bucketName);
    const [files, nextQuery, response] = await bucket.getFiles({
      prefix: query.prefix,
      maxResults: query.maxResults,
      pageToken: query.pageToken,
    });
    const nextTokenFromQuery =
      typeof nextQuery === 'object' &&
      nextQuery !== null &&
      'pageToken' in nextQuery
        ? (nextQuery as { pageToken?: string }).pageToken
        : undefined;
    const nextTokenFromResponse =
      response && typeof response === 'object' && 'nextPageToken' in response
        ? (response as { nextPageToken?: string }).nextPageToken
        : undefined;
    return {
      objects: files.map((file) => toMetadata(file.metadata)),
      nextPageToken: nextTokenFromQuery ?? nextTokenFromResponse ?? undefined,
    };
  }
}

function toBuffer(data: Uint8Array | ArrayBuffer): Buffer {
  if (data instanceof Uint8Array) {
    return Buffer.from(data);
  }
  return Buffer.from(data);
}

function toMetadata(metadata: any): StorageObjectMetadata {
  return {
    bucket: metadata.bucket ?? '',
    key: metadata.name ?? '',
    sizeBytes: metadata.size ? Number(metadata.size) : undefined,
    contentType: metadata.contentType ?? undefined,
    etag: metadata.etag ?? undefined,
    checksum: metadata.md5Hash ?? undefined,
    lastModified: metadata.updated ? new Date(metadata.updated) : undefined,
    metadata: metadata.metadata,
  };
}
