import { describe, expect, it } from 'bun:test';

import { drillsLanguageBasicsTrack } from './track';

type TestEvent = {
  name: string;
  payload?: Record<string, unknown>;
  occurredAt?: Date;
};

const matchesFilter = (
  filter: Record<string, unknown> | undefined,
  payload: Record<string, unknown> | undefined
) => {
  if (!filter) return true;
  if (!payload) return false;
  return Object.entries(filter).every(([key, value]) => payload[key] === value);
};

type StepState = {
  id: string;
  status: 'PENDING' | 'COMPLETED';
  occurrences: number;
  masteryCount: number;
};

describe('duo drills track', () => {
  it('advances on session completion, accuracy counts, and SRS mastery', () => {
    const events: TestEvent[] = [
      {
        name: 'drill.session.completed',
        payload: { accuracyBucket: 'high' },
      },
      {
        name: 'drill.session.completed',
        payload: { accuracyBucket: 'high' },
      },
      {
        name: 'drill.session.completed',
        payload: { accuracyBucket: 'high' },
      },
      ...Array.from({ length: 5 }).map<TestEvent>(() => ({
        name: 'drill.card.mastered',
        payload: { skillId: 'language_basics', mastery: 0.9 },
      })),
    ];

    const progress: StepState[] = drillsLanguageBasicsTrack.steps.map(
      (step) => ({
        id: step.id,
        status: 'PENDING',
        occurrences: 0,
        masteryCount: 0,
      })
    );

    events.forEach((event) => {
      drillsLanguageBasicsTrack.steps.forEach((stepSpec, index) => {
        const step = progress[index];
        if (!step || step.status === 'COMPLETED') return;
        const completion = stepSpec.completion;
        const kind = completion.kind ?? 'event';
        if (kind === 'event' && completion.eventName === event.name) {
          if (
            matchesFilter(
              completion.payloadFilter,
              event.payload as Record<string, unknown> | undefined
            )
          ) {
            step.status = 'COMPLETED';
          }
          return;
        }
        if (kind === 'count' && completion.kind === 'count') {
          if (
            completion.eventName === event.name &&
            matchesFilter(
              completion.payloadFilter,
              event.payload as Record<string, unknown> | undefined
            )
          ) {
            step.occurrences = step.occurrences + 1;
            if (step.occurrences >= completion.atLeast) {
              step.status = 'COMPLETED';
            }
          }
          return;
        }
        if (kind === 'srs_mastery' && completion.kind === 'srs_mastery') {
          if (completion.eventName !== event.name) return;
          if (!matchesFilter(completion.payloadFilter, event.payload)) return;
          const masteryValue = (
            event.payload as Record<string, unknown> | undefined
          )?.[completion.masteryField ?? 'mastery'];
          if (typeof masteryValue !== 'number') return;
          if (masteryValue < completion.minimumMastery) return;
          step.masteryCount = step.masteryCount + 1;
          if (step.masteryCount >= (completion.requiredCount ?? 1)) {
            step.status = 'COMPLETED';
          }
        }
      });
    });

    expect(progress.every((s) => s.status === 'COMPLETED')).toBeTrue();
  });
});
