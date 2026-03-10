/**
 * AiSdkBundleAdapter implementation using ChatService.
 * Enables surface-runtime to drive chat for planner/requestPatches flows.
 */
import type { AiSdkBundleAdapter } from '@contractspec/lib.surface-runtime/adapters/interfaces';
import type { ResolvedSurfacePlan } from '@contractspec/lib.surface-runtime/runtime/resolve-bundle';
import type { SurfacePatchProposal } from '@contractspec/lib.surface-runtime/spec/types';
import { ChatService } from '../core/chat-service';
import { buildPlannerPromptInput } from '../core/surface-planner-tools';
import { compilePlannerPrompt } from '@contractspec/lib.surface-runtime/runtime/planner-prompt';
import type { Provider as ChatProvider } from '@contractspec/lib.ai-providers';

export interface CreateAiSdkBundleAdapterDeps {
  /** Provider for creating ChatService (from createProvider) */
  provider: ChatProvider;
  /** Called when a patch proposal is produced during requestPatches */
  onPatchProposal?: (proposal: SurfacePatchProposal) => void;
}

/**
 * Create an AiSdkBundleAdapter that uses ChatService for planner integration.
 * requestPatches sends the user message to the chat and collects patch proposals from tool calls.
 */
export function createAiSdkBundleAdapter(
  deps: CreateAiSdkBundleAdapterDeps
): AiSdkBundleAdapter {
  const { provider, onPatchProposal } = deps;

  return {
    startThread(_args) {
      return null;
    },

    async requestPatches(args: {
      currentPlan: ResolvedSurfacePlan;
      userMessage: string;
    }): Promise<SurfacePatchProposal[]> {
      const proposals: SurfacePatchProposal[] = [];
      const captureProposal = (p: SurfacePatchProposal) => {
        proposals.push(p);
        onPatchProposal?.(p);
      };

      const plannerInput = buildPlannerPromptInput(args.currentPlan);
      const systemPrompt = compilePlannerPrompt(plannerInput);

      const service = new ChatService({
        provider,
        systemPrompt,
        surfacePlanConfig: {
          plan: args.currentPlan,
          onPatchProposal: captureProposal,
        },
      });

      await service.send({
        content: args.userMessage,
      });

      return proposals;
    },
  };
}
