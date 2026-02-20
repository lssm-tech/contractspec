import { describe, test, expect, beforeEach } from 'bun:test';
import { createTestDb, type TestDb } from './db-fixture.js';
import {
  createAuthToken,
  validateToken,
  generateToken,
  hashToken,
} from '../src/auth/token.js';

describe('Auth token service (DB)', () => {
  let db: TestDb;

  beforeEach(() => {
    db = createTestDb();
  });

  test('createAuthToken stores a hashed token and returns raw', async () => {
    const raw = await createAuthToken(db as any, 'alice', 'publish');
    expect(raw).toMatch(/^apk_/);
  });

  test('validateToken succeeds with correct token', async () => {
    const raw = await createAuthToken(db as any, 'bob', 'publish');
    const result = await validateToken(db as any, raw);
    expect(result).not.toBeNull();
    expect(result!.username).toBe('bob');
    expect(result!.scope).toBe('publish');
  });

  test('validateToken fails with wrong token', async () => {
    await createAuthToken(db as any, 'alice', 'publish');
    const result = await validateToken(db as any, 'apk_wrong_token');
    expect(result).toBeNull();
  });

  test('validateToken fails for expired token', async () => {
    const raw = generateToken();
    const hashed = hashToken(raw);

    // Manually insert an expired token
    const { authTokens } = await import('../src/db/schema.js');
    (db as any)
      .insert(authTokens)
      .values({
        token: hashed,
        username: 'charlie',
        scope: 'publish',
        expiresAt: '2020-01-01T00:00:00.000Z',
      })
      .run();

    const result = await validateToken(db as any, raw);
    expect(result).toBeNull();
  });

  test('multiple tokens for same user work independently', async () => {
    const token1 = await createAuthToken(db as any, 'dave', 'publish');
    const token2 = await createAuthToken(db as any, 'dave', 'admin');

    const result1 = await validateToken(db as any, token1);
    expect(result1!.scope).toBe('publish');

    const result2 = await validateToken(db as any, token2);
    expect(result2!.scope).toBe('admin');
  });
});
