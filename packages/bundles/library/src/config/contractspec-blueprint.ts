import type {
  AppBlueprintSpec,
  FeatureFlagState,
} from '@contractspec/lib.contracts/app-config';
import type { CapabilityRef } from '@contractspec/lib.contracts/capabilities';
import type { FeatureRef } from '@contractspec/lib.contracts/features';
import { contractspecBrandingDefaults } from './contractspec-branding';
import { contractspecRoutes } from './contractspec-routes';

const cap = (key: string, version: string): CapabilityRef => ({ key, version });
const feat = (key: string): FeatureRef => ({ key });

/**
 * ContractSpec application blueprint.
 * Defines the canonical spec for the ContractSpec platform itself.
 */
export const contractspecBlueprint: AppBlueprintSpec = {
  meta: {
    key: 'contractspec.app',
    version: '1.0.0',
    appId: 'contractspec',
    title: 'ContractSpec',
    description: 'The deterministic, spec-first compiler for AI-coded systems',
    domain: 'platform',
    owners: ['@platform.core'],
    tags: ['contracts', 'specs', 'ai-safety', 'code-generation'],
    stability: 'beta',
  },
  capabilities: {
    enabled: [
      cap('contracts.operations', '1.0.0'),
      cap('contracts.presentations', '1.0.0'),
      cap('contracts.mcp', '1.0.0'),
      cap('contracts.docs', '1.0.0'),
    ],
  },
  features: {
    include: [
      feat('contractspec.docs'),
      feat('contractspec.mcp'),
      feat('contractspec.presentations'),
      feat('app-config'),
    ],
  },
  branding: contractspecBrandingDefaults,
  featureFlags: [
    {
      key: 'feature-discovery-ui',
      enabled: true,
      description: 'Show feature discovery UI',
    },
    {
      key: 'dark-mode',
      enabled: true,
      description: 'Enable dark mode theming',
    },
    {
      key: 'ai-assistant',
      enabled: false,
      description: 'AI-powered assistant integration',
    },
    {
      key: 'sandbox-enabled',
      enabled: true,
      description: 'Enable sandbox playground',
    },
  ] satisfies FeatureFlagState[],
  routes: contractspecRoutes,
  notes:
    "ContractSpec platform blueprint - defines the app's capabilities, features, and configuration.",
};
