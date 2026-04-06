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
import { deepClone } from '../utils/deep-clone';
import type { LaneRuntimeStore } from './store';

export class InMemoryLaneRuntimeStore implements LaneRuntimeStore {
	private readonly runs = new Map<string, LaneRunState>();
	private readonly artifacts = new Map<string, LaneArtifactRecord[]>();
	private readonly events = new Map<string, LaneEventRecord[]>();
	private readonly transitions = new Map<string, LaneTransitionRecord[]>();
	private readonly evidence = new Map<string, EvidenceBundleRef[]>();
	private readonly approvals = new Map<string, ApprovalRecord[]>();
	private readonly completions = new Map<string, CompletionLoopState>();
	private readonly teams = new Map<string, TeamRunState>();

	async createRun(run: LaneRunState): Promise<void> {
		this.runs.set(run.runId, deepClone(run));
	}

	async getRun(runId: string): Promise<LaneRunState | undefined> {
		const run = this.runs.get(runId);
		return run ? deepClone(run) : undefined;
	}

	async updateRun(
		runId: string,
		updater: (current: LaneRunState) => LaneRunState
	): Promise<LaneRunState> {
		const run = this.runs.get(runId);
		if (!run) {
			throw new Error(`Lane run not found: ${runId}`);
		}
		const next = deepClone(updater(deepClone(run)));
		this.runs.set(runId, next);
		return deepClone(next);
	}

	async listRuns(): Promise<LaneRunState[]> {
		return Array.from(this.runs.values()).map((item) => deepClone(item));
	}

	async saveArtifact(artifact: LaneArtifactRecord): Promise<void> {
		this.upsert(this.artifacts, artifact.runId, artifact);
	}

	async listArtifacts(runId: string): Promise<LaneArtifactRecord[]> {
		return this.cloneList(this.artifacts, runId);
	}

	async appendEvent(event: LaneEventRecord): Promise<void> {
		this.upsert(this.events, event.runId, event);
	}

	async listEvents(runId: string): Promise<LaneEventRecord[]> {
		return this.cloneList(this.events, runId);
	}

	async saveTransition(transition: LaneTransitionRecord): Promise<void> {
		this.upsert(this.transitions, transition.runId, transition);
	}

	async listTransitions(runId: string): Promise<LaneTransitionRecord[]> {
		return this.cloneList(this.transitions, runId);
	}

	async saveEvidence(bundle: EvidenceBundleRef): Promise<void> {
		this.upsert(this.evidence, bundle.runId, bundle);
	}

	async listEvidence(runId: string): Promise<EvidenceBundleRef[]> {
		return this.cloneList(this.evidence, runId);
	}

	async saveApproval(approval: ApprovalRecord): Promise<void> {
		this.upsert(this.approvals, approval.runId, approval);
	}

	async listApprovals(runId: string): Promise<ApprovalRecord[]> {
		return this.cloneList(this.approvals, runId);
	}

	async saveCompletion(state: CompletionLoopState): Promise<void> {
		this.completions.set(state.runId, deepClone(state));
	}

	async getCompletion(runId: string): Promise<CompletionLoopState | undefined> {
		const state = this.completions.get(runId);
		return state ? deepClone(state) : undefined;
	}

	async saveTeam(state: TeamRunState): Promise<void> {
		this.teams.set(state.runId, deepClone(state));
	}

	async getTeam(runId: string): Promise<TeamRunState | undefined> {
		const state = this.teams.get(runId);
		return state ? deepClone(state) : undefined;
	}

	async getSnapshot(runId: string): Promise<LaneRuntimeSnapshot | undefined> {
		const run = await this.getRun(runId);
		if (!run) {
			return undefined;
		}
		return {
			run,
			events: await this.listEvents(runId),
			transitions: await this.listTransitions(runId),
			artifacts: await this.listArtifacts(runId),
			evidence: await this.listEvidence(runId),
			approvals: await this.listApprovals(runId),
			completion: await this.getCompletion(runId),
			team: await this.getTeam(runId),
		};
	}

	private push<T>(store: Map<string, T[]>, runId: string, item: T) {
		const current = store.get(runId) ?? [];
		current.push(deepClone(item));
		store.set(runId, current);
	}

	private upsert<T extends { id: string }>(
		store: Map<string, T[]>,
		runId: string,
		item: T
	) {
		const current = store.get(runId) ?? [];
		const index = current.findIndex((entry) => entry.id === item.id);
		if (index === -1) {
			current.push(deepClone(item));
		} else {
			current[index] = deepClone(item);
		}
		store.set(runId, current);
	}

	private cloneList<T>(store: Map<string, T[]>, runId: string): T[] {
		return (store.get(runId) ?? []).map((item) => deepClone(item));
	}
}
