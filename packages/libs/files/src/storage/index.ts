/**
 * File storage adapters for different backends.
 */

// ============ Types ============

export type StorageProvider = 'LOCAL' | 'S3' | 'GCS' | 'AZURE' | 'CLOUDFLARE';

export interface StorageFile {
  path: string;
  size: number;
  mimeType: string;
  checksum?: string;
  etag?: string;
  metadata?: Record<string, string>;
}

export interface UploadOptions {
  /** Target path in storage */
  path: string;
  /** File content */
  content: Buffer | string;
  /** MIME type */
  mimeType: string;
  /** Additional metadata */
  metadata?: Record<string, string>;
  /** Whether file should be publicly accessible */
  isPublic?: boolean;
}

export interface PresignedUploadOptions {
  /** Target path in storage */
  path: string;
  /** MIME type */
  mimeType: string;
  /** File size in bytes */
  size: number;
  /** Expiration time in seconds */
  expiresIn?: number;
  /** Additional conditions */
  conditions?: Record<string, unknown>[];
}

export interface PresignedDownloadOptions {
  /** File path in storage */
  path: string;
  /** Expiration time in seconds */
  expiresIn?: number;
  /** Response content disposition */
  contentDisposition?: string;
}

export interface PresignedUrl {
  url: string;
  fields?: Record<string, string>;
  expiresAt: Date;
}

export interface ListOptions {
  /** Path prefix */
  prefix?: string;
  /** Maximum results */
  limit?: number;
  /** Continuation token */
  cursor?: string;
}

export interface ListResult {
  files: StorageFile[];
  cursor?: string;
  hasMore: boolean;
}

// ============ Storage Adapter Interface ============

export interface StorageAdapter {
  /** Storage provider type */
  readonly provider: StorageProvider;

  /**
   * Upload a file to storage.
   */
  upload(options: UploadOptions): Promise<StorageFile>;

  /**
   * Download a file from storage.
   */
  download(path: string): Promise<Buffer>;

  /**
   * Delete a file from storage.
   */
  delete(path: string): Promise<void>;

  /**
   * Check if a file exists.
   */
  exists(path: string): Promise<boolean>;

  /**
   * Get file metadata.
   */
  getMetadata(path: string): Promise<StorageFile | null>;

  /**
   * List files in a directory.
   */
  list(options?: ListOptions): Promise<ListResult>;

  /**
   * Generate a presigned URL for uploading.
   */
  createPresignedUpload(options: PresignedUploadOptions): Promise<PresignedUrl>;

  /**
   * Generate a presigned URL for downloading.
   */
  createPresignedDownload(
    options: PresignedDownloadOptions
  ): Promise<PresignedUrl>;

  /**
   * Get public URL for a file (if applicable).
   */
  getPublicUrl(path: string): string | null;

  /**
   * Copy a file within storage.
   */
  copy(sourcePath: string, destinationPath: string): Promise<StorageFile>;
}

// ============ Local Storage Adapter ============

import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as crypto from 'node:crypto';

export interface LocalStorageOptions {
  /** Base directory for file storage */
  basePath: string;
  /** Base URL for serving files (optional) */
  baseUrl?: string;
}

/**
 * Local filesystem storage adapter.
 * For development and testing purposes.
 */
export class LocalStorageAdapter implements StorageAdapter {
  readonly provider: StorageProvider = 'LOCAL';
  private basePath: string;
  private baseUrl?: string;

  constructor(options: LocalStorageOptions) {
    this.basePath = options.basePath;
    this.baseUrl = options.baseUrl;
  }

  async upload(options: UploadOptions): Promise<StorageFile> {
    const fullPath = path.join(this.basePath, options.path);
    const dir = path.dirname(fullPath);

    // Ensure directory exists
    await fs.mkdir(dir, { recursive: true });

    // Write file
    const content =
      typeof options.content === 'string'
        ? Buffer.from(options.content, 'base64')
        : options.content;

    await fs.writeFile(fullPath, content);

    // Calculate checksum
    const checksum = crypto.createHash('sha256').update(content).digest('hex');

    return {
      path: options.path,
      size: content.length,
      mimeType: options.mimeType,
      checksum,
      metadata: options.metadata,
    };
  }

  async download(filePath: string): Promise<Buffer> {
    const fullPath = path.join(this.basePath, filePath);
    return fs.readFile(fullPath);
  }

  async delete(filePath: string): Promise<void> {
    const fullPath = path.join(this.basePath, filePath);
    await fs.unlink(fullPath);
  }

  async exists(filePath: string): Promise<boolean> {
    const fullPath = path.join(this.basePath, filePath);
    try {
      await fs.access(fullPath);
      return true;
    } catch {
      return false;
    }
  }

