import type { OwnerShipMeta } from '../ownership';
import type { AppBlueprintSpec, SpecPointer } from '../app-config/spec';
import type { FeatureModuleSpec, FeatureRef } from '../features';

// ─────────────────────────────────────────────────────────────────────────────
// Enums and Constants
// ─────────────────────────────────────────────────────────────────────────────

/** Kind of example - determines how it's presented in catalogs */
export type ExampleKind =
  | 'template' // Full application template
  | 'workflow' // Workflow automation example
  | 'integration' // Integration showcase
  | 'knowledge' // Knowledge base example
  | 'blueprint' // App blueprint example
  | 'ui' // UI component showcase
  | 'script' // CLI/script example
  | 'library'; // Library/SDK example

export const ExampleKindEnum = {
  Template: 'template',
  Workflow: 'workflow',
  Integration: 'integration',
  Knowledge: 'knowledge',
  Blueprint: 'blueprint',
  UI: 'ui',
  Script: 'script',
  Library: 'library',
} as const;

/** Visibility level for examples */
export type ExampleVisibility = 'public' | 'internal' | 'experimental';

export const ExampleVisibilityEnum = {
  Public: 'public',
  Internal: 'internal',
  Experimental: 'experimental',
} as const;

/** Sandbox modes supported by examples */
export type ExampleSandboxMode =
  | 'playground' // Interactive code editor
  | 'specs' // Spec viewer
  | 'builder' // Visual builder
  | 'markdown' // Markdown preview
  | 'evolution'; // AI evolution mode

export const ExampleSandboxModeEnum = {
  Playground: 'playground',
  Specs: 'specs',
  Builder: 'builder',
  Markdown: 'markdown',
  Evolution: 'evolution',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Documentation References
// ─────────────────────────────────────────────────────────────────────────────

/** Documentation references for the example */
export interface ExampleDocumentation {
  /** Root documentation block ID */
  rootDocId?: string;
  /** Goal/purpose documentation */
  goalDocId?: string;
  /** Usage/quickstart documentation */
  usageDocId?: string;
  /** API/reference documentation */
  referenceDocId?: string;
  /** Constraints/limitations documentation */
  constraintsDocId?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Surface Support
// ─────────────────────────────────────────────────────────────────────────────

/** Surface support configuration for sandbox */
export interface ExampleSandboxSupport {
  enabled: boolean;
  modes: readonly ExampleSandboxMode[];
}

/** Surface support configuration for Studio */
export interface ExampleStudioSupport {
  enabled: boolean;
  /** If true, Studio can create a real project from this example via API. */
  installable: boolean;
}

/** Surface support configuration for MCP */
export interface ExampleMcpSupport {
  enabled: boolean;
}

/** Surface support configuration - where the example can be used */
export interface ExampleSurfaces {
  /** Available as a template for new projects */
  templates: boolean;
  /** Sandbox/playground support */
  sandbox: ExampleSandboxSupport;
  /** ContractSpec Studio support */
  studio: ExampleStudioSupport;
  /** MCP (Model Context Protocol) support */
  mcp: ExampleMcpSupport;
}

// ─────────────────────────────────────────────────────────────────────────────
// Entrypoints
// ─────────────────────────────────────────────────────────────────────────────

/** Package entrypoints for the example - maps to package.json exports */
export interface ExampleEntrypoints {
  /** Package name in the workspace (e.g., @contractspec/example.saas-boilerplate) */
  packageName: string;
  /** Feature module entrypoint (e.g., ./saas-boilerplate.feature) */
  feature?: string;
  /** Blueprint entrypoint (e.g., ./blueprint) */
  blueprint?: string;
  /** Presentations entrypoint (e.g., ./presentations) */
  presentations?: string;
  /** Contracts/operations entrypoint (e.g., ./contracts) */
  contracts?: string;
  /** Handlers entrypoint (e.g., ./handlers) */
  handlers?: string;
  /** UI components entrypoint (e.g., ./ui) */
  ui?: string;
  /** Documentation entrypoint (e.g., ./docs) */
  docs?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Example Metadata
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Example metadata extending OwnerShipMeta.
 * Provides standard spec identification plus example-specific fields.
 */
export interface ExampleMeta extends OwnerShipMeta {
  /** Example kind for categorization */
  kind: ExampleKind;
  /** Visibility level */
  visibility: ExampleVisibility;
  /** Short marketing summary (distinct from technical description) */
  summary?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// ExampleSpec
// ─────────────────────────────────────────────────────────────────────────────

/**
 * ExampleSpec - Complete specification for a ContractSpec example.
 *
 * Integrates with AppBlueprintSpec for app configuration and
 * FeatureModuleSpec for feature definitions.
 *
 * @example
 * ```typescript
 * const example: ExampleSpec = {
 *   meta: {
 *     key: 'saas-boilerplate',
 *     version: '1.0.0',
 *     title: 'SaaS Boilerplate',
 *     description: 'Multi-tenant SaaS foundation.',
 *     kind: 'template',
 *     visibility: 'public',
 *     stability: 'experimental',
 *     owners: ['@saas-team'],
 *     tags: ['saas', 'multi-tenant'],
 *   },
 *   surfaces: {
 *     templates: true,
 *     sandbox: { enabled: true, modes: ['playground', 'specs'] },
 *     studio: { enabled: true, installable: true },
 *     mcp: { enabled: true },
 *   },
 *   entrypoints: {
 *     packageName: '@contractspec/example.saas-boilerplate',
 *     feature: './saas-boilerplate.feature',
 *   },
 * };
 * ```
 */
export interface ExampleSpec {
  /** Example metadata (identification, ownership, categorization) */
  meta: ExampleMeta;

  /** Documentation references */
  docs?: ExampleDocumentation;

  /** Surface support configuration */
  surfaces: ExampleSurfaces;

  /** Package entrypoints */
  entrypoints: ExampleEntrypoints;

  /**
   * Inline or referenced AppBlueprintSpec.
   * Use SpecPointer for external reference to a registered blueprint.
   */
  blueprint?: AppBlueprintSpec | SpecPointer;

  /**
   * Features included in this example.
   * Can be inline FeatureModuleSpec objects or FeatureRef references.
   */
  features?: (FeatureModuleSpec | FeatureRef)[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Type Guards
// ─────────────────────────────────────────────────────────────────────────────

/** Check if a blueprint reference is a SpecPointer (external reference) */
export function isSpecPointer(
  ref: AppBlueprintSpec | SpecPointer | undefined
): ref is SpecPointer {
  if (!ref) return false;
  return 'key' in ref && !('meta' in ref);
}

/** Check if a feature reference is a FeatureRef (external reference) */
export function isFeatureRef(
  ref: FeatureModuleSpec | FeatureRef
): ref is FeatureRef {
  return 'key' in ref && !('meta' in ref);
}

/** Check if a value is a valid ExampleKind */
export function isExampleKind(value: unknown): value is ExampleKind {
  return (
    typeof value === 'string' &&
    Object.values(ExampleKindEnum).includes(value as ExampleKind)
  );
}

/** Check if a value is a valid ExampleVisibility */
export function isExampleVisibility(
  value: unknown
): value is ExampleVisibility {
  return (
    typeof value === 'string' &&
    Object.values(ExampleVisibilityEnum).includes(value as ExampleVisibility)
  );
}
