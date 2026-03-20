// Types

// Install
export { type InstallFeatureDeps, installFeature } from './install';

// Registry
export { FeatureRegistry } from './registry';
export type {
	DataViewRef,
	DocRef,
	EventRef,
	FeatureModuleMeta,
	FeatureModuleSpec,
	FeatureRef,
	FormRef,
	IntegrationRef,
	JobRef,
	KnowledgeRef,
	OpRef,
	PolicyRef,
	PresentationRef,
	TelemetryRef,
	TranslationRef,
	VisualizationRef,
	WorkflowRef,
} from './types';
// Helpers
export { defineFeature } from './types';
export {
	type BundleRequiresEntry,
	type ValidateBundleRequiresResult,
	validateBundleRequires,
} from './validate-bundle-requires';
// Validation
export { validateFeatureTargetsV2 } from './validation';
