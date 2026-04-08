import type { BuilderStore } from '@contractspec/lib.builder-runtime/stores';
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
import type { Pool } from 'pg';
import { BUILDER_RUNTIME_SCHEMA_STATEMENTS } from './postgres-schema';

type BuilderRecord =
	| BuilderApprovalTicket
	| BuilderAssumption
	| BuilderBlueprint
	| BuilderChannelMessage
	| BuilderConflict
	| BuilderConversation
	| BuilderDecisionReceipt
	| BuilderDirectiveCandidate
	| BuilderExportBundle
	| BuilderFusionGraphEdge
	| BuilderMobileReviewCard
	| BuilderParticipantBinding
	| BuilderPlan
	| BuilderPreview
	| BuilderProviderActivity
	| BuilderReadinessReport
	| BuilderSourceRecord
	| BuilderTranscriptSegment
	| ExecutionComparisonRun
	| ExternalExecutionContextBundle
	| ExternalExecutionProvider
	| ExternalExecutionReceipt
	| ExternalPatchProposal
	| EvidenceReference
	| ExtractedAssetPart
	| ProviderRoutingPolicy
	| RawAsset
	| RuntimeTarget;

export class PostgresBuilderStore implements BuilderStore {
	constructor(private readonly pool: Pool) {}

	async initializeSchema(): Promise<void> {
		for (const statement of BUILDER_RUNTIME_SCHEMA_STATEMENTS) {
			await this.pool.query(statement);
		}
	}

	async saveWorkspace(workspace: BuilderWorkspace) {
		await this.pool.query(
			`
			insert into builder_workspaces (id, tenant_id, record, updated_at)
			values ($1, $2, $3::jsonb, now())
			on conflict (id) do update
			set tenant_id = excluded.tenant_id,
			    record = excluded.record,
			    updated_at = now()
			`,
			[workspace.id, workspace.tenantId, JSON.stringify(workspace)]
		);
		return workspace;
	}

	async getWorkspace(workspaceId: string) {
		const result = await this.pool.query<{ record: BuilderWorkspace }>(
			`select record from builder_workspaces where id = $1`,
			[workspaceId]
		);
		return result.rows[0]?.record ?? null;
	}

	async listWorkspaces(tenantId?: string) {
		const result = tenantId
			? await this.pool.query<{ record: BuilderWorkspace }>(
					`select record from builder_workspaces where tenant_id = $1 order by updated_at desc`,
					[tenantId]
				)
			: await this.pool.query<{ record: BuilderWorkspace }>(
					`select record from builder_workspaces order by updated_at desc`
				);
		return result.rows.map((row) => row.record);
	}

	async saveConversation(conversation: BuilderConversation) {
		return this.saveRecord(
			'conversation',
			conversation.id,
			conversation.workspaceId,
			conversation.workspaceId,
			conversation
		);
	}

	async getConversation(conversationId: string) {
		return this.getRecord<BuilderConversation>('conversation', conversationId);
	}

	async listConversations(workspaceId: string) {
		return this.listRecords<BuilderConversation>('conversation', workspaceId);
	}

	async saveParticipantBinding(binding: BuilderParticipantBinding) {
		return this.saveRecord(
			'participant_binding',
			binding.id,
			binding.workspaceId,
			binding.externalIdentityRef,
			binding
		);
	}

	async getParticipantBinding(bindingId: string) {
		return this.getRecord<BuilderParticipantBinding>(
			'participant_binding',
			bindingId
		);
	}

	async listParticipantBindings(workspaceId: string) {
		return this.listRecords<BuilderParticipantBinding>(
			'participant_binding',
			workspaceId
		);
	}

	async saveSource(source: BuilderSourceRecord) {
		return this.saveRecord(
			'source',
			source.id,
			source.workspaceId,
			source.conversationId,
			source
		);
	}

	async getSource(sourceId: string) {
		return this.getRecord<BuilderSourceRecord>('source', sourceId);
	}

	async listSources(workspaceId: string) {
		return this.listRecords<BuilderSourceRecord>('source', workspaceId);
	}

	async saveRawAsset(asset: RawAsset) {
		return this.saveRecord(
			'raw_asset',
			asset.id,
			asset.workspaceId,
			asset.sourceId,
			asset
		);
	}

