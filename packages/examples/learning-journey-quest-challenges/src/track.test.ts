import { describe, expect, it } from 'bun:test';

import { moneyResetQuestTrack } from './track';

const addDays = (date: Date, days: number) =>
  new Date(date.getTime() + days * 24 * 60 * 60 * 1000);

type StepStatus = 'PENDING' | 'COMPLETED';

describe('quest challenges track', () => {
  it('unlocks by day and completes within window', () => {
    const start = new Date('2024-01-01T09:00:00Z');
    const events = [
      { name: 'accounts.mapped', dayOffset: 0 },
      { name: 'transactions.categorized', dayOffset: 1 },
      { name: 'goals.created', dayOffset: 2 },
      { name: 'recurring_rule.created', dayOffset: 3 },
      { name: 'subscription.flagged_or_cancelled', dayOffset: 4 },
      { name: 'emergency_plan.completed', dayOffset: 5 },
      { name: 'quest.review.completed', dayOffset: 6 },
    ];

    const progress = moneyResetQuestTrack.steps.map((step) => ({
      id: step.id,
      status: 'PENDING' as StepStatus,
    }));

    events.forEach((evt) => {
      const now = addDays(start, evt.dayOffset);
      moneyResetQuestTrack.steps.forEach((spec, idx) => {
        const step = progress[idx];
        if (!step || step.status === 'COMPLETED') return;
        const availableAt =
          spec.availability?.unlockOnDay !== undefined
            ? addDays(start, spec.availability.unlockOnDay - 1)
            : start;
        if (now < availableAt) return;
        const within =
          spec.completion.kind === 'time_window' &&
          spec.completion.withinHoursOfStart !== undefined
            ? (now.getTime() - start.getTime()) / (1000 * 60 * 60) <=
              spec.completion.withinHoursOfStart
            : true;
        if (!within) return;
        if (spec.completion.eventName !== evt.name) return;
        step.status = 'COMPLETED';
      });
    });

    expect(progress.every((s) => s.status === 'COMPLETED')).toBeTrue();
  });
});

