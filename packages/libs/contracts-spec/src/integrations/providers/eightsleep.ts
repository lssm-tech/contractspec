import { type IntegrationSpecRegistry } from '../spec';
import { defineHealthProviderSpec } from './health-provider-shared';

export const eightSleepIntegrationSpec = defineHealthProviderSpec({
  key: 'health.eightsleep',
  title: 'Eight Sleep',
  description:
    'Eight Sleep integration for sleep sessions and biometrics via official, aggregator, or opt-in unofficial connectors.',
  docsUrl: 'https://www.eightsleep.com/',
  tags: ['eightsleep', 'sleep', 'unofficial'],
  capabilities: [
    { key: 'health.sleep.read', version: '1.0.0' },
    { key: 'health.biometrics.read', version: '1.0.0' },
  ],
  defaultTransport: 'aggregator-api',
});

export function registerEightSleepIntegration(
  registry: IntegrationSpecRegistry
): IntegrationSpecRegistry {
  return registry.register(eightSleepIntegrationSpec);
}
