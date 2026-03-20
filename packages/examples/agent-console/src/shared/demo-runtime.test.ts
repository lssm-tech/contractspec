import { describe, expect, it } from 'bun:test';
import {
	AGENT_CONSOLE_DEMO_ORGANIZATION_ID,
	AGENT_CONSOLE_DEMO_PROJECT_ID,
	createAgentConsoleDemoHandlers,
} from './index';
import { MOCK_AGENTS } from './mock-agents';
import { MOCK_RUNS } from './mock-runs';
import { MOCK_TOOLS } from './mock-tools';

describe('createAgentConsoleDemoHandlers', () => {
	it('lists seeded agents, tools, and runs', async () => {
		const handlers = createAgentConsoleDemoHandlers({
			projectId: AGENT_CONSOLE_DEMO_PROJECT_ID,
		});
		const [agents, tools, runs] = await Promise.all([
			handlers.listAgents({
				projectId: AGENT_CONSOLE_DEMO_PROJECT_ID,
				organizationId: AGENT_CONSOLE_DEMO_ORGANIZATION_ID,
				limit: 10,
			}),
			handlers.listTools({
				projectId: AGENT_CONSOLE_DEMO_PROJECT_ID,
				organizationId: AGENT_CONSOLE_DEMO_ORGANIZATION_ID,
				limit: 10,
			}),
			handlers.listRuns({
				projectId: AGENT_CONSOLE_DEMO_PROJECT_ID,
				limit: 10,
			}),
		]);

		expect(agents.total).toBe(MOCK_AGENTS.length);
		expect(tools.total).toBe(MOCK_TOOLS.length);
		expect(runs.total).toBe(MOCK_RUNS.length);
		expect(agents.items[0]?.updatedAt).toBeInstanceOf(Date);
		expect(runs.items[0]?.queuedAt).toBeInstanceOf(Date);
	});

	it('creates agents and rejects duplicate names or slugs', async () => {
		const handlers = createAgentConsoleDemoHandlers({
			projectId: AGENT_CONSOLE_DEMO_PROJECT_ID,
		});
		const created = await handlers.createAgent(
			{
				name: 'Paris Meetup Agent',
				description: 'Deterministic meetup walkthrough agent',
				systemPrompt: 'Stay deterministic.',
			},
			{
				projectId: AGENT_CONSOLE_DEMO_PROJECT_ID,
				organizationId: AGENT_CONSOLE_DEMO_ORGANIZATION_ID,
			}
		);

		expect(created.id).toBe('agent-demo-5');
		expect(created.name).toBe('Paris Meetup Agent');
		expect(created.status).toBe('DRAFT');

		await expect(
			handlers.createAgent(
				{
					name: 'paris meetup agent',
				},
				{
					projectId: AGENT_CONSOLE_DEMO_PROJECT_ID,
					organizationId: AGENT_CONSOLE_DEMO_ORGANIZATION_ID,
				}
			)
		).rejects.toThrow('AGENT_NAME_OR_SLUG_EXISTS');
	});

	it('updates agent status transitions', async () => {
		const handlers = createAgentConsoleDemoHandlers({
			projectId: AGENT_CONSOLE_DEMO_PROJECT_ID,
		});
		const created = await handlers.createAgent(
			{
				name: 'Status Transition Agent',
			},
			{
				projectId: AGENT_CONSOLE_DEMO_PROJECT_ID,
				organizationId: AGENT_CONSOLE_DEMO_ORGANIZATION_ID,
			}
		);

		const active = await handlers.updateAgent({
			id: created.id,
			status: 'ACTIVE',
		});
		const paused = await handlers.updateAgent({
			id: created.id,
			status: 'PAUSED',
		});

		expect(active.status).toBe('ACTIVE');
		expect(paused.status).toBe('PAUSED');
		expect(paused.updatedAt.getTime()).toBeGreaterThan(
			active.updatedAt.getTime()
		);
	});

	it('executes active agents with deterministic run output', async () => {
		const handlers = createAgentConsoleDemoHandlers({
			projectId: AGENT_CONSOLE_DEMO_PROJECT_ID,
		});
		const created = await handlers.createAgent(
			{
				name: 'Execution Agent',
				systemPrompt: 'Reply deterministically.',
			},
			{
				projectId: AGENT_CONSOLE_DEMO_PROJECT_ID,
				organizationId: AGENT_CONSOLE_DEMO_ORGANIZATION_ID,
			}
		);
		await handlers.updateAgent({ id: created.id, status: 'ACTIVE' });

		const run = await handlers.executeAgent({
			agentId: created.id,
			message: 'Summarize the meetup flow.',
			context: {
				projectId: AGENT_CONSOLE_DEMO_PROJECT_ID,
				organizationId: AGENT_CONSOLE_DEMO_ORGANIZATION_ID,
			},
		});

		expect(run.id).toBe('run-demo-6');
		expect(run.status).toBe('COMPLETED');
		expect(run.output).toContain(
			'Deterministic demo reply from Execution Agent'
		);
		expect(run.totalTokens).toBe(run.promptTokens + run.completionTokens);
	});

	it('updates aggregate metrics after execution', async () => {
		const handlers = createAgentConsoleDemoHandlers({
			projectId: AGENT_CONSOLE_DEMO_PROJECT_ID,
		});
		const before = await handlers.getRunMetrics({
			projectId: AGENT_CONSOLE_DEMO_PROJECT_ID,
		});
		const created = await handlers.createAgent(
			{
				name: 'Metrics Agent',
			},
			{
				projectId: AGENT_CONSOLE_DEMO_PROJECT_ID,
				organizationId: AGENT_CONSOLE_DEMO_ORGANIZATION_ID,
			}
		);
		await handlers.updateAgent({ id: created.id, status: 'ACTIVE' });
		await handlers.executeAgent({
			agentId: created.id,
			message: 'Verify metrics.',
			context: {
				projectId: AGENT_CONSOLE_DEMO_PROJECT_ID,
				organizationId: AGENT_CONSOLE_DEMO_ORGANIZATION_ID,
			},
		});
		const after = await handlers.getRunMetrics({
			projectId: AGENT_CONSOLE_DEMO_PROJECT_ID,
		});

		expect(after.totalRuns).toBe(before.totalRuns + 1);
		expect(after.totalTokens).toBeGreaterThan(before.totalTokens);
		expect(after.totalCostUsd).toBeGreaterThan(before.totalCostUsd);
	});
});
