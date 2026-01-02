import { Elysia } from 'elysia';
import { createDocsMcpHandler } from '@contractspec/bundle.library/application/mcp/docsMcp';

export const mcpHandler = new Elysia({
  prefix: '/api',
}).use(createDocsMcpHandler('/mcp'));
