import { describe, expect, it } from 'bun:test';

import {
  GetCrmOnboardingTrack,
  RecordCrmOnboardingEvent,
  crmOnboardingContracts,
} from './index';
import { crmFirstWinTrack } from '../track';
import {
  crmOnboardingEvents,
  emitCrmOnboardingEvent,
} from '../handlers/demo.handlers';
import type { CrmEvent } from '../handlers/demo.handlers';

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
    expect(step).toBeDefined();
    if (!step) throw new Error('Expected at least one CRM onboarding step');

    const eventName = step.completion.eventName;
    const isCrmEvent = (value: string): value is CrmEvent =>
      crmOnboardingEvents.includes(value as CrmEvent);

    expect(isCrmEvent(eventName)).toBe(true);
    if (!isCrmEvent(eventName)) {
      throw new Error(`Unexpected event name: ${eventName}`);
    }

    const result = await emitCrmOnboardingEvent(eventName, {
      learnerId: 'demo-learner',
    });
    expect(result).toBeDefined();
  });

  it('exposes record event contract', () => {
    expect(RecordCrmOnboardingEvent.meta.name).toBe(
      'learningJourney.crmOnboarding.recordEvent'
    );
  });
});
