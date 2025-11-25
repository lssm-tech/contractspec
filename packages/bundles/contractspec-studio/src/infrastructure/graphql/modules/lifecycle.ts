import { gqlSchemaBuilder } from '../builder';
import { requireAuth } from '../types';
import {
  prisma as studioDb,
  LifecycleStage as PrismaLifecycleStage,
  MilestoneStatus,
  type OrganizationLifecycleProfile,
  type LifecycleAssessment as PrismaLifecycleAssessment,
  type LifecycleMilestoneProgress,
} from '@lssm/lib.database-contractspec-studio';
import {
  LifecycleAssessmentService,
  type LifecycleAssessmentResponse,
} from '@lssm/bundle.lifecycle-managed';
import {
  type LifecycleAction,
  type LifecycleMilestone,
  type LifecycleRecommendation,
  type LifecycleSignal,
} from '@lssm/lib.lifecycle';
import { toInputJson, toJsonNullValue } from '../../../utils/prisma-json';
import {
  toPrismaLifecycleStage,
  fromPrismaLifecycleStage,
} from '../../../utils/lifecycle-stage';

const lifecycleService = new LifecycleAssessmentService({
  collector: {},
});

const debugGraphQL =
  process.env.CONTRACTSPEC_DEBUG_GRAPHQL_BUILDER === 'true';

if (debugGraphQL) {
  console.log('[graphql-lifecycle] module loaded');
}

