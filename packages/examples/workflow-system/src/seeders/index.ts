import type { DatabasePort } from '@contractspec/lib.runtime-sandbox';

export async function seedWorkflowSystem(params: {
  projectId: string;
  db: DatabasePort;
}) {
  const { projectId, db } = params;

  const existing = await db.query(
    `SELECT COUNT(*) as count FROM workflow_definition WHERE "projectId" = $1`,
    [projectId]
  );
  if ((existing.rows[0]?.count as number) > 0) return;

  await db.execute(
    `INSERT INTO workflow_definition (id, "projectId", "organizationId", name, description, type, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      'wf_1',
      projectId,
      'org_demo',
      'Approval Workflow',
      'Demo approval workflow',
      'APPROVAL',
      'ACTIVE',
    ]
  );
}