  async getMetadata(filePath: string): Promise<StorageFile | null> {
    const fullPath = path.join(this.basePath, filePath);
    try {
      const stat = await fs.stat(fullPath);
      return {
        path: filePath,
        size: stat.size,
        mimeType: 'application/octet-stream', // Would need mime type detection
      };
    } catch {
      return null;
    }
  }

  async list(options?: ListOptions): Promise<ListResult> {
    const dir = options?.prefix
      ? path.join(this.basePath, options.prefix)
      : this.basePath;

    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      const files: StorageFile[] = [];

      for (const entry of entries) {
        if (entry.isFile()) {
          const filePath = options?.prefix
            ? path.join(options.prefix, entry.name)
            : entry.name;
          const stat = await fs.stat(path.join(dir, entry.name));
          files.push({
            path: filePath,
            size: stat.size,
            mimeType: 'application/octet-stream',
          });
        }
      }

      const limit = options?.limit || files.length;
      return {
        files: files.slice(0, limit),
        hasMore: files.length > limit,
      };
    } catch {
      return { files: [], hasMore: false };
    }
  }

  async createPresignedUpload(
    options: PresignedUploadOptions
  ): Promise<PresignedUrl> {
    // Local storage doesn't support real presigned URLs
    // Return a placeholder that would work with a local upload endpoint
    const expiresIn = options.expiresIn || 3600;
    const expiresAt = new Date(Date.now() + expiresIn * 1000);

    return {
      url: this.baseUrl
        ? `${this.baseUrl}/upload?path=${encodeURIComponent(options.path)}`
        : `/upload?path=${encodeURIComponent(options.path)}`,
      fields: {
        path: options.path,
        mimeType: options.mimeType,
      },
      expiresAt,
    };
  }

  async createPresignedDownload(
    options: PresignedDownloadOptions
  ): Promise<PresignedUrl> {
    const expiresIn = options.expiresIn || 3600;
    const expiresAt = new Date(Date.now() + expiresIn * 1000);

    return {
      url: this.baseUrl
        ? `${this.baseUrl}/download/${options.path}`
        : `/download/${options.path}`,
      expiresAt,
    };
  }

  getPublicUrl(filePath: string): string | null {
    if (!this.baseUrl) return null;
    return `${this.baseUrl}/${filePath}`;
  }

  async copy(
    sourcePath: string,
    destinationPath: string
  ): Promise<StorageFile> {
    const sourceFullPath = path.join(this.basePath, sourcePath);
    const destFullPath = path.join(this.basePath, destinationPath);
    const destDir = path.dirname(destFullPath);

    await fs.mkdir(destDir, { recursive: true });
    await fs.copyFile(sourceFullPath, destFullPath);

    const stat = await fs.stat(destFullPath);
    return {
      path: destinationPath,
      size: stat.size,
      mimeType: 'application/octet-stream',
    };
  }
}

// ============ S3 Storage Adapter Interface ============

export interface S3StorageOptions {
  /** S3 bucket name */
  bucket: string;
  /** AWS region */
  region: string;
  /** AWS access key ID */
  accessKeyId?: string;
  /** AWS secret access key */
  secretAccessKey?: string;
  /** Endpoint URL (for S3-compatible services) */
  endpoint?: string;
  /** Force path style (for S3-compatible services) */
  forcePathStyle?: boolean;
  /** Default ACL for uploads */
  defaultAcl?: 'private' | 'public-read';
}

/**
 * S3 storage adapter interface.
 * Implementation would use AWS SDK or compatible client.
 *
 * This is a placeholder that defines the interface.
 * Actual implementation would require @aws-sdk/client-s3 dependency.
 */
export class S3StorageAdapter implements StorageAdapter {
  readonly provider: StorageProvider = 'S3';
  private config: S3StorageOptions;

  constructor(options: S3StorageOptions) {
    this.config = options;
  }

  async upload(options: UploadOptions): Promise<StorageFile> {
    // Placeholder - actual implementation would use S3 SDK
    throw new Error(
      'S3 adapter requires @aws-sdk/client-s3. Install it and implement the upload method.'
    );
  }

  async download(filePath: string): Promise<Buffer> {
    throw new Error(
      'S3 adapter requires @aws-sdk/client-s3. Install it and implement the download method.'
    );
  }

  async delete(filePath: string): Promise<void> {
    throw new Error(
      'S3 adapter requires @aws-sdk/client-s3. Install it and implement the delete method.'
    );
  }

  async exists(filePath: string): Promise<boolean> {
    throw new Error(
      'S3 adapter requires @aws-sdk/client-s3. Install it and implement the exists method.'
    );
  }

  async getMetadata(filePath: string): Promise<StorageFile | null> {
    throw new Error(
      'S3 adapter requires @aws-sdk/client-s3. Install it and implement the getMetadata method.'
    );
  }

