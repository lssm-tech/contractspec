/**
 * MCP handler for the agentpacks registry.
 *
 * Creates an Elysia plugin that mounts the MCP server at a given base path.
 */
import { randomUUID } from 'node:crypto';
import { Elysia } from 'elysia';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { registerTools } from './tools';
import { registerResources } from './resources';
import { registerPrompts } from './prompts';

export interface RegistryMcpOptions {
  /** Base path for the MCP endpoint (default: "/mcp") */
  basePath?: string;
  /** Run in stateless mode (default: true) */
  stateless?: boolean;
  /** Enable JSON response format (default: true) */
  enableJsonResponse?: boolean;
}

interface McpSessionState {
  server: McpServer;
  transport: WebStandardStreamableHTTPServerTransport;
}

function setupMcpServer(server: McpServer): void {
  registerTools(server);
  registerResources(server);
  registerPrompts(server);
}

function createJsonRpcErrorResponse(
  status: number,
  code: number,
  message: string
): Response {
  return new Response(
    JSON.stringify({
      jsonrpc: '2.0',
      error: {
        code,
        message,
      },
      id: null,
    }),
    {
      status,
      headers: {
        'content-type': 'application/json',
      },
    }
  );
}

function createSessionState(
  stateless: boolean,
  enableJsonResponse: boolean
): Promise<McpSessionState> {
  const server = new McpServer(
    {
      name: 'agentpacks-registry-mcp',
      version: '0.1.0',
    },
    {
      capabilities: {
        tools: {},
        resources: {},
        prompts: {},
      },
    }
  );

  setupMcpServer(server);

  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: stateless ? undefined : () => randomUUID(),
    enableJsonResponse,
  });

  return server.connect(transport).then(() => ({ server, transport }));
}

async function closeSessionState(state: McpSessionState): Promise<void> {
  await Promise.allSettled([state.transport.close(), state.server.close()]);
}

/**
 * Creates the Elysia MCP plugin for the agentpacks registry.
 *
 * Usage:
 * ```ts
 * import { createRegistryMcpHandler } from "./mcp/handler";
 * app.use(createRegistryMcpHandler());
 * ```
 */
export function createRegistryMcpHandler(options: RegistryMcpOptions = {}) {
  const {
    basePath = '/mcp',
    stateless = true,
    enableJsonResponse = true,
  } = options;
  const sessions = new Map<string, McpSessionState>();
  const pluginName = `registry-mcp-handler-${basePath.replace(/[^a-zA-Z0-9]+/g, '-')}`;

  async function handleStateless(request: Request): Promise<Response> {
    const state = await createSessionState(true, enableJsonResponse);

    try {
      return await state.transport.handleRequest(request);
    } finally {
      await closeSessionState(state);
    }
  }

  async function closeSession(sessionId: string): Promise<void> {
    const state = sessions.get(sessionId);
    if (!state) return;
    sessions.delete(sessionId);
    await closeSessionState(state);
  }

  async function handleStateful(request: Request): Promise<Response> {
    const requestedSessionId = request.headers.get('mcp-session-id');
    let state: McpSessionState;
    let createdState = false;

    if (requestedSessionId) {
      const existing = sessions.get(requestedSessionId);
      if (!existing) {
        return createJsonRpcErrorResponse(404, -32001, 'Session not found');
      }
      state = existing;
    } else {
      state = await createSessionState(false, enableJsonResponse);
      createdState = true;
    }

    try {
      const response = await state.transport.handleRequest(request);
      const activeSessionId = state.transport.sessionId;

      if (activeSessionId && !sessions.has(activeSessionId)) {
        sessions.set(activeSessionId, state);
      }

      if (request.method === 'DELETE' && activeSessionId) {
        await closeSession(activeSessionId);
      } else if (!activeSessionId && createdState) {
        await closeSessionState(state);
      }

      return response;
    } catch (error) {
      if (createdState) {
        await closeSessionState(state);
      }
      throw error;
    }
  }

  return new Elysia({ name: pluginName }).all(basePath, async ({ request }) => {
    try {
      if (stateless) {
        return await handleStateless(request);
      }

      return await handleStateful(request);
    } catch (error) {
      console.error('registry-mcp.request.error', {
        path: basePath,
        method: request.method,
        error:
          error instanceof Error
            ? (error.stack ?? error.message)
            : String(error),
      });
      return createJsonRpcErrorResponse(500, -32000, 'Internal error');
    }
  });
}
