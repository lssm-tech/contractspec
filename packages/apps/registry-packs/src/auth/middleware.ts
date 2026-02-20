import { Elysia } from 'elysia';
import { getDb } from '../db/client.js';
import { validateToken } from './token.js';

/** Auth context shape injected by the auth plugin. */
export interface AuthContext {
  username: string;
  scope: string;
}

/**
 * Elysia plugin for bearer token authentication.
 * Adds `auth` to the context for authenticated routes.
 */
export const authPlugin = new Elysia({ name: 'auth' }).derive(
  async ({ headers }) => {
    const authorization = headers.authorization;
    if (!authorization?.startsWith('Bearer ')) {
      return { auth: null as AuthContext | null };
    }

    const token = authorization.slice(7);
    const db = getDb();
    const result = await validateToken(db, token);

    return { auth: result };
  }
);

/**
 * Guard that requires authentication.
 * Use in route chains: `.use(requireAuth)`
 */
export const requireAuth = new Elysia({ name: 'requireAuth' })
  .use(authPlugin)
  .onBeforeHandle((ctx) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const auth = (ctx as any).auth as AuthContext | null;
    if (!auth) {
      ctx.set.status = 401;
      return { error: 'Authentication required' };
    }
  });