export function registerLifecycleSchema(builder: typeof gqlSchemaBuilder) {
  if (debugGraphQL) {
    console.log('[graphql-lifecycle] registering schema');
  }
  const LifecycleStageEnum = builder.enumType('LifecycleStageEnum', {
    values: Object.values(PrismaLifecycleStage),
  });
  const MilestoneStatusEnum = builder.enumType('MilestoneStatusEnum', {
    values: Object.values(MilestoneStatus),
  });

  const LifecycleActionType = builder
    .objectRef<LifecycleAction>('LifecycleAction')
    .implement({
      fields: (t) => ({
        id: t.exposeID('id'),
        stage: t.field({
          type: LifecycleStageEnum,
          resolve: (action) => toPrismaLifecycleStage(action.stage),
        }),
        title: t.exposeString('title'),
        description: t.exposeString('description'),
        category: t.exposeString('category'),
        priority: t.exposeInt('priority'),
        estimatedImpact: t.exposeString('estimatedImpact'),
        effortLevel: t.exposeString('effortLevel'),
        recommendedLibraries: t.field({
          type: ['String'],
          resolve: (action) => action.recommendedLibraries ?? [],
        }),
      }),
    });

  const LifecycleMilestoneType = builder
    .objectRef<LifecycleMilestone>('LifecycleMilestone')
    .implement({
      fields: (t) => ({
        id: t.exposeID('id'),
        stage: t.field({
          type: LifecycleStageEnum,
          resolve: (milestone) => toPrismaLifecycleStage(milestone.stage),
        }),
        category: t.exposeString('category'),
        title: t.exposeString('title'),
        description: t.exposeString('description'),
        priority: t.exposeInt('priority'),
        guideContent: t.exposeString('guideContent', { nullable: true }),
        actionItems: t.field({
          type: ['String'],
          resolve: (milestone) => milestone.actionItems ?? [],
        }),
      }),
    });

  const LifecycleRecommendationType = builder
    .objectRef<LifecycleRecommendation>('LifecycleRecommendation')
    .implement({
      fields: (t) => ({
        stage: t.field({
          type: LifecycleStageEnum,
          resolve: (rec) => toPrismaLifecycleStage(rec.stage),
        }),
        actions: t.field({
          type: [LifecycleActionType],
          resolve: (rec) => rec.actions,
        }),
        upcomingMilestones: t.field({
          type: [LifecycleMilestoneType],
          resolve: (rec) => rec.upcomingMilestones,
        }),
        ceremony: t.field({
          type: builder
            .objectRef<
              NonNullable<LifecycleRecommendation['ceremony']>
            >('LifecycleCeremony')
            .implement({
              fields: (inner) => ({
                title: inner.exposeString('title'),
                copy: inner.exposeString('copy'),
                cues: inner.field({
                  type: ['String'],
                  resolve: (ceremony) => ceremony.cues ?? [],
                }),
              }),
            }),
          nullable: true,
          resolve: (rec) => rec.ceremony ?? null,
        }),
      }),
    });

  const LifecycleMilestoneProgressType = builder
    .objectRef<LifecycleMilestoneProgress>('LifecycleMilestoneProgress')
    .implement({
      fields: (t) => ({
        id: t.exposeID('id'),
        milestoneId: t.exposeString('milestoneId'),
        category: t.exposeString('category'),
        status: t.field({
          type: MilestoneStatusEnum,
          resolve: (progress) => progress.status,
        }),
        startedAt: t.field({
          type: 'Date',
          nullable: true,
          resolve: (progress) => progress.startedAt ?? null,
        }),
        completedAt: t.field({
          type: 'Date',
          nullable: true,
          resolve: (progress) => progress.completedAt ?? null,
        }),
      }),
    });

  const LifecycleAssessmentType = builder
    .objectRef<PrismaLifecycleAssessment>('LifecycleAssessmentRecord')
    .implement({
      fields: (t) => ({
        id: t.exposeID('id'),
        profileId: t.exposeString('profileId'),
        stage: t.field({
          type: LifecycleStageEnum,
          resolve: (assessment) => assessment.stage,
        }),
        confidence: t.exposeFloat('confidence'),
        focusAreas: t.field({
          type: ['String'],
          resolve: (assessment) => (assessment.focusAreas as string[]) ?? [],
        }),
        signals: t.field({
          type: 'JSON',
          resolve: (assessment) => assessment.signals,
        }),
        createdAt: t.field({
          type: 'Date',
          resolve: (assessment) => assessment.createdAt,
        }),
      }),
    });

  const OrganizationLifecycleProfileType = builder
    .objectRef<OrganizationLifecycleProfile>('OrganizationLifecycleProfile')
    .implement({
      fields: (t) => ({
        id: t.exposeID('id'),
        organizationId: t.exposeString('organizationId'),
        currentStage: t.field({
          type: LifecycleStageEnum,
          resolve: (profile) => profile.currentStage,
        }),
        detectedStage: t.field({
          type: LifecycleStageEnum,
          resolve: (profile) => profile.detectedStage,
        }),
        confidence: t.exposeFloat('confidence'),
        productPhase: t.exposeString('productPhase', { nullable: true }),
        companyPhase: t.exposeString('companyPhase', { nullable: true }),
        capitalPhase: t.exposeString('capitalPhase', { nullable: true }),
        metrics: t.field({
          type: 'JSON',
          resolve: (profile) => profile.metrics,
        }),
        signals: t.field({
          type: 'JSON',
          resolve: (profile) => profile.signals,
        }),
        lastAssessment: t.field({
          type: 'Date',
          resolve: (profile) => profile.lastAssessment,
        }),
        nextAssessment: t.field({
          type: 'Date',
          nullable: true,
          resolve: (profile) => profile.nextAssessment ?? null,
        }),
        assessments: t.field({
          type: [LifecycleAssessmentType],
          resolve: (profile) =>
            studioDb.lifecycleAssessment.findMany({
              where: { profileId: profile.id },
              orderBy: { createdAt: 'desc' },
            }),
        }),
        milestones: t.field({
          type: [LifecycleMilestoneProgressType],
          resolve: (profile) =>
            studioDb.lifecycleMilestoneProgress.findMany({
              where: { profileId: profile.id },
              orderBy: { startedAt: 'desc' },
            }),
        }),
      }),
    });

  const AssessmentInput = builder.inputType('LifecycleAssessmentInput', {
    fields: (t) => ({
      axes: t.field({ type: 'JSON', required: false }),
      metrics: t.field({ type: 'JSON', required: false }),
      signals: t.field({ type: 'JSON', required: false }),
      questionnaireAnswers: t.field({ type: 'JSON', required: false }),
    }),
  });

  builder.queryFields((t) => ({
    lifecycleProfile: t.field({
      type: OrganizationLifecycleProfileType,
      resolve: async (_root, _args, ctx) => {
        const user = requireAuthAndGet(ctx);
        return getOrCreateProfile(user.organizationId);
      },
    }),
    lifecycleAssessments: t.field({
      type: [LifecycleAssessmentType],
      args: {
        limit: t.arg.int(),
      },
      resolve: async (_root, args, ctx) => {
        const user = requireAuthAndGet(ctx);
        const profile = await getOrCreateProfile(user.organizationId);
        return studioDb.lifecycleAssessment.findMany({
          where: { profileId: profile.id },
          take: args.limit ?? 25,
          orderBy: { createdAt: 'desc' },
        });
      },
    }),
    lifecycleRecommendations: t.field({
      type: LifecycleRecommendationType,
      resolve: async (_root, _args, ctx) => {
        const user = requireAuthAndGet(ctx);
        const profile = await getOrCreateProfile(user.organizationId);
        return lifecycleService.getStagePlaybook(
          fromPrismaLifecycleStage(profile.currentStage)
        ).recommendation;
      },
    }),
  }));

  builder.mutationFields((t) => ({
    runLifecycleAssessment: t.field({
      type: LifecycleAssessmentType,
      args: {
        input: t.arg({ type: AssessmentInput }),
      },
      resolve: async (_root, args, ctx) => {
        const user = requireAuthAndGet(ctx);
        const profile = await getOrCreateProfile(user.organizationId);
        const result = await lifecycleService.runAssessment({
          tenantId: user.organizationId,
          axes: (args.input?.axes as Record<string, unknown>) ?? undefined,
          metrics: (args.input?.metrics as Record<string, number>) ?? undefined,
          signals: (args.input?.signals as LifecycleSignal[]) ?? undefined,
          questionnaireAnswers:
            (args.input?.questionnaireAnswers as Record<string, unknown>) ??
            undefined,
        });

        await updateProfileFromAssessment(profile.id, result);
        return studioDb.lifecycleAssessment.create({
          data: {
            profileId: profile.id,
            stage: toPrismaLifecycleStage(result.assessment.stage),
            confidence: result.assessment.confidence,
            focusAreas: toInputJson(result.assessment.focusAreas ?? []),
            signals: toInputJson(result.assessment.signals ?? []),
          },
        });
      },
    }),
    trackLifecycleMilestone: t.field({
      type: LifecycleMilestoneProgressType,
      args: {
        milestoneId: t.arg.string({ required: true }),
        category: t.arg.string({ required: true }),
        status: t.arg({ type: MilestoneStatusEnum, required: true }),
      },
      resolve: async (_root, args, ctx) => {
        const user = requireAuthAndGet(ctx);
        const profile = await getOrCreateProfile(user.organizationId);
        const existing = await studioDb.lifecycleMilestoneProgress.findFirst({
          where: { profileId: profile.id, milestoneId: args.milestoneId },
        });

        if (existing) {
          return studioDb.lifecycleMilestoneProgress.update({
            where: { id: existing.id },
            data: {
              category: args.category,
              status: args.status,
              completedAt:
                args.status === MilestoneStatus.COMPLETED
                  ? new Date()
                  : existing.completedAt,
              startedAt: existing.startedAt ?? new Date(),
            },
          });
        }

        return studioDb.lifecycleMilestoneProgress.create({
          data: {
            profileId: profile.id,
            milestoneId: args.milestoneId,
            category: args.category,
            status: args.status,
            startedAt: new Date(),
            completedAt:
              args.status === MilestoneStatus.COMPLETED ? new Date() : null,
          },
        });
      },
    }),
  }));

  if (debugGraphQL) {
    console.log('[graphql-lifecycle] schema ready');
  }
}

