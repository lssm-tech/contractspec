import { describe, expect, it } from 'bun:test';

import { recordEvent, getProgress, listTracks } from './api';
import { learningJourneyTracks } from './tracks';

const learnerId = 'learner-1';

describe('learning journey registry api', () => {
  it('completes studio track and applies streak bonus', () => {
    const track = learningJourneyTracks.find(
      (t) => t.id === 'studio_getting_started'
    );
    expect(track).toBeDefined();

    const events = [
      { name: 'studio.template.instantiated' },
      { name: 'spec.changed', payload: { scope: 'sandbox' } },
      { name: 'regeneration.completed' },
      { name: 'module.navigated', payload: { moduleId: 'canvas' } },
      { name: 'studio.evolution.applied' },
    ];

    events.forEach((evt) =>
      recordEvent({
        ...evt,
        learnerId,
        occurredAt: new Date(),
      })
    );

    const progress = getProgress('studio_getting_started', learnerId);
    expect(progress).toBeDefined();
    if (!progress) return;

    expect(progress.isCompleted).toBeTrue();
    expect(progress.progress).toBe(100);
    // base xp: track totalXp (110) + completion bonus (25) + streak bonus (25)
    expect(progress.xpEarned).toBeGreaterThanOrEqual(160);
  });

  it('lists tracks with empty progress for new learner', () => {
    const result = listTracks('new-learner');
    expect(result.tracks.length).toBeGreaterThan(0);
    expect(result.progress.length).toBe(0);
  });
});
