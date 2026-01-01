import { Elysia } from 'elysia';
import {
  createCliMcpHandler,
  createDocsMcpHandler,
  createInternalMcpHandler,
} from '@contractspec/bundle.library/application/mcp';
import { appLogger } from '@contractspec/bundle.library/infrastructure/elysia/logger';

export const mcpHandler = new Elysia({
  prefix: '/api',
})
  .use(createDocsMcpHandler('/mcp'))
