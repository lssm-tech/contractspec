import type { Agent, Run, RunMetrics, Tool } from '../handlers/agent.handlers';
import { MOCK_AGENTS } from './mock-agents';
import { MOCK_RUNS } from './mock-runs';
import { MOCK_TOOLS } from './mock-tools';

export const AGENT_CONSOLE_DEMO_ORGANIZATION_ID = 'demo-org';
export const AGENT_CONSOLE_DEMO_PROJECT_ID = 'agent-console-demo';

export type DemoAgentRecord = Agent & { slug: string };

export function slugify(name: string): string {
	return name
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

export function cloneAgent(agent: DemoAgentRecord): Agent {
	return { ...agent };
}

export function cloneTool(tool: Tool): Tool {
	return { ...tool };
}

export function cloneRun(run: Run): Run {
	return { ...run };
}

export function createDefaultNow(): () => Date {
	let tick = 0;
	const base = Date.parse('2026-03-20T09:00:00.000Z');
	return () => new Date(base + tick++ * 60_000);
}

function normalizeProvider(provider: string): string {
	return provider.toLowerCase();
}

function normalizeRunStatus(status: string): Run['status'] {
	return status === 'IN_PROGRESS' ? 'RUNNING' : (status as Run['status']);
}

export function createSeedState(
	projectId: string,
	organizationId: string
): {
	agents: DemoAgentRecord[];
	tools: Tool[];
	runs: Run[];
} {
	const agents = MOCK_AGENTS.map((agent) => ({
		id: agent.id,
		projectId,
		organizationId,
		name: agent.name,
		slug: agent.slug,
		description: agent.description,
		modelProvider: normalizeProvider(agent.modelProvider),
		modelName: agent.modelName,
		systemPrompt: agent.systemPrompt,
		temperature:
			typeof agent.modelConfig?.temperature === 'number'
				? agent.modelConfig.temperature
				: 0.4,
		maxTokens: 8192,
		status: agent.status,
		createdAt: agent.createdAt,
		updatedAt: agent.updatedAt,
	}));

	const tools = MOCK_TOOLS.map((tool) => ({
		id: tool.id,
		projectId,
		organizationId,
		name: tool.name,
		description: tool.description,
		version: tool.version,
		category: tool.category,
		status: tool.status,
		inputSchema: JSON.stringify(tool.parametersSchema),
		outputSchema: tool.outputSchema
			? JSON.stringify(tool.outputSchema)
			: undefined,
		endpoint:
			typeof tool.implementationConfig?.url === 'string'
				? tool.implementationConfig.url
				: undefined,
		createdAt: tool.createdAt,
		updatedAt: tool.updatedAt,
	}));

	const agentNames = new Map(
		agents.map((agent) => [agent.id, agent.name] as const)
	);
	const runs = MOCK_RUNS.map((run) => ({
		id: run.id,
		projectId,
		agentId: run.agentId,
		agentName: agentNames.get(run.agentId) ?? run.agentName ?? 'Unknown agent',
		status: normalizeRunStatus(run.status),
		input: JSON.stringify(run.input),
		output: run.output ? JSON.stringify(run.output) : undefined,
		totalTokens: run.totalTokens,
		promptTokens: run.promptTokens,
		completionTokens: run.completionTokens,
		estimatedCostUsd: run.estimatedCostUsd ?? 0,
		durationMs: run.durationMs,
		errorMessage: run.errorMessage,
		queuedAt: run.queuedAt,
		startedAt: run.startedAt,
		completedAt: run.completedAt,
	}));

	return { agents, tools, runs };
}

export function summarizeRunMetrics(runs: Run[]): RunMetrics {
	const totalRuns = runs.length;
	const completedRuns = runs.filter((run) => run.status === 'COMPLETED').length;
	const completedDurations = runs
		.map((run) => run.durationMs)
		.filter((duration): duration is number => typeof duration === 'number');

	return {
		totalRuns,
		successRate: totalRuns === 0 ? 0 : completedRuns / totalRuns,
		averageDurationMs:
			completedDurations.length === 0
				? 0
				: Math.round(
						completedDurations.reduce((sum, duration) => sum + duration, 0) /
							completedDurations.length
					),
		totalTokens: runs.reduce((sum, run) => sum + run.totalTokens, 0),
		totalCostUsd: runs.reduce((sum, run) => sum + run.estimatedCostUsd, 0),
	};
}
