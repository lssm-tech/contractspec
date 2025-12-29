import { confirm, input, number, select } from '@inquirer/prompts';
import type {
  AppBlueprintSpecData,
  AppConfigFeatureFlagData,
  AppConfigMappingData,
  AppRouteConfigData,
  Stability,
} from '../../../types';

export async function appConfigWizard(): Promise<AppBlueprintSpecData> {
  const name = await input({
    message: 'Config name (e.g., "tenant.app"):',
    validate: required,
  });

  const versionValue = await number({
    message: 'Version:',
    default: 1,
    validate: positiveInt,
  });
  const version = versionValue ?? 1;

  const title = await input({
    message: 'Title:',
    default: `${name} config`,
  });

  const description = await input({
    message: 'Description:',
    default: 'Application configuration',
  });

  const domain = await input({
    message: 'Domain/bounded context:',
    default: name.split('.')[0] ?? 'core',
  });

  const ownersInput = await input({
    message: 'Owners (comma-separated @handles):',
    default: '@team.platform',
    validate: validateOwners,
  });

  const tagsInput = await input({
    message: 'Tags (comma-separated):',
    default: 'app-config',
  });

  const stability = await select<Stability>({
    message: 'Stability:',
    choices: [
      { name: 'Experimental', value: 'experimental' },
      { name: 'Beta', value: 'beta' },
      { name: 'Stable', value: 'stable' },
      { name: 'Deprecated', value: 'deprecated' },
    ],
    default: 'experimental',
  });

  const appId = await input({
    message: 'Application id:',
    default: name.split('.')[1] ?? 'app',
    validate: required,
  });

  const capabilitiesEnabled = await collectList(
    'Enable capabilities (comma-separated keys, optional):'
  );
  const capabilitiesDisabled = await collectList(
    'Disable capabilities (comma-separated keys, optional):'
  );
  const featureIncludes = await collectList(
    'Include features (comma-separated feature keys, optional):'
  );
  const featureExcludes = await collectList(
    'Exclude features (comma-separated feature keys, optional):'
  );

  const dataViews = await collectMappings('Add data view slot?');
  const workflows = await collectMappings('Add workflow slot?');
  const policyRefs = await collectPolicyRefs();
  const theme = await collectThemeBinding();
  const themeFallbacks = await collectThemeFallbacks();
  const telemetry = await collectSpecRef('Bind telemetry spec?');
  const activeExperiments = await collectExperimentRefs(
    'Activate experiments?'
  );
  const pausedExperiments = await collectExperimentRefs('Pause experiments?');
  const featureFlags = await collectFeatureFlags();
  const routes = await collectRoutes();

  const notes = await input({
    message: 'Notes (optional):',
    default: '',
  });

  return {
    name,
    version,
    title,
    description,
    domain,
    owners: splitList(ownersInput),
    tags: splitList(tagsInput),
    stability,
    appId,
    capabilitiesEnabled,
    capabilitiesDisabled,
    featureIncludes,
    featureExcludes,
    dataViews,
    workflows,
    policyRefs,
    theme,
    themeFallbacks,
    telemetry,
    activeExperiments,
    pausedExperiments,
    featureFlags,
    routes,
    notes: notes || undefined,
  };
}

async function collectMappings(
  promptMessage: string
): Promise<AppConfigMappingData[]> {
  const mappings: AppConfigMappingData[] = [];
  let add = await confirm({ message: promptMessage, default: false });
  while (add) {
    const slot = await input({
      message: 'Slot key (e.g., "dashboard"):',
      validate: required,
    });
    const name = await input({
      message: 'Spec name:',
      validate: required,
    });
    const versionValue = await number({
      message: 'Spec version (optional):',
      default: undefined,
    });
    mappings.push({
      slot,
      name,
      version: typeof versionValue === 'number' ? versionValue : undefined,
    });
    add = await confirm({ message: promptMessage, default: false });
  }
  return mappings;
}

async function collectPolicyRefs(): Promise<
  { name: string; version?: number }[]
> {
  const policies: { name: string; version?: number }[] = [];
  let add = await confirm({ message: 'Add policy reference?', default: false });
  while (add) {
    const name = await input({
      message: 'Policy name:',
      validate: required,
    });
    const versionValue = await number({
      message: 'Policy version (optional):',
      default: undefined,
    });
    policies.push({
      name,
      version: typeof versionValue === 'number' ? versionValue : undefined,
    });
    add = await confirm({
      message: 'Add another policy reference?',
      default: false,
    });
  }
  return policies;
}

async function collectThemeBinding(): Promise<AppBlueprintSpecData['theme']> {
  const attach = await confirm({
    message: 'Bind a primary theme?',
    default: true,
  });
  if (!attach) return undefined;
  const name = await input({
    message: 'Theme name:',
    validate: required,
  });
  const versionValue = await number({
    message: 'Theme version:',
    default: 1,
    validate: positiveInt,
  });
  return { name, version: versionValue ?? 1 };
}

