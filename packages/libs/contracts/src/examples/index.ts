// Types
export type {
  ExampleKind,
  ExampleVisibility,
  ExampleSandboxMode,
  ExampleDocumentation,
  ExampleSandboxSupport,
  ExampleStudioSupport,
  ExampleMcpSupport,
  ExampleSurfaces,
  ExampleEntrypoints,
  ExampleMeta,
  ExampleSpec,
} from './types';

export {
  ExampleKindEnum,
  ExampleVisibilityEnum,
  ExampleSandboxModeEnum,
  isSpecPointer,
  isFeatureRef,
  isExampleKind,
  isExampleVisibility,
} from './types';

// Schema
export {
  ExampleKindSchema,
  ExampleVisibilitySchema,
  ExampleSandboxModeSchema,
  ExampleDocumentationSchema,
  ExampleSurfacesSchema,
  ExampleEntrypointsSchema,
  ExampleMetaSchema,
  ExampleSpecSchema,
  parseExampleSpec,
  safeParseExampleSpec,
  parseExampleMeta,
  parseExampleSurfaces,
  parseExampleEntrypoints,
  parseExampleDocumentation,
} from './schema';

// Registry
export { ExampleRegistry } from './registry';

// Validation
export type {
  ExampleValidationError,
  ExampleValidationWarning,
  ValidateExamplesResult,
  ValidateExampleResult,
  CrossValidationContext,
} from './validation';

export {
  validateExample,
  validateExamples,
  validateExampleReferences,
} from './validation';

import type { ExampleSpec } from './types';

/**
 * Helper to define an Example.
 */
export const defineExample = (spec: ExampleSpec): ExampleSpec => spec;
