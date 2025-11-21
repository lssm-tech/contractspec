import {
  prisma,
  OrganizationType,
  DocumentType,
  DocumentStatus,
} from '@lssm/app.cli-database-strit';
import type { Context } from './types';
import { requireAuth } from './types';

export async function isPlatformAdmin(ctx: Context): Promise<boolean> {
  if (!ctx.user) return false;
  const user = await prisma.user.findUnique({
    where: { id: ctx.user.id },
    select: { role: true },
  });
  return user?.role === 'admin';
}

export async function requirePlatformAdmin(ctx: Context): Promise<void> {
  requireAuth(ctx);
  if (!(await isPlatformAdmin(ctx))) {
    console.log('FORBIDDEN', { user: ctx.user });
    throw new Error('FORBIDDEN');
  }
}

export async function getSellerOrgId(ctx: Context): Promise<string | null> {
  if (!ctx.user) return null;
  const member = await prisma.member.findFirst({
    where: {
      userId: ctx.user.id,
      organization: { type: OrganizationType.SELLER },
    },
    select: { organizationId: true },
  });
  return member?.organizationId ?? null;
}

export async function getCollectivityOrgId(
  ctx: Context
): Promise<string | null> {
  if (!ctx.user) return null;
  const member = await prisma.member.findFirst({
    where: {
      userId: ctx.user.id,
      organization: { type: OrganizationType.COLLECTIVITY },
    },
    select: { organizationId: true },
  });
  return member?.organizationId ?? null;
}

export async function requireSellerOrgId(ctx: Context): Promise<string> {
  requireAuth(ctx);
  const id = await getSellerOrgId(ctx);
  if (!id) throw new Error('NO_ORG');
  return id;
}

export async function requireSellerKycVerified(ctx: Context): Promise<string> {
  const sellerId = await requireSellerOrgId(ctx);
  const kbis = await prisma.stritDocument.findFirst({
    where: {
      sellerId,
      documentType: DocumentType.KBIS,
      status: DocumentStatus.VERIFIED,
    },
    select: { id: true },
  });
  if (!kbis) throw new Error('KYC_MISSING_KBIS');
  const memberWithVerifiedPhone = await prisma.member.findFirst({
    where: { organizationId: sellerId, user: { phoneNumberVerified: true } },
    select: { id: true },
  });
  if (!memberWithVerifiedPhone) throw new Error('KYC_NO_VERIFIED_USER');
  return sellerId;
}

export async function requireCollectivityOrgId(ctx: Context): Promise<string> {
  requireAuth(ctx);
  const id = await getCollectivityOrgId(ctx);
  if (!id) throw new Error('NO_ORG');
  return id;
}

export async function requireCollectivityOrAdmin(
  ctx: Context
): Promise<{ isAdmin: boolean; collectivityId: string | null }> {
  requireAuth(ctx);
  const admin = await isPlatformAdmin(ctx);
  if (admin) return { isAdmin: true, collectivityId: null };
  const cid = await getCollectivityOrgId(ctx);
  if (!cid) throw new Error('FORBIDDEN');
  return { isAdmin: false, collectivityId: cid };
}
