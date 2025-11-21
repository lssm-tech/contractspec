import { Logger } from '@lssm/lib.logger';
import type { User } from 'better-auth';
import type { auth } from '../../application/services/auth';

export type Session = typeof auth.$Infer.Session;
export type AuthUser = Session['user'];
export type AuthSession = Session['session'];
export interface Context {
  user?: AuthUser;
  session?: AuthSession;
  logger: Logger;
  headers: Headers;
}

export function requireAuth(
  ctx: Context
): asserts ctx is Context & { user: User } {
  if (!ctx.user) {
    console.log('Unauthorized', { user: ctx.user });
    throw new Error('Unauthorized');
  }
}
