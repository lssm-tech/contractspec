/**
 * Explicit type definitions for ContractSpec configuration.
 *
 * These interfaces mirror the Zod schemas in `contractsrc-schema.ts` but are
 * statically defined to reduce compiler inference cost and memory usage.
 */

// ============================================================================
// Core Enums & Simple Types
// ============================================================================

export type SchemaFormat =
  | 'contractspec' // Default: SchemaModel + FieldType
  | 'zod' // Raw Zod schemas
  | 'json-schema' // JSON Schema definitions
  | 'graphql'; // GraphQL scalar types

export type GroupingStrategy =
  | 'by-tag'
  | 'by-owner'
  | 'by-domain'
  | 'by-url-path-single'
  | 'by-url-path-multi'
  | 'by-feature'
  | 'none';

export type FormatterType =
  | 'prettier' // Prettier formatter
  | 'eslint' // ESLint with --fix
  | 'biome' // Biome formatter
  | 'dprint' // dprint formatter
  | 'custom'; // Custom command

export type BumpStrategy =
  | 'impact' // Based on spec change impact analysis
  | 'conventional'; // Based on conventional commit parsing

export type ChangelogFormat =
  | 'keep-a-changelog' // Keep a Changelog format
  | 'conventional' // Conventional Changelog format
  | 'custom'; // Custom template

export type ChangelogTier =
  | 'spec' // Per-spec changelogs as DocBlocks
  | 'library' // Per-library CHANGELOG.md files
  | 'monorepo'; // Root CHANGELOG.md

export type RuleSyncTarget =
  | 'cursor' // .cursorrules
  | 'windsurf' // .windsurfrules
  | 'cline' // .clinerules
  | 'claude-code' // CLAUDE.md
  | 'copilot' // .github/copilot-instructions.md
  | 'subagent' // .subagent
  | 'skill'; // .skill

export type RuleSeverity = 'off' | 'warn' | 'error';

export type SpecKind =
  | 'operation'
  | 'event'
  | 'presentation'
  | 'feature'
  | 'workflow'
  | 'data-view'
  | 'migration'
  | 'telemetry'
  | 'experiment'
  | 'app-config';

export type TestLinkingStrategy =
  | 'target-first' // Use TestSpec.target as primary
  | 'convention-only' // Only use {specKey}.test naming convention
  | 'both'; // Accept both (default)

export type AgentProvider = 'claude' | 'openai' | 'ollama' | 'custom';

export type AgentMode =
  | 'simple'
  | 'cursor'
  | 'claude-code'
  | 'openai-codex'
  | 'claude-agent-sdk'
  | 'opencode'
  | 'opencode-sdk';

// ============================================================================
// Internal Config Objects
// ============================================================================

export interface OpenApiSourceConfig {
  /** Friendly name for the source */
  name: string;
  /** Remote URL to fetch OpenAPI spec from */
  url?: string;
  /** Local file path to OpenAPI spec */
  file?: string;
  /** Sync mode: import (one-time), sync (update), validate (check only) */
  syncMode?: 'import' | 'sync' | 'validate';
  /** Only import operations with these tags */
  tags?: string[];
  /** Exclude operations with these operationIds */
  exclude?: string[];
  /** Include operations with these operationIds (overrides exclude) */
  include?: string[];
  /** Prefix for generated spec names */
  prefix?: string;
  /** Default stability for imported specs */
  defaultStability?: 'experimental' | 'beta' | 'stable' | 'deprecated';
  /** Default auth level for imported specs */
  defaultAuth?: 'anonymous' | 'user' | 'admin';
  /** Default owners for imported specs */
  defaultOwners?: string[];
  /** Output schema format for generated models */
  schemaFormat?: SchemaFormat;
}

export interface OpenApiExportConfig {
  /** Output path for exported OpenAPI document */
  outputPath?: string;
  /** Output format */
  format?: 'json' | 'yaml';
  /** API title for export */
  title?: string;
  /** API version for export */
  version?: string;
  /** API description for export */
  description?: string;
  /** Server URLs to include in export */
  servers?: {
    url: string;
    description?: string;
  }[];
}

export interface OpenApiConfig {
  /** External OpenAPI sources to import/sync from */
  sources?: OpenApiSourceConfig[];
  /** Export configuration */
  export?: OpenApiExportConfig;
}

export interface GroupingRule {
  /** Grouping strategy to apply */
  strategy: GroupingStrategy;
  /** For url-path strategies, the level depth (default: 1) */
  urlPathLevel?: number;
  /** Custom key extraction pattern (regex or glob) */
  pattern?: string;
}

export interface FolderConventions {
  models?: string;
  operations?: string;
  events?: string;
  presentations?: string;
  forms?: string;
  /** Enable feature/module folder grouping (default: true) */
  groupByFeature?: boolean;
  /** Grouping rule for operations */
  operationsGrouping?: GroupingRule;
  /** Grouping rule for models */
  modelsGrouping?: GroupingRule;
  /** Grouping rule for events */
  eventsGrouping?: GroupingRule;
}

