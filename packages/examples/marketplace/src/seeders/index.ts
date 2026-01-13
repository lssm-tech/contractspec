import type { DatabasePort } from '@contractspec/lib.runtime-sandbox';

export async function seedMarketplace(params: {
  projectId: string;
  db: DatabasePort;
}) {
  const { projectId, db } = params;

  const existing = await db.query(
    `SELECT COUNT(*) as count FROM marketplace_store WHERE "projectId" = $1`,
    [projectId]
  );
  if ((existing.rows[0]?.count as number) > 0) return;

  await db.execute(
    `INSERT INTO marketplace_store (id, "projectId", "organizationId", name, description, status)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    ['store_1', projectId, 'org_demo', 'Demo Store', 'A demo store', 'ACTIVE']
  );
}
