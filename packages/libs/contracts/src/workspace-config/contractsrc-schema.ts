/**
 * ContractSpec configuration schema definitions.
 *
 * These schemas define the structure of .contractsrc.json files
 * and are shared across CLI tools and libraries.
 */

import * as z from 'zod';
import type {
  BumpStrategy,
  ChangelogFormat,
  ChangelogTier,
  CheckRunConfig,
  CiConfig,
  ClaudeAgentSDKConfig,
  ContractsrcConfig,
  ExternalAgentsConfig,
  ExternalWorkspace,
  FolderConventions,
  FormatterConfig,
  FormatterType,
  GroupingRule,
  GroupingStrategy,
  HooksConfig,
  ImpactConfig,
  LintRules,
  MetaRepoConfig,
  OpenApiConfig,
  OpenApiExportConfig,
  OpenApiSourceConfig,
  OpenCodeSDKConfig,
  PrCommentConfig,
  RuleSeverity,
  RuleSyncConfig,
  RuleSyncTarget,
  RulesConfig,
  SchemaFormat,
  SpecKind,
  TestingConfig,
  TestLinkingConfig,
  TestLinkingStrategy,
  VersioningConfig,
  ResolvedContractsrcConfig,
} from './contractsrc-types';

export * from './contractsrc-types';

/**
 * Schema output format for code generation.
 * Controls how imported/generated schemas are written.
 */
export const SchemaFormatSchema: z.ZodType<SchemaFormat> = z.enum([
  'contractspec', // Default: SchemaModel + FieldType
  'zod', // Raw Zod schemas
  'json-schema', // JSON Schema definitions
  'graphql', // GraphQL scalar types
]);

/**
 * OpenAPI source configuration for import/sync/validate operations.
 */
export const OpenApiSourceConfigSchema: z.ZodType<OpenApiSourceConfig> =
  z.object({
    /** Friendly name for the source */
    name: z.string(),
    /** Remote URL to fetch OpenAPI spec from */
    url: z.string().url().optional(),
    /** Local file path to OpenAPI spec */
    file: z.string().optional(),
    /** Sync mode: import (one-time), sync (update), validate (check only) */
    syncMode: z
      .enum(['import', 'sync', 'validate'])
      .default('validate')
      .optional(),
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
    schemaFormat: SchemaFormatSchema.default('contractspec').optional(),
  });

