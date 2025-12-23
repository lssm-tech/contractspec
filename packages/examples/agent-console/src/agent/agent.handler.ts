/**
 * Mock handlers for Agent contracts.
 */
import { MOCK_AGENTS } from '../shared/mock-agents';
import { MOCK_TOOLS } from '../shared/mock-tools';

export interface ListAgentsInput {
  organizationId: string;
  status?: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
  modelProvider?: 'OPENAI' | 'ANTHROPIC' | 'GOOGLE' | 'MISTRAL' | 'CUSTOM';
  search?: string;
  limit?: number;
  offset?: number;
}

export interface AgentSummary {
  id: string;
  name: string;
  slug: string;
  description?: string;
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
  modelProvider: 'OPENAI' | 'ANTHROPIC' | 'GOOGLE' | 'MISTRAL' | 'CUSTOM';
  modelName: string;
  version: string;
  createdAt: Date;
}

export interface ListAgentsOutput {
  items: AgentSummary[];
  total: number;
  hasMore: boolean;
}

export interface GetAgentInput {
  agentId: string;
  includeTools?: boolean;
}

export interface AgentToolRef {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
}

export interface AgentWithTools {
  id: string;
  organizationId: string;
  name: string;
  slug: string;
  description?: string;
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
  modelProvider: 'OPENAI' | 'ANTHROPIC' | 'GOOGLE' | 'MISTRAL' | 'CUSTOM';
  modelName: string;
  modelConfig?: Record<string, unknown>;
  systemPrompt: string;
  userPromptTemplate?: string;
  toolIds?: string[];
  toolChoice: 'auto' | 'required' | 'none';
  maxIterations: number;
  maxTokensPerRun?: number;
  timeoutMs: number;
  version: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  tools?: AgentToolRef[];
}

/**
 * Mock handler for ListAgentsQuery.
 */
export async function mockListAgentsHandler(
  input: ListAgentsInput
): Promise<ListAgentsOutput> {
  const {
    organizationId,
    status,
    modelProvider,
    search,
    limit = 20,
    offset = 0,
  } = input;

  let filtered = MOCK_AGENTS.filter((a) => a.organizationId === organizationId);
  if (status) filtered = filtered.filter((a) => a.status === status);
  if (modelProvider)
    filtered = filtered.filter((a) => a.modelProvider === modelProvider);
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.description?.toLowerCase().includes(q) ||
        a.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }

  const total = filtered.length;
  const items = filtered.slice(offset, offset + limit).map((a) => ({
    id: a.id,
    name: a.name,
    slug: a.slug,
    description: a.description,
    status: a.status,
    modelProvider: a.modelProvider,
    modelName: a.modelName,
    version: a.version,
    createdAt: a.createdAt,
  }));

  return { items, total, hasMore: offset + limit < total };
}

/**
 * Mock handler for GetAgentQuery.
 */
export async function mockGetAgentHandler(
  input: GetAgentInput
): Promise<AgentWithTools> {
  const agent = MOCK_AGENTS.find((a) => a.id === input.agentId);
  if (!agent) throw new Error('AGENT_NOT_FOUND');

  const result: AgentWithTools = { ...agent, toolIds: ['tool-1', 'tool-2'] };
  if (input.includeTools) {
    result.tools = MOCK_TOOLS.slice(0, 2).map((t) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      description: t.description,
      category: t.category,
    }));
  }
  return result;
}

/**
 * Mock handler for CreateAgentCommand.
 */
export async function mockCreateAgentHandler(input: {
  organizationId: string;
  name: string;
  slug: string;
  description?: string;
  modelProvider: 'OPENAI' | 'ANTHROPIC' | 'GOOGLE' | 'MISTRAL' | 'CUSTOM';
  modelName: string;
  systemPrompt: string;
}) {
  const exists = MOCK_AGENTS.some(
    (a) => a.organizationId === input.organizationId && a.slug === input.slug
  );
  if (exists) throw new Error('SLUG_EXISTS');
  return {
    id: `agent-${Date.now()}`,
    name: input.name,
    slug: input.slug,
    status: 'DRAFT' as const,
  };
}

/**
 * Mock handler for UpdateAgentCommand.
 */
export async function mockUpdateAgentHandler(input: {
  agentId: string;
  name?: string;
  status?: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
}) {
  const agent = MOCK_AGENTS.find((a) => a.id === input.agentId);
  if (!agent) throw new Error('AGENT_NOT_FOUND');
  return {
    id: agent.id,
    name: input.name ?? agent.name,
    status: input.status ?? agent.status,
    updatedAt: new Date(),
  };
}
