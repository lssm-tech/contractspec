import { describe, expect, it } from 'bun:test';

import {
  GetStudioOnboardingTrack,
  RecordStudioOnboardingEvent,
  studioOnboardingContracts,
} from './index';
import { studioGettingStartedTrack } from '../track';
import {
  emitStudioOnboardingEvent,
  studioOnboardingEvents,
} from '../handlers/demo.handlers';
import type { StudioEvent } from '../handlers/demo.handlers';

describe('studio onboarding contracts', () => {
  it('exposes track metadata', () => {
    expect(studioOnboardingContracts.track.id).toBe('studio_getting_started');
    expect(studioOnboardingContracts.track.steps.length).toBeGreaterThan(0);
    expect(GetStudioOnboardingTrack.meta.name).toBe(
      'learningJourney.studioOnboarding.getTrack'
    );
  });

  it('allows recording events via demo handler', async () => {
    const [step] = studioGettingStartedTrack.steps;
    expect(step).toBeDefined();
    if (!step) throw new Error('Expected at least one onboarding step');

    const eventName = step.completion.eventName;
    const isStudioEvent = (value: string): value is StudioEvent =>
      studioOnboardingEvents.includes(value as StudioEvent);

    expect(isStudioEvent(eventName)).toBe(true);
    if (!isStudioEvent(eventName)) {
      throw new Error(`Unexpected event name: ${eventName}`);
    }

    const result = await emitStudioOnboardingEvent(eventName, {
      learnerId: 'demo-learner',
    });
    expect(result).toBeDefined();
  });

  it('exposes record event contract', () => {
    expect(RecordStudioOnboardingEvent.meta.name).toBe(
      'learningJourney.studioOnboarding.recordEvent'
    );
  });
});
