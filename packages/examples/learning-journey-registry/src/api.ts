import { learningJourneyTracks } from './tracks';
import type {
  LearningJourneyTrackSpec,
  StepAvailabilitySpec,
  StepCompletionConditionSpec,
} from '@contractspec/module.learning-journey/track-spec';
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

const matchesBaseEvent = (
  condition: {
    eventName: string;
    eventVersion?: number;
    sourceModule?: string;
    payloadFilter?: Record<string, unknown>;
  },
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

const matchesCondition = (
  condition: StepCompletionConditionSpec,
  event: LearningEvent,
  step: StepProgress,
  trackStartedAt: Date | undefined
): {
  matched: boolean;
  occurrences?: number;
  masteryCount?: number;
} => {
  if (condition.kind === 'count') {
    if (!matchesBaseEvent(condition, event)) return { matched: false };
    const occurrences = (step.occurrences ?? 0) + 1;
    const within =
      condition.withinHours === undefined ||
      Boolean(
        trackStartedAt &&
        event.occurredAt &&
        (event.occurredAt.getTime() - trackStartedAt.getTime()) /
          (1000 * 60 * 60) <=
          condition.withinHours
      );
    return { matched: within && occurrences >= condition.atLeast, occurrences };
  }

  if (condition.kind === 'time_window') {
    if (!matchesBaseEvent(condition, event)) return { matched: false };
    if (
      condition.withinHoursOfStart !== undefined &&
      trackStartedAt &&
      event.occurredAt
    ) {
      const hoursSinceStart =
        (event.occurredAt.getTime() - trackStartedAt.getTime()) /
        (1000 * 60 * 60);
      if (hoursSinceStart > condition.withinHoursOfStart) {
        return { matched: false };
      }
    }
    return { matched: true };
  }

  if (condition.kind === 'srs_mastery') {
    if (event.name !== condition.eventName) return { matched: false };
    const payload = event.payload as Record<string, unknown> | undefined;
    if (!matchesFilter(condition.payloadFilter, payload)) {
      return { matched: false };
    }
    const skillKey = condition.skillIdField ?? 'skillId';
    const masteryKey = condition.masteryField ?? 'mastery';
    const skillId = payload?.[skillKey];
    const masteryValue = payload?.[masteryKey];
    if (skillId === undefined || masteryValue === undefined) {
      return { matched: false };
    }
    if (typeof masteryValue !== 'number') return { matched: false };
    if (masteryValue < condition.minimumMastery) return { matched: false };
    const masteryCount = (step.masteryCount ?? 0) + 1;
    const required = condition.requiredCount ?? 1;
    return { matched: masteryCount >= required, masteryCount };
  }

  return { matched: matchesBaseEvent(condition, event) };
};

const getAvailability = (
  availability: StepAvailabilitySpec | undefined,
  startedAt: Date | undefined
): { availableAt?: Date; dueAt?: Date } => {
  if (!availability || !startedAt) return {};

  const baseTime = startedAt.getTime();
  let unlockTime = baseTime;

  if (availability.unlockOnDay !== undefined) {
    unlockTime =
      baseTime + (availability.unlockOnDay - 1) * 24 * 60 * 60 * 1000;
  }

  if (availability.unlockAfterHours !== undefined) {
    unlockTime = baseTime + availability.unlockAfterHours * 60 * 60 * 1000;
  }

  const availableAt = new Date(unlockTime);
  const dueAt =
    availability.dueWithinHours !== undefined
      ? new Date(
          availableAt.getTime() + availability.dueWithinHours * 60 * 60 * 1000
        )
      : undefined;

  return { availableAt, dueAt };
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
  const eventTime = event.occurredAt ?? new Date();

  for (const track of targets) {
    const map = getLearnerTracks(event.learnerId);
    const current = map.get(track.id) ?? initProgress(event.learnerId, track);
    const startedAt = current.startedAt ?? eventTime;

    let changed = current.startedAt === undefined;
    const steps: StepProgress[] = current.steps.map((step) => {
      if (step.status === 'COMPLETED') return step;

      const spec = track.steps.find((s) => s.id === step.id);
      if (!spec) return step;

      const { availableAt, dueAt } = getAvailability(
        spec.availability,
        startedAt
      );
      if (availableAt && eventTime < availableAt) {
        return { ...step, availableAt, dueAt };
      }
      if (dueAt && eventTime > dueAt) {
        // keep pending but note deadlines
        return { ...step, availableAt, dueAt };
      }

      const result = matchesCondition(spec.completion, event, step, startedAt);

      if (result.matched) {
        changed = true;
        return {
          ...step,
          status: 'COMPLETED',
          xpEarned: spec.xpReward ?? 0,
          completedAt: eventTime,
          triggeringEvent: event.name,
          eventPayload: event.payload,
          occurrences: result.occurrences ?? step.occurrences,
          masteryCount: result.masteryCount ?? step.masteryCount,
          availableAt,
          dueAt,
        };
      }

      if (
        result.occurrences !== undefined ||
        result.masteryCount !== undefined
      ) {
        changed = true;
      }

      return {
        ...step,
        occurrences: result.occurrences ?? step.occurrences,
        masteryCount: result.masteryCount ?? step.masteryCount,
        availableAt,
        dueAt,
      };
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
      startedAt,
      lastActivityAt: eventTime,
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
