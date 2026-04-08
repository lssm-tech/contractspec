'use client';

import { createClaudeCodeProviderPayload } from '@contractspec/integration.provider.claude-code';
import { createCodexProviderPayload } from '@contractspec/integration.provider.codex';
import { createCopilotProviderPayload } from '@contractspec/integration.provider.copilot';
import { createGeminiProviderPayload } from '@contractspec/integration.provider.gemini';
import { createLocalModelProviderPayload } from '@contractspec/integration.provider.local-model';
import { createSttProviderPayload } from '@contractspec/integration.provider.stt';
import { createHybridRuntimeTargetPayload } from '@contractspec/integration.runtime.hybrid';
import { createLocalRuntimeTargetPayload } from '@contractspec/integration.runtime.local';
import { createManagedRuntimeTargetPayload } from '@contractspec/integration.runtime.managed';
import type {
	BuilderMobileReviewCard,
	BuilderWorkspaceSnapshot,
} from '@contractspec/lib.builder-spec';
import {
	BuilderWorkbench,
	useBuilderWorkbenchState,
} from '@contractspec/module.builder-workbench/presentation';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import {
	buildBuilderMobileReviewPath,
	createPromptEnvelope,
	executeBuilderCommand,
	fetchBuilderSnapshot,
	findBuilderMobileReviewCard,
	findBuilderMobileReviewCardBySubject,
	patchBuilderBrief,
	resolveBuilderExportRuntimeMode,
} from './builder-workbench-controller';

function isApprovalCard(card: BuilderMobileReviewCard) {
	return card.subjectType === 'approval_ticket';
}

