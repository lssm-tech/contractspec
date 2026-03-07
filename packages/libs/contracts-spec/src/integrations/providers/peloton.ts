import { type IntegrationSpecRegistry } from '../spec';
import { defineHealthProviderSpec } from './health-provider-shared';

export const pelotonIntegrationSpec = defineHealthProviderSpec({
  key: 'health.peloton',
  title: 'Peloton',
  description:
    'Peloton integration for workout history and activity metrics using official, aggregator, or opt-in unofficial connectors.',
  docsUrl: 'https://developers.onepeloton.com/',
  tags: ['peloton', 'workouts', 'unofficial'],
  capabilities: [
    { key: 'health.activities.read', version: '1.0.0' },
    { key: 'health.workouts.read', version: '1.0.0' },
  ],
  defaultTransport: 'aggregator-api',
});

export function registerPelotonIntegration(
  registry: IntegrationSpecRegistry
): IntegrationSpecRegistry {
  return registry.register(pelotonIntegrationSpec);
}
