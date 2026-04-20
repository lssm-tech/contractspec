import { describe, expect, it } from 'bun:test';
import {
	contractAccepted,
	createContractError,
} from '@contractspec/lib.contracts-spec/results';
import {
	ContractSpecNestExceptionFilter,
	ContractSpecNestResultInterceptor,
	mapContractResultForNest,
} from './rest-nest';

describe('ContractSpec Nest adapter helpers', () => {
	it('maps ContractResult values for Nest responses', () => {
		expect(mapContractResultForNest(contractAccepted({ id: 'job-1' }))).toEqual(
			{
				status: 202,
				body: { id: 'job-1' },
			}
		);
	});

	it('handles exceptions through a Nest-like exception filter', () => {
		let captured: unknown;
		let capturedStatus = 0;
		const filter = new ContractSpecNestExceptionFilter();

		filter.catch(createContractError('FORBIDDEN'), {
			switchToHttp: () => ({
				getResponse: () => ({
					status: (code: number) => {
						capturedStatus = code;
						return {
							json: (body: unknown) => {
								captured = body;
							},
						};
					},
				}),
			}),
		});

		expect(capturedStatus).toBe(403);
		expect(captured).toMatchObject({ code: 'FORBIDDEN' });
	});

	it('intercepts promise-like handler results', async () => {
		const interceptor = new ContractSpecNestResultInterceptor();

		const body = await interceptor.intercept({} as never, {
			handle: () => Promise.resolve(contractAccepted({ ok: true })),
		});

		expect(body).toEqual({ ok: true });
	});

	it('intercepts observable-like handler results with injected map operator', () => {
		const interceptor = new ContractSpecNestResultInterceptor({
			map: (project) => project,
		});

		const body = interceptor.intercept({} as never, {
			handle: () => ({
				pipe: (project: unknown) =>
					(project as (value: unknown) => unknown)(
						contractAccepted({ ok: true })
					),
			}),
		});

		expect(body).toEqual({ ok: true });
	});
});
