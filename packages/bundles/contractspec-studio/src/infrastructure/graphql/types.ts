import { Logger } from '@lssm/lib.logger';
import { auth } from '../../application/services/auth';

// export interface AuthUser {
//   id?: string;
//   email?: string;
//   organizationId?: string;
//   role?: string;
//   [key: string]: unknown;
// }

export type AuthUser = typeof auth.$Infer.User;
export type AuthSession = typeof auth.$Infer.Session;
export type AuthOrganization = typeof auth.$Infer.Organization;

// export interface AuthSession {
//   id?: string;
//   organizationId?: string;
//   [key: string]: unknown;
// }

export interface Context {
  user?: AuthUser;
  session?: AuthSession;
  organization?: AuthOrganization;
  logger: Logger;
  headers: Headers;
  featureFlags: Record<string, boolean>;
}

export function requireAuth(
  ctx: Context
): asserts ctx is Context & { user: AuthUser } {
  if (!ctx.user) {
    console.log('Unauthorized', { user: ctx.user });
    throw new Error('Unauthorized');
  }
}
