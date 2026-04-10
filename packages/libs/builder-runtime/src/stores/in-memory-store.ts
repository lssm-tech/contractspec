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
import type { BuilderStore } from './store';

type WorkspaceScopedRecord = { workspaceId: string };

function clone<T>(value: T): T {
	return structuredClone(value);
}

function listByWorkspace<T extends WorkspaceScopedRecord>(
	records: Map<string, T>,
	workspaceId: string
): T[] {
	return [...records.values()]
		.filter((record) => record.workspaceId === workspaceId)
		.map(clone);
}

export class InMemoryBuilderStore implements BuilderStore {
	private readonly workspaces = new Map<string, BuilderWorkspace>();
	private readonly conversations = new Map<string, BuilderConversation>();
	private readonly bindings = new Map<string, BuilderParticipantBinding>();
	private readonly sources = new Map<string, BuilderSourceRecord>();
	private readonly rawAssets = new Map<string, RawAsset>();
	private readonly extractedParts = new Map<string, ExtractedAssetPart>();
	private readonly evidenceRefs = new Map<string, EvidenceReference>();
	private readonly messages = new Map<string, BuilderChannelMessage>();
	private readonly transcripts = new Map<string, BuilderTranscriptSegment>();
	private readonly directives = new Map<string, BuilderDirectiveCandidate>();
	private readonly assumptions = new Map<string, BuilderAssumption>();
	private readonly conflicts = new Map<string, BuilderConflict>();
	private readonly decisions = new Map<string, BuilderDecisionReceipt>();
	private readonly edges = new Map<string, BuilderFusionGraphEdge>();
	private readonly blueprints = new Map<string, BuilderBlueprint>();
	private readonly plans = new Map<string, BuilderPlan>();
	private readonly approvals = new Map<string, BuilderApprovalTicket>();
	private readonly previews = new Map<string, BuilderPreview>();
	private readonly reports = new Map<string, BuilderReadinessReport>();
	private readonly exports = new Map<string, BuilderExportBundle>();
	private readonly runtimeTargets = new Map<string, RuntimeTarget>();
	private readonly externalProviders = new Map<
		string,
		ExternalExecutionProvider
	>();
	private readonly routingPolicies = new Map<string, ProviderRoutingPolicy>();
	private readonly executionContextBundles = new Map<
		string,
		ExternalExecutionContextBundle
	>();
	private readonly executionReceipts = new Map<
		string,
		ExternalExecutionReceipt
	>();
	private readonly patchProposals = new Map<string, ExternalPatchProposal>();
	private readonly comparisonRuns = new Map<string, ExecutionComparisonRun>();
	private readonly mobileReviewCards = new Map<
		string,
		BuilderMobileReviewCard
	>();
	private readonly providerActivities = new Map<
		string,
		BuilderProviderActivity
	>();

	async saveWorkspace(workspace: BuilderWorkspace) {
		this.workspaces.set(workspace.id, clone(workspace));
		return clone(workspace);
	}

	async getWorkspace(workspaceId: string) {
		const record = this.workspaces.get(workspaceId);
		return record ? clone(record) : null;
	}

	async listWorkspaces(tenantId?: string) {
		return [...this.workspaces.values()]
			.filter((workspace) =>
				tenantId ? workspace.tenantId === tenantId : true
			)
			.map(clone);
	}

	async saveConversation(conversation: BuilderConversation) {
		this.conversations.set(conversation.id, clone(conversation));
		return clone(conversation);
	}

	async getConversation(conversationId: string) {
		const record = this.conversations.get(conversationId);
		return record ? clone(record) : null;
	}

	async listConversations(workspaceId: string) {
		return listByWorkspace(this.conversations, workspaceId);
	}

	async saveParticipantBinding(binding: BuilderParticipantBinding) {
		this.bindings.set(binding.id, clone(binding));
		return clone(binding);
	}

	async getParticipantBinding(bindingId: string) {
		const record = this.bindings.get(bindingId);
		return record ? clone(record) : null;
	}

	async listParticipantBindings(workspaceId: string) {
		return listByWorkspace(this.bindings, workspaceId);
	}

	async saveSource(source: BuilderSourceRecord) {
		this.sources.set(source.id, clone(source));
		return clone(source);
	}

	async getSource(sourceId: string) {
		const record = this.sources.get(sourceId);
		return record ? clone(record) : null;
	}

	async listSources(workspaceId: string) {
		return listByWorkspace(this.sources, workspaceId);
	}

