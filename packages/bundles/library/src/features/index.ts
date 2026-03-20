// Features

// Re-export types and utilities from lib.contracts
export type {
	EventRef,
	FeatureModuleMeta,
	FeatureModuleSpec,
	FeatureRef,
	OpRef,
	PresentationRef,
} from '@contractspec/lib.contracts-spec/features';
export { FeatureRegistry } from '@contractspec/lib.contracts-spec/features';
// Serialized spec types for client components
export type {
	SerializedDataViewSpec,
	SerializedEventSpec,
	SerializedFormSpec,
	SerializedOperationSpec,
	SerializedPresentationSpec,
	SerializedSchemaModel,
} from './contracts-registry';
// Contracts Registry (for resolving OpRef/EventRef/PresentationRef to full specs)
export {
	// DataViews
	createContractSpecDataViewRegistry,
	// Events
	createContractSpecEventRegistry,
	// Forms
	createContractSpecFormRegistry,
	// Operations
	createContractSpecOperationRegistry,
	// Presentations
	createContractSpecPresentationRegistry,
	getContractSpecDataViewRegistry,
	getContractSpecEventRegistry,
	getContractSpecFormRegistry,
	getContractSpecOperationRegistry,
	getContractSpecPresentationRegistry,
	// Reset all
	resetAllContractSpecRegistries,
	resetContractSpecDataViewRegistry,
	resetContractSpecEventRegistry,
	resetContractSpecFormRegistry,
	resetContractSpecOperationRegistry,
	resetContractSpecPresentationRegistry,
	resolveDataViewSpec,
	resolveEventSpec,
	resolveFormSpec,
	resolveOperationSpec,
	resolvePresentationSpec,
	resolveSerializedDataViewSpec,
	resolveSerializedEventSpec,
	resolveSerializedFormSpec,
	// Serialized spec resolution (for Server -> Client Component transfer)
	resolveSerializedOperationSpec,
	resolveSerializedPresentationSpec,
} from './contracts-registry';
export * from './docs';
export { DocsFeature } from './docs.feature';
export { MCPFeature } from './mcp.feature';
export { PresentationsFeature } from './presentations.feature';
// Feature Registry
export {
	createContractSpecFeatureRegistry,
	getContractSpecFeatureRegistry,
	resetContractSpecFeatureRegistry,
} from './registry';