  async list(options?: ListOptions): Promise<ListResult> {
    throw new Error(
      'S3 adapter requires @aws-sdk/client-s3. Install it and implement the list method.'
    );
  }

  async createPresignedUpload(
    options: PresignedUploadOptions
  ): Promise<PresignedUrl> {
    throw new Error(
      'S3 adapter requires @aws-sdk/client-s3. Install it and implement the createPresignedUpload method.'
    );
  }

  async createPresignedDownload(
    options: PresignedDownloadOptions
  ): Promise<PresignedUrl> {
    throw new Error(
      'S3 adapter requires @aws-sdk/client-s3. Install it and implement the createPresignedDownload method.'
    );
  }

  getPublicUrl(filePath: string): string | null {
    const { bucket, region, endpoint } = this.config;
    if (endpoint) {
      return `${endpoint}/${bucket}/${filePath}`;
    }
    return `https://${bucket}.s3.${region}.amazonaws.com/${filePath}`;
  }

  async copy(
    sourcePath: string,
    destinationPath: string
  ): Promise<StorageFile> {
    throw new Error(
      'S3 adapter requires @aws-sdk/client-s3. Install it and implement the copy method.'
    );
  }
}

// ============ In-Memory Storage Adapter ============

/**
 * In-memory storage adapter for testing.
 */
export class InMemoryStorageAdapter implements StorageAdapter {
  readonly provider: StorageProvider = 'LOCAL';
  private files = new Map<string, { content: Buffer; metadata: StorageFile }>();

  async upload(options: UploadOptions): Promise<StorageFile> {
    const content =
      typeof options.content === 'string'
        ? Buffer.from(options.content, 'base64')
        : options.content;

    const checksum = crypto.createHash('sha256').update(content).digest('hex');

    const metadata: StorageFile = {
      path: options.path,
      size: content.length,
      mimeType: options.mimeType,
      checksum,
      metadata: options.metadata,
    };

    this.files.set(options.path, { content, metadata });
    return metadata;
  }

  async download(filePath: string): Promise<Buffer> {
    const file = this.files.get(filePath);
    if (!file) {
      throw new Error(`File not found: ${filePath}`);
    }
    return file.content;
  }

  async delete(filePath: string): Promise<void> {
    this.files.delete(filePath);
  }

  async exists(filePath: string): Promise<boolean> {
    return this.files.has(filePath);
  }

  async getMetadata(filePath: string): Promise<StorageFile | null> {
    const file = this.files.get(filePath);
    return file?.metadata || null;
  }

  async list(options?: ListOptions): Promise<ListResult> {
    const prefix = options?.prefix || '';
    const files: StorageFile[] = [];

    for (const [path, file] of this.files) {
      if (path.startsWith(prefix)) {
        files.push(file.metadata);
      }
    }

    const limit = options?.limit || files.length;
    return {
      files: files.slice(0, limit),
      hasMore: files.length > limit,
    };
  }

  async createPresignedUpload(
    options: PresignedUploadOptions
  ): Promise<PresignedUrl> {
    const expiresAt = new Date(Date.now() + (options.expiresIn || 3600) * 1000);
    return {
      url: `/upload?path=${encodeURIComponent(options.path)}`,
      fields: { path: options.path },
      expiresAt,
    };
  }

  async createPresignedDownload(
    options: PresignedDownloadOptions
  ): Promise<PresignedUrl> {
    const expiresAt = new Date(Date.now() + (options.expiresIn || 3600) * 1000);
    return {
      url: `/download/${options.path}`,
      expiresAt,
    };
  }

  getPublicUrl(filePath: string): string | null {
    return `/files/${filePath}`;
  }

  async copy(
    sourcePath: string,
    destinationPath: string
  ): Promise<StorageFile> {
    const source = this.files.get(sourcePath);
    if (!source) {
      throw new Error(`Source file not found: ${sourcePath}`);
    }

    const metadata: StorageFile = {
      ...source.metadata,
      path: destinationPath,
    };

    this.files.set(destinationPath, { content: source.content, metadata });
    return metadata;
  }

  clear(): void {
    this.files.clear();
  }
}

// ============ Factory ============

export interface StorageConfig {
  provider: StorageProvider;
  local?: LocalStorageOptions;
  s3?: S3StorageOptions;
}

/**
 * Create a storage adapter based on configuration.
 */
export function createStorageAdapter(config: StorageConfig): StorageAdapter {
  switch (config.provider) {
    case 'LOCAL':
      if (!config.local) {
        throw new Error('Local storage configuration required');
      }
      return new LocalStorageAdapter(config.local);

    case 'S3':
      if (!config.s3) {
        throw new Error('S3 storage configuration required');
      }
      return new S3StorageAdapter(config.s3);

    default:
      throw new Error(`Unsupported storage provider: ${config.provider}`);
  }
}

