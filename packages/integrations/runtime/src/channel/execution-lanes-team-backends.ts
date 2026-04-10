import type { WorkflowRunner } from '@contractspec/lib.contracts-spec/workflow';
import {
	createSubagentTeamBackend,
	createTmuxTeamBackend,
	type TeamBackendAdapter,
} from '@contractspec/lib.execution-lanes';
import type { JobQueue } from '@contractspec/lib.jobs/queue/types';

export function createJobQueueExecutionLaneTeamBackend(input: {
	queue: JobQueue;
	jobType?: string;
}) {
	const workerJobIds = new Map<string, string>();
	const jobType = input.jobType ?? 'execution-lanes.team.worker';

	const backend: TeamBackendAdapter = {
		key: 'queue',
		async startWorker(launch) {
			const job = await input.queue.enqueue(jobType, {
				runId: launch.runId,
				workerId: launch.workerId,
				roleProfile: launch.roleKey,
				writeScope: launch.writeScope,
				worktreeMode: launch.worktreeMode,
				writePaths: launch.writePaths,
			});
			workerJobIds.set(`${launch.runId}:${launch.workerId}`, job.id);
		},
		async stopWorker(runId, workerId) {
			const jobId = workerJobIds.get(`${runId}:${workerId}`);
			if (!jobId) {
				return;
			}
			await input.queue.cancelJob?.(jobId);
			workerJobIds.delete(`${runId}:${workerId}`);
		},
	};

	return backend;
}

export function createWorkflowRunnerExecutionLaneTeamBackend(input: {
	runner: Pick<WorkflowRunner, 'start' | 'pause' | 'resume' | 'cancel'>;
	workflowName?: string;
	workflowVersion?: string;
}) {
	const workflowIds = new Map<string, string>();
	const workflowName = input.workflowName ?? 'execution-lane.team-worker';
	const workflowVersion = input.workflowVersion ?? '1.0.0';

	const backend: TeamBackendAdapter = {
		key: 'workflow-engine',
		async startWorker(launch) {
			const workflowId = await input.runner.start(
				workflowName,
				workflowVersion,
				{
					runId: launch.runId,
					workerId: launch.workerId,
					roleProfile: launch.roleKey,
					writeScope: launch.writeScope,
					worktreeMode: launch.worktreeMode,
					writePaths: launch.writePaths,
				}
			);
			workflowIds.set(`${launch.runId}:${launch.workerId}`, workflowId);
		},
		async stopWorker(runId, workerId) {
			const workflowId = workflowIds.get(`${runId}:${workerId}`);
			if (!workflowId) {
				return;
			}
			await input.runner.cancel(workflowId);
			workflowIds.delete(`${runId}:${workerId}`);
		},
		async pauseWorker(runId, workerId) {
			const workflowId = workflowIds.get(`${runId}:${workerId}`);
			if (!workflowId) {
				return;
			}
			await input.runner.pause(workflowId);
		},
		async resumeWorker(runId, workerId) {
			const workflowId = workflowIds.get(`${runId}:${workerId}`);
			if (!workflowId) {
				return;
			}
			await input.runner.resume(workflowId);
		},
	};

	return backend;
}

export function createTmuxExecutionLaneTeamBackend(input: {
	driver: Parameters<typeof createTmuxTeamBackend>[0];
}) {
	return createTmuxTeamBackend(input.driver);
}

export function createSubagentExecutionLaneTeamBackend(input: {
	driver: Parameters<typeof createSubagentTeamBackend>[0];
}) {
	return createSubagentTeamBackend(input.driver);
}
