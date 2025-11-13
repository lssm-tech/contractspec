import { describe, expect, it } from 'vitest';
import { composeAppConfig } from './runtime';
import type { AppConfigSpec } from './spec';
import {
  CapabilityRegistry,
  type CapabilitySpec,
} from '../capabilities';
import { StabilityEnum, type Owner, type Tag } from '../ownership';
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

const ownership = {
  title: 'Sample',
  description: 'Sample description',
  domain: 'core',
  owners: ['@team.platform'] as Owner[],
  tags: ['sample'] as Tag[],
  stability: StabilityEnum.Experimental,
} as const;

function makeCapability(): CapabilitySpec {
  return {
    meta: {
      ...ownership,
      key: 'core.sample',
      version: 1,
      kind: 'integration',
    },
    provides: [],
  };
}

function makeFeature(): FeatureModuleSpec {
  return {
    meta: {
      ...ownership,
      key: 'core-shell',
    },
  };
}

function makeDataView(): DataViewSpec {
  return {
    meta: {
      ...ownership,
      name: 'core.dashboard.view',
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

function makeWorkflow(): WorkflowSpec {
  return {
    meta: {
      ...ownership,
      name: 'core.onboarding',
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

function makeTheme(): ThemeSpec {
  return {
    meta: {
      ...ownership,
      name: 'core.theme',
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

function makeTelemetry(): TelemetrySpec {
  return {
    meta: {
      ...ownership,
      name: 'core.telemetry',
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

function makeExperiment(): ExperimentSpec {
  return {
    meta: {
      ...ownership,
      name: 'core.experiment',
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

const baseConfig: AppConfigSpec = {
  meta: {
    ...ownership,
    name: 'tenant.core.app',
    version: 1,
    appId: 'core-app',
    tenantId: 'tenant',
    environment: 'production',
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
};

describe('composeAppConfig', () => {
  it('resolves references across registries', () => {
    const capabilities = new CapabilityRegistry().register(makeCapability());
    const features = new FeatureRegistry().register(makeFeature());
    const dataViews = new DataViewRegistry().register(makeDataView());
    const workflows = new WorkflowRegistry().register(makeWorkflow());
    const policies = new PolicyRegistry().register(makePolicy());
    const themes = new ThemeRegistry().register(makeTheme());
    const telemetry = new TelemetryRegistry().register(makeTelemetry());
    const experiments = new ExperimentRegistry().register(makeExperiment());

    const composition = composeAppConfig(baseConfig, {
      capabilities,
      features,
      dataViews,
      workflows,
      policies,
      themes,
      telemetry,
      experiments,
    });

    expect(composition.capabilities).toHaveLength(1);
    expect(Object.keys(composition.dataViews)).toEqual(['dashboard']);
    expect(Object.keys(composition.workflows)).toEqual(['onboarding']);
    expect(composition.policies).toHaveLength(1);
    expect(composition.theme?.meta.name).toBe('core.theme');
    expect(composition.telemetry?.meta.name).toBe('core.telemetry');
    expect(composition.experiments.active).toHaveLength(1);
    expect(composition.missing).toHaveLength(0);
  });

  it('records missing references when registries are absent', () => {
    const composition = composeAppConfig(baseConfig, {}, { strict: false });
    expect(composition.missing).not.toHaveLength(0);
    const identifiers = composition.missing.map((m) => m.type);
    expect(identifiers).toContain('capability');
    expect(identifiers).toContain('feature');
    expect(identifiers).toContain('dataView');
    expect(identifiers).toContain('workflow');
    expect(identifiers).toContain('policy');
    expect(identifiers).toContain('theme');
    expect(identifiers).toContain('telemetry');
    expect(identifiers).toContain('experiment');
  });

  it('throws when strict mode and missing references', () => {
    expect(() => composeAppConfig(baseConfig, {}, { strict: true })).toThrow();
  });
});

