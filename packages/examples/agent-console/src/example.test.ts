import { describe, expect, test } from 'bun:test';
import { AgentConsoleFeature } from './agent.feature';
import example from './example';
import {
	AGENT_CONSOLE_DEMO_ORGANIZATION_ID,
	AGENT_CONSOLE_DEMO_PROJECT_ID,
	createAgentConsoleDemoHandlers,
} from './shared';

describe('@contractspec/example.agent-console', () => {
	test('publishes meetup-ready example metadata', () => {
		expect(example.meta.key).toBe('agent-console');
		expect(example.entrypoints.packageName).toBe(
			'@contractspec/example.agent-console'
		);
		expect(example.surfaces.templates).toBe(true);
		expect(example.surfaces.sandbox?.enabled).toBe(true);
		expect(AgentConsoleFeature.meta.key).toBe(example.meta.key);
	});

	test('serves the seeded agent-console happy path', async () => {
		const handlers = createAgentConsoleDemoHandlers({
			projectId: AGENT_CONSOLE_DEMO_PROJECT_ID,
			organizationId: AGENT_CONSOLE_DEMO_ORGANIZATION_ID,
			now: (() => {
				let tick = 0;
				const base = Date.parse('2026-03-20T09:00:00.000Z');

				return () => new Date(base + tick++ * 60_000);
			})(),
		});

		const agents = await handlers.listAgents({
			projectId: AGENT_CONSOLE_DEMO_PROJECT_ID,
			organizationId: AGENT_CONSOLE_DEMO_ORGANIZATION_ID,
			limit: 3,
		});
		expect(agents.total).toBeGreaterThan(0);

		const activeAgent = agents.items.find((agent) => agent.status === 'ACTIVE');
		expect(activeAgent).toBeDefined();

		const run = await handlers.executeAgent({
			agentId: activeAgent!.id,
			message: 'Summarize the current autonomous agent status.',
			context: {
				projectId: AGENT_CONSOLE_DEMO_PROJECT_ID,
				organizationId: AGENT_CONSOLE_DEMO_ORGANIZATION_ID,
			},
		});
		expect(run.status).toBe('COMPLETED');
		expect(run.output).toContain(activeAgent!.name);
		expect(run.totalTokens).toBeGreaterThan(0);
	});
});
