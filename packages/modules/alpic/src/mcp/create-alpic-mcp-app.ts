import { randomUUID } from 'node:crypto';
import { Elysia } from 'elysia';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { Logger, LogLevel } from '@contractspec/lib.logger';
import { type AlpicMcpUiConfig, registerAlpicResources } from './resources';
import { type AlpicMcpToolConfig, registerAlpicTools } from './tools';

export interface AlpicMcpAppOptions {
  serverName?: string;
  serverVersion?: string;
  basePaths?: string[];
  stateless?: boolean;
  enableJsonResponse?: boolean;
  enableDebugLogs?: boolean;
  ui?: AlpicMcpUiConfig;
  tool?: AlpicMcpToolConfig;
  logger?: Logger;
}

export interface AlpicMcpHandlerOptions extends AlpicMcpAppOptions {
  path: string;
}

interface McpSessionState {
  server: McpServer;
  transport: WebStandardStreamableHTTPServerTransport;
}

const defaultServerName = 'contractspec-alpic-mcp';
const defaultServerVersion = '1.0.0';

function resolveDebugFlag(explicit?: boolean): boolean {
  if (typeof explicit === 'boolean') return explicit;
  return (
    process.env.ALPIC_MCP_DEBUG === '1' ||
    process.env.CONTRACTSPEC_MCP_DEBUG === '1'
  );
}

function createDefaultLogger(debug: boolean): Logger {
  return new Logger({
    level: debug ? LogLevel.DEBUG : LogLevel.INFO,
    environment:
      (process.env.NODE_ENV as 'production' | 'development' | 'test') ||
      'development',
    enableTracing: false,
    enableTiming: false,
    enableContext: false,
    enableColors: process.env.NODE_ENV !== 'production',
  });
}

function createConsoleLikeLogger(logger: Logger, debug: boolean) {
  const toMessage = (args: unknown[]) =>
    args
      .map((item) => (typeof item === 'string' ? item : JSON.stringify(item)))
      .join(' ');

  return {
    log: (...args: unknown[]) => {
      if (!debug) return;
      logger.info(toMessage(args));
    },
    info: (...args: unknown[]) => {
      if (!debug) return;
      logger.info(toMessage(args));
    },
    warn: (...args: unknown[]) => {
      logger.warn(toMessage(args));
    },
    error: (...args: unknown[]) => {
      logger.error(toMessage(args));
    },
    debug: (...args: unknown[]) => {
      if (!debug) return;
      logger.debug(toMessage(args));
    },
  };
}

function setupMcpServer(
  server: McpServer,
  options: AlpicMcpHandlerOptions
): void {
  registerAlpicTools(server, options.tool);
  registerAlpicResources(server, options.ui);
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
  options: AlpicMcpHandlerOptions,
  stateful: boolean
): Promise<McpSessionState> {
  const server = new McpServer(
    {
      name: options.serverName ?? defaultServerName,
      version: options.serverVersion ?? defaultServerVersion,
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
  setupMcpServer(server, options);
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: stateful ? () => randomUUID() : undefined,
    enableJsonResponse: options.enableJsonResponse ?? true,
  });

  return server.connect(transport).then(() => ({ server, transport }));
}

async function closeSessionState(state: McpSessionState): Promise<void> {
  await Promise.allSettled([state.transport.close(), state.server.close()]);
}

function sanitizePathForName(path: string): string {
  return path.replace(/[^a-zA-Z0-9]+/g, '-');
}

export function createAlpicMcpHandler(options: AlpicMcpHandlerOptions): Elysia {
  const debug = resolveDebugFlag(options.enableDebugLogs);
  const logger = options.logger ?? createDefaultLogger(debug);
  const stateless = options.stateless ?? true;
  const sessions = new Map<string, McpSessionState>();
  const pluginName = `alpic-mcp-handler-${sanitizePathForName(options.path)}`;

  async function handleStateless(request: Request): Promise<Response> {
    const state = await createSessionState(options, false);
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
      state = await createSessionState(options, true);
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

  const transportLogger = createConsoleLikeLogger(logger, debug);

  return new Elysia({ name: pluginName }).all(
    options.path,
    async ({ request }) => {
      try {
        if (stateless) {
          return await handleStateless(request);
        }

        return await handleStateful(request);
      } catch (error) {
        transportLogger.error('Error handling MCP request', {
          path: options.path,
          method: request.method,
          error:
            error instanceof Error
              ? (error.stack ?? error.message)
              : String(error),
        });
        return createJsonRpcErrorResponse(500, -32000, 'Internal error');
      }
    }
  );
}

export function createAlpicMcpApp(options: AlpicMcpAppOptions = {}): Elysia {
  const app = new Elysia();
  const basePaths = options.basePaths ?? ['/', '/mcp'];

  basePaths.forEach((path) => {
    app.use(
      createAlpicMcpHandler({
        ...options,
        path,
      })
    );
  });

  return app;
}
