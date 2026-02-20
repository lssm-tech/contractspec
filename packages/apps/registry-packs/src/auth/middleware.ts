import { getDb } from '../db/client.js';
import { validateToken } from './token.js';

/** Auth context shape injected by the auth plugin. */
export interface AuthContext {
  username: string;
  scope: string;
}

/**
 * Extract auth from request headers.
 * Returns null if no valid bearer token is present.
 */
export async function extractAuth(
  headers: Record<string, string | undefined>
): Promise<AuthContext | null> {
  const authorization = headers.authorization;
  if (!authorization?.startsWith('Bearer ')) {
    return null;
  }

  const token = authorization.slice(7);
  const db = getDb();
  return validateToken(db, token);
}
