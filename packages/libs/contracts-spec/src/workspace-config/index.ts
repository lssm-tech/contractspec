/**
 * Configuration module exports.
 */

import type { DocBlock } from '../docs/types';

export type {
	AgentTarget,
	ReleaseEnforceOn,
} from '../versioning/release-types';
export {
	AgentTargetSchema,
	ReleaseEnforceOnSchema,
} from '../versioning/schema';
export {
	type BuilderApiConfig,
	BuilderApiConfigSchema,
	type BuilderBootstrapPreset,
	BuilderBootstrapPresetSchema,
	type BuilderConfig,
	BuilderConfigSchema,
	type BuilderLocalRuntimeConfig,
	BuilderLocalRuntimeConfigSchema,
	type BuilderRuntimeMode,
	BuilderRuntimeModeSchema,
	type BumpStrategy,
	BumpStrategySchema,
	type ChangelogFormat,
	ChangelogFormatSchema,
	type ChangelogTier,
	ChangelogTierSchema,
	type ConnectAdapterConfig,
	ConnectAdapterConfigSchema,
	type ConnectAdapterMode,
	ConnectAdapterModeSchema,
	type ConnectAdoptionCatalogConfig,
	ConnectAdoptionCatalogConfigSchema,
	type ConnectAdoptionConfig,
	ConnectAdoptionConfigSchema,
	type ConnectAdoptionFamiliesConfig,
	ConnectAdoptionFamiliesConfigSchema,
	type ConnectAdoptionFamily,
	ConnectAdoptionFamilySchema,
	type ConnectAdoptionThresholds,
	ConnectAdoptionThresholdsSchema,
	type ConnectAdoptionWorkspaceScanConfig,
	ConnectAdoptionWorkspaceScanConfigSchema,
	type ConnectCanonPackRef,
	ConnectCanonPackRefSchema,
	type ConnectCommandPolicy,
	ConnectCommandPolicySchema,
	type ConnectConfig,
	ConnectConfigSchema,
	type ConnectPolicyConfig,
	ConnectPolicyConfigSchema,
	type ConnectReviewThresholds,
	ConnectReviewThresholdsSchema,
	type ConnectStorageConfig,
	ConnectStorageConfigSchema,
	type ConnectStudioConfig,
	ConnectStudioConfigSchema,
	type ConnectVerdict,
	ConnectVerdictSchema,
	type ContractsrcConfig,
	type ContractsrcFileConfig,
	ContractsrcSchema,
	DEFAULT_CONTRACTSRC,
	type FolderConventions,
	FolderConventionsSchema,
	type FormatterConfig,
	FormatterConfigSchema,
	type FormatterType,
	FormatterTypeSchema,
	type OpenApiConfig,
	OpenApiConfigSchema,
	type OpenApiExportConfig,
	OpenApiExportConfigSchema,
	type OpenApiSourceConfig,
	OpenApiSourceConfigSchema,
	type ReleaseConfig,
	ReleaseConfigSchema,
	type ResolvedContractsrcConfig,
	type RuleSyncConfig,
	RuleSyncConfigSchema,
	type RuleSyncTarget,
	RuleSyncTargetSchema,
	type SchemaFormat,
	SchemaFormatSchema,
	type SpecKind,
	SpecKindSchema,
	type UpgradeConfig,
	UpgradeConfigSchema,
	type VersioningConfig,
	VersioningConfigSchema,
} from './contractsrc-schema';
export type {
	AgentMode,
	AgentProvider,
} from './contractsrc-types';

