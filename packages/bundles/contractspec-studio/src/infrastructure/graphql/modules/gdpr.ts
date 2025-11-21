import { gqlSchemaBuilder } from '../builder';
import { prisma } from '@lssm/app.cli-database-strit';
import { requireAuth } from '../types';

type GdprRequestType = 'DATA_EXPORT' | 'ACCOUNT_DELETION';

interface GdprRequestShape {
  id: string;
  type: GdprRequestType;
  status: string;
  createdAt: Date;
  metadata?: Record<string, unknown> | null;
}

export function registerGdprSchema() {
  const GdprRequest = gqlSchemaBuilder
    .objectRef<GdprRequestShape>('GdprRequest')
    .implement({
      fields: (t) => ({
        id: t.id({ resolve: (o) => o.id }),
        type: t.string({ resolve: (o) => o.type }),
        status: t.string({ resolve: (o) => o.status }),
        createdAt: t.field({ type: 'Date', resolve: (o) => o.createdAt }),
        metadata: t.field({
          type: 'JSON',
          nullable: true,
          resolve: (o) => o.metadata ?? null,
        }),
      }),
    });

  const GdprRequestPayload = gqlSchemaBuilder
    .objectRef<GdprRequestShape>('GdprRequestPayload')
    .implement({
      fields: (t) => ({
        id: t.id({ resolve: (o) => o.id }),
        type: t.string({ resolve: (o) => o.type }),
        status: t.string({ resolve: (o) => o.status }),
        createdAt: t.field({ type: 'Date', resolve: (o) => o.createdAt }),
        metadata: t.field({
          type: 'JSON',
          nullable: true,
          resolve: (o) => o.metadata ?? null,
        }),
      }),
    });

  const RequestAccountDeletionInput = gqlSchemaBuilder.inputType(
    'RequestAccountDeletionInput',
    {
      fields: (t) => ({
        reason: t.string({ required: false }),
        comments: t.string({ required: false }),
        userType: t.string({ required: false }),
        impactAcknowledged: t.boolean({ required: false }),
        handlingSpots: t.string({ required: false }),
      }),
    }
  );

  async function resolveActorRoleAndOrg(userId: string): Promise<{
    actorRole: string;
    organizationId: string | null;
    organizationType: string | null;
  }> {
    const membership = await prisma.member.findFirst({
      where: { userId },
      include: { organization: { select: { id: true, type: true } } },
      orderBy: { createdAt: 'asc' },
    });
    const organizationId = membership?.organization?.id ?? null;
    const organizationType =
      (membership?.organization?.type as string | null) ?? null;
    let actorRole = 'user';
    if (organizationType === 'SELLER') actorRole = 'seller';
    else if (organizationType === 'COLLECTIVITY')
      actorRole = 'collectivity_admin';
    return { actorRole, organizationId, organizationType };
  }

  // Mutations
  gqlSchemaBuilder.mutationField('requestDataExport', (t) =>
    t.field({
      type: GdprRequestPayload,
      resolve: async (_root, _args, ctx) => {
        requireAuth(ctx);
        const { actorRole, organizationId, organizationType } =
          await resolveActorRoleAndOrg(ctx.user.id);
        const id = crypto.randomUUID();
        await prisma.stritAuditLog.create({
          data: {
            id,
            eventType: 'GdprDataExportRequested',
            actorRole,
            actorId: ctx.user.id,
            entityType: organizationId ? 'Organization' : 'User',
            entityId: organizationId ?? ctx.user.id,
            metadata: {
              organizationType,
              requestedAt: new Date().toISOString(),
            },
          },
        });
        return {
          id,
          type: 'DATA_EXPORT',
          status: 'RECEIVED',
          createdAt: new Date(),
          metadata: { organizationType },
        } satisfies GdprRequestShape;
      },
    })
  );

  gqlSchemaBuilder.mutationField('requestAccountDeletion', (t) =>
    t.field({
      type: GdprRequestPayload,
      args: {
        input: t.arg({ type: RequestAccountDeletionInput, required: true }),
      },
      resolve: async (_root, args, ctx) => {
        requireAuth(ctx);
        const { actorRole, organizationId, organizationType } =
          await resolveActorRoleAndOrg(ctx.user.id);
        const id = crypto.randomUUID();
        await prisma.stritAuditLog.create({
          data: {
            id,
            eventType: 'GdprAccountDeletionRequested',
            actorRole,
            actorId: ctx.user.id,
            entityType: organizationId ? 'Organization' : 'User',
            entityId: organizationId ?? ctx.user.id,
            metadata: {
              reason: (args.input.reason as string | undefined) ?? null,
              comments: (args.input.comments as string | undefined) ?? null,
              userType:
                (args.input.userType as string | undefined) ?? organizationType,
              impactAcknowledged: !!args.input.impactAcknowledged,
              handlingSpots:
                (args.input.handlingSpots as string | undefined) ?? null,
              requestedAt: new Date().toISOString(),
            },
          },
        });
        return {
          id,
          type: 'ACCOUNT_DELETION',
          status: 'RECEIVED',
          createdAt: new Date(),
          metadata: { organizationType },
        } satisfies GdprRequestShape;
      },
    })
  );

  // Queries
  gqlSchemaBuilder.queryField('myGdprRequests', (t) =>
    t.field({
      type: [GdprRequest],
      resolve: async (_root, _args, ctx): Promise<GdprRequestShape[]> => {
        requireAuth(ctx);
        const rows = await prisma.stritAuditLog.findMany({
          where: {
            actorId: ctx.user.id,
            eventType: {
              in: ['GdprDataExportRequested', 'GdprAccountDeletionRequested'],
            },
          },
          orderBy: { timestamp: 'desc' },
          select: {
            id: true,
            eventType: true,
            timestamp: true,
            metadata: true,
          },
        });
        return rows.map((r) => ({
          id: r.id,
          type:
            r.eventType === 'GdprDataExportRequested'
              ? ('DATA_EXPORT' as const)
              : ('ACCOUNT_DELETION' as const),
          status: 'RECEIVED',
          createdAt: r.timestamp,
          metadata: (r.metadata ?? null) as Record<string, unknown> | null,
        }));
      },
    })
  );
}
