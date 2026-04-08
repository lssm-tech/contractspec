import type {
	BuilderWorkspace,
	BuilderWorkspaceSnapshot,
} from '@contractspec/lib.builder-spec';

export type BuilderWorkbenchSnapshot = BuilderWorkspaceSnapshot;

export interface BuilderWorkbenchSummary {
	workspaceName: string;
	status: BuilderWorkspace['status'];
	defaultRuntimeMode: BuilderWorkspace['defaultRuntimeMode'];
	sourceCount: number;
	messageCount: number;
	blockerCount: number;
	warningCount: number;
	verifiedBindingCount: number;
	pendingApprovalCount: number;
	openConflictCount: number;
	decisionCount: number;
	runtimeTargetCount: number;
	providerRunCount: number;
	mobileReviewCount: number;
	readinessLabel: string;
}

export function summarizeBuilderWorkbench(
	snapshot: BuilderWorkbenchSnapshot
): BuilderWorkbenchSummary {
	return {
		workspaceName: snapshot.workspace.name,
		status: snapshot.workspace.status,
		defaultRuntimeMode: snapshot.workspace.defaultRuntimeMode,
		sourceCount: snapshot.sources.length,
		messageCount: snapshot.messages.length,
		blockerCount: snapshot.readinessReport?.blockingIssues.length ?? 0,
		warningCount: snapshot.readinessReport?.warnings.length ?? 0,
		verifiedBindingCount: snapshot.participantBindings.filter(
			(binding) => !binding.revokedAt
		).length,
		pendingApprovalCount: snapshot.approvalTickets.filter(
			(ticket) => ticket.status === 'open'
		).length,
		openConflictCount: snapshot.conflicts.filter(
			(conflict) => conflict.status === 'open'
		).length,
		decisionCount: snapshot.decisionReceipts.length,
		runtimeTargetCount: snapshot.runtimeTargets.length,
		providerRunCount: snapshot.executionReceipts.length,
		mobileReviewCount: snapshot.mobileReviewCards.length,
		readinessLabel:
			snapshot.readinessReport?.overallStatus ??
			(snapshot.blueprint ? 'needs_review' : 'draft_only'),
	};
}
