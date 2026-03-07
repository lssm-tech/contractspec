import { describe, expect, it } from 'bun:test';
import { IntegrationSpecRegistry } from '../spec';
import {
  openWearablesIntegrationSpec,
  registerOpenWearablesIntegration,
} from './openwearables';
import { registerWhoopIntegration, whoopIntegrationSpec } from './whoop';
import {
  appleHealthIntegrationSpec,
  registerAppleHealthIntegration,
} from './apple-health';
import { ouraIntegrationSpec, registerOuraIntegration } from './oura';
import { stravaIntegrationSpec, registerStravaIntegration } from './strava';
import { garminIntegrationSpec, registerGarminIntegration } from './garmin';
import { fitbitIntegrationSpec, registerFitbitIntegration } from './fitbit';
import {
  myFitnessPalIntegrationSpec,
  registerMyFitnessPalIntegration,
} from './myfitnesspal';
import {
  eightSleepIntegrationSpec,
  registerEightSleepIntegration,
} from './eightsleep';
import { pelotonIntegrationSpec, registerPelotonIntegration } from './peloton';

const HEALTH_PROVIDER_CASES = [
  {
    key: 'health.openwearables',
    spec: openWearablesIntegrationSpec,
    register: registerOpenWearablesIntegration,
  },
  {
    key: 'health.whoop',
    spec: whoopIntegrationSpec,
    register: registerWhoopIntegration,
  },
  {
    key: 'health.apple-health',
    spec: appleHealthIntegrationSpec,
    register: registerAppleHealthIntegration,
  },
  {
    key: 'health.oura',
    spec: ouraIntegrationSpec,
    register: registerOuraIntegration,
  },
  {
    key: 'health.strava',
    spec: stravaIntegrationSpec,
    register: registerStravaIntegration,
  },
  {
    key: 'health.garmin',
    spec: garminIntegrationSpec,
    register: registerGarminIntegration,
  },
  {
    key: 'health.fitbit',
    spec: fitbitIntegrationSpec,
    register: registerFitbitIntegration,
  },
  {
    key: 'health.myfitnesspal',
    spec: myFitnessPalIntegrationSpec,
    register: registerMyFitnessPalIntegration,
  },
  {
    key: 'health.eightsleep',
    spec: eightSleepIntegrationSpec,
    register: registerEightSleepIntegration,
  },
  {
    key: 'health.peloton',
    spec: pelotonIntegrationSpec,
    register: registerPelotonIntegration,
  },
] as const;

describe('health integration provider specs', () => {
  for (const providerCase of HEALTH_PROVIDER_CASES) {
    it(`registers ${providerCase.key}`, () => {
      const registry = providerCase.register(new IntegrationSpecRegistry());
      const registered = registry.get(providerCase.key, '1.0.0');
      expect(registered).toBe(providerCase.spec);
      expect(registered?.meta.category).toBe('health');
      expect(registered?.supportedModes).toEqual(['managed', 'byok']);
      expect(registered?.capabilities.provides.length).toBeGreaterThan(0);
      expect(registered?.configSchema.schema).toMatchObject({
        properties: expect.objectContaining({
          strategyOrder: expect.any(Object),
          allowUnofficial: expect.any(Object),
        }),
      });
    });
  }
});
