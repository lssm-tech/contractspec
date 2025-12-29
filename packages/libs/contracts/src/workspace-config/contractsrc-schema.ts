/**
 * ContractSpec configuration schema definitions.
 *
 * These schemas define the structure of .contractsrc.json files
 * and are shared across CLI tools and libraries.
 */

import * as z from 'zod';

/**
 * Schema output format for code generation.
 * Controls how imported/generated schemas are written.
 */
export const SchemaFormatSchema = z.enum([
  'contractspec', // Default: SchemaModel + FieldType
  'zod', // Raw Zod schemas
  'json-schema', // JSON Schema definitions
  'graphql', // GraphQL scalar types
]);

/**
 * OpenAPI source configuration for import/sync/validate operations.
 */
export const OpenApiSourceConfigSchema = z.object({
  /** Friendly name for the source */
  name: z.string(),
  /** Remote URL to fetch OpenAPI spec from */
  url: z.url().optional(),
  /** Local file path to OpenAPI spec */
  file: z.string().optional(),
  /** Sync mode: import (one-time), sync (update), validate (check only) */
  syncMode: z.enum(['import', 'sync', 'validate']).default('validate'),
  /** Only import operations with these tags */
  tags: z.array(z.string()).optional(),
  /** Exclude operations with these operationIds */
  exclude: z.array(z.string()).optional(),
  /** Include operations with these operationIds (overrides exclude) */
  include: z.array(z.string()).optional(),
  /** Prefix for generated spec names */
  prefix: z.string().optional(),
  /** Default stability for imported specs */
  defaultStability: z
    .enum(['experimental', 'beta', 'stable', 'deprecated'])
    .optional(),
  /** Default auth level for imported specs */
  defaultAuth: z.enum(['anonymous', 'user', 'admin']).optional(),
  /** Default owners for imported specs */
  defaultOwners: z.array(z.string()).optional(),
  /** Output schema format for generated models */
  schemaFormat: SchemaFormatSchema.default('contractspec'),
});
export const OpenApiExportConfigSchema = z.object({
  /** Output path for exported OpenAPI document */
  outputPath: z.string().default('./openapi.json'),
  /** Output format */
  format: z.enum(['json', 'yaml']).default('json'),
  /** API title for export */
  title: z.string().optional(),
  /** API version for export */
  version: z.string().optional(),
  /** API description for export */
  description: z.string().optional(),
  /** Server URLs to include in export */
  servers: z
    .array(
      z.object({
        url: z.string(),
        description: z.string().optional(),
      })
    )
    .optional(),
});

/**
 * OpenAPI configuration section.
 */
export const OpenApiConfigSchema = z.object({
  /** External OpenAPI sources to import/sync from */
  sources: z.array(OpenApiSourceConfigSchema).optional(),
  /** Export configuration */
  export: OpenApiExportConfigSchema.optional(),
});

/**
 * Grouping strategy for organizing specs.
 */
export const GroupingStrategySchema = z.enum([
  'by-tag',
  'by-owner',
  'by-domain',
  'by-url-path-single',
  'by-url-path-multi',
  'by-feature',
  'none',
]);

/**
 * Grouping rule configuration.
 */
export const GroupingRuleSchema = z.object({
  /** Grouping strategy to apply */
  strategy: GroupingStrategySchema,
  /** For url-path strategies, the level depth (default: 1) */
  urlPathLevel: z.number().optional(),
  /** Custom key extraction pattern (regex or glob) */
  pattern: z.string().optional(),
});

/**
 * Output directory conventions for generated specs.
 */
export const FolderConventionsSchema = z.object({
  models: z.string().default('models'),
  operations: z.string().default('operations/commands|queries'),
  events: z.string().default('events'),
  presentations: z.string().default('presentations'),
  forms: z.string().default('forms'),
  /** Enable feature/module folder grouping (default: true) */
  groupByFeature: z.boolean().default(true),
  /** Grouping rule for operations */
  operationsGrouping: GroupingRuleSchema.optional(),
  /** Grouping rule for models */
  modelsGrouping: GroupingRuleSchema.optional(),
  /** Grouping rule for events */
  eventsGrouping: GroupingRuleSchema.optional(),
});

