import type { OwnerShipMeta } from '../ownership';
import type { PolicyRef } from '../policy/spec';
import type { TelemetryEventDef } from '../telemetry/spec';

export type ExperimentMeta = OwnerShipMeta

export interface ExperimentRef {
  name: string;
  version?: number;
}

export type ExperimentOverrideType =
  | 'dataView'
  | 'workflow'
  | 'theme'
  | 'policy'
  | 'presentation';

export interface ExperimentOverride {
  type: ExperimentOverrideType;
  /** Target spec meta name (e.g., DataViewspec.meta.key). */
  target: string;
  /** Target version. Optional; evaluator may choose latest when omitted. */
  version?: number;
  /** Optional configuration applied when this variant is active. */
  config?: Record<string, unknown>;
}

export interface ExperimentVariant {
  id: string;
  name: string;
  description?: string;
  /** Relative weight for random allocation (defaults to 1). */
  weight?: number;
  overrides?: ExperimentOverride[];
  /** Optional metadata for downstream analytics/UI. */
  metadata?: Record<string, unknown>;
}

export interface TargetingRule {
  /** Variant to assign when rule matches. */
  variantId: string;
  /** Optional percentage of matching traffic (0-1). If omitted, 100%. */
  percentage?: number;
  /** Policies that must allow the assignment. */
  policy?: PolicyRef;
  /** Expression evaluated against context (see evaluator for details). */
  expression?: string;
}

export type AllocationStrategy =
  | {
      type: 'random';
      /** Optional salt for deterministic hashing. */
      salt?: string;
    }
  | {
      type: 'sticky';
      /** Which attribute to hash for sticky assignment. */
      attribute: 'userId' | 'organizationId' | 'sessionId';
      salt?: string;
    }
  | {
      type: 'targeted';
      rules: TargetingRule[];
      fallback?: 'control' | 'random';
    };

export type MetricAggregation = 'count' | 'avg' | 'p75' | 'p90' | 'p95' | 'p99';

export interface SuccessMetric {
  name: string;
  telemetryEvent: { name: TelemetryEventDef['name']; version: number };
  aggregation: MetricAggregation;
  target?: number;
}

export interface ExperimentSpec {
  meta: ExperimentMeta;
  /** Identifier of the control variant (must exist in variants array). */
  controlVariant: string;
  variants: ExperimentVariant[];
  allocation: AllocationStrategy;
  successMetrics?: SuccessMetric[];
  tags?: string[];
}

const experimentKey = (meta: ExperimentMeta) => `${meta.name}.v${meta.version}`;

export class ExperimentRegistry {
  private readonly items = new Map<string, ExperimentSpec>();

  register(spec: ExperimentSpec): this {
    const key = experimentKey(spec.meta);
    if (this.items.has(key)) {
      throw new Error(`Duplicate experiment ${key}`);
    }
    this.items.set(key, spec);
    return this;
  }

  list(): ExperimentSpec[] {
    return [...this.items.values()];
  }

  get(name: string, version?: number): ExperimentSpec | undefined {
    if (version != null) {
      return this.items.get(`${name}.v${version}`);
    }
    let latest: ExperimentSpec | undefined;
    let maxVersion = -Infinity;
    for (const spec of this.items.values()) {
      if (spec.meta.key !== name) continue;
      if (spec.meta.version > maxVersion) {
        maxVersion = spec.meta.version;
        latest = spec;
      }
    }
    return latest;
  }
}

export function makeExperimentKey(meta: ExperimentMeta) {
  return experimentKey(meta);
}
