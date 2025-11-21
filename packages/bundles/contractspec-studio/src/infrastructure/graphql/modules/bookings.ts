import { gqlSchemaBuilder } from '../builder';
import {
  prisma,
  BookingStatus,
  ComplianceBadgeStatus,
  DocumentType,
  DocumentStatus,
  SpotAvailabilityStatus,
} from '@lssm/app.cli-database-strit';
import { requireSellerOrgId } from '../guards';

export function registerBookingsSchema() {
  const BookingStatusEnum = gqlSchemaBuilder.enumType('BookingStatus', {
    values: [
      BookingStatus.ACTIVE,
      BookingStatus.CANCELLED,
      BookingStatus.COMPLETED,
    ] as const,
  });

  gqlSchemaBuilder.prismaObject('Booking', {
    fields: (t) => ({
      id: t.exposeID('id', { nullable: false }),
      spotAvailabilityId: t.exposeString('spotAvailabilityId', {
        nullable: false,
      }),
      sellerId: t.exposeString('sellerId'),
      status: t.field({
        type: BookingStatusEnum,
        resolve: (b) => b.status,
        nullable: false,
      }),
      bookedAt: t.field({ type: 'Date', resolve: (b) => b.bookedAt }),
      cancelledAt: t.field({
        type: 'Date',
        nullable: true,
        resolve: (b) => b.cancelledAt ?? null,
      }),
      createdAt: t.field({ type: 'Date', resolve: (b) => b.createdAt }),
      updatedAt: t.field({ type: 'Date', resolve: (b) => b.updatedAt }),
      complianceBadgeAtBooking: t.field({
        type: 'ComplianceBadgeStatus',
        resolve: (b) => b.complianceBadgeAtBooking,
      }),
      seller: t.relation('seller', { nullable: false }),
      spotDefinition: t.relation('spotDefinition', { nullable: false }),
      spotAvailability: t.relation('spotAvailability', { nullable: false }),
    }),
  });

  // bookAvailability is now defined via contracts; removed direct GraphQL mutation

  // Cancel booking (seller can cancel own active bookings)
  // cancelBooking is now defined via contracts; removed direct GraphQL mutation

  gqlSchemaBuilder.queryField('myBookings', (t) =>
    t.prismaField({
      type: ['Booking'],
      resolve: async (query, _root, _args, ctx) => {
        if (!ctx.user) throw new Error('Unauthorized');
        const membership = await prisma.member.findFirst({
          where: { userId: ctx.user.id },
          select: { organizationId: true },
        });
        if (!membership?.organizationId) return [];
        return prisma.booking.findMany({
          ...query,
          where: { sellerId: membership.organizationId },
          orderBy: { bookedAt: 'desc' },
        });
      },
    })
  );
}
