## App Configuration Layers

App orchestration is split into three explicit layers:

1. **AppBlueprintSpec** – global, versioned description of what an app can look like. Stored in Git, no tenant/environment data.
2. **TenantAppConfig** – tenant/environment overrides that the future Studio edits. Stored per tenant (DB/contract), mutable at runtime.
3. **ResolvedAppConfig** – pure, merged view consumed by the runtime. Derived in-memory from a blueprint + tenant config.

- Types & registry: `packages/libs/contracts/src/app-config/spec.ts`
- Resolution helpers: `packages/libs/contracts/src/app-config/runtime.ts`
- CLI wizard (blueprint scaffolding): `contractspec create app-config`

### 1. AppBlueprintSpec

```ts
export interface AppBlueprintSpec {
  meta: AppBlueprintMeta;          // { name, version, appId, ownership }
  capabilities?: { enabled?: CapabilityRef[]; disabled?: CapabilityRef[] };
  features?: { include?: FeatureRef[]; exclude?: FeatureRef[] };
  integrationSlots?: AppIntegrationSlot[];
  branding?: BrandingDefaults;
  dataViews?: Record<string, SpecPointer>;
  workflows?: Record<string, SpecPointer>;
  policies?: PolicyRef[];
  theme?: AppThemeBinding;
  telemetry?: TelemetryBinding;
  experiments?: { active?: ExperimentRef[]; paused?: ExperimentRef[] };
  featureFlags?: FeatureFlagState[];
  routes?: AppRouteConfig[];
  notes?: string;
}
```

Register blueprints with `AppBlueprintRegistry`. Blueprints only capture the default/global experience.

- **Integration slots** declare the categories and capability requirements an app expects (e.g. `"primary-payments"` must be a payments provider that supports managed or BYOK credentials). Slots never include secrets; tenants bind concrete connections later.
- **Branding defaults** provide message-key based names, placeholder assets, and theme token references that downstream tenants can override.

### 2. TenantAppConfig

```ts
export interface TenantAppConfig {
  meta: TenantAppConfigMeta;  // { id, tenantId, appId, blueprintName/version, environment?, version, timestamps }
  capabilities?: { enable?: CapabilityRef[]; disable?: CapabilityRef[] };
  features?: { include?: FeatureRef[]; exclude?: FeatureRef[] };
  dataViewOverrides?: TenantSpecOverride[];
  workflowOverrides?: TenantSpecOverride[];
  additionalPolicies?: PolicyRef[];
  themeOverride?: { primary?: ThemeRef | null; fallbacks?: ThemeRef[] };
  telemetryOverride?: { spec?: SpecPointer | null; disabledEvents?: string[] };
  experiments?: { active?: ExperimentRef[]; paused?: ExperimentRef[] };
  featureFlags?: FeatureFlagState[];
  routeOverrides?: TenantRouteOverride[];
  integrations?: AppIntegrationBinding[];
  knowledge?: AppKnowledgeBinding[];
  branding?: TenantBrandingConfig;
  notes?: string;
}
```

This object represents what a tenant edits via the Studio (stored in DB/contracts later).

- **AppIntegrationBinding** now maps `slotId` → `connectionId` (plus optional workflow scopes). It no longer carries capability lists; those are defined once in the slot.
- **TenantBrandingConfig** allows per-tenant names, assets, and domain overrides while keeping secrets and large files out of blueprints.

### 3. ResolvedAppConfig

```ts
export interface ResolvedAppConfig {
  appId: string;
  tenantId: string;
  environment?: string;
  blueprintName: string;
  blueprintVersion: number;
  configVersion: number;
  capabilities: { enabled: CapabilityRef[]; disabled: CapabilityRef[] };
  features: { include: FeatureRef[]; exclude: FeatureRef[] };
  dataViews: Record<string, SpecPointer>;
  workflows: Record<string, SpecPointer>;
  policies: PolicyRef[];
  theme?: AppThemeBinding;
  telemetry?: TelemetryBinding;
  experiments: { catalog: ExperimentRef[]; active: ExperimentRef[]; paused: ExperimentRef[] };
  featureFlags: FeatureFlagState[];
  routes: AppRouteConfig[];
  integrations: ResolvedIntegration[];
  knowledge: ResolvedKnowledge[];
  branding: ResolvedBranding;
  notes?: string;
}
```

Use `resolveAppConfig(blueprint, tenant)` to produce this merged view. No IO, no registry lookups—pure data merge.

