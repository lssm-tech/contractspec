import { Elysia } from 'elysia';
import { createDocsMcpHandler } from '@contractspec/bundle.library/application/mcp/docsMcp';
import { appLogger } from '@contractspec/bundle.library/infrastructure/elysia/logger';

export const mcpHandler = new Elysia().use(createDocsMcpHandler('/mcp/docs'));

// Also mount the legacy /api/mcp/docs path (Cursor MCP clients often use /api/* by default).
// Keep both mounted to avoid breaking existing integrations.
mcpHandler.use(createDocsMcpHandler('/api/mcp/docs'));

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
