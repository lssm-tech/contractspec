/**
 * Tests for versioning reference types and utilities.
 */

import { describe, expect, it } from 'bun:test';
import {
  isVersionedSpecRef,
  isOptionalVersionedSpecRef,
  isSpecKeyRef,
  createVersionedRef,
  createOptionalRef,
  createKeyRef,
  formatVersionedRefKey,
  parseVersionedRefKey,
} from './refs';

// ─────────────────────────────────────────────────────────────────────────────
// Type Guards
// ─────────────────────────────────────────────────────────────────────────────

describe('isVersionedSpecRef', () => {
  it('should return true for valid versioned refs', () => {
    expect(isVersionedSpecRef({ key: 'auth.login', version: '1.0.0' })).toBe(
      true
    );
    expect(isVersionedSpecRef({ key: 'user.created', version: '2.1.0' })).toBe(
      true
    );
  });

  it('should return false for refs without version', () => {
    expect(isVersionedSpecRef({ key: 'auth.login' })).toBe(false);
  });

  it('should return false for refs without key', () => {
    expect(isVersionedSpecRef({ version: '1.0.0' })).toBe(false);
  });

  it('should return false for empty key', () => {
    expect(isVersionedSpecRef({ key: '', version: '1.0.0' })).toBe(false);
  });

  it('should return false for empty version', () => {
    expect(isVersionedSpecRef({ key: 'auth.login', version: '' })).toBe(false);
  });

  it('should return false for null or undefined', () => {
    expect(isVersionedSpecRef(null)).toBe(false);
    expect(isVersionedSpecRef(undefined)).toBe(false);
  });

  it('should return false for non-objects', () => {
    expect(isVersionedSpecRef('auth.login')).toBe(false);
    expect(isVersionedSpecRef(123)).toBe(false);
    expect(isVersionedSpecRef(['auth.login', '1.0.0'])).toBe(false);
  });

  it('should return false for non-string key or version', () => {
    expect(isVersionedSpecRef({ key: 123, version: '1.0.0' })).toBe(false);
    expect(isVersionedSpecRef({ key: 'auth.login', version: 100 })).toBe(false);
  });
});

describe('isOptionalVersionedSpecRef', () => {
  it('should return true for refs with key and version', () => {
    expect(
      isOptionalVersionedSpecRef({ key: 'auth.login', version: '1.0.0' })
    ).toBe(true);
  });

  it('should return true for refs with only key', () => {
    expect(isOptionalVersionedSpecRef({ key: 'auth.login' })).toBe(true);
  });

  it('should return true for refs with undefined version', () => {
    expect(
      isOptionalVersionedSpecRef({ key: 'auth.login', version: undefined })
    ).toBe(true);
  });

  it('should return false for empty key', () => {
    expect(isOptionalVersionedSpecRef({ key: '' })).toBe(false);
  });

  it('should return false for refs without key', () => {
    expect(isOptionalVersionedSpecRef({ version: '1.0.0' })).toBe(false);
  });

  it('should return false for null or undefined', () => {
    expect(isOptionalVersionedSpecRef(null)).toBe(false);
    expect(isOptionalVersionedSpecRef(undefined)).toBe(false);
  });

  it('should return false for non-objects', () => {
    expect(isOptionalVersionedSpecRef('auth.login')).toBe(false);
    expect(isOptionalVersionedSpecRef(123)).toBe(false);
  });

  it('should return false for non-string version when present', () => {
    expect(
      isOptionalVersionedSpecRef({ key: 'auth.login', version: 100 })
    ).toBe(false);
  });
});

