import type {
	BuilderWorkspace,
	BuilderWorkspaceSnapshot,
} from '@contractspec/lib.builder-spec';
import type { BuilderStore } from '../stores/store';
import {
	buildDecisionLedger,
	buildProviderProposalRegister,
	buildSourceTimeline,
} from './snapshot-views';

export async function buildBuilderWorkspaceSnapshot(input: {
	store: BuilderStore;
	workspace: BuilderWorkspace;
}) {
	const [
		participantBindings,
		conversations,
		sources,
		rawAssets,
		evidenceReferences,
		directives,
		assumptions,
		conflicts,
		decisionReceipts,
		fusionGraphEdges,
		approvalTickets,
		blueprint,
		plan,
		preview,
		readinessReport,
		exportBundle,
		runtimeTargets,
		externalProviders,
		routingPolicy,
		executionContextBundles,
		executionReceipts,
		patchProposals,
		comparisonRuns,
		mobileReviewCards,
		providerActivity,
	] = await Promise.all([
		input.store.listParticipantBindings(input.workspace.id),
		input.store.listConversations(input.workspace.id),
		input.store.listSources(input.workspace.id),
		input.store.listRawAssets(input.workspace.id),
		input.store.listEvidenceReferences(input.workspace.id),
		input.store.listDirectives(input.workspace.id),
		input.store.listAssumptions(input.workspace.id),
		input.store.listConflicts(input.workspace.id),
		input.store.listDecisionReceipts(input.workspace.id),
		input.store.listFusionGraphEdges(input.workspace.id),
		input.store.listApprovalTickets(input.workspace.id),
		input.store.getBlueprint(input.workspace.id),
		input.store.getPlan(input.workspace.id),
		input.store.getPreview(input.workspace.id),
		input.store.getReadinessReport(input.workspace.id),
		input.store.getExportBundle(input.workspace.id),
		input.store.listRuntimeTargets(input.workspace.id),
		input.store.listExternalProviders(input.workspace.id),
		input.store.getRoutingPolicy(input.workspace.id),
		input.store.listExecutionContextBundles(input.workspace.id),
		input.store.listExecutionReceipts(input.workspace.id),
		input.store.listPatchProposals(input.workspace.id),
		input.store.listComparisonRuns(input.workspace.id),
		input.store.listMobileReviewCards(input.workspace.id),
		input.store.listProviderActivities(input.workspace.id),
	]);
	const extractedParts = (
		await Promise.all(
			sources.map((source) => input.store.listExtractedParts(source.id))
		)
	).flat();
	const messages = (
		await Promise.all(
			conversations.map((conversation) =>
				input.store.listChannelMessages(conversation.id)
			)
		)
	).flat();
	const transcripts = (
		await Promise.all(
			sources.map((source) => input.store.listTranscriptSegments(source.id))
		)
	).flat();
	return {
		workspace: input.workspace,
		participantBindings,
		conversations,
		sources,
		rawAssets,
		extractedParts,
		evidenceReferences,
		messages,
		transcripts,
		directives,
		assumptions,
		conflicts,
		decisionReceipts,
		fusionGraphEdges,
		blueprint,
		plan,
		approvalTickets,
		preview,
		readinessReport,
		exportBundle,
		runtimeTargets,
		externalProviders,
		routingPolicy,
		executionContextBundles,
		executionReceipts,
		patchProposals,
		comparisonRuns,
		mobileReviewCards,
		decisionLedger: buildDecisionLedger({
			decisionReceipts,
			assumptions,
		}),
		sourceTimeline: buildSourceTimeline({
			sources,
			conflicts,
		}),
		providerProposalRegister: buildProviderProposalRegister({
			proposals: patchProposals,
			receiptsById: new Map(
				executionReceipts.map((receipt) => [receipt.id, receipt])
			),
		}),
		providerActivity,
		stableMemory: {
			approvedDecisionIds: decisionReceipts
				.filter((receipt) => receipt.requiresHumanReview === false)
				.map((receipt) => receipt.id),
			lockedFieldPaths: blueprint?.lockedFieldPaths ?? [],
			approvedSnapshotSourceIds: sources
				.filter(
					(source) =>
						source.sourceType === 'studio_snapshot' &&
						source.approvalState === 'approved'
				)
				.map((source) => source.id),
			exportBundleIds: exportBundle ? [exportBundle.id] : [],
		},
		workingMemory: {
			messageIds: messages.map((message) => message.id),
			directiveIds: directives
				.filter((directive) => directive.status === 'open')
				.map((directive) => directive.id),
			assumptionIds: assumptions
				.filter((assumption) => assumption.status === 'open')
				.map((assumption) => assumption.id),
			conflictIds: conflicts
				.filter((conflict) => conflict.status === 'open')
				.map((conflict) => conflict.id),
			pendingApprovalIds: approvalTickets
				.filter((ticket) => ticket.status === 'open')
				.map((ticket) => ticket.id),
		},
	} satisfies BuilderWorkspaceSnapshot;
}
