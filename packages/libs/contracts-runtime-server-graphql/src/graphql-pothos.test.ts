import { describe, expect, it } from 'bun:test';
import { defineQuery } from '@contractspec/lib.contracts-spec/operations';
import { contractFail } from '@contractspec/lib.contracts-spec/results';
import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import {
	toContractSpecGraphQLError,
	toContractSpecGraphQLSuccessExtension,
} from './graphql-pothos';

describe('toContractSpecGraphQLError', () => {
	it('maps ContractProblem details into GraphQL extensions', () => {
		const problem = contractFail('FORBIDDEN', undefined, {
			detail: 'Denied.',
			gqlCode: 'ACCESS_REJECTED',
		}).problem;

		const error = toContractSpecGraphQLError(problem) as Error & {
			extensions?: Record<string, unknown>;
		};

		expect(error.message).toBe('Denied.');
		expect(error.extensions).toMatchObject({
			code: 'ACCESS_REJECTED',
			http: { status: 403 },
			contractspec: { problem },
		});
	});

	it('builds opt-in success metadata extensions without changing data payloads', () => {
		const Output = new SchemaModel({
			name: 'GraphQLSuccessOutput',
			fields: {
				ok: { type: ScalarTypeEnum.Boolean(), isOptional: false },
			},
		});
		const spec = defineQuery({
			meta: {
				key: 'graphql.success',
				version: '1.0.0',
				title: 'GraphQL success',
				description: 'Success extension test',
				goal: 'Verify metadata',
				context: 'Tests',
				domain: 'tests',
				owners: ['platform.tests'],
				tags: ['tests'],
				stability: 'experimental',
			},
			io: { input: null, output: Output },
			policy: { auth: 'anonymous' },
		});

		const extension = toContractSpecGraphQLSuccessExtension(spec, {
			ok: true,
			code: 'ACCEPTED',
			status: 202,
			state: 'accepted',
			data: { ok: true },
			message: 'Accepted.',
		});

		expect(extension).toMatchObject({
			operation: {
				key: 'graphql.success',
				version: '1.0.0',
				kind: 'query',
			},
			result: {
				code: 'ACCEPTED',
				status: 202,
				state: 'accepted',
				message: 'Accepted.',
			},
		});
	});
});
