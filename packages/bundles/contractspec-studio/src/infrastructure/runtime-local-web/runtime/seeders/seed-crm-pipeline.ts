import type { LocalDatabase } from '../../database/sqlite-wasm';

export async function seedCrmPipeline(params: {
  projectId: string;
  db: LocalDatabase;
}): Promise<void> {
  const { projectId, db } = params;
  const existing = await db.exec(
    `SELECT COUNT(*) as count FROM crm_pipeline WHERE projectId = ?`,
    [projectId]
  );
  if ((existing[0]?.count as number) > 0) return;

  const pipelineId = 'crm_pipeline_1';
  await db.run(`INSERT INTO crm_pipeline (id, projectId, name) VALUES (?, ?, ?)`, [
    pipelineId,
    projectId,
    'Sales Pipeline',
  ]);

  const stages = [
    { id: 'crm_stage_1', name: 'Lead', position: 1 },
    { id: 'crm_stage_2', name: 'Qualified', position: 2 },
    { id: 'crm_stage_3', name: 'Proposal', position: 3 },
    { id: 'crm_stage_4', name: 'Negotiation', position: 4 },
    { id: 'crm_stage_5', name: 'Closed', position: 5 },
  ] as const;

  for (const stage of stages) {
    await db.run(
      `INSERT INTO crm_stage (id, pipelineId, name, position) VALUES (?, ?, ?, ?)`,
      [stage.id, pipelineId, stage.name, stage.position]
    );
  }

  const deals = [
    {
      id: 'crm_deal_1',
      name: 'Enterprise License - Acme Corp',
      value: 75000,
      stageId: 'crm_stage_3',
      status: 'OPEN',
    },
    {
      id: 'crm_deal_2',
      name: 'Startup Plan - TechStart Inc',
      value: 12000,
      stageId: 'crm_stage_2',
      status: 'OPEN',
    },
    {
      id: 'crm_deal_3',
      name: 'Professional Services - Global Ltd',
      value: 45000,
      stageId: 'crm_stage_4',
      status: 'OPEN',
    },
    {
      id: 'crm_deal_4',
      name: 'Annual Contract - SmallBiz Co',
      value: 8500,
      stageId: 'crm_stage_1',
      status: 'OPEN',
    },
    {
      id: 'crm_deal_5',
      name: 'Custom Integration - MegaCorp',
      value: 125000,
      stageId: 'crm_stage_5',
      status: 'WON',
    },
    {
      id: 'crm_deal_6',
      name: 'Pilot Project - NewCo',
      value: 5000,
      stageId: 'crm_stage_2',
      status: 'LOST',
    },
  ] as const;

  for (const deal of deals) {
    await db.run(
      `INSERT INTO crm_deal (id, projectId, pipelineId, stageId, name, value, currency, status, ownerId)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        deal.id,
        projectId,
        pipelineId,
        deal.stageId,
        deal.name,
        deal.value,
        'USD',
        deal.status,
        'user-1',
      ]
    );
  }
}







