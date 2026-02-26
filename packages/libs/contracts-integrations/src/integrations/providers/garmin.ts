import { type IntegrationSpecRegistry } from '../spec';
import { defineHealthProviderSpec } from './health-provider-shared';

export const garminIntegrationSpec = defineHealthProviderSpec({
  key: 'health.garmin',
  title: 'Garmin',
  description:
    'Garmin integration for fitness activity, wellness, and sleep metrics.',
  docsUrl: 'https://developer.garmin.com/gc-developer-program/overview/',
  tags: ['garmin', 'official-api', 'partner'],
  byokSetupInstructions:
    'Use Garmin partner credentials or aggregator routes; enable unofficial connector only with explicit opt-in.',
});

export function registerGarminIntegration(
  registry: IntegrationSpecRegistry
): IntegrationSpecRegistry {
  return registry.register(garminIntegrationSpec);
}
