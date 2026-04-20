import { describe, expect, it } from 'bun:test';
import {
	defineQuery,
	OperationSpecRegistry,
} from '@contractspec/lib.contracts-spec/operations';
import {
	contractAccepted,
	createContractError,
	success,
} from '@contractspec/lib.contracts-spec/results';
import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { createFetchHandler } from './rest-generic';
import { contractResultToNextResponse } from './result-response';

const Output = new SchemaModel({
	name: 'RestResultOutput',
	fields: {
		value: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
	},
});

const Query = defineQuery({
	meta: {
		key: 'rest.result',
		version: '1.0.0',
		title: 'REST result',
		description: 'REST result test query',
		goal: 'Verify result response mapping',
		context: 'Tests',
		domain: 'tests',
		owners: ['platform.tests'],
		tags: ['tests'],
		stability: 'experimental',
	},
	io: {
		input: null,
		output: Output,
		success: {
			QUEUED_FOR_REVIEW: success.queued(),
		},
	},
	policy: { auth: 'anonymous' },
});

describe('REST result responses', () => {
	it('keeps raw success bodies by default', async () => {
		const registry = new OperationSpecRegistry().register(Query);
		registry.bind(Query, async () => ({ value: 'ok' }));
		const handler = createFetchHandler(registry, () => ({}));

		const response = await handler(
			new Request('https://example.test/rest/result/v1.0.0')
		);

		expect(response.status).toBe(200);
		expect(await response.json()).toEqual({ value: 'ok' });
	});

	it('can expose full success envelopes', async () => {
		const registry = new OperationSpecRegistry().register(Query);
		registry.bind(Query, async () =>
			contractAccepted({ value: 'queued' }, { code: 'QUEUED_FOR_REVIEW' })
		);
		const handler = createFetchHandler(registry, () => ({}), {
			resultEnvelope: true,
		});

		const response = await handler(
			new Request('https://example.test/rest/result/v1.0.0')
		);
		const body = await response.json();

		expect(response.status).toBe(202);
		expect(body).toMatchObject({
			ok: true,
			code: 'QUEUED_FOR_REVIEW',
			data: { value: 'queued' },
		});
	});

	it('maps failures to problem json', async () => {
		const registry = new OperationSpecRegistry().register(Query);
		registry.bind(Query, async () => {
			throw createContractError('FORBIDDEN', undefined, {
				detail: 'Denied.',
			});
		});
		const handler = createFetchHandler(registry, () => ({}));

		const response = await handler(
			new Request('https://example.test/rest/result/v1.0.0')
		);
		const body = await response.json();

		expect(response.status).toBe(403);
		expect(response.headers.get('content-type')).toContain(
			'application/problem+json'
		);
		expect(body).toMatchObject({
			code: 'FORBIDDEN',
			detail: 'Denied.',
		});
	});

	it('maps results through an injected NextResponse-compatible factory', async () => {
		const response = contractResultToNextResponse(
			contractAccepted({ value: 'queued' }),
			{
				json: (body, init) =>
					new Response(JSON.stringify(body), {
						status: init?.status,
						headers: init?.headers,
					}),
			}
		);

		expect(response.status).toBe(202);
		expect(await response.json()).toEqual({ value: 'queued' });
	});
});