	async getRawAsset(assetId: string) {
		return this.getRecord<RawAsset>('raw_asset', assetId);
	}

	async listRawAssets(workspaceId: string) {
		return this.listRecords<RawAsset>('raw_asset', workspaceId);
	}

	async saveExtractedPart(part: ExtractedAssetPart) {
		return this.saveRecord(
			'extracted_part',
			part.id,
			part.workspaceId,
			part.sourceId,
			part
		);
	}

	async listExtractedParts(sourceId: string) {
		return this.listRecordsByScope<ExtractedAssetPart>(
			'extracted_part',
			sourceId
		);
	}

	async saveEvidenceReference(ref: EvidenceReference) {
		return this.saveRecord(
			'evidence_ref',
			ref.id,
			ref.workspaceId,
			ref.sourceId,
			ref
		);
	}

	async listEvidenceReferences(workspaceId: string) {
		return this.listRecords<EvidenceReference>('evidence_ref', workspaceId);
	}

	async saveChannelMessage(message: BuilderChannelMessage) {
		return this.saveRecord(
			'channel_message',
			message.id,
			message.workspaceId,
			message.conversationId,
			message
		);
	}

	async listChannelMessages(conversationId: string) {
		return this.listRecordsByScope<BuilderChannelMessage>(
			'channel_message',
			conversationId
		);
	}

	async saveTranscriptSegment(segment: BuilderTranscriptSegment) {
		return this.saveRecord(
			'transcript_segment',
			segment.id,
			segment.workspaceId,
			segment.sourceId,
			segment
		);
	}

	async listTranscriptSegments(sourceId: string) {
		return this.listRecordsByScope<BuilderTranscriptSegment>(
			'transcript_segment',
			sourceId
		);
	}

	async saveDirective(directive: BuilderDirectiveCandidate) {
		return this.saveRecord(
			'directive',
			directive.id,
			directive.workspaceId,
			directive.targetArea,
			directive
		);
	}

	async getDirective(directiveId: string) {
		return this.getRecord<BuilderDirectiveCandidate>('directive', directiveId);
	}

	async listDirectives(workspaceId: string) {
		return this.listRecords<BuilderDirectiveCandidate>(
			'directive',
			workspaceId
		);
	}

	async saveAssumption(assumption: BuilderAssumption) {
		return this.saveRecord(
			'assumption',
			assumption.id,
			assumption.workspaceId,
			undefined,
			assumption
		);
	}

	async getAssumption(assumptionId: string) {
		return this.getRecord<BuilderAssumption>('assumption', assumptionId);
	}

	async listAssumptions(workspaceId: string) {
		return this.listRecords<BuilderAssumption>('assumption', workspaceId);
	}

	async saveConflict(conflict: BuilderConflict) {
		return this.saveRecord(
			'conflict',
			conflict.id,
			conflict.workspaceId,
			conflict.fieldPath,
			conflict
		);
	}

	async getConflict(conflictId: string) {
		return this.getRecord<BuilderConflict>('conflict', conflictId);
	}

	async listConflicts(workspaceId: string) {
		return this.listRecords<BuilderConflict>('conflict', workspaceId);
	}

	async saveDecisionReceipt(receipt: BuilderDecisionReceipt) {
		return this.saveRecord(
			'decision_receipt',
			receipt.id,
			receipt.workspaceId,
			receipt.traceId,
			receipt
		);
	}

	async listDecisionReceipts(workspaceId: string) {
		return this.listRecords<BuilderDecisionReceipt>(
			'decision_receipt',
			workspaceId
		);
	}

	async saveFusionGraphEdge(edge: BuilderFusionGraphEdge) {
		return this.saveRecord(
			'fusion_edge',
			edge.id,
			edge.workspaceId,
			edge.fromNodeId,
			edge
		);
	}

	async listFusionGraphEdges(workspaceId: string) {
		return this.listRecords<BuilderFusionGraphEdge>('fusion_edge', workspaceId);
	}

	async saveBlueprint(blueprint: BuilderBlueprint) {
		return this.saveRecord(
			'blueprint',
			blueprint.id,
			blueprint.workspaceId,
			blueprint.workspaceId,
			blueprint
		);
	}

