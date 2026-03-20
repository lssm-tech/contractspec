import { createDocsMcpHandler } from '@contractspec/bundle.library/application/mcp/docsMcp';
import { Elysia } from 'elysia';

const mcpHandler = new Elysia({
	prefix: '/api',
}).use(createDocsMcpHandler('/docs'));

export const GET = mcpHandler.handle;
export const POST = mcpHandler.handle;
