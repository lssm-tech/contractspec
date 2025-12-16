import { requireAuth } from '../../types';

export function requireAuthAndGet(
  ctx: Parameters<typeof requireAuth>[0]
): NonNullable<typeof ctx.user> & { organizationId: string } {
  requireAuth(ctx);
  if (!ctx.organization) {
    throw new Error('Organization context is required.');
  }
  // NOTE: Better Auth session user does not carry organizationId; it lives on ctx.organization.
  return {
    ...(ctx.user as NonNullable<typeof ctx.user>),
    organizationId: ctx.organization.id,
  };
}








