import { Logger } from '@contractspec/lib.logger';
import { auth } from '../../application/services/auth';

// export interface AuthUser {
//   id?: string;
//   email?: string;
//   organizationId?: string;
//   role?: string;
//   [key: string]: unknown;
// }

export type BetterAuthSession = typeof auth.$Infer.Session;
export type AuthUser = BetterAuthSession['user'];
export type AuthSession = BetterAuthSession['session'];
export type AuthOrganization = typeof auth.$Infer.Organization;

// export interface AuthSession {
//   id?: string;
//   organizationId?: string;
//   [key: string]: unknown;
// }

export interface Context {
  user: null | AuthUser;
  session: null | AuthSession;
  organization: null | AuthOrganization;
  logger: Logger;
  headers: Headers;
  featureFlags: undefined | Record<string, boolean>;
}

export function requireAuth(
  ctx: Context
): asserts ctx is Context & { user: AuthUser } {
  if (!ctx.user) {
    console.log('Unauthorized', { user: ctx.user });
    throw new Error('Unauthorized');
  }
}
