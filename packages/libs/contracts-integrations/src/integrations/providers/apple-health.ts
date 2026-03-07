import { type IntegrationSpecRegistry } from '../spec';
import { defineHealthProviderSpec } from './health-provider-shared';

export const appleHealthIntegrationSpec = defineHealthProviderSpec({
  key: 'health.apple-health',
  title: 'Apple Health Bridge',
  description:
    'Apple Health ingestion bridge for HealthKit-exported or aggregator-routed data.',
  docsUrl: 'https://developer.apple.com/health-fitness/',
  tags: ['apple', 'healthkit', 'bridge'],
  defaultTransport: 'aggregator-api',
  byokSetupInstructions:
    'Use on-device HealthKit authorization and route data through approved bridge endpoints or aggregator connectors.',
});

export function registerAppleHealthIntegration(
  registry: IntegrationSpecRegistry
): IntegrationSpecRegistry {
  return registry.register(appleHealthIntegrationSpec);
}
