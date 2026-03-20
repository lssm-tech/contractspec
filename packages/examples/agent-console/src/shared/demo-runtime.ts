import type {
	Agent,
	AgentHandlers,
	CreateAgentInput,
	ListAgentsInput,
	ListAgentsOutput,
	ListRunsInput,
	ListRunsOutput,
	ListToolsInput,
	ListToolsOutput,
	Run,
	RunMetrics,
	UpdateAgentInput,
} from '../handlers/agent.handlers';
import {
	AGENT_CONSOLE_DEMO_ORGANIZATION_ID,
	cloneAgent,
	cloneRun,
	cloneTool,
	createDefaultNow,
	createSeedState,
	type DemoAgentRecord,
	slugify,
	summarizeRunMetrics,
} from './demo-runtime-seed';

export interface AgentConsoleDemoRuntimeOptions {
	projectId: string;
	organizationId?: string;
	now?: () => Date;
	idFactory?: (kind: 'agent' | 'run', nextIndex: number) => string;
}

export function createAgentConsoleDemoHandlers(
	options: AgentConsoleDemoRuntimeOptions
): AgentHandlers {
	const projectId = options.projectId;
	const organizationId =
		options.organizationId ?? AGENT_CONSOLE_DEMO_ORGANIZATION_ID;
	const now = options.now ?? createDefaultNow();
	const state = createSeedState(projectId, organizationId);
	let agentIndex = state.agents.length + 1;
	let runIndex = state.runs.length + 1;

	const nextId = (kind: 'agent' | 'run') => {
		const nextIndex = kind === 'agent' ? agentIndex++ : runIndex++;
		return options.idFactory?.(kind, nextIndex) ?? `${kind}-demo-${nextIndex}`;
	};

	return {
		async listAgents(input: ListAgentsInput): Promise<ListAgentsOutput> {
			const filtered = state.agents
				.filter((agent) => agent.projectId === input.projectId)
				.filter(
					(agent) =>
						!input.organizationId ||
						agent.organizationId === input.organizationId
				)
				.filter(
					(agent) =>
						!input.status ||
						input.status === 'all' ||
						agent.status === input.status
				)
				.filter((agent) => {
					if (!input.search) return true;
					const query = input.search.toLowerCase();
					return (
						agent.name.toLowerCase().includes(query) ||
						(agent.description ?? '').toLowerCase().includes(query)
					);
				})
				.sort(
					(left, right) => right.updatedAt.getTime() - left.updatedAt.getTime()
				);
			const limit = input.limit ?? 20;
			const offset = input.offset ?? 0;
			const items = filtered.slice(offset, offset + limit).map(cloneAgent);
			return {
				items,
				total: filtered.length,
				hasMore: offset + items.length < filtered.length,
			};
		},
		async getAgent(id: string) {
			const agent = state.agents.find((item) => item.id === id);
			return agent ? cloneAgent(agent) : null;
		},
		async createAgent(
			input: CreateAgentInput,
			context: { projectId: string; organizationId: string }
		): Promise<Agent> {
			const name = input.name.trim();
			const slug = slugify(name);
			const duplicate = state.agents.find(
				(agent) =>
					agent.projectId === context.projectId &&
					agent.organizationId === context.organizationId &&
					(agent.slug === slug ||
						agent.name.toLowerCase() === name.toLowerCase())
			);
			if (duplicate) throw new Error('AGENT_NAME_OR_SLUG_EXISTS');

			const timestamp = now();
			const agent: DemoAgentRecord = {
				id: nextId('agent'),
				projectId: context.projectId,
				organizationId: context.organizationId,
				name,
				slug,
				description: input.description,
				modelProvider: input.modelProvider ?? 'openai',
				modelName: input.modelName ?? 'gpt-5.4',
				systemPrompt: input.systemPrompt,
				temperature: input.temperature ?? 0.4,
				maxTokens: input.maxTokens ?? 8192,
				status: 'DRAFT',
				createdAt: timestamp,
				updatedAt: timestamp,
			};
			state.agents.unshift(agent);
			return cloneAgent(agent);
		},
		async updateAgent(input: UpdateAgentInput): Promise<Agent> {
			const agent = state.agents.find((item) => item.id === input.id);
			if (!agent) throw new Error('AGENT_NOT_FOUND');
			const nextName = input.name;
			if (nextName && slugify(nextName) !== agent.slug) {
				const duplicate = state.agents.find(
					(item) =>
						item.id !== agent.id &&
						item.projectId === agent.projectId &&
						item.organizationId === agent.organizationId &&
						(item.slug === slugify(nextName) ||
							item.name.toLowerCase() === nextName.toLowerCase())
				);
				if (duplicate) throw new Error('AGENT_NAME_OR_SLUG_EXISTS');
				agent.slug = slugify(nextName);
				agent.name = nextName;
			}
			if (input.description !== undefined)
				agent.description = input.description;
			if (input.status) agent.status = input.status;
			agent.updatedAt = now();
			return cloneAgent(agent);
		},
		async executeAgent(input: {
			agentId: string;
			message: string;
			context?: { projectId: string; organizationId: string };
		}): Promise<Run> {
			const agent = state.agents.find((item) => item.id === input.agentId);
			if (!agent) throw new Error('AGENT_NOT_FOUND');
			if (agent.status !== 'ACTIVE') throw new Error('AGENT_NOT_ACTIVE');

			const queuedAt = now();
			const startedAt = now();
			const completedAt = now();
			const durationMs = 2200 + input.message.length * 12;
			const promptTokens = 600 + input.message.length * 3;
			const completionTokens = 240 + agent.name.length * 4;
			const run: Run = {
				id: nextId('run'),
				projectId: input.context?.projectId ?? agent.projectId,
				agentId: agent.id,
				agentName: agent.name,
				status: 'COMPLETED',
				input: input.message,
				output: `Deterministic demo reply from ${agent.name}: ${input.message}`,
				totalTokens: promptTokens + completionTokens,
				promptTokens,
				completionTokens,
				estimatedCostUsd: Number(
					((promptTokens + completionTokens) / 1_000_000).toFixed(4)
				),
				durationMs,
				queuedAt,
				startedAt,
				completedAt,
			};
			state.runs.unshift(run);
			return cloneRun(run);
		},
		async listTools(input: ListToolsInput): Promise<ListToolsOutput> {
			const filtered = state.tools
				.filter((tool) => tool.projectId === input.projectId)
				.filter(
					(tool) =>
						!input.organizationId ||
						tool.organizationId === input.organizationId
				)
				.filter(
					(tool) =>
						!input.category ||
						input.category === 'all' ||
						tool.category === input.category
				)
				.filter(
					(tool) =>
						!input.status ||
						input.status === 'all' ||
						tool.status === input.status
				)
				.filter((tool) => {
					if (!input.search) return true;
					const query = input.search.toLowerCase();
					return (
						tool.name.toLowerCase().includes(query) ||
						(tool.description ?? '').toLowerCase().includes(query)
					);
				})
				.sort((left, right) => left.name.localeCompare(right.name));
			const limit = input.limit ?? 50;
			const offset = input.offset ?? 0;
			const items = filtered.slice(offset, offset + limit).map(cloneTool);
			return {
				items,
				total: filtered.length,
				hasMore: offset + items.length < filtered.length,
			};
		},
		async listRuns(input: ListRunsInput): Promise<ListRunsOutput> {
			const filtered = state.runs
				.filter((run) => run.projectId === input.projectId)
				.filter((run) => !input.agentId || run.agentId === input.agentId)
				.filter(
					(run) =>
						!input.status ||
						input.status === 'all' ||
						run.status === input.status
				)
				.sort(
					(left, right) => right.queuedAt.getTime() - left.queuedAt.getTime()
				);
			const limit = input.limit ?? 20;
			const offset = input.offset ?? 0;
			const items = filtered.slice(offset, offset + limit).map(cloneRun);
			return {
				items,
				total: filtered.length,
				hasMore: offset + items.length < filtered.length,
			};
		},
		async getRunMetrics(input: {
			projectId: string;
			agentId?: string;
			startDate?: Date;
			endDate?: Date;
		}): Promise<RunMetrics> {
			const filtered = state.runs.filter((run) => {
				if (run.projectId !== input.projectId) return false;
				if (input.agentId && run.agentId !== input.agentId) return false;
				if (input.startDate && run.queuedAt < input.startDate) return false;
				if (input.endDate && run.queuedAt > input.endDate) return false;
				return true;
			});
			return summarizeRunMetrics(filtered);
		},
	};
}
