import { describe, expect, it } from 'bun:test';
import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { StabilityEnum } from '../ownership';
import {
	contractAccepted,
	contractFail,
	contractNoContent,
	contractPartial,
	createContractError,
	failure,
	success,
} from '../results';
import type { HandlerCtx } from '../types';
import { defineQuery } from './operation';
import { OperationSpecRegistry } from './registry';

const OutputModel = new SchemaModel({
	name: 'NoInputOutput',
	fields: {
		received: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
	},
});

const NoInputQuery = defineQuery({
	meta: {
		key: 'test.noInput',
		version: '1.0.0',
		description: 'Query with no input schema',
		goal: 'Test rawInput passthrough',
		context: 'Testing',
		owners: ['@team.test'],
		tags: ['test'],
		stability: StabilityEnum.Experimental,
	},
	io: {
		input: null,
		output: OutputModel,
		success: {
			QUEUED_FOR_REVIEW: success.queued(),
		},
	},
	policy: { auth: 'anonymous' },
});

describe('OperationSpecRegistry', () => {
	it('passes rawInput to handler when spec has no input schema', async () => {
		const registry = new OperationSpecRegistry();
		registry.register(NoInputQuery);
		registry.bind(
			NoInputQuery,
			async (
				input: unknown,
				_ctx: HandlerCtx
			): Promise<{ received: string }> => {
				return { received: JSON.stringify(input) };
			}
		);

		const rawInput = { custom: 'payload', count: 42 };
		const result = await registry.execute(
			'test.noInput',
			'1.0.0',
			rawInput,
			{}
		);

		expect(result).toEqual({ received: JSON.stringify(rawInput) });
	});

	it('returns canonical success envelopes through executeResult', async () => {
		const registry = new OperationSpecRegistry();
		registry.register(NoInputQuery);
		registry.bind(NoInputQuery, async () => ({ received: 'ok' }));

		const result = await registry.executeResult(
			'test.noInput',
			'1.0.0',
			{},
			{}
		);

		expect(result).toMatchObject({
			ok: true,
			code: 'OK',
			status: 200,
			data: { received: 'ok' },
		});
	});

	it('preserves wrapped success metadata while legacy execute unwraps data', async () => {
		const registry = new OperationSpecRegistry();
		registry.register(NoInputQuery);
		registry.bind(NoInputQuery, async () =>
			contractAccepted(
				{ received: 'queued' },
				{ code: 'QUEUED_FOR_REVIEW', message: 'Queued for review' }
			)
		);

		const result = await registry.executeResult(
			'test.noInput',
			'1.0.0',
			{},
			{}
		);
		expect(result).toMatchObject({
			ok: true,
			code: 'QUEUED_FOR_REVIEW',
			status: 202,
			message: 'Queued for review',
			data: { received: 'queued' },
		});

		await expect(
			registry.execute('test.noInput', '1.0.0', {}, {})
		).resolves.toEqual({ received: 'queued' });
	});

	it('normalizes typed handler failures through executeResult', async () => {
		const registry = new OperationSpecRegistry();
		registry.register(NoInputQuery);
		registry.bind(NoInputQuery, async () => {
			throw createContractError(
				'CONFLICT',
				{ id: '123' },
				{
					detail: 'Already exists.',
				}
			);
		});

		const result = await registry.executeResult(
			'test.noInput',
			'1.0.0',
			{},
			{}
		);

		expect(result).toMatchObject({
			ok: false,
			code: 'CONFLICT',
			status: 409,
			problem: {
				detail: 'Already exists.',
				args: { id: '123' },
			},
		});
	});

	it('merges declared custom failure metadata', async () => {
		const QueryWithFailure = defineQuery({
			...NoInputQuery,
			io: {
				...NoInputQuery.io,
				errors: {
					INTENT_NOT_FOUND: failure.notFound<{ intentId: string }>({
						description: 'The referenced intent does not exist.',
						retryable: false,
						gqlCode: 'INTENT_NOT_FOUND',
					}),
				},
			},
		});
		const registry = new OperationSpecRegistry().register(QueryWithFailure);
		registry.bind(QueryWithFailure, async () => {
			throw createContractError('INTENT_NOT_FOUND', {
				intentId: 'intent-1',
			});
		});

		const result = await registry.executeResult(
			'test.noInput',
			'1.0.0',
			{},
			{}
		);

		expect(result).toMatchObject({
			ok: false,
			code: 'INTENT_NOT_FOUND',
			status: 404,
			problem: {
				category: 'not_found',
				retryable: false,
				gqlCode: 'INTENT_NOT_FOUND',
				args: { intentId: 'intent-1' },
			},
		});
	});

	it('normalizes undeclared custom failures to internal errors', async () => {
		const registry = new OperationSpecRegistry().register(NoInputQuery);
		registry.bind(NoInputQuery, async () => {
			throw createContractError('UNDECLARED_FAILURE', { id: 'x' });
		});

		const result = await registry.executeResult(
			'test.noInput',
			'1.0.0',
			{},
			{}
		);

		expect(result).toMatchObject({
			ok: false,
			code: 'INTERNAL_ERROR',
			status: 500,
			problem: {
				metadata: {
					originalCode: 'UNDECLARED_FAILURE',
					originalArgs: { id: 'x' },
				},
			},
		});
	});

	it('rejects undeclared custom success codes', async () => {
		const registry = new OperationSpecRegistry().register(NoInputQuery);
		registry.bind(NoInputQuery, async () =>
			contractAccepted({ received: 'bad' }, { code: 'UNKNOWN_SUCCESS' })
		);

		const result = await registry.executeResult(
			'test.noInput',
			'1.0.0',
			{},
			{}
		);

		expect(result).toMatchObject({
			ok: false,
			code: 'INTERNAL_ERROR',
			problem: {
				args: { code: 'UNKNOWN_SUCCESS' },
			},
		});
	});

	it('rejects undeclared NO_CONTENT when the output schema requires data', async () => {
		const registry = new OperationSpecRegistry().register(NoInputQuery);
		registry.bind(NoInputQuery, async () => contractNoContent());

		const result = await registry.executeResult(
			'test.noInput',
			'1.0.0',
			{},
			{}
		);

		expect(result).toMatchObject({
			ok: false,
			code: 'INTERNAL_ERROR',
			problem: {
				args: { code: 'NO_CONTENT' },
			},
		});
	});

	it('allows declared NO_CONTENT without output data', async () => {
		const QueryWithNoContent = defineQuery({
			...NoInputQuery,
			io: {
				...NoInputQuery.io,
				success: {
					...NoInputQuery.io.success,
					NO_CONTENT: success.noContent(),
				},
			},
		});
		const registry = new OperationSpecRegistry().register(QueryWithNoContent);
		registry.bind(QueryWithNoContent, async () => contractNoContent());

		const result = await registry.executeResult(
			'test.noInput',
			'1.0.0',
			{},
			{}
		);

		expect(result).toMatchObject({
			ok: true,
			code: 'NO_CONTENT',
			status: 204,
			data: undefined,
		});
	});

	it('allows partial success with validated data and partial problems', async () => {
		const QueryWithPartial = defineQuery({
			...NoInputQuery,
			io: {
				...NoInputQuery.io,
				success: {
					...NoInputQuery.io.success,
					PARTIAL: success.partial(),
				},
			},
		});
		const registry = new OperationSpecRegistry().register(QueryWithPartial);
		registry.bind(QueryWithPartial, async () =>
			contractPartial(
				{ received: 'partial' },
				{
					partialProblems: [
						contractFail('VALIDATION_FAILED', undefined, {
							detail: 'One item failed.',
						}).problem,
					],
				}
			)
		);

		const result = await registry.executeResult(
			'test.noInput',
			'1.0.0',
			{},
			{}
		);

		expect(result).toMatchObject({
			ok: true,
			code: 'PARTIAL',
			status: 206,
			data: { received: 'partial' },
			partialProblems: [{ code: 'VALIDATION_FAILED' }],
		});
	});
});
