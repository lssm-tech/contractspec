import type { DocBlock } from '@lssm/lib.contracts/docs';
import { registerDocBlocks } from '@lssm/lib.contracts/docs';

const integrationHubDocBlocks: DocBlock[] = [
  {
    id: 'docs.examples.integration-hub',
    title: 'Integration Hub',
    summary:
      'Generic integration center with connectors, connections, sync configs, field mappings, and sync logs.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/examples/integration-hub',
    tags: ['integrations', 'sync', 'etl', 'connectors'],
    body: `## Entities

- Integration, Connection, SyncConfig, FieldMapping, SyncLog.
- Sync engine config lives in \`src/sync-engine\` to map remote <-> local entities.

## Contracts

- \`integration.create\`, \`integration.connect\`, \`integration.configureSync\`, \`integration.mapFields\`, \`integration.runSync\`.
- Uses Jobs module for scheduled syncs and retries; Files module for payload archives.

## Events

- sync.started/completed/failed, connection.connected/disconnected, mapping.updated.
- Forward to Notifications and Audit for observability.

## UI / Presentations

- Dashboard, integration list, connection detail, sync config editor.
- Templates registered as \`integration-hub\` in Template Registry.

## Notes

- Providers remain agnostic; keep mappings declarative for safe regeneration.
- Feature flags can gate specific providers; metering can track sync volume.
`,
  },
];

registerDocBlocks(integrationHubDocBlocks);
