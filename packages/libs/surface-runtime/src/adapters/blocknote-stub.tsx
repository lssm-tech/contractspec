/**
 * BlockNote adapter stub. Full integration deferred.
 * No direct BlockNote imports in Phase 2.
 */

import type {
  BlockNoteBundleAdapter,
  FieldRendererRegistry,
  RenderContext,
} from './interfaces';
import type { BundleNodeKind, SurfaceNode } from '../spec/types';

export const blocknoteAdapterStub: BlockNoteBundleAdapter = {
  supportsNode(_kind: BundleNodeKind): boolean {
    return false;
  },

  createSchema(_registry: FieldRendererRegistry): unknown {
    return {};
  },

  renderNode(node: SurfaceNode, _ctx: RenderContext) {
    return (
      <div data-blocknote-stub data-node-id={node.nodeId}>
        {node.title ?? node.kind}
      </div>
    );
  },

  async serialize(node: SurfaceNode): Promise<unknown> {
    return { nodeId: node.nodeId, kind: node.kind };
  },

  async deserialize(input: unknown): Promise<SurfaceNode> {
    const o = input as { nodeId?: string; kind?: BundleNodeKind };
    return {
      nodeId: o?.nodeId ?? 'stub',
      kind: o?.kind ?? 'custom-widget',
    };
  },
};
