/**
 * @lssm/app.cli-mcp-local
 *
 * Local MCP server for ContractSpec operations via stdio transport.
 * Exposes contract integrity, validation, and analysis tools to AI agents.
 */

export { createServer } from './server';
export type { McpLocalConfig } from './server';
