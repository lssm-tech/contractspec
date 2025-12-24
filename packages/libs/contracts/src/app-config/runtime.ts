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
  IntegrationSpec,
  IntegrationSpecRegistry,
} from '../integrations/spec';
import type { IntegrationConnection } from '../integrations/connection';
import type { AppIntegrationBinding } from '../integrations/binding';
import type {
  KnowledgeSpaceSpec,
  KnowledgeSpaceRegistry,
} from '../knowledge/spec';
import type { KnowledgeSourceConfig } from '../knowledge/source';
import type { AppKnowledgeBinding } from '../knowledge/binding';
import type {
  BrandingAssetRef,
  BrandingDefaults,
  ResolvedBranding,
  TenantBrandingAsset,
  // TenantBrandingConfig,
} from './branding';
import type { Locale, TranslationEntry } from '../translations/catalog';
import type {
  AppBlueprintSpec,
  AppIntegrationSlot,
  AppRouteConfig,
  AppThemeBinding,
  FeatureFlagState,
  SpecPointer,
  TelemetryBinding,
  TenantAppConfig,
  TenantRouteOverride,
  TenantSpecOverride,
  TranslationCatalogPointer,
} from './spec';

export interface ResolvedIntegration {
  slot: AppIntegrationSlot;
  binding: AppIntegrationBinding;
  connection: IntegrationConnection;
  spec: IntegrationSpec;
}

export interface ResolvedKnowledge {
  binding: AppKnowledgeBinding;
  space: KnowledgeSpaceSpec;
  sources: KnowledgeSourceConfig[];
}

export interface ResolvedTranslation {
  defaultLocale: Locale;
  supportedLocales: Locale[];
  blueprintCatalog?: TranslationCatalogPointer;
  tenantOverrides: TranslationEntry[];
}

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
  integrations: ResolvedIntegration[];
  knowledge: ResolvedKnowledge[];
  translation: ResolvedTranslation;
  branding: ResolvedBranding;
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
  integrations: ResolvedIntegration[];
  knowledge: ResolvedKnowledge[];
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
    | 'experiment'
    | 'integrationConnection'
    | 'integrationSpec'
    | 'integrationSlot'
    | 'knowledgeSpace'
    | 'knowledgeSource';
  identifier: string;
}

export interface ResolveAppConfigDeps {
  integrationSpecs?: IntegrationSpecRegistry;
  integrationConnections?: IntegrationConnection[];
  knowledgeSpaces?: KnowledgeSpaceRegistry;
  knowledgeSources?: KnowledgeSourceConfig[];
}

export interface AppCompositionDeps extends ResolveAppConfigDeps {
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
  tenant: TenantAppConfig,
  deps: ResolveAppConfigDeps = {}
): ResolvedAppConfig {
  const capabilities = mergeCapabilities(
    blueprint.capabilities,
    tenant.capabilities
  );
  const features = mergeFeatures(blueprint.features, tenant.features);
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
  const { resolved: integrations } = evaluateIntegrationSlots(
    blueprint.integrationSlots,
    tenant.integrations,
    deps.integrationConnections,
    deps.integrationSpecs
  );
  const knowledge = resolveKnowledgeBindings(
    tenant.knowledge,
    deps.knowledgeSpaces,
    deps.knowledgeSources
  );
  const branding = resolveBranding(blueprint.branding, tenant);
  const translation = resolveTranslation(
    blueprint.translationCatalog,
    tenant.locales,
    tenant.translationOverrides
  );

  return {
    appId: blueprint.meta.appId,
    tenantId: tenant.meta.tenantId,
    environment: tenant.meta.environment,
    blueprintName: blueprint.meta.key,
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
    integrations,
    knowledge,
    translation,
    branding,
    notes: tenant.notes ?? blueprint.notes,
  };
}

