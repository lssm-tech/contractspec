/**
 * Types for verification caching.
 */

import type {
  VerificationReport,
  VerificationTier,
} from '@contractspec/lib.contracts/llm';

/**
 * Cache key for verification results.
 */
export interface VerificationCacheKey {
  /** SHA256 hash of spec file content */
  specHash: string;
  /** SHA256 hash of implementation file content */
  implHash: string;
  /** Verification tier */
  tier: VerificationTier;
  /** AI model version (for AI tier, ensures cache invalidation on model change) */
  aiModelVersion?: string;
}

/**
 * Serializable cache key string.
 */
export type CacheKeyString = string;

/**
 * Cache entry metadata.
 */
export interface CacheEntryMeta {
  /** When this entry was created */
  createdAt: string;
  /** When this entry expires (optional TTL) */
  expiresAt?: string;
  /** Paths to files that affect this result (for transitive invalidation) */
  dependencies: string[];
  /** Human-readable spec name for debugging */
  specName?: string;
  /** Human-readable impl path for debugging */
  implPath?: string;
}

/**
 * Full cache entry with result.
 */
export interface VerificationCacheEntry {
  /** The cache key */
  key: VerificationCacheKey;
  /** The verification result */
  result: VerificationReport;
  /** Entry metadata */
  meta: CacheEntryMeta;
}

/**
 * Cache lookup result.
 */
export type CacheLookupResult =
  | { hit: true; entry: VerificationCacheEntry }
  | { hit: false; reason: CacheMissReason };

/**
 * Reasons for cache miss.
 */
export type CacheMissReason =
  | 'not_found'
  | 'expired'
  | 'spec_changed'
  | 'impl_changed'
  | 'dependency_changed'
  | 'model_changed';

/**
 * Cache statistics.
 */
export interface CacheStats {
  /** Total entries in cache */
  totalEntries: number;
  /** Number of cache hits since startup */
  hits: number;
  /** Number of cache misses since startup */
  misses: number;
  /** Hit rate percentage (0-100) */
  hitRate: number;
  /** Estimated memory usage in bytes */
  memoryUsage?: number;
  /** Last time cache was pruned */
  lastPruned?: string;
}

/**
 * Cache configuration.
 */
export interface VerificationCacheConfig {
  /** Maximum number of entries to keep */
  maxEntries?: number;
  /** Default TTL in milliseconds (AI tier uses this) */
  defaultTtlMs?: number;
  /** TTL for structure tier (usually longer) */
  structureTtlMs?: number;
  /** TTL for behavior tier */
  behaviorTtlMs?: number;
  /** TTL for AI tier (usually shorter) */
  aiTtlMs?: number;
  /** Enable transitive invalidation */
  transitiveInvalidation?: boolean;
}

/**
 * Default cache configuration.
 */
export const DEFAULT_CACHE_CONFIG: Required<VerificationCacheConfig> = {
  maxEntries: 1000,
  defaultTtlMs: 24 * 60 * 60 * 1000, // 24 hours
  structureTtlMs: 7 * 24 * 60 * 60 * 1000, // 7 days
  behaviorTtlMs: 24 * 60 * 60 * 1000, // 24 hours
  aiTtlMs: 24 * 60 * 60 * 1000, // 24 hours
  transitiveInvalidation: true,
};

/**
 * Storage adapter interface for cache persistence.
 */
export interface CacheStorageAdapter {
  /** Get an entry by key */
  get(key: CacheKeyString): Promise<VerificationCacheEntry | null>;
  /** Set an entry */
  set(key: CacheKeyString, entry: VerificationCacheEntry): Promise<void>;
  /** Delete an entry */
  delete(key: CacheKeyString): Promise<boolean>;
  /** Check if key exists */
  has(key: CacheKeyString): Promise<boolean>;
  /** List all keys */
  keys(): Promise<CacheKeyString[]>;
  /** Clear all entries */
  clear(): Promise<void>;
  /** Get stats (optional) */
  stats?(): Promise<{ entryCount: number; memoryUsage?: number }>;
}
