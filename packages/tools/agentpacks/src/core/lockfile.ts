import { existsSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { createHash } from 'crypto';

const LOCKFILE_VERSION = 1;
const LOCKFILE_NAME = 'agentpacks.lock';

/**
 * Entry for a single skill in the lockfile.
 */
export interface LockfileSkillEntry {
  integrity: string;
}

/**
 * Entry for a single source in the lockfile.
 */
export interface LockfileSourceEntry {
  requestedRef: string;
  resolvedRef: string;
  resolvedAt: string;
  skills: Record<string, LockfileSkillEntry>;
  packs?: Record<string, LockfileSkillEntry>;
}

/**
 * Full lockfile structure.
 */
export interface Lockfile {
  lockfileVersion: number;
  sources: Record<string, LockfileSourceEntry>;
}

/**
 * Load lockfile from disk, or return empty lockfile.
 */
export function loadLockfile(projectRoot: string): Lockfile {
  const filepath = resolve(projectRoot, LOCKFILE_NAME);
  if (!existsSync(filepath)) {
    return { lockfileVersion: LOCKFILE_VERSION, sources: {} };
  }

  const raw = readFileSync(filepath, 'utf-8');
  return JSON.parse(raw) as Lockfile;
}

/**
 * Save lockfile to disk.
 */
export function saveLockfile(projectRoot: string, lockfile: Lockfile): void {
  const filepath = resolve(projectRoot, LOCKFILE_NAME);
  writeFileSync(filepath, JSON.stringify(lockfile, null, 2) + '\n');
}

/**
 * Get a locked source entry by key.
 */
export function getLockedSource(
  lockfile: Lockfile,
  sourceKey: string
): LockfileSourceEntry | undefined {
  return lockfile.sources[sourceKey];
}

/**
 * Update or create a source entry in the lockfile.
 */
export function setLockedSource(
  lockfile: Lockfile,
  sourceKey: string,
  entry: LockfileSourceEntry
): void {
  lockfile.sources[sourceKey] = entry;
}

/**
 * Compute SHA-256 integrity hash for content.
 */
export function computeIntegrity(content: string): string {
  const hash = createHash('sha256').update(content).digest('hex');
  return `sha256-${hash}`;
}

/**
 * Check if lockfile covers all declared sources.
 */
export function isLockfileFrozenValid(
  lockfile: Lockfile,
  sourceKeys: string[]
): { valid: boolean; missing: string[] } {
  const missing = sourceKeys.filter((key) => !(key in lockfile.sources));
  return { valid: missing.length === 0, missing };
}
