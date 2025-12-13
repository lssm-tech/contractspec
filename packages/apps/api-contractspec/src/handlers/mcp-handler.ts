import { Elysia } from 'elysia';
import { createDocsMcpHandler } from '@lssm/bundle.contractspec-studio/application';
import { trackMcpRequest } from './telemetry-handler';

// const cliMcpHandler = createCliMcpHandler('/mcp/cli');
// const internalMcpHandler = createInternalMcpHandler('/mcp/internal');

/**
 * Wrap an MCP handler with telemetry tracking.
 */
function withTelemetry(
  endpoint: string,
  handler: (request: Request) => Response | Promise<Response>
) {
  return async (request: Request): Promise<Response> => {
    const startTime = performance.now();
    const clientId =
      request.headers.get('x-contractspec-client-id') ?? undefined;
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

export const mcpHandler = new Elysia().use(createDocsMcpHandler('/mcp/docs'));
// .use(cliMcpHandler)
// .use(internalMcpHandler);
