/**
 * Configuration module exports.
 */

import type { DocBlock } from '../docs/types';

export {
	type BumpStrategy,
	BumpStrategySchema,
	type ChangelogFormat,
	ChangelogFormatSchema,
	type ChangelogTier,
	ChangelogTierSchema,
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
	type ResolvedContractsrcConfig,
	type RuleSyncConfig,
	RuleSyncConfigSchema,
	type RuleSyncTarget,
	RuleSyncTargetSchema,
	type SchemaFormat,
	SchemaFormatSchema,
	type VersioningConfig,
	VersioningConfigSchema,
} from './contractsrc-schema';
export type { AgentMode, AgentProvider } from './contractsrc-types';

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
`,
	},
];
