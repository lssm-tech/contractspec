import { describe, expect, it } from 'bun:test';
import { rollbackSurfacePatches } from './rollback';
import { applySurfacePatch } from './apply-surface-patch';
import type { ResolvedSurfacePlan } from './resolve-bundle';
import type { OverlayApprovalMeta } from '../spec/types';

const basePlan: ResolvedSurfacePlan = {
  bundleKey: 'x',
  surfaceId: 's',
  layoutId: 'l1',
  layoutRoot: { type: 'slot', slotId: 'primary' },
  nodes: [
    { nodeId: 'n1', kind: 'entity-card', title: 'Card 1' },
    { nodeId: 'n2', kind: 'data-view', title: 'View' },
  ],
  actions: [],
  commands: [],
  bindings: {},
  adaptation: {
    appliedDimensions: {
      guidance: 'hints',
      density: 'standard',
      dataDepth: 'detailed',
      control: 'standard',
      media: 'text',
      pace: 'balanced',
      narrative: 'top-down',
    },
    notes: [],
  },
  overlays: [],
  ai: {},
  audit: {
    resolutionId: 'res_1',
    createdAt: new Date().toISOString(),
    reasons: [],
  },
};

describe('rollbackSurfacePatches', () => {
  it('returns plan unchanged when count is 0', () => {
    const result = rollbackSurfacePatches(basePlan, [], 0);
    expect(result.plan).toEqual(basePlan);
    expect(result.revertedCount).toBe(0);
    expect(result.remainingStack).toEqual([]);
  });

  it('returns plan unchanged when stack is empty', () => {
    const result = rollbackSurfacePatches(basePlan, [], 1);
    expect(result.plan).toEqual(basePlan);
    expect(result.revertedCount).toBe(0);
  });

  it('reverts last patch using inverse ops', () => {
    const applied = applySurfacePatch(basePlan, [
      {
        op: 'insert-node',
        slotId: 'primary',
        node: { nodeId: 'n3', kind: 'entity-field', title: 'Field' },
      },
    ]);
    const meta: OverlayApprovalMeta = {
      approvalId: 'a1',
      actorId: 'user1',
      approvedAt: new Date().toISOString(),
      scope: 'session',
      forwardOps: [
        {
          op: 'insert-node',
          slotId: 'primary',
          node: { nodeId: 'n3', kind: 'entity-field', title: 'Field' },
        },
      ],
      inverseOps: applied.inverseOps,
    };
    const result = rollbackSurfacePatches(applied.plan, [meta], 1);
    expect(result.plan.nodes).toHaveLength(2);
    expect(result.revertedCount).toBe(1);
    expect(result.remainingStack).toHaveLength(0);
  });
});
