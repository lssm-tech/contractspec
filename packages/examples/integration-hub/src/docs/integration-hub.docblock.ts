import type { DocBlock } from '@contractspec/lib.contracts/docs';
import { registerDocBlocks } from '@contractspec/lib.contracts/docs';

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
- Seed data includes voice integrations for \`ai-voice.gradium\` and \`ai-voice.fal\`.
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
  {
    id: 'docs.examples.integration-hub.constraints',
    title: 'Integration Hub — Constraints & Safety',
    summary:
      'Internal guidance for sync lifecycle, mappings, and regeneration safety.',
    kind: 'reference',
    visibility: 'internal',
    route: '/docs/examples/integration-hub/constraints',
    tags: ['integrations', 'constraints', 'internal'],
    body: `## Constraints
- Mappings and sync states must remain declarative in spec; no hidden code transforms.
- Events to emit at minimum: sync.started, sync.completed, sync.failed; connection.connected/disconnected.
- Regeneration should not alter retry/backoff semantics without explicit spec change.

## PII & Payloads
- Treat payload archives as potentially sensitive; mark policy.pii paths.
- For MCP/web, avoid exposing raw credentials/tokens; store via provider adapters only.

## Verification
- Include fixtures for mapping changes and sync retries.
- Validate that scheduled jobs (cron) are spec-driven; Jobs module wiring intact.
- Ensure Audit/Notifications receive sync lifecycle events.`,
  },
];

registerDocBlocks(integrationHubDocBlocks);
