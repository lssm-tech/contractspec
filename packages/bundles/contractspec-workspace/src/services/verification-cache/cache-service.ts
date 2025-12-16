/**
 * Verification cache service.
 *
 * Provides content-hash based caching for verification results
 * to avoid redundant checks and reduce AI costs.
 */

import { createHash } from 'crypto';
import type {
  VerificationReport,
  VerificationTier,
} from '@lssm/lib.contracts/llm';
import type {
  CacheKeyString,
  CacheLookupResult,
  CacheMissReason,
  CacheStats,
  CacheStorageAdapter,
  VerificationCacheConfig,
  VerificationCacheEntry,
  VerificationCacheKey,
} from './types';
import { DEFAULT_CACHE_CONFIG } from './types';

/**
 * Compute SHA256 hash of content.
 */
export function computeContentHash(content: string): string {
  return createHash('sha256').update(content).digest('hex');
}

/**
 * Convert cache key to string for storage.
 */
export function cacheKeyToString(key: VerificationCacheKey): CacheKeyString {
  const parts = [
    `spec:${key.specHash.substring(0, 16)}`,
    `impl:${key.implHash.substring(0, 16)}`,
    `tier:${key.tier}`,
  ];

  if (key.aiModelVersion) {
    parts.push(`model:${key.aiModelVersion}`);
  }

  return parts.join('|');
}

/**
 * Parse cache key string back to object.
 */
export function stringToCacheKey(
  str: CacheKeyString
): VerificationCacheKey | null {
  try {
    const parts = str.split('|');
    const keyMap = new Map<string, string>();

    for (const part of parts) {
      const [prefix, value] = part.split(':');
      if (prefix && value) {
        keyMap.set(prefix, value);
      }
    }

    const specHash = keyMap.get('spec');
    const implHash = keyMap.get('impl');
    const tier = keyMap.get('tier') as VerificationTier;

    if (!specHash || !implHash || !tier) {
      return null;
    }

    return {
      specHash,
      implHash,
      tier,
      aiModelVersion: keyMap.get('model'),
    };
  } catch {
    return null;
  }
}

/**
 * Get TTL for a specific tier.
 */
function getTtlForTier(
  tier: VerificationTier,
  config: Required<VerificationCacheConfig>
): number {
  switch (tier) {
    case 'structure':
      return config.structureTtlMs;
    case 'behavior':
      return config.behaviorTtlMs;
    case 'ai_review':
      return config.aiTtlMs;
    default:
      return config.defaultTtlMs;
  }
}

/**
 * Verification cache service.
 */
export class VerificationCacheService {
  private storage: CacheStorageAdapter;
  private config: Required<VerificationCacheConfig>;
  private stats: { hits: number; misses: number };

  constructor(
    storage: CacheStorageAdapter,
    config: Partial<VerificationCacheConfig> = {}
  ) {
    this.storage = storage;
    this.config = { ...DEFAULT_CACHE_CONFIG, ...config };
    this.stats = { hits: 0, misses: 0 };
  }

  /**
   * Create a cache key from spec and implementation content.
   */
  createKey(
    specContent: string,
    implContent: string,
    tier: VerificationTier,
    aiModelVersion?: string
  ): VerificationCacheKey {
    return {
      specHash: computeContentHash(specContent),
      implHash: computeContentHash(implContent),
      tier,
      aiModelVersion: tier === 'ai_review' ? aiModelVersion : undefined,
    };
  }

  /**
   * Look up a cached verification result.
   */
  async lookup(key: VerificationCacheKey): Promise<CacheLookupResult> {
    const keyStr = cacheKeyToString(key);
    const entry = await this.storage.get(keyStr);

    if (!entry) {
      this.stats.misses++;
      return { hit: false, reason: 'not_found' };
    }

    // Check expiration
    if (entry.meta.expiresAt) {
      const expiresAt = new Date(entry.meta.expiresAt).getTime();
      if (Date.now() > expiresAt) {
        this.stats.misses++;
        await this.storage.delete(keyStr);
        return { hit: false, reason: 'expired' };
      }
    }

    // Validate hashes still match
    if (entry.key.specHash !== key.specHash) {
      this.stats.misses++;
      return { hit: false, reason: 'spec_changed' };
    }

    if (entry.key.implHash !== key.implHash) {
      this.stats.misses++;
      return { hit: false, reason: 'impl_changed' };
    }

    // For AI tier, check model version
    if (
      key.tier === 'ai_review' &&
      key.aiModelVersion &&
      entry.key.aiModelVersion !== key.aiModelVersion
    ) {
      this.stats.misses++;
      return { hit: false, reason: 'model_changed' };
    }

    this.stats.hits++;
    return { hit: true, entry };
  }