/**
 * PR comment configuration for CI/CD.
 */
export const PrCommentConfigSchema = z.object({
  /** Enable PR comments */
  enabled: z.boolean().default(true),
  /** Comment template: 'minimal' | 'detailed' */
  template: z.enum(['minimal', 'detailed']).default('detailed'),
  /** Update existing comment instead of creating new */
  updateExisting: z.boolean().default(true),
});

/**
 * GitHub check run configuration for CI/CD.
 */
export const CheckRunConfigSchema = z.object({
  /** Enable GitHub check run creation */
  enabled: z.boolean().default(true),
  /** Check run name */
  name: z.string().default('ContractSpec Impact'),
  /** Fail check on breaking changes */
  failOnBreaking: z.boolean().default(true),
  /** Fail check on any contract changes */
  failOnChanges: z.boolean().default(false),
});

/**
 * Impact detection configuration for CI/CD.
 */
export const ImpactConfigSchema = z.object({
  /** Baseline for comparison: 'default-branch' | 'base-ref' | 'tag:v*' */
  baseline: z.string().default('default-branch'),
  /** Paths to include in impact detection (glob patterns) */
  include: z.array(z.string()).optional(),
  /** Paths to exclude from impact detection (glob patterns) */
  exclude: z.array(z.string()).optional(),
});

/**
 * CI/CD configuration section.
 */
export const CiConfigSchema = z.object({
  /** Default checks to run */
  checks: z.array(z.string()).default(['structure', 'integrity', 'deps']),
  /** Checks to skip */
  skipChecks: z.array(z.string()).optional(),
  /** Fail CI on warnings */
  failOnWarnings: z.boolean().default(false),
  /** Upload SARIF to GitHub Code Scanning */
  uploadSarif: z.boolean().default(true),
  /** PR comment configuration */
  prComment: PrCommentConfigSchema.optional(),
  /** GitHub check run configuration */
  checkRun: CheckRunConfigSchema.optional(),
  /** Impact detection configuration */
  impact: ImpactConfigSchema.optional(),
});

/**
 * External workspace reference for cross-workspace dependencies in meta-repos.
 */
export const ExternalWorkspaceSchema = z.object({
  /** Alias for referencing this workspace (e.g., 'core', 'internal') */
  alias: z.string(),
  /** Submodule name or relative path from meta-repo root */
  submodule: z.string(),
  /** Package patterns to include from this workspace */
  packages: z.array(z.string()).optional(),
  /** Whether to auto-resolve internal dependencies */
  autoResolve: z.boolean().default(true),
});

/**
 * Meta-repo configuration section.
 */
export const MetaRepoConfigSchema = z.object({
  /** Active submodule scope (defaults to auto-detected) */
  activeScope: z.string().optional(),
  /** External workspace references for cross-workspace dependencies */
  externalWorkspaces: z.array(ExternalWorkspaceSchema).optional(),
  /** Whether to search for specs across all submodules */
  crossWorkspaceSearch: z.boolean().default(false),
});

// ============================================================================
// Formatter Configuration
// ============================================================================

/**
 * Supported formatter tools.
 */
export const FormatterTypeSchema = z.enum([
  'prettier', // Prettier formatter
  'eslint', // ESLint with --fix
  'biome', // Biome formatter
  'dprint', // dprint formatter
  'custom', // Custom command
]);

/**
 * Formatter configuration for code generation.
 */
export const FormatterConfigSchema = z.object({
  /** Enable/disable formatting (default: true if formatter detected) */
  enabled: z.boolean().default(true),
  /** Formatter to use (auto-detected if not specified) */
  type: FormatterTypeSchema.optional(),
  /** Custom command for 'custom' type (e.g., "bunx prettier --write") */
  command: z.string().optional(),
  /** Extra arguments to pass to formatter */
  args: z.array(z.string()).optional(),
  /** Timeout in milliseconds (default: 30000) */
  timeout: z.number().default(30000),
});

// ============================================================================
// Versioning Configuration
// ============================================================================

/**
 * Bump strategy for version management.
 */
