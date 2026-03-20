import { createDocsMcpHandler } from '@contractspec/bundle.library/application/mcp/docsMcp';
import { DocsFeature } from '@contractspec/bundle.library/features/docs.feature';
import { Elysia } from 'elysia';

const MCP_ROUTE_FEATURES = [DocsFeature] as const;
void MCP_ROUTE_FEATURES;

const mcpHandler = new Elysia({
	prefix: '/api',
}).use(createDocsMcpHandler('/docs'));

export const GET = mcpHandler.handle;
export const POST = mcpHandler.handle;
