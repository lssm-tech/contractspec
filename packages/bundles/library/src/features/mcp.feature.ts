import type { FeatureModuleSpec } from '@contractspec/lib.contracts/features';

/**
 * MCP (Model Context Protocol) integration feature for ContractSpec.
 * Enables AI agent integration through MCP tools, resources, and prompts.
 */
export const MCPFeature: FeatureModuleSpec = {
  meta: {
    key: 'contractspec.mcp',
    version: '1.0.0',
    title: 'MCP Integration',
    description: 'Model Context Protocol server for AI agent integration',
    domain: 'platform',
    owners: ['@platform.mcp'],
    tags: ['mcp', 'ai-agents', 'tooling'],
    stability: 'beta',
  },
  operations: [
    { key: 'mcp.tool.register', version: '1.0.0' },
    { key: 'mcp.resource.register', version: '1.0.0' },
    { key: 'mcp.prompt.register', version: '1.0.0' },
  ],
  events: [
    { key: 'mcp.tool_invoked', version: '1.0.0' },
    { key: 'mcp.resource_accessed', version: '1.0.0' },
  ],
  presentations: [],
  capabilities: {
    provides: [{ key: 'contracts.mcp', version: '1.0.0' }],
    requires: [{ key: 'contracts.operations', version: '1.0.0' }],
  },
};
