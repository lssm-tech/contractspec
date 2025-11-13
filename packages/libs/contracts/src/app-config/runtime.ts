import type {
  CapabilityRef,
  CapabilityRegistry,
  CapabilitySpec,
} from '../capabilities';
import type {
  FeatureRegistry,
  FeatureModuleSpec,
  FeatureRef,
} from '../features';
import type { DataViewRegistry, DataViewSpec } from '../data-views';
import type { WorkflowRegistry, WorkflowSpec } from '../workflow/spec';
import type { PolicyRef, PolicyRegistry, PolicySpec } from '../policy/spec';
import type { ThemeRegistry, ThemeSpec } from '../themes';
import type { TelemetryRegistry, TelemetrySpec } from '../telemetry/spec';
import type {
  ExperimentRef,
  ExperimentRegistry,
  ExperimentSpec,
} from '../experiments/spec';
import type {
  AppBlueprintSpec,
  AppRouteConfig,
  AppThemeBinding,
  FeatureFlagState,
  SpecPointer,
  TelemetryBinding,
  TenantAppConfig,
  TenantRouteOverride,
  TenantSpecOverride,
} from './spec';

export interface ResolvedAppConfig {
  appId: string;
  tenantId: string;
  environment?: string;
  blueprintName: string;
  blueprintVersion: number;
  configVersion: number;
  capabilities: {
    enabled: CapabilityRef[];
    disabled: CapabilityRef[];
  };
  features: {
    include: FeatureRef[];
    exclude: FeatureRef[];
  };
  dataViews: Record<string, SpecPointer>;
  workflows: Record<string, SpecPointer>;
  policies: PolicyRef[];
  theme?: AppThemeBinding;
  telemetry?: TelemetryBinding;
  experiments: {
    catalog: ExperimentRef[];
    active: ExperimentRef[];
    paused: ExperimentRef[];
  };
  featureFlags: FeatureFlagState[];
  routes: AppRouteConfig[];
  notes?: string;
}

export interface AppComposition {
  resolved: ResolvedAppConfig;
  capabilities: CapabilitySpec[];
  features: FeatureModuleSpec[];
  dataViews: Record<string, DataViewSpec>;
  workflows: Record<string, WorkflowSpec>;
  policies: PolicySpec[];
  theme?: ThemeSpec;
  themeFallbacks: ThemeSpec[];
  telemetry?: TelemetrySpec;
  experiments: {
    active: ExperimentSpec[];
    paused: ExperimentSpec[];
  };
  missing: MissingReference[];
}

export interface MissingReference {
  type:
    | 'capability'
    | 'feature'
    | 'dataView'
    | 'workflow'
    | 'policy'
    | 'theme'
    | 'telemetry'
    | 'experiment';
  identifier: string;
}

export interface AppCompositionDeps {
  capabilities?: CapabilityRegistry;
  features?: FeatureRegistry;
  dataViews?: DataViewRegistry;
  workflows?: WorkflowRegistry;
  policies?: PolicyRegistry;
  themes?: ThemeRegistry;
  telemetry?: TelemetryRegistry;
  experiments?: ExperimentRegistry;
}

export interface ComposeOptions {
  strict?: boolean;
}

export function resolveAppConfig(
  blueprint: AppBlueprintSpec,
  tenant: TenantAppConfig
): ResolvedAppConfig {
  const capabilities = mergeCapabilities(
    blueprint.capabilities,
    tenant.capabilities
  );
  const features = mergeFeatures(
    blueprint.features,
    tenant.features
  );
  const dataViews = mergeMappings(
    blueprint.dataViews ?? {},
    tenant.dataViewOverrides
  );
  const workflows = mergeMappings(
    blueprint.workflows ?? {},
    tenant.workflowOverrides
  );
  const policies = mergePolicies(
    blueprint.policies ?? [],
    tenant.additionalPolicies ?? []
  );
  const theme = mergeTheme(blueprint.theme, tenant.themeOverride);
  const telemetry = mergeTelemetry(
    blueprint.telemetry,
    tenant.telemetryOverride
  );
  const experiments = mergeExperiments(
    blueprint.experiments,
    tenant.experiments
  );
  const featureFlags = mergeFeatureFlags(
    blueprint.featureFlags ?? [],
    tenant.featureFlags ?? []
  );
  const routes = mergeRoutes(
    blueprint.routes ?? [],
    tenant.routeOverrides ?? []
  );

  return {
    appId: blueprint.meta.appId,
    tenantId: tenant.meta.tenantId,
    environment: tenant.meta.environment,
    blueprintName: blueprint.meta.name,
    blueprintVersion: blueprint.meta.version,
    configVersion: tenant.meta.version,
    capabilities,
    features,
    dataViews,
    workflows,
    policies,
    theme,
    telemetry,
    experiments,
    featureFlags,
    routes,
    notes: tenant.notes ?? blueprint.notes,
  };
}

