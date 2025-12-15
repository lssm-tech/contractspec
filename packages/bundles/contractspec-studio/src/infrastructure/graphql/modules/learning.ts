import { gqlSchemaBuilder } from '../builder';
import { requireAuth } from '../types';
import {
  prisma as studioDb,
  type StudioLearningEvent,
} from '@lssm/lib.database-contractspec-studio';
import { toNullableJsonValue } from '../../../utils/prisma-json';
import { ensureStudioProjectAccess } from '../guards/project-access';
import { advanceOnboardingFromLearningEvent } from './onboarding/progress-engine';

export function registerLearningSchema(builder: typeof gqlSchemaBuilder) {
  const StudioLearningEventType = builder
    .objectRef<StudioLearningEvent>('StudioLearningEvent')
    .implement({
      fields: (t) => ({
        id: t.exposeID('id'),
        organizationId: t.exposeString('organizationId'),
        projectId: t.exposeString('projectId', { nullable: true }),
        name: t.exposeString('name'),
        payload: t.field({
          type: 'JSON',
          nullable: true,
          resolve: (e) => e.payload ?? null,
        }),
        createdAt: t.field({ type: 'Date', resolve: (e) => e.createdAt }),
      }),
    });

  const RecordLearningEventInput = builder.inputType(
    'RecordLearningEventInput',
    {
      fields: (t) => ({
        projectId: t.string(),
        name: t.string({ required: true }),
        payload: t.field({ type: 'JSON' }),
      }),
    }
  );

  builder.queryFields((t) => ({
    myLearningEvents: t.field({
      type: [StudioLearningEventType],
      args: {
        projectId: t.arg.string(),
        limit: t.arg.int(),
      },
      resolve: async (_root, args, ctx) => {
        const user = requireAuthAndGet(ctx);
        if (args.projectId) {
          await ensureStudioProjectAccess({
            projectId: args.projectId,
            userId: user.id,
            organizationId: user.organizationId,
          });
        }
        return studioDb.studioLearningEvent.findMany({
          where: {
            organizationId: user.organizationId,
            projectId: args.projectId ?? undefined,
          },
          orderBy: { createdAt: 'desc' },
          take: args.limit ?? 200,
        });
      },
    }),
  }));

  builder.mutationFields((t) => ({
    recordLearningEvent: t.field({
      type: StudioLearningEventType,
      args: {
        input: t.arg({ type: RecordLearningEventInput, required: true }),
      },
      resolve: async (_root, args, ctx) => {
        const user = requireAuthAndGet(ctx);
        if (args.input.projectId) {
          await ensureStudioProjectAccess({
            projectId: args.input.projectId,
            userId: user.id,
            organizationId: user.organizationId,
          });
        }
        const event = await studioDb.studioLearningEvent.create({
          data: {
            organizationId: user.organizationId,
            projectId: args.input.projectId ?? undefined,
            name: args.input.name,
            payload:
              args.input.payload === undefined
                ? undefined
                : toNullableJsonValue(args.input.payload),
          },
        });

        try {
          await advanceOnboardingFromLearningEvent({
            userId: user.id,
            organizationId: user.organizationId,
            eventName: args.input.name,
            eventPayload: args.input.payload,
            occurredAt: event.createdAt,
          });
        } catch (error) {
          // Dev-first: allow Studio to function even if onboarding tables aren't migrated yet.
          if (process.env.NODE_ENV === 'production') {
            throw error;
          }
        }

        return event;
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
