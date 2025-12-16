import type { LocalDatabase } from '../../database/sqlite-wasm';
import { SEED_TIME_ISO } from './seed-constants';

export async function seedPolicySafeKnowledgeAssistant(params: {
  projectId: string;
  db: LocalDatabase;
}): Promise<void> {
  const { projectId, db } = params;
  const existing = await db.exec(
    `SELECT projectId FROM psa_user_context WHERE projectId = ? LIMIT 1`,
    [projectId]
  );
  if (existing.length) return;

  const ruleId = 'psa_rule_eu_tax';
  const rvId = 'psa_rv_eu_tax_v1';
  const snapshotId = 'psa_snap_eu_2026_01_01';

  await db.run(
    `INSERT INTO psa_user_context (projectId, locale, jurisdiction, allowedScope, kbSnapshotId)
     VALUES (?, ?, ?, ?, ?)`,
    [projectId, 'en-GB', 'EU', 'education_only', snapshotId]
  );

  await db.run(
    `INSERT INTO psa_rule (id, projectId, jurisdiction, topicKey) VALUES (?, ?, ?, ?)`,
    [ruleId, projectId, 'EU', 'tax_reporting']
  );

  await db.run(
    `INSERT INTO psa_rule_version (id, ruleId, jurisdiction, topicKey, version, content, status, sourceRefsJson, approvedBy, approvedAt, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      rvId,
      ruleId,
      'EU',
      'tax_reporting',
      1,
      'EU: Reporting obligations v1 (seeded)',
      'approved',
      JSON.stringify([
        { sourceDocumentId: 'src_eu_seed_v1', excerpt: 'seeded excerpt' },
      ]),
      'seed_expert',
      SEED_TIME_ISO,
      SEED_TIME_ISO,
    ]
  );

  await db.run(
    `INSERT INTO psa_snapshot (id, jurisdiction, asOfDate, includedRuleVersionIdsJson, publishedAt)
     VALUES (?, ?, ?, ?, ?)`,
    [snapshotId, 'EU', SEED_TIME_ISO, JSON.stringify([rvId]), SEED_TIME_ISO]
  );
}






