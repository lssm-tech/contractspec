'use client';

import React from 'react';
import type { SurfaceNode } from '../spec/types';
import { useBundlePlan } from './BundleProvider';
import { RegionRenderer } from './RegionRenderer';
import { SlotRenderer } from './SlotRenderer';
import { PatchProposalCard } from './PatchProposalCard';
import { OverlayConflictResolver } from './OverlayConflictResolver';
import { motionAdapterStub } from '../adapters/motion-stub';
import type { RenderContext } from '../adapters/interfaces';

export interface BundleRendererProps {
  /** When slotId matches, render this instead of SlotRenderer. Use for ChatContainer from @contractspec/module.ai-chat. */
  assistantSlotId?: string;
  /** Content for the assistant slot (e.g. ChatContainer with useChat). */
  assistantSlotContent?: React.ReactNode;
  /** Override content for any slot. When provided, renders this instead of SlotRenderer for the given slotId. */
  slotContent?: Partial<Record<string, React.ReactNode>>;
  /** Called when user accepts a patch proposal. Caller should apply patch and update plan. */
  onPatchAccept?: (proposalId: string) => void;
  /** Called when user rejects a patch proposal. Caller should remove from proposals and emit audit. */
  onPatchReject?: (proposalId: string, reason?: string) => void;
  /** Called when user resolves an overlay conflict. Caller should persist and re-resolve. */
  onOverlayConflictResolve?: (resolution: {
    targetKey: string;
    chosenScope: 'A' | 'B';
  }) => void;
}

/**
 * Renders the resolved surface plan.
 * Composes RegionRenderer (layout tree), SlotRenderer, and motion tokens from pace.
 * When assistantSlotId is set and matches a slot, renders assistantSlotContent instead.
 */
export function BundleRenderer({
  assistantSlotId,
  assistantSlotContent,
  slotContent,
  onPatchAccept,
  onPatchReject,
  onOverlayConflictResolve,
}: BundleRendererProps = {}) {
  const plan = useBundlePlan();
  const motionTokens = motionAdapterStub.getTokens(
    plan.adaptation.appliedDimensions.pace
  );

  const ctx: RenderContext = {
    plan,
    bindings: plan.bindings,
    preferences: plan.adaptation.appliedDimensions,
  };

  const proposals = plan.ai?.proposals?.filter(
    (p) => p.approvalState === 'proposed'
  );
  const locale = plan.locale;

  const renderSlot = (slotId: string, slotCtx: RenderContext) => {
    if (slotContent && slotId in slotContent && slotContent[slotId] != null) {
      return slotContent[slotId];
    }
    if (assistantSlotId && slotId === assistantSlotId) {
      return (
        <>
          {proposals &&
            proposals.length > 0 &&
            onPatchAccept &&
            onPatchReject && (
              <div style={{ marginBottom: '12px' }}>
                {proposals.map((p) => (
                  <PatchProposalCard
                    key={p.proposalId}
                    proposal={p}
                    onAccept={onPatchAccept}
                    onReject={onPatchReject}
                    locale={locale}
                  />
                ))}
              </div>
            )}
          {assistantSlotContent}
        </>
      );
    }
    const nodes = getNodesForSlot(plan.nodes, slotId);
    return <SlotRenderer slotId={slotId} ctx={slotCtx} nodes={nodes} />;
  };

  const conflicts = plan.overlayConflicts ?? [];

  return (
    <div
      data-bundle-key={plan.bundleKey}
      data-surface-id={plan.surfaceId}
      data-layout-id={plan.layoutId}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
        transition: motionTokens.layout
          ? `all ${motionTokens.durationMs}ms ease`
          : undefined,
      }}
    >
      {conflicts.length > 0 && onOverlayConflictResolve && (
        <OverlayConflictResolver
          conflicts={conflicts}
          onResolve={onOverlayConflictResolve}
          locale={locale}
        />
      )}
      <RegionRenderer
        region={plan.layoutRoot}
        ctx={ctx}
        renderSlot={renderSlot}
      />
    </div>
  );
}

/** Phase 2: All nodes go to primary slot. Slot assignment from patches deferred. */
function getNodesForSlot(nodes: SurfaceNode[], slotId: string): SurfaceNode[] {
  if (slotId === 'primary') return nodes;
  return [];
}
