## App Configuration Layers

App orchestration is split into three explicit layers:

1. **AppBlueprintSpec**: global, versioned description of what an app can look like. Stored in Git with no tenant or environment data.
2. **TenantAppConfig**: tenant and environment overrides that Studio or control-plane workflows edit over time.
3. **ResolvedAppConfig**: the pure merged view consumed by runtime code.

- Types and registry: `packages/libs/contracts-spec/src/app-config/spec.ts`
- Resolution helpers: `packages/libs/contracts-spec/src/app-config/runtime.ts`
- Validation helpers: `packages/libs/contracts-spec/src/app-config/validation.ts`
- CLI wizard: `contractspec create app-config`

### 1. AppBlueprintSpec

```ts
export interface AppBlueprintSpec {
  meta: AppBlueprintMeta;          // { key, version, appId, ownership }
  capabilities?: { enabled?: CapabilityRef[]; disabled?: CapabilityRef[] };
  features?: { include?: FeatureRef[]; exclude?: FeatureRef[] };
  integrationSlots?: AppIntegrationSlot[];
  branding?: BrandingDefaults;
  translationCatalog?: { key: string; version: string };
  dataViews?: Record<string, SpecPointer>;
  workflows?: Record<string, SpecPointer>;
  jobs?: Record<string, SpecPointer>;
  policies?: PolicyRef[];
  theme?: AppThemeBinding;         // { primary: ThemeRef; fallbacks?: ThemeRef[] }
  telemetry?: TelemetryBinding;    // { spec?: SpecPointer; disabledEvents?: string[] }
  experiments?: { active?: ExperimentRef[]; paused?: ExperimentRef[] };
  featureFlags?: FeatureFlagState[];
  routes?: AppRouteConfig[];
  notes?: string;
}
```

Register blueprints with `AppBlueprintRegistry`. Blueprints only capture the default, global experience.

- **Integration slots** declare the categories and capability requirements an app expects. Slots never include secrets.
- **Branding defaults** provide message-key-based names, placeholder assets, and token references that tenants can override later.

### 2. TenantAppConfig

```ts
export interface TenantAppConfig {
  meta: TenantAppConfigMeta;  // { id, tenantId, appId, blueprintName, blueprintVersion, version, status }
  capabilities?: { enable?: CapabilityRef[]; disable?: CapabilityRef[] };
  features?: { include?: FeatureRef[]; exclude?: FeatureRef[] };
  dataViewOverrides?: TenantSpecOverride[];
  workflowOverrides?: TenantSpecOverride[];
  jobOverrides?: TenantSpecOverride[];
  additionalPolicies?: PolicyRef[];
  themeOverride?: { primary?: ThemeRef | null; fallbacks?: ThemeRef[] };
  telemetryOverride?: { spec?: SpecPointer | null; disabledEvents?: string[] };
  experiments?: { active?: ExperimentRef[]; paused?: ExperimentRef[] };
  featureFlags?: FeatureFlagState[];
  routeOverrides?: TenantRouteOverride[];
  integrations?: AppIntegrationBinding[];
  knowledge?: AppKnowledgeBinding[];
  locales?: { defaultLocale: Locale; enabledLocales: Locale[] };
  translationOverrides?: { entries?: TranslationEntry[] };
  branding?: TenantBrandingConfig;
  notes?: string;
}
```

- **AppIntegrationBinding** maps `slotId` to `connectionId` plus optional workflow scopes.
- **TenantBrandingConfig** allows per-tenant names, assets, and domains while keeping secrets and large files out of blueprints.

### 3. ResolvedAppConfig

Use `resolveAppConfig(blueprint, tenant)` to build the merged pointer view. Use `composeAppConfig(...)` to hydrate those pointers against registries and collect missing references.

```ts
const blueprint = blueprintRegistry.get('core.app', '1.0.0');
const tenant = loadTenantConfigFromDB();

const composition = composeAppConfig(blueprint!, tenant, {
  capabilities,
  features,
  dataViews,
  workflows,
  jobs,
  policies,
  themes,
  telemetry,
  experiments,
});

if (composition.missing.length) {
  console.warn('Unresolved references', composition.missing);
}
```

### Static Validation

Use the validation helpers in `@contractspec/lib.contracts-spec/app-config/validation` before publish or promotion:

```ts
import {
  assertBlueprintValid,
  assertResolvedConfigValid,
  assertTenantConfigValid,
  validateBlueprint,
  validateConfig,
  validateResolvedConfig,
  validateTenantConfig,
} from '@contractspec/lib.contracts-spec/app-config/validation';

const blueprintReport = validateBlueprint(blueprint, context);
const tenantReport = validateTenantConfig(blueprint, tenant, context);
const publishReport = validateConfig(blueprint, tenant, context);
const resolvedReport = validateResolvedConfig(blueprint, resolved, context);

assertBlueprintValid(blueprint, context);
assertTenantConfigValid(blueprint, tenant, context);
assertResolvedConfigValid(blueprint, resolved, context);
```

- `ValidationResult` exposes `valid`, plus structured `errors`, `warnings`, and `info`.
- Core rules cover capability references, integration slot bindings, knowledge bindings, branding constraints, and translation coverage.
- Run `composeAppConfig(..., { strict: true })` and the validators in CI to catch drift early.

### CLI

```
contractspec create app-config
contractspec validate --blueprint packages/examples/integration-stripe/src/blueprint.ts
```

### Lifecycle Types and Events

To model multi-step configuration changes, import the lifecycle helpers from `@contractspec/lib.contracts-spec/app-config`:

```ts
import type {
  ConfigStatus,
  TenantAppConfigVersion,
  ConfigTransition,
} from '@contractspec/lib.contracts-spec/app-config';
import {
  ConfigDraftCreatedEvent,
  ConfigPromotedToPreviewEvent,
  ConfigPublishedEvent,
  ConfigRolledBackEvent,
} from '@contractspec/lib.contracts-spec/app-config';
```

- `ConfigStatus` enumerates the canonical states: `draft`, `preview`, `published`, `archived`, `superseded`.
- `TenantAppConfigMeta` includes lifecycle metadata such as `createdBy`, `publishedBy`, `publishedAt`, and rollback lineage.
- Lifecycle contract specs under `appConfig.lifecycle.*` expose typed commands and queries for create -> preview -> publish -> rollback flows.
