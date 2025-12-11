import { describe, expect, it } from 'bun:test';

import { moneyAmbientCoachTrack } from './track';

type TestEvent = {
  name: string;
  payload?: Record<string, unknown>;
};

const matchesFilter = (
  filter: Record<string, unknown> | undefined,
  payload: Record<string, unknown> | undefined
) => {
  if (!filter) return true;
  if (!payload) return false;
  return Object.entries(filter).every(([key, value]) => payload[key] === value);
};

describe('ambient coach track', () => {
  it('completes steps when tips are acted upon', () => {
    const tipIds = [
      'cash_buffer_too_high',
      'no_savings_goal',
      'irregular_savings',
    ];

    const events: TestEvent[] = tipIds.flatMap((tipId) => [
      { name: 'coach.tip.triggered', payload: { tipId } },
      { name: 'coach.tip.follow_up_action_taken', payload: { tipId } },
    ]);

    const progress = moneyAmbientCoachTrack.steps.map((step) => ({
      id: step.id,
      status: 'PENDING' as 'PENDING' | 'COMPLETED',
    }));

    events.forEach((event) => {
      moneyAmbientCoachTrack.steps.forEach((stepSpec, index) => {
        const step = progress[index];
        if (!step || step.status === 'COMPLETED') return;
        if (stepSpec.completion.kind !== 'event') return;
        if (stepSpec.completion.eventName !== event.name) return;
        if (
          !matchesFilter(
            stepSpec.completion.payloadFilter,
            event.payload as Record<string, unknown> | undefined
          )
        ) {
          return;
        }
        step.status = 'COMPLETED';
      });
    });

    expect(progress.every((s) => s.status === 'COMPLETED')).toBeTrue();
  });
});
