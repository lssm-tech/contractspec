import type {
  PromptRegistry,
  ResourceRegistry,
  SpecRegistry,
} from '@lssm/lib.contracts';
import { createMcpServer } from '@lssm/lib.contracts';
import type { PresentationDescriptorV2 } from '@lssm/lib.contracts/presentations.v2';
import { mcp } from 'elysia-mcp';
import { Logger } from '@lssm/lib.logger';

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
    logger: console,
    serverInfo: {
      name: serverName,
      version: '1.0.0',
    },
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
