import type { DatabasePort } from '@contractspec/lib.runtime-sandbox';

export async function seedIntegrationHub(params: {
  projectId: string;
  db: DatabasePort;
}) {
  const { projectId, db } = params;

  const existing = await db.query(
    `SELECT COUNT(*) as count FROM integration WHERE "projectId" = $1`,
    [projectId]
  );
  if ((existing.rows[0]?.count as number) > 0) return;

  await db.execute(
    `INSERT INTO integration (id, "projectId", "organizationId", name, description, type, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      'int_1',
      projectId,
      'org_demo',
      'Salesforce',
      'Salesforce CRM integration',
      'CRM',
      'ACTIVE',
    ]
  );

  await db.execute(
    `INSERT INTO integration (id, "projectId", "organizationId", name, description, type, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      'int_2',
      projectId,
      'org_demo',
      'Meeting Recorder',
      'Meeting recorder transcripts and metadata',
      'DATA',
      'ACTIVE',
    ]
  );

  await db.execute(
    `INSERT INTO integration (id, "projectId", "organizationId", name, description, type, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      'int_3',
      projectId,
      'org_demo',
      'Gradium Voice',
      'Gradium low-latency text-to-speech integration',
      'COMMUNICATION',
      'ACTIVE',
    ]
  );

  await db.execute(
    `INSERT INTO integration (id, "projectId", "organizationId", name, description, type, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      'int_4',
      projectId,
      'org_demo',
      'Fal Chatterbox Voice',
      'Fal Chatterbox text-to-speech integration',
      'COMMUNICATION',
      'ACTIVE',
    ]
  );

  await db.execute(
    `INSERT INTO integration (id, "projectId", "organizationId", name, description, type, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      'int_5',
      projectId,
      'org_demo',
      'PostHog Analytics',
      'Product analytics and event capture',
      'ANALYTICS',
      'ACTIVE',
    ]
  );
}
