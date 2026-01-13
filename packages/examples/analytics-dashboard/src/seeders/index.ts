import type { DatabasePort } from '@contractspec/lib.runtime-sandbox';

export async function seedAnalyticsDashboard(params: {
  projectId: string;
  db: DatabasePort;
}) {
  const { projectId, db } = params;

  const existing = await db.query(
    `SELECT COUNT(*) as count FROM analytics_dashboard WHERE "projectId" = $1`,
    [projectId]
  );
  if ((existing.rows[0]?.count as number) > 0) return;

  await db.execute(
    `INSERT INTO analytics_dashboard (id, "projectId", "organizationId", name, slug, description, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      'dash_1',
      projectId,
      'org_demo',
      'Sales Overview',
      'sales-overview',
      'Sales performance dashboard',
      'PUBLISHED',
    ]
  );
}
