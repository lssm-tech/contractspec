import type { OwnerShipMeta } from '../ownership';
import type { CapabilityRef, CapabilityRequirement } from '../capabilities';
import type { ExperimentRef } from '../experiments/spec';
import type { ImplementationRef } from '../operations/';
import type { PresentationTarget } from '../presentations/presentations';
import type { VersionedSpecRef, SpecKeyRef } from '../versioning';
import type { PolicyRef } from '../policy/spec';
import type { TranslationRef } from '../translations/spec';

/** Minimal metadata to identify and categorize a feature module. */
export type FeatureModuleMeta = OwnerShipMeta;

// ── Versioned spec references ────────────────────────────────────────────────

/** Reference to an operation spec (key + version). */
export type OpRef = VersionedSpecRef;

/** Reference to an event spec (key + version). */
export type EventRef = VersionedSpecRef;

/** Reference to a presentation spec (key + version). */
export type PresentationRef = VersionedSpecRef;

/** Reference to a data view spec (key + version). */
export type DataViewRef = VersionedSpecRef;

/** Reference to a visualization spec (key + version). */
export type VisualizationRef = VersionedSpecRef;

/** Reference to a form spec (key + version). */
export type FormRef = VersionedSpecRef;

/** Reference to a workflow spec (key + version). */
export type WorkflowRef = VersionedSpecRef;

/** Reference to a knowledge space spec (key + version). */
export type KnowledgeRef = VersionedSpecRef;

/** Reference to a telemetry spec (key + version). */
export type TelemetryRef = VersionedSpecRef;

/** Reference to an integration spec (key + version). */
export type IntegrationRef = VersionedSpecRef;

/** Reference to a job spec (key + version). */
export type JobRef = VersionedSpecRef;

/** Reference to a DocBlock by its unique id. */
export type DocRef = string;

// Re-export imported refs for convenience
export type { PolicyRef, TranslationRef };

// ── Feature Module Spec ──────────────────────────────────────────────────────

/** Group operations/events/presentations into an installable feature. */
export interface FeatureModuleSpec {
  meta: FeatureModuleMeta;
  /** Contract operations included in this feature. */
  operations?: OpRef[];
  /** Events declared/emitted by this feature. */
  events?: EventRef[];
  /** Presentations associated to this feature. */
  presentations?: PresentationRef[];
  /** Experiments related to this feature. */
  experiments?: ExperimentRef[];
  /** Capability bindings exposed/required by this feature. */
  capabilities?: {
    provides?: CapabilityRef[];
    requires?: CapabilityRequirement[];
  };
  /** Optional: link ops to presentations for traceability (e.g., ui for op) */
  opToPresentation?: { op: OpRef; pres: PresentationRef }[];
  /** Optional: declare per-presentation target requirements (V2 descriptors) */
  presentationsTargets?: {
    /** Presentation key. */
    key: string;
    /** Presentation version. */
    version: string;
    /** Required targets that must be supported by the descriptor. */
    targets: PresentationTarget[];
  }[];

  /**
   * Explicit implementation file mappings for the entire feature module.
   * Used for tracking and verifying that this feature is correctly implemented.
   */
  implementations?: ImplementationRef[];

  /** Data views associated with this feature. */
  dataViews?: DataViewRef[];

  /** Visualizations associated with this feature. */
  visualizations?: VisualizationRef[];

  /** Forms associated with this feature. */
  forms?: FormRef[];

  /** Workflows orchestrated by this feature. */
  workflows?: WorkflowRef[];

  /** Knowledge spaces consumed/produced by this feature. */
  knowledge?: KnowledgeRef[];

  /** Telemetry spec grouping events tracked by this feature. */
  telemetry?: TelemetryRef[];

  /** Policies governing this feature. */
  policies?: PolicyRef[];

  /** Integration specs required by this feature. */
  integrations?: IntegrationRef[];

  /** Background jobs declared by this feature. */
  jobs?: JobRef[];

  /** Translation specs providing i18n messages for this feature. */
  translations?: TranslationRef[];

  /** DocBlock IDs documenting this feature. */
  docs?: DocRef[];
}

/**
 * Reference to a feature (unversioned).
 * Features are identified by key only, without version pinning.
 */
export type FeatureRef = SpecKeyRef;

/**
 * Helper to define a Feature.
 */
export const defineFeature = (spec: FeatureModuleSpec): FeatureModuleSpec =>
  spec;
