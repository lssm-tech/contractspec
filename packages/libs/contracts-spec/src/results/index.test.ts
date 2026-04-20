import { describe, expect, it } from 'bun:test';
import {
	contractAccepted,
	contractFail,
	contractNoContent,
	contractOk,
	contractPartial,
	createContractError,
	defineResultCatalog,
	failure,
	isContractResult,
	normalizeContractError,
	standardErrors,
	standardSuccess,
	success,
} from './index';

describe('ContractSpec results', () => {
	it('creates standard success variants', () => {
		expect(contractOk({ id: '1' })).toMatchObject({
			ok: true,
			code: 'OK',
			status: 200,
			state: 'completed',
			data: { id: '1' },
		});
		expect(contractAccepted({ jobId: 'job-1' })).toMatchObject({
			code: 'ACCEPTED',
			status: 202,
			state: 'accepted',
		});
		expect(contractNoContent()).toMatchObject({
			code: 'NO_CONTENT',
			status: 204,
			state: 'empty',
		});
	});

	it('preserves partial problems on partial success', () => {
		const partial = contractPartial(
			{ imported: 2 },
			{
				partialProblems: [
					contractFail('VALIDATION_FAILED', undefined, {
						detail: 'One row was invalid.',
					}).problem,
				],
			}
		);

		expect(partial.partialProblems?.[0]?.code).toBe('VALIDATION_FAILED');
	});

	it('supports typed custom result catalogs', () => {
		const catalog = defineResultCatalog({
			success: {
				...standardSuccess.pick('OK', 'CREATED'),
				QUEUED_FOR_REVIEW: success.accepted<{ reviewId: string }>(),
			},
			errors: {
				...standardErrors.pick('UNAUTHENTICATED', 'FORBIDDEN'),
				INTENT_NOT_FOUND: failure.notFound<{ intentId: string }>(),
			},
		});

		expect(catalog.success?.QUEUED_FOR_REVIEW.status).toBe(202);
		expect(catalog.errors?.INTENT_NOT_FOUND.status).toBe(404);
	});

	it('creates failures with typed args', () => {
		const failureResult = contractFail('INTENT_NOT_FOUND', {
			intentId: 'intent-1',
		});

		expect(failureResult).toMatchObject({
			ok: false,
			code: 'INTENT_NOT_FOUND',
			status: 500,
			problem: {
				args: { intentId: 'intent-1' },
			},
		});
	});

	it('normalizes thrown typed and validation-like errors', () => {
		const typed = createContractError('CONFLICT', { id: '1' });
		expect(normalizeContractError(typed).problem.code).toBe('CONFLICT');

		const validation = normalizeContractError({
			issues: [{ path: ['email'], message: 'Invalid email' }],
		});
		expect(validation.problem.code).toBe('VALIDATION_FAILED');
		expect(validation.problem.status).toBe(422);
		expect(validation.problem.issues?.[0]?.path).toBe('email');
	});

	it('recognizes result envelopes', () => {
		expect(isContractResult(contractOk({ ok: true }))).toBe(true);
		expect(isContractResult(contractFail('FORBIDDEN'))).toBe(true);
	});
});
