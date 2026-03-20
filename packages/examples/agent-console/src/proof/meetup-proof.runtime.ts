import type {
	HarnessArtifactQuery,
	HarnessArtifactStore,
	HarnessExecutionAdapter,
	HarnessStoredArtifact,
} from '@contractspec/lib.harness';
import type { AgentHandlers, Run } from '../handlers/agent.handlers';
import { getAgentConsoleDashboardData } from '../shared/demo-dashboard-data';
import { MEETUP_AGENT_NAME } from './meetup-proof.scenario';

export class MemoryArtifactStore implements HarnessArtifactStore {
	private readonly items: HarnessStoredArtifact[] = [];

	async put(artifact: HarnessStoredArtifact) {
		this.items.push(artifact);
		return artifact;
	}

	async get(artifactId: string) {
		return this.items.find((artifact) => artifact.artifactId === artifactId);
	}

	async list(query: HarnessArtifactQuery = {}) {
		return this.items.filter((artifact) => {
			if (query.runId && artifact.runId !== query.runId) return false;
			if (query.stepId && artifact.stepId !== query.stepId) return false;
			if (query.kind && artifact.kind !== query.kind) return false;
			return true;
		});
	}
}

export function createProofNow() {
	let tick = 0;
	const base = Date.parse('2026-03-20T09:30:00.000Z');
	return () => new Date(base + tick++ * 60_000);
}

export function createProofIdFactory(prefix: string) {
	let index = 0;
	return () => `${prefix}-${++index}`;
}

export function createMeetupEntityIdFactory() {
	const counters = { agent: 0, run: 0 };
	return (kind: 'agent' | 'run') => `${kind}-meetup-${++counters[kind]}`;
}

interface MeetupExecutionState {
	agentId: string;
	runId: string;
}

function buildRunSummary(run: Run) {
	return {
		status: 'completed' as const,
		summary: `Executed ${run.agentName} and completed ${run.id}.`,
		output: {
			runId: run.id,
			status: run.status,
			totalTokens: run.totalTokens,
		},
		artifacts: [
			{
				kind: 'step-summary' as const,
				summary: `Completed ${run.id} for ${run.agentName}`,
			},
		],
	};
}

export function createMeetupProofAdapter(input: {
	handlers: AgentHandlers;
	projectId: string;
	organizationId: string;
	state: MeetupExecutionState;
}): HarnessExecutionAdapter {
	return {
		mode: 'code-execution',
		supports: () => true,
		execute: async ({ step }) => {
			const { handlers, projectId, organizationId, state } = input;
			switch (step.key) {
				case 'open-dashboard': {
					const dashboard = await getAgentConsoleDashboardData(handlers, {
						projectId,
						organizationId,
					});
					return {
						status: 'completed',
						summary: `Seeded dashboard ready with ${dashboard.summary.totalAgents} agents, ${dashboard.summary.totalTools} tools, and ${dashboard.summary.totalRuns} runs.`,
						output: {
							agentCount: dashboard.summary.totalAgents,
							runCount: dashboard.summary.totalRuns,
							toolCount: dashboard.summary.totalTools,
						},
						artifacts: [
							{
								kind: 'step-summary',
								summary: `Seeded dashboard agents=${dashboard.summary.totalAgents} tools=${dashboard.summary.totalTools} runs=${dashboard.summary.totalRuns}`,
							},
						],
					};
				}
				case 'create-agent': {
					const agent = await handlers.createAgent(
						{
							name: MEETUP_AGENT_NAME,
							description:
								'Offline-safe walkthrough agent for the Paris meetup.',
							systemPrompt:
								'Demonstrate the deterministic ContractSpec meetup flow.',
						},
						{ projectId, organizationId }
					);
					state.agentId = agent.id;
					return {
						status: 'completed',
						summary: `Created ${agent.name} as ${agent.id}.`,
						output: {
							agentId: agent.id,
							status: agent.status,
						},
						artifacts: [
							{
								kind: 'step-summary',
								summary: `Created ${agent.name} (${agent.id})`,
							},
						],
					};
				}
				case 'activate-agent': {
					const agent = await handlers.updateAgent({
						id: state.agentId,
						status: 'ACTIVE',
					});
					return {
						status: 'completed',
						summary: `Activated ${agent.name}.`,
						output: {
							agentId: agent.id,
							status: agent.status,
						},
						artifacts: [
							{
								kind: 'step-summary',
								summary: `Activated ${agent.name}`,
							},
						],
					};
				}
				case 'execute-agent': {
					const run = await handlers.executeAgent({
						agentId: state.agentId,
						message: 'Summarize the meetup proof lane.',
						context: { projectId, organizationId },
					});
					state.runId = run.id;
					return buildRunSummary(run);
				}
				case 'inspect-dashboard': {
					const [dashboard, metrics] = await Promise.all([
						getAgentConsoleDashboardData(handlers, {
							projectId,
							organizationId,
						}),
						handlers.getRunMetrics({ projectId }),
					]);
					return {
						status: 'completed',
						summary: `${MEETUP_AGENT_NAME} is visible with ${dashboard.summary.totalAgents} agents and ${dashboard.summary.totalRuns} runs.`,
						output: {
							agentCount: dashboard.summary.totalAgents,
							runCount: dashboard.summary.totalRuns,
							toolCount: dashboard.summary.totalTools,
							latestAgentName: dashboard.agents[0]?.name ?? null,
							latestRunId: dashboard.runs[0]?.id ?? null,
							successRate: metrics.successRate,
						},
						artifacts: [
							{
								kind: 'step-summary',
								summary: `Final dashboard agents=${dashboard.summary.totalAgents} runs=${dashboard.summary.totalRuns}`,
							},
						],
					};
				}
				default:
					return {
						status: 'failed',
						summary: `Unknown meetup proof step ${step.key}.`,
					};
			}
		},
	};
}