- `resolveAppConfig` validates slot/category/mode constraints when `integrationConnections` and `integrationSpecs` are provided.
- `branding` merges blueprint defaults with tenant overrides, producing a runtime-friendly shape (resolved asset URLs, color values, and effective domain).

### Materializing specs

`composeAppConfig(blueprint, tenant, registries, { strict })`:

1. Calls `resolveAppConfig` to build the merged pointers.
2. Looks up referenced specs in the provided registries.
3. Returns:
   - `resolved` – the merged pointer view
   - `capabilities`, `features`, `dataViews`, `workflows`, `policies`, `theme`, `telemetry`, `experiments`
   - `missing` – unresolved references (strict mode throws).

```ts
const blueprint = blueprintRegistry.get('core.app', 1)!;
const tenant = loadTenantConfigFromDB();

const composition = composeAppConfig(blueprint, tenant, {
  capabilities,
  features,
  dataViews,
  workflows,
  policies,
  themes,
  telemetry,
  experiments,
});

if (composition.missing.length) {
  console.warn('Unresolved references', composition.missing);
}
```

### CLI workflow

```
contractspec create app-config
```

Generates an `AppBlueprintSpec`. A separate flow will later scaffold tenant configs.

### Best practices

1. Keep blueprint and tenant versions monotonic; bump when referenced spec versions change.
2. Favor stable slot keys (e.g. `dataViews.dashboard`) to align with Studio UX.
3. Reference telemetry and experiments declared in their respective specs to maintain observability.
4. Run `resolveAppConfig` in pure unit tests and `composeAppConfig(..., { strict: true })` in CI to catch drift early.
5. Pair resolved configs with `TestSpec` scenarios to guard tenant experiences end-to-end.

### Static validation

Use the validation helpers in `@lssm/lib.contracts/app-config/validation` to keep blueprints and tenant configs safe before publish time.

```ts
import {
  validateConfig,
  validateBlueprint,
  validateTenantConfig,
  validateResolvedConfig,
} from '@lssm/lib.contracts/app-config/validation';

const context = {
  integrationSpecs,
  tenantConnections,
  knowledgeSpaces,
  knowledgeSources,
  translationCatalogs: {
    blueprint: blueprintCatalog,
    platform: platformCatalog,
  },
  existingConfigs,
};

const blueprintReport = validateBlueprint(blueprint, context);
const tenantReport = validateTenantConfig(blueprint, tenant, context);
const publishReport = validateConfig(blueprint, tenant, context);
```

- `ValidationResult` exposes `valid`, plus structured `errors`, `warnings`, and `info`.
- Core rules cover capability references, integration slot bindings (category/ownership/capabilities), knowledge bindings, branding constraints (domains + assets), and translation coverage.
- Call `validateBlueprint` in CI when committing new specs, and `validateConfig` before promoting/publishing a tenant config.
- `validateResolvedConfig` can be used as a runtime pre-flight check when composing full configs for workflows.
- CLI usage example (blueprint + tenant):

```
pnpm contractspec validate \
  packages/examples/integration-stripe/blueprint.ts \
  --blueprint packages/examples/integration-stripe/blueprint.ts \
  --tenant-config packages/examples/integration-stripe/tenant.ts
```
- Repository script:

```
bun run validate:blueprints
```

Runs the static validator for the sample blueprints/tenants and is wired into CI.


### Lifecycle types & events

To model multi-step configuration changes, use the lifecycle helpers exported from `@lssm/lib.contracts/app-config`:

```ts
import type {
  ConfigStatus,
  TenantAppConfigVersion,
  ConfigTransition,
} from '@lssm/lib.contracts/app-config';
import {
  ConfigDraftCreatedEvent,
  ConfigPromotedToPreviewEvent,
  ConfigPublishedEvent,
  ConfigRolledBackEvent,
} from '@lssm/lib.contracts/app-config';
```

- `ConfigStatus` enumerates the canonical states: `draft`, `preview`, `published`, `archived`, `superseded`.
- `TenantAppConfigMeta` now includes lifecycle metadata (`status`, `createdBy`, `publishedBy`, `publishedAt`, `rolledBackFrom`, `rolledBackTo`, `changeSummary`).
- `TenantAppConfigVersion` couples the lifecycle-aware metadata with the `TenantAppConfig` payload for history views.
- `ConfigTransition` captures state changes with actor, timestamp, and optional reason.
- Lifecycle events (`app_config.draft_created`, `app_config.promoted_to_preview`, `app_config.published`, `app_config.rolled_back`) standardize observability across services.
- Lifecycle contract specs (`appConfig.lifecycle.*`) expose typed commands/queries for create → preview → publish → rollback flows.

