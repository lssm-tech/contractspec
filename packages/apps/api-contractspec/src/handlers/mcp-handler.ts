import { Elysia } from 'elysia';
import {
  createCliMcpHandler,
  createDocsMcpHandler,
  createInternalMcpHandler,
} from '@lssm/bundle.contractspec-studio/application';
import { trackMcpRequest } from './telemetry-handler';

const docsMcpHandler = createDocsMcpHandler('/api/mcp/docs');
const cliMcpHandler = createCliMcpHandler('/api/mcp/cli');
const internalMcpHandler = createInternalMcpHandler('/api/mcp/internal');

/**
 * Wrap an MCP handler with telemetry tracking.
 */
function withTelemetry(
  endpoint: string,
  handler: (request: Request) => Response | Promise<Response>
) {
  return async (request: Request): Promise<Response> => {
    const startTime = performance.now();
    const clientId = request.headers.get('x-contractspec-client-id') ?? undefined;
    let method = 'unknown';

    try {
      // Try to extract method from request body
      const clonedRequest = request.clone();
      const body = await clonedRequest.json().catch(() => ({}));
      method = body.method ?? 'unknown';
    } catch {
      // Ignore parse errors
    }

    let success = true;
    try {
      const response = await handler(request);
      success = response.ok;
      return response;
    } catch (error) {
      success = false;
      throw error;
    } finally {
      const durationMs = performance.now() - startTime;
      // Fire and forget - don't block the response
      trackMcpRequest(endpoint, method, success, durationMs, clientId).catch(
        () => {}
      );
    }
  };
}

const mcpRoutesHandler = new Elysia()
  .post('/docs', ({ request }) => withTelemetry('docs', docsMcpHandler)(request))
  .post('/cli', ({ request }) => withTelemetry('cli', cliMcpHandler)(request))
  .post('/internal', ({ request }) =>
    withTelemetry('internal', internalMcpHandler)(request)
  );

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
