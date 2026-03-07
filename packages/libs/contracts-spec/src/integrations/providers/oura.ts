import { type IntegrationSpecRegistry } from '../spec';
import { defineHealthProviderSpec } from './health-provider-shared';

export const ouraIntegrationSpec = defineHealthProviderSpec({
  key: 'health.oura',
  title: 'Oura',
  description:
    'Oura integration for sleep, activity, readiness, and biometrics data.',
  docsUrl: 'https://cloud.ouraring.com/docs/',
  tags: ['oura', 'official-api'],
  byokScopes: ['daily', 'personal', 'workout', 'sleep'],
});

export function registerOuraIntegration(
  registry: IntegrationSpecRegistry
): IntegrationSpecRegistry {
  return registry.register(ouraIntegrationSpec);
}
