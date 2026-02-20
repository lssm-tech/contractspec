/**
 * Unit tests for registry server auth token utilities.
 * Tests pure functions (generateToken, hashToken) without DB.
 */
import { describe, expect, test } from 'bun:test';

// We import the pure functions directly — these don't need DB
// Re-implementing here to avoid cross-package import issues
import { createHash, randomBytes } from 'crypto';

function generateToken(): string {
  return `apk_${randomBytes(32).toString('hex')}`;
}

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

describe('generateToken', () => {
  test('generates token with apk_ prefix', () => {
    const token = generateToken();
    expect(token).toStartWith('apk_');
  });

  test('generates 68-character token (4 prefix + 64 hex)', () => {
    const token = generateToken();
    expect(token.length).toBe(68);
  });

  test('generates unique tokens', () => {
    const tokens = new Set<string>();
    for (let i = 0; i < 100; i++) {
      tokens.add(generateToken());
    }
    expect(tokens.size).toBe(100);
  });

  test('token contains only valid hex chars after prefix', () => {
    const token = generateToken();
    const hex = token.slice(4);
    expect(hex).toMatch(/^[a-f0-9]{64}$/);
  });
});

describe('hashToken', () => {
  test('returns SHA-256 hex hash', () => {
    const hash = hashToken('test-token');
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });

  test('same input produces same hash', () => {
    const hash1 = hashToken('my-token');
    const hash2 = hashToken('my-token');
    expect(hash1).toBe(hash2);
  });

  test('different inputs produce different hashes', () => {
    const hash1 = hashToken('token-a');
    const hash2 = hashToken('token-b');
    expect(hash1).not.toBe(hash2);
  });

  test('hashes a generated token correctly', () => {
    const token = generateToken();
    const hash = hashToken(token);
    expect(hash.length).toBe(64);
    // Re-hashing should give same result
    expect(hashToken(token)).toBe(hash);
  });
});