	async getBlueprint(workspaceId: string) {
		const results = await this.listRecordsByScope<BuilderBlueprint>(
			'blueprint',
			workspaceId
		);
		return results[0] ?? null;
	}

	async savePlan(plan: BuilderPlan) {
		return this.saveRecord(
			'plan',
			plan.id,
			plan.workspaceId,
			plan.workspaceId,
			plan
		);
	}

	async getPlan(workspaceId: string) {
		const results = await this.listRecordsByScope<BuilderPlan>(
			'plan',
			workspaceId
		);
		return results[0] ?? null;
	}

	async saveApprovalTicket(ticket: BuilderApprovalTicket) {
		return this.saveRecord(
			'approval_ticket',
			ticket.id,
			ticket.workspaceId,
			ticket.conversationId,
			ticket
		);
	}

	async getApprovalTicket(ticketId: string) {
		return this.getRecord<BuilderApprovalTicket>('approval_ticket', ticketId);
	}

	async listApprovalTickets(workspaceId: string) {
		return this.listRecords<BuilderApprovalTicket>(
			'approval_ticket',
			workspaceId
		);
	}

	async savePreview(preview: BuilderPreview) {
		return this.saveRecord(
			'preview',
			preview.id,
			preview.workspaceId,
			preview.workspaceId,
			preview
		);
	}

	async getPreview(workspaceId: string) {
		const results = await this.listRecordsByScope<BuilderPreview>(
			'preview',
			workspaceId
		);
		return results[0] ?? null;
	}

	async saveReadinessReport(report: BuilderReadinessReport) {
		return this.saveRecord(
			'readiness_report',
			report.id,
			report.workspaceId,
			report.workspaceId,
			report
		);
	}

	async getReadinessReport(workspaceId: string) {
		const results = await this.listRecordsByScope<BuilderReadinessReport>(
			'readiness_report',
			workspaceId
		);
		return results[0] ?? null;
	}

	async saveExportBundle(bundle: BuilderExportBundle) {
		return this.saveRecord(
			'export_bundle',
			bundle.id,
			bundle.workspaceId,
			bundle.workspaceId,
			bundle
		);
	}

	async getExportBundle(workspaceId: string) {
		const results = await this.listRecordsByScope<BuilderExportBundle>(
			'export_bundle',
			workspaceId
		);
		return results[0] ?? null;
	}

	async saveRuntimeTarget(target: RuntimeTarget) {
		return this.saveRecord(
			'runtime_target',
			target.id,
			target.workspaceId,
			target.workspaceId,
			target
		);
	}

	async getRuntimeTarget(targetId: string) {
		return this.getRecord<RuntimeTarget>('runtime_target', targetId);
	}

	async listRuntimeTargets(workspaceId: string) {
		return this.listRecords<RuntimeTarget>('runtime_target', workspaceId);
	}

	async saveExternalProvider(provider: ExternalExecutionProvider) {
		return this.saveRecord(
			'external_provider',
			provider.id,
			provider.workspaceId,
			provider.workspaceId,
			provider
		);
	}

	async getExternalProvider(providerId: string) {
		return this.getRecord<ExternalExecutionProvider>(
			'external_provider',
			providerId
		);
	}

	async listExternalProviders(workspaceId: string) {
		return this.listRecords<ExternalExecutionProvider>(
			'external_provider',
			workspaceId
		);
	}

	async saveRoutingPolicy(policy: ProviderRoutingPolicy) {
		return this.saveRecord(
			'routing_policy',
			policy.id,
			policy.workspaceId,
			policy.workspaceId,
			policy
		);
	}

	async getRoutingPolicy(workspaceId: string) {
		const results = await this.listRecordsByScope<ProviderRoutingPolicy>(
			'routing_policy',
			workspaceId
		);
		return results[0] ?? null;
	}

	async saveExecutionContextBundle(bundle: ExternalExecutionContextBundle) {
		return this.saveRecord(
			'execution_context_bundle',
			bundle.id,
			bundle.workspaceId,
			bundle.workspaceId,
			bundle
		);
	}

	async getExecutionContextBundle(bundleId: string) {
		return this.getRecord<ExternalExecutionContextBundle>(
			'execution_context_bundle',
			bundleId
		);
	}