export interface PrCommentConfig {
  /** Enable PR comments */
  enabled?: boolean;
  /** Comment template: 'minimal' | 'detailed' */
  template?: 'minimal' | 'detailed';
  /** Update existing comment instead of creating new */
  updateExisting?: boolean;
}

export interface CheckRunConfig {
  /** Enable GitHub check run creation */
  enabled?: boolean;
  /** Check run name */
  name?: string;
  /** Fail check on breaking changes */
  failOnBreaking?: boolean;
  /** Fail check on any contract changes */
  failOnChanges?: boolean;
}

export interface ImpactConfig {
  /** Baseline for comparison: 'default-branch' | 'base-ref' | 'tag:v*' */
  baseline?: string;
  /** Paths to include in impact detection (glob patterns) */
  include?: string[];
  /** Paths to exclude from impact detection (glob patterns) */
  exclude?: string[];
}

export interface CiConfig {
  /** Default checks to run */
  checks?: string[];
  /** Checks to skip */
  skipChecks?: string[];
  /** Fail CI on warnings */
  failOnWarnings?: boolean;
  /** Upload SARIF to GitHub Code Scanning */
  uploadSarif?: boolean;
  /** PR comment configuration */
  prComment?: PrCommentConfig;
  /** GitHub check run configuration */
  checkRun?: CheckRunConfig;
  /** Impact detection configuration */
  impact?: ImpactConfig;
}

export interface ExternalWorkspace {
  /** Alias for referencing this workspace (e.g., 'core', 'internal') */
  alias: string;
  /** Submodule name or relative path from meta-repo root */
  submodule: string;
  /** Package patterns to include from this workspace */
  packages?: string[];
  /** Whether to auto-resolve internal dependencies */
  autoResolve?: boolean;
}

export interface MetaRepoConfig {
  /** Active submodule scope (defaults to auto-detected) */
  activeScope?: string;
  /** External workspace references for cross-workspace dependencies */
  externalWorkspaces?: ExternalWorkspace[];
  /** Whether to search for specs across all submodules */
  crossWorkspaceSearch?: boolean;
}

export interface FormatterConfig {
  /** Enable/disable formatting (default: true if formatter detected) */
  enabled?: boolean;
  /** Formatter to use (auto-detected if not specified) */
  type?: FormatterType;
  /** Custom command for 'custom' type (e.g., "bunx prettier --write") */
  command?: string;
  /** Extra arguments to pass to formatter */
  args?: string[];
  /** Timeout in milliseconds (default: 30000) */
  timeout?: number;
}

export interface VersioningConfig {
  /** Enable automated version bumping in CI */
  autoBump?: boolean;
  /** Strategy for determining version bumps */
  bumpStrategy?: BumpStrategy;
  /** Integrate with Changesets (generate .changeset files) */
  integrateWithChangesets?: boolean;
  /** Changelog tiers to generate */
  changelogTiers?: ChangelogTier[];
  /** Changelog format template */
  format?: ChangelogFormat;
  /** Commit changes after version bump (CI mode) */
  commitChanges?: boolean;
  /** Commit message template (supports {version}, {specs}) */
  commitMessage?: string;
  /** Create git tags for versions */
  createTags?: boolean;
  /** Tag prefix (e.g., "v" -> v1.0.0, "spec-" -> spec-1.0.0) */
  tagPrefix?: string;
  /** Paths to include for version analysis (glob patterns) */
  include?: string[];
  /** Paths to exclude from version analysis (glob patterns) */
  exclude?: string[];
}

export interface RuleSyncConfig {
  /** Enable automated rule synchronization */
  enabled?: boolean;
  /** Root directory for source rule files */
  rulesDir?: string;
  /** Source rule files (glob patterns) */
  rules?: string[];
  /** Synchronization targets (tools to generate rules for) */
  targets?: RuleSyncTarget[];
  /** Automatically synchronize rules on workspace changes or builds */
  autoSync?: boolean;
  /** Whether to eject/copy source rules instead of generating from Unified Rules */
  ejectMode?: boolean;
}

export interface ClaudeAgentSDKConfig {
  /** Enable Claude Agent SDK provider */
  enabled?: boolean;
  /** API key (defaults to ANTHROPIC_API_KEY env var) */
  apiKey?: string;
  /** Model to use (defaults to claude-sonnet-4-20250514) */
  model?: string;
  /** Enable computer use capabilities */
  computerUse?: boolean;
  /** Enable extended thinking mode */
  extendedThinking?: boolean;
}

export interface OpenCodeSDKConfig {
  /** Enable OpenCode SDK provider */
  enabled?: boolean;
  /** Server URL (defaults to http://127.0.0.1:4096) */
  serverUrl?: string;
  /** Server port (alternative to full URL) */
  port?: number;
  /** Agent type to use */
  agentType?: 'build' | 'plan' | 'general' | 'explore';
  /** Model to use */
  model?: string;
}

