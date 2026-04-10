import type {
	BuilderApprovalTicket,
	BuilderAssumption,
	BuilderBlueprint,
	BuilderChannelMessage,
	BuilderConflict,
	BuilderConversation,
	BuilderDecisionReceipt,
	BuilderDirectiveCandidate,
	BuilderExportBundle,
	BuilderFusionGraphEdge,
	BuilderMobileReviewCard,
	BuilderParticipantBinding,
	BuilderPlan,
	BuilderPreview,
	BuilderProviderActivity,
	BuilderReadinessReport,
	BuilderSourceRecord,
	BuilderTranscriptSegment,
	BuilderWorkspace,
	EvidenceReference,
	ExtractedAssetPart,
	RawAsset,
} from '@contractspec/lib.builder-spec';
import type {
	ExecutionComparisonRun,
	ExternalExecutionContextBundle,
	ExternalExecutionProvider,
	ExternalExecutionReceipt,
	ExternalPatchProposal,
	ProviderRoutingPolicy,
	RuntimeTarget,
} from '@contractspec/lib.provider-spec';

export interface BuilderStore {
	saveWorkspace(workspace: BuilderWorkspace): Promise<BuilderWorkspace>;
	getWorkspace(workspaceId: string): Promise<BuilderWorkspace | null>;
	listWorkspaces(tenantId?: string): Promise<BuilderWorkspace[]>;
	saveConversation(
		conversation: BuilderConversation
	): Promise<BuilderConversation>;
	getConversation(conversationId: string): Promise<BuilderConversation | null>;
	listConversations(workspaceId: string): Promise<BuilderConversation[]>;
	saveParticipantBinding(
		binding: BuilderParticipantBinding
	): Promise<BuilderParticipantBinding>;
	getParticipantBinding(
		bindingId: string
	): Promise<BuilderParticipantBinding | null>;
	listParticipantBindings(
		workspaceId: string
	): Promise<BuilderParticipantBinding[]>;
	saveSource(source: BuilderSourceRecord): Promise<BuilderSourceRecord>;
	getSource(sourceId: string): Promise<BuilderSourceRecord | null>;
	listSources(workspaceId: string): Promise<BuilderSourceRecord[]>;
	saveRawAsset(asset: RawAsset): Promise<RawAsset>;
	getRawAsset(assetId: string): Promise<RawAsset | null>;
	listRawAssets(workspaceId: string): Promise<RawAsset[]>;
	saveExtractedPart(part: ExtractedAssetPart): Promise<ExtractedAssetPart>;
	listExtractedParts(sourceId: string): Promise<ExtractedAssetPart[]>;
	saveEvidenceReference(ref: EvidenceReference): Promise<EvidenceReference>;
	listEvidenceReferences(workspaceId: string): Promise<EvidenceReference[]>;
	saveChannelMessage(
		message: BuilderChannelMessage
	): Promise<BuilderChannelMessage>;
	listChannelMessages(conversationId: string): Promise<BuilderChannelMessage[]>;
	saveTranscriptSegment(
		segment: BuilderTranscriptSegment
	): Promise<BuilderTranscriptSegment>;
	listTranscriptSegments(sourceId: string): Promise<BuilderTranscriptSegment[]>;
	saveDirective(
		directive: BuilderDirectiveCandidate
	): Promise<BuilderDirectiveCandidate>;
	getDirective(directiveId: string): Promise<BuilderDirectiveCandidate | null>;
	listDirectives(workspaceId: string): Promise<BuilderDirectiveCandidate[]>;
	saveAssumption(assumption: BuilderAssumption): Promise<BuilderAssumption>;
	getAssumption(assumptionId: string): Promise<BuilderAssumption | null>;
	listAssumptions(workspaceId: string): Promise<BuilderAssumption[]>;
	saveConflict(conflict: BuilderConflict): Promise<BuilderConflict>;
	getConflict(conflictId: string): Promise<BuilderConflict | null>;
	listConflicts(workspaceId: string): Promise<BuilderConflict[]>;
	saveDecisionReceipt(
		receipt: BuilderDecisionReceipt
	): Promise<BuilderDecisionReceipt>;
	listDecisionReceipts(workspaceId: string): Promise<BuilderDecisionReceipt[]>;
	saveFusionGraphEdge(
		edge: BuilderFusionGraphEdge
	): Promise<BuilderFusionGraphEdge>;
	listFusionGraphEdges(workspaceId: string): Promise<BuilderFusionGraphEdge[]>;
	saveBlueprint(blueprint: BuilderBlueprint): Promise<BuilderBlueprint>;
	getBlueprint(workspaceId: string): Promise<BuilderBlueprint | null>;
	savePlan(plan: BuilderPlan): Promise<BuilderPlan>;
	getPlan(workspaceId: string): Promise<BuilderPlan | null>;
	saveApprovalTicket(
		ticket: BuilderApprovalTicket
	): Promise<BuilderApprovalTicket>;
	getApprovalTicket(ticketId: string): Promise<BuilderApprovalTicket | null>;
	listApprovalTickets(workspaceId: string): Promise<BuilderApprovalTicket[]>;
	savePreview(preview: BuilderPreview): Promise<BuilderPreview>;
	getPreview(workspaceId: string): Promise<BuilderPreview | null>;
	saveReadinessReport(
		report: BuilderReadinessReport
	): Promise<BuilderReadinessReport>;
	getReadinessReport(
		workspaceId: string
	): Promise<BuilderReadinessReport | null>;
	saveExportBundle(bundle: BuilderExportBundle): Promise<BuilderExportBundle>;
	getExportBundle(workspaceId: string): Promise<BuilderExportBundle | null>;
	saveRuntimeTarget(target: RuntimeTarget): Promise<RuntimeTarget>;
	getRuntimeTarget(targetId: string): Promise<RuntimeTarget | null>;
	listRuntimeTargets(workspaceId: string): Promise<RuntimeTarget[]>;
	saveExternalProvider(
		provider: ExternalExecutionProvider
	): Promise<ExternalExecutionProvider>;
	getExternalProvider(
		providerId: string
	): Promise<ExternalExecutionProvider | null>;
	listExternalProviders(
		workspaceId: string
	): Promise<ExternalExecutionProvider[]>;
	saveRoutingPolicy(
		policy: ProviderRoutingPolicy
	): Promise<ProviderRoutingPolicy>;
	getRoutingPolicy(workspaceId: string): Promise<ProviderRoutingPolicy | null>;
	saveExecutionContextBundle(
		bundle: ExternalExecutionContextBundle
	): Promise<ExternalExecutionContextBundle>;
	getExecutionContextBundle(
		bundleId: string
	): Promise<ExternalExecutionContextBundle | null>;
	listExecutionContextBundles(
		workspaceId: string
	): Promise<ExternalExecutionContextBundle[]>;
	saveExecutionReceipt(
		receipt: ExternalExecutionReceipt
	): Promise<ExternalExecutionReceipt>;
	getExecutionReceipt(
		receiptId: string
	): Promise<ExternalExecutionReceipt | null>;
	listExecutionReceipts(
		workspaceId: string
	): Promise<ExternalExecutionReceipt[]>;
	savePatchProposal(
		proposal: ExternalPatchProposal
	): Promise<ExternalPatchProposal>;
	getPatchProposal(proposalId: string): Promise<ExternalPatchProposal | null>;
	listPatchProposals(workspaceId: string): Promise<ExternalPatchProposal[]>;
	saveComparisonRun(
		run: ExecutionComparisonRun
	): Promise<ExecutionComparisonRun>;
	getComparisonRun(runId: string): Promise<ExecutionComparisonRun | null>;
	listComparisonRuns(workspaceId: string): Promise<ExecutionComparisonRun[]>;
	saveMobileReviewCard(
		card: BuilderMobileReviewCard
	): Promise<BuilderMobileReviewCard>;
	getMobileReviewCard(cardId: string): Promise<BuilderMobileReviewCard | null>;
	listMobileReviewCards(
		workspaceId: string
	): Promise<BuilderMobileReviewCard[]>;
	saveProviderActivity(
		activity: BuilderProviderActivity
	): Promise<BuilderProviderActivity>;
	listProviderActivities(
		workspaceId: string
	): Promise<BuilderProviderActivity[]>;
}