function requireAuthAndGet(
  ctx: Parameters<typeof requireAuth>[0]
): NonNullable<typeof ctx.user> & { organizationId: string } {
  requireAuth(ctx);
  if (!ctx.user?.organizationId) {
    throw new Error('Organization context is required.');
  }
  return ctx.user as NonNullable<typeof ctx.user> & { organizationId: string };
}

async function getOrCreateProfile(organizationId: string) {
  const existing = await studioDb.organizationLifecycleProfile.findUnique({
    where: { organizationId },
  });
  if (existing) return existing;
  return studioDb.organizationLifecycleProfile.create({
    data: {
      organizationId,
      currentStage: PrismaLifecycleStage.EXPLORATION,
      detectedStage: PrismaLifecycleStage.EXPLORATION,
      confidence: 0.5,
      productPhase: 'Sketch',
      companyPhase: 'Solo',
      capitalPhase: 'Bootstrapped',
      lastAssessment: new Date(),
      metrics: toInputJson({}),
      signals: toInputJson([]),
    },
  });
}

async function updateProfileFromAssessment(
  profileId: string,
  result: LifecycleAssessmentResponse
) {
  await studioDb.organizationLifecycleProfile.update({
    where: { id: profileId },
    data: {
      currentStage: toPrismaLifecycleStage(result.assessment.stage),
      detectedStage: toPrismaLifecycleStage(result.assessment.stage),
      confidence: result.assessment.confidence,
      metrics: toJsonNullValue(result.assessment.metrics ?? {}),
      signals: toJsonNullValue(result.assessment.signals ?? []),
      lastAssessment: new Date(),
      nextAssessment: addDays(new Date(), 30),
    },
  });
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}
