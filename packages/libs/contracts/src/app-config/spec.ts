import type { OwnerShipMeta } from '../ownership';
import type { CapabilityRef } from '../capabilities';
import type { FeatureRef } from '../features';
import type { PolicyRef } from '../policy/spec';
import type { ThemeRef } from '../themes';
import type { ExperimentRef } from '../experiments/spec';
import type {
  IntegrationCategory,
  IntegrationOwnershipMode,
} from '../integrations/spec';
import type { AppIntegrationBinding } from '../integrations/binding';
import type { AppKnowledgeBinding } from '../knowledge/binding';
import type { BrandingDefaults, TenantBrandingConfig } from './branding';
import type { Locale, TranslationEntry } from '../translations/catalog';
import type { ConfigStatus } from './lifecycle';

export interface SpecPointer {
  key: string;
  version?: number;
}

export interface AppRouteConfig {
  path: string;
  label?: string;
  dataView?: string;
  workflow?: string;
  guard?: PolicyRef;
  featureFlag?: string;
  experiment?: ExperimentRef;
}

export interface TranslationCatalogPointer {
  key: string;
  version: number;
}

export interface AppIntegrationSlot {
  /** Slot identifier unique within the blueprint (e.g., "primaryPayments"). */
  slotId: string;
  /** Integration category required to satisfy this slot. */
  requiredCategory: IntegrationCategory;
  /** Ownership modes allowed for this slot (defaults to any supported mode). */
  allowedModes?: IntegrationOwnershipMode[];
  /** Capabilities that must be provided by the integration spec. */
  requiredCapabilities?: CapabilityRef[];
  /** Whether this slot must be satisfied for the app to function. */
  required?: boolean;
  /** Description for App Studio UX. */
  description?: string;
}

export interface FeatureFlagState {
  key: string;
  enabled: boolean;
  variant?: string;
  description?: string;
}

export interface TelemetryBinding {
  spec?: SpecPointer;
  disabledEvents?: string[];
  samplingOverrides?: Record<string, number>;
}

export interface AppThemeBinding {
  primary: ThemeRef;
  fallbacks?: ThemeRef[];
}

export interface AppBlueprintMeta extends OwnerShipMeta {
  /** Logical application id (e.g. "artisan"). */
  appId: string;
}

export interface AppBlueprintSpec {
  meta: AppBlueprintMeta;
  capabilities?: {
    enabled?: CapabilityRef[];
    disabled?: CapabilityRef[];
  };
  features?: {
    include?: FeatureRef[];
    exclude?: FeatureRef[];
  };
  integrationSlots?: AppIntegrationSlot[];
  branding?: BrandingDefaults;
  translationCatalog?: TranslationCatalogPointer;
  dataViews?: Record<string, SpecPointer>;
  workflows?: Record<string, SpecPointer>;
  policies?: PolicyRef[];
  theme?: AppThemeBinding;
  telemetry?: TelemetryBinding;
  experiments?: {
    active?: ExperimentRef[];
    paused?: ExperimentRef[];
  };
  featureFlags?: FeatureFlagState[];
  routes?: AppRouteConfig[];
  notes?: string;
}

const blueprintKey = (meta: Pick<AppBlueprintMeta, 'key' | 'version'>) =>
  `${meta.key}.v${meta.version}`;

export class AppBlueprintRegistry {
  private readonly items = new Map<string, AppBlueprintSpec>();

  register(spec: AppBlueprintSpec): this {
    const key = blueprintKey(spec.meta);
    if (this.items.has(key)) {
      throw new Error(`Duplicate AppBlueprint ${key}`);
    }
    this.items.set(key, spec);
    return this;
  }

  list(): AppBlueprintSpec[] {
    return [...this.items.values()];
  }

  get(key: string, version?: number): AppBlueprintSpec | undefined {
    if (version != null) {
      return this.items.get(blueprintKey({ key, version }));
    }
    let latest: AppBlueprintSpec | undefined;
    let maxVersion = -Infinity;
    for (const spec of this.items.values()) {
      if (spec.meta.key !== key) continue;
      if (spec.meta.version > maxVersion) {
        maxVersion = spec.meta.version;
        latest = spec;
      }
    }
    return latest;
  }
}

export function makeAppBlueprintKey(meta: AppBlueprintMeta) {
  return blueprintKey(meta);
}

export interface TenantAppConfigMeta {
  id: string;
  tenantId: string;
  appId: string;
  blueprintName: string;
  blueprintVersion: number;
  environment?: string;
  /** Monotonic version for auditing changes to the tenant config. */
  version: number;
  status: ConfigStatus;
  createdBy?: string;
  publishedBy?: string;
  publishedAt?: string | Date;
  rolledBackFrom?: number;
  rolledBackTo?: number;
  changeSummary?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface TenantSpecOverride {
  slot: string;
  pointer?: SpecPointer | null;
}

export interface TenantRouteOverride {
  path: string;
  label?: string | null;
  dataView?: string | null;
  workflow?: string | null;
  guard?: PolicyRef | null;
  featureFlag?: string | null;
  experiment?: ExperimentRef | null;
}

export interface TenantAppConfig {
  meta: TenantAppConfigMeta;
  capabilities?: {
    enable?: CapabilityRef[];
    disable?: CapabilityRef[];
  };
  features?: {
    include?: FeatureRef[];
    exclude?: FeatureRef[];
  };
  dataViewOverrides?: TenantSpecOverride[];
  workflowOverrides?: TenantSpecOverride[];
  additionalPolicies?: PolicyRef[];
  themeOverride?: {
    primary?: ThemeRef | null;
    fallbacks?: ThemeRef[];
  };
  telemetryOverride?: {
    spec?: SpecPointer | null;
    disabledEvents?: string[];
    samplingOverrides?: Record<string, number>;
  };
  experiments?: {
    active?: ExperimentRef[];
    paused?: ExperimentRef[];
  };
  featureFlags?: FeatureFlagState[];
  routeOverrides?: TenantRouteOverride[];
  integrations?: AppIntegrationBinding[];
  knowledge?: AppKnowledgeBinding[];
  locales?: {
    defaultLocale: Locale;
    enabledLocales: Locale[];
  };
  translationOverrides?: {
    entries?: TranslationEntry[];
  };
  branding?: TenantBrandingConfig;
  notes?: string;
}