	async listExecutionContextBundles(workspaceId: string) {
		return this.listRecords<ExternalExecutionContextBundle>(
			'execution_context_bundle',
			workspaceId
		);
	}

	async saveExecutionReceipt(receipt: ExternalExecutionReceipt) {
		return this.saveRecord(
			'execution_receipt',
			receipt.id,
			receipt.workspaceId,
			receipt.workspaceId,
			receipt
		);
	}

	async getExecutionReceipt(receiptId: string) {
		return this.getRecord<ExternalExecutionReceipt>(
			'execution_receipt',
			receiptId
		);
	}

	async listExecutionReceipts(workspaceId: string) {
		return this.listRecords<ExternalExecutionReceipt>(
			'execution_receipt',
			workspaceId
		);
	}

	async savePatchProposal(proposal: ExternalPatchProposal) {
		return this.saveRecord(
			'patch_proposal',
			proposal.id,
			proposal.workspaceId,
			proposal.workspaceId,
			proposal
		);
	}

	async getPatchProposal(proposalId: string) {
		return this.getRecord<ExternalPatchProposal>('patch_proposal', proposalId);
	}

	async listPatchProposals(workspaceId: string) {
		return this.listRecords<ExternalPatchProposal>(
			'patch_proposal',
			workspaceId
		);
	}

	async saveComparisonRun(run: ExecutionComparisonRun) {
		return this.saveRecord(
			'comparison_run',
			run.id,
			run.workspaceId,
			run.workspaceId,
			run
		);
	}

	async getComparisonRun(runId: string) {
		return this.getRecord<ExecutionComparisonRun>('comparison_run', runId);
	}

	async listComparisonRuns(workspaceId: string) {
		return this.listRecords<ExecutionComparisonRun>(
			'comparison_run',
			workspaceId
		);
	}

	async saveMobileReviewCard(card: BuilderMobileReviewCard) {
		return this.saveRecord(
			'mobile_review_card',
			card.id,
			card.workspaceId,
			card.workspaceId,
			card
		);
	}

	async getMobileReviewCard(cardId: string) {
		return this.getRecord<BuilderMobileReviewCard>(
			'mobile_review_card',
			cardId
		);
	}

	async listMobileReviewCards(workspaceId: string) {
		return this.listRecords<BuilderMobileReviewCard>(
			'mobile_review_card',
			workspaceId
		);
	}

	async saveProviderActivity(activity: BuilderProviderActivity) {
		return this.saveRecord(
			'provider_activity',
			activity.id,
			activity.workspaceId,
			activity.workspaceId,
			activity
		);
	}

	async listProviderActivities(workspaceId: string) {
		return this.listRecords<BuilderProviderActivity>(
			'provider_activity',
			workspaceId
		);
	}

	private async saveRecord<T extends BuilderRecord>(
		kind: string,
		id: string,
		workspaceId: string,
		scopeId: string | undefined,
		record: T
	) {
		await this.pool.query(
			`
			insert into builder_records (kind, id, workspace_id, scope_id, record, updated_at)
			values ($1, $2, $3, $4, $5::jsonb, now())
			on conflict (kind, id) do update
			set workspace_id = excluded.workspace_id,
			    scope_id = excluded.scope_id,
			    record = excluded.record,
			    updated_at = now()
			`,
			[kind, id, workspaceId, scopeId ?? null, JSON.stringify(record)]
		);
		return record;
	}

	private async getRecord<T>(kind: string, id: string) {
		const result = await this.pool.query<{ record: T }>(
			`select record from builder_records where kind = $1 and id = $2`,
			[kind, id]
		);
		return result.rows[0]?.record ?? null;
	}

	private async listRecords<T>(kind: string, workspaceId: string) {
		const result = await this.pool.query<{ record: T }>(
			`select record from builder_records where kind = $1 and workspace_id = $2 order by updated_at desc`,
			[kind, workspaceId]
		);
		return result.rows.map((row) => row.record);
	}

	private async listRecordsByScope<T>(kind: string, scopeId: string) {
		const result = await this.pool.query<{ record: T }>(
			`select record from builder_records where kind = $1 and scope_id = $2 order by updated_at desc`,
			[kind, scopeId]
		);
		return result.rows.map((row) => row.record);
	}
}
