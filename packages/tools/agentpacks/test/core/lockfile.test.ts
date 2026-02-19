import { describe, expect, test, beforeEach, afterEach } from 'bun:test';
import { mkdirSync, existsSync, readFileSync, writeFileSync, rmSync } from 'fs';
import { join } from 'path';
import {
  loadLockfile,
  saveLockfile,
  getLockedSource,
  setLockedSource,
  computeIntegrity,
  isLockfileFrozenValid,
  type Lockfile,
} from '../../src/core/lockfile.js';

const TMP_DIR = join(import.meta.dir, '.tmp-lockfile-test');

beforeEach(() => {
  mkdirSync(TMP_DIR, { recursive: true });
});

afterEach(() => {
  rmSync(TMP_DIR, { recursive: true, force: true });
});

describe('loadLockfile', () => {
  test('returns empty lockfile when file does not exist', () => {
    const lf = loadLockfile(TMP_DIR);
    expect(lf.lockfileVersion).toBe(1);
    expect(lf.sources).toEqual({});
  });

  test('loads existing lockfile from disk', () => {
    const data: Lockfile = {
      lockfileVersion: 1,
      sources: {
        'owner/repo': {
          requestedRef: 'main',
          resolvedRef: 'abc123',
          resolvedAt: '2025-01-01T00:00:00.000Z',
          skills: {},
        },
      },
    };
    const filepath = join(TMP_DIR, 'agentpacks.lock');
    writeFileSync(filepath, JSON.stringify(data, null, 2));
    const lf = loadLockfile(TMP_DIR);
    expect(lf.lockfileVersion).toBe(1);
    expect(lf.sources['owner/repo']?.resolvedRef).toBe('abc123');
  });
});

describe('saveLockfile', () => {
  test('writes lockfile to disk', () => {
    const lf: Lockfile = {
      lockfileVersion: 1,
      sources: {
        'test/pack': {
          requestedRef: 'v1',
          resolvedRef: 'def456',
          resolvedAt: '2025-06-01T00:00:00.000Z',
          skills: { core: { integrity: 'sha256-abc' } },
        },
      },
    };
    saveLockfile(TMP_DIR, lf);
    const filepath = join(TMP_DIR, 'agentpacks.lock');
    expect(existsSync(filepath)).toBe(true);
    const raw = readFileSync(filepath, 'utf-8');
    const parsed = JSON.parse(raw);
    expect(parsed.lockfileVersion).toBe(1);
    expect(parsed.sources['test/pack'].resolvedRef).toBe('def456');
  });
});

describe('getLockedSource / setLockedSource', () => {
  test('returns undefined for missing source', () => {
    const lf: Lockfile = { lockfileVersion: 1, sources: {} };
    expect(getLockedSource(lf, 'missing/repo')).toBeUndefined();
  });

  test('sets and retrieves a source entry', () => {
    const lf: Lockfile = { lockfileVersion: 1, sources: {} };
    const entry = {
      requestedRef: 'main',
      resolvedRef: 'sha-abc',
      resolvedAt: '2025-01-01T00:00:00.000Z',
      skills: {},
    };
    setLockedSource(lf, 'owner/repo', entry);
    expect(getLockedSource(lf, 'owner/repo')).toEqual(entry);
  });
});

describe('computeIntegrity', () => {
  test('returns sha256 prefixed hash', () => {
    const hash = computeIntegrity('hello world');
    expect(hash).toStartWith('sha256-');
    expect(hash.length).toBeGreaterThan(10);
  });

  test('produces consistent hashes', () => {
    const a = computeIntegrity('test content');
    const b = computeIntegrity('test content');
    expect(a).toBe(b);
  });

  test('produces different hashes for different content', () => {
    const a = computeIntegrity('content-a');
    const b = computeIntegrity('content-b');
    expect(a).not.toBe(b);
  });
});

describe('isLockfileFrozenValid', () => {
  test('returns valid when all sources are locked', () => {
    const lf: Lockfile = {
      lockfileVersion: 1,
      sources: {
        'a/b': {
          requestedRef: 'main',
          resolvedRef: 'sha1',
          resolvedAt: '',
          skills: {},
        },
        'c/d': {
          requestedRef: 'main',
          resolvedRef: 'sha2',
          resolvedAt: '',
          skills: {},
        },
      },
    };
    const result = isLockfileFrozenValid(lf, ['a/b', 'c/d']);
    expect(result.valid).toBe(true);
    expect(result.missing).toEqual([]);
  });

  test('returns invalid with missing sources', () => {
    const lf: Lockfile = {
      lockfileVersion: 1,
      sources: {
        'a/b': {
          requestedRef: 'main',
          resolvedRef: 'sha1',
          resolvedAt: '',
          skills: {},
        },
      },
    };
    const result = isLockfileFrozenValid(lf, ['a/b', 'missing/repo']);
    expect(result.valid).toBe(false);
    expect(result.missing).toEqual(['missing/repo']);
  });

  test('valid for empty source list', () => {
    const lf: Lockfile = { lockfileVersion: 1, sources: {} };
    const result = isLockfileFrozenValid(lf, []);
    expect(result.valid).toBe(true);
  });
});
