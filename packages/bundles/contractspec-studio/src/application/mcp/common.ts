import type {
  PromptRegistry,
  ResourceRegistry,
  SpecRegistry,
} from '@lssm/lib.contracts';
import { createMcpServer } from '@lssm/lib.contracts';
import type { PresentationDescriptorV2 } from '@lssm/lib.contracts/presentations.v2';
import { createMcpHandler } from 'mcp-handler';

interface McpHttpHandlerConfig {
  path: string;
  serverName: string;
  ops: SpecRegistry;
  resources: ResourceRegistry;
  prompts: PromptRegistry;
  presentationsV2?: PresentationDescriptorV2[];
}

const baseCtx = {
  actor: 'anonymous' as const,
  decide: async () => ({ effect: 'allow' as const }),
};

export function createMcpHttpHandler({
  path,
  serverName,
  ops,
  resources,
  prompts,
  presentationsV2,
}: McpHttpHandlerConfig) {
  return createMcpHandler(
    (server) => {
      createMcpServer(server, ops, resources, prompts, {
        toolCtx: () => baseCtx,
        promptCtx: () => ({ locale: 'en' }),
        resourceCtx: () => ({ locale: 'en' }),
        presentationsV2,
      });
    },
    {
      serverInfo: {
        name: serverName,
        version: '1.0.0',
      },
    },
    {
      streamableHttpEndpoint: path,
      disableSse: true,
    }
  );
}