export function composeAppConfig(
  blueprint: AppBlueprintSpec,
  tenant: TenantAppConfig,
  deps: AppCompositionDeps,
  options: ComposeOptions = {}
): AppComposition {
  const resolved = resolveAppConfig(blueprint, tenant);
  const missing: MissingReference[] = [];

  const capabilities = resolveCapabilityRefs(
    resolved.capabilities.enabled,
    deps.capabilities,
    missing
  );

  const features = resolveFeatureRefs(
    resolved.features.include,
    deps.features,
    missing
  );

  const dataViews = resolvePointerRecord(
    resolved.dataViews,
    deps.dataViews,
    'dataView',
    missing
  );

  const workflows = resolvePointerRecord(
    resolved.workflows,
    deps.workflows,
    'workflow',
    missing
  );

  const policies = resolvePolicies(
    resolved.policies,
    deps.policies,
    missing
  );

  const { theme, fallbacks, themeMissing } = resolveThemeBinding(
    resolved.theme,
    deps.themes
  );
  missing.push(...themeMissing);

  const { telemetry, telemetryMissing } = resolveTelemetryBinding(
    resolved.telemetry,
    deps.telemetry
  );
  missing.push(...telemetryMissing);

  const experiments = resolveExperimentsSpecs(
    resolved.experiments,
    deps.experiments,
    missing
  );

  if (options.strict && missing.length > 0) {
    const reasons = missing
      .map((item) => `${item.type}:${item.identifier}`)
      .join(', ');
    throw new Error(`composeAppConfig: missing references -> ${reasons}`);
  }

  return {
    resolved,
    capabilities,
    features,
    dataViews,
    workflows,
    policies,
    theme,
    themeFallbacks: fallbacks,
    telemetry,
    experiments,
    missing,
  };
}

function mergeCapabilities(
  blueprint: AppBlueprintSpec['capabilities'],
  tenant: TenantAppConfig['capabilities']
): { enabled: CapabilityRef[]; disabled: CapabilityRef[] } {
  const enabled = dedupeRefs(
    [...(blueprint?.enabled ?? []), ...(tenant?.enable ?? [])],
    capabilityKey
  );
  const disabled = dedupeRefs(
    [...(blueprint?.disabled ?? []), ...(tenant?.disable ?? [])],
    capabilityKey
  );
  const disabledKeys = new Set(disabled.map(capabilityKey));
  const filteredEnabled = enabled.filter(
    (ref) => !disabledKeys.has(capabilityKey(ref))
  );
  return { enabled: filteredEnabled, disabled };
}

function mergeFeatures(
  blueprint: AppBlueprintSpec['features'],
  tenant: TenantAppConfig['features']
): { include: FeatureRef[]; exclude: FeatureRef[] } {
  const include = dedupeRefs(
    [...(blueprint?.include ?? []), ...(tenant?.include ?? [])],
    featureKey
  );
  const exclude = dedupeRefs(
    [...(blueprint?.exclude ?? []), ...(tenant?.exclude ?? [])],
    featureKey
  );
  const excludeSet = new Set(exclude.map(featureKey));
  const filteredInclude = include.filter(
    (ref) => !excludeSet.has(featureKey(ref))
  );
  return { include: filteredInclude, exclude };
}