  /**
   * Store a verification result in cache.
   */
  async store(
    key: VerificationCacheKey,
    result: VerificationReport,
    options: {
      dependencies?: string[];
      specName?: string;
      implPath?: string;
    } = {}
  ): Promise<void> {
    const keyStr = cacheKeyToString(key);
    const ttl = getTtlForTier(key.tier, this.config);

    const entry: VerificationCacheEntry = {
      key,
      result,
      meta: {
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + ttl).toISOString(),
        dependencies: options.dependencies ?? [],
        specName: options.specName,
        implPath: options.implPath,
      },
    };

    await this.storage.set(keyStr, entry);

    // Prune if over limit
    await this.pruneIfNeeded();
  }

  /**
   * Invalidate cache entries for a specific file.
   * Used when a file changes to invalidate dependent caches.
   */
  async invalidateForFile(filePath: string): Promise<number> {
    if (!this.config.transitiveInvalidation) {
      return 0;
    }

    const keys = await this.storage.keys();
    let invalidated = 0;

    for (const keyStr of keys) {
      const entry = await this.storage.get(keyStr);
      if (!entry) continue;

      // Check if this file is in dependencies
      if (entry.meta.dependencies.includes(filePath)) {
        await this.storage.delete(keyStr);
        invalidated++;
      }

      // Check if file matches spec or impl path
      if (
        entry.meta.specName === filePath ||
        entry.meta.implPath === filePath
      ) {
        await this.storage.delete(keyStr);
        invalidated++;
      }
    }

    return invalidated;
  }

  /**
   * Invalidate all cache entries for a specific spec.
   */
  async invalidateForSpec(specHash: string): Promise<number> {
    const keys = await this.storage.keys();
    let invalidated = 0;

    for (const keyStr of keys) {
      const parsed = stringToCacheKey(keyStr);
      if (parsed && parsed.specHash.startsWith(specHash.substring(0, 16))) {
        await this.storage.delete(keyStr);
        invalidated++;
      }
    }

    return invalidated;
  }

  /**
   * Clear all cache entries.
   */
  async clear(): Promise<void> {
    await this.storage.clear();
    this.stats = { hits: 0, misses: 0 };
  }

  /**
   * Get cache statistics.
   */
  async getStats(): Promise<CacheStats> {
    const storageStats = await this.storage.stats?.();

    return {
      totalEntries:
        storageStats?.entryCount ?? (await this.storage.keys()).length,
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate:
        this.stats.hits + this.stats.misses > 0
          ? Math.round(
              (this.stats.hits / (this.stats.hits + this.stats.misses)) * 100
            )
          : 0,
      memoryUsage: storageStats?.memoryUsage,
    };
  }

  /**
   * Prune cache if over the maximum entry limit.
   */
  private async pruneIfNeeded(): Promise<void> {
    const keys = await this.storage.keys();

    if (keys.length <= this.config.maxEntries) {
      return;
    }

    // Get all entries with their creation times
    const entries: { key: string; createdAt: number }[] = [];

    for (const keyStr of keys) {
      const entry = await this.storage.get(keyStr);
      if (entry) {
        entries.push({
          key: keyStr,
          createdAt: new Date(entry.meta.createdAt).getTime(),
        });
      }
    }

    // Sort by creation time (oldest first)
    entries.sort((a, b) => a.createdAt - b.createdAt);

    // Remove oldest entries until under limit
    const toRemove = entries.length - this.config.maxEntries;
    for (let i = 0; i < toRemove; i++) {
      const entry = entries[i];
      if (entry) {
        await this.storage.delete(entry.key);
      }
    }
  }
}

/**
 * Create a verification cache service with the given storage adapter.
 */
export function createVerificationCacheService(
  storage: CacheStorageAdapter,
  config?: Partial<VerificationCacheConfig>
): VerificationCacheService {
  return new VerificationCacheService(storage, config);
}
