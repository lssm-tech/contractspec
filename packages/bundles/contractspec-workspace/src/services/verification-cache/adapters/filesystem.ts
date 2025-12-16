/**
 * Filesystem cache storage adapter.
 *
 * Stores cache entries in a JSON file for CLI and CI environments.
 * Uses atomic writes to prevent corruption.
 */

import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  statSync,
} from 'fs';
import { dirname, join } from 'path';
import type {
  CacheKeyString,
  CacheStorageAdapter,
  VerificationCacheEntry,
} from '../types';

/**
 * Default cache file location.
 */
const DEFAULT_CACHE_FILE = '.contractspec/verification-cache.json';

/**
 * Cache file structure.
 */
interface CacheFileData {
  version: number;
  entries: Record<CacheKeyString, VerificationCacheEntry>;
}

const CURRENT_VERSION = 1;

/**
 * Filesystem storage adapter.
 */
export class FileSystemCacheStorage implements CacheStorageAdapter {
  private filePath: string;
  private cache: Map<CacheKeyString, VerificationCacheEntry>;
  private isDirty = false;

  constructor(filePath?: string, workspaceRoot?: string) {
    const root = workspaceRoot ?? process.cwd();
    this.filePath = filePath ?? join(root, DEFAULT_CACHE_FILE);
    this.cache = new Map();
    this.loadSync();
  }

  /**
   * Load cache from disk synchronously.
   */
  private loadSync(): void {
    try {
      if (!existsSync(this.filePath)) {
        return;
      }

      const content = readFileSync(this.filePath, 'utf-8');
      const data = JSON.parse(content) as CacheFileData;

      // Version check
      if (data.version !== CURRENT_VERSION) {
        // Incompatible version, start fresh
        return;
      }

      // Load entries
      for (const [key, entry] of Object.entries(data.entries)) {
        this.cache.set(key, entry);
      }
    } catch {
      // Ignore load errors, start with empty cache
    }
  }

  /**
   * Save cache to disk.
   */
  private saveSync(): void {
    if (!this.isDirty) return;

    try {
      // Ensure directory exists
      const dir = dirname(this.filePath);
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }

      const data: CacheFileData = {
        version: CURRENT_VERSION,
        entries: Object.fromEntries(this.cache.entries()),
      };

      // Atomic write: write to temp file, then rename
      const tempPath = `${this.filePath}.tmp`;
      writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');

      // Rename is atomic on most filesystems
      const { renameSync } = require('fs');
      renameSync(tempPath, this.filePath);

      this.isDirty = false;
    } catch {
      // Ignore save errors
    }
  }

  async get(key: CacheKeyString): Promise<VerificationCacheEntry | null> {
    return this.cache.get(key) ?? null;
  }

  async set(key: CacheKeyString, entry: VerificationCacheEntry): Promise<void> {
    this.cache.set(key, entry);
    this.isDirty = true;
    this.saveSync();
  }

  async delete(key: CacheKeyString): Promise<boolean> {
    const existed = this.cache.delete(key);
    if (existed) {
      this.isDirty = true;
      this.saveSync();
    }
    return existed;
  }

  async has(key: CacheKeyString): Promise<boolean> {
    return this.cache.has(key);
  }

  async keys(): Promise<CacheKeyString[]> {
    return Array.from(this.cache.keys());
  }

  async clear(): Promise<void> {
    this.cache.clear();
    this.isDirty = true;
    this.saveSync();
  }

  async stats(): Promise<{ entryCount: number; memoryUsage?: number }> {
    let fileSize = 0;
    try {
      if (existsSync(this.filePath)) {
        const stat = statSync(this.filePath);
        fileSize = stat.size;
      }
    } catch {
      // Ignore
    }

    return {
      entryCount: this.cache.size,
      memoryUsage: fileSize,
    };
  }

  /**
   * Force save any pending changes.
   */
  flush(): void {
    this.saveSync();
  }

  /**
   * Reload cache from disk.
   */
  reload(): void {
    this.cache.clear();
    this.loadSync();
    this.isDirty = false;
  }
}

/**
 * Create a filesystem cache storage adapter.
 */
export function createFileSystemCacheStorage(
  filePath?: string,
  workspaceRoot?: string
): FileSystemCacheStorage {
  return new FileSystemCacheStorage(filePath, workspaceRoot);
}
