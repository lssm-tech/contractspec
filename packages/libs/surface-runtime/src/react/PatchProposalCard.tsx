'use client';

import { useMemo } from 'react';
import { createSurfaceI18n } from '../i18n';
import type { SurfacePatchOp, SurfacePatchProposal } from '../spec/types';

export interface PatchProposalCardProps {
	proposal: SurfacePatchProposal;
	onAccept: (proposalId: string) => void;
	onReject: (proposalId: string, reason?: string) => void;
	/** Locale for i18n (e.g. from plan.locale). Defaults to 'en'. */
	locale?: string;
}

/**
 * Renders a single patch proposal with Accept and Reject actions.
 * Used when the assistant proposes surface changes (e.g. insert widget, change layout).
 */
export function PatchProposalCard({
	proposal,
	onAccept,
	onReject,
	locale,
}: PatchProposalCardProps) {
	const i18n = useMemo(() => createSurfaceI18n(locale), [locale]);
	const firstOp = proposal.ops[0];
	const summary =
		proposal.ops.length === 1 && firstOp
			? describeOp(firstOp, i18n)
			: i18n.t('patch.changes', { count: proposal.ops.length });

	return (
		<div
			data-proposal-id={proposal.proposalId}
			style={{
				padding: '12px',
				border: '1px solid var(--border, #e5e7eb)',
				borderRadius: '8px',
				marginBottom: '8px',
				backgroundColor: 'var(--muted, #f9fafb)',
			}}
		>
			<div style={{ marginBottom: '8px', fontSize: '14px' }}>{summary}</div>
			<div style={{ display: 'flex', gap: '8px' }}>
				<button
					type="button"
					onClick={() => onAccept(proposal.proposalId)}
					style={{
						padding: '4px 12px',
						fontSize: '13px',
						borderRadius: '4px',
						border: 'none',
						backgroundColor: 'var(--primary, #3b82f6)',
						color: 'white',
						cursor: 'pointer',
					}}
				>
					{i18n.t('patch.accept')}
				</button>
				<button
					type="button"
					onClick={() => onReject(proposal.proposalId)}
					style={{
						padding: '4px 12px',
						fontSize: '13px',
						borderRadius: '4px',
						border: '1px solid var(--border, #e5e7eb)',
						backgroundColor: 'transparent',
						cursor: 'pointer',
					}}
				>
					{i18n.t('patch.reject')}
				</button>
			</div>
		</div>
	);
}

function describeOp(
	op: SurfacePatchOp,
	i18n: { t: (key: string, params?: Record<string, string | number>) => string }
): string {
	switch (op.op) {
		case 'insert-node':
			return i18n.t('patch.addWidget', {
				title: op.node?.title ?? op.node?.kind ?? 'widget',
				slot: op.slotId ?? 'slot',
			});
		case 'remove-node':
			return i18n.t('patch.removeItem');
		case 'set-layout':
			return i18n.t('patch.switchLayout', { layoutId: op.layoutId });
		case 'reveal-field':
			return i18n.t('patch.showField', { fieldId: op.fieldId });
		case 'hide-field':
			return i18n.t('patch.hideField', { fieldId: op.fieldId });
		case 'move-node':
			return i18n.t('patch.moveTo', { slot: op.toSlotId ?? 'slot' });
		case 'replace-node':
			return i18n.t('patch.replaceItem');
		case 'promote-action':
			return i18n.t('patch.promote', { actionId: op.actionId });
		default:
			return `${op.op}`;
	}
}
