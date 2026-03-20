import type { AgentHandlers } from '../handlers/agent.handlers';
import { createAgentConsoleDemoHandlers } from './demo-runtime';
import {
	AGENT_CONSOLE_DEMO_ORGANIZATION_ID,
	AGENT_CONSOLE_DEMO_PROJECT_ID,
} from './demo-runtime-seed';

export interface AgentConsoleDashboardData {
	agents: Awaited<ReturnType<AgentHandlers['listAgents']>>['items'];
	runs: Awaited<ReturnType<AgentHandlers['listRuns']>>['items'];
	tools: Awaited<ReturnType<AgentHandlers['listTools']>>['items'];
	summary: {
		totalAgents: number;
		totalRuns: number;
		totalTools: number;
	};
}

export async function getAgentConsoleDashboardData(
	handlers: AgentHandlers,
	params: { projectId: string; organizationId?: string }
): Promise<AgentConsoleDashboardData> {
	const organizationId =
		params.organizationId ?? AGENT_CONSOLE_DEMO_ORGANIZATION_ID;
	const [agentsResult, runsResult, toolsResult] = await Promise.all([
		handlers.listAgents({
			projectId: params.projectId,
			organizationId,
			limit: 10,
		}),
		handlers.listRuns({ projectId: params.projectId, limit: 10 }),
		handlers.listTools({
			projectId: params.projectId,
			organizationId,
			limit: 10,
		}),
	]);

	return {
		agents: agentsResult.items,
		runs: runsResult.items,
		tools: toolsResult.items,
		summary: {
			totalAgents: agentsResult.total,
			totalRuns: runsResult.total,
			totalTools: toolsResult.total,
		},
	};
}

export async function getFallbackAgentConsoleDashboardData() {
	const handlers = createAgentConsoleDemoHandlers({
		projectId: AGENT_CONSOLE_DEMO_PROJECT_ID,
	});
	return getAgentConsoleDashboardData(handlers, {
		projectId: AGENT_CONSOLE_DEMO_PROJECT_ID,
	});
}
