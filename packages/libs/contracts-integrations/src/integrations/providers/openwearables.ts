import { StabilityEnum } from '@contractspec/lib.contracts-spec/ownership';
import { type IntegrationSpecRegistry } from '../spec';
import { defineHealthProviderSpec } from './health-provider-shared';

export const openWearablesIntegrationSpec = defineHealthProviderSpec({
  key: 'health.openwearables',
  title: 'Open Wearables',
  description:
    'Unified wearable and health data aggregation with API and MCP transports.',
  docsUrl: 'https://www.openwearables.io/',
  tags: ['openwearables', 'aggregator', 'mcp'],
  stability: StabilityEnum.Beta,
  capabilities: [
    { key: 'health.activities.read', version: '1.0.0' },
    { key: 'health.workouts.read', version: '1.0.0' },
    { key: 'health.sleep.read', version: '1.0.0' },
    { key: 'health.biometrics.read', version: '1.0.0' },
    { key: 'health.nutrition.read', version: '1.0.0' },
    { key: 'health.webhooks', version: '1.0.0' },
  ],
  defaultTransport: 'aggregator-api',
  byokSetupInstructions:
    'Create an Open Wearables account, generate API/MCP credentials, and connect desired upstream providers.',
});

export function registerOpenWearablesIntegration(
  registry: IntegrationSpecRegistry
): IntegrationSpecRegistry {
  return registry.register(openWearablesIntegrationSpec);
}