export function composeAppConfig(
  blueprint: AppBlueprintSpec,
  tenant: TenantAppConfig,
  deps: AppCompositionDeps,
  options: ComposeOptions = {}
): AppComposition {
  const resolved = resolveAppConfig(blueprint, tenant, deps);
  const missing: MissingReference[] = [];

  const integrationEvaluation = evaluateIntegrationSlots(
    blueprint.integrationSlots,
    tenant.integrations,
    deps.integrationConnections,
    deps.integrationSpecs
  );
  resolved.integrations = integrationEvaluation.resolved;
  missing.push(...integrationEvaluation.missing);
  missing.push(
    ...collectMissingKnowledge(
      tenant.knowledge ?? [],
      deps.knowledgeSpaces,
      deps.knowledgeSources
    )
  );

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

  const policies = resolvePolicies(resolved.policies, deps.policies, missing);

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
    integrations: resolved.integrations,
    knowledge: resolved.knowledge,
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
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
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
    tenantActive && tenantActive.length > 0 ? tenantActive : defaultActive;
  const pausedSource =
    tenantPaused && tenantPaused.length > 0 ? tenantPaused : defaultPaused;

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

function resolveBranding(
  defaults: BrandingDefaults | undefined,
  tenant: TenantAppConfig
): ResolvedBranding {
  const override = tenant.branding;
  const tenantMeta = tenant.meta;
  const baseDomain = 'app.localhost';
  const domain =
    override?.customDomain ??
    (override?.subdomain
      ? `${override.subdomain}.${baseDomain}`
      : `${tenantMeta.tenantId}.${baseDomain}`);

  const localePreferenceOrder: string[] = [];
  if (tenant.locales?.defaultLocale) {
    localePreferenceOrder.push(tenant.locales.defaultLocale);
  }
  if (override?.appName) {
    localePreferenceOrder.push('default', 'en');
  }

  let appName: string | undefined;
  if (override?.appName) {
    for (const key of localePreferenceOrder) {
      const candidate = override.appName[key];
      if (candidate) {
        appName = candidate;
        break;
      }
    }
    if (!appName) {
      const [, firstValue] = Object.entries(override.appName)[0] ?? [];
      if (typeof firstValue === 'string') {
        appName = firstValue;
      }
    }
  }
  if (!appName) {
    appName = defaults?.appNameKey ?? tenantMeta.appId;
  }

  const assetEntries = new Map<BrandingAssetRef['type'], string | undefined>();

  const applyAssets = (assets?: (BrandingAssetRef | TenantBrandingAsset)[]) => {
    if (!assets) return;
    for (const asset of assets) {
      if (!asset?.type) continue;
      if ('url' in asset && asset.url) {
        assetEntries.set(asset.type, asset.url);
      }
    }
  };

  applyAssets(defaults?.assets);
  applyAssets(override?.assets);

  const assets: ResolvedBranding['assets'] = {
    logo: assetEntries.get('logo'),
    logoDark: assetEntries.get('logo-dark'),
    favicon: assetEntries.get('favicon'),
    ogImage: assetEntries.get('og-image'),
  };

  const colors: ResolvedBranding['colors'] = {
    primary:
      override?.colors?.primary ?? defaults?.colorTokens?.primary ?? '#1f2937',
    secondary:
      override?.colors?.secondary ??
      defaults?.colorTokens?.secondary ??
      '#4b5563',
  };

  return {
    appName,
    assets,
    colors,
    domain,
  };
}

function resolveTranslation(
  catalogPointer: TranslationCatalogPointer | undefined,
  locales: TenantAppConfig['locales'],
  overrides: TenantAppConfig['translationOverrides']
): ResolvedTranslation {
  const defaultLocale = locales?.defaultLocale ?? 'en';
  const enabled = locales?.enabledLocales ?? [];
  const supportedLocales = dedupeStrings([defaultLocale, ...enabled]);
  const entries = overrides?.entries ?? [];

  return {
    defaultLocale,
    supportedLocales,
    blueprintCatalog: catalogPointer,
    tenantOverrides: entries,
  };
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

function evaluateIntegrationSlots(
  slots: AppIntegrationSlot[] | undefined,
  bindings: AppIntegrationBinding[] | undefined,
  connections: IntegrationConnection[] | undefined,
  specs: IntegrationSpecRegistry | undefined
): { resolved: ResolvedIntegration[]; missing: MissingReference[] } {
  const resolved: ResolvedIntegration[] = [];
  const missing: MissingReference[] = [];
  const missingKeys = new Set<string>();

  const recordMissing = (entry: MissingReference) => {
    const key = `${entry.type}:${entry.identifier}`;
    if (missingKeys.has(key)) return;
    missingKeys.add(key);
    missing.push(entry);
  };

  const slotList = slots ?? [];
  const slotById = new Map<string, AppIntegrationSlot>();
  for (const slot of slotList) {
    slotById.set(slot.slotId, slot);
  }

  const bindingsBySlot = new Map<string, AppIntegrationBinding[]>();
  for (const binding of bindings ?? []) {
    const slot = slotById.get(binding.slotId);
    if (!slot) {
      recordMissing({
        type: 'integrationSlot',
        identifier: `slot:${binding.slotId}`,
      });
      continue;
    }
    const entries = bindingsBySlot.get(binding.slotId);
    if (entries) entries.push(binding);
    else bindingsBySlot.set(binding.slotId, [binding]);
  }

  for (const slot of slotList) {
    const slotBindings = bindingsBySlot.get(slot.slotId) ?? [];
    if (slot.required && slotBindings.length === 0) {
      recordMissing({
        type: 'integrationSlot',
        identifier: `slot:${slot.slotId}`,
      });
    }
  }

  if (!connections || !specs) {
    return { resolved, missing };
  }

  const connectionById = new Map<string, IntegrationConnection>();
  for (const connection of connections) {
    connectionById.set(connection.meta.id, connection);
  }

  for (const slot of slotList) {
    const slotBindings = bindingsBySlot.get(slot.slotId) ?? [];
    if (slotBindings.length === 0) continue;

    const orderedBindings = [...slotBindings].sort((a, b) => {
      const aPriority = a.priority ?? Number.MAX_SAFE_INTEGER;
      const bPriority = b.priority ?? Number.MAX_SAFE_INTEGER;
      if (aPriority === bPriority) return 0;
      return aPriority < bPriority ? -1 : 1;
    });

    let slotResolved = false;
    for (const binding of orderedBindings) {
      const connection = connectionById.get(binding.connectionId);
      if (!connection) {
        recordMissing({
          type: 'integrationConnection',
          identifier: `connection:${binding.connectionId}`,
        });
        continue;
      }

      const spec = specs.get(
        connection.meta.integrationKey,
        connection.meta.integrationVersion
      );
      if (!spec) {
        recordMissing({
          type: 'integrationSpec',
          identifier: `spec:${connection.meta.integrationKey}.v${connection.meta.integrationVersion}`,
        });
        continue;
      }

      if (spec.meta.category !== slot.requiredCategory) {
        recordMissing({
          type: 'integrationSpec',
          identifier: `spec:${spec.meta.key}.category`,
        });
        continue;
      }

      if (!spec.supportedModes.includes(connection.ownershipMode)) {
        recordMissing({
          type: 'integrationSpec',
          identifier: `spec:${spec.meta.key}.mode:${connection.ownershipMode}`,
        });
        continue;
      }

      if (
        slot.allowedModes &&
        slot.allowedModes.length > 0 &&
        !slot.allowedModes.includes(connection.ownershipMode)
      ) {
        recordMissing({
          type: 'integrationConnection',
          identifier: `connection:${connection.meta.id}:mode`,
        });
        continue;
      }

      if (
        slot.requiredCapabilities &&
        !slot.requiredCapabilities.every((requirement) =>
          integrationProvidesCapability(spec, requirement)
        )
      ) {
        recordMissing({
          type: 'integrationSpec',
          identifier: `spec:${spec.meta.key}.capabilities`,
        });
        continue;
      }

      resolved.push({
        slot,
        binding,
        connection,
        spec,
      });
      slotResolved = true;
      break;
    }

    if (!slotResolved && slot.required) {
      recordMissing({
        type: 'integrationSlot',
        identifier: `slot:${slot.slotId}`,
      });
    }
  }

  return { resolved, missing };
}

function integrationProvidesCapability(
  spec: IntegrationSpec,
  required: CapabilityRef
): boolean {
  return spec.capabilities.provides.some((capability) => {
    if (capability.key !== required.key) return false;
    if (required.version == null) return true;
    return capability.version === required.version;
  });
}

function resolveKnowledgeBindings(
  bindings: AppKnowledgeBinding[] | undefined,
  spaces: KnowledgeSpaceRegistry | undefined,
  sources: KnowledgeSourceConfig[] | undefined
): ResolvedKnowledge[] {
  if (!bindings?.length || !spaces) return [];
  const sourceList = sources ?? [];
  return bindings
    .map((binding) => {
      const space = spaces.get(binding.spaceKey, binding.spaceVersion);
      if (!space) return null;
      const relevantSources = sourceList.filter((source) => {
        if (source.meta.spaceKey !== binding.spaceKey) return false;
        if (binding.spaceVersion != null) {
          return source.meta.spaceVersion === binding.spaceVersion;
        }
        return true;
      });
      return {
        binding,
        space,
        sources: relevantSources,
      };
    })
    .filter((entry): entry is ResolvedKnowledge => entry !== null);
}

function collectMissingKnowledge(
  bindings: AppKnowledgeBinding[],
  spaces: KnowledgeSpaceRegistry | undefined,
  sources: KnowledgeSourceConfig[] | undefined
): MissingReference[] {
  if (!bindings.length || !spaces) return [];
  const missing: MissingReference[] = [];
  const sourceList = sources ?? [];

  for (const binding of bindings) {
    const space = spaces.get(binding.spaceKey, binding.spaceVersion);
    if (!space) {
      missing.push({
        type: 'knowledgeSpace',
        identifier: binding.spaceVersion
          ? `${binding.spaceKey}@${binding.spaceVersion}`
          : binding.spaceKey,
      });
      continue;
    }
    if (sources) {
      const relevantSources = sourceList.filter((source) => {
        if (source.meta.spaceKey !== binding.spaceKey) return false;
        if (binding.spaceVersion != null) {
          return source.meta.spaceVersion === binding.spaceVersion;
        }
        return true;
      });
      if (relevantSources.length === 0) {
        missing.push({
          type: 'knowledgeSource',
          identifier: binding.spaceVersion
            ? `${binding.spaceKey}@${binding.spaceVersion}`
            : binding.spaceKey,
        });
      }
    }
  }

  return missing;
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
    const spec = registry.get(pointer.key, pointer.version);
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
    const spec = registry.get(policy.key, policy.version);
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
      identifier: `${binding.primary.key}.v${binding.primary.version}`,
    });
    for (const fallback of binding.fallbacks ?? []) {
      themeMissing.push({
        type: 'theme',
        identifier: `${fallback.key}.v${fallback.version}`,
      });
    }
    return { theme: undefined, fallbacks: [], themeMissing };
  }
  const theme = registry.get(binding.primary.key, binding.primary.version);
  if (!theme) {
    themeMissing.push({
      type: 'theme',
      identifier: `${binding.primary.key}.v${binding.primary.version}`,
    });
  }
  const fallbacks: ThemeSpec[] = [];
  for (const fallback of binding.fallbacks ?? []) {
    const spec = registry.get(fallback.key, fallback.version);
    if (!spec) {
      themeMissing.push({
        type: 'theme',
        identifier: `${fallback.key}.v${fallback.version}`,
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
  const telemetry = registry.get(binding.spec.key, binding.spec.version);
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
      const spec = registry.get(ref.key, ref.version);
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
  return `${pointer.key}${pointer.version ? `.v${pointer.version}` : ''}`;
}

function policyKey(ref: PolicyRef) {
  return `${ref.key}${ref.version ? `.v${ref.version}` : ''}`;
}

function experimentKey(ref: ExperimentRef) {
  return `${ref.key}${ref.version ? `.v${ref.version}` : ''}`;
}

function dedupeRefs<T>(refs: T[], keyFn: (value: T) => string): T[] {
  const map = new Map<string, T>();
  for (const ref of refs) {
    map.set(keyFn(ref), ref);
  }
  return [...map.values()];
}

function dedupeStrings(values: string[]): string[] {
  return [...new Set(values)];
}
