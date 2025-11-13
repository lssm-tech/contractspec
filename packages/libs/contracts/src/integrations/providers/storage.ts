export interface StorageObjectMetadata {
  bucket: string;
  key: string;
  sizeBytes?: number;
  contentType?: string;
  etag?: string;
  checksum?: string;
  lastModified?: Date;
  metadata?: Record<string, string>;
}

export type StorageObjectBody =
  | { data: Uint8Array; stream?: never }
  | { data?: never; stream: AsyncIterable<Uint8Array> };

export type GetObjectResult = StorageObjectMetadata & StorageObjectBody;

export interface PutObjectInput {
  bucket: string;
  key: string;
  data: Uint8Array | ArrayBuffer;
  contentType?: string;
  metadata?: Record<string, string>;
  makePublic?: boolean;
}

export interface DeleteObjectInput {
  bucket: string;
  key: string;
}

export interface SignedUrlOptions {
  bucket: string;
  key: string;
  expiresInSeconds: number;
  method?: 'GET' | 'PUT';
  contentType?: string;
}

export interface ListObjectsQuery {
  bucket: string;
  prefix?: string;
  maxResults?: number;
  pageToken?: string;
}

export interface ListObjectsResult {
  objects: StorageObjectMetadata[];
  nextPageToken?: string;
}

export interface ObjectStorageProvider {
  putObject(input: PutObjectInput): Promise<StorageObjectMetadata>;
  getObject(input: DeleteObjectInput): Promise<GetObjectResult | null>;
  deleteObject(input: DeleteObjectInput): Promise<void>;
  generateSignedUrl(
    options: SignedUrlOptions
  ): Promise<{ url: string; expiresAt: Date }>;
  listObjects(query: ListObjectsQuery): Promise<ListObjectsResult>;
}