	async saveRawAsset(asset: RawAsset) {
		this.rawAssets.set(asset.id, clone(asset));
		return clone(asset);
	}

	async getRawAsset(assetId: string) {
		const record = this.rawAssets.get(assetId);
		return record ? clone(record) : null;
	}

	async listRawAssets(workspaceId: string) {
		return listByWorkspace(this.rawAssets, workspaceId);
	}

	async saveExtractedPart(part: ExtractedAssetPart) {
		this.extractedParts.set(part.id, clone(part));
		return clone(part);
	}

	async listExtractedParts(sourceId: string) {
		return [...this.extractedParts.values()]
			.filter((part) => part.sourceId === sourceId)
			.map(clone);
	}

	async saveEvidenceReference(ref: EvidenceReference) {
		this.evidenceRefs.set(ref.id, clone(ref));
		return clone(ref);
	}

	async listEvidenceReferences(workspaceId: string) {
		return listByWorkspace(this.evidenceRefs, workspaceId);
	}

	async saveChannelMessage(message: BuilderChannelMessage) {
		this.messages.set(message.id, clone(message));
		return clone(message);
	}

	async listChannelMessages(conversationId: string) {
		return [...this.messages.values()]
			.filter((message) => message.conversationId === conversationId)
			.map(clone)
			.sort((left, right) => left.receivedAt.localeCompare(right.receivedAt));
	}

	async saveTranscriptSegment(segment: BuilderTranscriptSegment) {
		this.transcripts.set(segment.id, clone(segment));
		return clone(segment);
	}

	async listTranscriptSegments(sourceId: string) {
		return [...this.transcripts.values()]
			.filter((segment) => segment.sourceId === sourceId)
			.map(clone);
	}

	async saveDirective(directive: BuilderDirectiveCandidate) {
		this.directives.set(directive.id, clone(directive));
		return clone(directive);
	}

	async getDirective(directiveId: string) {
		const record = this.directives.get(directiveId);
		return record ? clone(record) : null;
	}

	async listDirectives(workspaceId: string) {
		return listByWorkspace(this.directives, workspaceId);
	}

	async saveAssumption(assumption: BuilderAssumption) {
		this.assumptions.set(assumption.id, clone(assumption));
		return clone(assumption);
	}

	async getAssumption(assumptionId: string) {
		const record = this.assumptions.get(assumptionId);
		return record ? clone(record) : null;
	}

	async listAssumptions(workspaceId: string) {
		return listByWorkspace(this.assumptions, workspaceId);
	}

	async saveConflict(conflict: BuilderConflict) {
		this.conflicts.set(conflict.id, clone(conflict));
		return clone(conflict);
	}

	async getConflict(conflictId: string) {
		const record = this.conflicts.get(conflictId);
		return record ? clone(record) : null;
	}

	async listConflicts(workspaceId: string) {
		return listByWorkspace(this.conflicts, workspaceId);
	}

	async saveDecisionReceipt(receipt: BuilderDecisionReceipt) {
		this.decisions.set(receipt.id, clone(receipt));
		return clone(receipt);
	}

	async listDecisionReceipts(workspaceId: string) {
		return listByWorkspace(this.decisions, workspaceId);
	}

	async saveFusionGraphEdge(edge: BuilderFusionGraphEdge) {
		this.edges.set(edge.id, clone(edge));
		return clone(edge);
	}

	async listFusionGraphEdges(workspaceId: string) {
		return listByWorkspace(this.edges, workspaceId);
	}

	async saveBlueprint(blueprint: BuilderBlueprint) {
		this.blueprints.set(blueprint.workspaceId, clone(blueprint));
		return clone(blueprint);
	}

	async getBlueprint(workspaceId: string) {
		const record = this.blueprints.get(workspaceId);
		return record ? clone(record) : null;
	}

	async savePlan(plan: BuilderPlan) {
		this.plans.set(plan.workspaceId, clone(plan));
		return clone(plan);
	}

	async getPlan(workspaceId: string) {
		const record = this.plans.get(workspaceId);
		return record ? clone(record) : null;
	}

	async saveApprovalTicket(ticket: BuilderApprovalTicket) {
		this.approvals.set(ticket.id, clone(ticket));
		return clone(ticket);
	}

	async getApprovalTicket(ticketId: string) {
		const record = this.approvals.get(ticketId);
		return record ? clone(record) : null;
	}

	async listApprovalTickets(workspaceId: string) {
		return listByWorkspace(this.approvals, workspaceId);
	}

