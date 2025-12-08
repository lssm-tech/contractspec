import {
  createMcpServer,
  PromptRegistry,
  ResourceRegistry,
  SpecRegistry,
  createDefaultTransformEngine,
} from '@lssm/lib.contracts';
import {
  // BeginSignupSpec,
  // SignupHelpPrompt,
  buildPresentationDescriptorsV2,
} from '@lssm/lib.contracts-contractspec-studio';
// import { DocBySlug } from '@lssm/lib.contracts-content';
import { createMcpHandler } from 'mcp-handler';
import { buildPresentationRegistry } from '@lssm/lib.contracts-contractspec-studio';

export function buildMcpServer() {
  const ops = new SpecRegistry()//.register(BeginSignupSpec);
  const prompts = new PromptRegistry()//.register(SignupHelpPrompt);
  const resources = new ResourceRegistry()//.register(DocBySlug);
  const presentations = buildPresentationRegistry();
  const engine = createDefaultTransformEngine();
  const presentationsV2 = buildPresentationDescriptorsV2();

  const handler = createMcpHandler(
    (server) => {
      createMcpServer(server, ops, resources, prompts, {
        toolCtx: () => ({
          actor: 'anonymous',
          decide: async () => ({ effect: 'allow' }),
        }),
        promptCtx: () => ({ locale: 'en' }),
        resourceCtx: () => ({ locale: 'en' }),
        presentations,
        presentationsV2,
      });
    },
    {},
    { basePath: '/api' }
  );

  return { GET: handler, POST: handler, DELETE: handler };
}
