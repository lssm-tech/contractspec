import type { OwnerShipMeta } from '../ownership';
import type { CapabilityRef, CapabilityRequirement } from '../capabilities';
import type { ExperimentRef } from '../experiments/spec';
import type { ImplementationRef } from '../operations/';
import type { PresentationTarget } from '../presentations/presentations';

/** Minimal metadata to identify and categorize a feature module. */
export type FeatureModuleMeta = OwnerShipMeta;

export interface OpRef {
  /** Operation key (OperationSpec.meta.key). */
  key: string;
  /** Operation version (OperationSpec.meta.version). */
  version: number;
}

export interface EventRef {
  /** Event key. */
  key: string;
  /** Event version. */
  version: number;
}

export interface PresentationRef {
  /** Presentation key. */
  key: string;
  /** Presentation version. */
  version: number;
}

/**
 * Reference to a data view spec.
 */
export interface DataViewRef {
  key: string;
  version: number;
}

/**
 * Reference to a form spec.
 */
export interface FormRef {
  key: string;
  version: number;
}

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
    version: number;
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

export interface FeatureRef {
  key: string;
}
