/**
 * S3-compatible storage implementation for pack tarballs.
 *
 * Uses the standard S3 API via native fetch — no AWS SDK dependency.
 * Works with AWS S3, Cloudflare R2, MinIO, and any S3-compatible provider.
 */
import type { PackStorage } from './types.js';

export interface S3StorageConfig {
  /** S3 endpoint URL (e.g. https://s3.us-east-1.amazonaws.com) */
  endpoint: string;
  /** S3 bucket name */
  bucket: string;
  /** AWS region */
  region: string;
  /** AWS access key ID */
  accessKeyId: string;
  /** AWS secret access key */
  secretAccessKey: string;
  /** Key prefix (default: "packs/") */
  prefix?: string;
}

/**
 * Resolve S3 config from environment variables.
 * Throws if required vars are missing.
 */
export function resolveS3Config(): S3StorageConfig {
  const endpoint = process.env.S3_ENDPOINT;
  const bucket = process.env.S3_BUCKET;
  const region = process.env.S3_REGION ?? 'us-east-1';
  const accessKeyId =
    process.env.S3_ACCESS_KEY_ID ?? process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey =
    process.env.S3_SECRET_ACCESS_KEY ?? process.env.AWS_SECRET_ACCESS_KEY;

  if (!endpoint) throw new Error('S3_ENDPOINT is required');
  if (!bucket) throw new Error('S3_BUCKET is required');
  if (!accessKeyId)
    throw new Error('S3_ACCESS_KEY_ID or AWS_ACCESS_KEY_ID is required');
  if (!secretAccessKey) {
    throw new Error(
      'S3_SECRET_ACCESS_KEY or AWS_SECRET_ACCESS_KEY is required'
    );
  }

  return {
    endpoint,
    bucket,
    region,
    accessKeyId,
    secretAccessKey,
    prefix: process.env.S3_PREFIX ?? 'packs/',
  };
}

export class S3Storage implements PackStorage {
  private config: S3StorageConfig;
  private prefix: string;

  constructor(config: S3StorageConfig) {
    this.config = config;
    this.prefix = config.prefix ?? 'packs/';
  }

  async put(packName: string, version: string, data: Buffer): Promise<string> {
    const key = this.key(packName, version);
    const url = this.objectUrl(key);

    const res = await fetch(url, {
      method: 'PUT',
      headers: await this.signedHeaders('PUT', key, {
        'Content-Type': 'application/gzip',
        'Content-Length': String(data.length),
      }),
      body: new Uint8Array(data),
    });

    if (!res.ok) {
      throw new Error(`S3 PUT failed: ${res.status} ${await res.text()}`);
    }

    return `/packs/${packName}/versions/${version}/download`;
  }

  async get(packName: string, version: string): Promise<Buffer | null> {
    const key = this.key(packName, version);
    const url = this.objectUrl(key);

    const res = await fetch(url, {
      method: 'GET',
      headers: await this.signedHeaders('GET', key),
    });

    if (res.status === 404) return null;
    if (!res.ok) {
      throw new Error(`S3 GET failed: ${res.status} ${await res.text()}`);
    }

    return Buffer.from(await res.arrayBuffer());
  }

  async delete(packName: string, version: string): Promise<void> {
    const key = this.key(packName, version);
    const url = this.objectUrl(key);

    const res = await fetch(url, {
      method: 'DELETE',
      headers: await this.signedHeaders('DELETE', key),
    });

    if (!res.ok && res.status !== 404) {
      throw new Error(`S3 DELETE failed: ${res.status} ${await res.text()}`);
    }
  }

  async exists(packName: string, version: string): Promise<boolean> {
    const key = this.key(packName, version);
    const url = this.objectUrl(key);

    const res = await fetch(url, {
      method: 'HEAD',
      headers: await this.signedHeaders('HEAD', key),
    });

    return res.ok;
  }

  private key(packName: string, version: string): string {
    return `${this.prefix}${packName}/${version}.tgz`;
  }

  private objectUrl(key: string): string {
    return `${this.config.endpoint}/${this.config.bucket}/${key}`;
  }

  /**
   * Generate AWS Signature V4 headers.
   * Uses Bun's built-in crypto for HMAC-SHA256.
   */
  private async signedHeaders(
    method: string,
    key: string,
    extra: Record<string, string> = {}
  ): Promise<Record<string, string>> {
    const now = new Date();
    const dateStamp = now.toISOString().replace(/[-:]/g, '').slice(0, 8);
    const amzDate = now.toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
    const host = new URL(this.config.endpoint).host;

    const credentialScope = `${dateStamp}/${this.config.region}/s3/aws4_request`;
    const canonicalUri = `/${this.config.bucket}/${key}`;

    // Build canonical headers
    const headers: Record<string, string> = {
      host,
      'x-amz-date': amzDate,
      'x-amz-content-sha256': 'UNSIGNED-PAYLOAD',
      ...extra,
    };

    const sortedKeys = Object.keys(headers).sort();
    const canonicalHeaders = sortedKeys
      .map((k) => `${k.toLowerCase()}:${(headers[k] ?? '').trim()}`)
      .join('\n');
    const signedHeaders = sortedKeys.map((k) => k.toLowerCase()).join(';');

    // Canonical request
    const canonicalRequest = [
      method,
      canonicalUri,
      '', // query string
      canonicalHeaders + '\n',
      signedHeaders,
      'UNSIGNED-PAYLOAD',
    ].join('\n');

    // String to sign
    const hasher = new Bun.CryptoHasher('sha256');
    hasher.update(canonicalRequest);
    const canonicalHash = hasher.digest('hex');

    const stringToSign = [
      'AWS4-HMAC-SHA256',
      amzDate,
      credentialScope,
      canonicalHash,
    ].join('\n');

    // Signing key
    const kDate = hmacSha256(`AWS4${this.config.secretAccessKey}`, dateStamp);
    const kRegion = hmacSha256(kDate, this.config.region);
    const kService = hmacSha256(kRegion, 's3');
    const kSigning = hmacSha256(kService, 'aws4_request');

    // Signature
    const signature = hmacSha256Hex(kSigning, stringToSign);

    return {
      ...headers,
      Authorization: `AWS4-HMAC-SHA256 Credential=${this.config.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
    };
  }
}

/** HMAC-SHA256, returns raw bytes. */
function hmacSha256(key: string | Buffer, data: string): Buffer {
  const hmac = new Bun.CryptoHasher('sha256', key);
  hmac.update(data);
  return Buffer.from(hmac.digest());
}

/** HMAC-SHA256, returns hex string. */
function hmacSha256Hex(key: string | Buffer, data: string): string {
  const hmac = new Bun.CryptoHasher('sha256', key);
  hmac.update(data);
  return hmac.digest('hex');
}
