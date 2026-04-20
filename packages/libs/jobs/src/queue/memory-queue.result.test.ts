import { describe, expect, it } from 'bun:test';
import {
	contractAccepted,
	createContractError,
} from '@contractspec/lib.contracts-spec/results';
import { MemoryJobQueue } from './memory-queue';

describe('MemoryJobQueue ContractResult support', () => {
	it('persists canonical success envelopes', async () => {
		const queue = new MemoryJobQueue({ pollIntervalMs: 1 });
		queue.register('result.success', async () =>
			contractAccepted({ value: 'queued' }, { code: 'QUEUED' })
		);

		const job = await queue.enqueue('result.success', {});
		queue.start();
		const completed = await waitForJob(queue, job.id, 'completed');
		await queue.stop();

		expect(completed.result).toEqual({ value: 'queued' });
		expect(completed.resultEnvelope).toMatchObject({
			ok: true,
			code: 'QUEUED',
			status: 202,
		});
	});

	it('dead-letters non-retryable contract failures without retrying', async () => {
		const queue = new MemoryJobQueue({ pollIntervalMs: 1 });
		queue.register('result.failure', async () => {
			throw createContractError('CONFLICT', undefined, {
				detail: 'Already running.',
			});
		});

		const job = await queue.enqueue('result.failure', {});
		queue.start();
		const failed = await waitForJob(queue, job.id, 'dead_letter');
		await queue.stop();

		expect(failed.attempts).toBe(1);
		expect(failed.lastError).toBe('Already running.');
		expect(failed.lastProblem).toMatchObject({
			code: 'CONFLICT',
			status: 409,
			retryable: false,
		});
	});

	it('uses retryAfter for retryable contract failures', async () => {
		const queue = new MemoryJobQueue({ pollIntervalMs: 1 });
		queue.register('result.retry_after', async () => {
			throw createContractError('SERVICE_UNAVAILABLE', undefined, {
				detail: 'Try later.',
				retryAfter: 50,
			});
		});

		const job = await queue.enqueue(
			'result.retry_after',
			{},
			{ maxRetries: 2 }
		);
		queue.start();
		const pendingRetry = await waitForJobWhere(
			queue,
			job.id,
			(candidate) => candidate.status === 'pending' && candidate.attempts === 1
		);
		await queue.stop();

		expect(pendingRetry.lastProblem).toMatchObject({
			code: 'SERVICE_UNAVAILABLE',
			retryable: true,
		});
		expect(
			(pendingRetry.scheduledAt?.getTime() ?? 0) - Date.now()
		).toBeGreaterThan(0);
	});
});

async function waitForJob(
	queue: MemoryJobQueue,
	jobId: string,
	status: string
) {
	return waitForJobWhere(queue, jobId, (job) => job.status === status);
}

async function waitForJobWhere(
	queue: MemoryJobQueue,
	jobId: string,
	predicate: (
		job: NonNullable<Awaited<ReturnType<MemoryJobQueue['getJob']>>>
	) => boolean
) {
	for (let index = 0; index < 100; index += 1) {
		const job = await queue.getJob(jobId);
		if (job && predicate(job)) return job;
		await new Promise((resolve) => setTimeout(resolve, 5));
	}
	throw new Error(`Timed out waiting for job ${jobId}.`);
}
