import { type IntegrationSpecRegistry } from '../spec';
import { defineHealthProviderSpec } from './health-provider-shared';

export const stravaIntegrationSpec = defineHealthProviderSpec({
  key: 'health.strava',
  title: 'Strava',
  description:
    'Strava integration for activities, workouts, and athlete biometrics.',
  docsUrl: 'https://developers.strava.com/',
  tags: ['strava', 'official-api'],
  byokScopes: ['read', 'activity:read_all'],
});

export function registerStravaIntegration(
  registry: IntegrationSpecRegistry
): IntegrationSpecRegistry {
  return registry.register(stravaIntegrationSpec);
}
