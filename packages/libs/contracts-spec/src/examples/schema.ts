import { z } from 'zod';
import type {
  ExampleSpec,
  ExampleMeta,
  ExampleSurfaces,
  ExampleEntrypoints,
  ExampleDocumentation,
} from './types';

// ─────────────────────────────────────────────────────────────────────────────
// Enum Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const ExampleKindSchema = z.enum([
  'template',
  'workflow',
  'integration',
  'knowledge',
  'blueprint',
  'ui',
  'script',
  'library',
]);

export const ExampleVisibilitySchema = z.enum([
  'public',
  'internal',
  'experimental',
]);

export const ExampleSandboxModeSchema = z.enum([
  'playground',
  'specs',
  'builder',
  'markdown',
  'evolution',
]);

export const StabilitySchema = z.enum([
  'idea',
  'in_creation',
  'experimental',
  'beta',
  'stable',
  'deprecated',
]);

// ─────────────────────────────────────────────────────────────────────────────
// Documentation Schema
// ─────────────────────────────────────────────────────────────────────────────

export const ExampleDocumentationSchema = z.object({
  rootDocId: z.string().optional(),
  goalDocId: z.string().optional(),
  usageDocId: z.string().optional(),
  referenceDocId: z.string().optional(),
  constraintsDocId: z.string().optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Surfaces Schema
// ─────────────────────────────────────────────────────────────────────────────

export const ExampleSandboxSupportSchema = z.object({
  enabled: z.boolean(),
  modes: z.array(ExampleSandboxModeSchema),
});

export const ExampleStudioSupportSchema = z.object({
  enabled: z.boolean(),
  installable: z.boolean(),
});

export const ExampleMcpSupportSchema = z.object({
  enabled: z.boolean(),
});

export const ExampleSurfacesSchema = z.object({
  templates: z.boolean(),
  sandbox: ExampleSandboxSupportSchema,
  studio: ExampleStudioSupportSchema,
  mcp: ExampleMcpSupportSchema,
});

// ─────────────────────────────────────────────────────────────────────────────
// Entrypoints Schema
// ─────────────────────────────────────────────────────────────────────────────

export const ExampleEntrypointsSchema = z.object({
  packageName: z.string().min(1),
  feature: z.string().optional(),
  blueprint: z.string().optional(),
  presentations: z.string().optional(),
  contracts: z.string().optional(),
  handlers: z.string().optional(),
  ui: z.string().optional(),
  docs: z.string().optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Meta Schema
// ─────────────────────────────────────────────────────────────────────────────

export const ExampleMetaSchema = z.object({
  version: z.string(),
  key: z.string().min(1),
  title: z.string().optional(),
  description: z.string().min(1),
  domain: z.string().optional(),
  stability: StabilitySchema,
  owners: z.array(z.string()),
  tags: z.array(z.string()),
  docId: z.array(z.string()).optional(),
  kind: ExampleKindSchema,
  visibility: ExampleVisibilitySchema,
  summary: z.string().optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// SpecPointerSchema (for blueprint references)
// ─────────────────────────────────────────────────────────────────────────────

export const SpecPointerSchema = z.object({
  key: z.string().min(1),
  version: z.string().optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// FeatureRef Schema (for feature references)
// ─────────────────────────────────────────────────────────────────────────────

export const FeatureRefSchema = z.object({
  key: z.string().min(1),
});

// ─────────────────────────────────────────────────────────────────────────────
// ExampleSpec Schema
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Zod schema for validating ExampleSpec objects.
 *
 * Note: blueprint and features are loosely validated since they can be
 * inline specs or references. Full validation requires registry lookups.
 */
export const ExampleSpecSchema = z.object({
  meta: ExampleMetaSchema,
  docs: ExampleDocumentationSchema.optional(),
  surfaces: ExampleSurfacesSchema,
  entrypoints: ExampleEntrypointsSchema,
  // Blueprint can be an inline spec or a pointer - loosely validated
  blueprint: z
    .union([z.record(z.string(), z.unknown()), SpecPointerSchema])
    .optional(),
  // Features can be inline specs or refs - loosely validated as array
  features: z
    .array(z.union([z.record(z.string(), z.unknown()), FeatureRefSchema]))
    .optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Type Assertions
// ─────────────────────────────────────────────────────────────────────────────

/** Parse and validate an ExampleSpec, throwing on failure */
export function parseExampleSpec(data: unknown): ExampleSpec {
  return ExampleSpecSchema.parse(data) as ExampleSpec;
}

/** Safely parse an ExampleSpec, returning result object */
export function safeParseExampleSpec(data: unknown) {
  return ExampleSpecSchema.safeParse(data);
}

/** Parse and validate ExampleMeta */
export function parseExampleMeta(data: unknown): ExampleMeta {
  return ExampleMetaSchema.parse(data) as ExampleMeta;
}

/** Parse and validate ExampleSurfaces */
export function parseExampleSurfaces(data: unknown): ExampleSurfaces {
  return ExampleSurfacesSchema.parse(data) as ExampleSurfaces;
}

/** Parse and validate ExampleEntrypoints */
export function parseExampleEntrypoints(data: unknown): ExampleEntrypoints {
  return ExampleEntrypointsSchema.parse(data) as ExampleEntrypoints;
}

/** Parse and validate ExampleDocumentation */
export function parseExampleDocumentation(data: unknown): ExampleDocumentation {
  return ExampleDocumentationSchema.parse(data) as ExampleDocumentation;
}
