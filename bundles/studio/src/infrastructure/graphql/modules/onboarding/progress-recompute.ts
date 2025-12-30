import { prisma as studioDb } from '@contractspec/lib.database-studio';

export async function recomputeAndPersistOnboardingProgress(input: {
  progressId: string;
  trackId: string;
  occurredAt: Date;
  organizationId: string;
}): Promise<void> {
  const [track, totalSteps, completions, existing] = await Promise.all([
    studioDb.onboardingTrack.findUnique({
      where: { id: input.trackId },
      select: {
        trackKey: true,
        completionXpBonus: true,
        streakHoursWindow: true,
        streakBonusXp: true,
      },
    }),
    studioDb.onboardingStep.count({ where: { trackId: input.trackId } }),
    studioDb.onboardingStepCompletion.findMany({
      where: { progressId: input.progressId },
      select: { status: true, xpEarned: true },
    }),
    studioDb.onboardingProgress.findUnique({
      where: { id: input.progressId },
      select: { isCompleted: true, startedAt: true },
    }),
  ]);

  if (!track || !existing) return;

  const doneCount = completions.filter(
    (c) => c.status === 'COMPLETED' || c.status === 'SKIPPED'
  ).length;
  const completedXp = completions.reduce(
    (sum, c) => sum + (c.xpEarned ?? 0),
    0
  );

  const percent = Math.round((doneCount / Math.max(totalSteps, 1)) * 100);
  const isNowCompleted = totalSteps > 0 && doneCount >= totalSteps;

  let xpEarned = completedXp;
  let completedAt: Date | null = null;
  let isCompleted = existing.isCompleted;

  if (isNowCompleted && !existing.isCompleted) {
    isCompleted = true;
    completedAt = input.occurredAt;

    if (track.completionXpBonus) {
      xpEarned += track.completionXpBonus;
    }

    if (track.streakHoursWindow && track.streakBonusXp) {
      const hoursElapsed =
        (input.occurredAt.getTime() - existing.startedAt.getTime()) /
        (1000 * 60 * 60);
      if (hoursElapsed <= track.streakHoursWindow) {
        xpEarned += track.streakBonusXp;
      }
    }
  }

  await studioDb.onboardingProgress.update({
    where: { id: input.progressId },
    data: {
      progress: percent,
      xpEarned,
      isCompleted,
      completedAt: completedAt ?? undefined,
      lastActivityAt: input.occurredAt,
    },
  });

  if (
    isNowCompleted &&
    !existing.isCompleted &&
    track.trackKey === 'studio_getting_started'
  ) {
    await studioDb.organization.update({
      where: { id: input.organizationId },
      data: { onboardingCompleted: true },
    });
  }
}
