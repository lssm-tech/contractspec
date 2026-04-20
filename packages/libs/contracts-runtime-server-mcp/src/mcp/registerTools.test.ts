import { describe, expect, it } from 'bun:test';
import {
	defineCommand,
	OperationSpecRegistry,
} from '@contractspec/lib.contracts-spec/operations';
import {
	contractAccepted,
	createContractError,
} from '@contractspec/lib.contracts-spec/results';
import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { registerMcpTools } from './registerTools';

const Output = new SchemaModel({
	name: 'McpResultOutput',
	fields: {
		value: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
	},
});

const Command = defineCommand({
	meta: {
		key: 'mcp.result',
		version: '1.0.0',
		title: 'MCP result',
		description: 'MCP result command',
		goal: 'Verify MCP result mapping',
		context: 'Tests',
		domain: 'tests',
		owners: ['platform.tests'],
		tags: ['tests'],
		stability: 'experimental',
	},
	io: {
		input: null,
		output: Output,
	},
	policy: { auth: 'anonymous' },
});

describe('registerMcpTools', () => {
	it('returns success content data', async () => {
		const registry = new OperationSpecRegistry().register(Command);
		registry.bind(Command, async () =>
			contractAccepted({ value: 'queued' }, { code: 'QUEUED' })
		);
		const calls = registerAndReadCalls(registry);

		const result = await calls[0]?.handler({});

		expect(result?.isError).toBeUndefined();
		expect(JSON.parse(result?.content[0]?.text ?? '{}')).toEqual({
			value: 'queued',
		});
	});

	it('returns MCP error content for contract failures', async () => {
		const registry = new OperationSpecRegistry().register(Command);
		registry.bind(Command, async () => {
			throw createContractError('FORBIDDEN', undefined, {
				detail: 'Denied.',
			});
		});
		const calls = registerAndReadCalls(registry);

		const result = await calls[0]?.handler({});
		const problem = JSON.parse(result?.content[0]?.text ?? '{}');

		expect(result?.isError).toBe(true);
		expect(problem).toMatchObject({
			code: 'FORBIDDEN',
			status: 403,
			detail: 'Denied.',
		});
	});
});

function registerAndReadCalls(registry: OperationSpecRegistry) {
	const calls: Array<{
		name: string;
		handler: (args: unknown) => Promise<{
			isError?: boolean;
			content: Array<{ type: 'text'; text: string }>;
		}>;
	}> = [];
	const server = {
		registerTool(
			name: string,
			_options: unknown,
			handler: (args: unknown) => Promise<{
				isError?: boolean;
				content: Array<{ type: 'text'; text: string }>;
			}>
		) {
			calls.push({ name, handler });
		},
	};

	registerMcpTools(server as never, registry, { toolCtx: () => ({}) });
	return calls;
}
