import { describe, expect, it } from 'bun:test';
import { composeAppConfig, resolveAppConfig } from './runtime';
import { type AppBlueprintSpec, type TenantAppConfig } from './spec';
import { CapabilityRegistry, type CapabilitySpec } from '../capabilities';
import { type FeatureModuleSpec, FeatureRegistry } from '../features';
import { DataViewRegistry, type DataViewSpec } from '../data-views';
import { WorkflowRegistry, type WorkflowSpec } from '../workflow/spec';
import { PolicyRegistry, type PolicySpec } from '../policy/spec';
import { ThemeRegistry, type ThemeSpec } from '../themes';
import { TelemetryRegistry, type TelemetrySpec } from '../telemetry/spec';
import { ExperimentRegistry, type ExperimentSpec } from '../experiments/spec';
import {
  type IntegrationSpec,
  IntegrationSpecRegistry,
} from '../integrations/spec';
import type { IntegrationConnection } from '../integrations/connection';
import {
  KnowledgeSpaceRegistry,
  type KnowledgeSpaceSpec,
} from '../knowledge/spec';
import type { KnowledgeSourceConfig } from '../knowledge/source';
import { type Owner, StabilityEnum, type Tag } from '../ownership';

const ownership = {
  version: 1,
  title: 'Sample',
  description: 'Sample description',
  domain: 'core',
  owners: ['@team.platform'] as Owner[],
  tags: ['sample'] as Tag[],
  stability: StabilityEnum.Experimental,
} as const;

function makeCapability(key = 'core.sample', version = 1): CapabilitySpec {
  return {
    meta: {
      ...ownership,
      key,
      version,
      kind: 'integration',
    },
    provides: [],
  };
}

function makeFeature(key = 'core-shell'): FeatureModuleSpec {
  return {
    meta: {
      ...ownership,
      key,
    },
  };
}

function makeDataView(key = 'core.dashboard.view'): DataViewSpec {
  return {
    meta: {
      ...ownership,
      key,
      version: 1,
      entity: 'dashboard',
    },
    source: {
      primary: { key: 'core.list', version: 1 },
    },
    view: {
      kind: 'table',
      fields: [
        {
          key: 'key',
          label: 'Name',
          dataPath: 'name',
        },
      ],
    },
  };
}

function makeWorkflow(key = 'core.onboarding'): WorkflowSpec {
  return {
    meta: {
      ...ownership,
      key,
      version: 1,
    },
    definition: {
      steps: [
        {
          id: 'start',
          type: 'automation',
          label: 'Start',
        },
      ],
      transitions: [],
    },
  };
}

function makePolicy(): PolicySpec {
  return {
    meta: {
      ...ownership,
      key: 'core.policy',
      version: 1,
      scope: 'global',
    },
    rules: [
      {
        effect: 'allow',
        actions: ['view'],
        resource: { type: 'any' },
      },
    ],
  };
}

function makeTheme(key = 'core.theme'): ThemeSpec {
  return {
    meta: {
      ...ownership,
      key,
      version: 1,
    },
    tokens: {
      colors: {
        primary: { value: '#000000' },
      },
      space: {
        md: { value: 8 },
      },
      radii: {
        sm: { value: 4 },
      },
      typography: {
        base: { value: 16 },
      },
    },
  };
}

function makeTelemetry(key = 'core.telemetry'): TelemetrySpec {
  return {
    meta: {
      ...ownership,
      key,
      version: 1,
      domain: 'core',
    },
    events: [
      {
        key: 'core.event',
        version: 1,
        semantics: {
          what: 'Sample event emitted for tests',
        },
        properties: {},
        privacy: 'internal',
      },
    ],
  };
}

function makeExperiment(key = 'core.experiment'): ExperimentSpec {
  return {
    meta: {
      ...ownership,
      key,
      version: 1,
      domain: 'core',
    },
    controlVariant: 'control',
    variants: [
      { id: 'control', name: 'Control' },
      { id: 'variant', name: 'Variant' },
    ],
    allocation: { type: 'random', salt: 'core' },
  };
}

