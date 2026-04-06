import type { LaneKey } from '../types';

export type LaneAuthorityAction =
	| 'append_approval'
	| 'append_artifact'
	| 'append_evidence'
	| 'append_event'
	| 'pause'
	| 'resume'
	| 'nudge'
	| 'retry'
	| 'abort'
	| 'shutdown'
	| 'request_approval'
	| 'escalate'
	| 'replay'
	| 'start_run'
	| 'transition_run'
	| 'handoff'
	| 'complete.attach_evidence'
	| 'complete.create'
	| 'complete.decide_approval'
	| 'complete.evaluate_evidence'
	| 'complete.finalize'
	| 'complete.progress'
	| 'complete.record_failure'
	| 'complete.request_approval'
	| 'complete.resume'
	| 'team.attach_run_evidence'
	| 'team.attach_task_evidence'
	| 'team.claim_task'
	| 'team.complete_task'
	| 'team.create'
	| 'team.fail_task'
	| 'team.finalize'
	| 'team.heartbeat'
	| 'team.rebalance'
	| 'team.reclaim_expired_leases'
	| 'team.reconcile_worker_liveness'
	| 'team.renew_lease'
	| 'team.send_message'
	| 'team.start'
	| 'team.shutdown';

export interface LaneAuthorityRequest {
	action: LaneAuthorityAction;
	runId: string;
	lane?: LaneKey;
	actorId?: string;
	reason?: string;
	metadata?: Record<string, unknown>;
}

export interface LaneAuthorityHooks {
	beforeAction?(request: LaneAuthorityRequest): Promise<void> | void;
}

export async function assertLaneAuthority(
	hooks: LaneAuthorityHooks | undefined,
	request: LaneAuthorityRequest
) {
	await hooks?.beforeAction?.(request);
}
