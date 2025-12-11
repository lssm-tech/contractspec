import { describe, expect, it } from 'bun:test';

import {
  GetCrmOnboardingTrack,
  RecordCrmOnboardingEvent,
  crmOnboardingContracts,
} from './index';
import { crmFirstWinTrack } from '../track';
import { emitCrmOnboardingEvent } from '../handlers/demo.handlers';

describe('crm onboarding contracts', () => {
  it('exposes track metadata', () => {
    expect(crmOnboardingContracts.track.id).toBe('crm_first_win');
    expect(crmOnboardingContracts.track.steps.length).toBeGreaterThan(0);
    expect(GetCrmOnboardingTrack.meta.name).toBe(
      'learningJourney.crmOnboarding.getTrack'
    );
  });

  it('allows recording events via demo handler', async () => {
    const [step] = crmFirstWinTrack.steps;
    const result = await emitCrmOnboardingEvent(
      step.completion.eventName as any,
      {
        learnerId: 'demo-learner',
      }
    );
    expect(result).toBeDefined();
  });

  it('exposes record event contract', () => {
    expect(RecordCrmOnboardingEvent.meta.name).toBe(
      'learningJourney.crmOnboarding.recordEvent'
    );
  });
});