	async savePreview(preview: BuilderPreview) {
		this.previews.set(preview.workspaceId, clone(preview));
		return clone(preview);
	}

	async getPreview(workspaceId: string) {
		const record = this.previews.get(workspaceId);
		return record ? clone(record) : null;
	}

	async saveReadinessReport(report: BuilderReadinessReport) {
		this.reports.set(report.workspaceId, clone(report));
		return clone(report);
	}

	async getReadinessReport(workspaceId: string) {
		const record = this.reports.get(workspaceId);
		return record ? clone(record) : null;
	}

	async saveExportBundle(bundle: BuilderExportBundle) {
		this.exports.set(bundle.workspaceId, clone(bundle));
		return clone(bundle);
	}

	async getExportBundle(workspaceId: string) {
		const record = this.exports.get(workspaceId);
		return record ? clone(record) : null;
	}

	async saveRuntimeTarget(target: RuntimeTarget) {
		this.runtimeTargets.set(target.id, clone(target));
		return clone(target);
	}

	async getRuntimeTarget(targetId: string) {
		const record = this.runtimeTargets.get(targetId);
		return record ? clone(record) : null;
	}

	async listRuntimeTargets(workspaceId: string) {
		return listByWorkspace(this.runtimeTargets, workspaceId);
	}

	async saveExternalProvider(provider: ExternalExecutionProvider) {
		this.externalProviders.set(provider.id, clone(provider));
		return clone(provider);
	}

	async getExternalProvider(providerId: string) {
		const record = this.externalProviders.get(providerId);
		return record ? clone(record) : null;
	}

	async listExternalProviders(workspaceId: string) {
		return listByWorkspace(this.externalProviders, workspaceId);
	}

	async saveRoutingPolicy(policy: ProviderRoutingPolicy) {
		this.routingPolicies.set(policy.workspaceId, clone(policy));
		return clone(policy);
	}

	async getRoutingPolicy(workspaceId: string) {
		const record = this.routingPolicies.get(workspaceId);
		return record ? clone(record) : null;
	}

	async saveExecutionContextBundle(bundle: ExternalExecutionContextBundle) {
		this.executionContextBundles.set(bundle.id, clone(bundle));
		return clone(bundle);
	}

	async getExecutionContextBundle(bundleId: string) {
		const record = this.executionContextBundles.get(bundleId);
		return record ? clone(record) : null;
	}

	async listExecutionContextBundles(workspaceId: string) {
		return listByWorkspace(this.executionContextBundles, workspaceId);
	}

	async saveExecutionReceipt(receipt: ExternalExecutionReceipt) {
		this.executionReceipts.set(receipt.id, clone(receipt));
		return clone(receipt);
	}

	async getExecutionReceipt(receiptId: string) {
		const record = this.executionReceipts.get(receiptId);
		return record ? clone(record) : null;
	}

	async listExecutionReceipts(workspaceId: string) {
		return listByWorkspace(this.executionReceipts, workspaceId);
	}

	async savePatchProposal(proposal: ExternalPatchProposal) {
		this.patchProposals.set(proposal.id, clone(proposal));
		return clone(proposal);
	}

	async getPatchProposal(proposalId: string) {
		const record = this.patchProposals.get(proposalId);
		return record ? clone(record) : null;
	}

	async listPatchProposals(workspaceId: string) {
		return listByWorkspace(this.patchProposals, workspaceId);
	}

	async saveComparisonRun(run: ExecutionComparisonRun) {
		this.comparisonRuns.set(run.id, clone(run));
		return clone(run);
	}

	async getComparisonRun(runId: string) {
		const record = this.comparisonRuns.get(runId);
		return record ? clone(record) : null;
	}

	async listComparisonRuns(workspaceId: string) {
		return listByWorkspace(this.comparisonRuns, workspaceId);
	}

	async saveMobileReviewCard(card: BuilderMobileReviewCard) {
		this.mobileReviewCards.set(card.id, clone(card));
		return clone(card);
	}

	async getMobileReviewCard(cardId: string) {
		const record = this.mobileReviewCards.get(cardId);
		return record ? clone(record) : null;
	}

	async listMobileReviewCards(workspaceId: string) {
		return listByWorkspace(this.mobileReviewCards, workspaceId);
	}

	async saveProviderActivity(activity: BuilderProviderActivity) {
		this.providerActivities.set(activity.id, clone(activity));
		return clone(activity);
	}

	async listProviderActivities(workspaceId: string) {
		return listByWorkspace(this.providerActivities, workspaceId);
	}
}