function makeIntegrationSpec(
  key = 'core.integration',
  version = 1
): IntegrationSpec {
  return {
    meta: {
      ...ownership,
      key,
      version,
      category: 'payments',
      displayName: 'Core Integration',
    },
    supportedModes: ['managed', 'byok'],
    capabilities: {
      provides: [{ key: 'core.tenant-extension', version: 1 }],
    },
    configSchema: {
      schema: {
        type: 'object',
        properties: {
          region: { type: 'string' },
        },
      },
      example: { region: 'us-east-1' },
    },
    secretSchema: {
      schema: {
        type: 'object',
        required: ['apiKey'],
        properties: {
          apiKey: { type: 'string' },
        },
      },
      example: { apiKey: 'sk_test' },
    },
  };
}

function makeIntegrationConnection(
  id = 'conn-primary',
  tenantId = 'tenant',
  integrationKey = 'core.integration',
  integrationVersion = 1
): IntegrationConnection {
  const timestamp = new Date().toISOString();
  return {
    meta: {
      id,
      tenantId,
      integrationKey,
      integrationVersion,
      label: 'Primary Integration',
      environment: 'production',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    ownershipMode: 'managed',
    config: {
      region: 'us-east-1',
    },
    secretProvider: 'vault',
    secretRef: `vault://integrations/${tenantId}/${id}`,
    status: 'connected',
    health: {
      status: 'connected',
      checkedAt: new Date(timestamp),
    },
  };
}

function makeKnowledgeSpace(
  key = 'product-canon',
  version = 1
): KnowledgeSpaceSpec {
  return {
    meta: {
      ...ownership,
      key,
      version,
      category: 'canonical',
      displayName: 'Product Canon',
    },
    retention: { ttlDays: null },
    access: {
      policy: { key: 'core.policy', version: 1 },
      trustLevel: 'high',
      automationWritable: false,
    },
    indexing: {
      vectorDbIntegration: 'core.vector',
    },
  };
}

function makeKnowledgeSource(
  id = 'source-primary',
  tenantId = 'tenant',
  spaceKey = 'product-canon',
  spaceVersion = 1
): KnowledgeSourceConfig {
  const timestamp = new Date().toISOString();
  return {
    meta: {
      id,
      tenantId,
      spaceKey,
      spaceVersion,
      label: 'Primary Source',
      sourceType: 'manual',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    config: {},
  };
}

const blueprint: AppBlueprintSpec = {
  meta: {
    ...ownership,
    key: 'core.app',
    version: 1,
    appId: 'core-app',
  },
  capabilities: {
    enabled: [{ key: 'core.sample', version: 1 }],
  },
  features: {
    include: [{ key: 'core-shell' }],
  },
  integrationSlots: [
    {
      slotId: 'primary-payments',
      requiredCategory: 'payments',
      allowedModes: ['managed', 'byok'],
      requiredCapabilities: [{ key: 'core.tenant-extension', version: 1 }],
      required: true,
      description: 'Primary payments processor slot',
    },
  ],
  branding: {
    appNameKey: 'core.app.name',
    assets: [
      { type: 'logo', url: 'https://cdn.lssm.dev/core/logo.png' },
      { type: 'favicon', url: 'https://cdn.lssm.dev/core/favicon.ico' },
    ],
    colorTokens: {
      primary: 'colors.brand.primary',
      secondary: 'colors.brand.secondary',
    },
  },
  translationCatalog: {
    key: 'core.app.catalog',
    version: 1,
  },
  dataViews: {
    dashboard: { key: 'core.dashboard.view', version: 1 },
  },
  workflows: {
    onboarding: { key: 'core.onboarding', version: 1 },
  },
  policies: [{ key: 'core.policy', version: 1 }],
  theme: {
    primary: { key: 'core.theme', version: 1 },
  },
  telemetry: {
    spec: { key: 'core.telemetry', version: 1 },
  },
  experiments: {
    active: [{ key: 'core.experiment', version: 1 }],
  },
  featureFlags: [{ key: 'beta', enabled: false }],
  routes: [
    {
      path: '/dashboard',
      label: 'Dashboard',
      dataView: 'dashboard',
    },
  ],
  notes: 'Default blueprint',
};

const tenantConfig: TenantAppConfig = {
  meta: {
    id: 'tenant-config-1',
    tenantId: 'tenant',
    appId: 'core-app',
    blueprintName: blueprint.meta.key,
    blueprintVersion: blueprint.meta.version,
    environment: 'production',
    version: 2,
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  capabilities: {
    disable: [{ key: 'core.sample', version: 1 }],
    enable: [{ key: 'core.tenant-extension', version: 1 }],
  },
  dataViewOverrides: [
    {
      slot: 'dashboard',
      pointer: { key: 'core.dashboard.alt', version: 1 },
    },
  ],
  workflowOverrides: [
    {
      slot: 'onboarding',
      pointer: { key: 'core.onboarding.alt', version: 1 },
    },
  ],
  additionalPolicies: [{ key: 'core.policy.tenant', version: 1 }],
  themeOverride: {
    primary: { key: 'core.theme.alt', version: 1 },
  },
  telemetryOverride: {
    spec: { key: 'core.telemetry.alt', version: 1 },
    disabledEvents: ['core.event'],
  },
  experiments: {
    paused: [{ key: 'core.experiment', version: 1 }],
    active: [{ key: 'core.experiment.alt', version: 1 }],
  },
  featureFlags: [{ key: 'beta', enabled: true, description: 'Tenant opt-in' }],
  routeOverrides: [
    {
      path: '/dashboard',
      label: 'Tenant Dashboard',
      featureFlag: 'beta',
    },
  ],
  integrations: [
    {
      slotId: 'primary-payments',
      connectionId: 'conn-primary',
      scope: {
        workflows: ['onboarding'],
        operations: ['payments.charge'],
      },
      priority: 1,
    },
  ],
  knowledge: [
    {
      spaceKey: 'product-canon',
      spaceVersion: 1,
    },
  ],
  locales: {
    defaultLocale: 'en',
    enabledLocales: ['en', 'fr'],
  },
  translationOverrides: {
    entries: [
      { key: 'core.app.name', locale: 'en', value: 'Tenant Control Center' },
      { key: 'core.app.name', locale: 'fr', value: 'Centre de contrôle' },
    ],
  },
  branding: {
    appName: { en: 'Tenant Control Center' },
    assets: [
      { type: 'logo', url: 'https://assets.tenant.dev/logo.png' },
      { type: 'logo-dark', url: 'https://assets.tenant.dev/logo-dark.png' },
    ],
    colors: {
      primary: '#FF6B4A',
    },
    customDomain: 'app.tenant.dev',
  },
  notes: 'Tenant specific overrides',
};

describe('resolveAppConfig', () => {
  it('merges blueprint and tenant config', () => {
    const resolved = resolveAppConfig(blueprint, tenantConfig);
    expect(resolved.appId).toBe('core-app');
    expect(resolved.tenantId).toBe('tenant');
    expect(resolved.capabilities.enabled).toHaveLength(1);
    expect(resolved.capabilities.disabled).toHaveLength(1);
    expect(resolved.capabilities.enabled[0]?.key).toBe('core.tenant-extension');
    expect(resolved.dataViews.dashboard?.key).toBe('core.dashboard.alt');
    expect(resolved.workflows.onboarding?.key).toBe('core.onboarding.alt');
    expect(resolved.theme?.primary.key).toBe('core.theme.alt');
    expect(resolved.telemetry?.spec?.key).toBe('core.telemetry.alt');
    expect(resolved.experiments.active).toEqual([
      { name: 'core.experiment.alt', version: 1 },
    ]);
    expect(resolved.experiments.paused).toEqual([
      { name: 'core.experiment', version: 1 },
    ]);
    expect(resolved.featureFlags[0]?.enabled).toBe(true);
    expect(resolved.routes[0]?.label).toBe('Tenant Dashboard');
    expect(resolved.notes).toBe('Tenant specific overrides');
    expect(resolved.integrations).toEqual([]);
    expect(resolved.knowledge).toEqual([]);
    expect(resolved.branding.appName).toBe('Tenant Control Center');
    expect(resolved.branding.assets.logo).toBe(
      'https://assets.tenant.dev/logo.png'
    );
    expect(resolved.branding.assets.favicon).toBe(
      'https://cdn.lssm.dev/core/favicon.ico'
    );
    expect(resolved.branding.colors.primary).toBe('#FF6B4A');
    expect(resolved.branding.colors.secondary).toBe('colors.brand.secondary');
    expect(resolved.branding.domain).toBe('app.tenant.dev');
    expect(resolved.translation.defaultLocale).toBe('en');
    expect(resolved.translation.supportedLocales).toEqual(
      expect.arrayContaining(['en', 'fr'])
    );
    expect(resolved.translation.blueprintCatalog).toEqual({
      name: 'core.app.catalog',
      version: 1,
    });
    expect(resolved.translation.tenantOverrides).toHaveLength(2);
  });

  it('resolves integrations and knowledge when dependencies provided', () => {
    const integrationSpecs = new IntegrationSpecRegistry().register(
      makeIntegrationSpec()
    );
    const knowledgeSpaces = new KnowledgeSpaceRegistry().register(
      makeKnowledgeSpace()
    );
    const resolved = resolveAppConfig(blueprint, tenantConfig, {
      integrationSpecs,
      integrationConnections: [makeIntegrationConnection()],
      knowledgeSpaces,
      knowledgeSources: [makeKnowledgeSource()],
    });

    expect(resolved.integrations).toHaveLength(1);
    expect(resolved.integrations[0]?.slot.slotId).toBe('primary-payments');
    expect(resolved.integrations[0]?.connection.meta.id).toBe('conn-primary');
    expect(resolved.integrations[0]?.spec.meta.key).toBe('core.integration');
    expect(resolved.knowledge).toHaveLength(1);
    expect(resolved.knowledge[0]?.space.meta.key).toBe('product-canon');
    expect(resolved.knowledge[0]?.sources).toHaveLength(1);
  });
});

describe('composeAppConfig', () => {
  it('materializes resolved config against registries', () => {
    const capabilities = new CapabilityRegistry()
      .register(makeCapability())
      .register(makeCapability('core.tenant-extension', 1));
    const features = new FeatureRegistry()
      .register(makeFeature())
      .register(makeFeature('core-shell-optional'));
    const dataViews = new DataViewRegistry()
      .register(makeDataView())
      .register(makeDataView('core.dashboard.alt'));
    const workflows = new WorkflowRegistry()
      .register(makeWorkflow())
      .register(makeWorkflow('core.onboarding.alt'));
    const policies = new PolicyRegistry().register(makePolicy()).register({
      meta: {
        ...ownership,
        name: 'core.policy.tenant',
        version: 1,
        scope: 'feature',
      },
      rules: [
        {
          effect: 'allow',
          actions: ['edit'],
          resource: { type: 'any' },
        },
      ],
    });
    const themes = new ThemeRegistry()
      .register(makeTheme())
      .register(makeTheme('core.theme.alt'));
    const telemetry = new TelemetryRegistry()
      .register(makeTelemetry())
      .register(makeTelemetry('core.telemetry.alt'));
    const experiments = new ExperimentRegistry()
      .register(makeExperiment())
      .register(makeExperiment('core.experiment.alt'));
    const integrationSpecs = new IntegrationSpecRegistry().register(
      makeIntegrationSpec()
    );
    const integrationConnections = [makeIntegrationConnection()];
    const knowledgeSpaces = new KnowledgeSpaceRegistry().register(
      makeKnowledgeSpace()
    );
    const knowledgeSources = [makeKnowledgeSource()];

    const composition = composeAppConfig(
      blueprint,
      tenantConfig,
      {
        capabilities,
        features,
        dataViews,
        workflows,
        policies,
        themes,
        telemetry,
        experiments,
        integrationSpecs,
        integrationConnections,
        knowledgeSpaces,
        knowledgeSources,
      },
      { strict: false }
    );

    expect(composition.resolved.tenantId).toBe('tenant');
    expect(composition.capabilities).toHaveLength(1);
    expect(composition.dataViews.dashboard?.meta.name).toBe(
      'core.dashboard.alt'
    );
    expect(composition.workflows.onboarding?.meta.name).toBe(
      'core.onboarding.alt'
    );
    expect(composition.policies).toHaveLength(2);
    expect(composition.theme?.meta.name).toBe('core.theme.alt');
    expect(composition.telemetry?.meta.name).toBe('core.telemetry.alt');
    expect(composition.experiments.active).toHaveLength(1);
    expect(composition.integrations).toHaveLength(1);
    expect(composition.integrations[0]?.slot.slotId).toBe('primary-payments');
    expect(composition.integrations[0]?.connection.meta.id).toBe(
      'conn-primary'
    );
    expect(composition.knowledge).toHaveLength(1);
    expect(composition.knowledge[0]?.space.meta.key).toBe('product-canon');
    expect(composition.knowledge[0]?.sources).toHaveLength(1);
    expect(composition.missing).toHaveLength(0);
    expect(composition.resolved.branding.appName).toBe('Tenant Control Center');
    expect(composition.resolved.branding.domain).toBe('app.tenant.dev');
    expect(composition.resolved.translation.defaultLocale).toBe('en');
    expect(composition.resolved.translation.supportedLocales).toEqual(
      expect.arrayContaining(['en', 'fr'])
    );
  });

  it('records missing references when registries are absent', () => {
    const composition = composeAppConfig(
      blueprint,
      tenantConfig,
      {},
      { strict: false }
    );
    expect(composition.missing).not.toHaveLength(0);
    const types = composition.missing.map((item) => item.type);
    expect(types).toEqual(
      expect.arrayContaining([
        'capability',
        'feature',
        'dataView',
        'workflow',
        'policy',
        'theme',
        'telemetry',
        'experiment',
      ])
    );
  });

  it('reports missing integration and knowledge dependencies when incomplete', () => {
    const integrationSpecs = new IntegrationSpecRegistry().register(
      makeIntegrationSpec()
    );
    const integrationConnections = [
      makeIntegrationConnection(
        'conn-primary',
        'tenant',
        'core.integration',
        2
      ),
    ];
    const knowledgeSpaces = new KnowledgeSpaceRegistry().register(
      makeKnowledgeSpace()
    );
    const knowledgeSources: KnowledgeSourceConfig[] = [];

    const composition = composeAppConfig(
      blueprint,
      tenantConfig,
      {
        integrationSpecs,
        integrationConnections,
        knowledgeSpaces,
        knowledgeSources,
      },
      { strict: false }
    );

    expect(composition.resolved.integrations).toHaveLength(0);
    expect(composition.missing).toEqual(
      expect.arrayContaining([
        {
          type: 'integrationSpec',
          identifier: 'spec:core.integration.v2',
        },
        {
          type: 'integrationSlot',
          identifier: 'slot:primary-payments',
        },
        {
          type: 'knowledgeSource',
          identifier: 'product-canon@1',
        },
      ])
    );
  });

  it('throws when strict mode and references missing', () => {
    expect(() =>
      composeAppConfig(blueprint, tenantConfig, {}, { strict: true })
    ).toThrow(/missing references/);
  });
});
