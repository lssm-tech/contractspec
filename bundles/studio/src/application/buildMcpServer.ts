import {
  createMcpServer,
  OperationSpecRegistry,
  PromptRegistry,
  ResourceRegistry,
} from '@contractspec/lib.contracts';
import { Logger } from '@contractspec/lib.logger';
import { buildPresentationRegistry } from '@contractspec/lib.contracts-studio';
import { createMcpHandler } from 'mcp-handler';

export function buildMcpServer() {
  const logger = new Logger({ environment: 'development' });
  const ops = new OperationSpecRegistry(); //.register(BeginSignupSpec);
  const prompts = new PromptRegistry(); //.register(SignupHelpPrompt);
  const resources = new ResourceRegistry(); //.register(DocBySlug);
  const presentations = buildPresentationRegistry();

  const handler = createMcpHandler(
    (server) => {
      createMcpServer(server, ops, resources, prompts, {
        logger,
        toolCtx: () => ({
          actor: 'anonymous',
          decide: async () => ({ effect: 'allow' }),
        }),
        promptCtx: () => ({ locale: 'en' }),
        resourceCtx: () => ({ locale: 'en' }),
        presentations,
      });
    },
    {},
    { basePath: '/api' }
  );

  return { GET: handler, POST: handler, DELETE: handler };
}