export function BuilderWorkbenchClient(props: {
	initialSnapshot: BuilderWorkspaceSnapshot;
}) {
	const router = useRouter();
	const { snapshot, setSnapshot, promptDraft, setPromptDraft } =
		useBuilderWorkbenchState({
			workspace: props.initialSnapshot.workspace,
			initialSnapshot: props.initialSnapshot,
		});
	const [error, setError] = React.useState<string | null>(null);
	const [busyAction, setBusyAction] = React.useState<string | null>(null);
	const [selectedExportRuntimeMode, setSelectedExportRuntimeMode] =
		React.useState(resolveBuilderExportRuntimeMode(props.initialSnapshot));
	const workspaceId = props.initialSnapshot.workspace.id;

	const refreshSnapshot = React.useCallback(async () => {
		try {
			const nextSnapshot = await fetchBuilderSnapshot(workspaceId);
			setSnapshot(nextSnapshot);
			setError(null);
		} catch (refreshError) {
			setError(
				refreshError instanceof Error
					? refreshError.message
					: String(refreshError)
			);
		}
	}, [setSnapshot, workspaceId]);

	const runAction = React.useCallback(
		async (
			actionKey: string,
			runner: () => Promise<void>,
			options?: { clearDraft?: boolean }
		) => {
			setBusyAction(actionKey);
			try {
				await runner();
				if (options?.clearDraft) {
					setPromptDraft('');
				}
				await refreshSnapshot();
				setError(null);
			} catch (actionError) {
				setError(
					actionError instanceof Error
						? actionError.message
						: String(actionError)
				);
			} finally {
				setBusyAction(null);
			}
		},
		[refreshSnapshot, setPromptDraft]
	);

	const openReviewCard = React.useCallback(
		(cardId: string, href?: string) => {
			if (href) {
				window.location.assign(href);
				return;
			}
			router.push(buildBuilderMobileReviewPath(workspaceId, cardId));
		},
		[router, workspaceId]
	);

	const onBriefChange = React.useCallback(
		async (value: string) => {
			setSnapshot((current) => ({
				...current,
				blueprint: current.blueprint
					? { ...current.blueprint, appBrief: value }
					: current.blueprint,
			}));
			try {
				await patchBuilderBrief(workspaceId, value);
				await refreshSnapshot();
			} catch (patchError) {
				setError(
					patchError instanceof Error ? patchError.message : String(patchError)
				);
			}
		},
		[refreshSnapshot, setSnapshot, workspaceId]
	);

	const onCapturePrompt = React.useCallback(async () => {
		const nextPrompt = promptDraft.trim();
		if (!nextPrompt) {
			return;
		}
		await runAction(
			'capture_prompt',
			() =>
				executeBuilderCommand({
					commandKey: 'builder.channel.receiveInbound',
					workspaceId,
					payload: createPromptEnvelope(workspaceId, nextPrompt),
				}),
			{ clearDraft: true }
		);
	}, [promptDraft, runAction, workspaceId]);

	const onGenerateBlueprint = React.useCallback(
		async () =>
			runAction('generate_blueprint', () =>
				executeBuilderCommand({
					commandKey: 'builder.blueprint.generate',
					workspaceId,
				})
			),
		[runAction, workspaceId]
	);

	const onCompilePlan = React.useCallback(
		async () =>
			runAction('compile_plan', () =>
				executeBuilderCommand({
					commandKey: 'builder.plan.compile',
					workspaceId,
				})
			),
		[runAction, workspaceId]
	);

	const onRegisterRecommendedTargets = React.useCallback(
		async () =>
			runAction('register_targets', async () => {
				const runtimeTargets = [
					{
						entityId: 'rt_managed_default',
						payload: createManagedRuntimeTargetPayload(),
					},
					{
						entityId: 'rt_local_default',
						payload: createLocalRuntimeTargetPayload(),
					},
					{
						entityId: 'rt_hybrid_default',
						payload: createHybridRuntimeTargetPayload(),
					},
				];
				for (const target of runtimeTargets) {
					await executeBuilderCommand({
						commandKey: 'builder.runtimeTarget.register',
						workspaceId,
						entityId: target.entityId,
						payload: target.payload,
					});
				}
			}),
		[runAction, workspaceId]
	);

	const onRegisterRecommendedProviders = React.useCallback(
		async () =>
			runAction('register_providers', async () => {
				const providers = [
					createCodexProviderPayload(),
					createClaudeCodeProviderPayload(),
					createGeminiProviderPayload(),
					createCopilotProviderPayload(),
					createSttProviderPayload(),
					createLocalModelProviderPayload(),
				];
				for (const provider of providers) {
					await executeBuilderCommand({
						commandKey: 'builder.provider.register',
						workspaceId,
						entityId: provider.id,
						payload: provider,
					});
				}
			}),
		[runAction, workspaceId]
	);

	const onCreatePreview = React.useCallback(
		async () =>
			runAction('create_preview', () =>
				executeBuilderCommand({
					commandKey: 'builder.preview.create',
					workspaceId,
					payload: {
						runtimeMode: selectedExportRuntimeMode,
					},
				})
			),
		[runAction, selectedExportRuntimeMode, workspaceId]
	);

	const onRunReadiness = React.useCallback(
		async () =>
			runAction('run_readiness', () =>
				executeBuilderCommand({
					commandKey: 'builder.preview.runHarness',
					workspaceId,
				})
			),
		[runAction, workspaceId]
	);

	const onPrepareExport = React.useCallback(
		async () =>
			runAction('prepare_export', () =>
				executeBuilderCommand({
					commandKey: 'builder.export.prepare',
					workspaceId,
					payload: {
						runtimeMode: selectedExportRuntimeMode,
					},
				})
			),
		[runAction, selectedExportRuntimeMode, workspaceId]
	);

	const onApproveExport = React.useCallback(
		async () =>
			runAction('approve_export', () =>
				executeBuilderCommand({
					commandKey: 'builder.export.approve',
					workspaceId,
				})
			),
		[runAction, workspaceId]
	);

	const onExecuteExport = React.useCallback(
		async () =>
			runAction('execute_export', () =>
				executeBuilderCommand({
					commandKey: 'builder.export.execute',
					workspaceId,
				})
			),
		[runAction, workspaceId]
	);

	const onAcceptPatchProposal = React.useCallback(
		async (proposalId: string) =>
			runAction(`patch_proposal:${proposalId}`, () =>
				executeBuilderCommand({
					commandKey: 'builder.patchProposal.accept',
					workspaceId,
					entityId: proposalId,
					payload: {
						runtimeMode: selectedExportRuntimeMode,
					},
				})
			),
		[runAction, selectedExportRuntimeMode, workspaceId]
	);

	const onRejectPatchProposal = React.useCallback(
		async (proposalId: string) =>
			runAction(`patch_proposal:${proposalId}`, () =>
				executeBuilderCommand({
					commandKey: 'builder.patchProposal.reject',
					workspaceId,
					entityId: proposalId,
				})
			),
		[runAction, workspaceId]
	);

	const onOpenPatchProposalReview = React.useCallback(
		async (proposalId: string) => {
			const card = findBuilderMobileReviewCardBySubject({
				snapshot,
				subjectId: proposalId,
			});
			if (!card) {
				setError('No mobile review card is available for that patch proposal.');
				return;
			}
			openReviewCard(card.id, card.actions[0]?.deepLinkHref);
		},
		[openReviewCard, snapshot]
	);

	const onQuarantineRuntimeTarget = React.useCallback(
		async (targetId: string) =>
			runAction(`runtime_target:${targetId}`, () =>
				executeBuilderCommand({
					commandKey: 'builder.runtimeTarget.quarantine',
					workspaceId,
					entityId: targetId,
					payload: {
						reason: 'Quarantined from the Builder workbench.',
						channelType: 'mobile_web',
					},
				})
			),
		[runAction, workspaceId]
	);

	const onApproveMobileReviewCard = React.useCallback(
		async (cardId: string) => {
			const card = findBuilderMobileReviewCard({ snapshot, cardId });
			if (!card) {
				setError('Builder mobile review card not found.');
				return;
			}
			if (isApprovalCard(card)) {
				await runAction(`mobile_review:${cardId}`, () =>
					executeBuilderCommand({
						commandKey: 'builder.approval.capture',
						workspaceId,
						entityId: card.subjectId,
						payload: {
							status: 'approved',
						},
					})
				);
				return;
			}
			await onAcceptPatchProposal(card.subjectId);
		},
		[onAcceptPatchProposal, runAction, snapshot, workspaceId]
	);

	const onRejectMobileReviewCard = React.useCallback(
		async (cardId: string) => {
			const card = findBuilderMobileReviewCard({ snapshot, cardId });
			if (!card) {
				setError('Builder mobile review card not found.');
				return;
			}
			if (isApprovalCard(card)) {
				await runAction(`mobile_review:${cardId}`, () =>
					executeBuilderCommand({
						commandKey: 'builder.approval.capture',
						workspaceId,
						entityId: card.subjectId,
						payload: {
							status: 'rejected',
						},
					})
				);
				return;
			}
			await onRejectPatchProposal(card.subjectId);
		},
		[onRejectPatchProposal, runAction, snapshot, workspaceId]
	);

	const onOpenMobileReviewDetails = React.useCallback(
		async (cardId: string, href?: string) => {
			openReviewCard(cardId, href);
		},
		[openReviewCard]
	);

	React.useEffect(() => {
		void refreshSnapshot();
	}, [refreshSnapshot]);

	return (
		<div className="flex h-full flex-col gap-4 p-4">
			{error ? (
				<div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-destructive text-sm">
					{error}
				</div>
			) : null}
			<BuilderWorkbench
				snapshot={snapshot}
				promptDraft={promptDraft}
				onPromptDraftChange={setPromptDraft}
				onBriefChange={onBriefChange}
				onCapturePrompt={onCapturePrompt}
				onGenerateBlueprint={onGenerateBlueprint}
				onCompilePlan={onCompilePlan}
				onRegisterRecommendedTargets={onRegisterRecommendedTargets}
				onRegisterRecommendedProviders={onRegisterRecommendedProviders}
				onCreatePreview={onCreatePreview}
				onRunReadiness={onRunReadiness}
				onPrepareExport={onPrepareExport}
				onApproveExport={onApproveExport}
				onExecuteExport={onExecuteExport}
				onAcceptPatchProposal={onAcceptPatchProposal}
				onRejectPatchProposal={onRejectPatchProposal}
				onOpenPatchProposalReview={onOpenPatchProposalReview}
				onQuarantineRuntimeTarget={onQuarantineRuntimeTarget}
				onApproveMobileReviewCard={onApproveMobileReviewCard}
				onRejectMobileReviewCard={onRejectMobileReviewCard}
				onOpenMobileReviewDetails={onOpenMobileReviewDetails}
				selectedExportRuntimeMode={selectedExportRuntimeMode}
				onSelectExportRuntimeMode={setSelectedExportRuntimeMode}
				busyAction={busyAction}
			/>
		</div>
	);
}
