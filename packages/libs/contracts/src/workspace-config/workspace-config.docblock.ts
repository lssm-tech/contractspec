import type { DocBlock } from '@lssm/lib.contracts/docs';
import { registerDocBlocks } from '../docs/registry';

export const tech_workspace_config_DocBlocks: DocBlock[] = [
  {
    id: 'docs.tech.contracts.workspace-config',
    title: 'Workspace Configuration (.contractsrc)',
    summary: 'Configuration-as-code conventions for ContractSpec workspaces (`.contractsrc.json`).',
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

Defined in \`@lssm/lib.contracts/workspace-config\`.
`,
  },
];

registerDocBlocks(tech_workspace_config_DocBlocks);
