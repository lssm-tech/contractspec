/**
 * Storage factory — selects storage backend based on STORAGE_BACKEND env var.
 *
 * Usage:
 *   import { getStorage } from './storage/factory.js';
 *   const storage = getStorage();
 */
import type { PackStorage } from './types.js';
import { LocalStorage } from './local.js';
import { S3Storage, resolveS3Config } from './s3.js';

export type StorageBackend = 'local' | 's3';

let instance: PackStorage | null = null;

/**
 * Get the configured storage instance (singleton).
 *
 * Set `STORAGE_BACKEND=s3` to use S3-compatible storage.
 * Defaults to local filesystem storage.
 */
export function getStorage(): PackStorage {
  if (instance) return instance;

  const backend = (process.env.STORAGE_BACKEND ?? 'local') as StorageBackend;

  switch (backend) {
    case 's3': {
      const config = resolveS3Config();
      instance = new S3Storage(config);
      break;
    }
    case 'local':
    default: {
      instance = new LocalStorage();
      break;
    }
  }

  return instance;
}

/**
 * Override the storage instance (for testing).
 */
export function setStorage(storage: PackStorage): void {
  instance = storage;
}

/**
 * Reset storage instance (for testing).
 */
export function resetStorage(): void {
  instance = null;
}
