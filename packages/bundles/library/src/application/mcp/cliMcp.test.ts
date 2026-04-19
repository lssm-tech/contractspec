import { describe, expect, it } from 'bun:test';
import { Elysia } from 'elysia';
import { createCliMcpHandler } from './cliMcp';

function createTestApp() {
	return new Elysia().use(createCliMcpHandler('/mcp/cli'));
}

async function mcpRequest(
	method: string,
	params: Record<string, unknown> = {}
) {
	return createTestApp().handle(
		new Request('http://localhost/mcp/cli', {
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
		clientInfo: { name: 'cli-mcp-test', version: '1.0.0' },
	});
	expect(response.status).toBe(200);
}

describe('cli MCP handler', () => {
	it('exposes onboarding resources, prompts, and tools', async () => {
		await initialize();

		const toolsResponse = await mcpRequest('tools/list');
		const toolsBody = await toolsResponse.json();
		const toolNames = toolsBody.result.tools.map(
			(tool: { name: string }) => tool.name
		);
		expect(toolNames).toContain('cli_suggestCommand-v1_0_0');
		expect(toolNames).toContain('onboarding_suggestTracks-v1_0_0');
		expect(toolNames).toContain('onboarding_renderArtifacts-v1_0_0');
		expect(toolNames).toContain('onboarding_nextCommand-v1_0_0');

		const promptsResponse = await mcpRequest('prompts/list');
		const promptsBody = await promptsResponse.json();
		const promptNames = promptsBody.result.prompts.map(
			(prompt: { name: string }) => prompt.name
		);
		expect(promptNames).toContain('cli_usage');
		expect(promptNames).toContain('cli_onboarding');

		const resourcesResponse = await mcpRequest('resources/list');
		const resourcesBody = await resourcesResponse.json();
		const resourceUris = (resourcesBody.result.resources ?? []).map(
			(resource: { uri?: string; uriTemplate?: string }) =>
				resource.uriTemplate ?? resource.uri
		);
		expect(resourceUris).toContain('cli://commands');
		expect(resourceUris).toContain('onboarding://tracks');
	});

	it('renders onboarding artifacts and next-command guidance', async () => {
		await initialize();

		const artifactResponse = await mcpRequest('tools/call', {
			name: 'onboarding_renderArtifacts-v1_0_0',
			arguments: {
				artifact: 'human-guide',
				tracks: 'knowledge',
			},
		});
		const artifactBody = await artifactResponse.json();
		const artifactResult = JSON.parse(artifactBody.result.content[0].text);
		expect(artifactResult.primaryTrack).toBe('knowledge');
		expect(artifactResult.content).toContain('ContractSpec Repo Onboarding');

		const nextCommandResponse = await mcpRequest('tools/call', {
			name: 'onboarding_nextCommand-v1_0_0',
			arguments: {
				tracks: 'ai-agents',
			},
		});
		const nextCommandBody = await nextCommandResponse.json();
		const nextCommandResult = JSON.parse(
			nextCommandBody.result.content[0].text
		);
		expect(nextCommandResult.primaryTrack).toBe('ai-agents');
		expect(nextCommandResult.nextCommand).toContain('contractspec onboard');
	});
});