describe('isSpecKeyRef', () => {
  it('should return true for valid key refs', () => {
    expect(isSpecKeyRef({ key: 'premium-features' })).toBe(true);
    expect(isSpecKeyRef({ key: 'auth.login', version: '1.0.0' })).toBe(true);
  });

  it('should return false for empty key', () => {
    expect(isSpecKeyRef({ key: '' })).toBe(false);
  });

  it('should return false for missing key', () => {
    expect(isSpecKeyRef({ version: '1.0.0' })).toBe(false);
    expect(isSpecKeyRef({})).toBe(false);
  });

  it('should return false for null or undefined', () => {
    expect(isSpecKeyRef(null)).toBe(false);
    expect(isSpecKeyRef(undefined)).toBe(false);
  });

  it('should return false for non-objects', () => {
    expect(isSpecKeyRef('premium-features')).toBe(false);
    expect(isSpecKeyRef(123)).toBe(false);
  });

  it('should return false for non-string key', () => {
    expect(isSpecKeyRef({ key: 123 })).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Factory Functions
// ─────────────────────────────────────────────────────────────────────────────

describe('createVersionedRef', () => {
  it('should create a valid versioned ref', () => {
    const ref = createVersionedRef('auth.login', '1.0.0');
    expect(ref).toEqual({ key: 'auth.login', version: '1.0.0' });
  });

  it('should trim whitespace from key and version', () => {
    const ref = createVersionedRef('  auth.login  ', '  1.0.0  ');
    expect(ref).toEqual({ key: 'auth.login', version: '1.0.0' });
  });

  it('should throw for empty key', () => {
    expect(() => createVersionedRef('', '1.0.0')).toThrow(
      'Spec key cannot be empty'
    );
    expect(() => createVersionedRef('   ', '1.0.0')).toThrow(
      'Spec key cannot be empty'
    );
  });

  it('should throw for empty version', () => {
    expect(() => createVersionedRef('auth.login', '')).toThrow(
      'Spec version cannot be empty'
    );
    expect(() => createVersionedRef('auth.login', '   ')).toThrow(
      'Spec version cannot be empty'
    );
  });
});

describe('createOptionalRef', () => {
  it('should create a ref with key only', () => {
    const ref = createOptionalRef('auth.login');
    expect(ref).toEqual({ key: 'auth.login' });
    expect(ref.version).toBeUndefined();
  });

  it('should create a ref with key and version', () => {
    const ref = createOptionalRef('auth.login', '1.0.0');
    expect(ref).toEqual({ key: 'auth.login', version: '1.0.0' });
  });

  it('should trim whitespace from key and version', () => {
    const ref = createOptionalRef('  auth.login  ', '  1.0.0  ');
    expect(ref).toEqual({ key: 'auth.login', version: '1.0.0' });
  });

  it('should omit version if undefined or empty', () => {
    expect(createOptionalRef('auth.login', undefined)).toEqual({
      key: 'auth.login',
    });
    expect(createOptionalRef('auth.login', '')).toEqual({ key: 'auth.login' });
    expect(createOptionalRef('auth.login', '   ')).toEqual({
      key: 'auth.login',
    });
  });

  it('should throw for empty key', () => {
    expect(() => createOptionalRef('')).toThrow('Spec key cannot be empty');
    expect(() => createOptionalRef('   ')).toThrow('Spec key cannot be empty');
  });
});

describe('createKeyRef', () => {
  it('should create a valid key ref', () => {
    const ref = createKeyRef('premium-features');
    expect(ref).toEqual({ key: 'premium-features' });
  });

  it('should trim whitespace from key', () => {
    const ref = createKeyRef('  premium-features  ');
    expect(ref).toEqual({ key: 'premium-features' });
  });

  it('should throw for empty key', () => {
    expect(() => createKeyRef('')).toThrow('Spec key cannot be empty');
    expect(() => createKeyRef('   ')).toThrow('Spec key cannot be empty');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Utility Functions
// ─────────────────────────────────────────────────────────────────────────────

describe('formatVersionedRefKey', () => {
  it('should format a versioned ref as a string key', () => {
    const key = formatVersionedRefKey({ key: 'auth.login', version: '1.0.0' });
    expect(key).toBe('auth.login.v1.0.0');
  });

  it('should handle complex keys', () => {
    const key = formatVersionedRefKey({
      key: 'user.profile.update',
      version: '2.1.0',
    });
    expect(key).toBe('user.profile.update.v2.1.0');
  });

  it('should handle prerelease versions', () => {
    const key = formatVersionedRefKey({
      key: 'auth.login',
      version: '1.0.0-alpha.1',
    });
    expect(key).toBe('auth.login.v1.0.0-alpha.1');
  });
});

describe('parseVersionedRefKey', () => {
  it('should parse a simple versioned ref key', () => {
    const ref = parseVersionedRefKey('auth.login.v1.0.0');
    expect(ref).toEqual({ key: 'auth.login', version: '1.0.0' });
  });

  it('should parse a complex key', () => {
    const ref = parseVersionedRefKey('user.profile.update.v2.1.0');
    expect(ref).toEqual({ key: 'user.profile.update', version: '2.1.0' });
  });

  it('should parse prerelease versions', () => {
    const ref = parseVersionedRefKey('auth.login.v1.0.0-alpha.1');
    expect(ref).toEqual({ key: 'auth.login', version: '1.0.0-alpha.1' });
  });

  it('should return undefined for invalid formats', () => {
    expect(parseVersionedRefKey('auth.login')).toBeUndefined();
    expect(parseVersionedRefKey('auth.login.1.0.0')).toBeUndefined();
    expect(parseVersionedRefKey('')).toBeUndefined();
    expect(parseVersionedRefKey('v1.0.0')).toBeUndefined();
  });

  it('should be inverse of formatVersionedRefKey', () => {
    const original = { key: 'auth.login', version: '1.0.0' };
    const formatted = formatVersionedRefKey(original);
    const parsed = parseVersionedRefKey(formatted);
    expect(parsed).toEqual(original);
  });
});
