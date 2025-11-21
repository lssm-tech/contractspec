import { gqlSchemaBuilder } from '../builder';
import { DocumentStatus, prisma } from '@lssm/app.cli-database-strit';
import { requirePlatformAdmin, requireSellerOrgId } from '../guards';
import { DocumentType } from '@lssm/app.cli-database-strit/enums';

export function registerStritNotificationsSchema() {
  // Booking confirmation (idempotent via flag)
  gqlSchemaBuilder.mutationField('sendBookingConfirmation', (t) =>
    t.field({
      type: 'Boolean',
      args: { bookingId: t.arg.id({ required: true }) },
      resolve: async (_root, args, ctx) => {
        if (!ctx.user) throw new Error('Unauthorized');
        const booking = await prisma.booking.findUnique({
          where: { id: args.bookingId as string },
          select: { confirmationEmailSent: true },
        });
        if (!booking) throw new Error('NOT_FOUND');
        if (booking.confirmationEmailSent) return false;
        await prisma.booking.update({
          where: { id: args.bookingId as string },
          data: {
            confirmationEmailSent: true,
            confirmationEmailSentAt: new Date(),
          },
        });
        await prisma.stritAuditLog.create({
          data: {
            id: crypto.randomUUID(),
            eventType: 'BookingConfirmationEmailSent',
            actorRole: 'system',
            actorId: ctx.user.id,
            entityType: 'Booking',
            entityId: args.bookingId as string,
          },
        });
        return true;
      },
    })
  );

  // Nightly reminder job (callable endpoint)
  gqlSchemaBuilder.mutationField('runExpiryReminderJob', (t) =>
    t.field({
      type: 'Int',
      resolve: async () => {
        const in14 = new Date(Date.now() + 14 * 86400000);
        const due = await prisma.stritDocument.findMany({
          where: {
            expiryDate: { gte: in14, lt: new Date(in14.getTime() + 86400000) },
            reminderSent: false,
          },
          select: { id: true },
        });
        for (const d of due) {
          await prisma.stritDocument.update({
            where: { id: d.id },
            data: {
              reminderSent: true,
              reminderSentAt: new Date(),
              status: DocumentStatus.EXPIRING,
            },
          });
        }
        return due.length;
      },
    })
  );

  // KYC complete notification (idempotent via audit log)
  gqlSchemaBuilder.mutationField('sendKycCompleteIfEligible', (t) =>
    t.field({
      type: 'Boolean',
      args: { sellerId: t.arg.id({ required: false }) },
      resolve: async (_root, args, ctx) => {
        if (!ctx.user) throw new Error('Unauthorized');
        let targetSellerId = args.sellerId as string | undefined;
        if (targetSellerId) {
          // Only admins can target arbitrary seller
          await requirePlatformAdmin(ctx);
        } else {
          targetSellerId = await requireSellerOrgId(ctx);
        }

        // Check KYC core: KBIS verified and at least one verified user (phone)
        const docs = await prisma.stritDocument.findMany({
          where: {
            sellerId: targetSellerId,
            documentType: DocumentType.KBIS,
          },
          select: { documentType: true, status: true },
        });
        const kbisOk = docs.some(
          (d) =>
            d.documentType === DocumentType.KBIS &&
            d.status === DocumentStatus.VERIFIED
        );
        if (!kbisOk) return false;
        const memberWithVerifiedPhone = await prisma.member.findFirst({
          where: {
            organizationId: targetSellerId,
            user: { phoneNumberVerified: true },
          },
          select: { id: true },
        });
        if (!memberWithVerifiedPhone) return false;

        // Idempotency via audit log
        const already = await prisma.stritAuditLog.findFirst({
          where: {
            eventType: 'KYCCompleteEmailSent',
            entityType: 'Organization',
            entityId: targetSellerId,
          },
          select: { id: true },
        });
        if (already) return false;

        await prisma.stritAuditLog.create({
          data: {
            id: crypto.randomUUID(),
            eventType: 'KYCCompleteEmailSent',
            actorRole: 'system',
            actorId: ctx.user.id,
            entityType: 'Organization',
            entityId: targetSellerId,
          },
        });
        return true;
      },
    })
  );
}
