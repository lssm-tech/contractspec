import type {
	CompletionStatusView,
	LaneRuntimeSnapshot,
	LaneRuntimeStore,
	LaneStatusView,
	TeamStatusView,
} from '@contractspec/lib.execution-lanes';
import {
	escalateLaneRun,
	requestLaneApproval,
} from './execution-lanes-service-approval';
import {
	abortLaneRun,
	nudgeLaneRun,
	pauseLaneRun,
	resumeLaneRun,
	retryLaneRun,
	shutdownLaneRun,
} from './execution-lanes-service-mutations';
import {
	exportLaneEvidence,
	getLaneCompletionStatus,
	getLaneRun,
	getLaneTeamStatus,
	listLaneRuns,
	openLaneReplay,
} from './execution-lanes-service-queries';
import {
	type EscalateExecutionLaneInput,
	type ExecutionLaneOperatorServiceOptions,
	type ListExecutionLaneRunsInput,
	type NudgeExecutionLaneInput,
	type RequestExecutionLaneApprovalInput,
} from './execution-lanes-service-shared';

export class ExecutionLaneOperatorService {
	constructor(
		private readonly store: LaneRuntimeStore,
		private readonly options: ExecutionLaneOperatorServiceOptions = {}
	) {}

	list(input: ListExecutionLaneRunsInput = {}): Promise<LaneStatusView[]> {
		return listLaneRuns(this.dependencies, input);
	}

	get(runId: string): Promise<LaneRuntimeSnapshot | undefined> {
		return getLaneRun(this.dependencies, runId);
	}

	pause(runId: string, actorId?: string) {
		return pauseLaneRun(this.dependencies, runId, actorId);
	}

	resume(runId: string, actorId?: string) {
		return resumeLaneRun(this.dependencies, runId, actorId);
	}

	retry(runId: string, actorId?: string) {
		return retryLaneRun(this.dependencies, runId, actorId);
	}

	abort(runId: string, reason?: string, actorId?: string) {
		return abortLaneRun(this.dependencies, runId, reason, actorId);
	}

	shutdown(runId: string, reason?: string, actorId?: string) {
		return shutdownLaneRun(this.dependencies, runId, reason, actorId);
	}

	nudge(runId: string, input: NudgeExecutionLaneInput) {
		return nudgeLaneRun(this.dependencies, runId, input);
	}

	requestApproval(runId: string, input: RequestExecutionLaneApprovalInput) {
		return requestLaneApproval(this.dependencies, runId, input);
	}

	escalate(runId: string, input: EscalateExecutionLaneInput) {
		return escalateLaneRun(this.dependencies, runId, input);
	}

	exportEvidence(runId: string) {
		return exportLaneEvidence(this.dependencies, runId);
	}

	openReplay(runId: string, actorId?: string) {
		return openLaneReplay(this.dependencies, runId, actorId);
	}

	getTeamStatus(runId: string): Promise<TeamStatusView | undefined> {
		return getLaneTeamStatus(this.dependencies, runId);
	}

	getCompletionStatus(
		runId: string
	): Promise<CompletionStatusView | undefined> {
		return getLaneCompletionStatus(this.dependencies, runId);
	}

	private get dependencies() {
		return {
			store: this.store,
			options: this.options,
		};
	}
}

export type {
	EscalateExecutionLaneInput,
	ExecutionLaneOperatorServiceOptions,
	ListExecutionLaneRunsInput,
	NudgeExecutionLaneInput,
	RequestExecutionLaneApprovalInput,
} from './execution-lanes-service-shared';
