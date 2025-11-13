import type { OwnerShipMeta } from '../ownership';
import type { CapabilityRef } from '../capabilities';
import type { FeatureRef } from '../features';
import type { PolicyRef } from '../policy/spec';
import type { ThemeRef } from '../themes';
import type { ExperimentRef } from '../experiments/spec';

export interface SpecPointer {
  name: string;
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

export interface AppConfigMeta extends OwnerShipMeta {
  /** Fully qualified config name (e.g. "tenantA.artisan.app"). */
  name: string;
  /** Version of this configuration. Increment on breaking changes. */
  version: number;
  /** Logical application id (e.g. "artisan"). */
  appId: string;
  /** Optional tenant/customer identifier. */
  tenantId?: string;
  /** Optional environment label (e.g. "production"). */
  environment?: string;
}

export interface AppConfigSpec {
  meta: AppConfigMeta;
  capabilities?: {
    enabled?: CapabilityRef[];
    disabled?: CapabilityRef[];
  };
  features?: {
    include?: FeatureRef[];
    exclude?: FeatureRef[];
  };
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

const configKey = (meta: Pick<AppConfigMeta, 'name' | 'version'>) =>
  `${meta.name}.v${meta.version}`;

export class AppConfigRegistry {
  private readonly items = new Map<string, AppConfigSpec>();

  register(spec: AppConfigSpec): this {
    const key = configKey(spec.meta);
    if (this.items.has(key)) {
      throw new Error(`Duplicate AppConfig ${key}`);
    }
    this.items.set(key, spec);
    return this;
  }

  list(): AppConfigSpec[] {
    return [...this.items.values()];
  }

  get(name: string, version?: number): AppConfigSpec | undefined {
    if (version != null) {
      return this.items.get(configKey({ name, version }));
    }
    let latest: AppConfigSpec | undefined;
    let maxVersion = -Infinity;
    for (const spec of this.items.values()) {
      if (spec.meta.name !== name) continue;
      if (spec.meta.version > maxVersion) {
        maxVersion = spec.meta.version;
        latest = spec;
      }
    }
    return latest;
  }
}

export function makeAppConfigKey(meta: AppConfigMeta) {
  return configKey(meta);
}

