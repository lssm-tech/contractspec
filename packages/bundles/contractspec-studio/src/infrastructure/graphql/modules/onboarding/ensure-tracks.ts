import type { LearningJourneyTrackSpec } from '@lssm/module.learning-journey/track-spec';
import { learningJourneyTracks } from '@lssm/example.learning-journey-registry/tracks';
import { prisma as studioDb } from '@lssm/lib.database-contractspec-studio';
import { toNullableJsonValue } from '../../../../utils/prisma-json';

let ensured = false;
let ensurePromise: Promise<void> | null = null;

export async function ensureLearningJourneyTracks(): Promise<void> {
  if (ensured) return;
  ensurePromise ??= doEnsure().then(() => {
    ensured = true;
  });
  return ensurePromise;
}

async function doEnsure(): Promise<void> {
  for (const track of learningJourneyTracks) {
    await upsertTrack(track);
  }
}

async function upsertTrack(track: LearningJourneyTrackSpec): Promise<void> {
  const dbTrack = await studioDb.onboardingTrack.upsert({
    where: { trackKey: track.id },
    create: {
      trackKey: track.id,
      productId: track.productId ?? null,
      name: track.name,
      description: track.description ?? null,
      targetUserSegment: track.targetUserSegment ?? null,
      targetRole: track.targetRole ?? null,
      isActive: track.isActive ?? true,
      isRequired: track.isRequired ?? false,
      canSkip: track.canSkip ?? true,
      totalXp: track.totalXp ?? null,
      completionXpBonus: track.completionRewards?.xpBonus ?? null,
      completionBadgeKey: track.completionRewards?.badgeKey ?? null,
      streakHoursWindow: track.streakRule?.hoursWindow ?? null,
      streakBonusXp: track.streakRule?.bonusXp ?? null,
      metadata: toNullableJsonValue(track.metadata),
    },
    update: {
      productId: track.productId ?? null,
      name: track.name,
      description: track.description ?? null,
      targetUserSegment: track.targetUserSegment ?? null,
      targetRole: track.targetRole ?? null,
      isActive: track.isActive ?? true,
      isRequired: track.isRequired ?? false,
      canSkip: track.canSkip ?? true,
      totalXp: track.totalXp ?? null,
      completionXpBonus: track.completionRewards?.xpBonus ?? null,
      completionBadgeKey: track.completionRewards?.badgeKey ?? null,
      streakHoursWindow: track.streakRule?.hoursWindow ?? null,
      streakBonusXp: track.streakRule?.bonusXp ?? null,
      metadata: toNullableJsonValue(track.metadata),
    },
  });

  for (const [index, step] of track.steps.entries()) {
    await studioDb.onboardingStep.upsert({
      where: {
        trackId_stepKey: {
          trackId: dbTrack.id,
          stepKey: step.id,
        },
      },
      create: {
        trackId: dbTrack.id,
        stepKey: step.id,
        title: step.title,
        description: step.description ?? null,
        instructions: step.instructions ?? null,
        helpUrl: step.helpUrl ?? null,
        order: step.order ?? index + 1,
        completionEvent: step.completion.eventName,
        completionCondition: toNullableJsonValue(step.completion),
        availability: toNullableJsonValue(step.availability),
        xpReward: step.xpReward ?? null,
        isRequired: step.isRequired ?? true,
        canSkip: step.canSkip ?? true,
        actionUrl: step.actionUrl ?? null,
        actionLabel: step.actionLabel ?? null,
        metadata: toNullableJsonValue(step.metadata),
      },
      update: {
        title: step.title,
        description: step.description ?? null,
        instructions: step.instructions ?? null,
        helpUrl: step.helpUrl ?? null,
        order: step.order ?? index + 1,
        completionEvent: step.completion.eventName,
        completionCondition: toNullableJsonValue(step.completion),
        availability: toNullableJsonValue(step.availability),
        xpReward: step.xpReward ?? null,
        isRequired: step.isRequired ?? true,
        canSkip: step.canSkip ?? true,
        actionUrl: step.actionUrl ?? null,
        actionLabel: step.actionLabel ?? null,
        metadata: toNullableJsonValue(step.metadata),
      },
    });
  }

  // Keep the DB definition aligned with the track spec (avoid stale steps blocking completion).
  await studioDb.onboardingStep.deleteMany({
    where: {
      trackId: dbTrack.id,
      stepKey: { notIn: track.steps.map((s) => s.id) },
    },
  });
}



