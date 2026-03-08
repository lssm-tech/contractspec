/**
 * Planner tool schemas for ContractSpecAgent/AgentSpec.
 * Maps to AgentToolConfig; tool handlers are wired by the bundle layer.
 * Aligns with 07_ai_native_chat_and_generative_ui.md.
 */

import type { SurfacePatchProposal } from '../spec/types';

/** Compatible with AgentToolConfig from @contractspec/lib.ai-agent. */
export interface PlannerToolConfig {
  name: string;
  description?: string;
  schema?: Record<string, unknown>;
  automationSafe?: boolean;
  requiresApproval?: boolean;
}

/** JSON Schema for propose-patch tool parameters. */
export const PROPOSE_PATCH_TOOL_SCHEMA = {
  type: 'object',
  properties: {
    proposalId: { type: 'string', description: 'Unique proposal identifier' },
    ops: {
      type: 'array',
      description: 'Surface patch operations to propose',
      items: {
        type: 'object',
        required: ['op'],
        properties: {
          op: {
            type: 'string',
            enum: [
              'insert-node',
              'replace-node',
              'remove-node',
              'move-node',
              'resize-panel',
              'set-layout',
              'reveal-field',
              'hide-field',
              'promote-action',
              'set-focus',
            ],
          },
          slotId: { type: 'string' },
          nodeId: { type: 'string' },
          toSlotId: { type: 'string' },
          index: { type: 'number' },
          node: {
            type: 'object',
            properties: {
              nodeId: { type: 'string' },
              kind: { type: 'string' },
              title: { type: 'string' },
              props: { type: 'object' },
              children: { type: 'array' },
            },
          },
          persistKey: { type: 'string' },
          sizes: { type: 'array', items: { type: 'number' } },
          layoutId: { type: 'string' },
          fieldId: { type: 'string' },
          actionId: { type: 'string' },
          placement: {
            type: 'string',
            enum: ['header', 'inline', 'context', 'assistant'],
          },
          targetId: { type: 'string' },
        },
      },
    },
  },
  required: ['proposalId', 'ops'],
} as const;

/**
 * Tool config for propose-patch. Use with ContractSpecAgent toolHandlers.
 * Handler should validate via validatePatchProposal and return SurfacePatchProposal.
 */
export const proposePatchToolConfig: PlannerToolConfig = {
  name: 'propose-patch',
  description:
    'Propose surface patches (layout changes, node insertions, etc.) for user approval. ' +
    'Only use allowed ops, slots, and node kinds from the planner context.',
  schema: PROPOSE_PATCH_TOOL_SCHEMA as unknown as Record<string, unknown>,
  automationSafe: false,
  requiresApproval: true,
};

/**
 * Builds a SurfacePatchProposal from validated tool output.
 * Call after validatePatchProposal passes.
 */
export function buildSurfacePatchProposal(
  proposalId: string,
  ops: SurfacePatchProposal['ops']
): SurfacePatchProposal {
  return {
    proposalId,
    source: 'assistant',
    ops,
    approvalState: 'proposed',
  };
}
