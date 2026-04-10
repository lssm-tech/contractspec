import type {
	ApprovalRecord,
	CompletionLoopState,
	EvidenceBundleRef,
	LaneArtifactRecord,
	LaneEventRecord,
	LaneRunState,
	LaneRuntimeSnapshot,
	LaneTransitionRecord,
	TeamRunState,
} from '../types';

export interface LaneRuntimeStore {
	createRun(run: LaneRunState): Promise<void>;
	getRun(runId: string): Promise<LaneRunState | undefined>;
	updateRun(
		runId: string,
		updater: (current: LaneRunState) => LaneRunState
	): Promise<LaneRunState>;
	listRuns(): Promise<LaneRunState[]>;
	saveArtifact(artifact: LaneArtifactRecord): Promise<void>;
	listArtifacts(runId: string): Promise<LaneArtifactRecord[]>;
	appendEvent(event: LaneEventRecord): Promise<void>;
	listEvents(runId: string): Promise<LaneEventRecord[]>;
	saveTransition(transition: LaneTransitionRecord): Promise<void>;
	listTransitions(runId: string): Promise<LaneTransitionRecord[]>;
	saveEvidence(bundle: EvidenceBundleRef): Promise<void>;
	listEvidence(runId: string): Promise<EvidenceBundleRef[]>;
	saveApproval(approval: ApprovalRecord): Promise<void>;
	listApprovals(runId: string): Promise<ApprovalRecord[]>;
	saveCompletion(state: CompletionLoopState): Promise<void>;
	getCompletion(runId: string): Promise<CompletionLoopState | undefined>;
	saveTeam(state: TeamRunState): Promise<void>;
	getTeam(runId: string): Promise<TeamRunState | undefined>;
	getSnapshot(runId: string): Promise<LaneRuntimeSnapshot | undefined>;
}
