/**
 * In-memory cache storage adapter.
 *
 * Suitable for tests and single-process environments.
 * Data is lost on process restart.
 */

import type {
  CacheKeyString,
  CacheStorageAdapter,
  VerificationCacheEntry,
} from '../types';

/**
 * In-memory storage adapter using a Map.
 */
export class InMemoryCacheStorage implements CacheStorageAdapter {
  private cache = new Map<CacheKeyString, VerificationCacheEntry>();

  async get(key: CacheKeyString): Promise<VerificationCacheEntry | null> {
    return this.cache.get(key) ?? null;
  }

  async set(key: CacheKeyString, entry: VerificationCacheEntry): Promise<void> {
    this.cache.set(key, entry);
  }

  async delete(key: CacheKeyString): Promise<boolean> {
    return this.cache.delete(key);
  }

  async has(key: CacheKeyString): Promise<boolean> {
    return this.cache.has(key);
  }

  async keys(): Promise<CacheKeyString[]> {
    return Array.from(this.cache.keys());
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }

  async stats(): Promise<{ entryCount: number; memoryUsage?: number }> {
    // Estimate memory usage (rough approximation)
    let memoryUsage = 0;
    for (const [key, value] of this.cache.entries()) {
      memoryUsage += key.length * 2; // UTF-16 string
      memoryUsage += JSON.stringify(value).length * 2;
    }

    return {
      entryCount: this.cache.size,
      memoryUsage,
    };
  }
}

/**
 * Create an in-memory cache storage adapter.
 */
export function createInMemoryCacheStorage(): InMemoryCacheStorage {
  return new InMemoryCacheStorage();
}
