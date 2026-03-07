import { type IntegrationSpecRegistry } from '../spec';
import { defineHealthProviderSpec } from './health-provider-shared';

export const whoopIntegrationSpec = defineHealthProviderSpec({
  key: 'health.whoop',
  title: 'Whoop',
  description:
    'Whoop integration for sleep, recovery, workouts, and physiological metrics.',
  docsUrl: 'https://developer.whoop.com/',
  tags: ['whoop', 'official-api'],
  byokScopes: ['read:recovery', 'read:workout', 'read:sleep', 'read:profile'],
});

export function registerWhoopIntegration(
  registry: IntegrationSpecRegistry
): IntegrationSpecRegistry {
  return registry.register(whoopIntegrationSpec);
}
