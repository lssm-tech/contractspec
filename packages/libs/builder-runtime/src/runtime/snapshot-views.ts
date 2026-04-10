import type {
	BuilderAssumption,
	BuilderConflict,
	BuilderDecisionLedger,
	BuilderDecisionReceipt,
	BuilderProviderProposalRegisterEntry,
	BuilderSourceRecord,
	BuilderSourceTimelineEntry,
} from '@contractspec/lib.builder-spec';
import type { ExternalPatchProposal } from '@contractspec/lib.provider-spec';

export function buildDecisionLedger(input: {
	decisionReceipts: BuilderDecisionReceipt[];
	assumptions: BuilderAssumption[];
}): BuilderDecisionLedger {
	return {
		decisions: input.decisionReceipts.map((receipt) => ({
			id: receipt.id,
			workspaceId: receipt.workspaceId,
			decisionType: receipt.requiresHumanReview ? 'unresolved' : 'accepted',
			statement: `${receipt.decisionType} ${receipt.affectedFields.join(', ')}`,
			status: receipt.requiresHumanReview ? 'unresolved' : 'accepted',
			sourceRefs: receipt.supportingSourceIds,
			confidence: receipt.requiresHumanReview ? 0.6 : 0.95,
			recordedAt: receipt.resolvedAt,
		})),
		inferences: input.assumptions.map((assumption) => ({
			id: assumption.id,
			workspaceId: assumption.workspaceId,
			statement: assumption.statement,
			sourceRefs: assumption.sourceIds,
			confidence: assumption.severity === 'high' ? 0.5 : 0.75,
			requiresConfirmation: assumption.status === 'open',
			recordedAt: assumption.updatedAt,
		})),
	};
}

export function buildSourceTimeline(input: {
	sources: BuilderSourceRecord[];
	conflicts: BuilderConflict[];
}): BuilderSourceTimelineEntry[] {
	return [...input.sources]
		.sort((left, right) => left.createdAt.localeCompare(right.createdAt))
		.map((source) => ({
			id: `${source.id}_timeline`,
			workspaceId: source.workspaceId,
			sourceId: source.id,
			sourceType: source.sourceType,
			channelType: source.channelType,
			label: source.title,
			state: source.deletedAt
				? 'stale'
				: source.sourceType === 'provider_output'
					? 'proposed_by_provider'
					: source.approvalState === 'approved'
						? 'approved'
						: input.conflicts.some((conflict) =>
									conflict.sourceIds.includes(source.id)
								)
							? 'conflicted'
							: 'explicit',
			recordedAt: source.updatedAt,
		}));
}

export function buildProviderProposalRegister(input: {
	proposals: ExternalPatchProposal[];
	receiptsById: Map<string, { providerId: string }>;
}): BuilderProviderProposalRegisterEntry[] {
	return input.proposals.map((proposal) => ({
		id: `${proposal.id}_register`,
		workspaceId: proposal.workspaceId,
		proposalId: proposal.id,
		providerId:
			input.receiptsById.get(proposal.receiptId)?.providerId ?? 'unknown',
		status: proposal.status,
		changedAreas: proposal.changedAreas,
		receiptId: proposal.receiptId,
		recordedAt: proposal.updatedAt,
	}));
}
