import type { LocalDatabase } from '../../database/sqlite-wasm';
import { SEED_TIME_ISO } from './seed-constants';

export async function seedAgentConsole(params: {
  projectId: string;
  db: LocalDatabase;
}): Promise<void> {
  const { projectId, db } = params;
  const existing = await db.exec(
    `SELECT COUNT(*) as count FROM agent_definition WHERE projectId = ?`,
    [projectId]
  );
  if ((existing[0]?.count as number) > 0) return;

  const organizationId = 'agent_org_1';

  const tools = [
    {
      id: 'agent_tool_1',
      name: 'Web Search',
      description: 'Search the web for information',
      category: 'RETRIEVAL',
    },
    {
      id: 'agent_tool_2',
      name: 'Code Interpreter',
      description: 'Execute Python code',
      category: 'COMPUTATION',
    },
    {
      id: 'agent_tool_3',
      name: 'Email Sender',
      description: 'Send emails via API',
      category: 'COMMUNICATION',
    },
    {
      id: 'agent_tool_4',
      name: 'Database Query',
      description: 'Query SQL databases',
      category: 'RETRIEVAL',
    },
    {
      id: 'agent_tool_5',
      name: 'File Reader',
      description: 'Read and parse files',
      category: 'UTILITY',
    },
  ] as const;

  for (const tool of tools) {
    await db.run(
      `INSERT INTO agent_tool (id, projectId, organizationId, name, description, category, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        tool.id,
        projectId,
        organizationId,
        tool.name,
        tool.description,
        tool.category,
        'ACTIVE',
      ]
    );
  }

  const agents = [
    {
      id: 'agent_def_1',
      name: 'Research Assistant',
      description: 'Helps with research tasks',
      model: 'gpt-4',
      status: 'ACTIVE',
      toolIds: ['agent_tool_1', 'agent_tool_4'],
    },
    {
      id: 'agent_def_2',
      name: 'Code Helper',
      description: 'Assists with coding',
      model: 'gpt-4',
      status: 'ACTIVE',
      toolIds: ['agent_tool_2', 'agent_tool_5'],
    },
    {
      id: 'agent_def_3',
      name: 'Email Drafter',
      description: 'Drafts professional emails',
      model: 'gpt-3.5-turbo',
      status: 'PAUSED',
      toolIds: ['agent_tool_3'],
    },
  ] as const;

  for (const agent of agents) {
    await db.run(
      `INSERT INTO agent_definition (id, projectId, organizationId, name, description, modelName, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        agent.id,
        projectId,
        organizationId,
        agent.name,
        agent.description,
        agent.model,
        agent.status,
      ]
    );

    for (const toolId of agent.toolIds) {
      await db.run(
        `INSERT INTO agent_tool_assignment (id, agentId, toolId) VALUES (?, ?, ?)`,
        [`assign_${agent.id}_${toolId}`, agent.id, toolId]
      );
    }
  }

  const runs = [
    {
      id: 'agent_run_1',
      agentId: 'agent_def_1',
      status: 'COMPLETED',
      totalTokens: 1200,
      durationMs: 3500,
      completedAt: SEED_TIME_ISO,
    },
    {
      id: 'agent_run_2',
      agentId: 'agent_def_1',
      status: 'COMPLETED',
      totalTokens: 800,
      durationMs: 2100,
      completedAt: SEED_TIME_ISO,
    },
    {
      id: 'agent_run_3',
      agentId: 'agent_def_2',
      status: 'FAILED',
      totalTokens: 150,
      durationMs: 500,
      completedAt: null,
    },
  ] as const;

  for (const run of runs) {
    await db.run(
      `INSERT INTO agent_run (id, projectId, agentId, status, totalTokens, durationMs, queuedAt, completedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        run.id,
        projectId,
        run.agentId,
        run.status,
        run.totalTokens,
        run.durationMs,
        SEED_TIME_ISO,
        run.completedAt,
      ]
    );
  }
}










