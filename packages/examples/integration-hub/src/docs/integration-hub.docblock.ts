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
  {
    id: 'docs.examples.integration-hub.goal',
    title: 'Integration Hub — Goal',
    summary: 'Why this integration hub exists and what success looks like.',
    kind: 'goal',
    visibility: 'public',
    route: '/docs/examples/integration-hub/goal',
    tags: ['integrations', 'goal'],
    body: `## Why it matters
- Gives a regenerable, provider-agnostic integration hub with explicit mappings.
- Prevents drift between sync configs, mappings, and event/log outputs.

## Business/Product goal
- Model connectors, connections, sync jobs, and mappings with governance and retries.
- Support staged provider rollouts via Feature Flags and observability via Audit/Notifications.

## Success criteria
- Connections and mappings regenerate safely after spec edits.
- Sync events and logs provide auditability; payloads are stored and PII-scoped.`,
  },
  {
    id: 'docs.examples.integration-hub.usage',
    title: 'Integration Hub — Usage',
    summary: 'How to configure connectors, mappings, and scheduled syncs.',
    kind: 'usage',
    visibility: 'public',
    route: '/docs/examples/integration-hub/usage',
    tags: ['integrations', 'usage'],
    body: `## Setup
1) Seed integrations/connections (if available) or create connector definitions.
2) Configure sync jobs with Jobs module; store payload archives via Files.

## Extend & regenerate
1) Add mapping fields or provider configs in the spec; include validation and PII paths.
2) Regenerate to align UI/API/events/logs; verify Notifications/Audit hooks.
3) Gate risky providers behind Feature Flags; meter sync volume if needed.

## Guardrails
- Keep mappings declarative; avoid hardcoded transforms.
- Emit events for sync lifecycle; persist logs for audit.
- Redact sensitive payload paths in presentations.`,
  },
];

registerDocBlocks(integrationHubDocBlocks);
