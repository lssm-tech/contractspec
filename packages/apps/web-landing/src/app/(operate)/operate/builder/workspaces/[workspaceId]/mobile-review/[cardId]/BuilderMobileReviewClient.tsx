'use client';

import type {
	BuilderMobileReviewCard,
	BuilderWorkspaceSnapshot,
} from '@contractspec/lib.builder-spec';
import { Button } from '@contractspec/lib.ui-kit-web/ui/button';
import { VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { BuilderMobileReviewSurface } from '@contractspec/module.mobile-review';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import {
	buildBuilderMobileReviewPath,
	executeBuilderCommand,
	fetchBuilderSnapshot,
	findBuilderMobileReviewCard,
} from '../../builder-workbench-controller';

function isApprovalCard(card: BuilderMobileReviewCard) {
	return card.subjectType === 'approval_ticket';
}

export function BuilderMobileReviewClient(props: {
	initialSnapshot: BuilderWorkspaceSnapshot;
	cardId: string;
}) {
	const router = useRouter();
	const [snapshot, setSnapshot] = React.useState(props.initialSnapshot);
	const [error, setError] = React.useState<string | null>(null);
	const [busyCardId, setBusyCardId] = React.useState<string | null>(null);
	const workspaceId = props.initialSnapshot.workspace.id;
	const card = findBuilderMobileReviewCard({
		snapshot,
		cardId: props.cardId,
	});

	const refreshSnapshot = React.useCallback(async () => {
		const nextSnapshot = await fetchBuilderSnapshot(workspaceId);
		setSnapshot(nextSnapshot);
	}, [workspaceId]);

	const runAction = React.useCallback(
		async (runner: () => Promise<void>) => {
			setBusyCardId(props.cardId);
			try {
				await runner();
				await refreshSnapshot();
				setError(null);
			} catch (actionError) {
				setError(
					actionError instanceof Error
						? actionError.message
						: String(actionError)
				);
			} finally {
				setBusyCardId(null);
			}
		},
		[props.cardId, refreshSnapshot]
	);

	const onApproveCard = React.useCallback(
		async (cardId: string) => {
			const nextCard = findBuilderMobileReviewCard({ snapshot, cardId });
			if (!nextCard) {
				setError('Builder mobile review card not found.');
				return;
			}
			await runAction(() =>
				executeBuilderCommand({
					commandKey: isApprovalCard(nextCard)
						? 'builder.approval.capture'
						: 'builder.patchProposal.accept',
					workspaceId,
					entityId: nextCard.subjectId,
					payload: isApprovalCard(nextCard)
						? { status: 'approved' }
						: undefined,
				})
			);
		},
		[runAction, snapshot, workspaceId]
	);

	const onRejectCard = React.useCallback(
		async (cardId: string) => {
			const nextCard = findBuilderMobileReviewCard({ snapshot, cardId });
			if (!nextCard) {
				setError('Builder mobile review card not found.');
				return;
			}
			await runAction(() =>
				executeBuilderCommand({
					commandKey: isApprovalCard(nextCard)
						? 'builder.approval.capture'
						: 'builder.patchProposal.reject',
					workspaceId,
					entityId: nextCard.subjectId,
					payload: isApprovalCard(nextCard)
						? { status: 'rejected' }
						: undefined,
				})
			);
		},
		[runAction, snapshot, workspaceId]
	);

	const onOpenDetails = React.useCallback(
		async (cardId: string, href?: string) => {
			if (href) {
				window.location.assign(href);
				return;
			}
			router.push(buildBuilderMobileReviewPath(workspaceId, cardId));
		},
		[router, workspaceId]
	);

	return (
		<VStack gap="lg" align="stretch" className="p-4">
			<Button
				variant="outline"
				onClick={() =>
					router.push(
						`/operate/builder/workspaces/${encodeURIComponent(workspaceId)}`
					)
				}
			>
				Back To Workspace
			</Button>
			{error ? (
				<div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-destructive text-sm">
					{error}
				</div>
			) : null}
			{card ? (
				<BuilderMobileReviewSurface
					featureParity={snapshot.blueprint?.featureParity ?? []}
					cards={[card]}
					report={snapshot.readinessReport}
					onApproveCard={onApproveCard}
					onRejectCard={onRejectCard}
					onOpenDetails={onOpenDetails}
					busyCardId={busyCardId}
				/>
			) : (
				<div className="rounded-md border px-4 py-3 text-sm">
					This mobile review card is no longer available.
				</div>
			)}
		</VStack>
	);
}
