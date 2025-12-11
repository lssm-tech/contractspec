import { learningJourneyTracks } from './tracks';
import type {
  LearningJourneyTrackSpec,
  StepCompletionConditionSpec,
} from '@lssm/module.learning-journey/track-spec';
import type { LearningEvent, StepProgress, TrackProgress } from './api-types';
import {
  getLearnerTracks,
  getTrackResolver,
  initProgress,
} from './progress-store';

const getTrack = getTrackResolver(learningJourneyTracks);

const matchesFilter = (
  filter: Record<string, unknown> | undefined,
  payload: Record<string, unknown> | undefined
): boolean => {
  if (!filter) return true;
  if (!payload) return false;
  return Object.entries(filter).every(([key, value]) => payload[key] === value);
};

const matchesCondition = (
  condition: StepCompletionConditionSpec,
  event: LearningEvent
): boolean => {
  if (condition.eventName !== event.name) return false;
  if (condition.eventVersion !== undefined && event.version !== undefined) {
    if (condition.eventVersion !== event.version) return false;
  }
  if (
    condition.sourceModule &&
    event.sourceModule &&
    condition.sourceModule !== event.sourceModule
  ) {
    return false;
  }
  return matchesFilter(
    condition.payloadFilter,
    event.payload as Record<string, unknown> | undefined
  );
};

const computeProgressPercent = (steps: StepProgress[]): number => {
  const total = steps.length || 1;
  const done = steps.filter((s) => s.status === 'COMPLETED').length;
  return Math.round((done / total) * 100);
};

const applyTrackCompletionBonuses = (
  track: LearningJourneyTrackSpec,
  progress: TrackProgress
) => {
  if (progress.isCompleted) return progress;

  const completedAt = new Date();
  const startedAt = progress.startedAt ?? completedAt;
  const hoursElapsed =
    (completedAt.getTime() - startedAt.getTime()) / (1000 * 60 * 60);

  let xpEarned = progress.xpEarned;
  const { completionRewards, streakRule } = track;

  if (completionRewards?.xpBonus) {
    xpEarned += completionRewards.xpBonus;
  }

  if (
    streakRule?.hoursWindow !== undefined &&
    hoursElapsed <= streakRule.hoursWindow &&
    streakRule.bonusXp
  ) {
    xpEarned += streakRule.bonusXp;
  }

  return {
    ...progress,
    xpEarned,
    isCompleted: true,
    completedAt,
    lastActivityAt: completedAt,
  };
};

export const listTracks = (learnerId?: string) => {
  const progressMap = learnerId ? getLearnerTracks(learnerId) : undefined;
  const progress =
    learnerId && progressMap
      ? Array.from(progressMap.values())
      : ([] as TrackProgress[]);

  return {
    tracks: learningJourneyTracks,
    progress,
  };
};

export const getProgress = (trackId: string, learnerId: string) => {
  const track = getTrack(trackId);
  if (!track) return undefined;

  const map = getLearnerTracks(learnerId);
  const existing = map.get(trackId) ?? initProgress(learnerId, track);
  map.set(trackId, existing);
  return existing;
};

export const recordEvent = (event: LearningEvent) => {
  const targets =
    event.trackId !== undefined
      ? learningJourneyTracks.filter((t) => t.id === event.trackId)
      : learningJourneyTracks;

  const updated: TrackProgress[] = [];

  for (const track of targets) {
    const map = getLearnerTracks(event.learnerId);
    const current = map.get(track.id) ?? initProgress(event.learnerId, track);

    let changed = false;
    const steps: StepProgress[] = current.steps.map((step) => {
      if (step.status === 'COMPLETED') return step;

      const spec = track.steps.find((s) => s.id === step.id);
      if (!spec) return step;

      if (matchesCondition(spec.completion, event)) {
        changed = true;
        return {
          ...step,
          status: 'COMPLETED',
          xpEarned: spec.xpReward ?? 0,
          completedAt: event.occurredAt ?? new Date(),
          triggeringEvent: event.name,
          eventPayload: event.payload,
        } satisfies StepProgress;
      }

      return step;
    });

    if (!changed) {
      continue;
    }

    const xpEarned =
      steps.reduce((sum, s) => sum + s.xpEarned, 0) + (track.totalXp ?? 0);
    let progress: TrackProgress = {
      ...current,
      steps,
      xpEarned,
      startedAt: current.startedAt ?? new Date(),
      lastActivityAt: new Date(),
      progress: computeProgressPercent(steps),
    };

    const allDone = steps.every((s) => s.status === 'COMPLETED');
    if (allDone) {
      progress = applyTrackCompletionBonuses(track, progress);
    }

    map.set(track.id, progress);
    updated.push(progress);
  }

  return updated;
};
