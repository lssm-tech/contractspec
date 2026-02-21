import type {
  OperationSpecRegistry,
  PromptRegistry,
  ResourceRegistry,
} from '@contractspec/lib.contracts-spec';
import { PresentationRegistry } from '@contractspec/lib.contracts-spec/presentations';
import { createMcpServer } from '@contractspec/lib.contracts-runtime-server-mcp/provider-mcp';
import type { PresentationSpec } from '@contractspec/lib.contracts-spec/presentations';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { Elysia } from 'elysia';
import { Logger } from '@contractspec/lib.logger';
import { randomUUID } from 'node:crypto';

interface McpHttpHandlerConfig {
  path: string;
  serverName: string;
  ops: OperationSpecRegistry;
  resources: ResourceRegistry;
  prompts: PromptRegistry;
  presentations?: PresentationSpec[];
  logger: Logger;
}

const baseCtx = {
  actor: 'anonymous' as const,
  decide: async () => ({ effect: 'allow' as const }),
};

interface McpSessionState {
  server: McpServer;
  transport: WebStandardStreamableHTTPServerTransport;
}

function createJsonRpcErrorResponse(
  status: number,
  code: number,
  message: string,
  data?: string
) {
  return new Response(
    JSON.stringify({
      jsonrpc: '2.0',
      error: {
        code,
        message,
        ...(data ? { data } : {}),
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

function createSessionState({
  logger,
  serverName,
  ops,
  resources,
  prompts,
  presentations,
  stateful,
}: McpHttpHandlerConfig & { stateful: boolean }): Promise<McpSessionState> {
  const server = new McpServer(
    {
      name: serverName,
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
        resources: {},
        prompts: {},
        logging: {},
      },
    }
  );

  logger.info('Setting up MCP server...');
  createMcpServer(server, ops, resources, prompts, {
    logger,
    toolCtx: () => baseCtx,
    promptCtx: () => ({ locale: 'en' }),
    resourceCtx: () => ({ locale: 'en' }),
    presentations: new PresentationRegistry(presentations),
  });

  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: stateful ? () => randomUUID() : undefined,
    enableJsonResponse: true,
  });

  return server.connect(transport).then(() => ({ server, transport }));
}

async function closeSessionState(state: McpSessionState) {
  await Promise.allSettled([state.transport.close(), state.server.close()]);
}

function toErrorMessage(error: unknown) {
  return error instanceof Error
    ? (error.stack ?? error.message)
    : String(error);
}

export function createMcpElysiaHandler({
  logger,
  path,
  serverName,
  ops,
  resources,
  prompts,
  presentations,
}: McpHttpHandlerConfig) {
  logger.info('Setting up MCP handler...');

  const isStateful = process.env.CONTRACTSPEC_MCP_STATEFUL === '1';
  const sessions = new Map<string, McpSessionState>();

  async function handleStateless(request: Request) {
    const state = await createSessionState({
      logger,
      path,
      serverName,
      ops,
      resources,
      prompts,
      presentations,
      stateful: false,
    });

    try {
      return await state.transport.handleRequest(request);
    } finally {
      await closeSessionState(state);
    }
  }

  async function closeSession(sessionId: string) {
    const state = sessions.get(sessionId);
    if (!state) return;
    sessions.delete(sessionId);
    await closeSessionState(state);
  }

  async function handleStateful(request: Request) {
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
      state = await createSessionState({
        logger,
        path,
        serverName,
        ops,
        resources,
        prompts,
        presentations,
        stateful: true,
      });
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

  return new Elysia({ name: `mcp-${serverName}` }).all(
    path,
    async ({ request }) => {
      try {
        if (isStateful) {
          return await handleStateful(request);
        }

        return await handleStateless(request);
      } catch (error) {
        logger.error('Error handling MCP request', {
          path,
          method: request.method,
          error: toErrorMessage(error),
        });

        return createJsonRpcErrorResponse(500, -32000, 'Internal error');
      }
    }
  );
}
