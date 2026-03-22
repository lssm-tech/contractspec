import type { CapabilityRef, CapabilityRequirement } from '../capabilities';
/** Minimal metadata to identify and categorize a feature module. */
import type { DocBlock } from '../docs/types';
import type { ExperimentRef } from '../experiments/spec';
import type { ImplementationRef } from '../operations/';
import type { OwnerShipMeta } from '../ownership';
import type { PolicyRef } from '../policy/spec';
import type { PresentationTarget } from '../presentations/presentations';
import type { TranslationRef } from '../translations/spec';
import type { SpecKeyRef, VersionedSpecRef } from '../versioning';
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

export const tech_contracts_ops_to_presentation_linking_DocBlocks: DocBlock[] =
	[
		{
			id: 'docs.tech.contracts.ops-to-presentation-linking',
			title: 'Ops \u2194 Presentation linking (V2)',
			summary:
				'This document explains how operations (OperationSpec) are linked to Presentations (PresentationSpec) via Feature modules.',
			kind: 'reference',
			visibility: 'public',
			route: '/docs/tech/contracts/ops-to-presentation-linking',
			tags: ['tech', 'contracts', 'ops-to-presentation-linking'],
			body: "### Ops \u2194 Presentation linking (V2)\n\nThis document explains how operations (OperationSpec) are linked to Presentations (PresentationSpec) via Feature modules.\n\n- Location: `@contractspec/lib.contracts-spec/src/features.ts`\n- Field: `FeatureModuleSpec.opToPresentation?: { op: { name; version }; pres: { name; version } }[]`\n- Validation: `installFeature()` validates that linked ops exist in `OperationSpecRegistry` and linked presentations exist in the registry, and that declared targets are present.\n\nExample:\n\n```ts\nimport type { OperationSpecRegistry } from '@contractspec/lib.contracts-spec/src/registry';\nimport { FeatureRegistry, createFeatureModule } from '@contractspec/lib.contracts-spec';\n\nexport function buildFeaturesWithOps(ops: OperationSpecRegistry) {\n  const features = new FeatureRegistry();\n  features.register(\n    createFeatureModule(\n      {\n        key: 'myapp.widgets.linkage',\n        title: 'Widgets (linked)',\n        description: 'Links create/update ops to UI presentations',\n        domain: 'widgets',\n        tags: ['widgets', 'linkage'],\n        stability: 'beta',\n      },\n      {\n        operations: [\n          { name: 'widgets.create', version: '1.0.0' },\n          { name: 'widgets.update', version: '1.0.0' },\n        ],\n        presentations: [{ name: 'myapp.widgets.editor.page', version: '1.0.0' }],\n        opToPresentation: [\n          {\n            op: { name: 'widgets.create', version: '1.0.0' },\n            pres: { name: 'myapp.widgets.editor.page', version: '1.0.0' },\n          },\n          {\n            op: { name: 'widgets.update', version: '1.0.0' },\n            pres: { name: 'myapp.widgets.editor.page', version: '1.0.0' },\n          },\n        ],\n        presentationsTargets: [\n          {\n            name: 'myapp.widgets.editor.page',\n            version: '1.0.0',\n            targets: ['react', 'markdown'],\n          },\n        ],\n      }\n    )\n  );\n  return { features };\n}\n```\n\nNotes\n\n- This enables traceability: the UI flow that realizes an op is discoverable via the feature catalog.\n- Presentations can target multiple outputs (`react`, `markdown`, `application/json`, `application/xml`).\n- Use `renderFeaturePresentation()` to render a descriptor to a given target with a component map.\n",
		},
	];
