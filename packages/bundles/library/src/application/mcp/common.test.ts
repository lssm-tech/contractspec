import { describe, expect, it } from 'bun:test';
import {
	OperationSpecRegistry,
	PromptRegistry,
	ResourceRegistry,
} from '@contractspec/lib.contracts-spec';
import { Elysia } from 'elysia';
import { appLogger } from '../../infrastructure/elysia/logger';
import { createMcpElysiaHandler } from './common';

function createTestApp() {
	return new Elysia().use(
		createMcpElysiaHandler({
			logger: appLogger,
			path: '/mcp/test',
			serverName: 'test-mcp',
			ops: new OperationSpecRegistry(),
			resources: new ResourceRegistry(),
			prompts: new PromptRegistry(),
		})
	);
}

function createInitializeRequest(accept: string) {
	return new Request('http://localhost/mcp/test', {
		method: 'POST',
		headers: {
			accept,
			'content-type': 'application/json',
		},
		body: JSON.stringify({
			jsonrpc: '2.0',
			id: 1,
			method: 'initialize',
			params: {
				protocolVersion: '2024-11-05',
				capabilities: {},
				clientInfo: { name: 'test-client', version: '1.0.0' },
			},
		}),
	});
}

describe('createMcpElysiaHandler', () => {
	it('accepts JSON-only clients for POST MCP requests', async () => {
		const response = await createTestApp().handle(
			createInitializeRequest('application/json')
		);

		expect(response.status).toBe(200);
		const body = await response.json();
		expect(body.result.serverInfo.name).toBe('test-mcp');
	});

	it('keeps rejecting incompatible Accept headers', async () => {
		const response = await createTestApp().handle(
			createInitializeRequest('text/html')
		);

		expect(response.status).toBe(406);
		const body = await response.json();
		expect(body.error.message).toContain('Not Acceptable');
	});
});
