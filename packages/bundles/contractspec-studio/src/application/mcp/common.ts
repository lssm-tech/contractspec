import type {
  PromptRegistry,
  ResourceRegistry,
  SpecRegistry,
} from '@lssm/lib.contracts';
import { createMcpServer } from '@lssm/lib.contracts';
import type { PresentationDescriptorV2 } from '@lssm/lib.contracts/presentations.v2';
import { mcp } from 'elysia-mcp';
import { Logger } from '@lssm/lib.logger';

function createConsoleLikeLogger(logger: Logger) {
  const isDebug = process.env.CONTRACTSPEC_MCP_DEBUG === '1';

  const toMessage = (args: unknown[]) =>
    args.map((a) => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ');

  return {
    log: (...args: unknown[]) => {
      if (!isDebug) return;
      logger.info(toMessage(args));
    },
    info: (...args: unknown[]) => {
      if (!isDebug) return;
      logger.info(toMessage(args));
    },
    warn: (...args: unknown[]) => {
      logger.warn(toMessage(args));
    },
    error: (...args: unknown[]) => {
      logger.error(toMessage(args));
    },
    debug: (...args: unknown[]) => {
      if (!isDebug) return;
      logger.debug(toMessage(args));
    },
  };
}

interface McpHttpHandlerConfig {
  path: string;
  serverName: string;
  ops: SpecRegistry;
  resources: ResourceRegistry;
  prompts: PromptRegistry;
  presentationsV2?: PresentationDescriptorV2[];
  logger: Logger;
}

const baseCtx = {
  actor: 'anonymous' as const,
  decide: async () => ({ effect: 'allow' as const }),
};

// export function createMcpNextjsHandler({
//   path,
//   serverName,
//   ops,
//   resources,
//   prompts,
//   presentationsV2,
// }: McpHttpHandlerConfig) {
//   return createMcpHandler(
//     (server) => {
//       createMcpServer(server, ops, resources, prompts, {
//         toolCtx: () => baseCtx,
//         promptCtx: () => ({ locale: 'en' }),
//         resourceCtx: () => ({ locale: 'en' }),
//         presentationsV2,
//       });
//     },
//     {
//       serverInfo: {
//         name: serverName,
//         version: '1.0.0',
//       },
//     },
//     {
//       // basePath: path,
//       disableSse: true,
//       verboseLogs: true,
//     }
//   );
// }

export function createMcpElysiaHandler({
  logger,
  path,
  serverName,
  ops,
  resources,
  prompts,
  presentationsV2,
}: McpHttpHandlerConfig) {
  logger.info('Setting up MCP handler...');
  return mcp({
    basePath: path,
    // Do NOT use console.* in production paths; adapt to console-like interface for the plugin.
    logger: createConsoleLikeLogger(logger),
    serverInfo: {
      name: serverName,
      version: '1.0.0',
    },
    // Cursor MCP HTTP clients may not persist Mcp-Session-Id headers reliably.
    // Run in stateless + JSON response mode by default to maximize compatibility.
    // Set CONTRACTSPEC_MCP_STATEFUL=1 to restore sessionful behavior.
    stateless: process.env.CONTRACTSPEC_MCP_STATEFUL !== '1',
    enableJsonResponse: true,
    capabilities: {
      tools: {},
      resources: {},
      prompts: {},
      logging: {},
    },
    setupServer: (server) => {
      logger.info('Setting up MCP server...');
      createMcpServer(server, ops, resources, prompts, {
        logger,
        toolCtx: () => baseCtx,
        promptCtx: () => ({ locale: 'en' }),
        resourceCtx: () => ({ locale: 'en' }),
        presentationsV2,
      });
    },
  });
}
