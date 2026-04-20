import { describe, expect, it } from 'bun:test';
import {
	contractFail,
	contractOk,
} from '@contractspec/lib.contracts-spec/results';
import {
	parseContractResponse,
	problemIssuesToFieldErrors,
} from './contract-result-client';

describe('contract result client helpers', () => {
	it('passes through result envelopes', () => {
		const result = parseContractResponse(contractOk({ id: '1' }));

		expect(result).toMatchObject({
			ok: true,
			data: { id: '1' },
		});
	});

	it('parses GraphQL contract problems', () => {
		const problem = contractFail('FORBIDDEN', undefined, {
			detail: 'Denied.',
		}).problem;

		const result = parseContractResponse({
			errors: [{ extensions: { contractspec: { problem } } }],
		});

		expect(result).toMatchObject({
			ok: false,
			code: 'FORBIDDEN',
			problem: { detail: 'Denied.' },
		});
	});

	it('parses MCP error payloads', () => {
		const problem = contractFail('VALIDATION_FAILED', undefined, {
			issues: [{ path: 'email', message: 'Invalid email' }],
		}).problem;

		const result = parseContractResponse({
			isError: true,
			content: [{ type: 'text', text: JSON.stringify(problem) }],
		});

		expect(result.ok).toBe(false);
		if (!result.ok) {
			expect(problemIssuesToFieldErrors(result.problem)).toEqual({
				email: { message: 'Invalid email', type: undefined },
			});
		}
	});

	it('normalizes legacy workflow and job error strings', () => {
		const workflow = parseContractResponse({ error: 'Step failed.' });
		const job = parseContractResponse({ lastError: 'Job failed.' });

		expect(workflow.ok).toBe(false);
		expect(job.ok).toBe(false);
	});
});
