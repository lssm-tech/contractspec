import { type IntegrationSpecRegistry } from '../spec';
import { defineHealthProviderSpec } from './health-provider-shared';

export const myFitnessPalIntegrationSpec = defineHealthProviderSpec({
  key: 'health.myfitnesspal',
  title: 'MyFitnessPal',
  description:
    'MyFitnessPal nutrition and activity integration through official, aggregator, or opt-in unofficial connectors.',
  docsUrl: 'https://www.myfitnesspal.com/',
  tags: ['myfitnesspal', 'nutrition', 'unofficial'],
  capabilities: [
    { key: 'health.activities.read', version: '1.0.0' },
    { key: 'health.nutrition.read', version: '1.0.0' },
  ],
  defaultTransport: 'aggregator-api',
});

export function registerMyFitnessPalIntegration(
  registry: IntegrationSpecRegistry
): IntegrationSpecRegistry {
  return registry.register(myFitnessPalIntegrationSpec);
}
