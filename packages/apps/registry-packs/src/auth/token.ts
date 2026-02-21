import { createHash, randomBytes } from 'crypto';
import { eq } from 'drizzle-orm';
import type { Db } from '../db/client.js';
import { authTokens } from '../db/schema.js';

/**
 * Generate a new auth token.
 */
export function generateToken(): string {
  return `apk_${randomBytes(32).toString('hex')}`;
}

/**
 * Hash a token for storage.
 */
export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/**
 * Create and store a new auth token.
 */
export async function createAuthToken(
  db: Db,
  username: string,
  scope = 'publish'
): Promise<string> {
  const token = generateToken();
  const hashed = hashToken(token);

  await db.insert(authTokens).values({
    token: hashed,
    username,
    scope,
  });

  return token;
}

/**
 * Validate a bearer token and return the username/scope.
 */
export async function validateToken(
  db: Db,
  token: string
): Promise<{ username: string; scope: string } | null> {
  const hashed = hashToken(token);
  const result = await db
    .select()
    .from(authTokens)
    .where(eq(authTokens.token, hashed))
    .limit(1);

  if (result.length === 0) return null;

  const entry = result[0];
  if (!entry) return null;

  // Check expiry
  if (entry.expiresAt && new Date(entry.expiresAt) < new Date()) {
    return null;
  }

  return { username: entry.username, scope: entry.scope };
}
