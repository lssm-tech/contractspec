import { describe, expect, it } from 'bun:test';
import { mockCreateAgentHandler } from '../agent/agent.handler';
import { mockExecuteAgentHandler } from '../run/run.handler';
import {
	mockCreateToolHandler,
	mockTestToolHandler,
} from '../tool/tool.handler';

function numericSuffix(value: string): number {
	const suffix = value.split('-').at(-1);
	if (!suffix) {
		throw new Error(`Missing numeric suffix in ${value}.`);
	}
	return Number.parseInt(suffix, 10);
}

describe('agent-console mock handlers', () => {
	it('allocates monotonic mock agent and tool ids', async () => {
		const createdAgentA = await mockCreateAgentHandler({
			organizationId: 'demo-org',
			name: 'Meetup Mock Agent A',
			slug: 'meetup-mock-agent-a',
			modelProvider: 'OPENAI',
			modelName: 'gpt-5.4',
			systemPrompt: 'Keep responses stable.',
		});
		const createdAgentB = await mockCreateAgentHandler({
			organizationId: 'demo-org',
			name: 'Meetup Mock Agent B',
			slug: 'meetup-mock-agent-b',
			modelProvider: 'OPENAI',
			modelName: 'gpt-5.4',
			systemPrompt: 'Keep responses stable.',
		});
		const createdToolA = await mockCreateToolHandler({
			organizationId: 'demo-org',
			name: 'Meetup Tool A',
			slug: 'meetup-tool-a',
			description: 'First deterministic tool.',
			implementationType: 'function',
		});
		const createdToolB = await mockCreateToolHandler({
			organizationId: 'demo-org',
			name: 'Meetup Tool B',
			slug: 'meetup-tool-b',
			description: 'Second deterministic tool.',
			implementationType: 'function',
		});

		expect(numericSuffix(createdAgentB.id)).toBe(
			numericSuffix(createdAgentA.id) + 1
		);
		expect(numericSuffix(createdToolB.id)).toBe(
			numericSuffix(createdToolA.id) + 1
		);
	});

	it('allocates monotonic run ids and returns a stable tool test duration', async () => {
		const firstRun = await mockExecuteAgentHandler({
			agentId: 'agent-1',
			input: { message: 'First run' },
		});
		const secondRun = await mockExecuteAgentHandler({
			agentId: 'agent-1',
			input: { message: 'Second run' },
		});
		const toolResult = await mockTestToolHandler({
			toolId: 'tool-1',
			testInput: { query: 'stable duration' },
		});

		expect(numericSuffix(secondRun.runId)).toBe(
			numericSuffix(firstRun.runId) + 1
		);
		expect(toolResult.durationMs).toBe(100);
	});
});
