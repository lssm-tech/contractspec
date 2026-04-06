import { describe, expect, it } from 'bun:test';
import type { TeamWorkerLaunchSpec } from '@contractspec/lib.execution-lanes';
import { MemoryJobQueue } from '@contractspec/lib.jobs/queue/memory-queue';
import {
	createJobQueueExecutionLaneTeamBackend,
	createSubagentExecutionLaneTeamBackend,
	createTmuxExecutionLaneTeamBackend,
	createWorkflowRunnerExecutionLaneTeamBackend,
} from './execution-lanes-team-backends';

describe('execution lane team backends', () => {
	it('enqueues worker jobs in the repo job queue', async () => {
		const queue = new MemoryJobQueue();
		const backend = createJobQueueExecutionLaneTeamBackend({ queue });
		await backend.startWorker(
			createLaunchSpec('run-1', 'worker-1', 'executor')
		);
		const stats = await queue.getStats();
		expect(stats.pending).toBe(1);
	});

	it('delegates worker lifecycle to the workflow runner', async () => {
		const calls: string[] = [];
		const backend = createWorkflowRunnerExecutionLaneTeamBackend({
			runner: {
				async start() {
					calls.push('start');
					return 'workflow-1';
				},
				async pause() {
					calls.push('pause');
				},
				async resume() {
					calls.push('resume');
				},
				async cancel() {
					calls.push('cancel');
				},
			},
		});
		await backend.startWorker(
			createLaunchSpec('run-1', 'worker-1', 'executor')
		);
		await backend.pauseWorker?.('run-1', 'worker-1');
		await backend.resumeWorker?.('run-1', 'worker-1');
		await backend.stopWorker('run-1', 'worker-1');
		expect(calls).toEqual(['start', 'pause', 'resume', 'cancel']);
	});

	it('adapts tmux and subagent worker drivers', async () => {
		const calls: string[] = [];
		const tmux = createTmuxExecutionLaneTeamBackend({
			driver: {
				async startPane() {
					calls.push('tmux:start');
				},
				async stopPane() {
					calls.push('tmux:stop');
				},
				async sendKeys() {
					calls.push('tmux:nudge');
				},
			},
		});
		const subagent = createSubagentExecutionLaneTeamBackend({
			driver: {
				async spawnWorker() {
					calls.push('subagent:start');
				},
				async stopWorker() {
					calls.push('subagent:stop');
				},
				async nudgeWorker() {
					calls.push('subagent:nudge');
				},
			},
		});
		await tmux.startWorker(createLaunchSpec('run-1', 'worker-1', 'executor'));
		await tmux.nudgeWorker?.('run-1', 'worker-1', 'Check mailbox');
		await tmux.stopWorker('run-1', 'worker-1');
		await subagent.startWorker(
			createLaunchSpec('run-1', 'worker-2', 'verifier')
		);
		await subagent.nudgeWorker?.('run-1', 'worker-2', 'Review the diff');
		await subagent.stopWorker('run-1', 'worker-2');
		expect(calls).toEqual([
			'tmux:start',
			'tmux:nudge',
			'tmux:stop',
			'subagent:start',
			'subagent:nudge',
			'subagent:stop',
		]);
	});
});

function createLaunchSpec(
	runId: string,
	workerId: string,
	roleKey: string
): TeamWorkerLaunchSpec {
	return {
		runId,
		workerId,
		roleKey,
		writeScope: roleKey === 'verifier' ? 'artifacts-only' : 'workspace',
	};
}