export const BumpStrategySchema = z.enum([
  'impact', // Based on spec change impact analysis (breaking → major, etc.)
  'conventional', // Based on conventional commit parsing
]);

/**
 * Changelog format template.
 */
export const ChangelogFormatSchema = z.enum([
  'keep-a-changelog', // Keep a Changelog format
  'conventional', // Conventional Changelog format
  'custom', // Custom template
]);

/**
 * Changelog tier configuration.
 */
export const ChangelogTierSchema = z.enum([
  'spec', // Per-spec changelogs as DocBlocks
  'library', // Per-library CHANGELOG.md files
  'monorepo', // Root CHANGELOG.md
]);

/**
 * Versioning configuration for changelog and version management.
 */
export const VersioningConfigSchema = z.object({
  /** Enable automated version bumping in CI */
  autoBump: z.boolean().default(false),
  /** Strategy for determining version bumps */
  bumpStrategy: BumpStrategySchema.default('impact'),
  /** Integrate with Changesets (generate .changeset files) */
  integrateWithChangesets: z.boolean().default(false),
  /** Changelog tiers to generate */
  changelogTiers: z
    .array(ChangelogTierSchema)
    .default(['spec', 'library', 'monorepo']),
  /** Changelog format template */
  format: ChangelogFormatSchema.default('keep-a-changelog'),
  /** Commit changes after version bump (CI mode) */
  commitChanges: z.boolean().default(false),
  /** Commit message template (supports {version}, {specs}) */
  commitMessage: z.string().default('chore: bump spec versions'),
  /** Create git tags for versions */
  createTags: z.boolean().default(false),
  /** Tag prefix (e.g., "v" → v1.0.0, "spec-" → spec-1.0.0) */
  tagPrefix: z.string().default('v'),
  /** Paths to include for version analysis (glob patterns) */
  include: z.array(z.string()).optional(),
  /** Paths to exclude from version analysis (glob patterns) */
  exclude: z.array(z.string()).optional(),
});

// ============================================================================
// Lint Rules Configuration (ESLint-style)
// ============================================================================

/**
 * Rule severity levels (inspired by ESLint).
 */
export const RuleSeveritySchema = z.enum(['off', 'warn', 'error']);

/**
 * Contract kinds for per-kind rule overrides.
 */
export const SpecKindSchema = z.enum([
  'operation',
  'event',
  'presentation',
  'feature',
  'workflow',
  'data-view',
  'migration',
  'telemetry',
  'experiment',
  'app-config',
]);

/**
 * Available lint rules with their severity.
 */
export const LintRulesSchema = z.object({
  /** Require acceptance scenarios for operations */
  'require-acceptance': RuleSeveritySchema.optional(),
  /** Require examples for operations */
  'require-examples': RuleSeveritySchema.optional(),
  /** Require stability field */
  'require-stability': RuleSeveritySchema.optional(),
  /** Require owners to follow proper format (@team or Enum) */
  'require-owners-format': RuleSeveritySchema.optional(),
  /** Require event names to use past tense */
  'event-past-tense': RuleSeveritySchema.optional(),
  /** Warn on TODO comments */
  'no-todo': RuleSeveritySchema.optional(),
  /** Require workflow transitions */
  'workflow-transitions': RuleSeveritySchema.optional(),
  /** Require privacy classification for telemetry */
  'telemetry-privacy': RuleSeveritySchema.optional(),
  /** Require allocation config for experiments */
  'experiment-allocation': RuleSeveritySchema.optional(),
  /** Require appId for app blueprints */
  'app-config-appid': RuleSeveritySchema.optional(),
  /** Require capabilities for app blueprints */
  'app-config-capabilities': RuleSeveritySchema.optional(),
  /** Require fields for data views */
  'data-view-fields': RuleSeveritySchema.optional(),
});

/**
 * Full rules configuration with global defaults and per-kind overrides.
 */
export const RulesConfigSchema = z.object({
  /** Global default rule severities */
  defaults: LintRulesSchema.optional(),
  /** Per-kind rule severity overrides */
  overrides: z.record(SpecKindSchema, LintRulesSchema).optional(),
});

/**
 * Git hooks configuration.
 * Maps hook names (e.g., "pre-commit") to a list of commands or checks to run.
 */