async function collectThemeFallbacks(): Promise<
  { name: string; version: number }[]
> {
  const fallbacks: { name: string; version: number }[] = [];
  let add = await confirm({
    message: 'Add theme fallback?',
    default: false,
  });
  while (add) {
    const name = await input({
      message: 'Fallback theme name:',
      validate: required,
    });
    const versionValue = await number({
      message: 'Fallback theme version:',
      default: 1,
      validate: positiveInt,
    });
    fallbacks.push({ name, version: versionValue ?? 1 });
    add = await confirm({
      message: 'Add another fallback?',
      default: false,
    });
  }
  return fallbacks;
}

async function collectSpecRef(
  message: string
): Promise<{ name: string; version?: number } | undefined> {
  const attach = await confirm({ message, default: false });
  if (!attach) return undefined;
  const name = await input({
    message: 'Spec name:',
    validate: required,
  });
  const versionValue = await number({
    message: 'Spec version (optional):',
    default: undefined,
  });
  return {
    name,
    version: typeof versionValue === 'number' ? versionValue : undefined,
  };
}

async function collectExperimentRefs(prompt: string) {
  const experiments: { name: string; version?: number }[] = [];
  let add = await confirm({ message: prompt, default: false });
  while (add) {
    const name = await input({
      message: 'Experiment name:',
      validate: required,
    });
    const versionValue = await number({
      message: 'Experiment version (optional):',
      default: undefined,
    });
    experiments.push({
      name,
      version: typeof versionValue === 'number' ? versionValue : undefined,
    });
    add = await confirm({ message: 'Add another experiment?', default: false });
  }
  return experiments;
}

async function collectFeatureFlags(): Promise<AppConfigFeatureFlagData[]> {
  const flags: AppConfigFeatureFlagData[] = [];
  let add = await confirm({
    message: 'Define feature flag overrides?',
    default: false,
  });
  while (add) {
    const key = await input({
      message: 'Flag key:',
      validate: required,
    });
    const enabled = await confirm({
      message: 'Enabled?',
      default: true,
    });
    const variant = await input({
      message: 'Variant (optional):',
      default: '',
    });
    const description = await input({
      message: 'Description (optional):',
      default: '',
    });
    flags.push({
      key,
      enabled,
      variant: variant || undefined,
      description: description || undefined,
    });
    add = await confirm({
      message: 'Add another feature flag?',
      default: false,
    });
  }
  return flags;
}

async function collectRoutes(): Promise<AppRouteConfigData[]> {
  const routes: AppRouteConfigData[] = [];
  let add = await confirm({
    message: 'Configure application routes?',
    default: false,
  });
  while (add) {
    const path = await input({
      message: 'Route path (e.g., "/dashboard"):',
      validate: required,
    });
    const label = await input({
      message: 'Route label (optional):',
      default: '',
    });
    const dataView = await input({
      message: 'Data view slot (optional):',
      default: '',
    });
    const workflow = await input({
      message: 'Workflow slot (optional):',
      default: '',
    });
    const guardName = await input({
      message: 'Guard policy name (optional):',
      default: '',
    });
    let guardVersion: number | undefined;
    if (guardName.trim()) {
      const guardVersionValue = await number({
        message: 'Guard policy version (optional):',
        default: undefined,
      });
      guardVersion =
        typeof guardVersionValue === 'number' ? guardVersionValue : undefined;
    }
    const featureFlag = await input({
      message: 'Feature flag key (optional):',
      default: '',
    });
    const experimentName = await input({
      message: 'Experiment name (optional):',
      default: '',
    });
    let experimentVersion: number | undefined;
    if (experimentName.trim()) {
      const experimentVersionValue = await number({
        message: 'Experiment version (optional):',
        default: undefined,
      });
      experimentVersion =
        typeof experimentVersionValue === 'number'
          ? experimentVersionValue
          : undefined;
    }
    routes.push({
      path,
      label: label || undefined,
      dataView: dataView || undefined,
      workflow: workflow || undefined,
      guardName: guardName || undefined,
      guardVersion,
      featureFlag: featureFlag || undefined,
      experimentName: experimentName || undefined,
      experimentVersion,
    });
    add = await confirm({
      message: 'Add another route?',
      default: false,
    });
  }
  return routes;
}

async function collectList(message: string): Promise<string[]> {
  const answer = await input({
    message,
    default: '',
  });
  return splitList(answer);
}

function splitList(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function required(value: string) {
  return value.trim().length > 0 || 'Value is required';
}

function positiveInt(value?: number) {
  if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0) {
    return 'Must be a positive integer';
  }
  return true;
}

function validateOwners(value: string) {
  const owners = splitList(value);
  if (owners.length === 0) return 'At least one owner is required';
  if (!owners.every((owner) => owner.startsWith('@'))) {
    return 'Owners must start with @ (e.g., "@team.platform")';
  }
  return true;
}
