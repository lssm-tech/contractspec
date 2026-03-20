// Types

export { defineExample } from './define';
// Registry
export { ExampleRegistry } from './registry';

// Schema
export {
	ExampleDocumentationSchema,
	ExampleEntrypointsSchema,
	ExampleKindSchema,
	ExampleMetaSchema,
	ExampleSandboxModeSchema,
	ExampleSpecSchema,
	ExampleSurfacesSchema,
	ExampleVisibilitySchema,
	parseExampleDocumentation,
	parseExampleEntrypoints,
	parseExampleMeta,
	parseExampleSpec,
	parseExampleSurfaces,
	safeParseExampleSpec,
} from './schema';
export type {
	ExampleDocumentation,
	ExampleEntrypoints,
	ExampleKind,
	ExampleMcpSupport,
	ExampleMeta,
	ExampleSandboxMode,
	ExampleSandboxSupport,
	ExampleSpec,
	ExampleStudioSupport,
	ExampleSurfaces,
	ExampleVisibility,
} from './types';
export {
	ExampleKindEnum,
	ExampleSandboxModeEnum,
	ExampleVisibilityEnum,
	isExampleKind,
	isExampleVisibility,
	isFeatureRef,
	isSpecPointer,
} from './types';
// Validation
export type {
	CrossValidationContext,
	ExampleValidationError,
	ExampleValidationWarning,
	ValidateExampleResult,
	ValidateExamplesResult,
} from './validation';
export {
	validateExample,
	validateExampleReferences,
	validateExamples,
} from './validation';
