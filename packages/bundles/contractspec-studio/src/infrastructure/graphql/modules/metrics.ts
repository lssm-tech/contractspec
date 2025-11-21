import { gqlSchemaBuilder } from '../builder';
import {
  ComplianceBadgeStatus,
  prisma,
  SpotAvailabilityStatus,
} from '@lssm/app.cli-database-strit';

export function registerMetricsSchema() {
  const MetricsCard = gqlSchemaBuilder
    .objectRef<{ label: string; value: number }>('StritMetricsCard')
    .implement({
      fields: (t) => ({
        label: t.string({ resolve: (o) => o.label }),
        value: t.float({ resolve: (o) => o.value }),
      }),
    });

  gqlSchemaBuilder.queryField('collectivityMetricsSnapshot', (t) =>
    t.field({
      type: [MetricsCard],
      resolve: async (_root, _args, ctx) => {
        if (!ctx.user) throw new Error('Unauthorized');

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const [
          publishedToday,
          bookedToday,
          activeSellers7d,
          ordersToday,
          ordersVolumeToday,
        ] = await Promise.all([
          prisma.spotAvailability.count({
            where: {
              status: SpotAvailabilityStatus.PUBLISHED,
              date: { gte: todayStart, lte: todayEnd },
            },
          }),
          prisma.spotAvailability.count({
            where: {
              status: SpotAvailabilityStatus.BOOKED,
              date: { gte: todayStart, lte: todayEnd },
            },
          }),
          prisma.booking.count({
            where: { bookedAt: { gte: new Date(Date.now() - 7 * 86400000) } },
          }),
          prisma.wholesaleOrder.count({
            where: {
              createdAt: { gte: todayStart, lte: todayEnd },
              status: { in: ['pending', 'paid'] },
            },
          }),
          prisma.wholesaleOrder
            .aggregate({
              _sum: { totalAmount: true },
              where: {
                createdAt: { gte: todayStart, lte: todayEnd },
                status: { in: ['pending', 'paid'] },
              },
            })
            .then((r) => r._sum.totalAmount ?? 0),
        ]);

        const utilization =
          publishedToday > 0
            ? Math.round((bookedToday / publishedToday) * 100)
            : 0;

        // Compliance coverage: based on org snapshot badge
        const orgAgg = await prisma.organization.groupBy({
          by: ['complianceBadge'],
          _count: { _all: true },
        });
        const complete =
          orgAgg.find(
            (d) => d.complianceBadge === ComplianceBadgeStatus.COMPLETE
          )?._count?._all ?? 0;
        const missingCore =
          orgAgg.find(
            (d) => d.complianceBadge === ComplianceBadgeStatus.MISSING_CORE
          )?._count?._all ?? 0;
        const coverage =
          complete + missingCore > 0
            ? Math.round((complete / (complete + missingCore)) * 100)
            : 0;

        return [
          { label: 'Published Spots (Today)', value: publishedToday },
          { label: 'Booked Spots (Today)', value: bookedToday },
          { label: 'Utilization %', value: utilization },
          { label: 'Active Sellers (7d)', value: activeSellers7d },
          { label: 'Compliance Coverage % (Org)', value: coverage },
          { label: 'Wholesale Orders (Today)', value: ordersToday },
          { label: 'Wholesale Volume (Today)', value: ordersVolumeToday },
        ];
      },
    })
  );

  // Simple dashboard payload to replace /api/dashboard in web client
  const DashboardData = gqlSchemaBuilder
    .objectRef<{ currentDate: string }>('DashboardData')
    .implement({
      fields: (t) => ({
        currentDate: t.string({ resolve: (o) => o.currentDate }),
      }),
    });

  gqlSchemaBuilder.queryField('dashboardData', (t) =>
    t.field({
      type: DashboardData,
      resolve: async () => ({ currentDate: new Date().toISOString() }),
    })
  );
}
