/**
 * ContractSpec configuration schema definitions.
 *
 * These schemas define the structure of .contractsrc.json files
 * and are shared across CLI tools and libraries.
 */

import * as z from 'zod';
import { CONTRACT_SPEC_TYPES } from '../types';
import {
	AgentTargetSchema,
	ReleaseEnforceOnSchema,
} from '../versioning/schema';
import { EnvironmentConfigSchema } from './environment';

export * from './environment';

import type {
	BuilderApiConfig,
	BuilderBootstrapPreset,
	BuilderConfig,
	BuilderLocalRuntimeConfig,
	BuilderRuntimeMode,
	BumpStrategy,
	ChangelogFormat,
	ChangelogTier,
	CheckRunConfig,
	CiConfig,
	ClaudeAgentSDKConfig,
	ConnectAdapterConfig,
	ConnectAdapterMode,
	ConnectAdoptionCatalogConfig,
	ConnectAdoptionConfig,
	ConnectAdoptionFamiliesConfig,
	ConnectAdoptionFamily,
	ConnectAdoptionThresholds,
	ConnectAdoptionWorkspaceScanConfig,
	ConnectCanonPackRef,
	ConnectCommandPolicy,
	ConnectConfig,
	ConnectPolicyConfig,
	ConnectReviewThresholds,
	ConnectStorageConfig,
	ConnectStudioConfig,
	ConnectVerdict,
	ContractsrcFileConfig,
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
	PackageDeclarationConfig,
	PackageDeclarationRequiredByKind,
	PackageDeclarationRollout,
	PackageDeclarationTarget,
	PrCommentConfig,
	ReleaseConfig,
	ResolvedContractsrcConfig,
	RuleSeverity,
	RuleSyncConfig,
	RuleSyncTarget,
	RulesConfig,
	SchemaFormat,
	SpecKind,
	TestingConfig,
	TestingHarnessAuthProfileConfig,
	TestingHarnessBrowserEngine,
	TestingHarnessConfig,
	TestingHarnessTargetUrls,
	TestingHarnessVisualConfig,
	TestLinkingConfig,
	TestLinkingStrategy,
	UpgradeConfig,
	VersioningConfig,
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

export const BuilderRuntimeModeSchema: z.ZodType<BuilderRuntimeMode> = z.enum([
	'managed',
	'local',
	'hybrid',
]);

export const BuilderBootstrapPresetSchema: z.ZodType<BuilderBootstrapPreset> =
	z.enum(['managed_mvp', 'local_daemon_mvp', 'hybrid_mvp']);

export const BuilderApiConfigSchema: z.ZodType<BuilderApiConfig> = z.object({
	baseUrl: z.string().url().optional(),
	controlPlaneTokenEnvVar: z
		.string()
		.default('CONTROL_PLANE_API_TOKEN')
		.optional(),
});

export const BuilderLocalRuntimeConfigSchema: z.ZodType<BuilderLocalRuntimeConfig> =
	z.object({
		runtimeId: z.string().default('rt_local_daemon').optional(),
		grantedTo: z.string().default('local:operator').optional(),
		providerIds: z
			.array(z.string())
			.default(['provider.codex', 'provider.local.model'])
			.optional(),
	});

export const BuilderConfigSchema: z.ZodType<BuilderConfig> = z.object({
	enabled: z.boolean().default(false).optional(),
	runtimeMode: BuilderRuntimeModeSchema.default('managed').optional(),
	bootstrapPreset:
		BuilderBootstrapPresetSchema.default('managed_mvp').optional(),
	api: BuilderApiConfigSchema.optional(),
	localRuntime: BuilderLocalRuntimeConfigSchema.optional(),
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
	capabilities: z.string().default('capabilities').optional(),
	policies: z.string().default('policies').optional(),
	tests: z.string().default('tests').optional(),
	translations: z.string().default('translations').optional(),
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

export const PackageDeclarationRolloutSchema: z.ZodType<PackageDeclarationRollout> =
	z.enum(['off', 'warning', 'error']);

export const PackageDeclarationTargetSchema: z.ZodType<PackageDeclarationTarget> =
	z.enum(['feature', 'integration', 'app-config', 'module-bundle', 'example']);

export const PackageDeclarationRequiredByKindSchema: z.ZodType<PackageDeclarationRequiredByKind> =
	z.object({
		libs: PackageDeclarationTargetSchema.default('feature').optional(),
		modules: PackageDeclarationTargetSchema.default('feature').optional(),
		integrations:
			PackageDeclarationTargetSchema.default('integration').optional(),
		bundles: PackageDeclarationTargetSchema.default('module-bundle').optional(),
		apps: PackageDeclarationTargetSchema.default('app-config').optional(),
		appsRegistry:
			PackageDeclarationTargetSchema.default('app-config').optional(),
		examples: PackageDeclarationTargetSchema.default('example').optional(),
	});

export const PackageDeclarationConfigSchema: z.ZodType<PackageDeclarationConfig> =
	z.object({
		severity: PackageDeclarationRolloutSchema.default('error').optional(),
		requiredByKind: PackageDeclarationRequiredByKindSchema.optional(),
		allowMissing: z.array(z.string()).default([]).optional(),
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
	/** Package-level declaration coverage policy */
	packageDeclarations: PackageDeclarationConfigSchema.optional(),
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
	/** Custom command for 'custom' type (e.g., "bunx @biomejs/biome format --write") */
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

export const ReleaseConfigSchema: z.ZodType<ReleaseConfig> = z.object({
	enforceOn: ReleaseEnforceOnSchema.default('release-branch').optional(),
	requireChangesetForPublished: z.boolean().default(true).optional(),
	requireReleaseCapsule: z.boolean().default(true).optional(),
	publishArtifacts: z
		.array(z.string())
		.default([
			'manifest.json',
			'patch-notes.md',
			'customer-guide.md',
			'upgrade-manifest.json',
		])
		.optional(),
	agentTargets: z.array(AgentTargetSchema).default(['codex']).optional(),
});

export const UpgradeConfigSchema: z.ZodType<UpgradeConfig> = z.object({
	manifestPaths: z
		.array(z.string())
		.default(['generated/releases/upgrade-manifest.json'])
		.optional(),
	defaultAgentTarget: AgentTargetSchema.default('codex').optional(),
	enableInteractiveGuidance: z.boolean().default(true).optional(),
	applyCodemods: z.boolean().default(true).optional(),
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
		/** Model to use (defaults to claude-sonnet-4-6) */
		model: z.string().default('claude-sonnet-4-6').optional(),
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

export const ConnectVerdictSchema: z.ZodType<ConnectVerdict> = z.enum([
	'permit',
	'rewrite',
	'require_review',
	'deny',
]);

export const ConnectAdapterModeSchema: z.ZodType<ConnectAdapterMode> = z.enum([
	'plugin',
	'rule',
	'wrapper',
]);

export const ConnectAdapterConfigSchema: z.ZodType<ConnectAdapterConfig> =
	z.object({
		enabled: z.boolean().default(false).optional(),
		mode: ConnectAdapterModeSchema.default('plugin').optional(),
		packageRef: z.string().optional(),
	});

export const ConnectStorageConfigSchema: z.ZodType<ConnectStorageConfig> =
	z.object({
		root: z.string().default('.contractspec/connect').optional(),
		contextPack: z
			.string()
			.default('.contractspec/connect/context-pack.json')
			.optional(),
		planPacket: z
			.string()
			.default('.contractspec/connect/plan-packet.json')
			.optional(),
		patchVerdict: z
			.string()
			.default('.contractspec/connect/patch-verdict.json')
			.optional(),
		auditFile: z
			.string()
			.default('.contractspec/connect/audit.ndjson')
			.optional(),
		reviewPacketsDir: z
			.string()
			.default('.contractspec/connect/review-packets')
			.optional(),
	});

export const ConnectReviewThresholdsSchema: z.ZodType<ConnectReviewThresholds> =
	z.object({
		protectedPathWrite: ConnectVerdictSchema.optional(),
		unknownImpact: ConnectVerdictSchema.optional(),
		contractDrift: ConnectVerdictSchema.optional(),
		breakingChange: ConnectVerdictSchema.optional(),
		destructiveCommand: ConnectVerdictSchema.optional(),
	});

export const ConnectPolicyConfigSchema: z.ZodType<ConnectPolicyConfig> =
	z.object({
		protectedPaths: z.array(z.string()).optional(),
		immutablePaths: z.array(z.string()).optional(),
		generatedPaths: z.array(z.string()).optional(),
		smokeChecks: z.array(z.string()).optional(),
		reviewThresholds: ConnectReviewThresholdsSchema.optional(),
	});

export const ConnectCommandPolicySchema: z.ZodType<ConnectCommandPolicy> =
	z.object({
		allow: z.array(z.string()).optional(),
		review: z.array(z.string()).optional(),
		deny: z.array(z.string()).optional(),
	});

export const ConnectCanonPackRefSchema: z.ZodType<ConnectCanonPackRef> =
	z.object({
		ref: z.string(),
		readOnly: z.boolean().default(true).optional(),
	});

export const ConnectStudioConfigSchema: z.ZodType<ConnectStudioConfig> =
	z.object({
		enabled: z.boolean().default(false).optional(),
		mode: z.enum(['off', 'review-bridge']).default('off').optional(),
		endpoint: z.string().url().optional(),
		queue: z.string().optional(),
	});

export const ConnectAdoptionFamilySchema: z.ZodType<ConnectAdoptionFamily> =
	z.enum([
		'ui',
		'contracts',
		'integrations',
		'runtime',
		'sharedLibs',
		'solutions',
	]);

export const ConnectAdoptionCatalogConfigSchema: z.ZodType<ConnectAdoptionCatalogConfig> =
	z.object({
		indexPath: z
			.string()
			.default('.contractspec/adoption/catalog.json')
			.optional(),
		overrideManifestPath: z
			.string()
			.default('.contractspec/adoption/overrides.json')
			.optional(),
	});

export const ConnectAdoptionWorkspaceScanConfigSchema: z.ZodType<ConnectAdoptionWorkspaceScanConfig> =
	z.object({
		include: z
			.array(z.string())
			.default([
				'src/**/*.{ts,tsx,js,jsx}',
				'app/**/*.{ts,tsx,js,jsx}',
				'components/**/*.{ts,tsx,js,jsx}',
				'packages/**/*.{ts,tsx,js,jsx}',
			])
			.optional(),
		exclude: z
			.array(z.string())
			.default([
				'**/node_modules/**',
				'**/dist/**',
				'**/.next/**',
				'**/coverage/**',
				'**/generated/**',
				'**/*.test.*',
				'**/*.spec.*',
				'**/*.stories.*',
			])
			.optional(),
	});

export const ConnectAdoptionFamiliesConfigSchema: z.ZodType<ConnectAdoptionFamiliesConfig> =
	z.object({
		ui: z.boolean().default(true).optional(),
		contracts: z.boolean().default(true).optional(),
		integrations: z.boolean().default(true).optional(),
		runtime: z.boolean().default(true).optional(),
		sharedLibs: z.boolean().default(true).optional(),
		solutions: z.boolean().default(true).optional(),
	});

export const ConnectAdoptionThresholdsSchema: z.ZodType<ConnectAdoptionThresholds> =
	z.object({
		workspaceReuse: ConnectVerdictSchema.default('rewrite').optional(),
		contractspecReuse: ConnectVerdictSchema.default('rewrite').optional(),
		ambiguous: ConnectVerdictSchema.default('require_review').optional(),
		newExternalDependency:
			ConnectVerdictSchema.default('require_review').optional(),
		newImplementation:
			ConnectVerdictSchema.default('require_review').optional(),
	});

export const ConnectAdoptionConfigSchema: z.ZodType<ConnectAdoptionConfig> =
	z.object({
		enabled: z.boolean().default(false).optional(),
		catalog: ConnectAdoptionCatalogConfigSchema.optional(),
		workspaceScan: ConnectAdoptionWorkspaceScanConfigSchema.optional(),
		families: ConnectAdoptionFamiliesConfigSchema.optional(),
		thresholds: ConnectAdoptionThresholdsSchema.optional(),
	});

export const ConnectConfigSchema: z.ZodType<ConnectConfig> = z.object({
	enabled: z.boolean().default(false).optional(),
	adapters: z
		.object({
			cursor: ConnectAdapterConfigSchema.optional(),
			codex: ConnectAdapterConfigSchema.optional(),
			'claude-code': ConnectAdapterConfigSchema.optional(),
		})
		.optional(),
	storage: ConnectStorageConfigSchema.optional(),
	policy: ConnectPolicyConfigSchema.optional(),
	commands: ConnectCommandPolicySchema.optional(),
	canonPacks: z.array(ConnectCanonPackRefSchema).optional(),
	studio: ConnectStudioConfigSchema.optional(),
	adoption: ConnectAdoptionConfigSchema.optional(),
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
export const SpecKindSchema: z.ZodType<SpecKind> = z.enum(CONTRACT_SPEC_TYPES);

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
	/** Warn on placeholder comments */
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

export const TestingHarnessBrowserEngineSchema: z.ZodType<TestingHarnessBrowserEngine> =
	z.enum(['playwright', 'agent-browser', 'both']);

export const TestingHarnessTargetUrlsSchema: z.ZodType<TestingHarnessTargetUrls> =
	z.object({
		preview: z.string().url().optional(),
		task: z.string().url().optional(),
		shared: z.string().url().optional(),
		sandbox: z.string().url().optional(),
	});

export const TestingHarnessVisualConfigSchema: z.ZodType<TestingHarnessVisualConfig> =
	z.object({
		maxDiffBytes: z.number().int().min(0).optional(),
		maxDiffRatio: z.number().min(0).max(1).optional(),
		updateBaselines: z.boolean().default(false).optional(),
	});

export const TestingHarnessAuthProfileConfigSchema: z.ZodType<TestingHarnessAuthProfileConfig> =
	z.object({
		kind: z.enum([
			'storage-state',
			'browser-profile',
			'session-name',
			'headers-env',
		]),
		ref: z.string().min(1),
	});

export const TestingHarnessConfigSchema: z.ZodType<TestingHarnessConfig> =
	z.object({
		artifactRoot: z.string().default('.contractspec/harness').optional(),
		browserEngine:
			TestingHarnessBrowserEngineSchema.default('playwright').optional(),
		targetBaseUrls: TestingHarnessTargetUrlsSchema.optional(),
		allowlistedDomains: z.array(z.string()).optional(),
		visual: TestingHarnessVisualConfigSchema.optional(),
		authProfiles: z
			.record(z.string(), TestingHarnessAuthProfileConfigSchema)
			.optional(),
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
	/** Harness verification configuration */
	harness: TestingHarnessConfigSchema.optional(),
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
export const ContractsrcSchema: z.ZodType<ContractsrcFileConfig> = z.object({
	$schema: z.string().optional(),
	aiProvider: z
		.enum(['claude', 'openai', 'ollama', 'mistral', 'custom'])
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
			'opencode',
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
	// Release communication policy
	release: ReleaseConfigSchema.optional(),
	// Guided upgrade policy
	upgrade: UpgradeConfigSchema.optional(),
	// Rule synchronization configuration
	ruleSync: RuleSyncConfigSchema.optional(),
	// External agent SDK configuration
	externalAgents: ExternalAgentsConfigSchema.optional(),
	// Builder initialization/runtime configuration
	builder: BuilderConfigSchema.optional(),
	// ContractSpec Connect configuration
	connect: ConnectConfigSchema.optional(),
	// Monorepo-aware environment/configuration declaration
	environment: EnvironmentConfigSchema.optional(),
});

/**
 * Default configuration values.
 */
export const DEFAULT_CONTRACTSRC: ResolvedContractsrcConfig = {
	aiProvider: 'claude',
	agentMode: 'simple',
	outputDir: './src',
	ci: {
		packageDeclarations: {
			severity: 'error',
			requiredByKind: {
				libs: 'feature',
				modules: 'feature',
				integrations: 'integration',
				bundles: 'module-bundle',
				apps: 'app-config',
				appsRegistry: 'app-config',
				examples: 'example',
			},
			allowMissing: [],
		},
	},
	conventions: {
		models: 'models',
		operations: 'interactions/commands|queries',
		events: 'events',
		presentations: 'presentations',
		forms: 'forms',
		capabilities: 'capabilities',
		policies: 'policies',
		tests: 'tests',
		translations: 'translations',
		groupByFeature: true,
	},
	defaultOwners: [],
	defaultTags: [],
	schemaFormat: 'contractspec',
	release: {
		enforceOn: 'release-branch',
		requireChangesetForPublished: true,
		requireReleaseCapsule: true,
		publishArtifacts: [
			'manifest.json',
			'patch-notes.md',
			'customer-guide.md',
			'upgrade-manifest.json',
		],
		agentTargets: ['codex'],
	},
	upgrade: {
		manifestPaths: ['generated/releases/upgrade-manifest.json'],
		defaultAgentTarget: 'codex',
		enableInteractiveGuidance: true,
		applyCodemods: true,
	},
	builder: {
		enabled: false,
		runtimeMode: 'managed',
		bootstrapPreset: 'managed_mvp',
		api: {
			controlPlaneTokenEnvVar: 'CONTROL_PLANE_API_TOKEN',
		},
		localRuntime: {
			runtimeId: 'rt_local_daemon',
			grantedTo: 'local:operator',
			providerIds: ['provider.codex', 'provider.local.model'],
		},
	},
	connect: {
		enabled: false,
		adapters: {
			cursor: {
				enabled: false,
				mode: 'plugin',
			},
			codex: {
				enabled: false,
				mode: 'wrapper',
			},
			'claude-code': {
				enabled: false,
				mode: 'rule',
			},
		},
		storage: {
			root: '.contractspec/connect',
			contextPack: '.contractspec/connect/context-pack.json',
			planPacket: '.contractspec/connect/plan-packet.json',
			patchVerdict: '.contractspec/connect/patch-verdict.json',
			auditFile: '.contractspec/connect/audit.ndjson',
			reviewPacketsDir: '.contractspec/connect/review-packets',
		},
		policy: {
			reviewThresholds: {
				protectedPathWrite: 'require_review',
				unknownImpact: 'require_review',
				contractDrift: 'require_review',
				breakingChange: 'require_review',
				destructiveCommand: 'deny',
			},
		},
		studio: {
			enabled: false,
			mode: 'off',
		},
		adoption: {
			enabled: false,
			catalog: {
				indexPath: '.contractspec/adoption/catalog.json',
				overrideManifestPath: '.contractspec/adoption/overrides.json',
			},
			workspaceScan: {
				include: [
					'src/**/*.{ts,tsx,js,jsx}',
					'app/**/*.{ts,tsx,js,jsx}',
					'components/**/*.{ts,tsx,js,jsx}',
					'packages/**/*.{ts,tsx,js,jsx}',
				],
				exclude: [
					'**/node_modules/**',
					'**/dist/**',
					'**/.next/**',
					'**/coverage/**',
					'**/generated/**',
					'**/*.test.*',
					'**/*.spec.*',
					'**/*.stories.*',
				],
			},
			families: {
				ui: true,
				contracts: true,
				integrations: true,
				runtime: true,
				sharedLibs: true,
				solutions: true,
			},
			thresholds: {
				workspaceReuse: 'rewrite',
				contractspecReuse: 'rewrite',
				ambiguous: 'require_review',
				newExternalDependency: 'require_review',
				newImplementation: 'require_review',
			},
		},
	},
};
