import type { DocBlock } from '@contractspec/lib.contracts-spec/docs';
import { registerDocBlocks } from '../registry';

export const tech_telemetry_ingest_DocBlocks: DocBlock[] = [
  {
    id: 'docs.tech.telemetry.ingest',
    title: 'Telemetry Ingest Endpoint',
    summary:
      'Server-side telemetry ingestion for ContractSpec clients (VS Code extension, CLI, etc.).',
    kind: 'reference',
    visibility: 'internal',
    route: '/docs/tech/telemetry/ingest',
    tags: ['telemetry', 'api', 'posthog', 'analytics'],
    body: `# Telemetry Ingest Endpoint

The ContractSpec API provides a telemetry ingest endpoint for clients to send product analytics events.

## Endpoint

\`\`\`
POST /api/telemetry/ingest
\`\`\`

## Request

\`\`\`json
{
  "event": "contractspec.vscode.command_run",
  "distinct_id": "client-uuid",
  "properties": {
    "command": "validate"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
\`\`\`

### Headers

| Header | Description |
|--------|-------------|
| \`x-contractspec-client-id\` | Optional client identifier (used as fallback for distinct_id) |
| \`Content-Type\` | Must be \`application/json\` |

### Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| \`event\` | string | Yes | Event name (e.g., \`contractspec.vscode.activated\`) |
| \`distinct_id\` | string | Yes | Anonymous client identifier |
| \`properties\` | object | No | Event properties |
| \`timestamp\` | string | No | ISO 8601 timestamp |

## Response

\`\`\`json
{
  "success": true
}
\`\`\`

## Configuration

The endpoint requires \`POSTHOG_PROJECT_KEY\` environment variable to be set. If not configured, events are accepted but not forwarded.

| Environment Variable | Description | Default |
|---------------------|-------------|---------|
| \`POSTHOG_HOST\` | PostHog host URL | \`https://eu.posthog.com\` |
| \`POSTHOG_PROJECT_KEY\` | PostHog project API key | (required) |

## Privacy

- No PII is collected or stored
- \`distinct_id\` is an anonymous client-generated UUID
- File paths and source code are never included in events
- Respects VS Code telemetry settings on the client side

## Events

### OSS Adoption Funnel

| Event | Description | Properties |
|-------|-------------|------------|
| \`cta_install_click\` | Clicked Install OSS CTA | \`surface\` |
| \`cta_studio_click\` | Clicked Studio waitlist CTA | \`surface\`, \`variant\` |
| \`docs_quickstart_view\` | Entered quickstart docs path | \`surface\`, \`destination\` |
| \`copy_command_click\` | Copied a command block | \`surface\`, \`language\`, \`filename\`, \`packageManager\` |
| \`example_repo_open\` | Selected a template/example | \`surface\`, \`templateId\`, \`source\` |

### Extension Events

| Event | Description | Properties |
|-------|-------------|------------|
| \`contractspec.vscode.activated\` | Extension activated | \`version\` |
| \`contractspec.vscode.command_run\` | Command executed | \`command\` |
| \`contractspec.vscode.mcp_call\` | MCP call made | \`endpoint\`, \`tool\` |

### API Events

| Event | Description | Properties |
|-------|-------------|------------|
| \`contractspec.api.mcp_request\` | MCP request processed | \`endpoint\`, \`method\`, \`success\`, \`duration_ms\` |
`,
  },
  {
    id: 'docs.tech.telemetry.hybrid',
    title: 'Hybrid Telemetry Model',
    summary:
      'How ContractSpec clients choose between direct PostHog and API-routed telemetry.',
    kind: 'usage',
    visibility: 'internal',
    route: '/docs/tech/telemetry/hybrid',
    tags: ['telemetry', 'architecture', 'posthog'],
    body: `# Hybrid Telemetry Model

ContractSpec uses a hybrid telemetry model where clients can send events either directly to PostHog or via the API server.

## Decision Flow

\`\`\`
Is contractspec.api.baseUrl configured?
├── Yes → Send via /api/telemetry/ingest
└── No → Is posthogProjectKey configured?
    ├── Yes → Send directly to PostHog
    └── No → Telemetry disabled
\`\`\`

## Benefits

### Direct PostHog
- No server dependency
- Works offline (with batching)
- Lower latency

### Via API
- Centralized key management (no client-side keys)
- Server-side enrichment and validation
- Rate limiting and abuse prevention
- Easier migration to other providers

## Recommendation

- **Development**: Use direct PostHog with a dev project key
- **Production**: Route via API for better governance

## Future: OpenTelemetry

The current PostHog implementation is behind a simple interface that can be swapped for OpenTelemetry:

\`\`\`typescript
interface TelemetryClient {
  send(event: TelemetryEvent): Promise<void>;
}
\`\`\`

This allows future migration without changing client code.
`,
  },
];

registerDocBlocks(tech_telemetry_ingest_DocBlocks);
