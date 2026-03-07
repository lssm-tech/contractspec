import { Elysia } from 'elysia';
import { appLogger } from '@contractspec/bundle.library/infrastructure/elysia/logger';
import { createDocsMcpHandler } from '@contractspec/bundle.library/application/mcp/docsMcp';
import { createCliMcpHandler } from '@contractspec/bundle.library/application/mcp/cliMcp';
import { createInternalMcpHandler } from '@contractspec/bundle.library/application/mcp/internalMcp';
import { createContractsMcpHandler } from '@contractspec/bundle.library/application/mcp/contractsMcp';
import { createContractsMcpServices } from './contracts-mcp-services';

const contractsServices = createContractsMcpServices();

export const mcpHandler = new Elysia()
  .use(createDocsMcpHandler('/mcp/docs'))
  .use(createCliMcpHandler('/mcp/cli'))
  .use(createInternalMcpHandler('/mcp/internal'))
  .use(createContractsMcpHandler('/mcp/contracts', contractsServices));

// Also mount the legacy /api/mcp/* paths (Cursor MCP clients often use /api/* by default).
mcpHandler.use(createDocsMcpHandler('/api/mcp/docs'));
mcpHandler.use(createCliMcpHandler('/api/mcp/cli'));
mcpHandler.use(createInternalMcpHandler('/api/mcp/internal'));
mcpHandler.use(
  createContractsMcpHandler('/api/mcp/contracts', contractsServices)
);

appLogger.warn(
  'CLI and internal MCP handlers are disabled in api-library deployment.'
);

// Lightweight request logging for MCP endpoints (gate verbosity via env).
mcpHandler.onRequest(({ request }) => {
  const url = new URL(request.url);
  if (
    !url.pathname.startsWith('/mcp/') &&
    !url.pathname.startsWith('/api/mcp/')
  )
    return;

  const debug = process.env.CONTRACTSPEC_MCP_DEBUG === '1';
  if (!debug) return;

  appLogger.info('MCP request received', {
    path: url.pathname,
    method: request.method,
    contentType: request.headers.get('content-type') ?? undefined,
    userAgent: request.headers.get('user-agent') ?? undefined,
    clientId: request.headers.get('x-contractspec-client-id') ?? undefined,
    mcpSessionId: request.headers.get('mcp-session-id') ?? undefined,
    mcpProtocolVersion:
      request.headers.get('mcp-protocol-version') ?? undefined,
  });
});

mcpHandler.onAfterHandle(async ({ request, response }) => {
  const url = new URL(request.url);
  if (
    !url.pathname.startsWith('/mcp/') &&
    !url.pathname.startsWith('/api/mcp/')
  )
    return;

  const debug = process.env.CONTRACTSPEC_MCP_DEBUG === '1';
  if (!debug) return;

  const status = response instanceof Response ? response.status : undefined;
  appLogger.info('MCP response sent', {
    path: url.pathname,
    method: request.method,
    status,
  });
});

mcpHandler.onError(({ request, error }) => {
  const url = new URL(request.url);
  if (
    !url.pathname.startsWith('/mcp/') &&
    !url.pathname.startsWith('/api/mcp/')
  )
    return;

  appLogger.error('MCP request error', {
    path: url.pathname,
    method: request.method,
    error: error instanceof Error ? error.message : String(error),
  });
});