export const HooksConfigSchema = z.record(z.string(), z.array(z.string()));

/**
 * Full ContractSpec configuration schema (.contractsrc.json).
 */
export const ContractsrcSchema = z.object({
  aiProvider: z
    .enum(['claude', 'openai', 'ollama', 'custom'])
    .default('claude'),
  aiModel: z.string().optional(),
  agentMode: z
    .enum(['simple', 'cursor', 'claude-code', 'openai-codex'])
    .default('simple'),
  customEndpoint: z.url().nullable().optional(),
  customApiKey: z.string().nullable().optional(),
  outputDir: z.string().default('./src'),
  conventions: FolderConventionsSchema,
  defaultOwners: z.array(z.string()).default([]),
  defaultTags: z.array(z.string()).default([]),
  // Monorepo configuration
  packages: z.array(z.string()).optional(),
  excludePackages: z.array(z.string()).optional(),
  recursive: z.boolean().optional(),
  // OpenAPI configuration
  openapi: OpenApiConfigSchema.optional(),
  // CI/CD configuration
  ci: CiConfigSchema.optional(),
  // Meta-repo configuration
  metaRepo: MetaRepoConfigSchema.optional(),
  // Lint rules configuration
  rules: RulesConfigSchema.optional(),
  // Git hooks configuration
  hooks: HooksConfigSchema.optional(),
  // Schema format for code generation
  schemaFormat: SchemaFormatSchema.default('contractspec'),
  // Formatter configuration
  formatter: FormatterConfigSchema.optional(),
  // Versioning configuration
  versioning: VersioningConfigSchema.optional(),
});

// Type exports
export type OpenApiSourceConfig = z.infer<typeof OpenApiSourceConfigSchema>;
export type OpenApiExportConfig = z.infer<typeof OpenApiExportConfigSchema>;
export type OpenApiConfig = z.infer<typeof OpenApiConfigSchema>;
export type FolderConventions = z.infer<typeof FolderConventionsSchema>;
export type ContractsrcConfig = z.infer<typeof ContractsrcSchema>;
export type GroupingStrategy = z.infer<typeof GroupingStrategySchema>;
export type GroupingRule = z.infer<typeof GroupingRuleSchema>;
export type PrCommentConfig = z.infer<typeof PrCommentConfigSchema>;
export type CheckRunConfig = z.infer<typeof CheckRunConfigSchema>;
export type ImpactConfig = z.infer<typeof ImpactConfigSchema>;
export type CiConfig = z.infer<typeof CiConfigSchema>;
export type ExternalWorkspace = z.infer<typeof ExternalWorkspaceSchema>;
export type MetaRepoConfig = z.infer<typeof MetaRepoConfigSchema>;
export type RuleSeverity = z.infer<typeof RuleSeveritySchema>;
export type SpecKind = z.infer<typeof SpecKindSchema>;
export type LintRules = z.infer<typeof LintRulesSchema>;
export type RulesConfig = z.infer<typeof RulesConfigSchema>;
export type HooksConfig = z.infer<typeof HooksConfigSchema>;
export type SchemaFormat = z.infer<typeof SchemaFormatSchema>;
export type FormatterType = z.infer<typeof FormatterTypeSchema>;
export type FormatterConfig = z.infer<typeof FormatterConfigSchema>;
export type BumpStrategy = z.infer<typeof BumpStrategySchema>;
export type ChangelogFormat = z.infer<typeof ChangelogFormatSchema>;
export type ChangelogTier = z.infer<typeof ChangelogTierSchema>;
export type VersioningConfig = z.infer<typeof VersioningConfigSchema>;

/**
 * Default configuration values.
 */
export const DEFAULT_CONTRACTSRC: ContractsrcConfig = {
  aiProvider: 'claude',
  agentMode: 'simple',
  outputDir: './src',
  conventions: {
    models: 'models',
    operations: 'interactions/commands|queries',
    events: 'events',
    presentations: 'presentations',
    forms: 'forms',
    groupByFeature: true,
  },
  defaultOwners: [],
  defaultTags: [],
  schemaFormat: 'contractspec',
};
