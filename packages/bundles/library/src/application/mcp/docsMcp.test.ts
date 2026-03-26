import { describe, expect, it } from 'bun:test';
import { Elysia } from 'elysia';
import { createDocsMcpHandler } from './docsMcp';

function createTestApp() {
	return new Elysia().use(createDocsMcpHandler('/mcp/docs'));
}

async function mcpRequest(
	method: string,
	params: Record<string, unknown> = {}
) {
	return createTestApp().handle(
		new Request('http://localhost/mcp/docs', {
			method: 'POST',
			headers: {
				accept: 'application/json',
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				jsonrpc: '2.0',
				id: 1,
				method,
				params,
			}),
		})
	);
}

async function initialize() {
	const response = await mcpRequest('initialize', {
		protocolVersion: '2024-11-05',
		capabilities: {},
		clientInfo: { name: 'docs-mcp-test', version: '1.0.0' },
	});
	expect(response.status).toBe(200);
}

describe('docs MCP handler', () => {
	it('exposes curated tools, prompts, and resources', async () => {
		await initialize();

		const toolsResponse = await mcpRequest('tools/list');
		const toolsBody = await toolsResponse.json();
		const toolNames = toolsBody.result.tools.map(
			(tool: { name: string }) => tool.name
		);
		expect(toolNames).toContain('docs_search-v1_0_0');
		expect(toolNames).toContain('docs_get-v1_0_0');
		expect(toolNames).toContain('docs_resolve_route-v1_0_0');
		expect(toolNames).toContain('docs_contract_reference-v1_0_0');
		expect(toolNames).toContain('docs_list_facets-v1_0_0');

		const promptsResponse = await mcpRequest('prompts/list');
		const promptsBody = await promptsResponse.json();
		const promptNames = promptsBody.result.prompts.map(
			(prompt: { name: string }) => prompt.name
		);
		expect(promptNames).toContain('docs_navigator');
		expect(promptNames).toContain('docs_reference_guide');

		const listedResourcesResponse = await mcpRequest('resources/list');
		const listedResourcesBody = await listedResourcesResponse.json();
		const listedResources = listedResourcesBody.result.resources ?? [];
		const listedResourceUris = listedResources.map(
			(resource: { uri?: string; uriTemplate?: string }) =>
				resource.uriTemplate ?? resource.uri
		);
		expect(listedResourceUris).toContain('docs://index');
		expect(listedResourceUris).toContain('docs://list');
		expect(listedResourceUris).toContain('docs://facets');

		const templatesResponse = await mcpRequest('resources/templates/list');
		const templatesBody = await templatesResponse.json();
		const templates = templatesBody.result.resourceTemplates ?? [];
		const templateUris = templates.map(
			(resource: { uri?: string; uriTemplate?: string }) =>
				resource.uriTemplate ?? resource.uri
		);
		expect(templateUris).toContain(
			'docs://index{?query,tag,kind,visibility,limit,offset}'
		);
		expect(templateUris).toContain(
			'docs://contract-reference/{key}{?version,type,includeSchema}'
		);
		expect(
			listedResourceUris.some((uri: string) =>
				uri.startsWith('presentation://')
			)
		).toBeFalse();
	});

	it('supports paginated docs search and contract reference lookup', async () => {
		await initialize();

		const searchResponse = await mcpRequest('tools/call', {
			name: 'docs_search-v1_0_0',
			arguments: {
				query: 'docs',
				kind: 'how',
				limit: 1,
			},
		});
		const searchBody = await searchResponse.json();
		const searchResult = JSON.parse(searchBody.result.content[0].text);
		expect(searchResult.docs).toBeArray();
		expect(searchResult.docs.length).toBe(1);
		expect(searchResult.total).toBeGreaterThan(1);
		expect(searchResult.nextOffset).toBe(1);

		const referenceResponse = await mcpRequest('tools/call', {
			name: 'docs_contract_reference-v1_0_0',
			arguments: {
				key: 'docs.generate',
				type: 'command',
				includeSchema: true,
			},
		});
		const referenceBody = await referenceResponse.json();
		const referenceResult = JSON.parse(referenceBody.result.content[0].text);
		expect(referenceResult.reference.type).toBe('command');
		expect(referenceResult.reference.route).toBe('/docs/tech/docs/generator');
		expect(referenceResult.reference.schema.meta.key).toBe('docs.generate');
	});

	it('keeps markdown doc resources and richer prompts usable', async () => {
		await initialize();

		const docResponse = await mcpRequest('resources/read', {
			uri: 'docs://doc/docs.tech.docs-generator',
		});
		const docBody = await docResponse.json();
		expect(docBody.result.contents[0].text).toContain('# Docs generator');

		const promptResponse = await mcpRequest('prompts/get', {
			name: 'docs_reference_guide',
			arguments: {
				key: 'docs.generate',
				type: 'command',
			},
		});
		const promptBody = await promptResponse.json();
		const text = promptBody.result.messages[0].content.text;
		expect(text).toContain('docs_contract_reference-v1_0_0');
		expect(text).toContain('docs.generate');
		expect(text).toContain('docs://contract-reference/docs.generate');
	});
});
