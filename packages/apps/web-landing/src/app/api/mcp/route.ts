import { Elysia } from 'elysia';
import { createDocsMcpHandler } from '@contractspec/bundle.library/application/mcp/docsMcp';

const mcpHandler = new Elysia({
  prefix: '/api',
}).use(createDocsMcpHandler('/mcp'));

export const GET = mcpHandler.handle;
export const POST = mcpHandler.handle;
