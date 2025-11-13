import { describe, expect, it } from 'vitest';
import { resolveAppConfig, composeAppConfig } from './runtime';
import {
  type AppBlueprintSpec,
  type TenantAppConfig,
} from './spec';
import {
  CapabilityRegistry,
  type CapabilitySpec,
} from '../capabilities';
import { FeatureRegistry, type FeatureModuleSpec } from '../features';
import { DataViewRegistry, type DataViewSpec } from '../data-views';
import { WorkflowRegistry, type WorkflowSpec } from '../workflow/spec';
import { PolicyRegistry, type PolicySpec } from '../policy/spec';
import { ThemeRegistry, type ThemeSpec } from '../themes';
import {
  TelemetryRegistry,
  type TelemetrySpec,
} from '../telemetry/spec';
import {
  ExperimentRegistry,
  type ExperimentSpec,
} from '../experiments/spec';
import { StabilityEnum, type Owner, type Tag } from '../ownership';

const ownership = {
  title: 'Sample',
  description: 'Sample description',
  domain: 'core',
  owners: ['@team.platform'] as Owner[],
  tags: ['sample'] as Tag[],
  stability: StabilityEnum.Experimental,
} as const;

function makeCapability(
  key = 'core.sample',
  version = 1
): CapabilitySpec {
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

function makeDataView(
  name = 'core.dashboard.view'
): DataViewSpec {
  return {
    meta: {
      ...ownership,
      name,
      version: 1,
      entity: 'dashboard',
    },
    source: {
      primary: { name: 'core.list', version: 1 },
    },
    view: {
      kind: 'table',
      fields: [
        {
          key: 'name',
          label: 'Name',
          dataPath: 'name',
        },
      ],
    },
  };
}

function makeWorkflow(
  name = 'core.onboarding'
): WorkflowSpec {
  return {
    meta: {
      ...ownership,
      name,
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
      name: 'core.policy',
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

function makeTheme(name = 'core.theme'): ThemeSpec {
  return {
    meta: {
      ...ownership,
      name,
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

function makeTelemetry(name = 'core.telemetry'): TelemetrySpec {
  return {
    meta: {
      ...ownership,
      name,
      version: 1,
      domain: 'core',
    },
    events: [
      {
        name: 'core.event',
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

function makeExperiment(name = 'core.experiment'): ExperimentSpec {
  return {
    meta: {
      ...ownership,
      name,
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

const blueprint: AppBlueprintSpec = {
  meta: {
    ...ownership,
    name: 'core.app',
    version: 1,
    appId: 'core-app',
  },
  capabilities: {
    enabled: [{ key: 'core.sample', version: 1 }],
  },
  features: {
    include: [{ key: 'core-shell' }],
  },
  dataViews: {
    dashboard: { name: 'core.dashboard.view', version: 1 },
  },
  workflows: {
    onboarding: { name: 'core.onboarding', version: 1 },
  },
  policies: [{ name: 'core.policy', version: 1 }],
  theme: {
    primary: { name: 'core.theme', version: 1 },
  },
  telemetry: {
    spec: { name: 'core.telemetry', version: 1 },
  },
  experiments: {
    active: [{ name: 'core.experiment', version: 1 }],
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
    blueprintName: blueprint.meta.name,
    blueprintVersion: blueprint.meta.version,
    environment: 'production',
    version: 2,
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
      pointer: { name: 'core.dashboard.alt', version: 1 },
    },
  ],
  workflowOverrides: [
    {
      slot: 'onboarding',
      pointer: { name: 'core.onboarding.alt', version: 1 },
    },
  ],
  additionalPolicies: [{ name: 'core.policy.tenant', version: 1 }],
  themeOverride: {
    primary: { name: 'core.theme.alt', version: 1 },
  },
  telemetryOverride: {
    spec: { name: 'core.telemetry.alt', version: 1 },
    disabledEvents: ['core.event'],
  },
  experiments: {
    paused: [{ name: 'core.experiment', version: 1 }],
    active: [{ name: 'core.experiment.alt', version: 1 }],
  },
  featureFlags: [{ key: 'beta', enabled: true, description: 'Tenant opt-in' }],
  routeOverrides: [
    {
      path: '/dashboard',
      label: 'Tenant Dashboard',
      featureFlag: 'beta',
    },
  ],
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
    expect(resolved.dataViews.dashboard?.name).toBe('core.dashboard.alt');
    expect(resolved.workflows.onboarding?.name).toBe('core.onboarding.alt');
    expect(resolved.theme?.primary.name).toBe('core.theme.alt');
    expect(resolved.telemetry?.spec?.name).toBe('core.telemetry.alt');
    expect(resolved.experiments.active).toEqual([
      { name: 'core.experiment.alt', version: 1 },
    ]);
    expect(resolved.experiments.paused).toEqual([
      { name: 'core.experiment', version: 1 },
    ]);
    expect(resolved.featureFlags[0]?.enabled).toBe(true);
    expect(resolved.routes[0]?.label).toBe('Tenant Dashboard');
    expect(resolved.notes).toBe('Tenant specific overrides');
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
    const policies = new PolicyRegistry()
      .register(makePolicy())
      .register({
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
      },
      { strict: false }
    );

    expect(composition.resolved.tenantId).toBe('tenant');
    expect(composition.capabilities).toHaveLength(1);
    expect(composition.dataViews.dashboard!.meta.name).toBe(
      'core.dashboard.alt'
    );
    expect(composition.workflows.onboarding!.meta.name).toBe(
      'core.onboarding.alt'
    );
    expect(composition.policies).toHaveLength(2);
    expect(composition.theme?.meta.name).toBe('core.theme.alt');
    expect(composition.telemetry?.meta.name).toBe('core.telemetry.alt');
    expect(composition.experiments.active).toHaveLength(1);
    expect(composition.missing).toHaveLength(0);
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

  it('throws when strict mode and references missing', () => {
    expect(() =>
      composeAppConfig(blueprint, tenantConfig, {}, { strict: true })
    ).toThrow();
  });
});

