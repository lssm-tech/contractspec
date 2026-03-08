/**
 * Planner prompt compiler for AI-native surface patches.
 * Compiles bundle metadata, allowed ops, slots, and node kinds into a system prompt.
 * Aligns with 07_ai_native_chat_and_generative_ui.md.
 */

import type {
  BundleMeta,
  BundleNodeKind,
  PreferenceDimensions,
  SurfacePatchOp,
} from '../spec/types';
import type { ActionSpec } from '../spec/types';

export interface PlannerPromptInput {
  /** Bundle metadata. */
  bundleMeta: BundleMeta;
  /** Current surface ID. */
  surfaceId: string;
  /** Allowed patch operations. */
  allowedPatchOps: SurfacePatchOp['op'][];
  /** Allowed slot IDs for insert-node and move-node. */
  allowedSlots: string[];
  /** Allowed node kinds for new nodes. */
  allowedNodeKinds: BundleNodeKind[];
  /** Visible actions (actionId, title). */
  actions: Pick<ActionSpec, 'actionId' | 'title'>[];
  /** Current preference profile. */
  preferences: PreferenceDimensions;
  /** Optional base planner prompt from spec. */
  basePrompt?: string;
  /** Optional plan summary (e.g. layout, node count). */
  planSummary?: string;
  /** Optional entity metadata. */
  entity?: { type: string; id: string };
}

const SAFETY_INSTRUCTIONS = `
## Safety instructions (mandatory)
- Do NOT emit JSX, HTML, or raw markup.
- Do NOT invent node kinds; use only the allowed kinds listed above.
- Do NOT call undeclared tools.
- Prefer fewer high-confidence patches over many speculative ones.
- Explain why a patch helps the user.
`;

/**
 * Compiles planner prompt from bundle and surface context.
 *
 * @param input - Bundle metadata, allowed ops, slots, node kinds, preferences
 * @returns System prompt string for the planner
 */
export function compilePlannerPrompt(input: PlannerPromptInput): string {
  const {
    bundleMeta,
    surfaceId,
    allowedPatchOps,
    allowedSlots,
    allowedNodeKinds,
    actions,
    preferences,
    basePrompt,
    planSummary,
    entity,
  } = input;

  const parts: string[] = [];

  parts.push(
    `# Bundle: ${bundleMeta.title} (${bundleMeta.key}@${bundleMeta.version})`
  );
  parts.push(`# Surface: ${surfaceId}`);
  parts.push('');

  if (basePrompt) {
    parts.push('## Base instructions');
    parts.push(basePrompt);
    parts.push('');
  }

  parts.push('## Allowed patch operations');
  parts.push(allowedPatchOps.join(', '));
  parts.push('');

  parts.push('## Allowed slots');
  parts.push(allowedSlots.join(', '));
  parts.push('');

  parts.push('## Allowed node kinds');
  parts.push(allowedNodeKinds.join(', '));
  parts.push('');

  if (actions.length > 0) {
    parts.push('## Visible actions');
    for (const a of actions) {
      parts.push(`- ${a.actionId}: ${a.title}`);
    }
    parts.push('');
  }

  parts.push('## Current preference profile');
  parts.push(
    `guidance=${preferences.guidance}, density=${preferences.density}, ` +
      `dataDepth=${preferences.dataDepth}, control=${preferences.control}, ` +
      `media=${preferences.media}, pace=${preferences.pace}, narrative=${preferences.narrative}`
  );
  parts.push('');

  if (planSummary) {
    parts.push('## Current plan summary');
    parts.push(planSummary);
    parts.push('');
  }

  if (entity) {
    parts.push('## Entity context');
    parts.push(`${entity.type}: ${entity.id}`);
    parts.push('');
  }

  parts.push(SAFETY_INSTRUCTIONS.trim());

  return parts.join('\n');
}
