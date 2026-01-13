import type { DatabasePort } from '@contractspec/lib.runtime-sandbox';

export async function seedPolicyKnowledgeAssistant(params: {
  projectId: string;
  db: DatabasePort;
}) {
  const { projectId, db } = params;

  const existing = await db.query(
    `SELECT COUNT(*) as count FROM psa_user_context WHERE "projectId" = $1`,
    [projectId]
  );
  if ((existing.rows[0]?.count as number) > 0) return;

  await db.execute(
    `INSERT INTO psa_user_context ("projectId", locale, jurisdiction, "allowedScope")
     VALUES ($1, $2, $3, $4)`,
    [projectId, 'en-GB', 'EU', 'education_only']
  );
}
