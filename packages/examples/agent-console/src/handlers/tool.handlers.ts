/**
 * Mock handlers for Tool contracts
 */
import { MOCK_TOOLS } from './mock-data';

// Types inferred from contract schemas
export interface ListToolsInput {
  organizationId: string;
  category?: 'RETRIEVAL' | 'COMPUTATION' | 'COMMUNICATION' | 'INTEGRATION' | 'UTILITY' | 'CUSTOM';
  status?: 'DRAFT' | 'ACTIVE' | 'DEPRECATED' | 'DISABLED';
  search?: string;
  limit?: number;
  offset?: number;
}

export interface ToolSummary {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: 'RETRIEVAL' | 'COMPUTATION' | 'COMMUNICATION' | 'INTEGRATION' | 'UTILITY' | 'CUSTOM';
  status: 'DRAFT' | 'ACTIVE' | 'DEPRECATED' | 'DISABLED';
  version: string;
  createdAt: Date;
}

export interface ListToolsOutput {
  items: ToolSummary[];
  total: number;
  hasMore: boolean;
}

export interface GetToolInput {
  toolId: string;
}

export interface Tool {
  id: string;
  organizationId: string;
  name: string;
  slug: string;
  description: string;
  category: 'RETRIEVAL' | 'COMPUTATION' | 'COMMUNICATION' | 'INTEGRATION' | 'UTILITY' | 'CUSTOM';
  status: 'DRAFT' | 'ACTIVE' | 'DEPRECATED' | 'DISABLED';
  parametersSchema: Record<string, unknown>;
  outputSchema?: Record<string, unknown>;
  implementationType: 'http' | 'function' | 'workflow';
  implementationConfig: Record<string, unknown>;
  maxInvocationsPerMinute?: number;
  timeoutMs: number;
  version: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mock handler for ListToolsQuery
 */
export async function mockListToolsHandler(
  input: ListToolsInput
): Promise<ListToolsOutput> {
  const { organizationId, category, status, search, limit = 20, offset = 0 } = input;

  let filtered = MOCK_TOOLS.filter((t) => t.organizationId === organizationId);

  if (category) {
    filtered = filtered.filter((t) => t.category === category);
  }

  if (status) {
    filtered = filtered.filter((t) => t.status === status);
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags?.some((tag) => tag.toLowerCase().includes(q))
    );
  }

  const total = filtered.length;
  const items = filtered.slice(offset, offset + limit).map((t) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    description: t.description,
    category: t.category,
    status: t.status,
    version: t.version,
    createdAt: t.createdAt,
  }));

  return {
    items,
    total,
    hasMore: offset + limit < total,
  };
}

/**
 * Mock handler for GetToolQuery
 */
export async function mockGetToolHandler(input: GetToolInput): Promise<Tool> {
  const tool = MOCK_TOOLS.find((t) => t.id === input.toolId);

  if (!tool) {
    throw new Error('TOOL_NOT_FOUND');
  }

  return tool;
}

/**
 * Mock handler for CreateToolCommand
 */
export async function mockCreateToolHandler(input: {
  organizationId: string;
  name: string;
  slug: string;
  description: string;
  parametersSchema: Record<string, unknown>;
  implementationType: 'http' | 'function' | 'workflow';
  implementationConfig: Record<string, unknown>;
}) {
  // Simulate slug collision check
  const exists = MOCK_TOOLS.some(
    (t) => t.organizationId === input.organizationId && t.slug === input.slug
  );
  if (exists) {
    throw new Error('SLUG_EXISTS');
  }

  return {
    id: `tool-${Date.now()}`,
    name: input.name,
    slug: input.slug,
    status: 'DRAFT' as const,
  };
}

/**
 * Mock handler for TestToolCommand
 */
export async function mockTestToolHandler(input: {
  toolId: string;
  testInput: Record<string, unknown>;
}) {
  const tool = MOCK_TOOLS.find((t) => t.id === input.toolId);
  if (!tool) {
    throw new Error('TOOL_NOT_FOUND');
  }

  // Simulate tool execution
  return {
    success: true,
    output: { result: 'Mock tool execution result' },
    durationMs: Math.floor(Math.random() * 1000) + 100,
  };
}

