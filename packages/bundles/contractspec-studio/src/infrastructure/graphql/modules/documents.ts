import { gqlSchemaBuilder } from '../builder';
import {
  prisma,
  DocumentType,
  DocumentStatus,
  ComplianceBadgeStatus,
} from '@lssm/app.cli-database-strit';
import { requireSellerOrgId } from '../guards';

export function registerDocumentsSchema() {
  const DocumentTypeEnum = gqlSchemaBuilder.enumType('DocumentType', {
    values: [
      DocumentType.ID_CARD,
      DocumentType.SIREN_SIRET,
      DocumentType.KBIS,
      DocumentType.HACCP,
      DocumentType.ITINERANT_CARD,
      DocumentType.OTHER,
    ] as const,
  });
  const DocumentStatusEnum = gqlSchemaBuilder.enumType('DocumentStatus', {
    values: [
      DocumentStatus.MISSING,
      DocumentStatus.UPLOADED,
      DocumentStatus.VERIFIED,
      DocumentStatus.EXPIRING,
      DocumentStatus.EXPIRED,
    ] as const,
  });

  gqlSchemaBuilder.prismaObject('StritDocument', {
    fields: (t) => ({
      id: t.exposeID('id', { nullable: false }),
      documentType: t.field({
        type: DocumentTypeEnum,
        resolve: (d) => d.documentType,
        nullable: false,
      }),
      status: t.field({
        type: DocumentStatusEnum,
        resolve: (d) => d.status,
        nullable: false,
      }),
      fileName: t.exposeString('fileName'),
      fileId: t.exposeString('fileId'),
      expiryDate: t.field({
        type: 'Date',
        nullable: true,
        resolve: (d) => d.expiryDate ?? null,
      }),
      reminderSent: t.exposeBoolean('reminderSent'),
      verifiedBy: t.exposeString('verifiedBy', { nullable: true }),
      verifiedAt: t.field({
        type: 'Date',
        nullable: true,
        resolve: (d) => d.verifiedAt ?? null,
      }),
      reviewNotes: t.exposeString('reviewNotes', { nullable: true }),
      sellerId: t.exposeString('sellerId'),
      createdAt: t.field({ type: 'Date', resolve: (d) => d.createdAt }),
      updatedAt: t.field({ type: 'Date', resolve: (d) => d.updatedAt }),
    }),
  });

  gqlSchemaBuilder.queryField('myDocuments', (t) =>
    t.prismaField({
      type: ['StritDocument'],
      resolve: async (query, _root, _args, ctx) => {
        if (!ctx.user) throw new Error('Unauthorized');
        const sellerId = await requireSellerOrgId(ctx);
        return prisma.stritDocument.findMany({
          ...query,
          where: { sellerId },
          orderBy: { updatedAt: 'desc' },
        });
      },
    })
  );

  const UploadDocumentInput = gqlSchemaBuilder.inputType(
    'UploadDocumentInput',
    {
      fields: (t) => ({
        documentType: t.field({ type: DocumentTypeEnum, required: true }),
        fileId: t.id({ required: true }),
        fileName: t.string({ required: true }),
        expiryDate: t.field({ type: 'Date', required: false }),
      }),
    }
  );

  gqlSchemaBuilder.mutationField('uploadDocument', (t) =>
    t.prismaField({
      type: 'StritDocument',
      args: { input: t.arg({ type: UploadDocumentInput, required: true }) },
      resolve: async (query, _root, args, ctx) => {
        if (!ctx.user) throw new Error('Unauthorized');
        const sellerId = await requireSellerOrgId(ctx);
        const existing = await prisma.stritDocument.findFirst({
          where: { sellerId, documentType: args.input.documentType },
        });
        const expiryDate = args.input.expiryDate ?? null;
        const isExpiringSoon = expiryDate
          ? new Date(expiryDate).getTime() - Date.now() <= 14 * 86400000
          : false;
        if (existing) {
          return prisma.stritDocument.update({
            ...query,
            where: { id: existing.id },
            data: {
              fileId: args.input.fileId as string,
              fileName: args.input.fileName as string,
              status: isExpiringSoon
                ? DocumentStatus.EXPIRING
                : DocumentStatus.UPLOADED,
              expiryDate: expiryDate,
              verifiedBy: null,
              verifiedAt: null,
              reviewNotes: null,
              updatedAt: new Date(),
            },
          });
        }
        const created = await prisma.stritDocument.create({
          ...query,
          data: {
            id: crypto.randomUUID(),
            sellerId,
            documentType: args.input.documentType,
            status: isExpiringSoon ? 'EXPIRING' : 'UPLOADED',
            fileId: args.input.fileId as string,
            fileName: args.input.fileName as string,
            expiryDate: expiryDate,
            reminderSent: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
        // Update organization badge snapshot (KYC v2: KBIS as core)
        const kbisDoc = await prisma.stritDocument.findFirst({
          where: { sellerId, documentType: DocumentType.KBIS },
          select: { status: true },
        });
        const hasCore = !!kbisDoc && kbisDoc.status !== DocumentStatus.MISSING;
        const anyExpiring = !!(await prisma.stritDocument.findFirst({
          where: { sellerId, status: DocumentStatus.EXPIRING },
          select: { id: true },
        }));
        const optionalDocs = await prisma.stritDocument.findMany({
          where: {
            sellerId,
            documentType: {
              in: [DocumentType.HACCP, DocumentType.ITINERANT_CARD],
            },
          },
          select: { status: true },
        });
        const hasAllOptional =
          optionalDocs.length === 2 &&
          optionalDocs.every((d) => d.status !== DocumentStatus.MISSING);
        const badge = !hasCore
          ? ComplianceBadgeStatus.MISSING_CORE
          : anyExpiring
            ? ComplianceBadgeStatus.EXPIRING
            : hasAllOptional
              ? ComplianceBadgeStatus.COMPLETE
              : ComplianceBadgeStatus.INCOMPLETE;
        await prisma.organization.update({
          where: { id: sellerId },
          data: { complianceBadge: badge },
        });
        await prisma.stritAuditLog.create({
          data: {
            id: crypto.randomUUID(),
            eventType: 'DocumentUpload',
            actorRole: 'seller',
            actorId: ctx.user.id,
            entityType: 'Document',
            entityId: created.id,
            metadata: { documentType: args.input.documentType },
          },
        });
        return created;
      },
    })
  );

  const ReviewDocumentInput = gqlSchemaBuilder.inputType(
    'ReviewDocumentInput',
    {
      fields: (t) => ({
        documentId: t.id({ required: true }),
        status: t.field({ type: DocumentStatusEnum, required: true }),
        reviewNotes: t.string({ required: false }),
      }),
    }
  );

  gqlSchemaBuilder.mutationField('reviewDocument', (t) =>
    t.prismaField({
      type: 'StritDocument',
      args: { input: t.arg({ type: ReviewDocumentInput, required: true }) },
      resolve: async (query, _root, args, ctx) => {
        if (!ctx.user) throw new Error('Unauthorized');
        const user = await prisma.user.findUnique({
          where: { id: ctx.user.id },
          select: { role: true },
        });
        if (user?.role !== 'admin') throw new Error('FORBIDDEN');
        return prisma.stritDocument.update({
          ...query,
          where: { id: args.input.documentId as string },
          data: {
            status: args.input.status,
            reviewNotes: args.input.reviewNotes ?? null,
            verifiedBy: ctx.user.id,
            verifiedAt: new Date(),
            updatedAt: new Date(),
          },
        });
      },
    })
  );
}
