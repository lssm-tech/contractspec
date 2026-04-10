import type {
	BuilderOperationInput,
	BuilderRuntimeDependencies,
} from './types';
import { buildBuilderWorkspaceSnapshot } from './workbench-snapshot';

async function listWorkspaceExtractedParts(
	deps: BuilderRuntimeDependencies,
	workspaceId: string
) {
	const sources = await deps.store.listSources(workspaceId);
	return (
		await Promise.all(
			sources.map((source) => deps.store.listExtractedParts(source.id))
		)
	).flat();
}

async function listWorkspaceTranscripts(
	deps: BuilderRuntimeDependencies,
	workspaceId: string
) {
	const sources = await deps.store.listSources(workspaceId);
	return (
		await Promise.all(
			sources.map((source) => deps.store.listTranscriptSegments(source.id))
		)
	).flat();
}

async function getWorkspaceSnapshot(
	deps: BuilderRuntimeDependencies,
	workspaceId: string
) {
	const workspace = await deps.store.getWorkspace(workspaceId);
	if (!workspace) {
		return null;
	}
	return buildBuilderWorkspaceSnapshot({
		store: deps.store,
		workspace,
	});
}

export async function executeBuilderQuery(
	deps: BuilderRuntimeDependencies,
	queryKey: string,
	input: BuilderOperationInput = {}
) {
	switch (queryKey) {
		case 'builder.workspace.get':
			return input.workspaceId
				? deps.store.getWorkspace(input.workspaceId)
				: null;
		case 'builder.workspace.list':
			return deps.store.listWorkspaces(
				(input.payload?.tenantId as string | undefined) ?? undefined
			);
		case 'builder.workspace.snapshot':
		case 'builder.workbench.snapshot':
			return input.workspaceId
				? getWorkspaceSnapshot(deps, input.workspaceId)
				: null;
		case 'builder.conversation.get':
			return input.entityId ? deps.store.getConversation(input.entityId) : null;
		case 'builder.participantBinding.list':
			return deps.store.listParticipantBindings(String(input.workspaceId));
		case 'builder.participantBinding.get':
			return input.entityId
				? deps.store.getParticipantBinding(input.entityId)
				: null;
		case 'builder.source.list':
			return deps.store.listSources(String(input.workspaceId));
		case 'builder.source.get':
			return input.entityId ? deps.store.getSource(input.entityId) : null;
		case 'builder.source.parts.list':
			return input.entityId
				? deps.store.listExtractedParts(input.entityId)
				: input.workspaceId
					? listWorkspaceExtractedParts(deps, input.workspaceId)
					: [];
		case 'builder.evidence.list':
			return deps.store.listEvidenceReferences(String(input.workspaceId));
		case 'builder.channel.thread':
			return deps.store.listChannelMessages(
				String(input.conversationId ?? input.entityId)
			);
		case 'builder.transcript.list':
			return input.entityId
				? deps.store.listTranscriptSegments(input.entityId)
				: input.workspaceId
					? listWorkspaceTranscripts(deps, input.workspaceId)
					: [];
		case 'builder.directive.list':
			return deps.store.listDirectives(String(input.workspaceId));
		case 'builder.conflict.list':
			return deps.store.listConflicts(String(input.workspaceId));
		case 'builder.assumption.list':
			return deps.store.listAssumptions(String(input.workspaceId));
		case 'builder.decision.list':
			return deps.store.listDecisionReceipts(String(input.workspaceId));
		case 'builder.fusionGraph.list':
			return deps.store.listFusionGraphEdges(String(input.workspaceId));
		case 'builder.blueprint.get':
			return deps.store.getBlueprint(String(input.workspaceId));
		case 'builder.plan.get':
			return deps.store.getPlan(String(input.workspaceId));
		case 'builder.preview.get':
			return deps.store.getPreview(String(input.workspaceId));
		case 'builder.readiness.report':
			return deps.store.getReadinessReport(String(input.workspaceId));
		case 'builder.approval.list':
			return deps.store.listApprovalTickets(String(input.workspaceId));
		case 'builder.export.get':
			return deps.store.getExportBundle(String(input.workspaceId));
		case 'builder.runtimeTarget.get':
			return input.entityId
				? deps.store.getRuntimeTarget(input.entityId)
				: null;
		case 'builder.runtimeTarget.list':
			return deps.store.listRuntimeTargets(String(input.workspaceId));
		case 'builder.provider.get':
			return input.entityId
				? deps.store.getExternalProvider(input.entityId)
				: null;
		case 'builder.provider.list':
			return deps.store.listExternalProviders(String(input.workspaceId));
		case 'builder.providerRoutingPolicy.get':
			return deps.store.getRoutingPolicy(String(input.workspaceId));
		case 'builder.executionContext.get':
			return input.entityId
				? deps.store.getExecutionContextBundle(input.entityId)
				: null;
		case 'builder.executionContext.list':
			return deps.store.listExecutionContextBundles(String(input.workspaceId));
		case 'builder.executionReceipt.get':
			return input.entityId
				? deps.store.getExecutionReceipt(input.entityId)
				: null;
		case 'builder.executionReceipt.list':
			return deps.store.listExecutionReceipts(String(input.workspaceId));
		case 'builder.patchProposal.get':
			return input.entityId
				? deps.store.getPatchProposal(input.entityId)
				: null;
		case 'builder.patchProposal.list':
			return deps.store.listPatchProposals(String(input.workspaceId));
		case 'builder.comparison.get':
			return input.entityId
				? deps.store.getComparisonRun(input.entityId)
				: null;
		case 'builder.comparison.list':
			return deps.store.listComparisonRuns(String(input.workspaceId));
		case 'builder.mobileReviewCard.get':
			return input.entityId
				? deps.store.getMobileReviewCard(input.entityId)
				: null;
		case 'builder.mobileReviewCard.list':
			return deps.store.listMobileReviewCards(String(input.workspaceId));
		default:
			throw new Error(`Unsupported Builder query: ${queryKey}`);
	}
}
