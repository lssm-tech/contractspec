import type { DatabasePort } from '@contractspec/lib.runtime-sandbox';

export async function seedAgentConsole(params: {
  projectId: string;
  db: DatabasePort;
}) {
  const { projectId, db } = params;

  const existing = await db.query(
    `SELECT COUNT(*) as count FROM agent_definition WHERE "projectId" = $1`,
    [projectId]
  );
  if ((existing.rows[0]?.count as number) > 0) return;

  await db.execute(
    `INSERT INTO agent_definition (id, "projectId", "organizationId", name, description, "modelProvider", "modelName", status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      'agent_1',
      projectId,
      'org_demo',
      'Demo Agent',
      'A demo AI agent',
      'openai',
      'gpt-4',
      'ACTIVE',
    ]
  );
}
