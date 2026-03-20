/**
 * Audit event helpers for surface runtime.
 * Emit patch/overlay/policy events. Integrate with lib.observability or custom backend.
 */

import type { BundleAuditEmitter, SurfacePatchProposal } from '../spec/types';

function generateEventId(): string {
	return `evt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

/** Emit patch.proposed when AI or workspace proposes patches. */
export function emitPatchProposed(
	audit: BundleAuditEmitter,
	args: {
		bundleKey: string;
		surfaceId?: string;
		proposal: SurfacePatchProposal;
		actorId?: string;
	}
): void {
	audit.emit({
		eventId: generateEventId(),
		at: new Date().toISOString(),
		actorId: args.actorId,
		source: args.proposal.source === 'assistant' ? 'assistant' : 'user',
		bundleKey: args.bundleKey,
		surfaceId: args.surfaceId,
		eventType: 'patch.proposed',
		payload: {
			proposalId: args.proposal.proposalId,
			source: args.proposal.source,
			opsCount: args.proposal.ops.length,
		},
	});
}

/** Emit patch.approved when user accepts a proposal. */
export function emitPatchApproved(
	audit: BundleAuditEmitter,
	args: {
		bundleKey: string;
		surfaceId?: string;
		proposalId: string;
		source: SurfacePatchProposal['source'];
		opsCount: number;
		actorId?: string;
		reason?: string;
	}
): void {
	audit.emit({
		eventId: generateEventId(),
		at: new Date().toISOString(),
		actorId: args.actorId,
		source: 'user',
		bundleKey: args.bundleKey,
		surfaceId: args.surfaceId,
		eventType: 'patch.approved',
		payload: {
			proposalId: args.proposalId,
			source: args.source,
			opsCount: args.opsCount,
			reason: args.reason,
		},
	});
}

/** Emit patch.rejected when user rejects a proposal. */
export function emitPatchRejected(
	audit: BundleAuditEmitter,
	args: {
		bundleKey: string;
		surfaceId?: string;
		proposalId: string;
		source: SurfacePatchProposal['source'];
		opsCount: number;
		actorId?: string;
		reason?: string;
	}
): void {
	audit.emit({
		eventId: generateEventId(),
		at: new Date().toISOString(),
		actorId: args.actorId,
		source: 'user',
		bundleKey: args.bundleKey,
		surfaceId: args.surfaceId,
		eventType: 'patch.rejected',
		payload: {
			proposalId: args.proposalId,
			source: args.source,
			opsCount: args.opsCount,
			reason: args.reason,
		},
	});
}

/** Emit overlay.saved when overlay is persisted. */
export function emitOverlaySaved(
	audit: BundleAuditEmitter,
	args: {
		bundleKey: string;
		overlayId: string;
		scope: string;
		opsCount: number;
		actorId?: string;
	}
): void {
	audit.emit({
		eventId: generateEventId(),
		at: new Date().toISOString(),
		actorId: args.actorId,
		source: 'user',
		bundleKey: args.bundleKey,
		eventType: 'overlay.saved',
		payload: {
			overlayId: args.overlayId,
			scope: args.scope,
			opsCount: args.opsCount,
		},
	});
}

/** Emit overlay.applied when overlay is applied at runtime. */
export function emitOverlayApplied(
	audit: BundleAuditEmitter,
	args: {
		bundleKey: string;
		surfaceId?: string;
		overlayId: string;
		opsCount: number;
	}
): void {
	audit.emit({
		eventId: generateEventId(),
		at: new Date().toISOString(),
		source: 'system',
		bundleKey: args.bundleKey,
		surfaceId: args.surfaceId,
		eventType: 'overlay.applied',
		payload: {
			overlayId: args.overlayId,
			opsCount: args.opsCount,
		},
	});
}

/** Emit overlay.failed when overlay application fails. */
export function emitOverlayFailed(
	audit: BundleAuditEmitter,
	args: {
		bundleKey: string;
		surfaceId?: string;
		overlayId: string;
		error: string;
	}
): void {
	audit.emit({
		eventId: generateEventId(),
		at: new Date().toISOString(),
		source: 'system',
		bundleKey: args.bundleKey,
		surfaceId: args.surfaceId,
		eventType: 'overlay.failed',
		payload: {
			overlayId: args.overlayId,
			error: args.error,
		},
	});
}

/** Emit policy.denied when policy blocks an action. */
export function emitPolicyDenied(
	audit: BundleAuditEmitter,
	args: {
		bundleKey: string;
		surfaceId?: string;
		targetId: string;
		reason?: string;
		actorId?: string;
	}
): void {
	audit.emit({
		eventId: generateEventId(),
		at: new Date().toISOString(),
		actorId: args.actorId,
		source: 'policy',
		bundleKey: args.bundleKey,
		surfaceId: args.surfaceId,
		eventType: 'policy.denied',
		payload: {
			targetId: args.targetId,
			reason: args.reason,
		},
	});
}

/** Emit policy.redacted when policy redacts content. */
export function emitPolicyRedacted(
	audit: BundleAuditEmitter,
	args: {
		bundleKey: string;
		surfaceId?: string;
		targetId: string;
		redactions?: string[];
		actorId?: string;
	}
): void {
	audit.emit({
		eventId: generateEventId(),
		at: new Date().toISOString(),
		actorId: args.actorId,
		source: 'policy',
		bundleKey: args.bundleKey,
		surfaceId: args.surfaceId,
		eventType: 'policy.redacted',
		payload: {
			targetId: args.targetId,
			redactions: args.redactions,
		},
	});
}
