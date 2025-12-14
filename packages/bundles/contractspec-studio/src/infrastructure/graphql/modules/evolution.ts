import { gqlSchemaBuilder } from '../builder';
import { requireAuth } from '../types';
import {
  prisma as studioDb,
  EvolutionStatus,
  EvolutionTrigger,
  type EvolutionSession,
} from '@lssm/lib.database-contractspec-studio';
import { toInputJson, toNullableJsonValue } from '../../../utils/prisma-json';
import { ensureStudioProjectAccess } from '../guards/project-access';

export function registerEvolutionSchema(builder: typeof gqlSchemaBuilder) {
  const EvolutionTriggerEnum = builder.enumType('EvolutionTriggerEnum', {
    values: Object.values(EvolutionTrigger),
  });

  const EvolutionStatusEnum = builder.enumType('EvolutionStatusEnum', {
    values: Object.values(EvolutionStatus),
  });

  const EvolutionSessionType = builder
    .objectRef<EvolutionSession>('EvolutionSession')
    .implement({
      fields: (t) => ({
        id: t.exposeID('id'),
        projectId: t.exposeString('projectId'),
        trigger: t.field({
          type: EvolutionTriggerEnum,
          resolve: (s) => s.trigger,
        }),
        status: t.field({
          type: EvolutionStatusEnum,
          resolve: (s) => s.status,
        }),
        signals: t.field({ type: 'JSON', resolve: (s) => s.signals }),
        context: t.field({ type: 'JSON', resolve: (s) => s.context }),
        suggestions: t.field({ type: 'JSON', resolve: (s) => s.suggestions }),
        appliedChanges: t.field({
          type: 'JSON',
          nullable: true,
          resolve: (s) => s.appliedChanges ?? null,
        }),
        startedAt: t.field({ type: 'Date', resolve: (s) => s.startedAt }),
        completedAt: t.field({
          type: 'Date',
          nullable: true,
          resolve: (s) => s.completedAt ?? null,
        }),
      }),
    });

  const StartEvolutionSessionInput = builder.inputType(
    'StartEvolutionSessionInput',
    {
      fields: (t) => ({
        projectId: t.string({ required: true }),
        trigger: t.field({ type: EvolutionTriggerEnum, required: true }),
        signals: t.field({ type: 'JSON', required: true }),
        context: t.field({ type: 'JSON', required: true }),
        suggestions: t.field({ type: 'JSON', required: true }),
      }),
    }
  );

  const UpdateEvolutionSessionInput = builder.inputType(
    'UpdateEvolutionSessionInput',
    {
      fields: (t) => ({
        status: t.field({ type: EvolutionStatusEnum }),
        appliedChanges: t.field({ type: 'JSON' }),
        completedAt: t.field({ type: 'Date' }),
      }),
    }
  );

  builder.queryFields((t) => ({
    evolutionSessions: t.field({
      type: [EvolutionSessionType],
      args: {
        projectId: t.arg.string({ required: true }),
      },
      resolve: async (_root, args, ctx) => {
        const user = requireAuthAndGet(ctx);
        await ensureStudioProjectAccess({
          projectId: args.projectId,
          userId: user.id,
          organizationId: user.organizationId,
        });
        return studioDb.evolutionSession.findMany({
          where: { projectId: args.projectId },
          orderBy: { startedAt: 'desc' },
          take: 25,
        });
      },
    }),
  }));

  builder.mutationFields((t) => ({
    startEvolutionSession: t.field({
      type: EvolutionSessionType,
      args: {
        input: t.arg({ type: StartEvolutionSessionInput, required: true }),
      },
      resolve: async (_root, args, ctx) => {
        const user = requireAuthAndGet(ctx);
        await ensureStudioProjectAccess({
          projectId: args.input.projectId,
          userId: user.id,
          organizationId: user.organizationId,
        });
        return studioDb.evolutionSession.create({
          data: {
            projectId: args.input.projectId,
            trigger: args.input.trigger,
            status: EvolutionStatus.SUGGESTIONS_READY,
            signals: toInputJson(args.input.signals),
            context: toInputJson(args.input.context),
            suggestions: toInputJson(args.input.suggestions),
          },
        });
      },
    }),
    updateEvolutionSession: t.field({
      type: EvolutionSessionType,
      args: {
        id: t.arg.string({ required: true }),
        input: t.arg({ type: UpdateEvolutionSessionInput, required: true }),
      },
      resolve: async (_root, args, ctx) => {
        const user = requireAuthAndGet(ctx);
        const existing = await studioDb.evolutionSession.findUnique({
          where: { id: args.id },
          select: { id: true, projectId: true },
        });
        if (!existing) throw new Error('Evolution session not found');
        await ensureStudioProjectAccess({
          projectId: existing.projectId,
          userId: user.id,
          organizationId: user.organizationId,
        });
        return studioDb.evolutionSession.update({
          where: { id: args.id },
          data: {
            status: args.input.status ?? undefined,
            appliedChanges:
              args.input.appliedChanges === undefined
                ? undefined
                : toNullableJsonValue(args.input.appliedChanges),
            completedAt: args.input.completedAt ?? undefined,
          },
        });
      },
    }),
  }));
}

function requireAuthAndGet(
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

