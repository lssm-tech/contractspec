import { Elysia } from 'elysia';
import {
  createCliMcpHandler,
  createDocsMcpHandler,
  createInternalMcpHandler,
} from '@lssm/bundle.contractspec-studio/application';

const docsMcpHandler = createDocsMcpHandler('/api/mcp/docs');
const cliMcpHandler = createCliMcpHandler('/api/mcp/cli');
const internalMcpHandler = createInternalMcpHandler('/api/mcp/internal');

const mcpRoutesHandler = new Elysia()
  .post('/docs', ({ request }) => docsMcpHandler(request))
  .post('/cli', ({ request }) => cliMcpHandler(request))
  .post('/internal', ({ request }) => internalMcpHandler(request));

const withApiPrefixHandler = new Elysia().group('/api/mcp', (app) =>
  app.use(mcpRoutesHandler).get('*', () => {
    return new Response(
      'MCP endpoints are available at /api/mcp/docs, /api/mcp/cli, and /api/mcp/internal (using POST requests)',
      { status: 200 }
    );
  })
);
const withoutApiPrefixHandler = new Elysia().group('/mcp', (app) =>
  app.use(mcpRoutesHandler).get('*', () => {
    return new Response(
      'MCP endpoints are available at /mcp/docs, /mcp/cli, and /mcp/internal (using POST requests)',
      { status: 200 }
    );
  })
);

export const mcpHandler = new Elysia()
  .use(withApiPrefixHandler)
  .use(withoutApiPrefixHandler);
