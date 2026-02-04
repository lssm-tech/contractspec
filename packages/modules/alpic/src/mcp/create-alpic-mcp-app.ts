import { Elysia } from 'elysia';
import { mcp } from 'elysia-mcp';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
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

export function createAlpicMcpHandler(options: AlpicMcpHandlerOptions) {
  const debug = resolveDebugFlag(options.enableDebugLogs);
  const logger = options.logger ?? createDefaultLogger(debug);

  return mcp({
    basePath: options.path,
    logger: createConsoleLikeLogger(logger, debug),
    serverInfo: {
      name: options.serverName ?? defaultServerName,
      version: options.serverVersion ?? defaultServerVersion,
    },
    stateless: options.stateless ?? true,
    enableJsonResponse: options.enableJsonResponse ?? true,
    capabilities: {
      tools: {},
      resources: {},
      prompts: {},
      logging: {},
    },
    setupServer: (server) => setupMcpServer(server, options),
  });
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
