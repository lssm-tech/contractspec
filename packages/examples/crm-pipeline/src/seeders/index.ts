import type { DatabasePort } from '@contractspec/lib.runtime-sandbox';

export async function seedCrmPipeline(params: {
  projectId: string;
  db: DatabasePort;
}) {
  const { projectId, db } = params;

  const existing = await db.query(
    `SELECT COUNT(*) as count FROM crm_pipeline WHERE "projectId" = $1`,
    [projectId]
  );
  if ((existing.rows[0]?.count as number) > 0) return;

  const pipelineId = 'pipeline_sales';
  await db.execute(
    `INSERT INTO crm_pipeline (id, "projectId", name) VALUES ($1, $2, $3)`,
    [pipelineId, projectId, 'Sales Pipeline']
  );

  const stages = [
    { id: 'stage_lead', name: 'Lead', position: 1 },
    { id: 'stage_contact', name: 'Contact Made', position: 2 },
    { id: 'stage_proposal', name: 'Proposal', position: 3 },
    { id: 'stage_negotiation', name: 'Negotiation', position: 4 },
    { id: 'stage_closed', name: 'Closed', position: 5 },
  ];

  for (const stage of stages) {
    await db.execute(
      `INSERT INTO crm_stage (id, "pipelineId", name, position) VALUES ($1, $2, $3, $4)`,
      [stage.id, pipelineId, stage.name, stage.position]
    );
  }
}
