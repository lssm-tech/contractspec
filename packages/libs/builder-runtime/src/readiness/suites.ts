import {
	aggregateBuilderMobileParity,
	buildBuilderMobileParitySummary,
} from '@contractspec/lib.mobile-control';
import { matchesBuilderExportArtifactRefs } from '../runtime/export-artifacts';
import { createDeliverySuites } from './delivery-suites';
import { createFoundationSuites } from './foundation-suites';
import {
	buildSupportedRuntimeModes,
	collectReplayIssues,
	hasRuntimeMode,
} from './helpers';
import type { EvaluateBuilderReadinessInput } from './types';

export function createBuilderReadinessSuites(
	input: EvaluateBuilderReadinessInput
) {
	const mobileParityStatus = aggregateBuilderMobileParity(
		input.blueprint,
		input.mobileReviewCards
	);
	const hasManaged = hasRuntimeMode(
		'managed',
		input.runtimeTargets,
		input.providers
	);
	const hasLocal = hasRuntimeMode(
		'local',
		input.runtimeTargets,
		input.providers
	);
	const hasHybrid = hasRuntimeMode(
		'hybrid',
		input.runtimeTargets,
		input.providers
	);
	const invalidReceipts = input.executionReceipts.filter(
		(receipt) =>
			!receipt.runId.trim() ||
			!receipt.providerId.trim() ||
			!receipt.contextBundleId.trim() ||
			!receipt.contextHash.trim() ||
			receipt.outputArtifactHashes.length === 0 ||
			!receipt.startedAt.trim() ||
			!receipt.completedAt?.trim() ||
			receipt.verificationRefs.length === 0
	);
	const invalidPatchProposals = input.patchProposals.filter(
		(proposal) =>
			proposal.changedAreas.length === 0 ||
			!proposal.diffHash.trim() ||
			proposal.outputArtifactRefs.length === 0 ||
			proposal.allowedWriteScopes.length === 0 ||
			proposal.verificationRequirements.length === 0
	);
	const openApprovalTickets = input.approvals.filter(
		(ticket) => ticket.status === 'open'
	);
	const highRiskOpenConflicts = input.conflicts.filter(
		(conflict) =>
			conflict.status === 'open' &&
			(conflict.severity === 'high' || conflict.severity === 'critical')
	);
	const nonBlockingOpenConflicts = input.conflicts.filter(
		(conflict) =>
			conflict.status === 'open' &&
			conflict.severity !== 'high' &&
			conflict.severity !== 'critical'
	);
	const { duplicateDeliveries, unlinkedMessageRevisions } = collectReplayIssues(
		input.messages ?? []
	);
	const cardsMissingDeepLinks = input.mobileReviewCards.filter((card) => {
		if (card.channelType !== 'telegram' && card.channelType !== 'whatsapp') {
			return false;
		}
		const openDetailsAction = card.actions.find(
			(action) => action.id === 'open_details'
		);
		return !openDetailsAction?.deepLinkHref?.trim();
	});
	const invalidExportBundle =
		input.exportBundle != null &&
		(!input.exportBundle.verificationRef.trim() ||
			input.exportBundle.artifactRefs.length === 0);
	const exportBundleArtifactMismatch =
		Boolean(input.exportBundle && input.preview) &&
		!matchesBuilderExportArtifactRefs({
			artifactRefs: input.exportBundle?.artifactRefs ?? [],
			blueprint: input.blueprint,
			executionReceipts: input.executionReceipts,
			preview: input.preview!,
			runtimeMode:
				input.exportBundle?.runtimeMode ?? input.preview!.runtimeMode,
			runtimeTargetRef:
				input.exportBundle?.runtimeTargetRef ?? input.preview!.runtimeTargetId,
			targetType: input.exportBundle?.targetType ?? 'oss_workspace',
			workspaceId: input.workspace.id,
		});

	const suites = [
		...createFoundationSuites({
			readinessInput: input,
			invalidReceipts,
			invalidPatchProposals,
			highRiskOpenConflicts,
			nonBlockingOpenConflicts,
		}),
		...createDeliverySuites({
			readinessInput: input,
			mobileParityStatus,
			hasManaged,
			hasLocal,
			hasHybrid,
			openApprovalTickets,
			duplicateDeliveries,
			unlinkedMessageRevisions,
			cardsMissingDeepLinks,
			invalidExportBundle,
			exportBundleArtifactMismatch,
		}),
	];

	return {
		suites,
		mobileParityStatus,
		mobileParitySummary: buildBuilderMobileParitySummary(
			input.blueprint,
			input.mobileReviewCards
		),
		hasManaged,
		hasLocal,
		hasHybrid,
		supportedRuntimeModes: buildSupportedRuntimeModes({
			hasManaged,
			hasLocal,
			hasHybrid,
		}),
		openApprovalTickets,
	};
}