function mergeMappings(
  blueprint: Record<string, SpecPointer>,
  overrides: TenantSpecOverride[] | undefined
): Record<string, SpecPointer> {
  const merged: Record<string, SpecPointer> = { ...blueprint };
  if (!overrides) return merged;
  for (const override of overrides) {
    if (!override) continue;
    if (!override.pointer) {
      delete merged[override.slot];
    } else {
      merged[override.slot] = override.pointer;
    }
  }
  return merged;
}

function mergePolicies(
  blueprint: PolicyRef[],
  additional: PolicyRef[]
): PolicyRef[] {
  return dedupeRefs([...blueprint, ...additional], policyKey);
}

function mergeTheme(
  blueprint: AppThemeBinding | undefined,
  override: TenantAppConfig['themeOverride']
): AppThemeBinding | undefined {
  if (!blueprint && !override) return undefined;
  const primary = override?.primary ?? blueprint?.primary;
  if (!primary) return undefined;
  const fallbacks = override?.fallbacks ?? blueprint?.fallbacks ?? [];
  return { primary, fallbacks };
}

function mergeTelemetry(
  blueprint: TelemetryBinding | undefined,
  override: TenantAppConfig['telemetryOverride']
): TelemetryBinding | undefined {
  if (!blueprint && !override) return undefined;
  const binding: TelemetryBinding = {
    spec: blueprint?.spec,
    disabledEvents: blueprint?.disabledEvents
      ? [...blueprint.disabledEvents]
      : undefined,
    samplingOverrides: blueprint?.samplingOverrides
      ? { ...blueprint.samplingOverrides }
      : undefined,
  };
  if (override?.spec !== undefined) {
    binding.spec = override.spec ?? undefined;
  }
  if (override?.disabledEvents) {
    binding.disabledEvents = dedupeStrings([
      ...(binding.disabledEvents ?? []),
      ...override.disabledEvents,
    ]);
  }
  if (override?.samplingOverrides) {
    binding.samplingOverrides = {
      ...(binding.samplingOverrides ?? {}),
      ...override.samplingOverrides,
    };
  }
  if (!binding.spec && !binding.disabledEvents?.length) {
    return undefined;
  }
  return binding;
}

function mergeExperiments(
  blueprint: AppBlueprintSpec['experiments'],
  tenant: TenantAppConfig['experiments']
): {
  catalog: ExperimentRef[];
  active: ExperimentRef[];
  paused: ExperimentRef[];
} {
  const defaultActive = blueprint?.active ?? [];
  const defaultPaused = blueprint?.paused ?? [];
  const tenantActive = tenant?.active;
  const tenantPaused = tenant?.paused;

  const activeSource =
    tenantActive && tenantActive.length > 0
      ? tenantActive
      : defaultActive;
  const pausedSource =
    tenantPaused && tenantPaused.length > 0
      ? tenantPaused
      : defaultPaused;

  const active = dedupeRefs(activeSource, experimentKey);
  let paused = dedupeRefs(pausedSource, experimentKey);
  const activeKeys = new Set(active.map(experimentKey));
  paused = paused.filter((ref) => !activeKeys.has(experimentKey(ref)));

  const catalog = dedupeRefs(
    [
      ...defaultActive,
      ...defaultPaused,
      ...(tenantActive ?? []),
      ...(tenantPaused ?? []),
    ],
    experimentKey
  );

  return { catalog, active, paused };
}

function mergeFeatureFlags(
  blueprint: FeatureFlagState[],
  overrides: FeatureFlagState[]
): FeatureFlagState[] {
  const merged = new Map<string, FeatureFlagState>();
  for (const flag of blueprint) {
    merged.set(flag.key, { ...flag });
  }
  for (const override of overrides) {
    merged.set(override.key, { ...override });
  }
  return [...merged.values()];
}

