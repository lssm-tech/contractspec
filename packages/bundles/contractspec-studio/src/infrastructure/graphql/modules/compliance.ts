import { gqlSchemaBuilder } from '../builder';
import {
  prisma,
  ComplianceBadgeStatus,
  DocumentType,
  DocumentStatus,
} from '@lssm/app.cli-database-strit';
import { requirePlatformAdmin, requireSellerOrgId } from '../guards';

export function registerComplianceSchema() {
  const ComplianceBadgeStatusEnum = gqlSchemaBuilder.enumType(
    'ComplianceBadgeStatus',
    {
      values: [
        ComplianceBadgeStatus.MISSING_CORE,
        ComplianceBadgeStatus.INCOMPLETE,
        ComplianceBadgeStatus.COMPLETE,
        ComplianceBadgeStatus.EXPIRING,
      ] as const,
    }
  );

  const SellerCompliance = gqlSchemaBuilder.objectType('SellerCompliance', {
    fields: (t) => ({
      sellerId: t.id({ resolve: (o) => o.sellerId }),
      badge: t.field({
        type: 'ComplianceBadgeStatus',
        resolve: (o) => o.badge,
      }),
      missingCore: t.boolean({ resolve: (o) => o.missingCore }),
      expiring: t.boolean({ resolve: (o) => o.expiring }),
      uploadedCount: t.int({ resolve: (o) => o.uploadedCount }),
      hasVerifiedKBIS: t.boolean({
        resolve: (o: any) => (o.hasVerifiedKBIS as boolean) ?? false,
      }),
      hasVerifiedUser: t.boolean({
        resolve: (o: any) => (o.hasVerifiedUser as boolean) ?? false,
      }),
      verifiedCore: t.boolean({
        resolve: (o: any) => (o.verifiedCore as boolean) ?? false,
      }),
      pendingCore: t.int({
        resolve: (o: any) => (o.pendingCore as number) ?? 0,
      }),
    }),
  });

  gqlSchemaBuilder.queryField('sellerCompliance', (t) =>
    t.field({
      type: SellerCompliance,
      args: { sellerId: t.arg.id({ required: false }) },
      resolve: async (_root, args, ctx) => {
        if (!ctx.user) throw new Error('Unauthorized');
        let sellerId = args.sellerId as string | undefined;
        if (!sellerId) {
          sellerId = await requireSellerOrgId(ctx);
        } else {
          await requirePlatformAdmin(ctx);
        }

        // Prefer org snapshot
        const org = await prisma.organization.findUnique({
          where: { id: sellerId },
          select: { complianceBadge: true },
        });

        // Counters
        const [docsAgg, expiringDoc, verifiedKbis, verifiedMember] =
          await Promise.all([
            prisma.stritDocument.aggregate({
              where: { sellerId },
              _count: { _all: true },
            }),
            prisma.stritDocument.findFirst({
              where: { sellerId, status: DocumentStatus.EXPIRING },
              select: { id: true },
            }),
            prisma.stritDocument.findFirst({
              where: {
                sellerId,
                documentType: DocumentType.KBIS,
                status: DocumentStatus.VERIFIED,
              },
              select: { id: true },
            }),
            prisma.member.findFirst({
              where: {
                organizationId: sellerId,
                user: { phoneNumberVerified: true },
              },
              select: { id: true },
            }),
          ]);

        const badge =
          org?.complianceBadge ?? ComplianceBadgeStatus.MISSING_CORE;
        const missingCore = badge === ComplianceBadgeStatus.MISSING_CORE;
        const expiring = !!expiringDoc;
        const uploadedCount = docsAgg._count._all ?? 0;

        const verifiedCore = !!verifiedKbis;
        const pendingCore = verifiedCore ? 0 : 1; // KBIS is the only core doc in KYC v2
        return {
          sellerId,
          badge,
          missingCore,
          expiring,
          uploadedCount,
          hasVerifiedKBIS: !!verifiedKbis,
          hasVerifiedUser: !!verifiedMember,
          verifiedCore,
          pendingCore,
        };
      },
    })
  );

  // User KYC status (phone + verified ID doc uploaded by user)
  const UserKycStatus = gqlSchemaBuilder
    .objectRef<{
      phoneVerified: boolean;
      hasVerifiedIdDocument: boolean;
      isVerified: boolean;
    }>('UserKycStatus')
    .implement({
      fields: (t) => ({
        phoneVerified: t.boolean({ resolve: (o) => o.phoneVerified }),
        hasVerifiedIdDocument: t.boolean({
          resolve: (o) => o.hasVerifiedIdDocument,
        }),
        isVerified: t.boolean({ resolve: (o) => o.isVerified }),
      }),
    });

  gqlSchemaBuilder.queryField('userKycStatus', (t) =>
    t.field({
      type: UserKycStatus,
      resolve: async (_root, _args, ctx) => {
        if (!ctx.user) throw new Error('Unauthorized');
        const me = await prisma.user.findUnique({
          where: { id: ctx.user.id },
          select: { phoneNumberVerified: true },
        });
        const hasIdDoc = await prisma.stritDocument.findFirst({
          where: {
            documentType: DocumentType.ID_CARD,
            status: DocumentStatus.VERIFIED,
            publicFile: { ownerId: ctx.user.id },
          },
          select: { id: true },
        });
        const phoneVerified = !!me?.phoneNumberVerified;
        const hasVerifiedIdDocument = !!hasIdDoc;
        return {
          phoneVerified,
          hasVerifiedIdDocument,
          isVerified: phoneVerified && hasVerifiedIdDocument,
        };
      },
    })
  );

  // Seller KYC status (verified KBIS + at least one verified user)
  const SellerKycStatus = gqlSchemaBuilder
    .objectRef<{
      hasVerifiedKBIS: boolean;
      hasVerifiedUser: boolean;
      isVerified: boolean;
    }>('SellerKycStatus')
    .implement({
      fields: (t) => ({
        hasVerifiedKBIS: t.boolean({ resolve: (o) => o.hasVerifiedKBIS }),
        hasVerifiedUser: t.boolean({ resolve: (o) => o.hasVerifiedUser }),
        isVerified: t.boolean({ resolve: (o) => o.isVerified }),
      }),
    });

  gqlSchemaBuilder.queryField('sellerKycStatus', (t) =>
    t.field({
      type: SellerKycStatus,
      args: { sellerId: t.arg.id({ required: false }) },
      resolve: async (_root, args, ctx) => {
        if (!ctx.user) throw new Error('Unauthorized');
        let sellerId = args.sellerId as string | undefined;
        if (!sellerId) {
          sellerId = await requireSellerOrgId(ctx);
        } else {
          await requirePlatformAdmin(ctx);
        }

        const kbis = await prisma.stritDocument.findFirst({
          where: {
            sellerId,
            documentType: DocumentType.KBIS,
            status: DocumentStatus.VERIFIED,
          },
          select: { id: true },
        });

        const verifiedMember = await prisma.member.findFirst({
          where: {
            organizationId: sellerId,
            user: { phoneNumberVerified: true },
          },
          select: { id: true },
        });

        const hasVerifiedKBIS = !!kbis;
        const hasVerifiedUser = !!verifiedMember;
        return {
          hasVerifiedKBIS,
          hasVerifiedUser,
          isVerified: hasVerifiedKBIS && hasVerifiedUser,
        };
      },
    })
  );
}
