// Re-export types from @contractspec/lib.contracts for backward compatibility
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
} from '@contractspec/lib.contracts';

export {
  ExampleKindEnum,
  ExampleVisibilityEnum,
  ExampleSandboxModeEnum,
  isSpecPointer,
  isFeatureRef,
  isExampleKind,
  isExampleVisibility,
} from '@contractspec/lib.contracts';

// ─────────────────────────────────────────────────────────────────────────────
// Backward compatibility aliases
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @deprecated Use ExampleSpec from @contractspec/lib.contracts instead
 */
export type { ExampleSpec as ExampleDefinition } from '@contractspec/lib.contracts';

/**
 * @deprecated Use ExampleMeta.key from @contractspec/lib.contracts instead
 */
export type ExampleId = string;
