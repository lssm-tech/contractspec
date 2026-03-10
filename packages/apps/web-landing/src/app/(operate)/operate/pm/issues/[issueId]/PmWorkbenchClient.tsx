'use client';

import React, { useState, useCallback } from 'react';
import {
  BundleProvider,
  BundleRenderer,
} from '@contractspec/lib.surface-runtime/react';
import { applySurfacePatch } from '@contractspec/lib.surface-runtime/runtime/apply-surface-patch';
import {
  emitPatchApproved,
  emitPatchRejected,
} from '@contractspec/lib.surface-runtime/runtime/audit-events';
import { ChatWithSidebar } from '@contractspec/module.ai-chat';
import type { ResolvedSurfacePlan } from '@contractspec/lib.surface-runtime/runtime/resolve-bundle';
import type { SurfacePatchProposal } from '@contractspec/lib.surface-runtime/spec/types';

export interface PmWorkbenchClientProps {
  plan: ResolvedSurfacePlan;
}

/**
 * Client component that renders the PM workbench with BundleProvider and BundleRenderer.
 * Assistant slot shows ChatContainer from module.ai-chat.
 * When plan.ai.proposals has items, PatchProposalCard is shown with Accept/Reject.
 */
export function PmWorkbenchClient({
  plan: initialPlan,
}: PmWorkbenchClientProps) {
  const [plan, setPlan] = useState<ResolvedSurfacePlan>(initialPlan);

  const auditEmitter = React.useMemo(
    () => ({
      emit: (event: { eventType: string; payload?: unknown }) => {
        if (
          typeof window !== 'undefined' &&
          process.env.NODE_ENV === 'development'
        ) {
          console.debug('[surface-audit]', event.eventType, event.payload);
        }
      },
    }),
    []
  );

  const onPatchAccept = useCallback(
    (proposalId: string) => {
      const proposal = plan.ai?.proposals?.find(
        (p) => p.proposalId === proposalId
      );
      if (!proposal) return;
      try {
        const { plan: nextPlan } = applySurfacePatch(plan, proposal.ops);
        emitPatchApproved(auditEmitter, {
          bundleKey: plan.bundleKey,
          surfaceId: plan.surfaceId,
          proposalId: proposal.proposalId,
          source: proposal.source,
          opsCount: proposal.ops.length,
        });
        setPlan({
          ...nextPlan,
          ai: {
            ...nextPlan.ai,
            proposals:
              nextPlan.ai?.proposals?.filter(
                (p) => p.proposalId !== proposalId
              ) ?? [],
          },
        });
      } catch (err) {
        console.error('Failed to apply patch', err);
      }
    },
    [plan]
  );

  const onOverlayConflictResolve = useCallback(
    (resolution: { targetKey: string; chosenScope: 'A' | 'B' }) => {
      if (
        typeof window !== 'undefined' &&
        process.env.NODE_ENV === 'development'
      ) {
        console.debug('[surface-conflict-resolved]', resolution);
      }
      setPlan((prev) => {
        const remaining =
          prev.overlayConflicts?.filter(
            (c) => c.targetKey !== resolution.targetKey
          ) ?? [];
        return {
          ...prev,
          overlayConflicts: remaining.length > 0 ? remaining : undefined,
        };
      });
    },
    []
  );

  const onPatchReject = useCallback(
    (proposalId: string, reason?: string) => {
      const proposal = plan.ai?.proposals?.find(
        (p) => p.proposalId === proposalId
      );
      if (proposal) {
        emitPatchRejected(auditEmitter, {
          bundleKey: plan.bundleKey,
          surfaceId: plan.surfaceId,
          proposalId: proposal.proposalId,
          source: proposal.source,
          opsCount: proposal.ops.length,
          reason,
        });
      }
      setPlan({
        ...plan,
        ai: {
          ...plan.ai,
          proposals:
            plan.ai?.proposals?.filter((p) => p.proposalId !== proposalId) ??
            [],
        },
      });
    },
    [plan]
  );

  const onPatchProposal = useCallback((proposal: SurfacePatchProposal) => {
    setPlan((prev) => ({
      ...prev,
      ai: {
        ...prev.ai,
        proposals: [...(prev.ai?.proposals ?? []), proposal],
      },
    }));
  }, []);

  const assistantContent = (
    <div className="flex h-full flex-col">
      <ChatWithSidebar
        className="flex-1"
        systemPrompt={
          'You are an assistant for the PM workbench. Help users manage issues, suggest layouts, and propose surface changes.'
        }
        surfacePlanConfig={{
          plan,
          onPatchProposal,
        }}
      />
    </div>
  );

  return (
    <BundleProvider plan={plan}>
      <div className="flex h-full w-full">
        <BundleRenderer
          assistantSlotId="assistant"
          assistantSlotContent={assistantContent}
          onPatchAccept={onPatchAccept}
          onPatchReject={onPatchReject}
          onOverlayConflictResolve={onOverlayConflictResolve}
        />
      </div>
    </BundleProvider>
  );
}
