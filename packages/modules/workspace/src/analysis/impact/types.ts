/**
 * Impact classification types.
 *
 * Types for classifying contract changes as breaking or non-breaking.
 */

/** Impact severity levels */
export type ImpactSeverity = 'breaking' | 'non_breaking' | 'info';

/** Status of impact detection */
export type ImpactStatus = 'no-impact' | 'non-breaking' | 'breaking';

/** A single classified change delta */
export interface ImpactDelta {
  /** Key of the affected spec */
  specKey: string;
  /** Version of the affected spec */
  specVersion: number;
  /** Type of the spec (operation, event) */
  specType: 'operation' | 'event';
  /** Path to the changed element */
  path: string;
  /** Severity classification */
  severity: ImpactSeverity;
  /** Rule that triggered this classification */
  rule: string;
  /** Human-readable description */
  description: string;
  /** Previous value (if applicable) */
  oldValue?: unknown;
  /** New value (if applicable) */
  newValue?: unknown;
}

/** Summary counts for impact result */
export interface ImpactSummary {
  breaking: number;
  nonBreaking: number;
  info: number;
  added: number;
  removed: number;
}

/** Full impact detection result */
export interface ImpactResult {
  /** Overall status */
  status: ImpactStatus;
  /** Whether any breaking changes were detected */
  hasBreaking: boolean;
  /** Whether any non-breaking changes were detected */
  hasNonBreaking: boolean;
  /** Summary counts */
  summary: ImpactSummary;
  /** All classified deltas */
  deltas: ImpactDelta[];
  /** Specs that were added */
  addedSpecs: { key: string; version: number; type: 'operation' | 'event' }[];
  /** Specs that were removed */
  removedSpecs: {
    key: string;
    version: number;
    type: 'operation' | 'event';
  }[];
  /** Base commit/ref */
  baseRef?: string;
  /** Head commit/ref */
  headRef?: string;
  /** Detection timestamp */
  timestamp: string;
}

/** Options for impact classification */
export interface ClassifyOptions {
  /** Custom rules to apply */
  customRules?: ImpactRule[];
  /** Treat added required fields as info instead of breaking */
  lenientAddedRequired?: boolean;
}

/** A classification rule */
export interface ImpactRule {
  /** Unique rule ID */
  id: string;
  /** Rule description */
  description: string;
  /** Severity when rule matches */
  severity: ImpactSeverity;
  /** Matcher function */
  matches: (delta: {
    path: string;
    description: string;
    type: string;
  }) => boolean;
}
