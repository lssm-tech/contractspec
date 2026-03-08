/**
 * Renders content for a slot. Maps plan.nodes to slot by sourceBinding/slot assignment.
 * Phase 2: Renders nodes that belong to this slot; placeholder when empty.
 */

import React from 'react';
import type { SurfaceNode } from '../spec/types';
import type { RenderContext } from '../adapters/interfaces';
import { blocknoteAdapterStub } from '../adapters/blocknote-stub';
import { missingRendererCounter } from '../telemetry/surface-metrics';

export interface SlotRendererProps {
  slotId: string;
  ctx: RenderContext;
  /** Nodes assigned to this slot. From plan or slot-to-nodes mapping. */
  nodes: SurfaceNode[];
}

export function SlotRenderer({ slotId, ctx, nodes }: SlotRendererProps) {
  if (nodes.length === 0) {
    return (
      <div data-slot-placeholder data-slot-id={slotId}>
        {/* Empty slot placeholder */}
      </div>
    );
  }

  return (
    <div data-slot={slotId}>
      {nodes.map((node) => (
        <SlotNodeRenderer
          key={node.nodeId}
          node={node}
          ctx={ctx}
          slotId={slotId}
        />
      ))}
    </div>
  );
}

function SlotNodeRenderer({
  node,
  ctx,
  slotId,
}: {
  node: SurfaceNode;
  ctx: RenderContext;
  slotId: string;
}) {
  if (blocknoteAdapterStub.supportsNode(node.kind)) {
    return blocknoteAdapterStub.renderNode(node, ctx);
  }
  if (node.kind === 'entity-section') {
    return (
      <section data-node-id={node.nodeId} data-kind="entity-section">
        <header data-entity-section-header>{node.title ?? 'Section'}</header>
        <div data-entity-section-content>
          {node.children?.map((child) =>
            child ? (
              <SlotNodeRenderer
                key={child.nodeId}
                node={child}
                ctx={ctx}
                slotId={slotId}
              />
            ) : null
          )}
        </div>
      </section>
    );
  }
  if (node.kind === 'entity-field') {
    const fieldId = node.sourceBinding?.fieldId;
    return (
      <div
        data-node-id={node.nodeId}
        data-kind="entity-field"
        data-field-id={fieldId}
      >
        <span data-entity-field-label>{node.title ?? fieldId ?? 'Field'}</span>
        <span data-entity-field-value>{/* Value from binding */}</span>
      </div>
    );
  }
  missingRendererCounter.add(1, {
    nodeKind: node.kind,
    slotId,
  });
  return (
    <div data-node-id={node.nodeId} data-kind={node.kind} data-renderer-missing>
      {node.title ?? node.kind}
    </div>
  );
}
