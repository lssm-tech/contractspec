import type { DatabasePort } from '@contractspec/lib.runtime-sandbox';

export async function seedSaasBoilerplate(params: {
  projectId: string;
  db: DatabasePort;
}) {
  const { projectId, db } = params;

  const existing = await db.query(
    `SELECT COUNT(*) as count FROM saas_project WHERE "projectId" = $1`,
    [projectId]
  );
  if ((existing.rows[0]?.count as number) > 0) return;

  await db.execute(
    `INSERT INTO saas_project (id, "projectId", "organizationId", name, description, status, tier)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      'saas_proj_1',
      projectId,
      'org_demo',
      'Demo Project',
      'A demo SaaS project',
      'ACTIVE',
      'PRO',
    ]
  );
}
