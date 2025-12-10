import type { DocBlock } from '@lssm/lib.contracts/docs';
import { registerDocBlocks } from '../registry';

export const tech_mcp_endpoints_DocBlocks: DocBlock[] = [
  {
    id: 'docs.tech.mcp.endpoints',
    title: 'ContractSpec MCP endpoints',
    summary:
      'Dedicated MCP servers for docs, CLI usage, and internal development.',
    kind: 'reference',
    visibility: 'mixed',
    route: '/docs/tech/mcp/endpoints',
    tags: ['mcp', 'docs', 'cli', 'internal'],
    body: `# ContractSpec MCP endpoints

Three dedicated MCP servers keep AI agents efficient and scoped:

- **Docs MCP**: \`/api/mcp/docs\` — exposes DocBlocks as resources + presentations. Tool: \`docs.search\`.
- **CLI MCP**: \`/api/mcp/cli\` — surfaces CLI quickstart/reference/README and suggests commands. Tool: \`cli.suggestCommand\`.
- **Internal MCP**: \`/api/mcp/internal\` — internal routing hints and playbook. Tool: \`internal.describe\`.

### Usage notes
- Transports are HTTP POST (streamable HTTP); SSE is disabled.
- Resources are namespaced (\`docs://*\`, \`cli://*\`, \`internal://*\`) and are read-only.
- Prompts mirror each surface (navigator, usage, bootstrap) for quick agent onboarding.
- GraphQL remains at \`/graphql\`; health at \`/health\`.
`,
  },
];

registerDocBlocks(tech_mcp_endpoints_DocBlocks);