function mergeRoutes(
  blueprint: AppRouteConfig[],
  overrides: TenantRouteOverride[]
): AppRouteConfig[] {
  const routes = new Map<string, AppRouteConfig>();
  for (const route of blueprint) {
    routes.set(route.path, { ...route });
  }
  for (const override of overrides) {
    const existing = routes.get(override.path) ?? { path: override.path };
    if (override.label !== undefined) {
      if (override.label === null) delete existing.label;
      else existing.label = override.label;
    }
    if (override.dataView !== undefined) {
      if (override.dataView === null) delete existing.dataView;
      else existing.dataView = override.dataView;
    }
    if (override.workflow !== undefined) {
      if (override.workflow === null) delete existing.workflow;
      else existing.workflow = override.workflow;
    }
    if (override.guard !== undefined) {
      if (override.guard === null) delete existing.guard;
      else existing.guard = override.guard;
    }
    if (override.featureFlag !== undefined) {
      if (override.featureFlag === null) delete existing.featureFlag;
      else existing.featureFlag = override.featureFlag;
    }
    if (override.experiment !== undefined) {
      if (override.experiment === null) delete existing.experiment;
      else existing.experiment = override.experiment;
    }
    routes.set(existing.path, existing);
  }
  return [...routes.values()];
}

function resolveCapabilityRefs(
  refs: CapabilityRef[],
  registry: CapabilityRegistry | undefined,
  missing: MissingReference[]
): CapabilitySpec[] {
  if (!registry) {
    if (refs.length > 0) {
      for (const ref of refs) {
        missing.push({
          type: 'capability',
          identifier: capabilityKey(ref),
        });
      }
    }
    return [];
  }

  const resolved: CapabilitySpec[] = [];
  for (const ref of refs) {
    const spec = registry.get(ref.key, ref.version);
    if (!spec) {
      missing.push({
        type: 'capability',
        identifier: capabilityKey(ref),
      });
      continue;
    }
    resolved.push(spec);
  }
  return resolved;
}

function resolveFeatureRefs(
  refs: FeatureRef[],
  registry: FeatureRegistry | undefined,
  missing: MissingReference[]
): FeatureModuleSpec[] {
  if (!registry) {
    if (refs.length > 0) {
      for (const ref of refs) {
        missing.push({ type: 'feature', identifier: ref.key });
      }
    }
    return [];
  }
  const resolved: FeatureModuleSpec[] = [];
  for (const ref of refs) {
    const spec = registry.get(ref.key);
    if (!spec) {
      missing.push({ type: 'feature', identifier: ref.key });
      continue;
    }
    resolved.push(spec);
  }
  return resolved;
}

function resolvePointerRecord<TSpec>(
  record: Record<string, SpecPointer>,
  registry:
    | { get(name: string, version?: number): TSpec | undefined }
    | undefined,
  type: 'dataView' | 'workflow',
  missing: MissingReference[]
): Record<string, TSpec> {
  if (!registry) {
    if (Object.keys(record).length > 0) {
      for (const [slot, pointer] of Object.entries(record)) {
        missing.push({
          type,
          identifier: `${slot} -> ${specPointerKey(pointer)}`,
        });
      }
    }
    return {};
  }
  const resolved: Record<string, TSpec> = {};
  for (const [slot, pointer] of Object.entries(record)) {
    const spec = registry.get(pointer.name, pointer.version);
    if (!spec) {
      missing.push({
        type,
        identifier: `${slot} -> ${specPointerKey(pointer)}`,
      });
      continue;
    }
    resolved[slot] = spec;
  }
  return resolved;
}

function resolvePolicies(
  policies: PolicyRef[],
  registry: PolicyRegistry | undefined,
  missing: MissingReference[]
): PolicySpec[] {
  if (!registry) {
    if (policies.length > 0) {
      for (const policy of policies) {
        missing.push({
          type: 'policy',
          identifier: policyKey(policy),
        });
      }
    }
    return [];
  }
  const resolved: PolicySpec[] = [];
  for (const policy of policies) {
    const spec = registry.get(policy.name, policy.version);
    if (!spec) {
      missing.push({
        type: 'policy',
        identifier: policyKey(policy),
      });
      continue;
    }
    resolved.push(spec);
  }
  return resolved;
}

