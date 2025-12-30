import type { OwnerShipMeta } from '../ownership';
import type { EventKey } from '../events';

export type TelemetryPrivacyLevel = 'public' | 'internal' | 'pii' | 'sensitive';

export type TelemetryMeta = OwnerShipMeta;

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
  /** Name of the event (should match EventSpec.key for cross-reference). */
  key: string;
  /** Version of the underlying event. */
  version: string;
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

const telemetryKey = (meta: TelemetryMeta) => `${meta.key}.v${meta.version}`;

import { compareVersions } from 'compare-versions';
import { SpecContractRegistry } from '../registry';

// ...

export class TelemetryRegistry extends SpecContractRegistry<
  'telemetry',
  TelemetrySpec
> {
  private readonly eventsByKey = new Map<EventKey, TelemetryEventDef>();
  private readonly specByEventKey = new Map<EventKey, TelemetrySpec>();

  constructor(items?: TelemetrySpec[]) {
    super('telemetry', items);
    if (items) {
      items.forEach((spec) => this.indexEvents(spec));
    }
  }

  // Override register to index events
  register(spec: TelemetrySpec): this {
    super.register(spec);
    this.indexEvents(spec);
    return this;
  }

  private indexEvents(spec: TelemetrySpec) {
    for (const event of spec.events) {
      this.eventsByKey.set(`${event.key}.v${event.version}`, event);
      this.specByEventKey.set(`${event.key}.v${event.version}`, spec);
    }
  }

  findEventDef(name: string, version?: string): TelemetryEventDef | undefined {
    if (version != null) {
      return this.eventsByKey.get(`${name}.v${version}`);
    }
    let latest: TelemetryEventDef | undefined;
    for (const event of this.eventsByKey.values()) {
      if (event.key !== name) continue;
      if (!latest || compareVersions(event.version, latest.version) > 0) {
        latest = event;
      }
    }
    return latest;
  }

  getSpecForEvent(name: string, version: string): TelemetrySpec | undefined {
    return this.specByEventKey.get(`${name}.v${version}`);
  }
}

export function makeTelemetryKey(meta: TelemetryMeta) {
  return telemetryKey(meta);
}
