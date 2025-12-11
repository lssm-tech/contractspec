import { describe, expect, it } from 'bun:test';

import {
  GetStudioOnboardingTrack,
  RecordStudioOnboardingEvent,
  studioOnboardingContracts,
} from './index';
import { studioGettingStartedTrack } from '../track';
import { emitStudioOnboardingEvent } from '../handlers/demo.handlers';

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
    const result = await emitStudioOnboardingEvent(
      step.completion.eventName as any,
      {
        learnerId: 'demo-learner',
      }
    );
    expect(result).toBeDefined();
  });

  it('exposes record event contract', () => {
    expect(RecordStudioOnboardingEvent.meta.name).toBe(
      'learningJourney.studioOnboarding.recordEvent'
    );
  });
});
