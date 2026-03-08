import type { SurfacePatchOp, SurfaceNode, BundleNodeKind } from './types';

const VALID_OPS: SurfacePatchOp['op'][] = [
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
];

const VALID_NODE_KINDS: BundleNodeKind[] = [
  'metric-strip',
  'data-view',
  'entity-card',
  'entity-header',
  'entity-summary',
  'entity-section',
  'entity-field',
  'entity-activity',
  'entity-relations',
  'entity-timeline',
  'entity-comments',
  'entity-attachments',
  'entity-view-switcher',
  'entity-automation-panel',
  'rich-doc',
  'chat-thread',
  'assistant-panel',
  'action-bar',
  'timeline',
  'board',
  'table',
  'calendar',
  'form',
  'chart',
  'relation-graph',
  'custom-widget',
];

function validateSurfaceNode(node: SurfaceNode, path: string): void {
  if (!node.nodeId || typeof node.nodeId !== 'string') {
    throw new Error(`${path}: nodeId must be a non-empty string`);
  }
  if (!node.kind || !VALID_NODE_KINDS.includes(node.kind)) {
    throw new Error(
      `${path}: kind must be one of ${VALID_NODE_KINDS.join(', ')}`
    );
  }
  if (node.children) {
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      if (child) validateSurfaceNode(child, `${path}.children[${i}]`);
    }
  }
}

/**
 * Validates a single patch op schema. Throws on invalid shape.
 * Reversibility: per spec Rule 4, each op has an inverse:
 * - insert-node ↔ remove-node
 * - replace-node ↔ replace-node (self-inverse)
 * - remove-node ↔ insert-node
 * - move-node ↔ move-node (reverse move)
 * - resize-panel ↔ resize-panel (restore previous sizes)
 * - set-layout ↔ set-layout (restore previous layout)
 * - reveal-field ↔ hide-field
 * - hide-field ↔ reveal-field
 * - promote-action ↔ promote-action (restore previous placement)
 * - set-focus ↔ set-focus (restore previous focus)
 *
 * @param op - The patch operation to validate
 * @param index - Index in the ops array (for error messages)
 */
export function validateSurfacePatchOp(
  op: SurfacePatchOp,
  index: number
): void {
  const path = `ops[${index}]`;

  if (!op || typeof op !== 'object' || !('op' in op)) {
    throw new Error(`${path}: must be an object with op field`);
  }

  const opType = op.op as string;
  if (!VALID_OPS.includes(opType as SurfacePatchOp['op'])) {
    throw new Error(`${path}: op must be one of ${VALID_OPS.join(', ')}`);
  }

  switch (op.op) {
    case 'insert-node':
      if (!op.slotId || typeof op.slotId !== 'string') {
        throw new Error(`${path}: insert-node requires slotId string`);
      }
      if (!op.node) {
        throw new Error(`${path}: insert-node requires node`);
      }
      validateSurfaceNode(op.node, `${path}.node`);
      if (op.index !== undefined && typeof op.index !== 'number') {
        throw new Error(`${path}: insert-node index must be number if present`);
      }
      break;
    case 'replace-node':
      if (!op.nodeId || typeof op.nodeId !== 'string') {
        throw new Error(`${path}: replace-node requires nodeId string`);
      }
      if (!op.node) {
        throw new Error(`${path}: replace-node requires node`);
      }
      validateSurfaceNode(op.node, `${path}.node`);
      break;
    case 'remove-node':
      if (!op.nodeId || typeof op.nodeId !== 'string') {
        throw new Error(`${path}: remove-node requires nodeId string`);
      }
      break;
    case 'move-node':
      if (!op.nodeId || typeof op.nodeId !== 'string') {
        throw new Error(`${path}: move-node requires nodeId string`);
      }
      if (!op.toSlotId || typeof op.toSlotId !== 'string') {
        throw new Error(`${path}: move-node requires toSlotId string`);
      }
      if (op.index !== undefined && typeof op.index !== 'number') {
        throw new Error(`${path}: move-node index must be number if present`);
      }
      break;
    case 'resize-panel':
      if (!op.persistKey || typeof op.persistKey !== 'string') {
        throw new Error(`${path}: resize-panel requires persistKey string`);
      }
      if (
        !Array.isArray(op.sizes) ||
        op.sizes.some((s) => typeof s !== 'number')
      ) {
        throw new Error(`${path}: resize-panel requires sizes number[]`);
      }
      break;
    case 'set-layout':
      if (!op.layoutId || typeof op.layoutId !== 'string') {
        throw new Error(`${path}: set-layout requires layoutId string`);
      }
      break;
    case 'reveal-field':
    case 'hide-field':
      if (!op.fieldId || typeof op.fieldId !== 'string') {
        throw new Error(`${path}: ${op.op} requires fieldId string`);
      }
      break;
    case 'promote-action': {
      if (!op.actionId || typeof op.actionId !== 'string') {
        throw new Error(`${path}: promote-action requires actionId string`);
      }
      const validPlacements = ['header', 'inline', 'context', 'assistant'];
      if (!op.placement || !validPlacements.includes(op.placement)) {
        throw new Error(
          `${path}: promote-action placement must be one of ${validPlacements.join(', ')}`
        );
      }
      break;
    }
    case 'set-focus':
      if (!op.targetId || typeof op.targetId !== 'string') {
        throw new Error(`${path}: set-focus requires targetId string`);
      }
      break;
    default:
      throw new Error(`${path}: unknown op "${opType}"`);
  }
}

