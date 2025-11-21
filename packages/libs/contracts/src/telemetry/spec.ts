import type { OwnerShipMeta } from '../ownership';
import type { EventKey } from '../events';

export type TelemetryPrivacyLevel = 'public' | 'internal' | 'pii' | 'sensitive';

export interface TelemetryMeta extends OwnerShipMeta {
  /** Fully-qualified telemetry spec name (e.g., "sigil.core"). */
  name: string;
  /** Incremented when telemetry definitions change in a breaking way. */
  version: number;
  /** Optional domain or bounded-context hint (e.g., "onboarding"). */
  domain: string;
}

export interface TelemetryPropertyDef {
  type: 'string' | 'number' | 'boolean' | 'timestamp' | 'json';
  required?: boolean;
  pii?: boolean;
  redact?: boolean;
  description?: string;
}

export interface TelemetryAnomalyThreshold {
  metric: string;
  min?: number;
  max?: number;
}

export type TelemetryAnomalyAction = 'alert' | 'log' | 'trigger_regen';

export interface TelemetryAnomalyDetectionConfig {
  enabled: boolean;
  thresholds?: TelemetryAnomalyThreshold[];
  actions?: TelemetryAnomalyAction[];
  /**
   * Minimum sample size before evaluating thresholds.
   * Helps avoid false positives on small sample sizes.
   */
  minimumSample?: number;
}

export interface TelemetrySamplingConfig {
  rate: number;
  conditions?: string[];
}

export interface TelemetryRetentionConfig {
  days: number;
  policy?: 'archive' | 'delete';
}

export interface TelemetryEventDef {
  /** Name of the event (should match EventSpec.name for cross-reference). */
  name: string;
  /** Version of the underlying event. */
  version: number;
  /** High-level semantics for docs/analyzers. */
  semantics: {
    who?: string;
    what: string;
    why?: string;
  };
  /** Detailed property metadata keyed by property name. */
  properties: Record<string, TelemetryPropertyDef>;
  /** Privacy level for the entire event. */
  privacy: TelemetryPrivacyLevel;
  /** Retention policy overrides. */
  retention?: TelemetryRetentionConfig;
  /** Sampling rules, defaulting to spec.config defaults. */
  sampling?: TelemetrySamplingConfig;
  /** Anomaly detection overrides. */
  anomalyDetection?: TelemetryAnomalyDetectionConfig;
  /** Optional tags for analytics/AI hints. */
  tags?: string[];
}

export interface TelemetryProviderConfig {
  type: 'posthog' | 'segment' | 'opentelemetry' | 'internal';
  config: Record<string, unknown>;
}

export interface TelemetryConfig {
  defaultRetentionDays?: number;
  defaultSamplingRate?: number;
  providers?: TelemetryProviderConfig[];
  anomalyDetection?: {
    enabled: boolean;
    checkIntervalMs?: number;
  };
}

export interface TelemetrySpec {
  meta: TelemetryMeta;
  events: TelemetryEventDef[];
  config?: TelemetryConfig;
}

const telemetryKey = (meta: TelemetryMeta) => `${meta.name}.v${meta.version}`;

export class TelemetryRegistry {
  private readonly items = new Map<string, TelemetrySpec>();
  private readonly eventsByKey = new Map<EventKey, TelemetryEventDef>();
  private readonly specByEventKey = new Map<EventKey, TelemetrySpec>();

  register(spec: TelemetrySpec): this {
    const key = telemetryKey(spec.meta);
    if (this.items.has(key)) {
      throw new Error(`Duplicate TelemetrySpec registration for ${key}`);
    }
    this.items.set(key, spec);
    for (const event of spec.events) {
      this.eventsByKey.set(`${event.name}.v${event.version}`, event);
      this.specByEventKey.set(`${event.name}.v${event.version}`, spec);
    }
    return this;
  }

  list(): TelemetrySpec[] {
    return [...this.items.values()];
  }

  get(name: string, version?: number): TelemetrySpec | undefined {
    if (version != null) {
      return this.items.get(`${name}.v${version}`);
    }
    let latest: TelemetrySpec | undefined;
    let maxVersion = -Infinity;
    for (const item of this.items.values()) {
      if (item.meta.name !== name) continue;
      if (item.meta.version > maxVersion) {
        maxVersion = item.meta.version;
        latest = item;
      }
    }
    return latest;
  }

  findEventDef(name: string, version?: number): TelemetryEventDef | undefined {
    if (version != null) {
      return this.eventsByKey.get(`${name}.v${version}`);
    }
    let latest: TelemetryEventDef | undefined;
    let maxVersion = -Infinity;
    for (const [key, event] of this.eventsByKey.entries()) {
      const [eventName, versionPart] = key.split('.v');
      if (eventName !== name) continue;
      const ver = Number(versionPart);
      if (Number.isFinite(ver) && ver > maxVersion) {
        maxVersion = ver;
        latest = event;
      }
    }
    return latest;
  }

  getSpecForEvent(name: string, version?: number): TelemetrySpec | undefined {
    if (version != null) {
      return this.specByEventKey.get(`${name}.v${version}`);
    }
    let latest: TelemetrySpec | undefined;
    let maxVersion = -Infinity;
    for (const [key, spec] of this.specByEventKey.entries()) {
      const [eventName, versionPart] = key.split('.v');
      if (eventName !== name) continue;
      const ver = Number(versionPart);
      if (Number.isFinite(ver) && ver > maxVersion) {
        maxVersion = ver;
        latest = spec;
      }
    }
    return latest;
  }
}

export function makeTelemetryKey(meta: TelemetryMeta) {
  return telemetryKey(meta);
}
