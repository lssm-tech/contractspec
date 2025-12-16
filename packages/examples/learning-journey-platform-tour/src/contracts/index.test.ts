import { describe, expect, it } from 'bun:test';

import {
  GetPlatformTourTrack,
  RecordPlatformTourEvent,
  platformTourContracts,
} from './index';
import { platformPrimitivesTourTrack } from '../track';
import {
  emitPlatformTourEvent,
  platformTourEvents,
} from '../handlers/demo.handlers';
import type { PlatformEvent } from '../handlers/demo.handlers';

describe('platform tour contracts', () => {
  it('exposes track metadata', () => {
    expect(platformTourContracts.track.id).toBe('platform_primitives_tour');
    expect(platformTourContracts.track.steps.length).toBeGreaterThan(0);
    expect(GetPlatformTourTrack.meta.name).toBe(
      'learningJourney.platformTour.getTrack'
    );
  });

  it('allows recording events via demo handler', async () => {
    const [step] = platformPrimitivesTourTrack.steps;
    expect(step).toBeDefined();
    if (!step) throw new Error('Expected at least one platform tour step');

    const eventName = step.completion.eventName;
    const isPlatformEvent = (value: string): value is PlatformEvent =>
      platformTourEvents.includes(value as PlatformEvent);

    expect(isPlatformEvent(eventName)).toBe(true);
    if (!isPlatformEvent(eventName)) {
      throw new Error(`Unexpected event name: ${eventName}`);
    }

    const result = await emitPlatformTourEvent(eventName, {
      learnerId: 'demo-learner',
    });
    expect(result).toBeDefined();
  });

  it('exposes record event contract', () => {
    expect(RecordPlatformTourEvent.meta.name).toBe(
      'learningJourney.platformTour.recordEvent'
    );
  });
});