/**
 * Validates an array of patch ops. Throws on first invalid op.
 *
 * @param ops - Patch operations to validate
 */
export function validateSurfacePatch(ops: SurfacePatchOp[]): void {
  if (!Array.isArray(ops)) {
    throw new Error('Patch ops must be an array');
  }
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i];
    if (op) validateSurfacePatchOp(op, i);
  }
}

/** Constraints for patch proposal validation (e.g. from BundleAiSpec, SurfaceAiSpec). */
export interface PatchProposalConstraints {
  allowedOps: readonly SurfacePatchOp['op'][];
  allowedSlots: readonly string[];
  allowedNodeKinds: readonly BundleNodeKind[];
}

function validateSurfaceNodeAgainstKinds(
  node: SurfaceNode,
  allowedKinds: readonly BundleNodeKind[],
  path: string
): void {
  if (!allowedKinds.includes(node.kind)) {
    throw new Error(
      `${path}: kind "${node.kind}" not in allowed list [${allowedKinds.join(', ')}]`
    );
  }
  if (node.children) {
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      if (child)
        validateSurfaceNodeAgainstKinds(
          child,
          allowedKinds,
          `${path}.children[${i}]`
        );
    }
  }
}

/**
 * Validates a patch proposal against allowed ops, slots, and node kinds.
 * Throws on first violation. Call before applying or accepting patches.
 *
 * @param ops - Patch operations to validate
 * @param constraints - Allowed ops, slots, node kinds from bundle/surface spec
 */
export function validatePatchProposal(
  ops: SurfacePatchOp[],
  constraints: PatchProposalConstraints
): void {
  if (!Array.isArray(ops)) {
    throw new Error('Patch ops must be an array');
  }
  const { allowedOps, allowedSlots, allowedNodeKinds } = constraints;

  for (let i = 0; i < ops.length; i++) {
    const op = ops[i];
    if (!op) continue;

    const path = `ops[${i}]`;

    if (!allowedOps.includes(op.op)) {
      throw new Error(
        `${path}: op "${op.op}" not in allowed list [${allowedOps.join(', ')}]`
      );
    }

    switch (op.op) {
      case 'insert-node':
        if (!allowedSlots.includes(op.slotId)) {
          throw new Error(
            `${path}: slotId "${op.slotId}" not in allowed slots [${allowedSlots.join(', ')}]`
          );
        }
        if (op.node) {
          validateSurfaceNodeAgainstKinds(
            op.node,
            allowedNodeKinds,
            `${path}.node`
          );
        }
        break;
      case 'move-node':
        if (!allowedSlots.includes(op.toSlotId)) {
          throw new Error(
            `${path}: toSlotId "${op.toSlotId}" not in allowed slots [${allowedSlots.join(', ')}]`
          );
        }
        break;
      case 'replace-node':
        if (op.node) {
          validateSurfaceNodeAgainstKinds(
            op.node,
            allowedNodeKinds,
            `${path}.node`
          );
        }
        break;
      default:
        break;
    }
  }

  validateSurfacePatch(ops);
}