function resolveThemeBinding(
  binding: AppThemeBinding | undefined,
  registry: ThemeRegistry | undefined
): {
  theme?: ThemeSpec;
  fallbacks: ThemeSpec[];
  themeMissing: MissingReference[];
} {
  const themeMissing: MissingReference[] = [];
  if (!binding) {
    return { theme: undefined, fallbacks: [], themeMissing };
  }
  if (!registry) {
    themeMissing.push({
      type: 'theme',
      identifier: `${binding.primary.name}.v${binding.primary.version}`,
    });
    for (const fallback of binding.fallbacks ?? []) {
      themeMissing.push({
        type: 'theme',
        identifier: `${fallback.name}.v${fallback.version}`,
      });
    }
    return { theme: undefined, fallbacks: [], themeMissing };
  }
  const theme = registry.get(binding.primary.name, binding.primary.version);
  if (!theme) {
    themeMissing.push({
      type: 'theme',
      identifier: `${binding.primary.name}.v${binding.primary.version}`,
    });
  }
  const fallbacks: ThemeSpec[] = [];
  for (const fallback of binding.fallbacks ?? []) {
    const spec = registry.get(fallback.name, fallback.version);
    if (!spec) {
      themeMissing.push({
        type: 'theme',
        identifier: `${fallback.name}.v${fallback.version}`,
      });
      continue;
    }
    fallbacks.push(spec);
  }
  return { theme: theme ?? undefined, fallbacks, themeMissing };
}

function resolveTelemetryBinding(
  binding: TelemetryBinding | undefined,
  registry: TelemetryRegistry | undefined
): { telemetry?: TelemetrySpec; telemetryMissing: MissingReference[] } {
  const telemetryMissing: MissingReference[] = [];
  if (!binding?.spec) {
    return { telemetry: undefined, telemetryMissing };
  }
  if (!registry) {
    telemetryMissing.push({
      type: 'telemetry',
      identifier: specPointerKey(binding.spec),
    });
    return { telemetry: undefined, telemetryMissing };
  }
  const telemetry = registry.get(binding.spec.name, binding.spec.version);
  if (!telemetry) {
    telemetryMissing.push({
      type: 'telemetry',
      identifier: specPointerKey(binding.spec),
    });
  }
  return { telemetry: telemetry ?? undefined, telemetryMissing };
}

function resolveExperimentsSpecs(
  experiments: ResolvedAppConfig['experiments'],
  registry: ExperimentRegistry | undefined,
  missing: MissingReference[]
): { active: ExperimentSpec[]; paused: ExperimentSpec[] } {
  const resolveList = (refs: ExperimentRef[]): ExperimentSpec[] => {
    if (refs.length === 0) return [];
    if (!registry) {
      for (const ref of refs) {
        missing.push({
          type: 'experiment',
          identifier: experimentKey(ref),
        });
      }
      return [];
    }
    const resolved: ExperimentSpec[] = [];
    for (const ref of refs) {
      const spec = registry.get(ref.name, ref.version);
      if (!spec) {
        missing.push({
          type: 'experiment',
          identifier: experimentKey(ref),
        });
        continue;
      }
      resolved.push(spec);
    }
    return resolved;
  };

  return {
    active: resolveList(experiments.active),
    paused: resolveList(experiments.paused),
  };
}

function capabilityKey(ref: CapabilityRef) {
  return `${ref.key}${ref.version ? `.v${ref.version}` : ''}`;
}

function featureKey(ref: FeatureRef) {
  return ref.key;
}

function specPointerKey(pointer: SpecPointer) {
  return `${pointer.name}${pointer.version ? `.v${pointer.version}` : ''}`;
}

function policyKey(ref: PolicyRef) {
  return `${ref.name}${ref.version ? `.v${ref.version}` : ''}`;
}

function experimentKey(ref: ExperimentRef) {
  return `${ref.name}${ref.version ? `.v${ref.version}` : ''}`;
}

function dedupeRefs<T>(
  refs: T[],
  keyFn: (value: T) => string
): T[] {
  const map = new Map<string, T>();
  for (const ref of refs) {
    map.set(keyFn(ref), ref);
  }
  return [...map.values()];
}

function dedupeStrings(values: string[]): string[] {
  return [...new Set(values)];
}

