import type { OwnerShipMeta } from '../ownership';
import type { PolicyRef } from '../policy/spec';
import { SpecContractRegistry } from '../registry';
import type { TelemetryEventDef } from '../telemetry/spec';
import type { OptionalVersionedSpecRef } from '../versioning';

/** Metadata for an experiment spec. */
export type ExperimentMeta = OwnerShipMeta;

/**
 * Reference to an experiment spec.
 * Version is optional; when omitted, refers to the latest version.
 */
export type ExperimentRef = OptionalVersionedSpecRef;

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
  version?: string;
  /** Optional configuration applied when this variant is active. */
  config?: Record<string, unknown>;
}

export interface ExperimentVariant {
  id: string;
  key: string;
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
  key: string;
  telemetryEvent: { key: TelemetryEventDef['key']; version: string };
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

const experimentKey = (meta: ExperimentMeta) => `${meta.key}.v${meta.version}`;

export class ExperimentRegistry extends SpecContractRegistry<
  'experiment',
  ExperimentSpec
> {
  public constructor(items?: ExperimentSpec[]) {
    super('experiment', items);
  }
}

export function makeExperimentKey(meta: ExperimentMeta) {
  return experimentKey(meta);
}