export const OpenApiExportConfigSchema: z.ZodType<OpenApiExportConfig> =
  z.object({
    /** Output path for exported OpenAPI document */
    outputPath: z.string().default('./openapi.json').optional(),
    /** Output format */
    format: z.enum(['json', 'yaml']).default('json').optional(),
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
export const OpenApiConfigSchema: z.ZodType<OpenApiConfig> = z.object({
  /** External OpenAPI sources to import/sync from */
  sources: z.array(OpenApiSourceConfigSchema).optional(),
  /** Export configuration */
  export: OpenApiExportConfigSchema.optional(),
});

/**
 * Grouping strategy for organizing specs.
 */
export const GroupingStrategySchema: z.ZodType<GroupingStrategy> = z.enum([
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
export const GroupingRuleSchema: z.ZodType<GroupingRule> = z.object({
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
export const FolderConventionsSchema: z.ZodType<FolderConventions> = z.object({
  models: z.string().default('models').optional(),
  operations: z.string().default('operations/commands|queries').optional(),
  events: z.string().default('events').optional(),
  presentations: z.string().default('presentations').optional(),
  forms: z.string().default('forms').optional(),
  /** Enable feature/module folder grouping (default: true) */
  groupByFeature: z.boolean().default(true).optional(),
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
export const PrCommentConfigSchema: z.ZodType<PrCommentConfig> = z.object({
  /** Enable PR comments */
  enabled: z.boolean().default(true).optional(),
  /** Comment template: 'minimal' | 'detailed' */
  template: z.enum(['minimal', 'detailed']).default('detailed').optional(),
  /** Update existing comment instead of creating new */
  updateExisting: z.boolean().default(true).optional(),
});

/**
 * GitHub check run configuration for CI/CD.
 */
export const CheckRunConfigSchema: z.ZodType<CheckRunConfig> = z.object({
  /** Enable GitHub check run creation */
  enabled: z.boolean().default(true).optional(),
  /** Check run name */
  name: z.string().default('ContractSpec Impact').optional(),
  /** Fail check on breaking changes */
  failOnBreaking: z.boolean().default(true).optional(),
  /** Fail check on any contract changes */
  failOnChanges: z.boolean().default(false).optional(),
});

/**
 * Impact detection configuration for CI/CD.
 */
export const ImpactConfigSchema: z.ZodType<ImpactConfig> = z.object({
  /** Baseline for comparison: 'default-branch' | 'base-ref' | 'tag:v*' */
  baseline: z.string().default('default-branch').optional(),
  /** Paths to include in impact detection (glob patterns) */
  include: z.array(z.string()).optional(),
  /** Paths to exclude from impact detection (glob patterns) */
  exclude: z.array(z.string()).optional(),
});

/**
 * CI/CD configuration section.
 */
export const CiConfigSchema: z.ZodType<CiConfig> = z.object({
  /** Default checks to run */
  checks: z
    .array(z.string())
    .default(['structure', 'integrity', 'deps'])
    .optional(),
  /** Checks to skip */
  skipChecks: z.array(z.string()).optional(),
  /** Fail CI on warnings */
  failOnWarnings: z.boolean().default(false).optional(),
  /** Upload SARIF to GitHub Code Scanning */
  uploadSarif: z.boolean().default(true).optional(),
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
export const ExternalWorkspaceSchema: z.ZodType<ExternalWorkspace> = z.object({
  /** Alias for referencing this workspace (e.g., 'core', 'internal') */
  alias: z.string(),
  /** Submodule name or relative path from meta-repo root */
  submodule: z.string(),
  /** Package patterns to include from this workspace */
  packages: z.array(z.string()).optional(),
  /** Whether to auto-resolve internal dependencies */
  autoResolve: z.boolean().default(true).optional(),
});

/**
 * Meta-repo configuration section.
 */
export const MetaRepoConfigSchema: z.ZodType<MetaRepoConfig> = z.object({
  /** Active submodule scope (defaults to auto-detected) */
  activeScope: z.string().optional(),
  /** External workspace references for cross-workspace dependencies */
  externalWorkspaces: z.array(ExternalWorkspaceSchema).optional(),
  /** Whether to search for specs across all submodules */
  crossWorkspaceSearch: z.boolean().default(false).optional(),
});

// ============================================================================
// Formatter Configuration
// ============================================================================

/**
 * Supported formatter tools.
 */
export const FormatterTypeSchema: z.ZodType<FormatterType> = z.enum([
  'prettier', // Prettier formatter
  'eslint', // ESLint with --fix
  'biome', // Biome formatter
  'dprint', // dprint formatter
  'custom', // Custom command
]);

/**
 * Formatter configuration for code generation.
 */
export const FormatterConfigSchema: z.ZodType<FormatterConfig> = z.object({
  /** Enable/disable formatting (default: true if formatter detected) */
  enabled: z.boolean().default(true).optional(),
  /** Formatter to use (auto-detected if not specified) */
  type: FormatterTypeSchema.optional(),
  /** Custom command for 'custom' type (e.g., "bunx prettier --write") */
  command: z.string().optional(),
  /** Extra arguments to pass to formatter */
  args: z.array(z.string()).optional(),
  /** Timeout in milliseconds (default: 30000) */
  timeout: z.number().default(30000).optional(),
});

// ============================================================================
// Versioning Configuration
// ============================================================================

/**
 * Bump strategy for version management.
 */
export const BumpStrategySchema: z.ZodType<BumpStrategy> = z.enum([
  'impact', // Based on spec change impact analysis (breaking → major, etc.)
  'conventional', // Based on conventional commit parsing
]);

/**
 * Changelog format template.
 */
export const ChangelogFormatSchema: z.ZodType<ChangelogFormat> = z.enum([
  'keep-a-changelog', // Keep a Changelog format
  'conventional', // Conventional Changelog format
  'custom', // Custom template
]);

/**
 * Changelog tier configuration.
 */
export const ChangelogTierSchema: z.ZodType<ChangelogTier> = z.enum([
  'spec', // Per-spec changelogs as DocBlocks
  'library', // Per-library CHANGELOG.md files
  'monorepo', // Root CHANGELOG.md
]);

/**
 * Versioning configuration for changelog and version management.
 */
export const VersioningConfigSchema: z.ZodType<VersioningConfig> = z.object({
  /** Enable automated version bumping in CI */
  autoBump: z.boolean().default(false).optional(),
  /** Strategy for determining version bumps */
  bumpStrategy: BumpStrategySchema.default('impact').optional(),
  /** Integrate with Changesets (generate .changeset files) */
  integrateWithChangesets: z.boolean().default(false).optional(),
  /** Changelog tiers to generate */
  changelogTiers: z
    .array(ChangelogTierSchema)
    .default(['spec', 'library', 'monorepo'])
    .optional(),
  /** Changelog format template */
  format: ChangelogFormatSchema.default('keep-a-changelog').optional(),
  /** Commit changes after version bump (CI mode) */
  commitChanges: z.boolean().default(false).optional(),
  /** Commit message template (supports {version}, {specs}) */
  commitMessage: z.string().default('chore: bump spec versions').optional(),
  /** Create git tags for versions */
  createTags: z.boolean().default(false).optional(),
  /** Tag prefix (e.g., "v" → v1.0.0, "spec-" → spec-1.0.0) */
  tagPrefix: z.string().default('v').optional(),
  /** Paths to include for version analysis (glob patterns) */
  include: z.array(z.string()).optional(),
  /** Paths to exclude from version analysis (glob patterns) */
  exclude: z.array(z.string()).optional(),
});

// ============================================================================
// RuleSync Configuration
// ============================================================================

/**
 * Supported rule synchronization targets.
 */
export const RuleSyncTargetSchema: z.ZodType<RuleSyncTarget> = z.enum([
  'cursor', // .cursorrules
  'windsurf', // .windsurfrules
  'cline', // .clinerules
  'claude-code', // CLAUDE.md
  'copilot', // .github/copilot-instructions.md
  'subagent', // .subagent
  'skill', // .skill
]);

/**
 * Configuration for AI agent rules synchronization (rulesync).
 */
export const RuleSyncConfigSchema: z.ZodType<RuleSyncConfig> = z.object({
  /** Enable automated rule synchronization */
  enabled: z.boolean().default(false).optional(),
  /** Root directory for source rule files */
  rulesDir: z.string().default('./.rules').optional(),
  /** Source rule files (glob patterns) */
  rules: z.array(z.string()).default(['**/*.rule.md']).optional(),
  /** Synchronization targets (tools to generate rules for) */
  targets: z
    .array(RuleSyncTargetSchema)
    .default(['cursor', 'windsurf'])
    .optional(),
  /** Automatically synchronize rules on workspace changes or builds */
  autoSync: z.boolean().default(true).optional(),
  /** Whether to eject/copy source rules instead of generating from Unified Rules */
  ejectMode: z.boolean().default(false).optional(),
});

// ============================================================================
// External Agent SDK Configuration
// ============================================================================

/**
 * Claude Agent SDK configuration.
 */
export const ClaudeAgentSDKConfigSchema: z.ZodType<ClaudeAgentSDKConfig> =
  z.object({
    /** Enable Claude Agent SDK provider */
    enabled: z.boolean().default(false).optional(),
    /** API key (defaults to ANTHROPIC_API_KEY env var) */
    apiKey: z.string().optional(),
    /** Model to use (defaults to claude-sonnet-4-20250514) */
    model: z.string().default('claude-sonnet-4-20250514').optional(),
    /** Enable computer use capabilities */
    computerUse: z.boolean().default(false).optional(),
    /** Enable extended thinking mode */
    extendedThinking: z.boolean().default(false).optional(),
  });

/**
 * OpenCode SDK configuration.
 */
export const OpenCodeSDKConfigSchema: z.ZodType<OpenCodeSDKConfig> = z.object({
  /** Enable OpenCode SDK provider */
  enabled: z.boolean().default(false).optional(),
  /** Server URL (defaults to http://127.0.0.1:4096) */
  serverUrl: z.string().optional(),
  /** Server port (alternative to full URL) */
  port: z.number().optional(),
  /** Agent type to use */
  agentType: z
    .enum(['build', 'plan', 'general', 'explore'])
    .default('general')
    .optional(),
  /** Model to use */
  model: z.string().optional(),
});

/**
 * External agent SDK configuration section.
 */
export const ExternalAgentsConfigSchema: z.ZodType<ExternalAgentsConfig> =
  z.object({
    /** Claude Agent SDK configuration */
    claudeAgent: ClaudeAgentSDKConfigSchema.optional(),
    /** OpenCode SDK configuration */
    openCode: OpenCodeSDKConfigSchema.optional(),
  });

// ============================================================================
// Lint Rules Configuration (ESLint-style)
// ============================================================================

/**
 * Rule severity levels (inspired by ESLint).
 */
export const RuleSeveritySchema: z.ZodType<RuleSeverity> = z.enum([
  'off',
  'warn',
  'error',
]);

/**
 * Contract kinds for per-kind rule overrides.
 */
export const SpecKindSchema: z.ZodType<SpecKind> = z.enum([
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
export const LintRulesSchema: z.ZodType<LintRules> = z.object({
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
 * Test linking strategy for discovering test coverage.
 */
export const TestLinkingStrategySchema: z.ZodType<TestLinkingStrategy> = z.enum(
  [
    /** Use TestSpec.target as primary, fall back to naming convention */
    'target-first',
    /** Only use {specKey}.test naming convention */
    'convention-only',
    /** Accept both target and naming convention (default) */
    'both',
  ]
);

/**
 * Test linking configuration for contract-first test discovery.
 */
export const TestLinkingConfigSchema: z.ZodType<TestLinkingConfig> = z.object({
  /** Strategy for linking tests to specs */
  strategy: TestLinkingStrategySchema.default('both').optional(),
  /** Warn when tests only use naming convention (no TestSpec.target) */
  warnOnConvention: z.boolean().default(false).optional(),
});

/**
 * Testing configuration section.
 */
export const TestingConfigSchema: z.ZodType<TestingConfig> = z.object({
  /** Test runner to use */
  runner: z
    .enum(['internal', 'jest', 'vitest', 'bun'])
    .default('internal')
    .optional(),
  /** Glob patterns for matching test files */
  testMatch: z
    .array(z.string())
    .default(['**/*.{test,spec}.{ts,js}'])
    .optional(),
  /** Enable automatic test generation */
  autoGenerate: z.boolean().default(false).optional(),
  /** Integrity requirements for testing */
  integrity: z
    .object({
      /** Spec types that require test coverage */
      requireTestsFor: z.array(SpecKindSchema).optional(),
      /** Minimum coverage percentage (if supported) */
      minCoverage: z.number().optional(),
    })
    .optional(),
  /** Test linking configuration for contract-first test discovery */
  testLinking: TestLinkingConfigSchema.optional(),
});

/**
 * Full rules configuration with global defaults and per-kind overrides.
 */
// NOTE: Partial<Record<...>> is tricky with Zod. using z.record(z.enum(...), ...).
export const RulesConfigSchema: z.ZodType<RulesConfig> = z.object({
  /** Global default rule severities */
  defaults: LintRulesSchema.optional(),
  /** Per-kind rule severity overrides */
  overrides: z.record(SpecKindSchema, LintRulesSchema).optional(),
});

/**
 * Git hooks configuration.
 * Maps hook names (e.g., "pre-commit") to a list of commands or checks to run.
 */
export const HooksConfigSchema: z.ZodType<HooksConfig> = z.record(
  z.string(),
  z.array(z.string())
);

/**
 * Full ContractSpec configuration schema (.contractsrc.json).
 */
export const ContractsrcSchema: z.ZodType<ContractsrcConfig> = z.object({
  aiProvider: z
    .enum(['claude', 'openai', 'ollama', 'custom'])
    .default('claude')
    .optional(),
  aiModel: z.string().optional(),
  agentMode: z
    .enum([
      'simple',
      'cursor',
      'claude-code',
      'openai-codex',
      'claude-agent-sdk',
      'opencode-sdk',
    ])
    .default('simple')
    .optional(),
  customEndpoint: z.url().nullable().optional(), // z.url() implies string
  customApiKey: z.string().nullable().optional(),
  outputDir: z.string().default('./src').optional(),
  conventions: FolderConventionsSchema.optional(),
  defaultOwners: z.array(z.string()).default([]).optional(),
  defaultTags: z.array(z.string()).default([]).optional(),
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
  // Testing configuration
  testing: TestingConfigSchema.optional(),
  // Git hooks configuration
  hooks: HooksConfigSchema.optional(),
  // Schema format for code generation
  schemaFormat: SchemaFormatSchema.default('contractspec').optional(),
  // Formatter configuration
  formatter: FormatterConfigSchema.optional(),
  // Versioning configuration
  versioning: VersioningConfigSchema.optional(),
  // Rule synchronization configuration
  ruleSync: RuleSyncConfigSchema.optional(),
  // External agent SDK configuration
  externalAgents: ExternalAgentsConfigSchema.optional(),
});

/**
 * Default configuration values.
 */
export const DEFAULT_CONTRACTSRC: ResolvedContractsrcConfig = {
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
