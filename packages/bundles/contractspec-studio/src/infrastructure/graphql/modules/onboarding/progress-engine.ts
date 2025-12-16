import { prisma as studioDb } from '@lssm/lib.database-contractspec-studio';
import { ensureLearningJourneyTracks } from './ensure-tracks';
import {
  asRecord,
  matchesCondition,
  parseCondition,
} from './progress-matching';
import { recomputeAndPersistOnboardingProgress } from './progress-recompute';
import { toInputJson } from '../../../../utils/prisma-json';

export interface AdvanceOnboardingFromEventInput {
  userId: string;
  organizationId: string;
  eventName: string;
  eventPayload: unknown;
  occurredAt: Date;
}

type CandidateStep = {
  id: string;
  trackId: string;
  xpReward: number | null;
  completionCondition: unknown;
};

export async function advanceOnboardingFromLearningEvent(
  input: AdvanceOnboardingFromEventInput
): Promise<void> {
  await ensureLearningJourneyTracks();

  const learner = await studioDb.learner.upsert({
    where: {
      userId_organizationId: {
        userId: input.userId,
        organizationId: input.organizationId,
      },
    },
    create: {
      userId: input.userId,
      organizationId: input.organizationId,
    },
    update: {},
  });

  const candidateSteps = await studioDb.onboardingStep.findMany({
    where: { completionEvent: input.eventName },
    select: {
      id: true,
      trackId: true,
      xpReward: true,
      completionCondition: true,
    },
  });

  if (!candidateSteps.length) return;

  const stepsByTrackId = groupBy(candidateSteps, (s) => s.trackId);

  for (const [trackId, steps] of stepsByTrackId.entries()) {
    await advanceTrack({
      learnerId: learner.id,
      organizationId: input.organizationId,
      trackId,
      steps,
      eventName: input.eventName,
      eventPayload: input.eventPayload,
      occurredAt: input.occurredAt,
    });
  }
}

async function advanceTrack(input: {
  learnerId: string;
  organizationId: string;
  trackId: string;
  steps: CandidateStep[];
  eventName: string;
  eventPayload: unknown;
  occurredAt: Date;
}): Promise<void> {
  const progress = await studioDb.onboardingProgress.upsert({
    where: {
      learnerId_trackId: { learnerId: input.learnerId, trackId: input.trackId },
    },
    create: {
      learnerId: input.learnerId,
      trackId: input.trackId,
      startedAt: input.occurredAt,
      lastActivityAt: input.occurredAt,
    },
    update: {
      lastActivityAt: input.occurredAt,
    },
  });

  const stepIds = input.steps.map((s) => s.id);
  const alreadyCompleted = await studioDb.onboardingStepCompletion.findMany({
    where: { progressId: progress.id, stepId: { in: stepIds } },
    select: { stepId: true },
  });
  const alreadyCompletedSet = new Set(alreadyCompleted.map((c) => c.stepId));

  const payloadRecord = asRecord(input.eventPayload);

  for (const step of input.steps) {
    if (alreadyCompletedSet.has(step.id)) continue;

    const condition = parseCondition(step.completionCondition, input.eventName);
    const matched = await matchesCondition({
      condition,
      eventName: input.eventName,
      eventPayload: payloadRecord,
      occurredAt: input.occurredAt,
      trackStartedAt: progress.startedAt,
      organizationId: input.organizationId,
    });

    if (!matched) continue;

    await studioDb.onboardingStepCompletion.create({
      data: {
        progressId: progress.id,
        stepId: step.id,
        status: 'COMPLETED',
        xpEarned: step.xpReward ?? 0,
        triggeringEvent: input.eventName,
        eventPayload:
          payloadRecord === undefined ? undefined : toInputJson(payloadRecord),
        completedAt: input.occurredAt,
      },
    });
  }

  await recomputeAndPersistOnboardingProgress({
    progressId: progress.id,
    trackId: input.trackId,
    occurredAt: input.occurredAt,
    organizationId: input.organizationId,
  });
}

function groupBy<T, K extends string>(
  items: T[],
  keyFn: (item: T) => K
): Map<K, T[]> {
  const map = new Map<K, T[]>();
  for (const item of items) {
    const key = keyFn(item);
    const existing = map.get(key);
    if (existing) {
      existing.push(item);
    } else {
      map.set(key, [item]);
    }
  }
  return map;
}