export const tech_workspace_config_DocBlocks: DocBlock[] = [
	{
		id: 'docs.tech.contracts.workspace-config',
		title: 'Workspace Configuration (.contractsrc)',
		summary:
			'Configuration-as-code conventions for ContractSpec workspaces (`.contractsrc.json`).',
		kind: 'reference',
		visibility: 'public',
		route: '/docs/tech/contracts/workspace-config',
		tags: ['tech', 'contracts', 'config'],
		body: `## Workspace Configuration (.contractsrc)

ContractSpec uses a hierarchical configuration system anchored by \`.contractsrc.json\` files. Configuration loader supports standard rc-file discovery (cosmiconfig).

### Schema Formats

The \`schemaFormat\` option controls the output format of schema generation commands (like \`contractspec openapi import\`).

Supported formats:
- \`contractspec\` (default): Generates standard \`defineSchemaModel\` code.
- \`zod\`: Generates raw Zod schemas using \`z.object({...})\`.
- \`json-schema\`: Generates JSON Schema definitions.
- \`graphql\`: Generates GraphQL SDL type definitions.

### Config Interface

\`\`\`ts
export interface ContractsrcConfig {
  // ... existing fields ...
  schemaFormat?: 'contractspec' | 'zod' | 'json-schema' | 'graphql';
}
\`\`\`

Defined in \`@contractspec/lib.contracts-spec/workspace-config\`.

### Connect

The \`connect\` section configures ContractSpec Connect as a codebase-aligned adapter layer inside the existing CLI and runtime stack.

\`\`\`ts
export interface ContractsrcConfig {
  connect?: {
    enabled?: boolean;
    adapters?: {
      cursor?: { enabled?: boolean; mode?: 'plugin' | 'rule' | 'wrapper' };
      codex?: { enabled?: boolean; mode?: 'plugin' | 'rule' | 'wrapper' };
      'claude-code'?: { enabled?: boolean; mode?: 'plugin' | 'rule' | 'wrapper' };
    };
    storage?: {
      root?: string;
      contextPack?: string;
      planPacket?: string;
      patchVerdict?: string;
      auditFile?: string;
      reviewPacketsDir?: string;
    };
    policy?: {
      protectedPaths?: string[];
      immutablePaths?: string[];
      generatedPaths?: string[];
      smokeChecks?: string[];
      reviewThresholds?: {
        protectedPathWrite?: 'permit' | 'rewrite' | 'require_review' | 'deny';
        unknownImpact?: 'permit' | 'rewrite' | 'require_review' | 'deny';
        contractDrift?: 'permit' | 'rewrite' | 'require_review' | 'deny';
        breakingChange?: 'permit' | 'rewrite' | 'require_review' | 'deny';
        destructiveCommand?: 'permit' | 'rewrite' | 'require_review' | 'deny';
      };
    };
    commands?: {
      allow?: string[];
      review?: string[];
      deny?: string[];
    };
    canonPacks?: Array<{ ref: string; readOnly?: boolean }>;
    studio?: { enabled?: boolean; mode?: 'off' | 'review-bridge'; endpoint?: string; queue?: string };
    adoption?: {
      enabled?: boolean;
      catalog?: {
        indexPath?: string;
        overrideManifestPath?: string;
      };
      workspaceScan?: {
        include?: string[];
        exclude?: string[];
      };
      families?: {
        ui?: boolean;
        contracts?: boolean;
        integrations?: boolean;
        runtime?: boolean;
        sharedLibs?: boolean;
        solutions?: boolean;
      };
      thresholds?: {
        workspaceReuse?: 'permit' | 'rewrite' | 'require_review' | 'deny';
        contractspecReuse?: 'permit' | 'rewrite' | 'require_review' | 'deny';
        ambiguous?: 'permit' | 'rewrite' | 'require_review' | 'deny';
        newExternalDependency?: 'permit' | 'rewrite' | 'require_review' | 'deny';
        newImplementation?: 'permit' | 'rewrite' | 'require_review' | 'deny';
      };
    };
  };
}
\`\`\`

### Builder

The \`builder\` section configures preset-driven Builder onboarding without requiring live bootstrap during setup.

\`\`\`ts
export interface ContractsrcConfig {
  builder?: {
    enabled?: boolean;
    runtimeMode?: 'managed' | 'local' | 'hybrid';
    bootstrapPreset?: 'managed_mvp' | 'local_daemon_mvp' | 'hybrid_mvp';
    api?: {
      baseUrl?: string;
      controlPlaneTokenEnvVar?: string;
    };
    localRuntime?: {
      runtimeId?: string;
      grantedTo?: string;
      providerIds?: string[];
    };
  };
}
\`\`\`
`,
	},
];
