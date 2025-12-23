import { describe, expect, it } from 'bun:test';

import type {
  LearningJourneyTrackSpec,
  StepAvailabilitySpec,
  StepCompletionConditionSpec,
} from '@lssm/module.learning-journey/track-spec';
import { SRSEngine } from '@lssm/module.learning-journey/engines/srs';
import { StreakEngine } from '@lssm/module.learning-journey/engines/streak';
import { XPEngine } from '@lssm/module.learning-journey/engines/xp';

import { ambientCoachTrack } from './tracks/ambient-coach';
import { drillsTrack } from './tracks/drills';
import { questTrack } from './tracks/quests';
import { LEARNING_EVENTS } from './events';

interface LearningEvent {
  name: string;
  payload?: Record<string, unknown>;
  occurredAt?: Date;
}

interface StepState {
  id: string;
  status: 'PENDING' | 'COMPLETED';
  occurrences: number;
  masteryCount: number;
  availableAt?: Date;
  dueAt?: Date;
}

const matchesFilter = (
  filter: Record<string, unknown> | undefined,
  payload: Record<string, unknown> | undefined
): boolean => {
  if (!filter) return true;
  if (!payload) return false;
  return Object.entries(filter).every(([k, v]) => payload[k] === v);
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

const matchesCondition = (
  condition: StepCompletionConditionSpec,
  event: LearningEvent,
  step: StepState
): { matched: boolean; occurrences?: number; masteryCount?: number } => {
  if ((condition.kind ?? 'event') === 'event') {
    if (condition.eventName !== event.name) return { matched: false };
    if (!matchesFilter(condition.payloadFilter, event.payload))
      return { matched: false };
    return { matched: true };
  }
  if (condition.kind === 'count') {
    if (condition.eventName !== event.name) return { matched: false };
    if (!matchesFilter(condition.payloadFilter, event.payload))
      return { matched: false };
    const occurrences = step.occurrences + 1;
    return { matched: occurrences >= condition.atLeast, occurrences };
  }
  if (condition.kind === 'srs_mastery') {
    if (condition.eventName !== event.name) return { matched: false };
    if (!matchesFilter(condition.payloadFilter, event.payload))
      return { matched: false };
    const masteryKey = condition.masteryField ?? 'mastery';
    const masteryValue = event.payload?.[masteryKey];
    if (typeof masteryValue !== 'number') return { matched: false };
    if (masteryValue < condition.minimumMastery) return { matched: false };
    const masteryCount = step.masteryCount + 1;
    const required = condition.requiredCount ?? 1;
    return { matched: masteryCount >= required, masteryCount };
  }
  if (condition.kind === 'time_window') {
    // For this example suite, we treat time_window as a direct match on eventName
    if (condition.eventName !== event.name) return { matched: false };
    return { matched: true };
  }
  return { matched: false };
};

function initProgress(track: LearningJourneyTrackSpec): StepState[] {
  return track.steps.map((s) => ({
    id: s.id,
    status: 'PENDING',
    occurrences: 0,
    masteryCount: 0,
  }));
}

function applyEvents(
  track: LearningJourneyTrackSpec,
  events: LearningEvent[]
): StepState[] {
  const steps = initProgress(track);
  let startedAt: Date | undefined;
  for (const event of events) {
    const eventTime = event.occurredAt ?? new Date();
    if (!startedAt) startedAt = eventTime;
    for (let index = 0; index < track.steps.length; index++) {
      const spec = track.steps[index];
      const state = steps[index];
      if (!spec || !state) continue;
      if (state.status === 'COMPLETED') continue;
      const { availableAt, dueAt } = getAvailability(
        spec.availability,
        startedAt
      );
      state.availableAt = availableAt;
      state.dueAt = dueAt;
      if (availableAt && eventTime < availableAt) continue;
      if (dueAt && eventTime > dueAt) continue;
      const res = matchesCondition(spec.completion, event, state);
      if (res.occurrences !== undefined) state.occurrences = res.occurrences;
      if (res.masteryCount !== undefined) state.masteryCount = res.masteryCount;
      if (res.matched) state.status = 'COMPLETED';
    }
  }
  return steps;
}

describe('@lssm/example.learning-patterns tracks', () => {
  it('drills track progresses via session count + mastery', () => {
    const events: LearningEvent[] = [
      { name: LEARNING_EVENTS.DRILL_SESSION_COMPLETED },
      {
        name: LEARNING_EVENTS.DRILL_SESSION_COMPLETED,
        payload: { accuracyBucket: 'high' },
      },
      {
        name: LEARNING_EVENTS.DRILL_SESSION_COMPLETED,
        payload: { accuracyBucket: 'high' },
      },
      {
        name: LEARNING_EVENTS.DRILL_SESSION_COMPLETED,
        payload: { accuracyBucket: 'high' },
      },
      ...Array.from({ length: 5 }).map(() => ({
        name: LEARNING_EVENTS.DRILL_CARD_MASTERED,
        payload: { skillId: 's1', mastery: 0.9 },
      })),
    ];
    const progress = applyEvents(drillsTrack, events);
    expect(progress.every((s) => s.status === 'COMPLETED')).toBeTrue();
  });

  it('ambient coach track progresses via shown -> acknowledged -> actionTaken', () => {
    const progress = applyEvents(ambientCoachTrack, [
      { name: LEARNING_EVENTS.COACH_TIP_SHOWN },
      { name: LEARNING_EVENTS.COACH_TIP_ACKNOWLEDGED },
      { name: LEARNING_EVENTS.COACH_TIP_ACTION_TAKEN },
    ]);
    expect(progress.every((s) => s.status === 'COMPLETED')).toBeTrue();
  });

  it('quest track respects unlockOnDay availability', () => {
    const start = new Date('2026-01-01T10:00:00.000Z');
    const day1 = new Date('2026-01-01T12:00:00.000Z');
    const day2 = new Date('2026-01-02T12:00:00.000Z');

    // Attempt to complete steps on day1 (only day1 step should unlock)
    const p1 = applyEvents(questTrack, [
      { name: LEARNING_EVENTS.QUEST_STARTED, occurredAt: start },
      { name: LEARNING_EVENTS.QUEST_STEP_COMPLETED, occurredAt: day1 },
    ]);
    expect(p1[0]?.status).toBe('COMPLETED');
    expect(p1[1]?.status).toBe('COMPLETED');
    expect(p1[2]?.status).toBe('PENDING'); // day2 step not yet available

    // Now complete on day2
    const p2 = applyEvents(questTrack, [
      { name: LEARNING_EVENTS.QUEST_STARTED, occurredAt: start },
      { name: LEARNING_EVENTS.QUEST_STEP_COMPLETED, occurredAt: day2 },
    ]);
    expect(p2[2]?.status).toBe('COMPLETED');
  });
});

describe('@lssm/example.learning-patterns XP + streak + SRS determinism', () => {
  it('XP engine produces deterministic results for streak bonus inputs', () => {
    const xp = new XPEngine();
    const r1 = xp.calculate({
      activity: 'lesson_complete',
      score: 90,
      attemptNumber: 1,
      currentStreak: 7,
    });
    const r2 = xp.calculate({
      activity: 'lesson_complete',
      score: 90,
      attemptNumber: 1,
      currentStreak: 7,
    });
    expect(r1.totalXp).toBe(r2.totalXp);
    expect(r1.totalXp).toBeGreaterThan(0);
  });

  it('streak engine increments on consecutive days deterministically', () => {
    const streak = new StreakEngine({ timezone: 'UTC' });
    const initial = {
      currentStreak: 0,
      longestStreak: 0,
      lastActivityAt: null,
      lastActivityDate: null,
      freezesRemaining: 0,
      freezeUsedAt: null,
    };
    const day1 = streak.update(
      initial,
      new Date('2026-01-01T10:00:00.000Z')
    ).state;
    const day2 = streak.update(
      day1,
      new Date('2026-01-02T10:00:00.000Z')
    ).state;
    expect(day2.currentStreak).toBe(2);
  });

  it('SRS engine nextReviewAt is deterministic for a fixed now + rating', () => {
    const srs = new SRSEngine();
    const now = new Date('2026-01-01T00:00:00.000Z');
    const state = {
      interval: 0,
      easeFactor: 2.5,
      repetitions: 0,
      learningStep: 0,
      isGraduated: false,
      isRelearning: false,
      lapses: 0,
    };
    const result = srs.calculateNextReview(state, 'GOOD', now);
    // default learningSteps are minutes; first GOOD advances to next step (10 minutes)
    expect(result.nextReviewAt.toISOString()).toBe('2026-01-01T00:10:00.000Z');
  });
});
