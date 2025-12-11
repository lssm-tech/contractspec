import { describe, expect, it } from 'bun:test';

import {
  GetPlatformTourTrack,
  RecordPlatformTourEvent,
  platformTourContracts,
} from './index';
import { platformPrimitivesTourTrack } from '../track';
import { emitPlatformTourEvent } from '../handlers/demo.handlers';

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
    const result = await emitPlatformTourEvent(
      step.completion.eventName as any,
      {
        learnerId: 'demo-learner',
      }
    );
    expect(result).toBeDefined();
  });

  it('exposes record event contract', () => {
    expect(RecordPlatformTourEvent.meta.name).toBe(
      'learningJourney.platformTour.recordEvent'
    );
  });
});
