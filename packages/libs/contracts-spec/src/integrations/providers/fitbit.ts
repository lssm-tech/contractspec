import { type IntegrationSpecRegistry } from '../spec';
import { defineHealthProviderSpec } from './health-provider-shared';

export const fitbitIntegrationSpec = defineHealthProviderSpec({
  key: 'health.fitbit',
  title: 'Fitbit',
  description:
    'Fitbit integration for activity, sleep, heart rate, and biometrics.',
  docsUrl: 'https://dev.fitbit.com/build/reference/web-api/',
  tags: ['fitbit', 'official-api'],
  byokScopes: [
    'activity',
    'heartrate',
    'sleep',
    'nutrition',
    'weight',
    'profile',
  ],
});

export function registerFitbitIntegration(
  registry: IntegrationSpecRegistry
): IntegrationSpecRegistry {
  return registry.register(fitbitIntegrationSpec);
}
