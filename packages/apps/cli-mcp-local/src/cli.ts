#!/usr/bin/env node
/**
 * CLI entry point for the ContractSpec local MCP server.
 *
 * Uses stdio transport for communication with AI agents (Cursor, Claude Desktop).
 */

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer } from './server';

async function main(): Promise<void> {
  const workspaceRoot = process.cwd();

  const server = createServer({ workspaceRoot });

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`Fatal error: ${message}\n`);
  process.exit(1);
});

