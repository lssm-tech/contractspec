import { gqlSchemaBuilder } from '../../builder';
import {
  prisma as studioDb,
  type OnboardingProgress,
  type OnboardingStep,
  type OnboardingStepCompletion,
  type OnboardingTrack,
} from '@lssm/lib.database-contractspec-studio';

export function createOnboardingGraphqlTypes(builder: typeof gqlSchemaBuilder) {
  const OnboardingStepType = builder
    .objectRef<OnboardingStep>('OnboardingStep')
    .implement({
      fields: (t) => ({
        id: t.exposeID('id'),
        trackId: t.exposeString('trackId'),
        stepKey: t.exposeString('stepKey'),
        title: t.exposeString('title'),
        description: t.exposeString('description', { nullable: true }),
        instructions: t.exposeString('instructions', { nullable: true }),
        helpUrl: t.exposeString('helpUrl', { nullable: true }),
        order: t.exposeInt('order'),
        completionEvent: t.exposeString('completionEvent'),
        completionCondition: t.field({
          type: 'JSON',
          nullable: true,
          resolve: (s) => s.completionCondition ?? null,
        }),
        availability: t.field({
          type: 'JSON',
          nullable: true,
          resolve: (s) => s.availability ?? null,
        }),
        xpReward: t.exposeInt('xpReward', { nullable: true }),
        isRequired: t.exposeBoolean('isRequired'),
        canSkip: t.exposeBoolean('canSkip'),
        actionUrl: t.exposeString('actionUrl', { nullable: true }),
        actionLabel: t.exposeString('actionLabel', { nullable: true }),
        highlightSelector: t.exposeString('highlightSelector', {
          nullable: true,
        }),
        tooltipPosition: t.exposeString('tooltipPosition', { nullable: true }),
        metadata: t.field({
          type: 'JSON',
          nullable: true,
          resolve: (s) => s.metadata ?? null,
        }),
        createdAt: t.expose('createdAt', { type: 'Date' }),
        updatedAt: t.expose('updatedAt', { type: 'Date' }),
      }),
    });

  const OnboardingTrackType = builder
    .objectRef<OnboardingTrack>('OnboardingTrack')
    .implement({
      fields: (t) => ({
        id: t.exposeID('id'),
        trackKey: t.exposeString('trackKey'),
        productId: t.exposeString('productId', { nullable: true }),
        name: t.exposeString('name'),
        description: t.exposeString('description', { nullable: true }),
        targetUserSegment: t.exposeString('targetUserSegment', {
          nullable: true,
        }),
        targetRole: t.exposeString('targetRole', { nullable: true }),
        isActive: t.exposeBoolean('isActive'),
        isRequired: t.exposeBoolean('isRequired'),
        canSkip: t.exposeBoolean('canSkip'),
        totalXp: t.exposeInt('totalXp', { nullable: true }),
        completionXpBonus: t.exposeInt('completionXpBonus', { nullable: true }),
        completionBadgeKey: t.exposeString('completionBadgeKey', {
          nullable: true,
        }),
        streakHoursWindow: t.exposeInt('streakHoursWindow', { nullable: true }),
        streakBonusXp: t.exposeInt('streakBonusXp', { nullable: true }),
        metadata: t.field({
          type: 'JSON',
          nullable: true,
          resolve: (s) => s.metadata ?? null,
        }),
        createdAt: t.expose('createdAt', { type: 'Date' }),
        updatedAt: t.expose('updatedAt', { type: 'Date' }),
        steps: t.field({
          type: [OnboardingStepType],
          resolve: async (track) => {
            return studioDb.onboardingStep.findMany({
              where: { trackId: track.id },
              orderBy: { order: 'asc' },
            });
          },
        }),
      }),
    });

  const OnboardingStepCompletionType = builder
    .objectRef<OnboardingStepCompletion>('OnboardingStepCompletion')
    .implement({
      fields: (t) => ({
        id: t.exposeID('id'),
        progressId: t.exposeString('progressId'),
        stepId: t.exposeString('stepId'),
        status: t.exposeString('status'),
        xpEarned: t.exposeInt('xpEarned'),
        triggeringEvent: t.exposeString('triggeringEvent', { nullable: true }),
        eventPayload: t.field({
          type: 'JSON',
          nullable: true,
          resolve: (c) => c.eventPayload ?? null,
        }),
        completedAt: t.expose('completedAt', { type: 'Date' }),
        createdAt: t.expose('createdAt', { type: 'Date' }),
        stepKey: t.string({
          resolve: async (c) => {
            const step = await studioDb.onboardingStep.findUnique({
              where: { id: c.stepId },
              select: { stepKey: true },
            });
            return step?.stepKey ?? c.stepId;
          },
        }),
      }),
    });

  const OnboardingProgressType = builder
    .objectRef<OnboardingProgress>('OnboardingProgress')
    .implement({
      fields: (t) => ({
        id: t.exposeID('id'),
        learnerId: t.exposeString('learnerId'),
        trackId: t.exposeString('trackId'),
        progress: t.exposeInt('progress'),
        isCompleted: t.exposeBoolean('isCompleted'),
        xpEarned: t.exposeInt('xpEarned'),
        startedAt: t.expose('startedAt', { type: 'Date' }),
        completedAt: t.expose('completedAt', { type: 'Date', nullable: true }),
        lastActivityAt: t.expose('lastActivityAt', {
          type: 'Date',
          nullable: true,
        }),
        isDismissed: t.exposeBoolean('isDismissed'),
        dismissedAt: t.expose('dismissedAt', { type: 'Date', nullable: true }),
        metadata: t.field({
          type: 'JSON',
          nullable: true,
          resolve: (p) => p.metadata ?? null,
        }),
        createdAt: t.expose('createdAt', { type: 'Date' }),
        updatedAt: t.expose('updatedAt', { type: 'Date' }),
        trackKey: t.string({
          resolve: async (p) => {
            const track = await studioDb.onboardingTrack.findUnique({
              where: { id: p.trackId },
              select: { trackKey: true },
            });
            return track?.trackKey ?? p.trackId;
          },
        }),
        stepCompletions: t.field({
          type: [OnboardingStepCompletionType],
          resolve: async (p) => {
            return studioDb.onboardingStepCompletion.findMany({
              where: { progressId: p.id },
              orderBy: { completedAt: 'desc' },
            });
          },
        }),
      }),
    });

  const MyOnboardingTracksType = builder
    .objectRef<{
      tracks: OnboardingTrack[];
      progress: OnboardingProgress[];
    }>('MyOnboardingTracks')
    .implement({
      fields: (t) => ({
        tracks: t.field({
          type: [OnboardingTrackType],
          resolve: (p) => p.tracks,
        }),
        progress: t.field({
          type: [OnboardingProgressType],
          resolve: (p) => p.progress,
        }),
      }),
    });

  return {
    OnboardingStepType,
    OnboardingTrackType,
    OnboardingStepCompletionType,
    OnboardingProgressType,
    MyOnboardingTracksType,
  };
}








