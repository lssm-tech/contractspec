import type { LocalDatabase } from '../../database/sqlite-wasm';
import { SEED_TIME_ISO } from './seed-constants';

export async function seedIntegrationHub(params: {
  projectId: string;
  db: LocalDatabase;
}): Promise<void> {
  const { projectId, db } = params;
  const existing = await db.exec(
    `SELECT COUNT(*) as count FROM integration WHERE projectId = ?`,
    [projectId]
  );
  if ((existing[0]?.count as number) > 0) return;

  const organizationId = 'ih_org_1';

  const integrations = [
    { id: 'ih_integ_1', name: 'Salesforce', type: 'CRM', status: 'ACTIVE', iconUrl: '/icons/salesforce.svg' },
    { id: 'ih_integ_2', name: 'HubSpot', type: 'MARKETING', status: 'ACTIVE', iconUrl: '/icons/hubspot.svg' },
    { id: 'ih_integ_3', name: 'Stripe', type: 'PAYMENT', status: 'ACTIVE', iconUrl: '/icons/stripe.svg' },
    { id: 'ih_integ_4', name: 'Slack', type: 'COMMUNICATION', status: 'INACTIVE', iconUrl: '/icons/slack.svg' },
    { id: 'ih_integ_5', name: 'Custom API', type: 'CUSTOM', status: 'INACTIVE', iconUrl: null },
  ] as const;

  for (const integration of integrations) {
    await db.run(
      `INSERT INTO integration (id, projectId, organizationId, name, type, status, iconUrl)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        integration.id,
        projectId,
        organizationId,
        integration.name,
        integration.type,
        integration.status,
        integration.iconUrl,
      ]
    );
  }

  const connections = [
    {
      id: 'ih_conn_1',
      integrationId: 'ih_integ_1',
      name: 'Salesforce Production',
      status: 'CONNECTED',
      lastSyncAt: SEED_TIME_ISO,
    },
    {
      id: 'ih_conn_2',
      integrationId: 'ih_integ_2',
      name: 'HubSpot Production',
      status: 'CONNECTED',
      lastSyncAt: SEED_TIME_ISO,
    },
    {
      id: 'ih_conn_3',
      integrationId: 'ih_integ_3',
      name: 'Stripe Production',
      status: 'CONNECTED',
      lastSyncAt: SEED_TIME_ISO,
    },
  ] as const;

  for (const connection of connections) {
    await db.run(
      `INSERT INTO integration_connection (id, integrationId, name, status, lastSyncAt)
       VALUES (?, ?, ?, ?, ?)`,
      [
        connection.id,
        connection.integrationId,
        connection.name,
        connection.status,
        connection.lastSyncAt,
      ]
    );
  }

  const syncConfigs = [
    {
      id: 'ih_sync_1',
      connectionId: 'ih_conn_1',
      name: 'Contact Sync',
      sourceEntity: 'contacts',
      targetEntity: 'crm_contacts',
      frequency: 'HOURLY',
      status: 'ACTIVE',
      recordsSynced: 4200,
    },
    {
      id: 'ih_sync_2',
      connectionId: 'ih_conn_1',
      name: 'Deal Sync',
      sourceEntity: 'opportunities',
      targetEntity: 'crm_deals',
      frequency: 'REALTIME',
      status: 'ACTIVE',
      recordsSynced: 980,
    },
  ] as const;

  for (const sync of syncConfigs) {
    await db.run(
      `INSERT INTO integration_sync_config (id, connectionId, name, sourceEntity, targetEntity, frequency, status, recordsSynced)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        sync.id,
        sync.connectionId,
        sync.name,
        sync.sourceEntity,
        sync.targetEntity,
        sync.frequency,
        sync.status,
        sync.recordsSynced,
      ]
    );
  }

  const mappings = [
    { id: 'ih_map_1', syncConfigId: 'ih_sync_1', sourceField: 'id', targetField: 'external_id' },
    { id: 'ih_map_2', syncConfigId: 'ih_sync_1', sourceField: 'name', targetField: 'name' },
    { id: 'ih_map_3', syncConfigId: 'ih_sync_1', sourceField: 'email', targetField: 'email_address' },
  ] as const;

  for (const map of mappings) {
    await db.run(
      `INSERT INTO integration_field_mapping (id, syncConfigId, sourceField, targetField)
       VALUES (?, ?, ?, ?)`,
      [map.id, map.syncConfigId, map.sourceField, map.targetField]
    );
  }
}









