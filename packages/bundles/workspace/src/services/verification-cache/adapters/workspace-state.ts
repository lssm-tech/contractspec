/**
 * Workspace state cache storage adapter.
 *
 * Generic adapter for key-value stores like VSCode's ExtensionContext.workspaceState.
 * Can also be used with localStorage-like APIs.
 */

import type {
  CacheKeyString,
  CacheStorageAdapter,
  VerificationCacheEntry,
} from '../types';

/**
 * Interface for key-value store (compatible with VSCode's Memento).
 */
export interface KeyValueStore {
  get<T>(key: string): T | undefined;
  update(key: string, value: unknown): Thenable<void>;
  keys?(): readonly string[];
}

/**
 * Cache key prefix to avoid collisions.
 */
const CACHE_PREFIX = 'contractspec.verification-cache.';

/**
 * Index key for tracking all cache keys.
 */
const INDEX_KEY = `${CACHE_PREFIX}__index__`;

/**
 * Workspace state storage adapter.
 */
export class WorkspaceStateCacheStorage implements CacheStorageAdapter {
  private store: KeyValueStore;
  private keyIndex: Set<string>;

  constructor(store: KeyValueStore) {
    this.store = store;
    this.keyIndex = new Set(this.loadKeyIndex());
  }

  /**
   * Load the key index from storage.
   */
  private loadKeyIndex(): string[] {
    try {
      const index = this.store.get<string[]>(INDEX_KEY);
      return index ?? [];
    } catch {
      return [];
    }
  }

  /**
   * Save the key index to storage.
   */
  private async saveKeyIndex(): Promise<void> {
    await this.store.update(INDEX_KEY, Array.from(this.keyIndex));
  }

  /**
   * Get the storage key for a cache key.
   */
  private getStorageKey(key: CacheKeyString): string {
    return `${CACHE_PREFIX}${key}`;
  }

  async get(key: CacheKeyString): Promise<VerificationCacheEntry | null> {
    const storageKey = this.getStorageKey(key);
    const entry = this.store.get<VerificationCacheEntry>(storageKey);
    return entry ?? null;
  }

  async set(key: CacheKeyString, entry: VerificationCacheEntry): Promise<void> {
    const storageKey = this.getStorageKey(key);
    await this.store.update(storageKey, entry);

    if (!this.keyIndex.has(key)) {
      this.keyIndex.add(key);
      await this.saveKeyIndex();
    }
  }

  async delete(key: CacheKeyString): Promise<boolean> {
    const storageKey = this.getStorageKey(key);
    const existed = this.keyIndex.has(key);

    if (existed) {
      await this.store.update(storageKey, undefined);
      this.keyIndex.delete(key);
      await this.saveKeyIndex();
    }

    return existed;
  }

  async has(key: CacheKeyString): Promise<boolean> {
    return this.keyIndex.has(key);
  }

  async keys(): Promise<CacheKeyString[]> {
    return Array.from(this.keyIndex);
  }

  async clear(): Promise<void> {
    // Delete all entries
    for (const key of this.keyIndex) {
      const storageKey = this.getStorageKey(key);
      await this.store.update(storageKey, undefined);
    }

    // Clear index
    this.keyIndex.clear();
    await this.saveKeyIndex();
  }

  async stats(): Promise<{ entryCount: number; memoryUsage?: number }> {
    return {
      entryCount: this.keyIndex.size,
    };
  }
}

/**
 * Create a workspace state cache storage adapter.
 */
export function createWorkspaceStateCacheStorage(
  store: KeyValueStore
): WorkspaceStateCacheStorage {
  return new WorkspaceStateCacheStorage(store);
}