export interface ExternalAgentsConfig {
  /** Claude Agent SDK configuration */
  claudeAgent?: ClaudeAgentSDKConfig;
  /** OpenCode SDK configuration */
  openCode?: OpenCodeSDKConfig;
}

export interface LintRules {
  /** Require acceptance scenarios for operations */
  'require-acceptance'?: RuleSeverity;
  /** Require examples for operations */
  'require-examples'?: RuleSeverity;
  /** Require stability field */
  'require-stability'?: RuleSeverity;
  /** Require owners to follow proper format (@team or Enum) */
  'require-owners-format'?: RuleSeverity;
  /** Require event names to use past tense */
  'event-past-tense'?: RuleSeverity;
  /** Warn on placeholder comments */
  'no-todo'?: RuleSeverity;
  /** Require workflow transitions */
  'workflow-transitions'?: RuleSeverity;
  /** Require privacy classification for telemetry */
  'telemetry-privacy'?: RuleSeverity;
  /** Require allocation config for experiments */
  'experiment-allocation'?: RuleSeverity;
  /** Require appId for app blueprints */
  'app-config-appid'?: RuleSeverity;
  /** Require capabilities for app blueprints */
  'app-config-capabilities'?: RuleSeverity;
  /** Require fields for data views */
  'data-view-fields'?: RuleSeverity;
}

export interface TestLinkingConfig {
  /** Strategy for linking tests to specs */
  strategy?: TestLinkingStrategy;
  /** Warn when tests only use naming convention (no TestSpec.target) */
  warnOnConvention?: boolean;
}

export interface TestingConfig {
  /** Test runner to use */
  runner?: 'internal' | 'jest' | 'vitest' | 'bun';
  /** Glob patterns for matching test files */
  testMatch?: string[];
  /** Enable automatic test generation */
  autoGenerate?: boolean;
  /** Integrity requirements for testing */
  integrity?: {
    /** Spec types that require test coverage */
    requireTestsFor?: SpecKind[];
    /** Minimum coverage percentage (if supported) */
    minCoverage?: number;
  };
  /** Test linking configuration for contract-first test discovery */
  testLinking?: TestLinkingConfig;
}

export interface RulesConfig {
  /** Global default rule severities */
  defaults?: LintRules;
  /** Per-kind rule severity overrides */
  overrides?: Partial<Record<SpecKind, LintRules>>;
}

export type HooksConfig = Record<string, string[]>;

// ============================================================================
// Main Configuration Object
// ============================================================================

/**
 * Full ContractSpec configuration (.contractsrc.json).
 * All fields are optional as they come from user configuration.
 */
export interface ContractsrcFileConfig {
  aiProvider?: AgentProvider;
  aiModel?: string;
  agentMode?: AgentMode;
  customEndpoint?: string | null;
  customApiKey?: string | null;
  outputDir?: string;
  conventions?: FolderConventions;
  defaultOwners?: string[];
  defaultTags?: string[];
  // Monorepo configuration
  packages?: string[];
  excludePackages?: string[];
  recursive?: boolean;
  // OpenAPI configuration
  openapi?: OpenApiConfig;
  // CI/CD configuration
  ci?: CiConfig;
  // Meta-repo configuration
  metaRepo?: MetaRepoConfig;
  // Lint rules configuration
  rules?: RulesConfig;
  // Testing configuration
  testing?: TestingConfig;
  // Git hooks configuration
  hooks?: HooksConfig;
  // Schema format for code generation
  schemaFormat?: SchemaFormat;
  // Formatter configuration
  formatter?: FormatterConfig;
  // Versioning configuration
  versioning?: VersioningConfig;
  // Rule synchronization configuration
  ruleSync?: RuleSyncConfig;
  // External agent SDK configuration
  externalAgents?: ExternalAgentsConfig;
}

/**
 * Resolved configuration with guaranteed defaults.
 * This is what the application uses at runtime.
 */
export interface ResolvedContractsrcConfig extends ContractsrcFileConfig {
  aiProvider: 'claude' | 'openai' | 'ollama' | 'custom';
  agentMode:
    | 'simple'
    | 'cursor'
    | 'claude-code'
    | 'openai-codex'
    | 'claude-agent-sdk'
    | 'opencode'
    | 'opencode-sdk';
  outputDir: string;
  conventions: {
    models: string;
    operations: string;
    events: string;
    presentations: string;
    forms: string;
    groupByFeature: boolean;
    operationsGrouping?: GroupingRule;
    modelsGrouping?: GroupingRule;
    eventsGrouping?: GroupingRule;
  };
  defaultOwners: string[];
  defaultTags: string[];
  schemaFormat: SchemaFormat;
}

/**
 * @deprecated Use ContractsrcFileConfig for file inputs or ResolvedContractsrcConfig for app usage.
 */
export type ContractsrcConfig = ContractsrcFileConfig;
