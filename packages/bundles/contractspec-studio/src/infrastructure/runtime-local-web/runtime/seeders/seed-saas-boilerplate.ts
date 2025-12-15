import type { LocalDatabase } from '../../database/sqlite-wasm';
import { SEED_TIME_ISO, SEED_TIME_PLUS_30D_ISO } from './seed-constants';

export async function seedSaasBoilerplate(params: {
  projectId: string;
  db: LocalDatabase;
}): Promise<void> {
  const { projectId, db } = params;
  const existing = await db.exec(
    `SELECT COUNT(*) as count FROM saas_project WHERE projectId = ?`,
    [projectId]
  );
  if ((existing[0]?.count as number) > 0) return;

  const organizationId = 'saas_org_1';

  await db.run(
    `INSERT INTO saas_subscription (id, projectId, organizationId, plan, status, billingCycle, currentPeriodStart, currentPeriodEnd)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      'saas_sub_1',
      projectId,
      organizationId,
      'PRO',
      'ACTIVE',
      'MONTHLY',
      SEED_TIME_ISO,
      SEED_TIME_PLUS_30D_ISO,
    ]
  );

  const projects = [
    {
      id: 'saas_proj_1',
      name: 'Marketing Website',
      description: 'Company marketing site',
      status: 'ACTIVE',
      tier: 'PRO',
    },
    {
      id: 'saas_proj_2',
      name: 'Internal Dashboard',
      description: 'Analytics and metrics',
      status: 'ACTIVE',
      tier: 'FREE',
    },
    {
      id: 'saas_proj_3',
      name: 'Mobile App MVP',
      description: 'iOS/Android prototype',
      status: 'DRAFT',
      tier: 'FREE',
    },
  ] as const;

  for (const project of projects) {
    await db.run(
      `INSERT INTO saas_project (id, projectId, organizationId, name, description, status, tier)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        project.id,
        projectId,
        organizationId,
        project.name,
        project.description,
        project.status,
        project.tier,
      ]
    );
  }
}



