import type { OwnerShipMeta } from '../ownership';
import type { CapabilityRef, CapabilityRequirement } from '../capabilities';
import type { ExperimentRef } from '../experiments/spec';
import type { ImplementationRef } from '../operations/';
import type { PresentationTarget } from '../presentations/presentations';
import type { VersionedSpecRef, SpecKeyRef } from '../versioning';

/** Minimal metadata to identify and categorize a feature module. */
export type FeatureModuleMeta = OwnerShipMeta;

/**
 * Reference to an operation spec.
 * Uses key (OperationSpec.meta.key) and version (OperationSpec.meta.version).
 */
export type OpRef = VersionedSpecRef;

/**
 * Reference to an event spec.
 * Uses key (EventSpec.meta.key) and version (EventSpec.meta.version).
 */
export type EventRef = VersionedSpecRef;

/**
 * Reference to a presentation spec.
 * Uses key (PresentationSpec.meta.key) and version (PresentationSpec.meta.version).
 */
export type PresentationRef = VersionedSpecRef;

/**
 * Reference to a data view spec.
 * Uses key (DataViewSpec.meta.key) and version (DataViewSpec.meta.version).
 */
export type DataViewRef = VersionedSpecRef;

/**
 * Reference to a form spec.
 * Uses key (FormSpec.meta.key) and version (FormSpec.meta.version).
 */
export type FormRef = VersionedSpecRef;

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

  /** Forms associated with this feature. */
  forms?: FormRef[];
}

/**
 * Reference to a feature (unversioned).
 * Features are identified by key only, without version pinning.
 */
export type FeatureRef = SpecKeyRef;
